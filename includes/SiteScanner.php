<?php
namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dashboard → Settings → Site Scanner.
 *
 * Runs cheap, local checks (no requests to outside services) for what most often makes a site slow,
 * invisible to search engines, insecure or inconsistent, scores them and explains each one. Answers the
 * `bblocks_site_scan` AJAX action used by src/admin/Dashboard/Pages/Settings/SiteScanner/SiteScanner.js.
 *
 * Options: `bBlocksSiteScan` (last result: time, checks, and a fingerprint of the Performance settings, page-cache and object-cache state and check texts it saw) and `bBlocksSiteScanIgnored` (ignored ids),
 * both not autoloaded. bBlocks Performance settings are only ever changed through BBlocksPerformance::enable().
 */
class BBlocksSiteScanner {

	const RESULT  = 'bBlocksSiteScan';
	const IGNORED = 'bBlocksSiteScanIgnored';

	/** One-click fixes: check id → [ group, key ] of a bBlocks Performance toggle. Nothing else can be switched. */
	const FIXES = [
		'full_page_cache'  => [ 'caching', 'fullPage' ],
		'inline_css_files' => [ 'caching', 'inlineCssFiles' ],
		'asset_files'      => [ 'assets', 'assetFiles' ],
		'defer_scripts'    => [ 'assets', 'deferScripts' ],
		'combine_css'      => [ 'assets', 'combineCss' ],
		'lazy_load'        => [ 'images', 'lazyLoad' ],
		'image_dimensions' => [ 'images', 'dimensions' ],
		'webp'             => [ 'images', 'webp' ],
	];

	public function __construct() {
		add_action( 'wp_ajax_bblocks_site_scan', [ $this, 'ajax' ] );
	}

