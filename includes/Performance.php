<?php
namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dashboard → Settings → Performance.
 *
 * Stores the settings (`bBlocksPerformance` option, saved through the `bblocks_performance`
 * AJAX action used by src/admin/Dashboard/Pages/Settings/Performance/Performance.js) and runs
 * every feature they switch on: page cache, image, asset, font and platform optimizations.
 *
 * Files written by this class live in wp-content/cache/b-blocks/ (pages/, css/, fonts/).
 */
class BBlocksPerformance {

	const OPTION       = 'bBlocksPerformance';
	const FAILS        = 'bBlocksPerformancePreloadFails';
	const HF_VERSION   = 'bBlocksPerformanceHFVersion';
	const PRELOAD_HOOK = 'bblocks_performance_preload';
	const REBUILD_HOOK = 'bblocks_performance_rebuild';
	const FONTS_HOOK   = 'bblocks_performance_fonts';
	const ALT_META     = '_bblocks_missing_alt';
	const WEBP_USED    = 'bBlocksPerformanceWebpUsed';

	/** @var array Current settings, keyed by tab. */
	private $s;

	/** Images seen in bBlocks blocks on this request (lazy-load / LCP). */
	private $imgCount = 0;
	private $lcp      = null;

	/** How many bBlocks blocks are rendering right now — only the outermost one rewrites its images. */
	private $bbDepth = 0;

	/** Header/footer cache: queue snapshots taken before a template part renders. */
	private $hfBefore = [];

	/** Set when this page must not be stored (e.g. a Google font is still downloading). */
	private $skipStore = false;

	/** This page still points at Google because a font download failed: its cached copy must not live forever. */
	private $fontFallback = false;

	/** Local Google Fonts stylesheets used on this page (for font preloads). */
	private $localFontCss = [];

	/** Result of the alt-text check for the post being saved. */
	private $altMissing = null;

	/** Full-page cache on and no other page cache plugin running. */
	private $pageCache = false;

	/** Permalinks captured before a save/trash, so the old URL's cached copy is purged too. */
	private $oldLinks = [];

	/** A page's title before a save: a new title renews cached headers and footers that list pages. */
	private $oldTitles = [];

	/** "author|date" of a blog post before a save: its old author and date archives list it too. */
	private $oldLists = [];

	/** Posts purged in full in this request, and products whose stock was handled: an order fires several hooks per product. */
	private $productSeen = [];

	/** A large image (a cover hero, a featured image) rendered before any bBlocks block: it is the page's main image. */
	private $largeImageSeen = false;

	/** Another plugin flushed the page buffer part way: the rest of this page is passed on untouched and never stored. */
	private $flushed = false;

	/** Products in the middle of wc_update_product_stock(): their save() is a quantity change. */
	private $stockOnly = [];

	/** Archive addresses of a term before an edit (edit_terms), purged after it (edited_term): the slug or parent may change. */
	private $oldTermLinks = [];

	/** Status of each row in a posts list, shared by its row actions and its Cache column. */
	private $listStatus = [];

	/** The admin bar's "N pages cached" transient was dropped in this request already. */
	private $statsDropped = false;

	/** True while WordPress processes a new JPEG upload (compression applies only then). */
	private $uploading = false;

	/** True while the REST API saves a post on a user's behalf (block editor). */
	private $editorSave = false;

	/** A block that needs the Dashicons font has rendered on this page. */
	private $needDashicons = false;

	/** Cache key of the template lookup now running (see templates_from_cache()). */
	private $tplPendingKey = '';

	public function __construct() {
		$this->s  = self::settings();
		$caching  = $this->s['caching'];
		$images   = $this->s['images'];
		$assets   = $this->s['assets'];
		$fonts    = $this->s['fonts'];
		$platform = $this->s['platform'];

		// Always: the settings screen, and a deactivation clean-up that only clears our own cron event.
		add_action( 'wp_ajax_bblocks_performance', [ $this, 'ajax' ] );
		register_deactivation_hook( B_BLOCKS_FILE, [ __CLASS__, 'deactivate' ] );

		// Everything below is registered only when a setting needs it, so with Performance
		// switched off nothing runs: no output buffer, no DB writes, no cron, no files.
		$this->pageCache = $caching['fullPage'] && '' === self::page_cache_conflict();

		// ---- Page cache: answer straight from disk before the rest of WordPress loads. ----
		if ( $this->pageCache ) {
			$this->serve_cached_page();
		}

		if ( $this->needs_buffer() ) {
			add_action( 'template_redirect', [ $this, 'start_buffer' ], 999 );
		}
		if ( $this->pageCache && $caching['background'] ) {
			add_action( 'init', [ $this, 'schedule_preload' ] );
			add_action( self::PRELOAD_HOOK, [ $this, 'preload' ] );
		}
		if ( $this->pageCache && $caching['rebuildOnSave'] ) {
			add_action( self::REBUILD_HOOK, [ $this, 'rebuild' ] );
		}
		if ( $fonts['hostLocal'] && ! $fonts['disableGoogle'] ) {
			add_action( self::FONTS_HOOK, [ $this, 'download_google_font' ] );
		}

		// Purging only matters when something is cached.
		if ( $this->pageCache || $caching['inlineCssFiles'] || $this->header_footer_active() || $this->templates_active() ) {
			add_action( 'pre_post_update', [ $this, 'remember_permalink' ] );
			add_action( 'wp_trash_post', [ $this, 'remember_permalink' ] );
			add_action( 'transition_post_status', [ $this, 'on_post_status' ], 10, 3 );
			add_action( 'before_delete_post', [ $this, 'on_delete_post' ] );
			add_action( 'wp_set_comment_status', [ $this, 'on_comment' ] );
			add_action( 'comment_post', [ $this, 'on_comment' ], 10, 2 );
			// An approved comment edited, or deleted for good (wp_delete_comment() reports the status only once it is gone).
			add_action( 'edit_comment', [ $this, 'on_comment' ] );
			add_action( 'delete_comment', [ $this, 'on_comment' ] );
			// A category or tag added to (or taken off) a published post: both archives change. The block editor
			// saves terms after the post, so the save itself still sees the old ones.
			add_action( 'set_object_terms', [ $this, 'purge_terms' ], 10, 6 );
			// A term renamed, moved or deleted: its archive (old and new address), its parents, and the posts that name it.
			add_action( 'edit_terms', [ $this, 'on_term_change' ], 10, 2 );
			add_action( 'edited_term', [ $this, 'on_term_change' ], 10, 3 );
			add_action( 'pre_delete_term', [ $this, 'on_term_change' ], 10, 2 );
			// An author's name or slug: the author archive (old and new address) and the bylines on their posts.
			add_action( 'profile_update', [ $this, 'on_author_change' ], 10, 2 );
			// WooCommerce: an order or an import changes stock without saving the product, and a price-only save (a sale,
			// a scheduled sale starting or ending, the REST API) does not go through wp_update_post() either.
			// An order line runs wc_update_product_stock(): before_set_stock, then save() (woocommerce_update_product), then
			// set_stock — the save in between is that quantity change, not an edit.
			foreach ( [ 'woocommerce_product_before_set_stock', 'woocommerce_variation_before_set_stock', 'woocommerce_product_set_stock', 'woocommerce_variation_set_stock', 'woocommerce_product_set_stock_status', 'woocommerce_variation_set_stock_status', 'woocommerce_update_product', 'woocommerce_update_product_variation' ] as $hook ) {
				add_action( $hook, [ $this, 'on_product_change' ] );
			}
			// A save is over: a later change to the same post in this request (an import setting the featured image at
			// the end) is purged again.
			add_action( 'wp_after_insert_post', [ $this, 'on_save_done' ], 999 );
			foreach ( [ 'switch_theme', 'customize_save_after', 'wp_update_nav_menu', 'upgrader_process_complete', 'activated_plugin', 'deactivated_plugin', 'update_option_sidebars_widgets' ] as $hook ) {
				add_action( $hook, [ $this, 'purge_all' ] );
			}
			// Site-wide settings every page shows (title, permalinks, front page, language, dates…), block widgets, and
			// sticky posts (stick_post() changes only an option).
			add_action( 'updated_option', [ $this, 'on_site_option' ] );
			// The first time a setting is stored (WPLANG on a site still in English, a new widget) is add_option().
			add_action( 'added_option', [ $this, 'on_site_option' ] );
			// A featured image set or removed without a post save (imports, plugins, set_post_thumbnail()).
			foreach ( [ 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ] as $hook ) {
				add_action( $hook, [ $this, 'on_post_meta' ], 10, 3 );
			}
			// An image deleted from the Media Library: WordPress removes it as the featured image of every post at once
			// (deleted_post_meta without a post), so the posts that showed it are found here first.
			add_action( 'delete_attachment', [ $this, 'on_attachment_delete' ] );
		}

		// "bBlocks Cache" in the admin bar: only while this page cache is the one running.
		if ( $this->pageCache ) {
			add_action( 'admin_bar_menu', [ $this, 'admin_bar_cache_menu' ], 100 );
			add_action( 'admin_post_bblocks_cache', [ $this, 'cache_action' ] );
			add_action( 'wp_ajax_bblocks_cache', [ $this, 'cache_action' ] );
			add_action( 'wp_enqueue_scripts', [ $this, 'cache_menu_assets' ] );
			add_action( 'admin_enqueue_scripts', [ $this, 'cache_menu_assets' ] );
			add_action( 'admin_notices', [ $this, 'cache_action_notice' ] );
			add_action( 'wp_footer', [ $this, 'cache_action_notice' ] );
			// Posts, Pages and other lists: "Cache now" / "Clear cache" per row and as bulk actions.
			add_action( 'load-edit.php', [ $this, 'cache_list_screen' ] );
			add_filter( 'removable_query_args', [ $this, 'cache_removable_args' ] );
		}

		// `wp bblocks-cache …`: the admin bar menu's actions from the command line (deploy scripts, cron, debugging).
		if ( defined( 'WP_CLI' ) && WP_CLI && class_exists( '\WP_CLI' ) ) {
			\WP_CLI::add_command( 'bblocks-cache status', [ $this, 'cli_status' ], [
				'shortdesc' => __( 'Whether a page is cached, and which copies exist.', 'b-blocks' ),
				'synopsis'  => [ [ 'type' => 'positional', 'name' => 'url', 'description' => __( 'A page of this site: a full address or a path such as /about/.', 'b-blocks' ) ] ],
			] );
			\WP_CLI::add_command( 'bblocks-cache purge', [ $this, 'cli_purge' ], [
				'shortdesc' => __( 'Clear one page, or the whole page cache with --all.', 'b-blocks' ),
				'synopsis'  => [
					[ 'type' => 'positional', 'name' => 'url', 'optional' => true, 'description' => __( 'A page of this site.', 'b-blocks' ) ],
					[ 'type' => 'flag', 'name' => 'all', 'optional' => true, 'description' => __( 'Clear every cached page.', 'b-blocks' ) ],
				],
			] );
			\WP_CLI::add_command( 'bblocks-cache preload', [ $this, 'cli_preload' ], [
				'shortdesc' => __( 'Cache the pages nobody has visited yet, as the hourly run does.', 'b-blocks' ),
				'synopsis'  => [ [ 'type' => 'assoc', 'name' => 'limit', 'optional' => true, 'description' => __( 'Page renders in this run (default: "Pages per hour").', 'b-blocks' ) ] ],
			] );
			\WP_CLI::add_command( 'bblocks-cache stats', [ $this, 'cli_stats' ], [ 'shortdesc' => __( 'How many copies are cached, and their size on disk.', 'b-blocks' ) ] );
		}

		if ( $this->header_footer_active() ) {
			add_filter( 'pre_render_block', [ $this, 'header_footer_from_cache' ], 10, 2 );
			add_filter( 'render_block_core/template-part', [ $this, 'header_footer_to_cache' ], 10, 2 );
		}

		// Template lookups only pay off with a persistent object cache (see the notice in the UI).
		if ( $this->templates_active() ) {
			add_filter( 'pre_get_block_templates', [ $this, 'templates_from_cache' ], 10, 3 );
			add_filter( 'get_block_templates', [ $this, 'templates_to_cache' ], 10, 3 );
			add_filter( 'pre_get_block_template', [ $this, 'template_from_cache' ], 10, 3 );
			add_filter( 'get_block_template', [ $this, 'template_to_cache' ], 10, 3 );
		}

		// ---- Images ----
		if ( $images['lazyLoad'] || $images['dimensions'] || $images['srcset'] || $images['preloadLcp'] ) {
			add_filter( 'render_block_data', [ $this, 'enter_block' ] );
			add_filter( 'render_block', [ $this, 'optimize_block_images' ], 10, 2 );
		}
		if ( $images['requireFilenames'] ) {
			add_filter( 'wp_handle_upload_prefilter', [ $this, 'check_filename' ] );
		}
		if ( $images['webp'] || $this->upload_quality() ) {
			add_filter( 'wp_generate_attachment_metadata', [ $this, 'process_upload' ], 20, 3 );
		}
		if ( $images['webp'] ) {
			add_filter( 'wp_update_attachment_metadata', [ $this, 'webp_after_edit' ], 10, 2 );
		}
		// WebP copies made earlier are removed with their image even after the option is turned off.
		// Also after the option is turned off — checked when an image is deleted, not on every request (a missing option
		// is a database query each time without an object cache).
		add_action( 'delete_attachment', [ $this, 'delete_webp_copies' ] );
		if ( $this->upload_quality() ) {
			// Lower JPEG quality only while a new upload is being processed — never when someone edits an image.
			add_filter( 'wp_handle_upload', [ $this, 'mark_upload' ] );
			add_filter( 'wp_editor_set_quality', [ $this, 'editor_quality' ], 10, 2 );
		}
		if ( $images['requireAlt'] ) {
			add_action( 'init', [ $this, 'register_alt_meta' ] );
			add_action( 'rest_api_init', [ $this, 'watch_rest_saves' ] );
			add_filter( 'wp_insert_post_data', [ $this, 'check_alt_text' ], 10, 2 );
			add_action( 'wp_insert_post', [ $this, 'save_alt_result' ] );
			add_action( 'enqueue_block_editor_assets', [ $this, 'alt_editor_notice' ] );
			add_action( 'wp_enqueue_media', [ $this, 'alt_media_guard' ] );
			add_action( 'admin_notices', [ $this, 'alt_admin_notice' ] );
		}

		// ---- Assets ----
		if ( $assets['assetFiles'] ) {
			add_filter( 'render_block', [ $this, 'mark_block_styles' ], 20, 2 );
			add_action( 'save_post', [ $this, 'delete_post_asset_files' ] );
			// Deleted for good (Empty Trash, or straight away): its file would be left behind forever.
			add_action( 'before_delete_post', [ $this, 'delete_post_asset_files' ] );
		}
		if ( $assets['combineCss'] ) {
			add_filter( 'should_load_separate_core_block_assets', [ $this, 'separate_block_assets' ] );
			add_filter( 'styles_inline_size_limit', [ $this, 'inline_size_limit' ] );
		}
		if ( $assets['cssPerBlock'] ) {
			add_filter( 'should_load_separate_core_block_assets', [ $this, 'separate_block_assets' ] );
			add_filter( 'should_load_block_assets_on_demand', [ $this, 'separate_block_assets' ] );
		}
		if ( $assets['deferScripts'] ) {
			add_action( 'wp_print_scripts', [ $this, 'defer_scripts' ], 1 );
			add_action( 'wp_print_footer_scripts', [ $this, 'defer_scripts' ], 1 );
		}
		if ( $assets['removeQuery'] ) {
			add_filter( 'style_loader_src', [ $this, 'remove_version' ], 20 );
			add_filter( 'script_loader_src', [ $this, 'remove_version' ], 20 );
			// Script modules (navigation, Interactivity API…) get their URLs from a separate filter.
			add_filter( 'script_module_loader_src', [ $this, 'remove_version' ], 20 );
		}
		if ( '' !== trim( $assets['preconnect'] ) || $fonts['disableGoogle'] || $platform['disableEmojis'] ) {
			add_filter( 'wp_resource_hints', [ $this, 'resource_hints' ], 10, 2 );
		}

		// ---- Platform (front-end pages only; the admin, feeds and emails are left alone) ----
		if ( $platform['disableEmojis'] ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'wp_enqueue_scripts', 'wp_enqueue_emoji_styles' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
		}
		if ( $platform['disableEmbeds'] ) {
			remove_action( 'wp_head', 'wp_oembed_add_discovery_links', 4 );
			remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
			remove_action( 'wp_head', 'wp_oembed_add_host_js' );
			remove_filter( 'embed_oembed_html', 'wp_maybe_enqueue_oembed_host_js' );
			add_action( 'wp_enqueue_scripts', [ $this, 'dequeue_embed' ], 100 );
		}
		if ( $platform['disableDashicons'] ) {
			add_filter( 'render_block', [ $this, 'watch_dashicons' ], 10, 2 );
			add_action( 'wp_enqueue_scripts', [ $this, 'dequeue_dashicons' ], 100 );
		}
		if ( $platform['removeJqueryMigrate'] ) {
			add_action( 'wp_default_scripts', [ $this, 'remove_jquery_migrate' ] );
		}
		if ( $platform['heartbeat'] ) {
			add_filter( 'heartbeat_settings', [ $this, 'heartbeat_settings' ] );
		}
		if ( $platform['touchTargets'] ) {
			add_action( 'wp_head', [ $this, 'touch_targets_css' ], 100 );
		}
	}

	/** Any setting that rewrites front-end HTML needs the output buffer. */
	private function needs_buffer() {
		$c = $this->s['caching'];
		$i = $this->s['images'];
		$a = $this->s['assets'];
		$f = $this->s['fonts'];
		return $this->pageCache || $c['inlineCssFiles'] || $a['minifyInline'] || $a['delayJs'] || $i['webp'] || $i['preloadLcp']
			|| $a['assetFiles'] || $a['criticalCss'] || $a['asyncCss']
			|| $f['preloadFonts'] || $f['fontSwap'] || $f['hostLocal'] || $f['usedWeights'] || $f['disableGoogle'];
	}

	/**
	 * Name of another page cache already running here, or ''. Two page caches would serve each
	 * other's stale copies, so bBlocks then leaves page caching to that one.
	 * Read from the active-plugins list: at this point most other plugins are not loaded yet.
	 */
	public static function page_cache_conflict() {
		if ( defined( 'WP_CACHE' ) && WP_CACHE && file_exists( WP_CONTENT_DIR . '/advanced-cache.php' ) ) {
			return __( 'Another page cache (advanced-cache.php)', 'b-blocks' );
		}
		$known  = [
			'wp-rocket/wp-rocket.php'                    => 'WP Rocket',
			'litespeed-cache/litespeed-cache.php'        => 'LiteSpeed Cache',
			'w3-total-cache/w3-total-cache.php'          => 'W3 Total Cache',
			'wp-super-cache/wp-cache.php'                => 'WP Super Cache',
			'wp-fastest-cache/wpFastestCache.php'        => 'WP Fastest Cache',
			'cache-enabler/cache-enabler.php'            => 'Cache Enabler',
			'breeze/breeze.php'                          => 'Breeze',
			'sg-cachepress/sg-cachepress.php'            => 'SiteGround Speed Optimizer',
			'hummingbird-performance/wp-hummingbird.php' => 'Hummingbird',
			'wp-optimize/wp-optimize.php'                => 'WP-Optimize',
			'comet-cache/comet-cache.php'                => 'Comet Cache',
			'swift-performance-lite/performance.php'     => 'Swift Performance',
		];
		$active = (array) get_option( 'active_plugins', [] );
		if ( is_multisite() ) {
			$active = array_merge( $active, array_keys( (array) get_site_option( 'active_sitewide_plugins', [] ) ) );
		}
		foreach ( $known as $file => $name ) {
			if ( in_array( $file, $active, true ) ) {
				return $name;
			}
		}
		return '';
	}

	/**
	 * Header/footer caching needs WordPress 6.8+: before that, layout class names are counters
	 * (a cached header would clash with the page), and script modules cannot be replayed.
	 */
	private static function header_footer_supported() {
		return function_exists( 'wp_unique_id_from_values' ) && function_exists( 'wp_script_modules' ) && method_exists( 'WP_Script_Modules', 'get_queue' ) && function_exists( 'wp_interactivity_state' );
	}

	/**
	 * Block themes only. In a classic theme the content renders after <head>, so per-block CSS is printed
	 * in the footer and the page flashes unstyled — unless WordPress itself moves it up (6.9+ does, and
	 * then turns this on by its own rules, respecting a theme that opts out). Either way: leave it to WordPress.
	 */
	public function separate_block_assets( $load ) {
		return wp_is_block_theme() ? true : $load;
	}

	private function header_footer_active() {
		return $this->s['caching']['headerFooter'] && self::header_footer_supported();
	}

	private function templates_active() {
		return $this->s['caching']['templateLookups'] && wp_using_ext_object_cache();
	}

	/* =====================================================================
	 * Settings + AJAX
	 * ===================================================================== */

	/** Defaults — same shape and string-number values as the React screen. */
	public static function defaults() {
		// The settings this plugin is tuned and tested with — also what "Apply recommended settings" switches to
		// (src/admin/Dashboard/Pages/Settings/Performance/Performance.js, `recommended`: keep the two in step).
		return [
			'caching'  => [ 'fullPage' => true, 'cacheWhich' => 'all', 'expireHours' => '0', 'allowedQuery' => '', 'neverCache' => '', 'neverCookies' => '', 'alwaysPurge' => '', 'preloadUrls' => '', 'rebuildOnSave' => false, 'compressed' => true, 'separateMobile' => true, 'background' => true, 'pagesPerHour' => '20', 'inlineCssFiles' => true, 'inlineBelow' => '2048', 'headerFooter' => true, 'headerFooterExpire' => '43200', 'templateLookups' => true ],
			'images'   => [ 'lazyLoad' => true, 'eagerCount' => '1', 'dimensions' => true, 'srcset' => true, 'preloadLcp' => true, 'compression' => '5', 'webp' => true, 'optimizeUploads' => true, 'requireFilenames' => true, 'requireAlt' => true ],
			'assets'   => [ 'assetFiles' => true, 'criticalCss' => true, 'criticalBlocks' => '15', 'asyncCss' => true, 'asyncCssMin' => '8192', 'combineCss' => true, 'inlineThreshold' => '80000', 'cssPerBlock' => true, 'deferScripts' => true, 'deferExclude' => '', 'delayJs' => true, 'delayTimeout' => '5', 'minifyInline' => true, 'removeQuery' => true, 'preconnect' => '' ],
			'fonts'    => [ 'fontSwap' => true, 'preloadFonts' => true, 'preloadMax' => '2', 'hostLocal' => true, 'disableGoogle' => false, 'usedWeights' => true ],
			'platform' => [ 'disableEmojis' => true, 'disableEmbeds' => true, 'disableDashicons' => true, 'removeJqueryMigrate' => true, 'heartbeat' => true, 'heartbeatInterval' => '60', 'touchTargets' => true ],
		];
	}

	/** Every toggle off, Compression strength "off": how Performance behaved before it had on-by-default options. */
	public static function all_off() {
		$s = self::defaults();
		foreach ( $s as $tab => $keys ) {
			foreach ( $keys as $key => $value ) {
				if ( is_bool( $value ) ) {
					$s[ $tab ][ $key ] = false;
				}
			}
		}
		$s['images']['compression'] = 'off';
		return $s;
	}

	/**
	 * A fresh install (gets the on-by-default options), as opposed to a site that ran bBlocks before
	 * (keeps everything off until its owner saves the Performance screen). Read from the install data
	 * Freemius keeps for bBlocks: no previous plugin version, and installed within the last day.
	 * Missing or odd data counts as an existing install — the side where nothing changes.
	 */
	public static function is_new_install( $fs ) {
		if ( ! is_array( $fs ) || empty( $fs['install_timestamp'] ) ) {
			return false;
		}
		if ( ! empty( $fs['plugin_last_version'] ) || ! empty( $fs['plugin_upgrade_mode'] ) ) {
			return false;
		}
		return time() - (int) $fs['install_timestamp'] < DAY_IN_SECONDS;
	}

	/** Saved settings, each tab filled in with defaults for keys it does not have yet. */
	public static function settings() {
		$stored = get_option( self::OPTION, null );

		// First run on this site: decide once which defaults it gets, and keep that decision, so a
		// new install is not reclassified as "existing" a day later.
		if ( ! is_array( $stored ) ) {
			$accounts = get_option( 'fs_accounts', [] );
			$stored   = self::is_new_install( $accounts['plugin_data']['b-blocks'] ?? null ) ? self::defaults() : self::all_off();
			update_option( self::OPTION, $stored, true );
		}

		// Same rules as a save: missing keys get defaults, and a value stored by other code ("false", an array…) gets its proper type.
		return self::sanitize( $stored );
	}

	private static function sanitize( $raw ) {
		$choices = [
			'caching.cacheWhich' => [ 'all', 'bblocks' ],
			'images.compression' => [ 'off', '1', '2', '3', '5' ],
		];
		$out = [];
		foreach ( self::defaults() as $tab => $keys ) {
			foreach ( $keys as $key => $default ) {
				$value = $raw[ $tab ][ $key ] ?? $default;
				if ( ! is_scalar( $value ) ) {
					$value = $default;
				}
				if ( is_bool( $default ) ) {
					$out[ $tab ][ $key ] = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
				} elseif ( isset( $choices[ "$tab.$key" ] ) ) {
					$out[ $tab ][ $key ] = in_array( (string) $value, $choices[ "$tab.$key" ], true ) ? (string) $value : $default;
				} elseif ( is_numeric( $default ) ) {
					$out[ $tab ][ $key ] = '' === $value ? $default : (string) absint( $value );
				} elseif ( in_array( "$tab.$key", [ 'caching.neverCache', 'caching.alwaysPurge', 'caching.preloadUrls' ], true ) ) {
					// Addresses: sanitize_text_field() deletes %XX, so one pasted from the address bar (a Bengali slug) is kept
					// as readable text instead of losing its letters.
					$out[ $tab ][ $key ] = sanitize_text_field( rawurldecode( (string) $value ) );
				} else {
					$out[ $tab ][ $key ] = sanitize_text_field( (string) $value );
				}
			}
		}
		$out['platform']['heartbeatInterval'] = (string) min( 300, max( 15, (int) $out['platform']['heartbeatInterval'] ) );
		$out['assets']['delayTimeout']        = (string) min( 30, max( 1, (int) $out['assets']['delayTimeout'] ) );
		$out['caching']['pagesPerHour']       = (string) max( 1, (int) $out['caching']['pagesPerHour'] );
		$out['assets']['criticalBlocks']      = (string) min( 50, max( 1, (int) $out['assets']['criticalBlocks'] ) );
		$out['assets']['asyncCssMin']         = (string) max( 1024, (int) $out['assets']['asyncCssMin'] );
		// The same ranges as the screen's controls.
		$out['images']['eagerCount']          = (string) min( 10, (int) $out['images']['eagerCount'] );
		$out['fonts']['preloadMax']           = (string) min( 6, max( 1, (int) $out['fonts']['preloadMax'] ) );
		$out['caching']['headerFooterExpire'] = (string) max( 60, (int) $out['caching']['headerFooterExpire'] );
		return $out;
	}

	/**
	 * POST bblocks_performance { _wpnonce, do: get|save|purge, settings?: JSON }.
	 * Always answers with { settings, stats, objectCache }.
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

		if ( 'save' === $do ) {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON, every value is sanitized in sanitize().
			$raw = json_decode( wp_unslash( $_POST['settings'] ?? '' ), true );
			if ( ! is_array( $raw ) ) {
				wp_send_json_error( [ 'message' => __( 'Settings could not be read.', 'b-blocks' ) ] );
			}
			$this->s = self::sanitize( $raw );
			// update_option() is also false when nothing changed; only a value that is not stored now (read from the database,
			// not this request's startup copy) is a failed save.
			if ( ! update_option( self::OPTION, $this->s, true ) ) {
				wp_cache_delete( 'alloptions', 'options' );
				wp_cache_delete( self::OPTION, 'options' );
				if ( self::settings() !== $this->s ) {
					wp_send_json_error( [ 'message' => __( 'The settings could not be saved. Try again.', 'b-blocks' ) ] );
				}
			}
			$this->schedule_preload();
			$this->purge_all();
		}

		if ( 'purge' === $do ) {
			$this->purge_all();
		}
		// After a save or "Purge Cache", the next preload a minute later rather than within the hour (one run: WordPress
		// drops a duplicate within 10 minutes). Only while the page cache with background caching is on now.
		if ( in_array( $do, [ 'save', 'purge' ], true ) && $this->s['caching']['fullPage'] && $this->s['caching']['background'] && '' === self::page_cache_conflict() ) {
			wp_schedule_single_event( time() + MINUTE_IN_SECONDS, self::PRELOAD_HOOK, [ 'warm' ] );
		}

		wp_send_json_success( [
			'settings'    => $this->s,
			'stats'       => $this->stats(),
			'objectCache' => wp_using_ext_object_cache(),
			'status'      => [
				'pageCacheConflict'     => self::page_cache_conflict(),
				'headerFooterSupported' => self::header_footer_supported(),
				'blockTheme'            => wp_is_block_theme(),
			],
		] );
	}

	/**
	 * One-click fix from the Site Scanner: switch one toggle on with the same rules as a save on the
	 * Performance screen — sanitize, store, then reschedule and purge exactly as ajax() does.
	 * An instance is made without the constructor, so no hook is registered a second time.
	 */
	public static function enable( $group, $key ) {
		// Start from the stored row, not the copy this request loaded at startup: another tab may have saved since.
		wp_cache_delete( 'alloptions', 'options' );
		wp_cache_delete( self::OPTION, 'options' );
		$s = self::settings();
		if ( ! isset( $s[ $group ][ $key ] ) || ! is_bool( $s[ $group ][ $key ] ) ) {
			return false;
		}
		$s[ $group ][ $key ] = true;

		$perf    = ( new \ReflectionClass( self::class ) )->newInstanceWithoutConstructor();
		$written = update_option( self::OPTION, self::sanitize( $s ), true );

		// Judge by what is stored now: update_option() is also false when this is stored already (switched on in another
		// tab), and a filter can change or refuse what gets stored.
		wp_cache_delete( 'alloptions', 'options' );
		wp_cache_delete( self::OPTION, 'options' );
		$perf->s = self::settings();
		if ( empty( $perf->s[ $group ][ $key ] ) ) {
			return false;
		}
		if ( $written ) {
			$perf->schedule_preload();
			$perf->purge_all();
		}
		return true;
	}

	public static function deactivate() {
		wp_clear_scheduled_hook( self::PRELOAD_HOOK );
	}

	/* =====================================================================
	 * Page cache
	 * ===================================================================== */

	private static function cache_dir() {
		return WP_CONTENT_DIR . '/cache/b-blocks/';
	}

	private static function cache_url() {
		return content_url( '/cache/b-blocks/' );
	}