	/**
	 * POST bblocks_site_scan { _wpnonce, do: get|scan|fix|ignore|restore, id? }.
	 * Always answers with { score, grade, scannedAgo, counts, categories, checks }.
	 */
	public function ajax() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? '' ) );
		if ( ! wp_verify_nonce( $nonce, 'wp_ajax' ) ) {
			wp_send_json_error( [ 'message' => __( 'Invalid Request', 'b-blocks' ) ] );
		}
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized', 'b-blocks' ) ] );
		}

		$do = sanitize_key( wp_unslash( $_POST['do'] ?? 'get' ) );
		$id = sanitize_key( wp_unslash( $_POST['id'] ?? '' ) );

		// A fix is checked before anything is read or written, and scans once — after the change.
		if ( 'fix' === $do ) {
			if ( ! isset( self::FIXES[ $id ] ) ) {
				wp_send_json_error( [ 'message' => __( 'This finding cannot be fixed automatically.', 'b-blocks' ) ] );
			}
			// A tab still showing an older scan may offer this while another page cache runs; it would be inactive.
			if ( 'full_page_cache' === $id && '' !== BBlocksPerformance::page_cache_conflict() ) {
				/* translators: %s: name of the other caching plugin. */
				wp_send_json_error( [ 'message' => sprintf( __( '%s already caches pages on this site, so bBlocks leaves page caching to it.', 'b-blocks' ), BBlocksPerformance::page_cache_conflict() ) ] );
			}
			if ( ! BBlocksPerformance::enable( self::FIXES[ $id ][0], self::FIXES[ $id ][1] ) ) {
				wp_send_json_error( [ 'message' => __( 'The setting could not be changed. Try it under Performance instead.', 'b-blocks' ) ] );
			}
			$scan = $this->scan();
		} else {
			$scan = get_option( self::RESULT );
			// Rescan when anything the Performance checks show has changed since: the settings (saved on the Performance tab),
			// another page cache or an object cache coming or going, or the checks' own text (an update, another admin language).
			if ( 'scan' === $do || ! is_array( $scan ) || empty( $scan['checks'] ) || ( $scan['performance'] ?? '' ) !== md5( wp_json_encode( [ BBlocksPerformance::settings(), BBlocksPerformance::page_cache_conflict(), (bool) wp_using_ext_object_cache(), $this->checks() ] ) ) ) {
				$scan = $this->scan();
			}
		}

		if ( 'ignore' === $do || 'restore' === $do ) {
			if ( ! in_array( $id, wp_list_pluck( $scan['checks'], 'id' ), true ) ) {
				wp_send_json_error( [ 'message' => __( 'Unknown finding.', 'b-blocks' ) ] );
			}
			$ignored = array_values( array_diff( (array) get_option( self::IGNORED, [] ), [ $id ] ) );
			if ( 'ignore' === $do ) {
				$ignored[] = $id;
			}
			update_option( self::IGNORED, $ignored, false );
		}

		wp_send_json_success( $this->result( $scan ) );
	}

	/** Runs every check and stores the outcome. Strings are stored too, so `get` needs no re-run. */
	private function scan() {
		$checks = [];
		foreach ( (array) apply_filters( 'b_blocks_site_scan_checks', $this->checks() ) as $id => $check ) {
			if ( ! is_array( $check ) || empty( $check['run'] ) || ! is_callable( $check['run'] ) ) {
				continue;
			}
			$run = (array) call_user_func( $check['run'] );
			unset( $check['run'] );
			// A check added through the filter may leave fields out or give odd types. It is stored, so one bad check would break every later request.
			$check             = array_merge( [ 'category' => 'server', 'severity' => 'info', 'title' => '', 'state' => '', 'why' => '', 'fix' => '', 'action' => null ], $check, $run, [ 'id' => sanitize_key( $id ), 'passed' => ! empty( $run['passed'] ) ] );
			$check['severity'] = in_array( $check['severity'], [ 'critical', 'warning', 'info' ], true ) ? $check['severity'] : 'info';
			$check['category'] = sanitize_key( is_string( $check['category'] ) ? $check['category'] : '' ) ?: 'server';
			foreach ( [ 'title', 'state', 'why', 'fix' ] as $field ) {
				$check[ $field ] = is_scalar( $check[ $field ] ) ? (string) $check[ $field ] : '';
			}
			$checks[] = $check;
		}

		$scan = [
			'time'        => time(),
			'checks'      => $checks,
			'performance' => md5( wp_json_encode( [ BBlocksPerformance::settings(), BBlocksPerformance::page_cache_conflict(), (bool) wp_using_ext_object_cache(), $this->checks() ] ) ),
		];
		update_option( self::RESULT, $scan, false );
		return $scan;
	}

	/** Scores, counts and order, worked out from a stored scan plus the ignored list. */
	private function result( $scan ) {
		$ignored = (array) get_option( self::IGNORED, [] );
		$weights = [
			'critical' => 3,
			'warning'  => 2,
			'info'     => 1,
		];
		$labels  = [
			'search'  => __( 'Search & accessibility', 'b-blocks' ),
			'server'  => __( 'Server & WordPress', 'b-blocks' ),
			'caching' => __( 'Caching', 'b-blocks' ),
			'images'  => __( 'Images', 'b-blocks' ),
			'assets'  => __( 'Assets', 'b-blocks' ),
		];
		// Most severe first; within a severity, in the order the Performance screen lists its tabs.
		$severity = array_flip( [ 'critical', 'warning', 'info' ] );
		$category = array_flip( [ 'caching', 'images', 'assets', 'search', 'server' ] );

		$checks = [];
		foreach ( $scan['checks'] as $check ) {
			$check['ignored'] = in_array( $check['id'], $ignored, true );
			$checks[]         = $check;
		}
		usort( $checks, function ( $a, $b ) use ( $severity, $category ) {
			return [ $severity[ $a['severity'] ] ?? 3, $category[ $a['category'] ] ?? 9 ] <=> [ $severity[ $b['severity'] ] ?? 3, $category[ $b['category'] ] ?? 9 ];
		} );

		// [ passed weight, total weight ] overall and per category; ignored checks leave both.
		$sums   = [ '' => [ 0, 0 ] ];
		$counts = [
			'toFix'   => 0,
			'passing' => 0,
			'ignored' => 0,
		];
		foreach ( $checks as $check ) {
			if ( $check['ignored'] ) {
				++$counts['ignored'];
				continue;
			}
			$check['passed'] ? ++$counts['passing'] : ++$counts['toFix'];
			$weight = $weights[ $check['severity'] ] ?? 1;
			foreach ( [ '', $check['category'] ] as $key ) {
				$sums[ $key ][0] = ( $sums[ $key ][0] ?? 0 ) + ( $check['passed'] ? $weight : 0 );
				$sums[ $key ][1] = ( $sums[ $key ][1] ?? 0 ) + $weight;
			}
		}

		$categories = [];
		foreach ( array_unique( array_merge( array_keys( $labels ), wp_list_pluck( $checks, 'category' ) ) ) as $key ) {
			if ( ! in_array( $key, wp_list_pluck( $checks, 'category' ), true ) ) {
				continue;
			}
			$categories[] = [
				'id'    => $key,
				'label' => $labels[ $key ] ?? ucfirst( $key ),
				'score' => empty( $sums[ $key ][1] ) ? 100 : (int) round( 100 * $sums[ $key ][0] / $sums[ $key ][1] ),
			];
		}

		$score = empty( $sums[''][1] ) ? 100 : (int) round( 100 * $sums[''][0] / $sums[''][1] );
		if ( $score >= 90 ) {
			$grade = 'A';
		} elseif ( $score >= 80 ) {
			$grade = 'B';
		} elseif ( $score >= 70 ) {
			$grade = 'C';
		} elseif ( $score >= 60 ) {
			$grade = 'D';
		} else {
			$grade = 'F';
		}

		return [
			'score'      => $score,
			'grade'      => $grade,
			/* translators: %s: time since the last scan, e.g. "3 mins". */
			'scannedAgo' => sprintf( __( '%s ago', 'b-blocks' ), human_time_diff( (int) $scan['time'] ) ),
			'counts'     => $counts,
			'categories' => $categories,
			'checks'     => $checks,
		];
	}

	/** Every check: plain data plus a `run` closure that returns [ passed, state ] (and optionally severity). */
	private function checks() {
		$perf    = BBlocksPerformance::settings();
		$enabled = __( 'Enabled', 'b-blocks' );
		$off     = __( 'Not enabled', 'b-blocks' );
		$turnOn  = [
			'type'  => 'enable',
			'label' => __( 'Turn This On', 'b-blocks' ),
		];
		$open    = __( 'Open the setting', 'b-blocks' );

		// The eight one-click checks share one evaluation: is that Performance toggle on?
		$toggle = function ( $id ) use ( $perf, $enabled, $off ) {
			return function () use ( $id, $perf, $enabled, $off ) {
				$on = ! empty( $perf[ self::FIXES[ $id ][0] ][ self::FIXES[ $id ][1] ] );
				return [ 'passed' => $on, 'state' => $on ? $enabled : $off ];
			};
		};

		$host  = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
		$local = 'localhost' === $host || '.local' === substr( $host, -6 );

		return [
			'full_page_cache'  => [
				'category' => 'caching',
				'severity' => 'warning',
				'title'    => __( 'Full-page cache', 'b-blocks' ),
				'why'      => __( 'Without it every visitor waits for WordPress to rebuild the page from scratch — loading plugins, parsing blocks and querying the database — even though the result is identical for everyone. This is usually the single biggest speed gain available to a site.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Full-page cache" under Performance → Caching.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => function () use ( $perf, $enabled, $off ) {
					$conflict = BBlocksPerformance::page_cache_conflict();
					if ( '' !== $conflict ) {
						/* translators: %s: name of the other caching plugin. */
						return [ 'passed' => true, 'state' => sprintf( __( 'Handled by %s', 'b-blocks' ), $conflict ) ];
					}
					return [ 'passed' => $perf['caching']['fullPage'], 'state' => $perf['caching']['fullPage'] ? $enabled : $off ];
				},
			],
			'inline_css_files' => [
				'category' => 'caching',
				'severity' => 'warning',
				'title'    => __( 'Inline CSS moved to cached files', 'b-blocks' ),
				'why'      => __( 'Block themes print tens of kilobytes of CSS straight into every page, and the browser cannot reuse any of it when the visitor opens the next page — it is downloaded again every time.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Move inline CSS into cached files" under Performance → Caching.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'inline_css_files' ),
			],
			'object_cache'     => [
				'category' => 'caching',
				'severity' => 'info',
				'title'    => __( 'Persistent object cache', 'b-blocks' ),
				'why'      => __( 'WordPress repeats the same database queries on every request unless something remembers them between requests. Without one, some optimizations are not worth enabling — "Cache template lookups" stays inactive, even when switched on, for exactly this reason, because storing lookups in the database costs more than it saves.', 'b-blocks' ),
				'fix'      => __( 'Ask your host whether Redis or Memcached is available; most managed WordPress hosts offer it as a one-click add-on. This is optional — the site works well without it.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () {
					$on = wp_using_ext_object_cache();
					return [ 'passed' => $on, 'state' => $on ? __( 'Active', 'b-blocks' ) : __( 'Not available (Redis or Memcached)', 'b-blocks' ) ];
				},
			],
			'asset_files'      => [
				'category' => 'assets',
				'severity' => 'warning',
				'title'    => __( 'Block CSS in cacheable files', 'b-blocks' ),
				'why'      => __( 'bBlocks blocks that build their CSS on the server print it inside the page, so it is downloaded again with every page view. Moving it into a file lets the browser keep it between visits to that page.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Enable asset file generation" under Performance → Assets. Best done once the site is built.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'asset_files' ),
			],
			'defer_scripts'    => [
				'category' => 'assets',
				'severity' => 'info',
				'title'    => __( 'Deferred JavaScript', 'b-blocks' ),
				'why'      => __( 'Scripts that load in the page head stop the browser drawing anything until they have downloaded and run. Deferring them lets the page appear first.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Defer non-critical scripts" under Performance → Assets.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'defer_scripts' ),
			],
			'combine_css'      => [
				'category' => 'assets',
				'severity' => 'info',
				'title'    => __( 'Combined block CSS', 'b-blocks' ),
				'why'      => __( 'WordPress prints only a limited amount of block CSS straight into the page; every other block stylesheet is a separate request before the page can finish rendering. A higher budget prints more of them into the page.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Combine & inline block CSS" under Performance → Assets.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'combine_css' ),
			],
			'lazy_load'        => [
				'category' => 'images',
				'severity' => 'warning',
				'title'    => __( 'Lazy-loaded images', 'b-blocks' ),
				'why'      => __( 'Without it, images in bBlocks blocks are all downloaded as soon as the page opens, including ones far down the page that the visitor may never scroll to. On phones that noticeably slows the first screen.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Lazy-load images" under Performance → Images.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'lazy_load' ),
			],
			'image_dimensions' => [
				'category' => 'images',
				'severity' => 'warning',
				'title'    => __( 'Image dimensions', 'b-blocks' ),
				'why'      => __( 'Images without a width and height make the page jump as each one loads, pushing text away while the visitor is reading. Google counts that layout shift against the site.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Set image dimensions (reduce layout shift)" under Performance → Images.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'image_dimensions' ),
			],
			'webp'             => [
				'category' => 'images',
				'severity' => 'info',
				'title'    => __( 'WebP images', 'b-blocks' ),
				'why'      => __( 'A WebP copy of a JPEG or PNG is usually a quarter to a third smaller at the same quality, so pages with photos load faster, especially on mobile data.', 'b-blocks' ),
				'fix'      => __( 'Turn on "Also create WebP copies" under Performance → Images. Copies are made for images uploaded from then on; images already in the media library keep only their original. Browsers that cannot show WebP still get the original.', 'b-blocks' ),
				'action'   => $turnOn,
				'run'      => $toggle( 'webp' ),
			],
			'file_editor'      => [
				'category' => 'server',
				'severity' => 'warning',
				'title'    => __( 'Dashboard file editor', 'b-blocks' ),
				'why'      => __( 'If an administrator account is ever compromised, the built-in editor lets the attacker run any code they like by pasting it into a theme file. It is also an easy way to break a live site with a typo and no undo.', 'b-blocks' ),
				'fix'      => __( 'Add define( \'DISALLOW_FILE_EDIT\', true ); to wp-config.php. Edit files over SFTP or through version control instead.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () {
					$off = defined( 'DISALLOW_FILE_EDIT' ) && DISALLOW_FILE_EDIT;
					return [ 'passed' => $off, 'state' => $off ? __( 'Disabled', 'b-blocks' ) : __( 'Theme and plugin files can be edited from the dashboard', 'b-blocks' ) ];
				},
			],
			'php_version'      => [
				'category' => 'server',
				'severity' => 'warning',
				'title'    => __( 'PHP version', 'b-blocks' ),
				'why'      => __( 'Older PHP versions are slower, and once they are out of security support they no longer get fixes for known vulnerabilities. PHP 8.2 or newer is both faster and supported.', 'b-blocks' ),
				'fix'      => __( 'Ask your host to switch the site to PHP 8.2 or newer — most hosts offer it in their control panel — and check the site afterwards.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () {
					return [
						'passed'   => version_compare( PHP_VERSION, '8.2', '>=' ),
						'severity' => version_compare( PHP_VERSION, '8.0', '<' ) ? 'critical' : 'warning',
						/* translators: %s: PHP version number. */
						'state'    => sprintf( __( 'PHP %s', 'b-blocks' ), PHP_VERSION ),
					];
				},
			],
			'wp_up_to_date'    => [
				'category' => 'server',
				'severity' => 'warning',
				'title'    => __( 'WordPress version', 'b-blocks' ),
				'why'      => __( 'WordPress security releases are announced publicly, so a site that is not updated is an easy target for the exact problem that was just fixed. Updates also bring speed improvements.', 'b-blocks' ),
				'fix'      => __( 'Update WordPress from Dashboard → Updates. Take a backup first.', 'b-blocks' ),
				'action'   => [
					'type'  => 'link',
					'url'   => admin_url( 'update-core.php' ),
					'label' => $open,
				],
				'run'      => function () {
					require_once ABSPATH . 'wp-admin/includes/update.php';
					// Reads what WordPress last fetched (no request here).
					$offer = null;
					foreach ( (array) get_core_updates() as $update ) {
						if ( is_object( $update ) && 'upgrade' === ( $update->response ?? '' ) ) {
							$offer = $update;
							break;
						}
					}
					return [
						'passed' => null === $offer,
						'state'  => null === $offer
							/* translators: %s: WordPress version number. */
							? sprintf( __( 'WordPress %s is up to date', 'b-blocks' ), get_bloginfo( 'version' ) )
							/* translators: 1: available WordPress version, 2: installed version. */
							: sprintf( __( 'WordPress %1$s is available (this site runs %2$s)', 'b-blocks' ), $offer->current ?? '', get_bloginfo( 'version' ) ),
					];
				},
			],
			'debug_display'    => [
				'category' => 'server',
				'severity' => 'critical',
				'title'    => __( 'Error messages on the page', 'b-blocks' ),
				'why'      => __( 'With WP_DEBUG_DISPLAY on, every PHP warning is printed into the page for visitors to see. It breaks layouts and reveals file paths that help attackers.', 'b-blocks' ),
				'fix'      => __( 'Set define( \'WP_DEBUG_DISPLAY\', false ); in wp-config.php on live sites, and use WP_DEBUG_LOG to keep errors in a log file instead.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () {
					$hidden = ! ( defined( 'WP_DEBUG' ) && WP_DEBUG ) || ! ( defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY );
					return [ 'passed' => $hidden, 'state' => $hidden ? __( 'Hidden from visitors', 'b-blocks' ) : __( 'PHP errors are shown on the page', 'b-blocks' ) ];
				},
			],
			'https'            => [
				'category' => 'server',
				'severity' => 'critical',
				'title'    => __( 'HTTPS', 'b-blocks' ),
				'why'      => __( 'Without HTTPS, browsers mark the site "Not secure", logins and form entries travel unencrypted, and search engines rank it lower.', 'b-blocks' ),
				'fix'      => __( 'Ask your host for a free SSL certificate (most offer Let\'s Encrypt), then change both addresses under Settings → General to start with https://.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () use ( $local, $enabled, $off ) {
					if ( $local ) {
						return [ 'passed' => true, 'state' => __( 'Local site', 'b-blocks' ) ];
					}
					$on = 'https' === wp_parse_url( home_url(), PHP_URL_SCHEME ) && 'https' === wp_parse_url( site_url(), PHP_URL_SCHEME );
					return [ 'passed' => $on, 'state' => $on ? $enabled : $off ];
				},
			],
			'search_visible'   => [
				'category' => 'search',
				'severity' => 'critical',
				'title'    => __( 'Search engine visibility', 'b-blocks' ),
				'why'      => __( '"Discourage search engines from indexing this site" is ticked, so Google and others are asked to leave the whole site out of their results. It is often left on by accident when a site goes live.', 'b-blocks' ),
				'fix'      => __( 'Untick "Search engine visibility" under Settings → Reading.', 'b-blocks' ),
				'action'   => [
					'type'  => 'link',
					'url'   => admin_url( 'options-reading.php' ),
					'label' => $open,
				],
				'run'      => function () {
					$on = '1' === (string) get_option( 'blog_public' );
					return [ 'passed' => $on, 'state' => $on ? __( 'Visible to search engines', 'b-blocks' ) : __( 'Search engines are asked not to index this site', 'b-blocks' ) ];
				},
			],
			'permalinks'       => [
				'category' => 'search',
				'severity' => 'warning',
				'title'    => __( 'Readable permalinks', 'b-blocks' ),
				'why'      => __( 'Plain addresses such as ?p=123 tell visitors and search engines nothing about the page. An address with the page name in it is easier to share and reads better in search results.', 'b-blocks' ),
				'fix'      => __( 'Choose "Post name" under Settings → Permalinks.', 'b-blocks' ),
				'action'   => [
					'type'  => 'link',
					'url'   => admin_url( 'options-permalink.php' ),
					'label' => $open,
				],
				'run'      => function () {
					$on = '' !== (string) get_option( 'permalink_structure' );
					return [ 'passed' => $on, 'state' => $on ? __( 'Readable addresses', 'b-blocks' ) : __( 'Plain addresses such as ?p=123', 'b-blocks' ) ];
				},
			],
			'site_icon'        => [
				'category' => 'search',
				'severity' => 'info',
				'title'    => __( 'Site icon', 'b-blocks' ),
				'why'      => __( 'The site icon is the small image shown on browser tabs, bookmarks and phone home screens. Without one the site shows a blank page glyph, which looks unfinished next to other tabs.', 'b-blocks' ),
				'fix'      => __( 'Appearance → Customize → Site Identity, or Settings → General on newer themes. A square image of at least 512×512 works everywhere.', 'b-blocks' ),
				'action'   => [
					'type'  => 'link',
					'url'   => wp_is_block_theme() ? admin_url( 'options-general.php' ) : admin_url( 'customize.php?autofocus[section]=title_tagline' ),
					'label' => $open,
				],
				'run'      => function () {
					$on = has_site_icon();
					return [ 'passed' => $on, 'state' => $on ? __( 'Site icon set', 'b-blocks' ) : __( 'No site icon set', 'b-blocks' ) ];
				},
			],
			'tagline'          => [
				'category' => 'search',
				'severity' => 'info',
				'title'    => __( 'Site tagline', 'b-blocks' ),
				'why'      => __( 'Many themes and search results show the tagline next to the site name. Left empty or as the WordPress default, it either says nothing or looks unfinished.', 'b-blocks' ),
				'fix'      => __( 'Write a short description of the site under Settings → General → Tagline.', 'b-blocks' ),
				'action'   => [
					'type'  => 'link',
					'url'   => admin_url( 'options-general.php' ),
					'label' => $open,
				],
				'run'      => function () {
					$tagline = trim( (string) get_option( 'blogdescription' ) );
					// phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- WordPress's own default tagline, in its own text domain.
					$default = in_array( $tagline, [ 'Just another WordPress site', __( 'Just another WordPress site' ) ], true );
					if ( '' === $tagline || $default ) {
						return [ 'passed' => false, 'state' => '' === $tagline ? __( 'No tagline', 'b-blocks' ) : __( 'Still the WordPress default', 'b-blocks' ) ];
					}
					return [ 'passed' => true, 'state' => $tagline ];
				},
			],
			'site_language'    => [
				'category' => 'search',
				'severity' => 'info',
				'title'    => __( 'Site language', 'b-blocks' ),
				'why'      => __( 'The site language sets the lang attribute that screen readers use to pick the right pronunciation, and tells search engines which audience the site is for.', 'b-blocks' ),
				'fix'      => __( 'Change it under Settings → General → Site Language if it is not the language the content is written in.', 'b-blocks' ),
				'action'   => null,
				'run'      => function () {
					$locale = get_locale();
					return [ 'passed' => true, 'state' => class_exists( '\Locale' ) ? \Locale::getDisplayName( $locale, $locale ) . ' (' . $locale . ')' : $locale ];
				},
			],
		];
	}
}

new BBlocksSiteScanner();