	private function request_host() {
		return strtolower( preg_replace( '/[^A-Za-z0-9.:-]/', '', sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ?? '' ) ) ) );
	}

	/** Folder that holds every cached variant of one URL path. */
	private function page_dir( $host, $path ) {
		$segments = [];
		foreach ( explode( '/', trim( $path, '/' ) ) as $segment ) {
			if ( '' === $segment ) {
				continue;
			}
			// One folder whatever the letter case: %E0 and %e0 are the same character, and WordPress serves /About/ as /about/
			// (pages are looked up case-insensitively, without a redirect) — a save then purges what a typed address cached.
			$segment    = preg_replace( '/[^a-z0-9._~%-]/', '_', strtolower( $segment ) );
			$segments[] = in_array( $segment, [ '.', '..' ], true ) ? '_' : $segment;
		}
		$host = preg_replace( '/[^a-z0-9.-]/', '_', strtolower( $host ) );
		return self::cache_dir() . 'pages/' . $host . '/' . ( $segments ? implode( '/', $segments ) . '/' : '' );
	}

	private function wants_webp() {
		return $this->s['images']['webp'] && false !== strpos( sanitize_text_field( wp_unslash( $_SERVER['HTTP_ACCEPT'] ?? '' ) ), 'image/webp' );
	}

	/**
	 * Cache file for the current request, or '' when this request must never use the cache
	 * (not a GET, logged in, a cart, a query parameter that is not allowed, an excluded URL…).
	 * Works before pluggable.php is loaded, so it only looks at the request itself.
	 */
	private function request_cache_path() {
		$c = $this->s['caching'];

		if ( 'GET' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) || is_admin() || wp_doing_ajax() || wp_doing_cron() || ( defined( 'WP_CLI' ) && WP_CLI ) || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return '';
		}

		// Only the site's own host: a forged Host header must not pick the folder (or make a new one per value).
		$home = wp_parse_url( home_url() );
		$own  = strtolower( ( $home['host'] ?? '' ) . ( isset( $home['port'] ) ? ':' . $home['port'] : '' ) );
		if ( '' === $own || preg_replace( '/:(80|443)$/', '', $this->request_host() ) !== $own ) {
			return '';
		}

		// http and https render different asset addresses (is_ssl()): only the scheme the site is set to is cached. Read from
		// the stored setting (home_url() itself turns to https on an https request). Behind a TLS proxy, "https" may arrive only
		// as X-Forwarded-Proto until a plugin maps it later: enough to serve a copy — storing checks the real scheme.
		$ssl = is_ssl() || 'https' === strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '' ) ) );
		if ( $ssl !== ( 'https' === wp_parse_url( (string) get_option( 'home' ), PHP_URL_SCHEME ) ) ) {
			return '';
		}

		$path = (string) wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) ), PHP_URL_PATH );
		$path = '' === $path ? '/' : $path;
		if ( preg_match( '#/(wp-admin|wp-json|wp-content|wp-includes)(/|$)|wp-(login|cron|signup|activate|comments-post)\.php|xmlrpc\.php|\.(xml|txt|php|json|xsl)$#i', $path ) ) {
			return '';
		}
		// "/%2e%2e/about/" is answered as /about/ without a redirect: never a copy of its own (unpurgeable, and endless).
		if ( preg_match( '#(^|/)\.\.?(/|$)#', rawurldecode( $path ) ) ) {
			return '';
		}

		// "Never cache when these cookies are set": a cookie name, or the start of one (a language, currency or consent choice).
		$cookies = array_filter( array_map( 'trim', explode( ',', $c['neverCookies'] ) ) );
		foreach ( array_keys( $_COOKIE ) as $cookie ) {
			if ( preg_match( '/^(wordpress_logged_in_|wp-postpass_|comment_author_|woocommerce_items_in_cart|woocommerce_cart_hash|wp_woocommerce_session_)/', $cookie ) ) {
				return '';
			}
			foreach ( $cookies as $name ) {
				// PHP turns "." and spaces in cookie names into "_" in $_COOKIE: compare that spelling too.
				if ( 0 === strpos( (string) $cookie, $name ) || 0 === strpos( (string) $cookie, strtr( $name, '. ', '__' ) ) ) {
					return '';
				}
			}
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only cache key.
		$query   = array_map( 'sanitize_text_field', wp_unslash( (array) $_GET ) );
		$allowed = array_filter( array_map( 'trim', explode( ',', $c['allowedQuery'] ) ) );
		if ( array_diff( array_keys( $query ), $allowed ) ) {
			return '';
		}

		foreach ( array_filter( array_map( 'trim', explode( ',', $c['neverCache'] ) ) ) as $pattern ) {
			$regex = '#^' . str_replace( '\*', '.*', preg_quote( '/' . ltrim( $pattern, '/' ), '#' ) ) . '$#i';
			// The decoded address too: an entry can be written as readable text (a Bengali slug, not %e0%a6…).
			$plain = rawurldecode( $path );
			if ( preg_match( $regex, $path ) || preg_match( $regex, untrailingslashit( $path ) ) || preg_match( $regex, trailingslashit( $path ) ) || preg_match( $regex, $plain ) || preg_match( $regex, untrailingslashit( $plain ) ) || preg_match( $regex, trailingslashit( $plain ) ) ) {
				return '';
			}
		}

		ksort( $query );
		$name  = '/' === substr( $path, -1 ) ? 'index' : 'page';
		$name .= $c['separateMobile'] && wp_is_mobile() ? '-mobile' : '';
		$name .= $this->wants_webp() ? '-webp' : '';
		$name .= $query ? '-' . md5( http_build_query( $query ) ) : '';

		// The host as checked above (":80"/":443" dropped): the folder purge_url() and the menu use.
		return $this->page_dir( preg_replace( '/:(80|443)$/', '', $this->request_host() ), $path ) . $name . '.html';
	}

	/** A cached file is fresh unless it is past "Expire after", or holds a nonce older than 10 hours. */
	private function is_fresh( $file ) {
		$age   = time() - filemtime( $file );
		$hours = (int) $this->s['caching']['expireHours'];
		if ( $hours && $age > $hours * HOUR_IN_SECONDS ) {
			return false;
		}
		return ! ( file_exists( $file . '.nonce' ) && $age > 10 * HOUR_IN_SECONDS );
	}

	private function serve_cached_page() {
		$file = $this->request_cache_path();
		if ( ! $file || ! is_readable( $file ) || ! $this->is_fresh( $file ) ) {
			return;
		}

		header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );
		header( 'X-BBlocks-Cache: HIT' );
		// Phones get their own copy with "Separate mobile cache": a shared cache (CDN, proxy) must keep them apart too.
		header( 'Vary: Accept-Encoding' . ( $this->s['images']['webp'] ? ', Accept' : '' ) . ( $this->s['caching']['separateMobile'] ? ', User-Agent' : '' ) );

		$gz       = $file . '.gz';
		$encoding = sanitize_text_field( wp_unslash( $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '' ) );
		if ( $this->s['caching']['compressed'] && is_readable( $gz ) && false !== strpos( $encoding, 'gzip' ) && ! ini_get( 'zlib.output_compression' ) ) {
			header( 'Content-Encoding: gzip' );
			header( 'Content-Length: ' . filesize( $gz ) );
			readfile( $gz ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
			exit;
		}

		header( 'Content-Length: ' . filesize( $file ) );
		readfile( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
		exit;
	}

	/** Atomic write: a visitor never reads a half-written file. */
	private function write_file( $file, $data ) {
		// A read-only folder (permissions, full disk…) means "don't cache", quietly — no warning on every request.
		if ( ! wp_mkdir_p( dirname( $file ) ) || ! wp_is_writable( dirname( $file ) ) ) {
			return false;
		}
		$base = self::cache_dir();
		if ( ! file_exists( $base . 'index.php' ) && wp_mkdir_p( $base ) && wp_is_writable( $base ) ) {
			file_put_contents( $base . 'index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		}
		$tmp = $file . '.' . wp_generate_password( 6, false ) . '.tmp';
		// A full disk writes only part of the data (and returns that count, not false): never publish a short file.
		// @: a full disk raises "write … failed with errno=28" on every request; the result is checked instead.
		if ( strlen( $data ) !== @file_put_contents( $tmp, $data, LOCK_EX ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents, WordPress.PHP.NoSilencedErrors.Discouraged
			if ( file_exists( $tmp ) ) {
				wp_delete_file( $tmp );
			}
			return false;
		}
		if ( ! @rename( $tmp, $file ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.rename_rename, WordPress.PHP.NoSilencedErrors.Discouraged
			wp_delete_file( $tmp );
			return false;
		}
		return true;
	}

	private function store_page( $html ) {
		$c = $this->s['caching'];

		if ( $this->skipStore || is_user_logged_in() || is_search() || is_404() || is_feed() || is_preview() || ( is_singular() && post_password_required() ) ) {
			return;
		}
		if ( ( defined( 'DONOTCACHEPAGE' ) && DONOTCACHEPAGE ) || 200 !== http_response_code() ) {
			return;
		}
		if ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() || ( is_singular() && ( has_block( 'woocommerce/cart' ) || has_block( 'woocommerce/checkout' ) ) ) ) ) {
			return;
		}
		if ( 'bblocks' === $c['cacheWhich'] && ! ( is_singular() && $this->uses_bblocks( get_queried_object_id() ) ) ) {
			return;
		}
		// WordPress answers /comment-page-999/ with the post (200) whether that page exists or not: only real comment pages
		// are stored, or any visitor could fill the disk one number at a time.
		// A block theme does not fill the classic comment counts: then counted from the post.
		$cpage = (int) get_query_var( 'cpage' );
		$pages = get_comment_pages_count();
		if ( ! $pages && is_singular() ) {
			$pages = get_option( 'page_comments' ) ? (int) ceil( get_comments_number() / max( 1, (int) get_option( 'comments_per_page' ) ) ) : 1;
		}
		if ( $cpage && $cpage > $pages ) {
			return;
		}
		// The page was rendered for the scheme the site is set to (asset addresses follow is_ssl()), not just labelled so.
		if ( is_ssl() !== ( 'https' === wp_parse_url( (string) get_option( 'home' ), PHP_URL_SCHEME ) ) ) {
			return;
		}
		foreach ( headers_list() as $header ) {
			if ( 0 === stripos( $header, 'set-cookie:' ) ) {
				return;
			}
		}

		$file = $this->request_cache_path();
		if ( ! $file ) {
			return;
		}
		// Only a whole page: whatever cut it short (a buffer thrown away part way, a fatal error), it is not stored.
		if ( false === stripos( $html, '</html>' ) ) {
			return;
		}
		// The CSS files this page links (moved inline CSS, block asset files) must still exist: a purge between writing them
		// and storing this page would cache a page that loads unstyled. The folders' real addresses (multisite, custom UPLOADS).
		foreach ( [ self::cache_dir() . 'css/' => self::cache_url() . 'css/', self::asset_dir() => wp_get_upload_dir()['baseurl'] . '/b-blocks/css/' ] as $dir => $url ) {
			preg_match_all( '#href=["\'][^"\']*' . preg_quote( (string) wp_parse_url( $url, PHP_URL_PATH ), '#' ) . '([\w.-]+\.css)#', $html, $linked );
			foreach ( $linked[1] as $name ) {
				if ( ! file_exists( $dir . $name ) ) {
					return;
				}
			}
		}

		$html .= "\n<!-- Cached by bBlocks on " . gmdate( 'Y-m-d H:i:s' ) . ' UTC -->';
		if ( ! $this->write_file( $file, $html ) ) {
			return;
		}
		// If the .gz cannot be written, drop an older one: it would be served in place of the new page.
		if ( ( ! $c['compressed'] || ! function_exists( 'gzencode' ) || ! $this->write_file( $file . '.gz', gzencode( $html, 6 ) ) ) && file_exists( $file . '.gz' ) ) {
			wp_delete_file( $file . '.gz' );
		}
		// Pages that carry a nonce are rebuilt within 10 hours so the nonce never expires on a visitor.
		if ( $this->fontFallback || preg_match( '/nonce/i', $html ) ) {
			$this->write_file( $file . '.nonce', '' );
		} elseif ( file_exists( $file . '.nonce' ) ) {
			wp_delete_file( $file . '.nonce' );
		}
	}

	/** "Only pages built with bBlocks": the post's own content has at least one bBlocks block. */
	private function uses_bblocks( $post ) {
		return false !== strpos( (string) get_post_field( 'post_content', $post ), '<!-- wp:b-blocks/' );
	}

	private function rrmdir( $dir ) {
		if ( ! is_dir( $dir ) ) {
			return;
		}
		// Another request (a checkout's stock purge, a visitor's write) can empty or fill a folder while this walks it:
		// a folder that vanished is done, one that gained a file is cleared next time — neither is an error.
		try {
			$items = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $dir, \FilesystemIterator::SKIP_DOTS ), \RecursiveIteratorIterator::CHILD_FIRST );
			foreach ( $items as $item ) {
				$item->isDir() ? @rmdir( $item->getPathname() ) : wp_delete_file( $item->getPathname() ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_rmdir, WordPress.PHP.NoSilencedErrors.Discouraged
			}
		} catch ( \UnexpectedValueException $e ) {
			return;
		}
		@rmdir( $dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_rmdir, WordPress.PHP.NoSilencedErrors.Discouraged
	}

	/** Purge Cache button, settings save, theme/menu/plugin changes. Downloaded fonts are kept. */
	public function purge_all() {
		$this->rrmdir( self::cache_dir() . 'pages' );
		$this->rrmdir( self::cache_dir() . 'css' );
		if ( $this->s['assets']['assetFiles'] ) {
			$this->rrmdir( self::asset_dir() );
		}
		if ( $this->s['caching']['headerFooter'] ) {
			update_option( self::HF_VERSION, time(), true );
		}
		if ( $this->templates_active() ) {
			wp_cache_set( 'version', microtime( true ), 'bblocks_templates' );
		}
		if ( false !== get_option( self::FAILS ) ) {
			delete_option( self::FAILS );
		}
		delete_transient( 'bblocks_cache_stats' );
	}

	private function url_dir( $url ) {
		$parts = wp_parse_url( $url );
		$host  = ( $parts['host'] ?? '' ) . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
		return $this->page_dir( $host, $parts['path'] ?? '/' );
	}

	/**
	 * $more: 'list' also clears its numbered pages (/page/2/…), 'post' its own pages (/2/…) and comment pages
	 * (/comment-page-2/…) — the same content, so stale together. Nothing else below it: /2026/ under the home page
	 * holds posts, and a parent page's folder holds its child pages.
	 */
	private function purge_url( $url, $more = '' ) {
		$dir   = $this->url_dir( $url );
		$files = array_filter( (array) glob( $dir . '*' ), function ( $file ) {
			return $file && is_file( $file ) && preg_match( '/^(index|page)/', basename( $file ) );
		} );
		// Each page's .gz and .nonce before the page itself: a page stored in between must not be left without its
		// nonce marker (it would then never expire).
		usort( $files, function ( $a, $b ) {
			return (int) ( '.html' === substr( $a, -5 ) ) - (int) ( '.html' === substr( $b, -5 ) );
		} );
		foreach ( $files as $file ) {
			wp_delete_file( $file );
		}
		if ( $more ) {
			foreach ( (array) glob( $dir . '*', GLOB_ONLYDIR ) as $sub ) {
				if ( $sub && preg_match( 'list' === $more ? '/^page$/' : '/^(\d+|comment-page-\d+)$/', basename( $sub ) ) ) {
					$this->rrmdir( $sub );
				}
			}
		}
		// The admin bar's "N pages cached" line — once per request: a save purges 10–20 addresses.
		if ( ! $this->statsDropped ) {
			delete_transient( 'bblocks_cache_stats' );
			$this->statsDropped = true;
		}
	}

	private function is_url_cached( $url ) {
		$dir = $this->url_dir( $url );
		foreach ( [ 'index.html', 'page.html' ] as $name ) {
			if ( file_exists( $dir . $name ) && $this->is_fresh( $dir . $name ) ) {
				return true;
			}
		}
		return false;
	}

	/** Builds the cached copies of one page that are missing or stale, at most $max of them. Returns how many it requested. */
	private function fetch( $url, $max = PHP_INT_MAX ) {
		// Own pages only: a permalink filtered to another site (e.g. "Page Links To") is not ours to crawl.
		if ( strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) ) !== strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
			return 0;
		}
		// The file names request_cache_path() gives each copy: a fresh one is not requested again.
		$path  = (string) wp_parse_url( $url, PHP_URL_PATH );
		$query = [];
		parse_str( (string) wp_parse_url( $url, PHP_URL_QUERY ), $query );
		ksort( $query );
		$file = $this->url_dir( $url ) . ( '' === $path || '/' === substr( $path, -1 ) ? 'index' : 'page' );
		$sent = 0;
		// Every copy request_cache_path() serves: browsers that accept WebP and phones each get their own file, so a
		// plain request alone would warm a copy no current browser is ever given.
		foreach ( $this->s['caching']['separateMobile'] ? [ '', 'Mobile ' ] : [ '' ] as $mobile ) {
			foreach ( $this->s['images']['webp'] ? [ 'text/html', 'text/html,image/webp,*/*' ] : [ 'text/html' ] as $accept ) {
				$copy = $file . ( $mobile ? '-mobile' : '' ) . ( 'text/html' === $accept ? '' : '-webp' ) . ( $query ? '-' . md5( http_build_query( $query ) ) : '' ) . '.html';
				if ( file_exists( $copy ) && $this->is_fresh( $copy ) ) {
					continue;
				}
				if ( $sent >= $max ) {
					break 2;
				}
				++$sent;
				wp_remote_get( $url, [
					'timeout'    => 15,
					'sslverify'  => apply_filters( 'https_local_ssl_verify', false ), // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core hook.
					'user-agent' => $mobile . 'bBlocks cache builder; ' . home_url( '/' ),
					'headers'    => [ 'Accept' => $accept ],
				] );
			}
		}
		return $sent;
	}

	public function on_post_status( $new_status, $old_status, $post ) {
		// The URL remembered before this save belongs to this save only — clear it, so a later save
		// of the same post in this request (rename, then trash) remembers its own URL.
		$oldLink = $this->oldLinks[ $post->ID ] ?? '';
		$oldList  = $this->oldLists[ $post->ID ] ?? '';
		$oldTitle = $this->oldTitles[ $post->ID ] ?? '';
		unset( $this->oldLinks[ $post->ID ], $this->oldLists[ $post->ID ], $this->oldTitles[ $post->ID ] );

		if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
			return;
		}
		if ( in_array( $post->post_type, [ 'wp_template', 'wp_template_part', 'wp_global_styles', 'wp_navigation', 'wp_block' ], true ) ) {
			$this->purge_all();
			return;
		}
		if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) || ! is_post_type_viewable( $post->post_type ) ) {
			return;
		}
		// WooCommerce reports the same save again (woocommerce_update_product): on_product_change() skips it.
		$this->productSeen[ $post->ID ]['full'] = true;
		// Pages are listed in headers and footers (page list, navigation fallback): a new, removed, renamed or moved page renews
		// them — an edit of its content does not.
		if ( 'page' === $post->post_type && $this->header_footer_active() && ( $new_status !== $old_status || ( $oldLink && $oldLink !== get_permalink( $post ) ) || ( '' !== $oldTitle && $oldTitle !== $post->post_title ) ) ) {
			update_option( self::HF_VERSION, time(), true );
		}

		$urls = array_filter( [
			get_permalink( $post ),
			$oldLink,
			home_url( '/' ),
			get_post_type_archive_link( $post->post_type ),
			'post' === $post->post_type && get_option( 'page_for_posts' ) ? get_permalink( get_option( 'page_for_posts' ) ) : '',
		] );
		// The post's own pages (/2/, /comment-page-2/); every list showing it, with its numbered pages. A static front page
		// is a list here: under the home page's folder, numbered folders are /2026/… — other posts.
		foreach ( $urls as $i => $url ) {
			$this->purge_url( $url, $i < 2 && untrailingslashit( $url ) !== untrailingslashit( home_url( '/' ) ) ? 'post' : 'list' );
		}
		// Blog posts are also listed by author and by date — the ones before this save too, if it changed them.
		if ( 'post' === $post->post_type ) {
			foreach ( array_unique( [ $post->post_author . '|' . $post->post_date, $oldList ? $oldList : $post->post_author . '|' . $post->post_date ] ) as $list ) {
				list( $author, $date ) = explode( '|', $list, 2 );
				$time                  = strtotime( $date );
				foreach ( [ get_author_posts_url( (int) $author ), get_year_link( gmdate( 'Y', $time ) ), get_month_link( gmdate( 'Y', $time ), gmdate( 'm', $time ) ), get_day_link( gmdate( 'Y', $time ), gmdate( 'm', $time ), gmdate( 'd', $time ) ) ] as $url ) {
					$this->purge_url( $url, 'list' );
				}
			}
		}
		// Its categories, tags, product categories… (and their parents, which list it too).
		foreach ( get_object_taxonomies( $post->post_type ) as $taxonomy ) {
			$this->purge_terms( $post->ID, [], wp_get_object_terms( $post->ID, $taxonomy, [ 'fields' => 'tt_ids' ] ), $taxonomy );
		}
		// "Always purge these URLs": pages that list posts in a way no rule can see (a "Latest posts" block on a landing
		// page). Entries are kept as readable text; "/landing/*" is that page and everything under it.
		foreach ( array_filter( array_map( 'trim', explode( ',', $this->s['caching']['alwaysPurge'] ) ) ) as $entry ) {
			// Encoded before parse_url(), which turns some bytes of a Bengali (UTF-8) address into "_".
			$entry = preg_replace_callback( '/[^\x21-\x7e]+/', function ( $m ) { return rawurlencode( $m[0] ); }, $entry );
			$path  = trim( (string) wp_parse_url( $entry, PHP_URL_PATH ), '/' );
			$wide  = '*' === substr( $path, -1 );
			$path  = implode( '/', array_map( function ( $s ) { return rawurlencode( rawurldecode( $s ) ); }, array_filter( explode( '/', rtrim( $path, '*/' ) ), 'strlen' ) ) );
			// From the host root, like "Never cache these URLs" (a site in /blog: "/blog/landing/").
			$url  = preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . '/' . ( '' === $path ? '' : $path . '/' );
			if ( $wide ) {
				$this->rrmdir( $this->url_dir( $url ) );
			} else {
				$this->purge_url( $url, 'list' );
			}
		}

		// One loopback per save: WordPress ignores the same single event scheduled again within 10 minutes.
		if ( 'publish' === $new_status && $this->pageCache && $this->s['caching']['rebuildOnSave'] ) {
			// Rebuild the current URLs; skip the old one only when the slug really changed (it would just 404).
			$gone = $oldLink && $oldLink !== get_permalink( $post ) ? [ $oldLink ] : [];
			wp_schedule_single_event( time() + 5, self::REBUILD_HOOK, [ array_values( array_unique( array_diff( $urls, $gone ) ) ) ] );
		}
	}

	/** Before an update or trash the post still has its old URL — remember it so that copy is purged. */
	public function remember_permalink( $post_id ) {
		// Keep the first one: when trashing, WordPress renames the slug to "…__trashed" before pre_post_update fires.
		if ( ! isset( $this->oldLinks[ $post_id ] ) && 'publish' === get_post_status( $post_id ) ) {
			$this->oldLinks[ $post_id ] = get_permalink( $post_id );
			// Its author and date, whose archives list it until this save moves it; its title (page lists).
			$this->oldLists[ $post_id ]  = get_post_field( 'post_author', $post_id ) . '|' . get_post_field( 'post_date', $post_id );
			$this->oldTitles[ $post_id ] = (string) get_post_field( 'post_title', $post_id );
		}
	}

	/** Deleting a published post (without trash) — its URL still resolves here, after it does not. */
	public function on_delete_post( $post_id ) {
		if ( 'publish' === get_post_status( $post_id ) ) {
			// Every page that shows it, as for an unpublish: the archives, its terms, the author and date lists.
			$this->on_post_status( 'trash', 'publish', get_post( $post_id ) );
		}
	}

	/**
	 * comment_post ( $id, $approved ), wp_set_comment_status ( $id, 'approve'|'hold'|'spam'|'trash' ), edit_comment ( $id )
	 * and delete_comment ( $id ).
	 */
	public function on_comment( $comment_id, $approved = 1 ) {
		// A new comment held for moderation or caught as spam shows nowhere: a spam wave must not keep the post uncached.
		if ( doing_action( 'comment_post' ) && 1 !== (int) $approved ) {
			return;
		}
		$comment = get_comment( $comment_id );
		// Deleting one that was not shown (spam, held, already in the trash) changes nothing on the page.
		if ( $comment && ! ( doing_action( 'delete_comment' ) && '1' !== (string) $comment->comment_approved ) ) {
			// Its comment pages too (/comment-page-2/); a static front page keeps the posts under its folder.
			$link = get_permalink( $comment->comment_post_ID );
			$this->purge_url( $link, untrailingslashit( (string) $link ) !== untrailingslashit( home_url( '/' ) ) ? 'post' : '' );
		}
	}

	/**
	 * set_object_terms, and on_post_status() for the post's current terms: the archive of each term (and of its parents,
	 * which list the post too). Only for a published post — a draft is listed nowhere yet — or during its (un)publish.
	 */
	public function purge_terms( $object_id, $terms, $tt_ids, $taxonomy, $append = false, $old_tt_ids = [] ) {
		$tax  = get_taxonomy( $taxonomy );
		$post = get_post( $object_id );
		// A user or a link with a public taxonomy shares the number with some post: only a post of a type using the taxonomy.
		if ( ! $tax || ! $tax->public || ! $post || ! is_object_in_taxonomy( $post->post_type, $taxonomy ) || ! is_post_type_viewable( $post->post_type ) || ( 'publish' !== $post->post_status && ! doing_action( 'transition_post_status' ) && ! doing_action( 'before_delete_post' ) ) ) {
			return;
		}
		foreach ( array_unique( array_map( 'intval', array_merge( (array) $tt_ids, (array) $old_tt_ids ) ) ) as $tt ) {
			$term = get_term_by( 'term_taxonomy_id', $tt, $taxonomy );
			if ( ! $term ) {
				continue;
			}
			foreach ( array_merge( [ $term->term_id ], get_ancestors( $term->term_id, $taxonomy, 'taxonomy' ) ) as $id ) {
				$link = get_term_link( (int) $id, $taxonomy );
				if ( is_string( $link ) ) {
					$this->purge_url( $link, 'list' );
				}
			}
		}
	}

	/**
	 * WooCommerce: stock changed (an order, a refund, an import), or the product was saved without wp_update_post() (a price,
	 * a sale starting or ending by cron, the REST API). A quantity ("3 in stock") shows on the product page only; anything
	 * else (stock status, price…) also in the shop and category lists: then as if the product was saved. Once per product
	 * and kind per request — an order fires several of these for each line, and an admin save already ran on_post_status().
	 */
	public function on_product_change( $product ) {
		$product = is_numeric( $product ) ? wc_get_product( $product ) : $product;
		if ( ! is_object( $product ) || ! method_exists( $product, 'get_parent_id' ) ) {
			return;
		}
		// A variation has no page of its own: its product's.
		$post = get_post( $product->get_parent_id() ? $product->get_parent_id() : $product->get_id() );
		if ( ! $post ) {
			return;
		}
		if ( doing_action( 'woocommerce_product_before_set_stock' ) || doing_action( 'woocommerce_variation_before_set_stock' ) ) {
			$this->stockOnly[ $post->ID ] = true;
			return;
		}
		$quantity = doing_action( 'woocommerce_product_set_stock' ) || doing_action( 'woocommerce_variation_set_stock' );
		// The save() inside wc_update_product_stock() is the quantity too (a stock status change fires its own hook).
		$full = ! $quantity && ! ( isset( $this->stockOnly[ $post->ID ] ) && ( doing_action( 'woocommerce_update_product' ) || doing_action( 'woocommerce_update_product_variation' ) ) );
		if ( $quantity ) {
			unset( $this->stockOnly[ $post->ID ] );
		}
		if ( 'publish' !== $post->post_status || ! empty( $this->productSeen[ $post->ID ]['full'] ) || ( ! $full && ! empty( $this->productSeen[ $post->ID ]['page'] ) ) ) {
			return;
		}
		if ( $full ) {
			$this->on_post_status( 'publish', 'publish', $post );
		} else {
			$this->productSeen[ $post->ID ]['page'] = true;
			$this->purge_url( get_permalink( $post ), 'post' );
		}
	}

	/**
	 * edit_terms ( $term_id, $taxonomy ): remember the archive addresses (slug and parent may change). edited_term ( $term_id,
	 * $tt_id, $taxonomy ) and pre_delete_term ( $term_id, $taxonomy ): purge them, the new ones, the home page, and the posts
	 * that show the term's name (up to 200: a bigger term's posts follow on their next rebuild or expiry).
	 */
	public function on_term_change( $term_id, $a = '', $b = '' ) {
		$taxonomy = doing_action( 'edited_term' ) ? $b : $a;
		$tax      = get_taxonomy( $taxonomy );
		if ( ! $tax || ! $tax->public || ! $tax->publicly_queryable ) {
			return;
		}
		$links = [];
		foreach ( array_merge( [ (int) $term_id ], get_ancestors( (int) $term_id, $taxonomy, 'taxonomy' ) ) as $id ) {
			$link = get_term_link( $id, $taxonomy );
			if ( is_string( $link ) ) {
				$links[] = $link;
			}
		}
		if ( doing_action( 'edit_terms' ) ) {
			$this->oldTermLinks[ $term_id ] = $links;
			return;
		}
		$links = array_unique( array_merge( $links, $this->oldTermLinks[ $term_id ] ?? [] ) );
		unset( $this->oldTermLinks[ $term_id ] );
		foreach ( $links as $link ) {
			$this->purge_url( $link, 'list' );
		}
		$objects = get_objects_in_term( (int) $term_id, $taxonomy );
		foreach ( is_array( $objects ) ? array_slice( $objects, 0, 200 ) : [] as $id ) {
			if ( 'publish' === get_post_status( $id ) && is_post_type_viewable( (string) get_post_type( $id ) ) ) {
				$link = get_permalink( $id );
				// A static front page is a list here (its folder holds the /2026/… posts).
				$this->purge_url( $link, untrailingslashit( (string) $link ) !== untrailingslashit( home_url( '/' ) ) ? 'post' : 'list' );
			}
		}
		$this->purge_url( home_url( '/' ), 'list' );
	}

	/** profile_update ( $user_id, $old_user ): a new display name or author slug — the archive (both addresses) and the bylines. */
	public function on_author_change( $user_id, $old = null ) {
		$user = get_userdata( $user_id );
		if ( ! $user || ! $old instanceof \WP_User || ( $user->display_name === $old->display_name && $user->user_nicename === $old->user_nicename ) ) {
			return;
		}
		$posts = get_posts( [
			'author'                 => $user_id,
			'post_type'              => array_values( array_diff( get_post_types( [ 'public' => true ] ), [ 'attachment' ] ) ),
			'post_status'            => 'publish',
			'numberposts'            => 200,
			'fields'                 => 'ids',
			'orderby'                => 'modified',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		] );
		// No published posts: the name is shown nowhere a visitor can reach.
		if ( ! $posts ) {
			return;
		}
		$this->purge_url( get_author_posts_url( $user_id, $old->user_nicename ), 'list' );
		$this->purge_url( get_author_posts_url( $user_id ), 'list' );
		foreach ( $posts as $id ) {
			$link = get_permalink( $id );
			$this->purge_url( $link, untrailingslashit( (string) $link ) !== untrailingslashit( home_url( '/' ) ) ? 'post' : 'list' );
		}
		$this->purge_url( home_url( '/' ), 'list' );
	}

	/**
	 * updated_option: a setting every page shows (title, tagline, permalinks, front page, language, dates, comment paging,
	 * shop currency and prices) or a widget's content (block widgets are stored per widget, not in sidebars_widgets).
	 */
	public function on_site_option( $option ) {
		$all = [ 'blogname', 'blogdescription', 'home', 'permalink_structure', 'category_base', 'tag_base', 'show_on_front', 'page_on_front', 'page_for_posts', 'posts_per_page', 'site_icon', 'WPLANG', 'date_format', 'time_format', 'timezone_string', 'gmt_offset', 'start_of_week', 'page_comments', 'comments_per_page', 'default_comments_page', 'comment_order', 'thread_comments', 'woocommerce_currency', 'woocommerce_currency_pos', 'woocommerce_price_thousand_sep', 'woocommerce_price_decimal_sep', 'woocommerce_price_num_decimals', 'woocommerce_tax_display_shop', 'woocommerce_prices_include_tax' ];
		if ( in_array( $option, $all, true ) || 0 === strpos( (string) $option, 'widget_' ) || 0 === strpos( (string) $option, 'theme_mods_' ) ) {
			$this->purge_all();
		} elseif ( 'sticky_posts' === $option ) {
			// Sticky posts lead the blog's first page only.
			$this->purge_url( home_url( '/' ), 'list' );
			if ( get_option( 'page_for_posts' ) ) {
				$this->purge_url( get_permalink( get_option( 'page_for_posts' ) ), 'list' );
			}
		}
	}

	/** wp_after_insert_post: this save is complete — the once-per-request guard covers one save only. */
	public function on_save_done( $post_id ) {
		unset( $this->productSeen[ $post_id ] );
	}

	/** delete_attachment: the published posts (up to 200) that use this image as their featured image. */
	public function on_attachment_delete( $attachment_id ) {
		$posts = get_posts( [
			'post_type'              => 'any',
			'post_status'            => 'publish',
			'numberposts'            => 200,
			'fields'                 => 'ids',
			'meta_key'               => '_thumbnail_id', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- only when an image is deleted.
			'meta_value'             => (int) $attachment_id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		] );
		foreach ( $posts as $id ) {
			$this->on_post_status( 'publish', 'publish', get_post( $id ) );
		}
	}

	/** added/updated/deleted_post_meta ( $meta_id, $post_id, $meta_key ): a published post's featured image, as a save would. */
	public function on_post_meta( $meta_id, $post_id, $meta_key ) {
		if ( '_thumbnail_id' !== $meta_key || ! empty( $this->productSeen[ $post_id ]['full'] ) ) {
			return;
		}
		$post = get_post( $post_id );
		if ( $post && 'publish' === $post->post_status ) {
			$this->on_post_status( 'publish', 'publish', $post );
		}
	}

	/** "Rebuild pages after saving": request the purged pages once so the next visitor gets a cached copy. */
	public function rebuild( $urls ) {
		foreach ( (array) $urls as $url ) {
			$this->fetch( $url );
		}
	}

	/* =====================================================================
	 * Admin bar: "bBlocks Cache"
	 * ===================================================================== */

	/** The menu. On a front-end view, or the editor of a published post, it also reports on and acts on that page. */
	public function admin_bar_cache_menu( $bar ) {
		if ( ! current_user_can( 'manage_options' ) || ! is_admin_bar_showing() ) {
			return;
		}

		$url     = '';
		$post    = null;
		$reason  = '';
		$pending = false;
		if ( is_admin() ) {
			$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which post the editor shows, read only.
			$edited = $screen && 'post' === $screen->base && isset( $_GET['post'] ) ? get_post( absint( $_GET['post'] ) ) : null;
			if ( $edited && 'publish' === $edited->post_status && is_post_type_viewable( $edited->post_type ) ) {
				$post = $edited;
				$url  = get_permalink( $edited );
			} else {
				// A draft (or a new post) in the editor: the page items are printed hidden, and the script fills them in
				// with the address once the post is published — no reload needed.
				$pending = $screen && 'post' === $screen->base && is_post_type_viewable( $screen->post_type );
			}
		} else {
			// The address as the page cache keys it: the request path, and only "Allowed query parameters".
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only.
			$query = array_map( 'sanitize_text_field', wp_unslash( (array) $_GET ) );
			unset( $query['bblocks_cache_done'], $query['bblocks_cache_counts'] ); // the message after one of this menu's own actions
			$allowed = array_filter( array_map( 'trim', explode( ',', $this->s['caching']['allowedQuery'] ) ) );
			// The address being viewed (…/2/, /comment-page-2/, ?lang=… each have their own copy); the post only for its rules.
			$post = is_singular() ? get_queried_object() : null;
			$home = wp_parse_url( home_url() );
			$path = (string) wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) ), PHP_URL_PATH );
			$url  = add_query_arg( array_map( 'rawurlencode', array_intersect_key( $query, array_flip( $allowed ) ) ), $home['scheme'] . '://' . $home['host'] . ( isset( $home['port'] ) ? ':' . $home['port'] : '' ) . ( '' === $path ? '/' : $path ) );
			if ( is_search() ) {
				$reason = __( 'search results', 'b-blocks' );
			} elseif ( is_404() ) {
				$reason = __( 'page not found', 'b-blocks' );
			} elseif ( is_preview() ) {
				$reason = __( 'preview', 'b-blocks' );
			} elseif ( array_diff( array_keys( $query ), $allowed ) ) {
				$reason = __( 'excluded by its query parameters', 'b-blocks' );
			}
		}

		$base = wp_nonce_url( admin_url( 'admin-post.php?action=bblocks_cache' ), 'bblocks_cache' );
		// The admin bar escapes every href itself (esc_url), and prints titles as given — so titles are escaped here.
		$bar->add_node( [
			'id'    => 'bblocks-cache',
			'title' => esc_html__( 'bBlocks Cache', 'b-blocks' ),
			'href'  => admin_url( 'admin.php?page=b-blocks#/settings/performance/caching' ),
		] );
		// The same numbers as the Caching screen. stats() walks the whole cache folder, so it is kept for a minute
		// (this menu's own actions drop it at once).
		$stats = get_transient( 'bblocks_cache_stats' );
		if ( ! is_array( $stats ) ) {
			$stats = $this->stats();
			set_transient( 'bblocks_cache_stats', $stats, MINUTE_IN_SECONDS );
		}
		$bar->add_node( [
			'parent' => 'bblocks-cache',
			'id'     => 'bblocks-cache-summary',
			/* translators: 1: number of cached copies, 2: their size on disk, e.g. "1.20 MB". */
			'title'  => esc_html( sprintf( __( '%1$d pages cached · %2$s', 'b-blocks' ), $stats['pages'], $stats['bytes'] ) ),
		] );
		if ( $url ) {
			$status = $this->cache_status( $url, $post, $reason );
			$state  = $status['state'];
			$bar->add_node( [
				'parent' => 'bblocks-cache',
				'id'     => 'bblocks-cache-status',
				'title'  => esc_html( $status['text'] ),
				'meta'   => [ 'class' => 'bblocks-cache-' . $state ],
			] );
			// Shown or hidden by state, and swapped in place by the script after an action. Also there while this page
			// is excluded only by its own "Never cache" entry, since "Allow caching this page" makes it cacheable again.
			if ( 'no' !== $state || $status['exact'] ) {
				foreach ( [
					'page'       => [ __( 'Cache this page now', 'b-blocks' ), 'cache_page', in_array( $state, [ 'not', 'partial' ], true ) ],
					'clear-page' => [ __( 'Clear this page', 'b-blocks' ), 'purge_page', in_array( $state, [ 'cached', 'partial' ], true ) ],
					'never'      => [ __( 'Never cache this page', 'b-blocks' ), 'never', 'no' !== $state ],
					'allow'      => [ __( 'Allow caching this page', 'b-blocks' ), 'allow', 'no' === $state ],
				] as $id => list( $title, $do, $shown ) ) {
					$bar->add_node( [
						'parent' => 'bblocks-cache',
						'id'     => 'bblocks-cache-' . $id,
						'title'  => esc_html( $title ),
						'href'   => add_query_arg( [ 'do' => $do, 'url' => rawurlencode( $url ) ], $base ),
						'meta'   => [ 'class' => $shown ? '' : 'bblocks-cache-hidden' ],
					] );
				}
			} elseif ( '' !== $status['exclude'] ) {
				// Excluded by a wider pattern: that is changed on the settings screen, not here.
				$bar->add_node( [
					'parent' => 'bblocks-cache',
					'id'     => 'bblocks-cache-pattern',
					/* translators: %s: a "Never cache these URLs" pattern, e.g. "/shop/*". */
					'title'  => esc_html( sprintf( __( 'Excluded by "%s" — change it in Cache settings', 'b-blocks' ), $status['exclude'] ) ),
				] );
			}
		} elseif ( $pending ) {
			$bar->add_node( [
				'parent' => 'bblocks-cache',
				'id'     => 'bblocks-cache-status',
				'title'  => '',
				'meta'   => [ 'class' => 'bblocks-cache-hidden' ],
			] );
			foreach ( [ 'page' => [ __( 'Cache this page now', 'b-blocks' ), 'cache_page' ], 'clear-page' => [ __( 'Clear this page', 'b-blocks' ), 'purge_page' ], 'never' => [ __( 'Never cache this page', 'b-blocks' ), 'never' ], 'allow' => [ __( 'Allow caching this page', 'b-blocks' ), 'allow' ] ] as $id => list( $title, $do ) ) {
				$bar->add_node( [
					'parent' => 'bblocks-cache',
					'id'     => 'bblocks-cache-' . $id,
					'title'  => esc_html( $title ),
					'href'   => add_query_arg( [ 'do' => $do, 'url' => '' ], $base ),
					'meta'   => [ 'class' => 'bblocks-cache-hidden' ],
				] );
			}
		}
		$bar->add_node( [
			'parent' => 'bblocks-cache',
			'id'     => 'bblocks-cache-purge',
			'title'  => esc_html__( 'Clear entire cache', 'b-blocks' ),
			'href'   => add_query_arg( 'do', 'purge_all', $base ),
		] );
		$bar->add_node( [
			'parent' => 'bblocks-cache',
			'id'     => 'bblocks-cache-preload',
			'title'  => esc_html__( 'Preload all pages now', 'b-blocks' ),
			'href'   => add_query_arg( 'do', 'preload', $base ),
		] );
		$bar->add_node( [
			'parent' => 'bblocks-cache',
			'id'     => 'bblocks-cache-settings',
			'title'  => esc_html__( 'Cache settings', 'b-blocks' ),
			'href'   => admin_url( 'admin.php?page=b-blocks#/settings/performance/caching' ),
		] );
	}

	/**
	 * "This page: …" for one URL, by the rules store_page() applies, and from the files on disk: the admin
	 * looking at the menu is logged in, and logged-in visitors are never served from the cache.
	 */
	private function cache_status( $url, $post = null, $reason = '' ) {
		$c = $this->s['caching'];
		// The Posts page and the shop are archives to store_page() (not singular), whatever page they are built from.
		if ( $post && in_array( (int) $post->ID, array_filter( [ (int) get_option( 'page_for_posts' ), function_exists( 'wc_get_page_id' ) ? (int) wc_get_page_id( 'shop' ) : 0 ] ), true ) ) {
			$post = null;
		}
		// A query parameter that is not allowed (plain permalinks, ?p=123) is never cached.
		$query = [];
		parse_str( (string) wp_parse_url( $url, PHP_URL_QUERY ), $query );
		if ( '' === $reason && array_diff( array_keys( $query ), array_filter( array_map( 'trim', explode( ',', $c['allowedQuery'] ) ) ) ) ) {
			$reason = __( 'excluded by its query parameters', 'b-blocks' );
		}
		if ( '' === $reason && $post ) {
			if ( '' !== (string) $post->post_password ) {
				$reason = __( 'password protected', 'b-blocks' );
			} elseif ( 'publish' !== $post->post_status ) {
				$reason = __( 'not published', 'b-blocks' );
			} elseif ( function_exists( 'wc_get_page_id' ) && in_array( (int) $post->ID, array_map( 'intval', [ wc_get_page_id( 'cart' ), wc_get_page_id( 'checkout' ), wc_get_page_id( 'myaccount' ) ] ), true ) ) {
				$reason = __( 'cart, checkout or account page', 'b-blocks' );
			}
		}
		if ( '' === $reason && 'bblocks' === $c['cacheWhich'] && ! ( $post && $this->uses_bblocks( $post ) ) ) {
			$reason = $post ? __( 'not built with bBlocks', 'b-blocks' ) : __( 'only pages built with bBlocks are cached', 'b-blocks' );
		}
		// "Never cache these URLs": which entry, and whether it is this exact page (the menu can then remove it again).
		$path    = (string) wp_parse_url( $url, PHP_URL_PATH );
		$path    = '' === $path ? '/' : $path;
		$exclude = '';
		$exact   = false;
		$wide    = false;
		// Entries are kept as readable text (a Bengali slug, not %e0%a6…): compare the decoded address too.
		foreach ( array_filter( array_map( 'trim', explode( ',', $c['neverCache'] ) ) ) as $pattern ) {
			$regex = '#^' . str_replace( '\*', '.*', preg_quote( '/' . ltrim( $pattern, '/' ), '#' ) ) . '$#i';
			foreach ( array_unique( [ $path, rawurldecode( $path ) ] ) as $p ) {
				if ( preg_match( $regex, $p ) || preg_match( $regex, untrailingslashit( $p ) ) || preg_match( $regex, trailingslashit( $p ) ) ) {
					$own     = false === strpos( $pattern, '*' ) && trim( $pattern, '/' ) === trim( $p, '/' );
					$exclude = '' === $exclude || ! $own ? $pattern : $exclude;
					$exact   = $exact || $own;
					$wide    = $wide || ! $own;
					break;
				}
			}
		}
		// "Allow caching this page" only when nothing but this page's own entry excludes it.
		$exact = $exact && ! $wide;
		if ( '' === $reason && '' !== $exclude ) {
			/* translators: %s: the "Never cache these URLs" entry that matches this page, e.g. "/shop/*". */
			$reason = sprintf( __( 'excluded by "Never cache these URLs" (%s)', 'b-blocks' ), $exclude );
		}
		if ( '' !== $reason ) {
			return [
				'state'   => 'no',
				/* translators: %s: why the page cannot be cached, e.g. "password protected". */
				'text'    => sprintf( __( 'This page: not cacheable — %s', 'b-blocks' ), $reason ),
				'reason'  => $reason,
				'exclude' => $exclude,
				'exact'   => $exact,
			];
		}

		// Each copy a visitor can be served (request_cache_path() names): desktop and phone, with and without WebP,
		// and an allowed query string in its own file.
		ksort( $query );
		$name   = $this->url_dir( $url ) . ( '/' === substr( $path, -1 ) ? 'index' : 'page' );
		$q      = $query ? '-' . md5( http_build_query( $query ) ) : '';
		$copies = [ '' => __( 'desktop', 'b-blocks' ) ];
		if ( $this->s['images']['webp'] ) {
			$copies['-webp'] = __( 'desktop WebP', 'b-blocks' );
		}
		if ( $c['separateMobile'] ) {
			$copies['-mobile'] = __( 'mobile', 'b-blocks' );
			if ( $this->s['images']['webp'] ) {
				$copies['-mobile-webp'] = __( 'mobile WebP', 'b-blocks' );
			}
		}
		$time    = 0;
		$missing = [];
		foreach ( $copies as $suffix => $label ) {
			$file = $name . $suffix . $q . '.html';
			if ( file_exists( $file ) && $this->is_fresh( $file ) ) {
				$time = max( $time, filemtime( $file ) );
			} else {
				$missing[] = $label;
			}
		}
		if ( ! $time ) {
			return [ 'state' => 'not', 'text' => __( 'This page: not cached', 'b-blocks' ), 'exclude' => '', 'exact' => false, 'time' => 0, 'missing' => $missing ];
		}
		$text = __( 'This page: cached · just now', 'b-blocks' );
		if ( time() - $time >= MINUTE_IN_SECONDS ) {
			/* translators: %s: how long ago the page was cached, e.g. "12 mins". */
			$text = sprintf( __( 'This page: cached · %s ago', 'b-blocks' ), human_time_diff( $time ) );
		}
		if ( $missing ) {
			/* translators: %s: the copies not built yet, e.g. "mobile, mobile WebP". */
			return [ 'state' => 'partial', 'text' => $text . ' · ' . sprintf( __( '%s missing', 'b-blocks' ), implode( ', ', $missing ) ), 'exclude' => '', 'exact' => false, 'time' => $time, 'missing' => $missing ];
		}
		$kinds = [ __( 'desktop', 'b-blocks' ) ];
		if ( $c['separateMobile'] ) {
			$kinds[] = __( 'mobile', 'b-blocks' );
		}
		if ( $this->s['images']['webp'] ) {
			$kinds[] = __( 'WebP', 'b-blocks' );
		}
		return [ 'state' => 'cached', 'text' => $text . ' · ' . implode( ', ', $kinds ), 'exclude' => '', 'exact' => false, 'time' => $time, 'missing' => [] ];
	}

	/**
	 * admin-post.php (a plain link, then back to the page) and admin-ajax.php (the menu's script, JSON) — same code.
	 * do: purge_all | purge_page | cache_page | status, url: one of this site's pages.
	 */
	public function cache_action() {
		$ajax  = wp_doing_ajax();
		$nonce = sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ?? '' ) );
		if ( ! wp_verify_nonce( $nonce, 'bblocks_cache' ) || ! current_user_can( 'manage_options' ) ) {
			if ( $ajax ) {
				wp_send_json_error( [ 'message' => __( 'Invalid Request', 'b-blocks' ) ], 403 );
			}
			wp_die( esc_html__( 'Invalid Request', 'b-blocks' ), '', [ 'response' => 403, 'back_link' => true ] );
		}

		$do  = sanitize_key( wp_unslash( $_REQUEST['do'] ?? '' ) );
		$url = esc_url_raw( wp_unslash( $_REQUEST['url'] ?? '' ) );
		// This site's own pages only: the host and the port (another port on this host is another server).
		$home = wp_parse_url( home_url() );
		$to   = wp_parse_url( $url );
		if ( ! $to || strtolower( $to['host'] ?? '' ) !== strtolower( $home['host'] ?? '' ) || ( $to['port'] ?? '' ) !== ( $home['port'] ?? '' ) ) {
			$url = '';
		}
		$id = $url ? url_to_postid( $url ) : 0;

		// "Never/Allow caching this page" changes a setting: without the script, ask first on a page of its own.
		if ( in_array( $do, [ 'never', 'allow' ], true ) && $url && ! $ajax && empty( $_POST['confirm'] ) ) {
			wp_die(
				sprintf(
					'<form method="post" action="%1$s"><p>%2$s</p><p><code>%3$s</code></p><input type="hidden" name="action" value="bblocks_cache"><input type="hidden" name="do" value="%4$s"><input type="hidden" name="url" value="%5$s"><input type="hidden" name="confirm" value="1">%6$s<p><button type="submit" class="button button-primary">%7$s</button> <a class="button" href="%8$s">%9$s</a></p></form>',
					esc_url( admin_url( 'admin-post.php' ) ),
					esc_html( 'never' === $do ? __( 'Never cache this page? It is added to "Never cache these URLs" under Performance → Caching, and its cached copies are removed.', 'b-blocks' ) : __( 'Allow caching this page again? Its entry is removed from "Never cache these URLs" under Performance → Caching.', 'b-blocks' ) ),
					esc_html( (string) wp_parse_url( $url, PHP_URL_PATH ) ),
					esc_attr( $do ),
					esc_attr( $url ),
					// The page the admin came from, so the redirect after confirming goes back there.
					wp_nonce_field( 'bblocks_cache', '_wpnonce', false, false ) . '<input type="hidden" name="_wp_http_referer" value="' . esc_attr( wp_get_referer() ? wp_get_referer() : admin_url() ) . '">',
					esc_html( 'never' === $do ? __( 'Never cache this page', 'b-blocks' ) : __( 'Allow caching this page', 'b-blocks' ) ),
					esc_url( wp_get_referer() ? wp_get_referer() : admin_url() ),
					esc_html__( 'Cancel', 'b-blocks' )
				),
				esc_html__( 'bBlocks Cache', 'b-blocks' ),
				[ 'response' => 200 ]
			);
		}

		$ok     = true;
		$counts = null;
		if ( 'purge_all' === $do ) {
			$this->purge_all();
			// Build the most visited pages again a minute later (one run; WordPress drops a duplicate within 10 minutes).
			if ( $this->s['caching']['background'] ) {
				wp_schedule_single_event( time() + MINUTE_IN_SECONDS, self::PRELOAD_HOOK, [ 'warm' ] );
			}
		} elseif ( 'purge_page' === $do && $url ) {
			$this->purge_url( $url );
		} elseif ( 'cache_page' === $do && $url ) {
			// Only the copies that are missing or stale: Clear this page first to rebuild them all.
			$this->fetch( $url ); // a visitor's request: no cookies, so exactly what a visitor would be served
			// Cached = every copy a visitor can be served exists, by the same rules the menu shows.
			$ok = 'cached' === $this->cache_status( $url, $id ? get_post( $id ) : null )['state'];
		} elseif ( 'preload' === $do ) {
			$counts = $this->preload( true );
			$ok     = false !== $counts;
		} elseif ( in_array( $do, [ 'never', 'allow' ], true ) && $url ) {
			// The same rules as a save on the Performance screen: sanitize, store, reschedule; then this page's copies go.
			$path = (string) wp_parse_url( $url, PHP_URL_PATH );
			$path = '' === $path ? '/' : $path;
			// Stored as readable text: sanitize() would delete %XX octets (a Bengali slug would become "//", the home page).
			$entry = sanitize_text_field( rawurldecode( $path ) );
			if ( '' === trim( $entry, '/' ) && '/' !== $path ) {
				$ok = false;
			} else {
				$s     = self::settings();
				$list  = array_values( array_filter( array_map( 'trim', explode( ',', $s['caching']['neverCache'] ) ) ) );
				$other = array_values( array_filter( $list, function ( $item ) use ( $path, $entry ) {
					return false !== strpos( $item, '*' ) || ! in_array( trim( $item, '/' ), [ trim( $path, '/' ), trim( $entry, '/' ) ], true );
				} ) );
				$s['caching']['neverCache'] = implode( ', ', 'never' === $do ? array_merge( $other, [ $entry ] ) : $other );
				$this->s = self::sanitize( $s );
				update_option( self::OPTION, $this->s, true );
				$this->schedule_preload();
				$this->purge_url( $url );
				// Done only if the page really is (not) excluded now — "Allow" cannot lift a wider pattern.
				$now = $this->cache_status( $url, $id ? get_post( $id ) : null );
				$ok  = 'never' === $do ? 'no' === $now['state'] : 'no' !== $now['state'];
			}
		} elseif ( 'status' !== $do || ! $url ) {
			$ok = false;
		}

		// The summary line is stale after any action.
		delete_transient( 'bblocks_cache_stats' );
		if ( $ajax ) {
			$stats = $this->stats();
			set_transient( 'bblocks_cache_stats', $stats, MINUTE_IN_SECONDS );
			wp_send_json_success( [
				'ok'      => $ok,
				'status'  => $url ? $this->cache_status( $url, $id ? get_post( $id ) : null ) : null,
				/* translators: 1: number of cached copies, 2: their size on disk. */
				'summary' => sprintf( __( '%1$d pages cached · %2$s', 'b-blocks' ), $stats['pages'], $stats['bytes'] ),
				'counts'  => $counts,
			] );
		}
		// An unknown request gets no message at all, rather than a wrong one.
		$back = remove_query_arg( [ 'bblocks_cache_done', 'bblocks_cache_counts', 'bblocks_cache_bulk', 'bblocks_cache_why' ], wp_get_referer() ? wp_get_referer() : admin_url() );
		if ( in_array( $do, [ 'purge_all', 'purge_page', 'cache_page', 'preload', 'never', 'allow' ], true ) ) {
			$back = add_query_arg( 'bblocks_cache_done', $ok ? $do : ( 'preload' === $do ? 'busy' : 'failed' ), $back );
			if ( $counts ) {
				$back = add_query_arg( 'bblocks_cache_counts', implode( '-', $counts ), $back );
			}
		}
		wp_safe_redirect( $back );
		exit;
	}

	/** The menu's script (actions without a reload) and its few styles — only where the menu shows. */
	public function cache_menu_assets() {
		if ( ! current_user_can( 'manage_options' ) || ! is_admin_bar_showing() ) {
			return;
		}
		wp_enqueue_script( 'bblocks-cache-menu', B_BLOCKS_ASSETS . 'js/cache-menu.js', [], B_BLOCKS_VERSION, true );
		// "Delay JavaScript until user interaction" must not hold the menu's own script back.
		add_filter( 'wp_script_attributes', [ $this, 'cache_menu_keep' ] );
		add_filter( 'wp_inline_script_attributes', [ $this, 'cache_menu_keep' ] );
		wp_localize_script( 'bblocks-cache-menu', 'bBlocksCacheMenu', [
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'bblocks_cache' ),
			'rebuild' => (bool) $this->s['caching']['rebuildOnSave'],
			'strings' => [
				'working'    => __( 'Working…', 'b-blocks' ),
				'purge_all'  => __( 'Cache cleared', 'b-blocks' ),
				'purge_page' => __( 'Page cleared from the cache', 'b-blocks' ),
				'cache_page' => __( 'Page cached', 'b-blocks' ),
				'failed'     => __( 'Could not cache this page — it may be excluded', 'b-blocks' ),
				'error'      => __( 'Something went wrong — try again', 'b-blocks' ),
				'expired'    => __( 'Your session expired — reload the page and try again', 'b-blocks' ),
				'never'      => __( 'This page will not be cached any more', 'b-blocks' ),
				'allow'      => __( 'This page can be cached again', 'b-blocks' ),
				/* translators: 1: pages cached now, 2: pages that were cached already, 3: pages that could not be cached. */
				'preload'    => __( 'Preload: %1$d pages cached, %2$d already cached, %3$d failed', 'b-blocks' ),
				'busy'       => __( 'A preload is already running — try again in a few minutes', 'b-blocks' ),
				'askNever'   => __( 'Never cache this page? It is added to "Never cache these URLs" under Performance → Caching, and its cached copies are removed.', 'b-blocks' ),
				'askAllow'   => __( 'Allow caching this page again? Its entry is removed from "Never cache these URLs".', 'b-blocks' ),
			],
		] );
		wp_add_inline_style( 'admin-bar', '#wpadminbar .bblocks-cache-cached>.ab-item,#wpadminbar .bblocks-cache-cached:hover>.ab-item,#wpadminbar .bblocks-cache-partial>.ab-item,#wpadminbar .bblocks-cache-partial:hover>.ab-item{color:#68de7c!important}'
			. '.bblocks-cache-muted{color:#646970;cursor:help}.column-bblocks_cache{width:9em}.bblocks-cache-col.is-cached,.bblocks-cache-col.is-partial{color:#008a20}.bblocks-cache-col.is-no{color:#996800}'
			. '#wpadminbar .bblocks-cache-not>.ab-item,#wpadminbar .bblocks-cache-not:hover>.ab-item{color:rgba(240,246,252,.6)!important}'
			. '#wpadminbar .bblocks-cache-no>.ab-item,#wpadminbar .bblocks-cache-no:hover>.ab-item{color:#f0b849!important}'
			. '#wpadminbar .bblocks-cache-hidden{display:none!important}'
			. '.bblocks-cache-toast.is-static{animation:bblocksCacheFade .4s 6s forwards}@keyframes bblocksCacheFade{to{opacity:0;visibility:hidden}}'
			. '.bblocks-cache-toast{position:fixed;inset-block-end:24px;inset-inline-end:24px;z-index:100000;padding:10px 16px;border-radius:4px;background:#1d2327;color:#fff;font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25)}' );
	}

	/** A list of posts of a viewable type, for an admin: add the row and bulk actions. */
	public function cache_list_screen() {
		$screen = get_current_screen();
		if ( ! current_user_can( 'manage_options' ) || ! $screen || ! is_post_type_viewable( $screen->post_type ) ) {
			return;
		}
		add_filter( 'post_row_actions', [ $this, 'cache_row_actions' ], 10, 2 );
		add_filter( 'page_row_actions', [ $this, 'cache_row_actions' ], 10, 2 );
		add_filter( 'bulk_actions-edit-' . $screen->post_type, [ $this, 'cache_bulk_actions' ] );
		add_filter( 'handle_bulk_actions-edit-' . $screen->post_type, [ $this, 'cache_bulk_handle' ], 10, 3 );
		add_filter( 'manage_' . $screen->post_type . '_posts_columns', [ $this, 'cache_column' ] );
		add_action( 'manage_' . $screen->post_type . '_posts_custom_column', [ $this, 'cache_column_cell' ], 10, 2 );
	}

	/** "Cache now" / "Clear cache" under a published post's title, or why it cannot be cached. */
	public function cache_row_actions( $actions, $post ) {
		// A draft's address is ?page_id=…: say why directly rather than "query parameters". Kept for the Cache column.
		$url    = 'publish' === $post->post_status ? get_permalink( $post ) : '';
		$status = $url ? $this->cache_status( $url, $post ) : [ 'state' => 'no', 'reason' => __( 'not published', 'b-blocks' ) ];
		$base   = wp_nonce_url( admin_url( 'admin-post.php?action=bblocks_cache' ), 'bblocks_cache' );

		$this->listStatus[ $post->ID ] = $status;
		if ( 'no' === $status['state'] ) {
			$actions['bblocks_cache'] = sprintf( '<span class="bblocks-cache-muted" title="%s">%s</span>', esc_attr( $status['reason'] ), esc_html__( 'Not cacheable', 'b-blocks' ) );
			return $actions;
		}
		if ( 'cached' !== $status['state'] ) {
			$actions['bblocks_cache_now'] = sprintf( '<a href="%s">%s</a>', esc_url( add_query_arg( [ 'do' => 'cache_page', 'url' => rawurlencode( $url ) ], $base ) ), esc_html__( 'Cache now', 'b-blocks' ) );
		}
		if ( 'not' !== $status['state'] ) {
			$actions['bblocks_cache_clear'] = sprintf( '<a href="%s">%s</a>', esc_url( add_query_arg( [ 'do' => 'purge_page', 'url' => rawurlencode( $url ) ], $base ) ), esc_html__( 'Clear cache', 'b-blocks' ) );
		}
		return $actions;
	}

	/** The Cache column, before Date (or last). */
	public function cache_column( $columns ) {
		$out = [];
		foreach ( $columns as $key => $label ) {
			if ( 'date' === $key ) {
				$out['bblocks_cache'] = __( 'Cache', 'b-blocks' );
			}
			$out[ $key ] = $label;
		}
		return $out + [ 'bblocks_cache' => __( 'Cache', 'b-blocks' ) ];
	}

	/** Cached · 12 mins ago / Partly cached · mobile missing / Not cached / Not cacheable (why) — the menu's rules, per row. */
	public function cache_column_cell( $column, $post_id ) {
		if ( 'bblocks_cache' !== $column ) {
			return;
		}
		$post   = get_post( $post_id );
		$url    = $post && 'publish' === $post->post_status ? get_permalink( $post ) : '';
		$status = $this->listStatus[ $post_id ] ?? ( $url ? $this->cache_status( $url, $post ) : [ 'state' => 'no', 'reason' => __( 'not published', 'b-blocks' ) ] );
		$age    = empty( $status['time'] ) ? '' : ( time() - $status['time'] < MINUTE_IN_SECONDS ? __( 'just now', 'b-blocks' ) : sprintf(
			/* translators: %s: how long ago, e.g. "12 mins". */
			__( '%s ago', 'b-blocks' ),
			human_time_diff( $status['time'] )
		) );
		if ( 'cached' === $status['state'] ) {
			printf( '<span class="bblocks-cache-col is-cached">%s</span><br><span class="bblocks-cache-muted">%s</span>', esc_html__( 'Cached', 'b-blocks' ), esc_html( $age ) );
		} elseif ( 'partial' === $status['state'] ) {
			/* translators: %s: the copies not built yet, e.g. "mobile, mobile WebP". */
			printf( '<span class="bblocks-cache-col is-partial">%s</span><br><span class="bblocks-cache-muted">%s</span>', esc_html__( 'Partly cached', 'b-blocks' ), esc_html( $age . ' · ' . sprintf( __( '%s missing', 'b-blocks' ), implode( ', ', $status['missing'] ) ) ) );
		} elseif ( 'not' === $status['state'] ) {
			printf( '<span class="bblocks-cache-col is-not">%s</span>', esc_html__( 'Not cached', 'b-blocks' ) );
		} else {
			printf( '<span class="bblocks-cache-col is-no">%s</span><br><span class="bblocks-cache-muted">%s</span>', esc_html__( 'Not cacheable', 'b-blocks' ), esc_html( $status['reason'] ) );
		}
	}

	/** `wp bblocks-cache status <url>`: the admin bar's "This page: …" line for any page of this site. */
	public function cli_status( $args ) {
		if ( ! $this->pageCache ) {
			\WP_CLI::error( __( 'The page cache is not running (Full-page cache is off, or another page cache plugin is active).', 'b-blocks' ) );
		}
		// A path or a readable (e.g. Bengali) address: encoded the way a browser sends it.
		$url = preg_replace_callback( '/[^\x21-\x7e]+/', function ( $m ) { return rawurlencode( $m[0] ); }, (string) $args[0] );
		$url = '/' === substr( $url, 0, 1 ) ? preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . $url : $url; // a path from the host root
		if ( strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) ) !== strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
			\WP_CLI::error( __( 'Not an address of this site.', 'b-blocks' ) );
		}
		$id = url_to_postid( $url );
		\WP_CLI::line( $this->cache_status( $url, $id ? get_post( $id ) : null )['text'] );
	}

	/** `wp bblocks-cache purge <url>` or `--all`. */
	public function cli_purge( $args, $assoc ) {
		if ( ! empty( $assoc['all'] ) ) {
			$this->purge_all();
			\WP_CLI::success( __( 'Cache cleared.', 'b-blocks' ) );
			return;
		}
		if ( empty( $args[0] ) ) {
			\WP_CLI::error( __( 'Give a page address, or --all.', 'b-blocks' ) );
		}
		$url = preg_replace_callback( '/[^\x21-\x7e]+/', function ( $m ) { return rawurlencode( $m[0] ); }, (string) $args[0] );
		$url = '/' === substr( $url, 0, 1 ) ? preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . $url : $url; // a path from the host root
		if ( strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) ) !== strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
			\WP_CLI::error( __( 'Not an address of this site.', 'b-blocks' ) );
		}
		$this->purge_url( $url );
		\WP_CLI::success( __( 'This page was cleared from the cache.', 'b-blocks' ) );
	}

	/** `wp bblocks-cache preload [--limit=N]`: the hourly run now, without its 25-second limit. */
	public function cli_preload( $args, $assoc ) {
		if ( isset( $assoc['limit'] ) ) {
			$this->s['caching']['pagesPerHour'] = (string) max( 1, (int) $assoc['limit'] );
		}
		$counts = $this->preload( 'cli' );
		if ( false === $counts ) {
			\WP_CLI::error( __( 'A preload is already running, or the page cache is not running.', 'b-blocks' ) );
		}
		/* translators: 1: pages cached now, 2: pages that were cached already, 3: pages that could not be cached. */
		\WP_CLI::success( sprintf( __( 'Preload: %1$d pages cached, %2$d already cached, %3$d failed.', 'b-blocks' ), $counts[0], $counts[1], $counts[2] ) );
	}

	/** `wp bblocks-cache stats`: the Caching screen's numbers. */
	public function cli_stats() {
		$stats = $this->stats();
		/* translators: 1: number of cached copies, 2: their size on disk, 3: number of consolidated stylesheets. */
		\WP_CLI::line( sprintf( __( '%1$d pages cached · %2$s · %3$d consolidated stylesheets', 'b-blocks' ), $stats['pages'], $stats['bytes'], $stats['sheets'] ) );
	}

	public function cache_bulk_actions( $actions ) {
		$actions['bblocks_cache_now']   = __( 'Cache now', 'b-blocks' );
		$actions['bblocks_cache_clear'] = __( 'Clear cache', 'b-blocks' );
		return $actions;
	}

	/** The bulk actions (WordPress has checked its own bulk-posts nonce by now): the same rules as the menu, per post. */
	public function cache_bulk_handle( $redirect, $action, $ids ) {
		if ( ! in_array( $action, [ 'bblocks_cache_now', 'bblocks_cache_clear' ], true ) || ! current_user_can( 'manage_options' ) ) {
			return $redirect;
		}
		$done  = 0;
		$no    = [];
		$start = microtime( true );
		foreach ( array_map( 'absint', (array) $ids ) as $id ) {
			// Each page can take a few renders: stop well before PHP's time limit, and say so.
			if ( 'bblocks_cache_now' === $action && microtime( true ) - $start > 25 ) {
				$no[] = __( 'time ran out — select the rest again', 'b-blocks' );
				continue;
			}
			$post   = get_post( $id );
			$url    = $post && 'publish' === $post->post_status ? get_permalink( $post ) : '';
			$status = $url ? $this->cache_status( $url, $post ) : [ 'state' => 'no', 'reason' => __( 'not published', 'b-blocks' ) ];
			if ( 'no' === $status['state'] ) {
				$no[] = $status['reason'];
				continue;
			}
			if ( 'bblocks_cache_clear' === $action ) {
				$this->purge_url( $url );
				++$done;
				continue;
			}
			$this->fetch( $url );
			if ( 'cached' === $this->cache_status( $url, $post )['state'] ) {
				++$done;
			} else {
				$no[] = __( 'could not be cached', 'b-blocks' );
			}
		}
		delete_transient( 'bblocks_cache_stats' );
		return add_query_arg( [
			'bblocks_cache_bulk'   => 'bblocks_cache_now' === $action ? 'cached' : 'cleared',
			'bblocks_cache_counts' => $done . '-' . count( $no ),
			'bblocks_cache_why'    => rawurlencode( $no ? $no[0] : '' ),
		], remove_query_arg( [ 'bblocks_cache_done', 'bblocks_cache_counts', 'bblocks_cache_bulk', 'bblocks_cache_why' ], $redirect ) );
	}

	/** The message arguments of this menu: WordPress drops them from the address bar and from later redirects. */
	public function cache_removable_args( $args ) {
		return array_merge( $args, [ 'bblocks_cache_done', 'bblocks_cache_counts', 'bblocks_cache_bulk', 'bblocks_cache_why' ] );
	}

	/** The menu script and its data: marked so delay_scripts() leaves them as they are. */
	public function cache_menu_keep( $attributes ) {
		if ( in_array( $attributes['id'] ?? '', [ 'bblocks-cache-menu-js', 'bblocks-cache-menu-js-extra' ], true ) ) {
			$attributes['data-bblocks-keep'] = true;
		}
		return $attributes;
	}

	/** After a plain-link action: a notice in wp-admin, a small toast on the front end. */
	public function cache_action_notice() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the message after a redirect, read only.
		$done     = isset( $_GET['bblocks_cache_done'] ) ? sanitize_key( wp_unslash( $_GET['bblocks_cache_done'] ) ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- counts for the message, read only.
		$counts   = array_map( 'absint', explode( '-', sanitize_text_field( wp_unslash( $_GET['bblocks_cache_counts'] ?? '0-0-0' ) ) ) + [ 0, 0, 0 ] );
		$messages = [
			'purge_all'  => __( 'Cache cleared.', 'b-blocks' ),
			'purge_page' => __( 'This page was cleared from the cache.', 'b-blocks' ),
			'cache_page' => __( 'Page cached.', 'b-blocks' ),
			'failed'     => __( 'Could not cache this page — it may be excluded.', 'b-blocks' ),
			/* translators: 1: pages cached now, 2: pages that were cached already, 3: pages that could not be cached. */
			'preload'    => sprintf( __( 'Preload: %1$d pages cached, %2$d already cached, %3$d failed.', 'b-blocks' ), $counts[0], $counts[1], $counts[2] ),
			'busy'       => __( 'A preload is already running — try again in a few minutes.', 'b-blocks' ),
			'never'      => __( 'This page will not be cached any more ("Never cache these URLs").', 'b-blocks' ),
			'allow'      => __( 'This page can be cached again.', 'b-blocks' ),
		];
		// The bulk actions in the Posts and Pages lists.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the message after a redirect, read only.
		$bulk = isset( $_GET['bblocks_cache_bulk'] ) ? sanitize_key( wp_unslash( $_GET['bblocks_cache_bulk'] ) ) : '';
		if ( in_array( $bulk, [ 'cached', 'cleared' ], true ) && is_admin() && current_user_can( 'manage_options' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the message after a redirect, read only.
			$why  = substr( sanitize_text_field( wp_unslash( $_GET['bblocks_cache_why'] ?? '' ) ), 0, 120 );
			/* translators: %d: number of pages. */
			$text = sprintf( 'cached' === $bulk ? _n( '%d page cached', '%d pages cached', $counts[0], 'b-blocks' ) : _n( '%d page cleared from the cache', '%d pages cleared from the cache', $counts[0], 'b-blocks' ), $counts[0] );
			if ( $counts[1] ) {
				/* translators: 1: number of pages, 2: why the first of them could not be cached, e.g. "password protected". */
				$text .= ', ' . sprintf( _n( '%1$d not cacheable — %2$s', '%1$d not cacheable — first: %2$s', $counts[1], 'b-blocks' ), $counts[1], $why );
			}
			printf( '<div class="notice notice-%s is-dismissible"><p>%s.</p></div>', $counts[1] ? 'warning' : 'success', esc_html( $text ) );
		}
		if ( ! isset( $messages[ $done ] ) || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		if ( is_admin() ) {
			printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>', in_array( $done, [ 'failed', 'busy' ], true ) ? 'warning' : 'success', esc_html( $messages[ $done ] ) );
		} else {
			printf( '<div class="bblocks-cache-toast is-static" role="status">%s</div>', esc_html( $messages[ $done ] ) );
		}
	}

	public function schedule_preload() {
		$want = $this->s['caching']['fullPage'] && $this->s['caching']['background'] && '' === self::page_cache_conflict();
		$next = wp_next_scheduled( self::PRELOAD_HOOK );
		if ( $want && ! $next ) {
			wp_schedule_event( time() + MINUTE_IN_SECONDS, 'hourly', self::PRELOAD_HOOK );
		} elseif ( ! $want && $next ) {
			wp_clear_scheduled_hook( self::PRELOAD_HOOK );
		}
	}

	/**
	 * Hourly: cache up to "Pages per hour" pages nobody has visited yet. URLs that fail 3 times are dropped.
	 * $manual: true = "Preload all pages now" in the admin bar (stops after 25 s), 'cli' = `wp bblocks-cache preload` (no time
	 * limit) — both run even with "Cache pages in the background" off; 'warm' = the run scheduled after "Clear entire cache".
	 * Returns [ cached, already cached, failed ], or false while another preload is running.
	 */
	public function preload( $manual = false ) {
		$c = $this->s['caching'];
		if ( ! $this->pageCache || ( ! $c['background'] && true !== $manual && 'cli' !== $manual ) ) {
			return false;
		}
		// One preload at a time (the hourly one, or a click in the admin bar): a short lock, released at the end.
		if ( get_transient( 'bblocks_preload_lock' ) ) {
			return false;
		}
		// Long enough for a whole run (each render may take up to 15 s), so a second one cannot start alongside.
		set_transient( 'bblocks_preload_lock', 1, max( 5 * MINUTE_IN_SECONDS, (int) $c['pagesPerHour'] * 15 + MINUTE_IN_SECONDS ) );
		$start = microtime( true );

		// Copies past "Expire after" (or holding a nonce older than 10 hours) are never served again: delete them, so the
		// disk and "N pages cached" tell the truth. Also a temporary file left by a write that died half way.
		$dir = self::cache_dir() . 'pages';
		if ( is_dir( $dir ) ) {
			// A folder purged by another request while this walks it is simply done.
			try {
				foreach ( new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $dir, \FilesystemIterator::SKIP_DOTS ) ) as $file ) {
					$name = $file->getPathname();
					if ( 'html' === $file->getExtension() && file_exists( $name ) && ! $this->is_fresh( $name ) ) {
						// The page last (see purge_url()), and only while it is still the expired copy: a visitor's request may
						// store a fresh one (html, then .gz, then .nonce) at any moment — then leave all three alone.
						$mtime = filemtime( $name );
						foreach ( [ $name . '.nonce', $name . '.gz', $name ] as $old ) {
							clearstatcache( true, $name );
							if ( @filemtime( $name ) !== $mtime ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- may be gone already.
								break;
							}
							if ( file_exists( $old ) ) {
								wp_delete_file( $old );
							}
						}
					} elseif ( 'tmp' === $file->getExtension() ) {
						$mtime = @filemtime( $name ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- renamed into place meanwhile.
						if ( $mtime && time() - $mtime > HOUR_IN_SECONDS ) {
							wp_delete_file( $name );
						}
					}
				}
			} catch ( \UnexpectedValueException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- nothing left to clean.
			}
			delete_transient( 'bblocks_cache_stats' );
		}

		// "Also preload these URLs" first (this site's own addresses only; entries are kept as readable text).
		$urls = [];
		foreach ( array_filter( array_map( 'trim', explode( ',', $c['preloadUrls'] ) ) ) as $entry ) {
			// Encoded before parse_url(), which turns some bytes of a Bengali (UTF-8) address into "_".
			$entry = preg_replace_callback( '/[^\x21-\x7e]+/', function ( $m ) { return rawurlencode( $m[0] ); }, $entry );
			$host  = (string) wp_parse_url( $entry, PHP_URL_HOST );
			if ( '' !== $host && strtolower( $host ) !== strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
				continue;
			}
			$path   = implode( '/', array_map( function ( $s ) { return rawurlencode( rawurldecode( $s ) ); }, array_filter( explode( '/', (string) wp_parse_url( $entry, PHP_URL_PATH ) ), 'strlen' ) ) );
			$query  = (string) wp_parse_url( $entry, PHP_URL_QUERY );
			// From the host root, like "Never cache these URLs" (a site in /blog: "/blog/landing/").
			$urls[] = preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . '/' . ( '' === $path ? '' : $path . '/' ) . ( '' === $query ? '' : '?' . $query );
		}
		// With "Only pages built with bBlocks" the home page is included only when it is such a page itself.
		if ( 'all' === $c['cacheWhich'] ) {
			$urls[] = home_url( '/' );
		}
		// Posts in batches of 500, last modified first: the newest batch every run (it holds what was just edited), then
		// the batch the walk has reached — so a site with more posts than that is warmed in full over the hours.
		$byUrl  = [];
		$cursor = (int) get_transient( 'bblocks_preload_cursor' );
		$batch  = 0;
		$size   = 500;
		foreach ( array_unique( [ 0, $cursor ] ) as $offset ) {
			$found = new \WP_Query( [
				'post_type'              => array_values( array_diff( get_post_types( [ 'public' => true ] ), [ 'attachment' ] ) ),
				'post_status'            => 'publish',
				'has_password'           => false,
				'posts_per_page'         => 500,
				'offset'                 => $offset,
				// Imported posts share a modified time: the ID keeps the order (and so the batches) stable.
				'orderby'                => [ 'modified' => 'DESC', 'ID' => 'DESC' ],
				'ignore_sticky_posts'    => true,
				'suppress_filters'       => true,
				'no_found_rows'          => true,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
			] );
			if ( $offset === $cursor ) {
				$batch = count( $found->posts );
				$size  = max( 1, (int) $found->get( 'posts_per_page' ) );
			}
			foreach ( $found->posts as $post ) {
				if ( 'all' === $c['cacheWhich'] || $this->uses_bblocks( $post ) ) {
					$urls[]                          = get_permalink( $post );
					$byUrl[ get_permalink( $post ) ] = $post;
				}
			}
		}
		// Then the busiest category, tag and product category archives (after every post, within the same hourly budget).
		if ( 'all' === $c['cacheWhich'] ) {
			$terms = get_terms( [
				'taxonomy'   => array_values( get_taxonomies( [ 'public' => true, 'publicly_queryable' => true ] ) ),
				'hide_empty' => true,
				'number'     => 200,
				'orderby'    => 'count',
				'order'      => 'DESC',
			] );
			foreach ( is_array( $terms ) ? $terms : [] as $term ) {
				$link = get_term_link( $term );
				if ( is_string( $link ) ) {
					$urls[] = $link;
				}
			}
		}

		// Failures of every batch are kept (this run sees two of them), the newest 1,000 at most.
		$fails = array_slice( (array) get_option( self::FAILS, [] ), -1000, null, true );
		// "Pages per hour" counts page renders: each missing copy (desktop, mobile, WebP…) is one.
		$done   = 0;
		$counts = [ 0, 0, 0 ];
		$ended  = true;
		foreach ( array_unique( array_filter( $urls ) ) as $url ) {
			if ( $done >= (int) $c['pagesPerHour'] ) {
				$ended = false;
				break;
			}
			// A click in the admin bar waits for the answer: stop well before PHP's time limit.
			if ( true === $manual && microtime( true ) - $start > 25 ) {
				$ended = false;
				break;
			}
			if ( ( $fails[ $url ] ?? 0 ) >= 3 ) {
				continue;
			}
			// Never stored (plain ?p=… permalinks, carts, "Never cache these URLs"…): not worth a render.
			if ( 'no' === $this->cache_status( $url, $byUrl[ $url ] ?? null )['state'] ) {
				continue;
			}
			$sent = $this->fetch( $url, (int) $c['pagesPerHour'] - $done );
			if ( ! $sent ) {
				++$counts[1];
				continue;
			}
			$done += $sent;
			// Every copy a visitor can be served exists (the names fetch() just checked), not only the plain one.
			if ( 'not' !== $this->cache_status( $url, $byUrl[ $url ] ?? null )['state'] ) {
				unset( $fails[ $url ] );
				++$counts[0];
			} else {
				$fails[ $url ] = ( $fails[ $url ] ?? 0 ) + 1;
				++$counts[2];
			}
		}
		update_option( self::FAILS, $fails, false );
		// The batch the walk is on is done: the next one, or back to the start after the oldest.
		if ( $ended ) {
			set_transient( 'bblocks_preload_cursor', $batch < $size ? 0 : $cursor + $size, WEEK_IN_SECONDS );
		}
		delete_transient( 'bblocks_preload_lock' );
		return $counts;
	}

	private function stats() {
		$pages = 0;
		$bytes = 0;
		$css   = 0;
		foreach ( [ 'pages', 'css' ] as $sub ) {
			$dir = self::cache_dir() . $sub;
			if ( ! is_dir( $dir ) ) {
				continue;
			}
			foreach ( new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $dir, \FilesystemIterator::SKIP_DOTS ) ) as $file ) {
				$bytes += $file->getSize();
				if ( 'pages' === $sub && 'html' === $file->getExtension() ) {
					++$pages;
				}
				if ( 'css' === $sub && 'css' === $file->getExtension() ) {
					++$css;
				}
			}
		}
		return [
			'pages'  => $pages,
			'bytes'  => $bytes ? size_format( $bytes, 2 ) : '0.00 B',
			'sheets' => $css,
		];
	}

	/* =====================================================================
	 * Front-end HTML: one output buffer runs every HTML rewrite, then stores the page.
	 * ===================================================================== */

	public function start_buffer() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- debug switch, read only.
		// AMP pages allow no custom scripts (the delay loader) and validate their own CSS: left exactly as printed.
		if ( is_customize_preview() || is_preview() || is_feed() || is_robots() || is_trackback() || is_embed() || isset( $_GET['bblocks-nooptimize'] ) || ( function_exists( 'amp_is_request' ) && amp_is_request() ) ) {
			return;
		}
		// WebP copies are swapped in by the browser's Accept header: shared caches (CDN, proxy) must keep the two versions apart.
		if ( $this->s['images']['webp'] && ( $this->pageCache || '' === self::page_cache_conflict() ) && ! headers_sent() ) {
			header( 'Vary: Accept', false );
		}
		if ( $this->pageCache && ! headers_sent() ) {
			// The same Vary as a cached copy gets; and MISS (rendered now, may be stored) or BYPASS (never cached), for checking with curl -I.
			if ( $this->s['caching']['separateMobile'] ) {
				header( 'Vary: User-Agent', false );
			}
			header( 'X-BBlocks-Cache: ' . ( $this->request_cache_path() ? 'MISS' : 'BYPASS' ) );
		}
		ob_start( [ $this, 'process_html' ] );
	}

	/**
	 * A step that fails (a regex hitting PCRE's backtrack limit on a huge page when JIT is off, …) returns
	 * null or ''. Keep the HTML from before that step: the page is then just less optimized, never blank.
	 */
	private function kept( $result, $before ) {
		if ( ! is_string( $result ) || '' === $result ) {
			return $before;
		}
		// A step that lost the end of the document (null glued to a string) failed too.
		return false !== stripos( $before, '</html>' ) && false === stripos( $result, '</html>' ) ? $before : $result;
	}

	public function process_html( $html, $phase = PHP_OUTPUT_HANDLER_FINAL ) {
		// ob_flush() by another plugin hands over only a piece of the page (the <head>, say): rewriting a piece breaks it
		// (the script loader lands in the <head>, the <body> is never seen) and storing it caches a page that ends half way.
		// ob_clean() / ob_end_clean() / ob_get_clean(): this output is being thrown away (often to send something else,
		// a file say) — never rewrite or store it.
		if ( $phase & PHP_OUTPUT_HANDLER_CLEAN ) {
			return '';
		}
		if ( $this->flushed || ! ( $phase & PHP_OUTPUT_HANDLER_FINAL ) ) {
			$this->flushed = true;
			return $html;
		}
		if ( ! is_string( $html ) || false === stripos( $html, '<html' ) ) {
			return $html;
		}
		foreach ( headers_list() as $header ) {
			if ( 0 === stripos( $header, 'content-type:' ) && false === stripos( $header, 'text/html' ) ) {
				return $html;
			}
		}

		$caching = $this->s['caching'];
		$images  = $this->s['images'];
		$assets  = $this->s['assets'];
		$fonts   = $this->s['fonts'];

		if ( $fonts['disableGoogle'] ) {
			$html = $this->kept( $this->remove_google_fonts( $html ), $html );
		} elseif ( $fonts['hostLocal'] || $fonts['usedWeights'] || $fonts['fontSwap'] ) {
			$html = $this->kept( $this->rewrite_google_fonts( $html ), $html );
		}
		if ( $fonts['fontSwap'] ) {
			$html = $this->kept( $this->font_display_swap( $html ), $html );
		}

		// Preloads are worked out before inline CSS is moved into files (they read @font-face from it).
		$preloads = $fonts['preloadFonts'] ? $this->font_preloads( $html ) : '';
		if ( $images['preloadLcp'] && $this->lcp ) {
			$preloads .= '<link rel="preload" as="image" href="' . esc_url( $this->lcp['src'] ) . '"'
				. ( $this->lcp['srcset'] ? ' imagesrcset="' . esc_attr( $this->lcp['srcset'] ) . '"' : '' )
				. ( $this->lcp['sizes'] ? ' imagesizes="' . esc_attr( $this->lcp['sizes'] ) . '"' : '' )
				. ' fetchpriority="high" />';
		}
		if ( $preloads ) {
			// Right after <meta charset>, else right after <head>.
			if ( preg_match( '/<meta\s+charset=[^>]*>/i', $html, $at, PREG_OFFSET_CAPTURE ) || preg_match( '/<head\b[^>]*>/i', $html, $at, PREG_OFFSET_CAPTURE ) ) {
				$html = substr_replace( $html, $preloads, $at[0][1] + strlen( $at[0][0] ), 0 );
			}
		}

		// bBlocks block CSS goes into its file first, so minify / move-inline-CSS never see it.
		if ( $assets['assetFiles'] ) {
			$html = $this->kept( $this->write_asset_file( $html ), $html );
		}
		if ( $assets['minifyInline'] ) {
			$html = $this->kept( $this->minify_inline( $html ), $html );
		}
		if ( $caching['inlineCssFiles'] ) {
			$html = $this->kept( $this->move_inline_css( $html ), $html );
		}
		if ( $assets['criticalCss'] || $assets['asyncCss'] ) {
			$critical = $assets['criticalCss'] ? $this->first_screen_handles( $html ) : [];
			if ( $assets['criticalCss'] ) {
				$html = $this->kept( $this->inline_critical_css( $html, $critical ), $html );
			}
			if ( $assets['asyncCss'] ) {
				$html = $this->kept( $this->async_css( $html, $critical ), $html );
			}
		}
		// Another page cache plugin keeps one copy per address and ignores Vary: Accept — a WebP swap would reach every browser.
		if ( $images['webp'] && $this->wants_webp() && ( $this->pageCache || '' === self::page_cache_conflict() ) ) {
			$html = $this->kept( $this->use_webp( $html ), $html );
		}
		// WooCommerce cart, checkout and account pages: payment forms and the cart and checkout blocks must run at once.
		if ( $assets['delayJs'] && ! ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() || ( is_singular() && ( has_block( 'woocommerce/cart' ) || has_block( 'woocommerce/checkout' ) ) ) ) ) ) {
			$html = $this->kept( $this->delay_scripts( $html ), $html );
		}
		if ( $this->pageCache ) {
			$this->store_page( $html );
		}
		return $html;
	}

	/** "Move inline CSS into cached files": big <style> blocks become shared, cacheable files. */
	private function move_inline_css( $html ) {
		$min  = (int) $this->s['caching']['inlineBelow'];
		$dir  = self::cache_dir() . 'css/';
		$url  = self::cache_url() . 'css/';
		$base = preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) );

		preg_match_all( '#<style\b([^>]*)>(.*?)</style>#is', $html, $matches, PREG_OFFSET_CAPTURE | PREG_SET_ORDER );
		$text = $this->raw_text_ranges( $html );
		// Inline <svg> elements, found once (a search per <style> scanned the page back to the start each time).
		preg_match_all( '#<svg\b.*?</svg\s*>#is', $html, $svgs, PREG_OFFSET_CAPTURE );
		$svg = [];
		foreach ( $svgs[0] ?? [] as $s ) {
			$svg[] = [ $s[1], $s[1] + strlen( $s[0] ) ];
		}
		// Only the <head>: that is the CSS every page shares (theme, global styles). Styles printed in the <body> belong to
		// one block on one page — as files they are only extra requests, and a late <link> in the body shifts the layout.
		$body = stripos( $html, '<body' );
		// "Combine & inline block CSS" prints block stylesheets inline on purpose, within its own budget: moved into files
		// here they would only become a second copy of each stylesheet, and that budget would change nothing.
		$inlined = [];
		if ( $this->s['assets']['combineCss'] ) {
			foreach ( (array) wp_styles()->done as $handle ) {
				if ( wp_styles()->get_data( $handle, 'inlined_src' ) ) {
					$inlined[ $handle . '-inline-css' ] = true;
				}
			}
		}
		foreach ( array_reverse( $matches ) as $m ) {
			list( $tag, $offset ) = $m[0];
			$attrs = $m[1][0];
			$css   = $m[2][0];
			if ( strlen( $css ) < $min || ( false !== $body && $offset > $body ) || preg_match( '/\btype=["\'](?!text\/css)|data-bblocks-keep|amp-/i', $attrs ) || $this->in_ranges( $offset, $text ) ) {
				continue;
			}
			if ( $inlined && preg_match( '/\bid=["\']([^"\']+)/i', $attrs, $sid ) && isset( $inlined[ $sid[1] ] ) ) {
				continue;
			}
			// A <link> is not allowed inside inline SVG — leave those styles where they are.
			if ( $this->in_ranges( $offset, $svg ) ) {
				continue;
			}

			// Relative url()s were relative to the page; make them absolute before the CSS moves (a regex that gave up: stays inline).
			$css = $this->absolute_css_urls( $css, $base );
			if ( null === $css ) {
				continue;
			}
			// The file must carry exactly the !important flags the <style> had — otherwise leave it inline.
			if ( preg_match_all( '/!\s*important/i', $css ) !== preg_match_all( '/!\s*important/i', $m[2][0] ) ) {
				continue;
			}
			$name = md5( $css ) . '.css';
			if ( ! file_exists( $dir . $name ) && ! $this->write_file( $dir . $name, $css ) ) {
				continue;
			}

			$id    = preg_match( '/\bid=["\']([^"\']+)/i', $attrs, $i ) ? ' id="' . esc_attr( $i[1] ) . '"' : '';
			$media = preg_match( '/\bmedia=["\']([^"\']+)/i', $attrs, $md ) ? ' media="' . esc_attr( $md[1] ) . '"' : '';
			$link  = '<link rel="stylesheet"' . $id . ' href="' . esc_url( $url . $name ) . '"' . $media . ' />';
			$html  = substr_replace( $html, $link, $offset, strlen( $tag ) );
		}
		return $html;
	}

	/** Relative url(...) in CSS → absolute against $base (root-relative, data: and full URLs are left alone). */
	private function absolute_css_urls( $css, $base ) {
		return preg_replace_callback( '#url\(\s*([\'"]?)(?!data:|https?:|//|/|\#)([^\'")]+)\1\s*\)#i', function ( $u ) use ( $base ) {
			return 'url(' . $u[1] . \WP_Http::make_absolute_url( $u[2], $base ) . $u[1] . ')';
		}, $css );
	}

	/* =====================================================================
	 * Assets: asset files, critical CSS, asynchronous CSS
	 * ===================================================================== */

	private static function asset_dir() {
		return wp_get_upload_dir()['basedir'] . '/b-blocks/css/';
	}

	/** Byte ranges of <script> and <textarea> elements: a "<style>" inside them is text (a JS string, a template), not page CSS. */
	private function raw_text_ranges( $html ) {
		// <template>: its content is copied into the page by script later, and a <style> there must still be there when it is.
		preg_match_all( '#<(script|textarea|template)\b[^>]*>.*?</\1\s*>#is', $html, $found, PREG_OFFSET_CAPTURE );
		$ranges = [];
		foreach ( $found[0] ?? [] as $f ) {
			$ranges[] = [ $f[1], $f[1] + strlen( $f[0] ) ];
		}
		return $ranges;
	}

	private function in_ranges( $offset, $ranges ) {
		foreach ( $ranges as $r ) {
			if ( $offset > $r[0] && $offset < $r[1] ) {
				return true;
			}
		}
		return false;
	}

	/** "Enable asset file generation": tag the <style> a bBlocks block prints, so the page buffer can collect it. */
	public function mark_block_styles( $content, $block ) {
		if ( 0 !== strpos( (string) ( $block['blockName'] ?? '' ), 'b-blocks/' ) || false === stripos( $content, '<style' ) || is_admin() || wp_is_serving_rest_request() ) {
			return $content;
		}
		return preg_replace( '/<style\b(?![^>]*data-bblocks-block)/i', '<style data-bblocks-block', $content );
	}

	/**
	 * Every tagged bBlocks <style> on the page → one file, uploads/b-blocks/css/post-<ID>-<hash>.css,
	 * loaded with a <link> at the end of <head>. The content hash in the name versions it. If the file
	 * cannot be written the CSS simply stays inline.
	 */
	private function write_asset_file( $html ) {
		// One file per post or page. Search results, archives and their page numbers each have their own mix of blocks:
		// a file for each would be a new file for every search term anyone types (megabytes each). Their CSS stays inline.
		$id = is_singular() ? (int) get_queried_object_id() : 0;
		if ( ! $id ) {
			return $html;
		}
		preg_match_all( '#<style data-bblocks-block\b([^>]*)>(.*?)</style>#is', $html, $matches, PREG_OFFSET_CAPTURE | PREG_SET_ORDER );
		$head = stripos( $html, '</head>' );
		if ( ! $matches || false === $head ) {
			return $html;
		}
		$base   = preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) );
		$raw    = '';
		$remove = [];
		$text   = $this->raw_text_ranges( $html );
		// Inline <svg> elements, found once (a copy or a backwards search per <style> cost up to 40 ms on a long page).
		preg_match_all( '#<svg\b.*?</svg\s*>#is', $html, $svgs, PREG_OFFSET_CAPTURE );
		$svg = [];
		foreach ( $svgs[0] ?? [] as $s ) {
			$svg[] = [ $s[1], $s[1] + strlen( $s[0] ) ];
		}
		foreach ( $matches as $m ) {
			list( $tag, $offset ) = $m[0];
			// Styles inside an inline <svg>, a script or a <textarea>, or with their own media/id, stay where they are.
			if ( '' !== trim( $m[1][0] ) || $this->in_ranges( $offset, $text ) || $this->in_ranges( $offset, $svg ) ) {
				continue;
			}
			$raw     .= $m[2][0] . "\n";
			$remove[] = [ $offset, strlen( $tag ) ];
		}
		if ( '' === trim( $raw ) ) {
			return $html;
		}
		$css = $this->absolute_css_urls( $raw, $base );
		// Never add or drop an !important flag (and never write a file from a regex that gave up).
		if ( null === $css || preg_match_all( '/!\s*important/i', $css ) !== preg_match_all( '/!\s*important/i', $raw ) ) {
			return $html;
		}

		$name = 'post-' . $id . '-' . substr( md5( $css ), 0, 12 ) . '.css';
		if ( ! file_exists( self::asset_dir() . $name ) && ! $this->write_file( self::asset_dir() . $name, $css ) ) {
			return $html;
		}

		// One pass over the page (a substr_replace() per <style> copied the whole page each time).
		$out = '';
		$pos = 0;
		foreach ( $remove as $r ) {
			$out .= substr( $html, $pos, $r[0] - $pos );
			$pos  = $r[0] + $r[1];
		}
		$html = $out . substr( $html, $pos );
		$link = '<link rel="stylesheet" id="bblocks-blocks-css" href="' . esc_url( wp_get_upload_dir()['baseurl'] . '/b-blocks/css/' . $name ) . '" />' . "\n";
		return substr_replace( $html, $link, stripos( $html, '</head>' ), 0 );
	}

	/** Saving a post removes its old CSS files; the next view writes the new one. */
	public function delete_post_asset_files( $post_id ) {
		foreach ( (array) glob( self::asset_dir() . 'post-' . (int) $post_id . '-*.css' ) as $file ) {
			if ( $file && is_file( $file ) ) {
				wp_delete_file( $file );
			}
		}
	}

	/** Block stylesheet handle → wrapper classes of the blocks that use it (wp-block-<name>). */
	private function block_style_map() {
		$map = [];
		foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $type ) {
			$class = 'wp-block-' . str_replace( '/', '-', preg_replace( '#^core/#', '', $name ) );
			foreach ( (array) $type->style_handles as $handle ) {
				$map[ $handle ][] = $class;
			}
		}
		return $map;
	}

	/**
	 * "First screen" without a browser: the first "Blocks counted as first screen" distinct block types,
	 * in document order from <body>. Returns the stylesheet handles those blocks use.
	 */
	private function first_screen_handles( $html ) {
		$body = stripos( $html, '<body' );
		if ( false === $body ) {
			return [];
		}
		$map     = $this->block_style_map();
		$classes = [];
		foreach ( $map as $list ) {
			foreach ( $list as $class ) {
				$classes[ $class ] = true;
			}
		}
		$limit = max( 1, (int) $this->s['assets']['criticalBlocks'] );
		$seen  = [];
		preg_match_all( '/\bclass=["\']([^"\']*)["\']/i', substr( $html, $body ), $attrs );
		foreach ( $attrs[1] as $value ) {
			foreach ( preg_split( '/\s+/', $value ) as $class ) {
				if ( isset( $classes[ $class ] ) && ! isset( $seen[ $class ] ) ) {
					$seen[ $class ] = true;
				}
			}
			if ( count( $seen ) >= $limit ) {
				break;
			}
		}
		$handles = [];
		foreach ( $map as $handle => $list ) {
			if ( array_intersect_key( array_flip( $list ), $seen ) ) {
				$handles[ $handle ] = true;
			}
		}
		return $handles;
	}

	/** "Inline critical CSS": first-screen block stylesheets (local, up to 64 KB each) are printed inline in their place. */
	private function inline_critical_css( $html, $critical ) {
		return preg_replace_callback( '#<link\b[^>]*\bid=[\'"]([\w-]+)-css[\'"][^>]*>#i', function ( $m ) use ( $critical ) {
			$tag = $m[0];
			if ( ! isset( $critical[ $m[1] ] ) || ! preg_match( '/rel=[\'"]stylesheet[\'"]/i', $tag ) || preg_match( '/media=[\'"]print[\'"]/i', $tag ) || ! preg_match( '/href=[\'"]([^\'"]+)/i', $tag, $href ) ) {
				return $tag;
			}
			$url  = html_entity_decode( $href[1] );
			$path = $this->url_to_path( $url );
			if ( ! $path || ! is_readable( $path ) || filesize( $path ) > 64 * KB_IN_BYTES ) {
				return $tag;
			}
			$raw = (string) file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			$css = $this->absolute_css_urls( $raw, $url );
			if ( null === $css || preg_match_all( '/!\s*important/i', $css ) !== preg_match_all( '/!\s*important/i', $raw ) || false !== stripos( $css, '</style' ) ) {
				return $tag;
			}
			$media = preg_match( '/media=[\'"]([^\'"]+)/i', $tag, $md ) && 'all' !== $md[1] ? ' media="' . esc_attr( $md[1] ) . '"' : '';
			return '<style id="' . esc_attr( $m[1] ) . '-critical-css"' . $media . '>' . $css . '</style>';
		}, $html );
	}

	/**
	 * "Load large page CSS asynchronously": block stylesheets that are not first-screen and at least
	 * "Minimum size" bytes load with media="print" and switch to their real media when ready.
	 * Theme, plugin, global-styles and admin-bar stylesheets are never touched.
	 */
	private function async_css( $html, $critical ) {
		$blockHandles = $this->block_style_map();
		$min          = (int) $this->s['assets']['asyncCssMin'];
		return preg_replace_callback( '#<link\b[^>]*\bid=[\'"]([\w-]+)-css[\'"][^>]*>#i', function ( $m ) use ( $blockHandles, $critical, $min ) {
			$tag    = $m[0];
			$handle = $m[1];
			if ( ! isset( $blockHandles[ $handle ] ) || isset( $critical[ $handle ] ) || in_array( $handle, [ 'global-styles', 'admin-bar', 'dashicons' ], true ) ) {
				return $tag;
			}
			if ( ! preg_match( '/rel=[\'"]stylesheet[\'"]/i', $tag ) || preg_match( '/media=[\'"]print[\'"]|onload=/i', $tag ) || ! preg_match( '/href=[\'"]([^\'"]+)/i', $tag, $href ) ) {
				return $tag;
			}
			$path = $this->url_to_path( html_entity_decode( $href[1] ) );
			if ( ! $path || ! is_readable( $path ) || filesize( $path ) < $min ) {
				return $tag;
			}
			$media = preg_match( '/media=[\'"]([^\'"]+)/i', $tag, $md ) ? $md[1] : 'all';
			$async = preg_replace( '/\s*media=[\'"][^\'"]*[\'"]/i', '', $tag );
			$async = preg_replace( '#\s*/?>$#', ' media="print" onload="this.media=\'' . esc_attr( $media ) . '\';this.onload=null" />', $async );
			return $async . '<noscript>' . $tag . '</noscript>';
		}, $html );
	}

	/* =====================================================================
	 * Header & footer cache (block themes)
	 * ===================================================================== */

	private function header_footer_key( $block ) {
		if ( 'core/template-part' !== ( $block['blockName'] ?? '' ) || is_admin() || wp_is_serving_rest_request() || is_customize_preview() || is_preview() ) {
			return '';
		}
		$attrs = $block['attrs'] ?? [];
		$area  = $attrs['area'] ?? '';
		$slug  = $attrs['slug'] ?? '';
		if ( ! in_array( $area, [ 'header', 'footer' ], true ) && ! preg_match( '/^(header|footer)/', $slug ) ) {
			return '';
		}
		// A cart in the session, or any query string (?s= fills the search box, filters, UTM…): render fresh.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- presence check only.
		if ( isset( $_COOKIE['woocommerce_items_in_cart'] ) || ! empty( $_GET ) ) {
			return '';
		}
		// "Never cache when these cookies are set" (a language, currency or consent choice can change the header too).
		foreach ( array_filter( array_map( 'trim', explode( ',', $this->s['caching']['neverCookies'] ) ) ) as $name ) {
			foreach ( array_keys( $_COOKIE ) as $cookie ) {
				if ( 0 === strpos( (string) $cookie, $name ) || 0 === strpos( (string) $cookie, strtr( $name, '. ', '__' ) ) ) {
					return '';
				}
			}
		}
		// Logged-out visitors share one copy; a logged-in user only ever gets their own.
		// bbhf2_: the styles are kept as style-engine rules (an older bbhf_ copy, with plain CSS, is ignored and expires).
		return 'bbhf2_' . md5( wp_json_encode( [ $attrs, get_stylesheet(), get_locale(), get_current_user_id(), is_ssl(), get_option( self::HF_VERSION, 0 ) ] ) );
	}

	private function block_support_rules() {
		if ( ! class_exists( '\WP_Style_Engine_CSS_Rules_Store' ) ) {
			return [];
		}
		return \WP_Style_Engine_CSS_Rules_Store::get_store( 'block-supports' )->get_all_rules();
	}

	/** Serve a cached header/footer, replaying the styles, scripts and state its blocks would have added. */
	public function header_footer_from_cache( $pre, $block ) {
		$key = $this->header_footer_key( $block );
		if ( null !== $pre || ! $key ) {
			return $pre;
		}

		$hit = get_transient( $key );
		if ( ! is_array( $hit ) ) {
			$footer = [];
			foreach ( isset( $GLOBALS['wp_filter']['wp_footer'] ) ? $GLOBALS['wp_filter']['wp_footer']->callbacks : [] as $priority => $callbacks ) {
				foreach ( array_keys( $callbacks ) as $id ) {
					$footer[] = $priority . ':' . $id;
				}
			}
			$this->hfBefore[ $key ] = [
				'styles'  => wp_styles()->queue,
				'scripts' => wp_scripts()->queue,
				'modules' => function_exists( 'wp_script_modules' ) ? wp_script_modules()->get_queue() : [],
				'rules'   => array_keys( $this->block_support_rules() ),
				'footer'  => $footer,
			];
			return $pre;
		}

		foreach ( $hit['styles'] as $handle ) {
			wp_enqueue_style( $handle );
		}
		foreach ( $hit['scripts'] as $handle ) {
			wp_enqueue_script( $handle );
		}
		foreach ( $hit['modules'] as $id ) {
			wp_enqueue_script_module( $id );
		}
		// Back into WordPress's own block-supports store, so they print where a fresh render prints them — after the
		// global styles. A separate stylesheet printed earlier lost to .is-layout-flex{flex-wrap:wrap} and the header broke.
		if ( $hit['rules'] && function_exists( 'wp_style_engine_get_stylesheet_from_css_rules' ) ) {
			wp_style_engine_get_stylesheet_from_css_rules( $hit['rules'], [ 'context' => 'block-supports' ] );
		}
		foreach ( $hit['state'] as $namespace => $state ) {
			wp_interactivity_state( $namespace, $state );
		}
		foreach ( $hit['config'] as $namespace => $config ) {
			wp_interactivity_config( $namespace, $config );
		}

		// Its images count as if it had rendered: a header cover is the page's main image, and an image that already has
		// fetchpriority="high" uses up the page's one high-priority slot.
		$this->optimize_block_images( $hit['html'], [ 'blockName' => 'core/template-part' ] );
		if ( false !== strpos( $hit['html'], 'fetchpriority="high"' ) ) {
			wp_high_priority_element_flag( false );
		}

		return $this->mark_current_menu_item( $hit['html'] );
	}

	public function header_footer_to_cache( $content, $block ) {
		$key = $this->header_footer_key( $block );
		if ( ! $key || ! isset( $this->hfBefore[ $key ] ) ) {
			return $content;
		}
		$before = $this->hfBefore[ $key ];
		unset( $this->hfBefore[ $key ] );

		// Parts that show something about the current page (its title, breadcrumbs, a login/logout link
		// back to it) would be wrong on every other page — those are rendered fresh every time.
		// bBlocks blocks build their CSS selectors from wp_unique_id(): a cached copy would skip those
		// counters on a hit and the page could reuse the same id — those parts are always rendered fresh.
		if ( preg_match( '/wp-block-(post-|query-title|term-description|loginout|b-blocks-)|breadcrumb/i', $content ) ) {
			return $content;
		}
		// WordPress still numbers some classes as it renders (link colours wp-elements-3, sticky position wp-container-2,
		// section styles is-style-section-1--4): a cached copy keeps its numbers while the page counts on from 1, and two
		// different blocks would share one class (and their CSS). Such parts are rendered fresh every time.
		// Also CSS or footer output a block makes only while it renders (per-block custom CSS, duotone, an image lightbox),
		// and a numbered navigation class.
		if ( preg_match( '/\b(?:wp-elements-\d+|wp-container-\d+|is-style-[\w-]+--\d+|wp-block-navigation-\d+|wp-custom-css-[\w-]+|wp-duotone-[\w-]+|wp-lightbox-container)\b/', $content ) ) {
			return $content;
		}
		// Something hooked into wp_footer while this part rendered (a mini-cart drawer, a lightbox overlay): lost on a hit.
		$footer = [];
		foreach ( isset( $GLOBALS['wp_filter']['wp_footer'] ) ? $GLOBALS['wp_filter']['wp_footer']->callbacks : [] as $priority => $callbacks ) {
			foreach ( array_keys( $callbacks ) as $id ) {
				$footer[] = $priority . ':' . $id;
			}
		}
		if ( array_diff( $footer, (array) ( $before['footer'] ?? [] ) ) ) {
			return $content;
		}

		// The rules this part added — and the ones it shares with blocks earlier on this page (the same layout hash), which
		// were in the store already: on another page nothing else would print them.
		$rules = [];
		foreach ( $this->block_support_rules() as $id => $rule ) {
			$shared = false;
			if ( in_array( $id, $before['rules'], true ) && preg_match_all( '/\.([\w-]+)/', $rule->get_selector(), $classes ) ) {
				foreach ( $classes[1] as $class ) {
					$shared = $shared || false !== strpos( $content, $class );
				}
			}
			if ( in_array( $id, $before['rules'], true ) && ! $shared ) {
				continue;
			}
			$rules[] = [
				'selector'     => $rule->get_selector(),
				'declarations' => $rule->get_declarations()->get_declarations(),
				'rules_group'  => method_exists( $rule, 'get_rules_group' ) ? (string) $rule->get_rules_group() : '',
			];
		}

		// Block stylesheets this part needs that the page had queued already (social links in the footer and the content).
		$shared_styles = [];
		foreach ( $this->block_style_map() as $handle => $classes ) {
			if ( in_array( $handle, $before['styles'], true ) ) {
				foreach ( $classes as $class ) {
					if ( preg_match( '/class=["\'](?:[^"\']*\s)?' . preg_quote( $class, '/' ) . '(?=["\'\s])/', $content ) ) {
						$shared_styles[] = $handle;
						break;
					}
				}
			}
		}

		// View scripts and modules of blocks in this part that the page had loaded already (a search block in the content and
		// the footer): on another page nothing else would load them.
		$shared_scripts = [];
		$shared_modules = [];
		foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $type ) {
			$class = 'wp-block-' . str_replace( '/', '-', preg_replace( '#^core/#', '', $name ) );
			if ( false === strpos( $content, $class ) || ! preg_match( '/class=["\'](?:[^"\']*\s)?' . preg_quote( $class, '/' ) . '(?=["\'\s])/', $content ) ) {
				continue;
			}
			foreach ( isset( $type->view_script_handles ) ? (array) $type->view_script_handles : [] as $handle ) {
				if ( in_array( $handle, $before['scripts'], true ) ) {
					$shared_scripts[] = $handle;
				}
			}
			foreach ( isset( $type->view_script_module_ids ) ? (array) $type->view_script_module_ids : [] as $module ) {
				if ( in_array( $module, $before['modules'], true ) ) {
					$shared_modules[] = $module;
				}
			}
		}

		$state  = [];
		$config = [];
		preg_match_all( '/data-wp-interactive=["\']([^"\']+)["\']/', $content, $ns );
		foreach ( array_unique( $ns[1] ) as $namespace ) {
			$namespace = html_entity_decode( $namespace );
			if ( '{' === $namespace[0] ) {
				continue;
			}
			$state[ $namespace ]  = wp_interactivity_state( $namespace );
			$config[ $namespace ] = wp_interactivity_config( $namespace );
		}

		// State holding a Closure (WooCommerce mini-cart labels, core accordion) cannot be stored: rendered fresh every time.
		$closure = false;
		array_walk_recursive( $state, function ( $v ) use ( &$closure ) {
			$closure = $closure || $v instanceof \Closure;
		} );
		array_walk_recursive( $config, function ( $v ) use ( &$closure ) {
			$closure = $closure || $v instanceof \Closure;
		} );
		if ( $closure ) {
			return $content;
		}

		// The "current page" markers differ per URL; they are put back on every hit instead.
		$html = preg_replace( '/(["\s])(?:current-menu-item|current-menu-ancestor|current_page_item|current_page_parent)(?=["\s])\s?/', '$1', $content );
		if ( null === $html ) {
			return $content; // never store an empty header
		}
		$html = str_replace( ' aria-current="page"', '', $html );

		// Anything else that cannot be serialized: never a fatal error for the visitor, just no cached copy.
		try {
			set_transient( $key, [
				'html'    => $html,
				'styles'  => array_values( array_unique( array_merge( array_diff( wp_styles()->queue, $before['styles'] ), $shared_styles ) ) ),
				'scripts' => array_values( array_unique( array_merge( array_diff( wp_scripts()->queue, $before['scripts'] ), $shared_scripts ) ) ),
				'modules' => function_exists( 'wp_script_modules' ) ? array_values( array_unique( array_merge( array_diff( wp_script_modules()->get_queue(), $before['modules'] ), $shared_modules ) ) ) : [],
				'rules'   => $rules,
				'state'   => $state,
				'config'  => $config,
			], max( 60, (int) $this->s['caching']['headerFooterExpire'] ) );
		} catch ( \Throwable $e ) {
			return $content;
		}

		return $content;
	}

	/** Re-add current-menu-item / aria-current to the navigation link for this URL. */
	private function mark_current_menu_item( $html ) {
		$current = untrailingslashit( strtok( preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url() ) . esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) ), '?' ) );
		$items   = [];
		$li      = -1;
		$p       = new \WP_HTML_Tag_Processor( $html );
		while ( $p->next_tag() ) {
			if ( 'LI' === $p->get_tag() && ! $p->is_tag_closer() ) {
				++$li;
			// The whole link: ?page_id=12 is another page and #about a part of this one — neither is "the current page".
			} elseif ( 'A' === $p->get_tag() && untrailingslashit( (string) $p->get_attribute( 'href' ) ) === $current ) {
				$items[ $li ] = true;
			}
		}
		if ( ! $items ) {
			return $html;
		}

		$li = -1;
		$p  = new \WP_HTML_Tag_Processor( $html );
		while ( $p->next_tag() ) {
			if ( 'LI' === $p->get_tag() && ! $p->is_tag_closer() ) {
				++$li;
				if ( isset( $items[ $li ] ) ) {
					$p->add_class( 'current-menu-item' );
				}
			} elseif ( 'A' === $p->get_tag() && untrailingslashit( (string) $p->get_attribute( 'href' ) ) === $current ) {
				$p->set_attribute( 'aria-current', 'page' );
			}
		}
		return $p->get_updated_html();
	}

	/* =====================================================================
	 * Template lookups (persistent object cache only)
	 * ===================================================================== */

	private function templates_key( $kind, $args ) {
		$version = wp_cache_get( 'version', 'bblocks_templates' );
		if ( false === $version ) {
			$version = time();
			wp_cache_set( 'version', $version, 'bblocks_templates' );
		}
		return $version . '_' . md5( serialize( [ $kind, $args, get_stylesheet() ] ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
	}

	private function templates_cacheable() {
		return ! is_admin() && ! wp_is_serving_rest_request() && ! is_customize_preview();
	}

	public function templates_from_cache( $templates, $query, $type ) {
		if ( null !== $templates || ! $this->templates_cacheable() ) {
			return $templates;
		}
		$key = $this->templates_key( 'list', [ $query, $type ] );
		$hit = wp_cache_get( $key, 'bblocks_templates' );
		if ( false === $hit ) {
			// Core rewrites $query['slug__not_in'] before the "after" filter, so the key is carried over from here.
			$this->tplPendingKey = $key;
			return $templates;
		}
		return $hit;
	}

	public function templates_to_cache( $result, $query, $type ) {
		// Only the lookup this filter belongs to: a nested or short-circuited lookup leaves no key and is simply not stored.
		if ( $this->tplPendingKey && $this->templates_cacheable() ) {
			wp_cache_set( $this->tplPendingKey, $result, 'bblocks_templates', DAY_IN_SECONDS );
		}
		$this->tplPendingKey = '';
		return $result;
	}

	public function template_from_cache( $template, $id, $type ) {
		if ( null !== $template || ! $this->templates_cacheable() ) {
			return $template;
		}
		$hit = wp_cache_get( $this->templates_key( 'one', [ $id, $type ] ), 'bblocks_templates' );
		return false === $hit ? $template : $hit;
	}

	public function template_to_cache( $template, $id, $type ) {
		if ( $template && $this->templates_cacheable() ) {
			wp_cache_set( $this->templates_key( 'one', [ $id, $type ] ), $template, 'bblocks_templates', DAY_IN_SECONDS );
		}
		return $template;
	}

	/* =====================================================================
	 * Images
	 * ===================================================================== */

	public function enter_block( $parsed ) {
		if ( 0 === strpos( (string) ( $parsed['blockName'] ?? '' ), 'b-blocks/' ) ) {
			++$this->bbDepth;
		}
		return $parsed;
	}

	/** Lazy-load, dimensions, srcset and the LCP candidate for <img> inside bBlocks blocks. */
	public function optimize_block_images( $content, $block ) {
		if ( 0 !== strpos( (string) ( $block['blockName'] ?? '' ), 'b-blocks/' ) ) {
			// A large image shown before any bBlocks block (a cover hero, a featured image) is the page's main image, and
			// WordPress gives it the high priority once the content is assembled — a bBlocks image further down must not take
			// it first. An image without width and height counts as large (a cover's is sized only later).
			if ( 0 === $this->bbDepth && ! $this->largeImageSeen && false !== stripos( (string) $content, '<img' ) ) {
				$t = new \WP_HTML_Tag_Processor( (string) $content );
				while ( $t->next_tag( 'img' ) ) {
					$src = (string) $t->get_attribute( 'src' );
					// Lazy or low-priority images (a collapsed section, a menu overlay), placeholders and SVG icons or logos are
					// never the main image.
					if ( '' === $src || 0 === strpos( $src, 'data:' ) || preg_match( '/\.svg(\?|$)/i', $src ) || 'lazy' === $t->get_attribute( 'loading' ) || 'low' === $t->get_attribute( 'fetchpriority' ) ) {
						continue;
					}
					$w = (int) $t->get_attribute( 'width' );
					$h = (int) $t->get_attribute( 'height' );
					// No size printed (raw HTML, a shortcode): the file's own size; unknown (another site's image) counts as large.
					$size = $w && $h ? [ $w, $h ] : $this->local_image_size( $src );
					if ( ! $size || $size[0] * $size[1] >= (int) apply_filters( 'wp_min_priority_img_pixels', 50000 ) ) { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core filter.
						$this->largeImageSeen = true;
						break;
					}
				}
			}
			return $content;
		}
		$this->bbDepth = max( 0, $this->bbDepth - 1 );
		// Nested bBlocks block: its parent rewrites these images, so each is counted once.
		if ( $this->bbDepth > 0 || is_admin() || wp_is_serving_rest_request() ) {
			return $content;
		}
		$i = $this->s['images'];

		// Most bBlocks blocks draw their <img> in the browser from data-attributes, so PHP cannot
		// lazy-load or size it — but the first one can still be preloaded as the LCP image.
		if ( false === stripos( $content, '<img' ) ) {
			// Only while the page's one high-priority image is still free; taken here, WordPress gives it to no other image.
			$url = $i['preloadLcp'] && null === $this->lcp && 0 === $this->imgCount && ! $this->largeImageSeen && wp_high_priority_element_flag() ? $this->first_attribute_image( $block['attrs'] ?? [] ) : '';
			if ( $url ) {
				$this->lcp      = [ 'src' => $url, 'srcset' => '', 'sizes' => '' ];
				$this->imgCount = 1;
				wp_high_priority_element_flag( false );
			}
			return $content;
		}
		$p = new \WP_HTML_Tag_Processor( $content );
		// An <img> after a <source> in a <picture>: on some screens the browser loads the source instead.
		$picture = false;
		$sources = false;

		while ( $p->next_tag( [ 'tag_closers' => 'visit' ] ) ) {
			$tag = $p->get_tag();
			if ( 'PICTURE' === $tag ) {
				$picture = ! $p->is_tag_closer();
				$sources = false;
				continue;
			}
			if ( 'SOURCE' === $tag ) {
				$sources = $sources || $picture;
				continue;
			}
			if ( 'IMG' !== $tag ) {
				continue;
			}
			$src = (string) $p->get_attribute( 'src' );
			if ( '' === $src || 0 === strpos( $src, 'data:' ) ) {
				continue;
			}
			++$this->imgCount;
			$eager = $this->imgCount <= (int) $i['eagerCount'];

			if ( $i['lazyLoad'] && null === $p->get_attribute( 'loading' ) ) {
				$p->set_attribute( 'loading', $eager ? 'eager' : 'lazy' );
				if ( null === $p->get_attribute( 'decoding' ) ) {
					$p->set_attribute( 'decoding', 'async' );
				}
			}

			// Width and height given as "100%" or "auto" are the layout the block wants: left exactly as they are.
			$width_attr  = $p->get_attribute( 'width' );
			$height_attr = $p->get_attribute( 'height' );
			$sized       = ( null === $width_attr || ( is_string( $width_attr ) && ctype_digit( trim( $width_attr ) ) ) )
				&& ( null === $height_attr || ( is_string( $height_attr ) && ctype_digit( trim( $height_attr ) ) ) );

			if ( $i['dimensions'] && $sized ) {
				$width  = (int) $width_attr;
				$height = (int) $height_attr;
				$size   = ( ! $width || ! $height ) ? $this->local_image_size( $src ) : null;
				if ( $size ) {
					if ( ! $width && ! $height ) {
						list( $width, $height ) = $size;
					} elseif ( ! $height ) {
						$height = (int) round( $width * $size[1] / $size[0] );
					} else {
						$width = (int) round( $height * $size[0] / $size[1] );
					}
					$p->set_attribute( 'width', (string) $width );
					$p->set_attribute( 'height', (string) $height );
				}
			}

			if ( $i['srcset'] && null === $p->get_attribute( 'srcset' ) ) {
				$id   = $this->attachment_id( $src, (string) $p->get_attribute( 'class' ) );
				$meta = $id ? wp_get_attachment_metadata( $id ) : false;
				$dims = $meta ? wp_image_src_get_dimensions( $src, $meta, $id ) : false;
				if ( $dims ) {
					// As WordPress does: the size the image is shown at (its width and height) decides `sizes`, so a 400px wide
					// image is not given the full-size file. Its own file size when those are missing or of another shape.
					$shown  = [ (int) $p->get_attribute( 'width' ), (int) $p->get_attribute( 'height' ) ];
					$srcset = $sized && $shown[0] && $shown[1] ? wp_calculate_image_srcset( $shown, $src, $meta, $id ) : false;
					if ( $srcset ) {
						$dims = $shown;
					} else {
						$srcset = wp_calculate_image_srcset( $dims, $src, $meta, $id );
					}
					if ( $srcset ) {
						$p->set_attribute( 'srcset', $srcset );
						if ( null === $p->get_attribute( 'sizes' ) ) {
							$p->set_attribute( 'sizes', (string) wp_calculate_image_sizes( $dims, $src, $meta, $id ) );
						}
					}
				}
			}

			// The page's main image: WordPress allows one high-priority image per page, taken here only while it is still free
			// (a classic theme's header image may have taken it). Never an image the block loads lazily or at low priority,
			// one a <picture> may swap for another file, an SVG icon, or a small image (an icon, an avatar) — and only among
			// the first images of the page.
			if ( ( $i['lazyLoad'] || $i['preloadLcp'] ) && null === $this->lcp && ! $this->largeImageSeen
				&& $this->imgCount <= max( 1, (int) $i['eagerCount'] ) && ! $sources
				&& 'lazy' !== $p->get_attribute( 'loading' ) && 'low' !== $p->get_attribute( 'fetchpriority' )
				&& ! preg_match( '/\.svg(\?|$)/i', $src ) && $this->is_large_image( $p, $src )
				&& ( 'high' === $p->get_attribute( 'fetchpriority' ) || wp_high_priority_element_flag() ) ) {
				if ( $i['lazyLoad'] && null === $p->get_attribute( 'fetchpriority' ) ) {
					$p->set_attribute( 'fetchpriority', 'high' );
				}
				if ( $i['preloadLcp'] ) {
					$this->lcp = [
						'src'    => $src,
						'srcset' => (string) $p->get_attribute( 'srcset' ),
						'sizes'  => (string) $p->get_attribute( 'sizes' ),
					];
				}
				wp_high_priority_element_flag( false );
			}
		}
		return $p->get_updated_html();
	}

	/** At least as large as WordPress requires of a high-priority image; an image of unknown size counts as large. */
	private function is_large_image( $p, $src ) {
		$w    = $p->get_attribute( 'width' );
		$h    = $p->get_attribute( 'height' );
		$size = is_string( $w ) && is_string( $h ) && ctype_digit( $w ) && ctype_digit( $h ) && (int) $w && (int) $h ? [ (int) $w, (int) $h ] : $this->local_image_size( $src );
		return ! $size || $size[0] * $size[1] >= (int) apply_filters( 'wp_min_priority_img_pixels', 50000 ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core filter.
	}

	/** First { url: "…jpg" } found in a block's attributes. */
	private function first_attribute_image( $value ) {
		if ( ! is_array( $value ) ) {
			return '';
		}
		if ( isset( $value['url'] ) && is_string( $value['url'] ) && preg_match( '/^(https?:)?\/\/.+\.(jpe?g|png|gif|webp|avif)(\?|$)/i', $value['url'] ) ) {
			return $value['url'];
		}
		foreach ( $value as $child ) {
			$url = $this->first_attribute_image( $child );
			if ( $url ) {
				return $url;
			}
		}
		return '';
	}

	/** Local file behind a URL on this site (uploads, wp-content, core), or ''. */
	private function url_to_path( $url ) {
		$uploads = wp_get_upload_dir();
		$bare    = preg_replace( '#^https?:#', '', strtok( $url, '?' ) );
		foreach ( [ $uploads['baseurl'] => $uploads['basedir'], content_url() => WP_CONTENT_DIR, site_url() => untrailingslashit( ABSPATH ) ] as $base => $dir ) {
			$base = preg_replace( '#^https?:#', '', $base );
			if ( 0 === strpos( $bare, $base . '/' ) ) {
				$path = $dir . rawurldecode( substr( $bare, strlen( $base ) ) );
				return false === strpos( $path, '..' ) ? $path : '';
			}
		}
		return '';
	}

	/** Width/height of an image that lives on this site, or null. */
	private function local_image_size( $src ) {
		static $sizes = [];
		$url = strtok( $src, '?' );
		if ( array_key_exists( $url, $sizes ) ) {
			return $sizes[ $url ];
		}
		// The same address → file rules as everywhere else here (a whole folder name, never "..").
		$file          = $this->url_to_path( $url );
		$info          = $file && file_exists( $file ) ? wp_getimagesize( $file ) : false;
		$sizes[ $url ] = $info && $info[0] && $info[1] ? [ (int) $info[0], (int) $info[1] ] : null;
		return $sizes[ $url ];
	}

	private function attachment_id( $src, $class ) {
		if ( preg_match( '/wp-image-(\d+)/', $class, $m ) ) {
			return (int) $m[1];
		}
		$url = strtok( $src, '?' );
		// Only images in the media library can be found — another site's image would cost database lookups for nothing.
		if ( 0 !== strpos( preg_replace( '#^https?:#', '', $url ), preg_replace( '#^https?:#', '', wp_get_upload_dir()['baseurl'] ) . '/' ) ) {
			return 0;
		}
		$id = wp_cache_get( $url, 'bblocks_attachment_ids' );
		if ( false === $id ) {
			$full = preg_replace( '/-\d+x\d+(?=\.[a-z0-9]{3,4}$)/i', '', $url );
			$id   = attachment_url_to_postid( $full );
			// A large image (photo-scaled.jpg) or a compressed upload (photo-compressed.jpg): the library file has another
			// name than the original and its sizes (photo.jpg, photo-300x200.jpg).
			foreach ( [ '-scaled', '-compressed' ] as $suffix ) {
				if ( ! $id ) {
					$id = attachment_url_to_postid( preg_replace( '/(\.[a-z0-9]{3,4})$/i', $suffix . '$1', $full ) );
				}
			}
			wp_cache_set( $url, (int) $id, 'bblocks_attachment_ids', DAY_IN_SECONDS );
		}
		return (int) $id;
	}

	/** JPEG quality for "Compression strength", or 0 when new uploads are not optimized. */
	private function upload_quality() {
		$i = $this->s['images'];
		if ( ! $i['optimizeUploads'] || 'off' === $i['compression'] ) {
			return 0;
		}
		return [ '1' => 72, '2' => 60, '3' => 50, '5' => 38 ][ $i['compression'] ] ?? 0;
	}

	/** A new file has been uploaded or sideloaded; its sizes are generated next in this request. */
	public function mark_upload( $upload ) {
		$this->uploading = 'image/jpeg' === ( $upload['type'] ?? '' );
		return $upload;
	}

	public function editor_quality( $quality, $mime ) {
		// Never 0: WordPress would save at quality 1.
		$upload = $this->uploading && 'image/jpeg' === $mime ? $this->upload_quality() : 0;
		return $upload ? $upload : $quality;
	}

	/**
	 * New uploads: compress the full-size JPEG (the untouched original is kept as `original_image`,
	 * the same way WordPress keeps originals of scaled images) and write WebP copies beside each size.
	 */
	public function process_upload( $meta, $id, $context ) {
		if ( 'create' !== $context || empty( $meta['file'] ) ) {
			return $meta;
		}
		$file    = get_attached_file( $id );
		$mime    = get_post_mime_type( $id );
		// Regenerate-thumbnails tools also call this with 'create': only a fresh upload is compressed.
		$quality = $this->uploading ? $this->upload_quality() : 0;
		$this->uploading = false;

		// Regenerating a compressed image rebuilds the metadata without `original_image`; keep the link to the
		// untouched original, or WordPress could no longer restore it or delete it with the attachment.
		// WordPress has already saved the new metadata by now, so the original is found next to the file instead.
		$original = $file ? preg_replace( '/-compressed(\.[a-z0-9]+)$/i', '$1', $file ) : '';
		if ( ! $quality && empty( $meta['original_image'] ) && $original !== $file && file_exists( $original ) ) {
			$meta['original_image'] = wp_basename( $original );
		}

		if ( $quality && 'image/jpeg' === $mime && empty( $meta['original_image'] ) && $file && file_exists( $file ) ) {
			$editor = wp_get_image_editor( $file );
			if ( ! is_wp_error( $editor ) ) {
				$editor->set_quality( $quality );
				$info  = pathinfo( $file );
				$saved = $editor->save( $info['dirname'] . '/' . $info['filename'] . '-compressed.' . $info['extension'], $mime );
				if ( ! is_wp_error( $saved ) && filesize( $saved['path'] ) < filesize( $file ) ) {
					$meta['original_image'] = wp_basename( $file );
					$meta['file']           = _wp_relative_upload_path( $saved['path'] );
					$meta['filesize']       = filesize( $saved['path'] );
					update_attached_file( $id, $saved['path'] );
					$file = $saved['path'];
				} elseif ( ! is_wp_error( $saved ) ) {
					wp_delete_file( $saved['path'] );
				}
			}
		}

		$this->webp_copies( $file, $meta, $mime, $quality ? $quality : 80 );
		return $meta;
	}

	/** A WebP copy beside the file and each of its sizes (when WebP is on and this server can write WebP). */
	private function webp_copies( $file, $meta, $mime, $quality ) {
		if ( ! $file || ! $this->s['images']['webp'] || ! in_array( $mime, [ 'image/jpeg', 'image/png' ], true ) || ! wp_image_editor_supports( [ 'mime_type' => 'image/webp' ] ) ) {
			return;
		}
		$files = [ $file ];
		foreach ( $meta['sizes'] ?? [] as $size ) {
			if ( ! empty( $size['file'] ) ) {
				$files[] = dirname( $file ) . '/' . $size['file'];
			}
		}
		foreach ( array_unique( $files ) as $path ) {
			$this->make_webp( $path, $quality );
		}
	}

	/**
	 * The media library's image editor (rotate, crop, scale, flip) saves new files — photo-e1712345.jpg and its sizes —
	 * without an upload: they get their WebP copies here, or pages would fall back to the JPEG for an edited image.
	 */
	public function webp_after_edit( $meta, $id ) {
		if ( doing_action( 'wp_ajax_image-editor' ) && is_array( $meta ) && ! empty( $meta['file'] ) ) {
			$this->webp_copies( trailingslashit( wp_get_upload_dir()['basedir'] ) . $meta['file'], $meta, get_post_mime_type( $id ), 80 );
		}
		return $meta;
	}

	/** photo.jpg → photo.jpg.webp, discarded when it would not be smaller. */
	private function make_webp( $path, $quality ) {
		if ( ! file_exists( $path ) || file_exists( $path . '.webp' ) ) {
			return;
		}
		// WordPress resets the quality when the output type changes (JPEG → WebP), so set_quality() alone is ignored and
		// the WebP came out at the default quality — bigger than a compressed JPEG, and thrown away. Asked for through the
		// filter for this one save.
		$force = function ( $q, $mime ) use ( $quality ) {
			return 'image/webp' === $mime ? $quality : $q;
		};
		add_filter( 'wp_editor_set_quality', $force, 99, 2 );
		$editor = wp_get_image_editor( $path );
		if ( is_wp_error( $editor ) ) {
			remove_filter( 'wp_editor_set_quality', $force, 99 );
			return;
		}
		$editor->set_quality( $quality );
		$saved = $editor->save( $path . '.webp', 'image/webp' );
		remove_filter( 'wp_editor_set_quality', $force, 99 );
		if ( ! is_wp_error( $saved ) && filesize( $saved['path'] ) >= filesize( $path ) ) {
			wp_delete_file( $saved['path'] );
		} elseif ( ! is_wp_error( $saved ) && ! get_option( self::WEBP_USED ) ) {
			update_option( self::WEBP_USED, 1, true );
		}
	}

	public function delete_webp_copies( $id ) {
		if ( ! $this->s['images']['webp'] && ! get_option( self::WEBP_USED ) ) {
			return;
		}
		$file = get_attached_file( $id );
		if ( ! $file ) {
			return;
		}
		$meta  = wp_get_attachment_metadata( $id );
		$files = [ $file, (string) wp_get_original_image_path( $id ) ];
		foreach ( $meta['sizes'] ?? [] as $size ) {
			if ( ! empty( $size['file'] ) ) {
				$files[] = dirname( $file ) . '/' . $size['file'];
			}
		}
		// Sizes from before an edit in the media library (the -e123 files replaced them in the metadata).
		foreach ( (array) get_post_meta( $id, '_wp_attachment_backup_sizes', true ) as $size ) {
			if ( ! empty( $size['file'] ) ) {
				$files[] = dirname( $file ) . '/' . $size['file'];
			}
		}
		foreach ( array_unique( array_filter( $files ) ) as $path ) {
			if ( file_exists( $path . '.webp' ) ) {
				wp_delete_file( $path . '.webp' );
			}
		}
	}

	/** Point <img>/<source>/image preloads at the .webp copy when the browser accepts WebP. */
	private function use_webp( $html ) {
		$uploads = wp_get_upload_dir();
		$dir     = $uploads['basedir'];
		$url     = '#(?:https?:)?' . preg_quote( preg_replace( '#^https?:#', '', $uploads['baseurl'] ), '#' ) . '/([^"\'\s,?)]+\.(?:jpe?g|png))(?![.\w])#i';

		$html = preg_replace_callback( '#<(?:img|source)\b[^>]*>|<link\b[^>]*\bas=["\']image["\'][^>]*>#i', function ( $tag ) use ( $url, $dir ) {
			return preg_replace_callback( $url, function ( $m ) use ( $dir ) {
				return file_exists( $dir . '/' . rawurldecode( $m[1] ) . '.webp' ) ? $m[0] . '.webp' : $m[0];
			}, $tag[0] );
		}, $html );

		// Blocks rendered by React read their image URLs from data-attributes JSON (slashes escaped as \/).
		if ( null === $html ) {
			return null; // process_html keeps the page from before this step
		}
		$json = '#(?:https?:)?' . preg_quote( str_replace( '/', '\/', preg_replace( '#^https?:#', '', $uploads['baseurl'] ) ), '#' ) . '\\\\/((?:[^"\'&\s\\\\]|\\\\/)+?\.(?:jpe?g|png))(?![.\w])#i';
		return preg_replace_callback( '#\sdata-attributes=(["\'])(.*?)\1#s', function ( $attr ) use ( $json, $dir ) {
			return preg_replace_callback( $json, function ( $m ) use ( $dir ) {
				return file_exists( $dir . '/' . rawurldecode( str_replace( '\/', '/', $m[1] ) ) . '.webp' ) ? $m[0] . '.webp' : $m[0];
			}, $attr[0] );
		}, $html );
	}

	/** "Require meaningful filenames": refuse names a camera or phone made up. */
	public function check_filename( $file ) {
		$name = (string) ( $file['name'] ?? '' );
		if ( ! preg_match( '/\.(jpe?g|png|gif|webp|avif|heic|heif)$/i', $name ) ) {
			return $file;
		}
		$base     = pathinfo( $name, PATHINFO_FILENAME );
		$patterns = [
			// Cameras and phones: IMG_1234, IMG_E1234 (an iPhone edit), IMG-20240101-WA0001 (WhatsApp), _MG_1234 (Canon),
			// PXL_20240101_123456789.MP (Pixel) — with a " 2", "(1)", "-edited" or "copy" a computer may have added.
			'/^(IMG|IMG_E|DSC|DSCN|DSCF|DCIM|PXL|MVIMG|GOPR|DJI|SAM|WP|PICT|CIMG|IMAG|PHOTO|_MG|_DSC)[-_ ]?\d{3,}[\d_ ()~-]*(WA\d+[\d_ ()~-]*)?(\.(MP|PORTRAIT|NIGHT))*([-_ ]?(edited|copy))?$/i',
			'/^P\d{7}$/i',
			// Screenshots, in the languages phones and computers name them — followed by a date, a number or nothing, so a
			// described name such as "screenshot-settings-page.png" is fine.
			'/^(Screenshot|Screen Shot|Screen Recording|Capture d.écran|Captura de pantalla|Captura de Tela|Bildschirmfoto|Schermafbeelding|Schermata|Skärmavbild|Skjermbilde|Zrzut ekranu|Snímek obrazovky|Снимок экрана|スクリーンショット|屏幕截图|截屏|螢幕截圖|Snip|Snapshot)(?=[\s_.(-]*(\d|\(|at\b|from\b|on\b|$))/iu',
			'/^(WhatsApp Image\b|signal-\d{4}-\d{2}-\d{2})/i',
			'/^(image|img|photo|picture|pic|untitled|untitled design|unnamed|download|file|scan)[-_ ]*\(?\d*\)?$/i',
			'/^\d{8}[-_ ]?\d{6}/',
			'/^\d{5,}$/',
			'/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-/i',
		];
		foreach ( $patterns as $pattern ) {
			if ( preg_match( $pattern, $base ) ) {
				$file['error'] = sprintf(
					/* translators: %s: uploaded file name. */
					__( '“%s” still has the name the camera or phone gave it. Rename it to say what the picture shows — for example “blue-ceramic-mug.jpg” — and upload it again. Search engines read filenames, and a clear name is easy to find in the media library later.', 'b-blocks' ),
					// Plain text only: some uploaders print this message without escaping it.
					sanitize_text_field( $name )
				);
				break;
			}
		}
		return $file;
	}

	/* ---- Require alt text ---- */

	public function register_alt_meta() {
		register_post_meta( '', self::ALT_META, [
			'type'          => 'string',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		] );
	}

	/** Images without alt text, from the post markup and from bBlocks block attributes ({ url, alt }). */
	private function images_missing_alt( $content ) {
		$missing = [];
		$p       = new \WP_HTML_Tag_Processor( $content );
		while ( $p->next_tag( 'img' ) ) {
			// Decorative images (WCAG: empty alt, marked presentational or hidden) are allowed — filler text would be wrong.
			if ( in_array( strtolower( (string) $p->get_attribute( 'role' ) ), [ 'presentation', 'none' ], true ) || 'true' === strtolower( (string) $p->get_attribute( 'aria-hidden' ) ) ) {
				continue;
			}
			if ( '' === trim( (string) $p->get_attribute( 'alt' ) ) ) {
				$missing[] = wp_basename( strtok( (string) $p->get_attribute( 'src' ), '?' ) );
			}
		}

		$walk = function ( $value ) use ( &$walk, &$missing ) {
			if ( ! is_array( $value ) ) {
				return;
			}
			if ( isset( $value['url'] ) && is_string( $value['url'] ) && array_key_exists( 'alt', $value ) && '' === trim( (string) $value['alt'] ) && preg_match( '/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i', $value['url'] ) ) {
				$missing[] = wp_basename( strtok( $value['url'], '?' ) );
			}
			foreach ( $value as $child ) {
				$walk( $child );
			}
		};
		$blocks = function ( $list ) use ( &$blocks, $walk ) {
			foreach ( $list as $block ) {
				if ( 0 === strpos( (string) $block['blockName'], 'b-blocks/' ) ) {
					$walk( $block['attrs'] );
				}
				$blocks( $block['innerBlocks'] );
			}
		};
		$blocks( parse_blocks( $content ) );

		return array_values( array_unique( array_filter( $missing ) ) );
	}

	/**
	 * A post that still contains an image with no alt text is kept as a draft. A post that is
	 * already live is not taken offline on update — it only gets the warning.
	 */
	/** Block editor saves go through wp/v2 `rest_pre_insert_{type}`; WooCommerce, importers and other plugins do not. */
	public function watch_rest_saves() {
		foreach ( get_post_types( [ 'show_in_rest' => true ] ) as $type ) {
			add_filter( "rest_pre_insert_{$type}", [ $this, 'mark_editor_save' ] );
		}
	}

	public function mark_editor_save( $prepared ) {
		$this->editorSave = true;
		return $prepared;
	}

	/** Only a save a person makes in an editor — never importers, cron, WP-CLI, WooCommerce or other plugins' code. */
	private function is_editor_save() {
		if ( ( defined( 'WP_IMPORTING' ) && WP_IMPORTING ) || wp_doing_cron() || ( defined( 'WP_CLI' ) && WP_CLI ) || ! is_user_logged_in() ) {
			return false;
		}
		if ( $this->editorSave ) {
			return true;
		}
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WordPress verified the edit form; this only reads which form it was.
		$action = isset( $_POST['action'] ) ? sanitize_key( wp_unslash( $_POST['action'] ) ) : '';
		return is_admin() && in_array( $action, [ 'editpost', 'inline-save' ], true );
	}

	public function check_alt_text( $data, $postarr ) {
		$this->altMissing = null;
		if ( 'attachment' === $data['post_type'] || ! is_post_type_viewable( $data['post_type'] ) ) {
			return $data;
		}
		// Used once: posts other code inserts later in the same request (on save_post…) are not the person's save.
		$editor           = $this->is_editor_save();
		$this->editorSave = false;
		if ( ! $editor ) {
			return $data;
		}
		if ( ! in_array( $data['post_status'], [ 'publish', 'future' ], true ) ) {
			// A save that publishes nothing (a draft, pending review): a list from an earlier publish attempt no longer
			// applies, and the editor would show it again after this save.
			$this->altMissing = [];
			return $data;
		}
		$this->altMissing = $this->images_missing_alt( wp_unslash( $data['post_content'] ) );
		$wasLive          = ! empty( $postarr['ID'] ) && 'publish' === get_post_status( $postarr['ID'] );
		if ( $this->altMissing && ! $wasLive ) {
			$data['post_status'] = 'draft';
		}
		return $data;
	}

	public function save_alt_result( $post_id ) {
		if ( null === $this->altMissing ) {
			return;
		}
		if ( $this->altMissing ) {
			update_post_meta( $post_id, self::ALT_META, wp_json_encode( $this->altMissing ) );
			// Whether the post stayed live (an update) or was kept as a draft: the notice says which.
			set_transient( 'bblocks_alt_' . get_current_user_id(), [ 'list' => $this->altMissing, 'live' => 'publish' === get_post_status( $post_id ) ], MINUTE_IN_SECONDS );
		} else {
			delete_post_meta( $post_id, self::ALT_META );
		}
		$this->altMissing = null;
	}

	/** Block editor: after a save, list the images that kept the post from publishing. */
	public function alt_editor_notice() {
		$draft = __( 'Saved as a draft, not published: add alt text to these images first —', 'b-blocks' );
		$live  = __( 'These images have no alt text yet —', 'b-blocks' );
		wp_register_script( 'bblocks-alt-guard', false, [ 'wp-data', 'wp-notices', 'wp-editor' ], B_BLOCKS_VERSION, true );
		wp_add_inline_script( 'bblocks-alt-guard', '(function(wp){if(!wp||!wp.data){return;}var was=false,draft=' . wp_json_encode( $draft ) . ',live=' . wp_json_encode( $live ) . ',meta=' . wp_json_encode( self::ALT_META ) . ';wp.data.subscribe(function(){var ed=wp.data.select("core/editor");if(!ed||!ed.isSavingPost){return;}var saving=ed.isSavingPost()&&!ed.isAutosavingPost(),done=was&&!saving;was=saving;if(done){var m=ed.getCurrentPostAttribute("meta")||{},list=[];try{list=m[meta]?JSON.parse(m[meta]):[];}catch(e){}var n=wp.data.dispatch("core/notices");if(list.length){n.createWarningNotice((ed.getCurrentPostAttribute("status")==="publish"?live:draft)+" "+list.join(", "),{id:"bblocks-missing-alt"});}else{n.removeNotice("bblocks-missing-alt");}}});})(window.wp);' );
		wp_enqueue_script( 'bblocks-alt-guard' );
	}

	/** Media library: the "Select / Insert" button stays disabled while a chosen image has no alt text. */
	public function alt_media_guard() {
		// Only where content is written. Plugin settings pages, the Customizer and other screens keep the normal media library.
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || ! in_array( $screen->base, [ 'post', 'site-editor' ], true ) ) {
			return;
		}
		$text = __( 'Add alt text first', 'b-blocks' );
		wp_add_inline_script( 'media-views', '(function($,media){if(!media||!media.view||!media.view.Toolbar||!media.view.Toolbar.Select){return;}var Select=media.view.Toolbar.Select,refresh=Select.prototype.refresh,text=' . wp_json_encode( $text ) . ',skip=["featured-image","cropper","customize-image-cropper","replace-image","edit-image","image-details","site-icon-cropper"];Select.prototype.refresh=function(){refresh.apply(this,arguments);var state=this.controller.state(),selection=state&&state.get("selection"),button=this.get("select");if(!selection||!button||!button.model||skip.indexOf(state.id)!==-1){return this;}if(!this._bbAlt){this._bbAlt=true;this._bbText=button.model.get("text");this.listenTo(selection,"add remove reset change:alt",this.refresh);}var missing=selection.filter(function(a){return a.get("type")==="image"&&!$.trim(a.get("alt")||"");});if(missing.length){button.model.set({disabled:true,text:text});}else{button.model.set("text",this._bbText);}return this;};})(jQuery,wp.media);' );
	}

	/** Classic editor / quick edit. */
	public function alt_admin_notice() {
		$saved = get_transient( 'bblocks_alt_' . get_current_user_id() );
		if ( ! $saved ) {
			return;
		}
		delete_transient( 'bblocks_alt_' . get_current_user_id() );
		$live = is_array( $saved ) && ! empty( $saved['live'] );
		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s %s</p></div>',
			$live ? esc_html__( 'These images have no alt text yet —', 'b-blocks' ) : esc_html__( 'Saved as a draft, not published: add alt text to these images first —', 'b-blocks' ),
			esc_html( implode( ', ', (array) ( $saved['list'] ?? $saved ) ) )
		);
	}

	/* =====================================================================
	 * Assets
	 * ===================================================================== */

	public function inline_size_limit() {
		return (int) $this->s['assets']['inlineThreshold'];
	}

	/**
	 * Uses the WordPress script-strategy API, which falls back to a normal script on its own
	 * when a script (or one that depends on it) cannot safely be deferred.
	 */
	public function defer_scripts() {
		// WooCommerce cart, checkout and account pages keep their scripts as WooCommerce set them (payment gateways).
		if ( is_admin() || ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() || ( is_singular() && ( has_block( 'woocommerce/cart' ) || has_block( 'woocommerce/checkout' ) ) ) ) ) ) {
			return;
		}
		$skip    = array_merge( [ 'jquery', 'jquery-core', 'jquery-migrate' ], array_map( 'trim', explode( ',', $this->s['assets']['deferExclude'] ) ) );
		$scripts = wp_scripts();
		foreach ( $scripts->registered as $handle => $script ) {
			if ( ! $script->src || in_array( $handle, $skip, true ) || $scripts->get_data( $handle, 'strategy' ) ) {
				continue;
			}
			$scripts->add_data( $handle, 'strategy', 'defer' );
		}
	}

	public function remove_version( $src ) {
		if ( is_admin() || ! is_string( $src ) || false === strpos( $src, 'ver=' ) ) {
			return $src;
		}
		// Only the ver parameter is cut out; the rest stays byte for byte. Rebuilding the query (remove_query_arg) keeps just
		// the last of repeated parameters — a Google Fonts URL with family=…&family=… lost every font but one — and
		// re-encodes the others.
		list( $url, $fragment ) = array_pad( explode( '#', $src, 2 ), 2, null );
		$at = strpos( $url, '?' );
		if ( false === $at ) {
			return $src;
		}
		$keep = array_filter( explode( '&', substr( $url, $at + 1 ) ), function ( $pair ) {
			return '' !== $pair && 'ver' !== $pair && 0 !== strpos( $pair, 'ver=' );
		} );
		return substr( $url, 0, $at ) . ( $keep ? '?' . implode( '&', $keep ) : '' ) . ( null === $fragment ? '' : '#' . $fragment );
	}

	public function resource_hints( $urls, $relation ) {
		$fonts = $this->s['fonts'];
		if ( 'preconnect' === $relation || 'dns-prefetch' === $relation ) {
			foreach ( array_filter( array_map( 'trim', explode( ',', $this->s['assets']['preconnect'] ) ) ) as $domain ) {
				$url  = preg_match( '#^(https?:)?//#', $domain ) ? $domain : 'https://' . $domain;
				$host = (string) wp_parse_url( $url, PHP_URL_HOST );
				// Not a host name (a typo, a sentence): no hint, rather than one to a made-up address.
				if ( ! preg_match( '/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i', $host ) ) {
					continue;
				}
				// Font files are always fetched in CORS mode: a preconnect without crossorigin opens a connection they
				// cannot use, and the browser opens a second one.
				$urls[] = 'preconnect' === $relation && preg_match( '/(^|\.)(gstatic\.com|typekit\.net)$|(^|[.-])fonts?\./i', $host )
					? [ 'href' => $url, 'crossorigin' => 'anonymous' ]
					: $url;
			}
		}
		return array_values( array_filter( $urls, function ( $url ) use ( $fonts ) {
			$href = is_array( $url ) ? ( $url['href'] ?? '' ) : $url;
			if ( $fonts['disableGoogle'] && preg_match( '#fonts\.(googleapis|gstatic)\.com#', $href ) ) {
				return false;
			}
			return ! ( $this->s['platform']['disableEmojis'] && false !== strpos( $href, 's.w.org' ) );
		} ) );
	}

	/** Comments and extra whitespace out of inline CSS; inline JS only loses indentation and blank lines. */
	private function minify_inline( $html ) {
		$original = $html;
		// <textarea>, <template> and comments hold text, not page CSS or JS: never touched (see delay_scripts()).
		preg_match_all( '#<!--.*?-->|<(textarea|template)\b[^>]*>.*?</\1\s*>#is', $html, $found, PREG_OFFSET_CAPTURE );
		$inert = [];
		foreach ( $found[0] ?? [] as $f ) {
			$inert[] = [ $f[1], $f[1] + strlen( $f[0] ) ];
		}
		$html = preg_replace_callback( '#(<style\b[^>]*>)(.*?)(</style>)#is', function ( $o ) use ( $inert ) {
			if ( $this->in_ranges( $o[0][1], $inert ) ) {
				return $o[0][0];
			}
			$m = [ $o[0][0], $o[1][0], $o[2][0], $o[3][0] ];
			// Quoted strings (content: "a ; b", font names, data URIs) are split out and kept byte for byte.
			$parts = preg_split( '/("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')/s', $m[2], -1, PREG_SPLIT_DELIM_CAPTURE );
			if ( false === $parts ) {
				return $m[0]; // the split gave up (a very long string): keep this <style> as it was, never empty
			}
			$css   = '';
			foreach ( $parts as $n => $part ) {
				if ( $n % 2 ) {
					$css .= $part;
					continue;
				}
				$part = preg_replace( '#/\*(?!!).*?\*/#s', '', $part );
				$part = null === $part ? null : preg_replace( '/\s+/', ' ', $part );
				$part = null === $part ? null : preg_replace( '/\s*([{};])\s*/', '$1', $part );
				if ( null === $part ) {
					return $m[0]; // a regex gave up: this <style> stays as it was, never with CSS missing
				}
				$css .= str_replace( ';}', '}', $part );
			}
			// Never add or drop an !important flag: if the count changed, keep the original CSS.
			if ( preg_match_all( '/!\s*important/i', $css ) !== preg_match_all( '/!\s*important/i', $m[2] ) ) {
				return $m[0];
			}
			return $m[1] . trim( $css ) . $m[3];
		}, $html, -1, $unused, PREG_OFFSET_CAPTURE );
		if ( null === $html ) {
			return $original;
		}

		preg_match_all( '#<!--.*?-->|<(textarea|template)\b[^>]*>.*?</\1\s*>#is', $html, $found, PREG_OFFSET_CAPTURE );
		$inert = [];
		foreach ( $found[0] ?? [] as $f ) {
			$inert[] = [ $f[1], $f[1] + strlen( $f[0] ) ];
		}
		return preg_replace_callback( '#(<script\b(?:[^>"\']++|"[^"]*+"|\'[^\']*+\')*+>)(.*?)(</script>)#is', function ( $o ) use ( $inert ) {
			if ( $this->in_ranges( $o[0][1], $inert ) ) {
				return $o[0][0];
			}
			$m = [ $o[0][0], $o[1][0], $o[2][0], $o[3][0] ];
			// Template literals and backslash line-continuations carry their whitespace inside strings: leave those scripts alone.
			if ( '' === trim( $m[2] ) || false !== strpos( $m[2], '`' ) || preg_match( '/\\\\\R/', $m[2] ) || preg_match( '/type=["\']?text\/(template|html|x-)/i', $m[1] ) ) {
				return $m[0];
			}
			$lines = array_filter( array_map( 'trim', preg_split( '/\R/', $m[2] ) ), 'strlen' );
			return $m[1] . implode( "\n", $lines ) . $m[3];
		}, $html, -1, $unused, PREG_OFFSET_CAPTURE );
	}

	/**
	 * Scripts Delay JavaScript never holds back: those of bBlocks blocks and of bBlocks itself, with everything they need
	 * (React, WordPress libraries, Swiper…). Many bBlocks blocks draw themselves, or build their layout CSS, in these
	 * scripts: delayed, a hero section stayed empty until the first interaction — 5.6 s for a visitor or a search engine
	 * that never interacts — and the page jumped when it appeared.
	 */
	private function bblocks_script_handles() {
		$scripts = wp_scripts();
		$todo    = [];
		foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $type ) {
			if ( 0 === strpos( $name, 'b-blocks/' ) ) {
				$todo = array_merge( $todo, (array) $type->view_script_handles, (array) $type->script_handles );
			}
		}
		foreach ( array_keys( $scripts->registered ) as $handle ) {
			if ( preg_match( '/^(b-blocks|bblocks)[-_]/i', (string) $handle ) ) {
				$todo[] = $handle;
			}
		}
		$keep = [];
		while ( $todo ) {
			$handle = array_pop( $todo );
			if ( isset( $keep[ $handle ] ) || ! isset( $scripts->registered[ $handle ] ) ) {
				continue;
			}
			$keep[ $handle ] = true;
			$todo            = array_merge( $todo, (array) $scripts->registered[ $handle ]->deps );
		}
		return array_keys( $keep );
	}

	/** "Delay JavaScript until user interaction": classic scripts wait for the first scroll, tap, key or mouse move. */
	private function delay_scripts( $html ) {
		$keep = [];
		foreach ( array_merge( array_filter( array_map( 'trim', explode( ',', $this->s['assets']['deferExclude'] ) ) ), $this->bblocks_script_handles() ) as $handle ) {
			foreach ( [ '-js', '-js-before', '-js-after', '-js-extra', '-js-translations' ] as $suffix ) {
				$keep[] = $handle . $suffix;
			}
		}

		// Text that only looks like a script: inside a <textarea>, a <template> (copied in later by script) or a comment.
		preg_match_all( '#<!--.*?-->|<(textarea|template)\b[^>]*>.*?</\1\s*>#is', $html, $found, PREG_OFFSET_CAPTURE );
		$inert = [];
		foreach ( $found[0] ?? [] as $f ) {
			$inert[] = [ $f[1], $f[1] + strlen( $f[0] ) ];
		}

		$count    = 0;
		$original = $html;
		// Attributes read with their quotes, so a ">" inside one (data-x="a>b") does not end the tag early.
		$html = preg_replace_callback( '#<script\b((?:[^>"\']++|"[^"]*+"|\'[^\']*+\')*+)>(.*?)</script>#is', function ( $m ) use ( $keep, &$count, $inert ) {
			if ( $this->in_ranges( $m[0][1], $inert ) ) {
				return $m[0][0];
			}
			$attrs = $m[1][0];
			// Modules, JSON, import maps and templates are left alone; so are nomodule fallbacks, which a current browser
			// never runs — delayed, the loader would wait for them forever.
			if ( preg_match( '/(?<=\s)type=["\']?([^"\'\s>]+)/i', $attrs, $type ) && ! in_array( strtolower( $type[1] ), [ 'text/javascript', 'application/javascript' ], true ) ) {
				return $m[0][0];
			}
			if ( preg_match( '/(?<=\s)nomodule\b/i', $attrs ) || false !== strpos( $attrs, 'data-bblocks-keep' ) || ( preg_match( '/(?<=\s)id=["\']([^"\']+)/i', $attrs, $id ) && in_array( $id[1], $keep, true ) ) ) {
				return $m[0][0];
			}
			++$count;
			$attrs = preg_replace( '/(?<=\s)type=["\'][^"\']*["\']/i', '', $attrs );
			$attrs = preg_replace( '/(?<=\s)src=/i', 'data-bblocks-src=', $attrs );
			return '<script type="bblocks/delay"' . $attrs . '>' . $m[2][0] . '</script>';
		}, $html, -1, $unused, PREG_OFFSET_CAPTURE );

		// The regex gave up part way (huge page, no PCRE JIT): delay nothing rather than return a broken page.
		if ( null === $html ) {
			return $original;
		}
		if ( ! $count ) {
			return $html;
		}

		$timeout = (int) $this->s['assets']['delayTimeout'] * 1000;
		// A click or tap that comes before the scripts have run (often the very first touch on a phone) would find no handler
		// yet and be lost: it is held, and the first one is replayed on the same element once they have run.
		$loader  = '<script data-bblocks-keep>(function(){var done=false,held=null,ev=["keydown","mousedown","mousemove","touchstart","scroll","wheel"];function hold(e){if(held===false||!e.isTrusted){return;}e.preventDefault();e.stopImmediatePropagation();if(!held){held=e.target;}run();}function run(){if(done){return;}done=true;ev.forEach(function(e){removeEventListener(e,run,{passive:true});});'
			// Same order the browser would have used: normal and inline scripts first, in document order,
			// then the defer/async ones (e.g. block view scripts that need jQuery from the footer).
			. 'var all=[].slice.call(document.querySelectorAll(\'script[type="bblocks/delay"]\')),late=function(s){return s.hasAttribute("data-bblocks-src")&&(s.hasAttribute("defer")||s.hasAttribute("async"));},list=all.filter(function(s){return !late(s);}).concat(all.filter(late)),dcl=[],wl=[],dAdd=document.addEventListener,wAdd=window.addEventListener,onload=window.onload;'
			. 'document.addEventListener=function(t,f,o){if(t==="DOMContentLoaded"){dcl.push(f);return;}return dAdd.call(document,t,f,o);};'
			. 'window.addEventListener=function(t,f,o){if(t==="load"){wl.push(f);return;}if(t==="DOMContentLoaded"){dcl.push(f);return;}return wAdd.call(window,t,f,o);};'
			. 'var cur=null,dw=document.write,dwl=document.writeln;document.write=function(){var h=[].join.call(arguments,"");if(cur&&cur.parentNode){cur.insertAdjacentHTML("afterend",h);}};document.writeln=function(){document.write([].join.call(arguments,"")+"\\n");};'
			. 'function finish(){document.write=dw;document.writeln=dwl;document.addEventListener=dAdd;window.addEventListener=wAdd;var ev=function(t,cur){var e=new Event(t);Object.defineProperty(e,"target",{value:document});Object.defineProperty(e,"currentTarget",{value:cur});return e;};dcl.forEach(function(f){try{f.call(document,ev("DOMContentLoaded",document));}catch(e){console.error(e);}});wl.forEach(function(f){try{f.call(window,ev("load",window));}catch(e){console.error(e);}});if(window.onload&&window.onload!==onload){try{window.onload(ev("load",window));}catch(e){console.error(e);}}removeEventListener("click",hold,true);var t=held;held=false;if(t&&t.isConnected){t.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));}}'
			// Download every delayed file at once (they still run one by one, in order): fetched one after another they took
			// seconds on a slow connection.
			. 'list.forEach(function(s){var u=s.getAttribute("data-bblocks-src");if(u){var l=document.createElement("link");l.rel="preload";l.as="script";l.fetchPriority="low";l.href=u;if(s.hasAttribute("crossorigin")){l.crossOrigin=s.getAttribute("crossorigin");}if(s.integrity){l.integrity=s.integrity;}document.head.appendChild(l);}});'
			. '(function next(){var old=list.shift();if(!old){finish();return;}var s=document.createElement("script");[].forEach.call(old.attributes,function(a){if(a.name==="type"){return;}s.setAttribute(a.name==="data-bblocks-src"?"src":a.name,a.value);});'
			. 'cur=s;if(old.hasAttribute("data-bblocks-src")){s.async=false;s.onload=s.onerror=next;old.parentNode.replaceChild(s,old);}else{s.text=old.textContent;old.parentNode.replaceChild(s,old);next();}})();}'
			. 'ev.forEach(function(e){addEventListener(e,run,{passive:true});});addEventListener("click",hold,true);setTimeout(run,' . $timeout . ');})();</script>';

		$at = strripos( $html, '</body>' );
		return false !== $at ? substr_replace( $html, $loader, $at, 0 ) : $html . $loader;
	}

	/* =====================================================================
	 * Fonts
	 * ===================================================================== */

	private function google_fonts_pattern() {
		return '#(?:https?:)?//fonts\.googleapis\.com/css2?\?[^"\'\s)<>]+#i';
	}

	private function remove_google_fonts( $html ) {
		$html = preg_replace( '#<link\b[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*#i', '', $html );
		if ( null === $html ) {
			return null; // process_html keeps the page from before this step
		}
		return preg_replace( '#@import\s+(?:url\(\s*)?[\'"]?(?:https?:)?//fonts\.googleapis\.com[^;)\'"]*[\'"]?\s*\)?\s*;?#i', '', $html );
	}

	/** Trim weights, force display=swap and/or swap Google for a local copy — for <link> tags and @import alike. */
	private function rewrite_google_fonts( $html ) {
		// No Google Fonts stylesheet on this page: nothing to trim, swap or host (and no reading of up to 40 stylesheets).
		if ( false === stripos( $html, 'fonts.googleapis.com' ) ) {
			return $html;
		}
		$fonts = $this->s['fonts'];
		$used  = $fonts['usedWeights'] ? $this->used_font_weights( $html ) : null;

		$rewrite = function ( $m ) use ( $fonts, $used ) {
			// Re-encode with the same entity the page used (&#038; from esc_url, &amp; from esc_html).
			$entity   = false !== strpos( $m[0], '&#038;' ) ? '&#038;' : ( false !== strpos( $m[0], '&amp;' ) ? '&amp;' : '' );
			$original = str_replace( [ '&#038;', '&amp;' ], '&', $m[0] );
			// Always https (an http:// link would go to the downloader, which only fetches https, and be retried for ever).
			$url      = preg_replace( '#^(?:https?:)?//#i', 'https://', $original );
			$start    = $url;

			if ( $used ) {
				$url = $this->filter_font_weights( $url, $used );
			}
			if ( $fonts['fontSwap'] ) {
				$url = preg_match( '/[?&]display=/', $url ) ? preg_replace( '/([?&])display=[^&]*/', '$1display=swap', $url ) : $url . '&display=swap';
			}
			if ( $fonts['hostLocal'] ) {
				$local = $this->local_font_css( $url );
				if ( $local ) {
					return $local;
				}
			}
			// Nothing to trim or swap: leave the URL exactly as the page printed it.
			if ( $url === $start ) {
				return $m[0];
			}
			return $entity ? str_replace( '&', $entity, $url ) : $url;
		};

		// Only where a stylesheet loads from: <link> tags and @import inside <style>. A URL in visible text
		// (a code sample, a search query echoed back) is content, and must not start a font download.
		$out = preg_replace_callback( '#<link\b[^>]*>|<style\b[^>]*>.*?</style>#is', function ( $m ) use ( $rewrite ) {
			return preg_replace_callback( $this->google_fonts_pattern(), $rewrite, $m[0] );
		}, $html );
		return null === $out ? $html : $out;
	}

	/** Weights the page asks for in its inline CSS, plus 400 and (when there are headings or bold text) 700. */
	private function used_font_weights( $html ) {
		$weights = [ 400 ];
		$text    = $html;

		// Stylesheets on this site (theme, bBlocks view.css…) can ask for weights the HTML never mentions.
		static $files = [];
		preg_match_all( '#<link\b[^>]*rel=["\']stylesheet["\'][^>]*>#i', $html, $links );
		foreach ( array_slice( $links[0], 0, 40 ) as $link ) {
			if ( ! preg_match( '#href=["\']([^"\']+)#i', $link, $href ) ) {
				continue;
			}
			$path = $this->url_to_path( html_entity_decode( $href[1] ) );
			if ( ! $path || ! is_readable( $path ) || filesize( $path ) > 2 * MB_IN_BYTES ) {
				continue;
			}
			if ( ! isset( $files[ $path ] ) ) {
				preg_match_all( '/font-weight\s*:\s*[^;}]+/i', (string) file_get_contents( $path ), $found ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				$files[ $path ] = implode( ';', $found[0] );
			}
			$text .= ';' . $files[ $path ];
		}

		// CSS (font-weight: 600), style attributes, and block attributes in JSON ("fontWeight":"600", &quot;fontWeight&quot;:600).
		preg_match_all( '/font-?weight(?:&quot;|["\'\s:])*(\d{3}|bold|bolder|normal|lighter)/i', $text, $m );
		foreach ( $m[1] as $value ) {
			$value     = strtolower( $value );
			$weights[] = is_numeric( $value ) ? (int) $value : ( in_array( $value, [ 'bold', 'bolder' ], true ) ? 700 : ( 'lighter' === $value ? 300 : 400 ) );
		}
		if ( preg_match( '/<(h[1-6]|strong|b|th)\b/i', $html ) ) {
			$weights[] = 700;
		}
		return array_values( array_unique( $weights ) );
	}

	private function filter_font_weights( $url, $used ) {
		list( $base, $query ) = array_pad( explode( '?', $url, 2 ), 2, '' );
		$parts = explode( '&', $query );
		foreach ( $parts as &$part ) {
			if ( 0 !== strpos( $part, 'family=' ) ) {
				continue;
			}
			$value = rawurldecode( substr( $part, 7 ) );
			if ( preg_match( '/^([^:]+):((?:ital,)?wght)@(.+)$/', $value, $m ) ) {
				// css2: family=Roboto:wght@100;400;700  or  family=Roboto:ital,wght@0,400;1,700
				$keep = array_filter( explode( ';', $m[3] ), function ( $tuple ) use ( $used ) {
					$comma = strrpos( $tuple, ',' );
					return false !== strpos( $tuple, '..' ) || in_array( (int) ( false === $comma ? $tuple : substr( $tuple, $comma + 1 ) ), $used, true );
				} );
				if ( $keep ) {
					$part = 'family=' . $m[1] . ':' . $m[2] . '@' . implode( ';', $keep );
				}
			} elseif ( false === strpos( $base, 'css2' ) && false !== strpos( $value, ':' ) ) {
				// css v1: family=Roboto:300,400,700i|Open+Sans:400
				$families = [];
				foreach ( explode( '|', $value ) as $family ) {
					list( $name, $list ) = array_pad( explode( ':', $family, 2 ), 2, '' );
					// "regular" / "italic" have no number and are kept; 700i keeps its weight 700.
					$keep       = array_filter( explode( ',', $list ), function ( $w ) use ( $used ) {
						return ! (int) $w || in_array( (int) $w, $used, true );
					} );
					$families[] = $keep ? $name . ':' . implode( ',', $keep ) : $family;
				}
				$part = 'family=' . implode( '|', $families );
			}
		}
		return $base . '?' . implode( '&', $parts );
	}

	/** URL of the local copy of a Google Fonts stylesheet; when there is none yet, download it in the background. */
	private function local_font_css( $url ) {
		$key = md5( $url );
		if ( file_exists( self::cache_dir() . 'fonts/' . $key . '/style.css' ) ) {
			$this->localFontCss[] = self::cache_dir() . 'fonts/' . $key . '/style.css';
			return self::cache_url() . 'fonts/' . $key . '/style.css';
		}
		$state = get_transient( 'bblocks_font_' . $key );
		if ( ! $state ) {
			set_transient( 'bblocks_font_' . $key, 1, HOUR_IN_SECONDS );
			wp_schedule_single_event( time(), self::FONTS_HOOK, [ $url ] );
		}
		// Do not cache a page that still points at Google while the local copy is on its way. After a failed download
		// (this host cannot reach Google, say) it keeps using Google — and is cached like any other page.
		if ( 'failed' !== $state ) {
			$this->skipStore = true;
		} else {
			$this->fontFallback = true; // rebuilt like a page with a nonce, so the copy picks up the local font once it exists
		}
		return '';
	}

	public function download_google_font( $url ) {
		// The URL arrives as a cron argument: only ever ask Google Fonts.
		if ( ! preg_match( '#^https://fonts\.googleapis\.com/css2?\?#', (string) $url ) ) {
			return;
		}
		$response = wp_remote_get( $url, [
			'timeout'             => 10,
			'limit_response_size' => 512 * KB_IN_BYTES,
			// A current browser user agent gets WOFF2 files.
			'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
		] );
		// Only a stylesheet is kept as style.css (an error page served with 200 is a failure too).
		// limit_response_size cuts a longer reply short without an error: a body that reached the limit is a failure too.
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) || false === stripos( (string) wp_remote_retrieve_header( $response, 'content-type' ), 'text/css' ) || strlen( wp_remote_retrieve_body( $response ) ) >= 512 * KB_IN_BYTES ) {
			set_transient( 'bblocks_font_' . md5( $url ), 'failed', DAY_IN_SECONDS ); // try again tomorrow
			return;
		}

		$key    = md5( $url );
		$dir    = self::cache_dir() . 'fonts/' . $key . '/';
		$base   = self::cache_url() . 'fonts/' . $key . '/';
		$failed = false;
		$css    = preg_replace_callback( '#url\((https://fonts\.gstatic\.com/[^)]+)\)#', function ( $m ) use ( $dir, $base, &$failed ) {
			// Font files only, whatever the URL says (never a .php in a public folder).
			$ext  = strtolower( pathinfo( (string) wp_parse_url( $m[1], PHP_URL_PATH ), PATHINFO_EXTENSION ) );
			$name = md5( $m[1] ) . '.' . ( in_array( $ext, [ 'woff2', 'woff', 'ttf', 'otf' ], true ) ? $ext : 'woff2' );
			if ( ! file_exists( $dir . $name ) ) {
				$file = wp_remote_get( $m[1], [ 'timeout' => 10, 'limit_response_size' => 5 * MB_IN_BYTES ] );
				$body   = is_wp_error( $file ) ? '' : wp_remote_retrieve_body( $file );
				$length = is_wp_error( $file ) ? 0 : (int) wp_remote_retrieve_header( $file, 'content-length' );
				// Cut short (the size limit, a dropped connection): never stored as if it were the font.
				if ( is_wp_error( $file ) || 200 !== wp_remote_retrieve_response_code( $file ) || strlen( $body ) >= 5 * MB_IN_BYTES || ( $length && strlen( $body ) !== $length ) || ! $this->write_file( $dir . $name, $body ) ) {
					$failed = true;
					return $m[0];
				}
			}
			return 'url(' . $base . $name . ')';
		}, wp_remote_retrieve_body( $response ) );

		// Any missing file: keep using Google and try again once the hour-long transient runs out.
		if ( ! $failed ) {
			$this->write_file( $dir . 'style.css', $css );
		} else {
			set_transient( 'bblocks_font_' . $key, 'failed', DAY_IN_SECONDS ); // try again tomorrow
		}
	}

	/** font-display: swap on every inline @font-face. */
	private function font_display_swap( $html ) {
		return preg_replace_callback( '#(<style\b[^>]*>)(.*?)(</style>)#is', function ( $m ) {
			$css = preg_replace_callback( '/@font-face\s*\{([^}]*)\}/i', function ( $f ) {
				$body = preg_match( '/font-display\s*:/i', $f[1] ) ? preg_replace( '/font-display\s*:\s*[^;}]+/i', 'font-display:swap', $f[1] ) : 'font-display:swap;' . $f[1];
				return '@font-face{' . $body . '}';
			}, $m[2] );
			// Never add or drop an !important flag: if the count changed (or a regex gave up), keep the original CSS.
			if ( null === $css || preg_match_all( '/!\s*important/i', $css ) !== preg_match_all( '/!\s*important/i', $m[2] ) ) {
				return $m[0];
			}
			return $m[1] . $css . $m[3];
		}, $html );
	}

	/** <link rel=preload> for the first "Max fonts to preload" WOFF2 files, Latin subsets first. */
	private function font_preloads( $html ) {
		$css = '';
		preg_match_all( '#<style\b[^>]*>(.*?)</style>#is', $html, $styles );
		$css .= implode( "\n", $styles[1] );
		foreach ( array_unique( $this->localFontCss ) as $file ) {
			$css .= "\n" . (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		}

		// Families this page really uses: a CSS rule sets them (body, headings, elements), the page carries the theme's
		// class for them (.has-fira-code-font-family), or a bBlocks block asks for them in its typography ("fontFamily":"Inter").
		// A theme ships every preset's @font-face; preloading one nobody uses only delays the fonts that are.
		$body    = (string) substr( $html, (int) stripos( $html, '<body' ) );
		$presets = [];
		preg_match_all( '/--wp--preset--font-family--([\w-]+)\s*:\s*([^;}]+)/i', $css, $vars, PREG_SET_ORDER );
		foreach ( $vars as $v ) {
			$presets[ strtolower( $v[1] ) ] = strtolower( trim( explode( ',', $v[2] )[0], " \t\n\"'" ) );
		}
		$used = [];
		preg_match_all( '/([^{}]+)\{([^{}]*)\}/', $css, $rules, PREG_SET_ORDER );
		foreach ( $rules as $r ) {
			if ( false !== stripos( $r[1], '@font-face' ) || ! preg_match( '/font-family\s*:\s*([^;}]+)/i', $r[2], $f ) ) {
				continue;
			}
			$value  = preg_replace( '/\s*!\s*important\s*$/i', '', $f[1] );
			$family = preg_match( '/var\(\s*--wp--preset--font-family--([\w-]+)/i', $value, $p ) ? ( $presets[ strtolower( $p[1] ) ] ?? '' ) : strtolower( trim( explode( ',', $value )[0], " \t\n\"'" ) );
			// A utility class applies only where an element carries it (not where the CSS merely names it, as in a
			// classic theme's footer styles).
			if ( '' === $family || ( preg_match( '/^\.(has-[\w-]+-font-family)$/i', trim( $r[1] ), $class ) && ! preg_match( '/class=["\'][^"\']*\b' . preg_quote( $class[1], '/' ) . '\b/', $body ) ) ) {
				continue;
			}
			$used[ $family ] = true;
		}
		preg_match_all( '/fontFamily(?:&quot;|["\'])\s*:\s*(?:&quot;|["\'])([^"&\'\\\\]+)/i', $body, $blockFamilies );
		foreach ( $blockFamilies[1] as $family ) {
			$used[ strtolower( trim( $family ) ) ] = true;
		}

		preg_match_all( '/@font-face\s*\{([^}]*)\}/i', $css, $faces );
		$latin = [];
		$other = [];
		foreach ( $faces[1] as $face ) {
			if ( ! preg_match( '#url\(\s*[\'"]?((?:https?:)?//[^\'")]+\.woff2)#i', $face, $u ) ) {
				continue;
			}
			// Nothing could be read (unusual CSS): every face stays a candidate, as before.
			if ( $used && preg_match( '/font-family\s*:\s*([^;}]+)/i', $face, $ff ) && ! isset( $used[ strtolower( trim( explode( ',', $ff[1] )[0], " \t\n\"'" ) ) ] ) ) {
				continue;
			}
			if ( ! preg_match( '/unicode-range/i', $face ) || preg_match( '/U\+0000-00FF/i', $face ) ) {
				$latin[] = $u[1];
			} else {
				$other[] = $u[1];
			}
		}

		$out = '';
		foreach ( array_slice( array_unique( array_merge( $latin, $other ) ), 0, max( 1, (int) $this->s['fonts']['preloadMax'] ) ) as $url ) {
			$out .= '<link rel="preload" href="' . esc_url( $url ) . '" as="font" type="font/woff2" crossorigin />';
		}
		return $out;
	}

	/* =====================================================================
	 * Platform
	 * ===================================================================== */

	public function dequeue_embed() {
		wp_dequeue_script( 'wp-embed' );
	}

	/**
	 * bBlocks Posts lists `dashicons` as a style, and Button / Testimonials draw icons with the font.
	 * Block themes render before <head>, so this is known in time; on classic themes a block found
	 * later puts the stylesheet back (WordPress prints it in the footer).
	 */
	public function watch_dashicons( $content, $block ) {
		$name = (string) ( $block['blockName'] ?? '' );
		$type = $name ? \WP_Block_Type_Registry::get_instance()->get_registered( $name ) : null;
		if ( in_array( $name, [ 'b-blocks/posts', 'b-blocks/button', 'b-blocks/testimonials' ], true ) || ( $type && in_array( 'dashicons', (array) $type->style_handles, true ) ) || false !== strpos( $content, 'dashicons' ) ) {
			$this->needDashicons = true;
			if ( did_action( 'wp_enqueue_scripts' ) ) {
				wp_enqueue_style( 'dashicons' );
			}
		}
		return $content;
	}

	public function dequeue_dashicons() {
		if ( ! is_user_logged_in() && ! $this->needDashicons ) {
			wp_dequeue_style( 'dashicons' );
		}
	}

	public function remove_jquery_migrate( $scripts ) {
		if ( ! is_admin() && isset( $scripts->registered['jquery'] ) ) {
			$scripts->registered['jquery']->deps = array_diff( $scripts->registered['jquery']->deps, [ 'jquery-migrate' ] );
		}
	}

	public function heartbeat_settings( $settings ) {
		$settings['interval'] = (int) $this->s['platform']['heartbeatInterval'];
		return $settings;
	}

	public function touch_targets_css() {
		echo '<style id="bblocks-touch-targets">@media (max-width:781px){.wp-block-button__link,.wp-element-button,.wp-block-social-link-anchor,[class*="wp-block-b-blocks-"] button,[class*="wp-block-b-blocks-"] a:has(>svg),[class*="wp-block-b-blocks-"] a:has(>i){min-width:44px;min-height:44px}.wp-block-social-link-anchor,[class*="wp-block-b-blocks-"] a:has(>svg),[class*="wp-block-b-blocks-"] a:has(>i){display:inline-flex;align-items:center;justify-content:center}}</style>' . "\n";
	}
}

new BBlocksPerformance();