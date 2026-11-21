<?php
namespace BBlocks\Inc\Templates;

if ( !defined( 'ABSPATH' ) ) {
	exit;
}

require_once B_BLOCKS_DIR_PATH . '/includes/Templates/Image.php';

class Templates {
	public function __construct() {
		add_action( 'wp_ajax_bblocks_templates_main', [$this, 'bblocks_templates_main'] );
		add_action( 'wp_ajax_bblocks_templates', [$this, 'bblocks_templates'] );
		add_action( 'wp_ajax_bblocks_template_import', [$this, 'bblocks_template_import'] );
		add_action( 'wp_ajax_bblocks_template_counts', [$this, 'bblocks_template_counts'] );
		add_action( 'wp_ajax_bblocks_template_favorites', [$this, 'bblocks_template_favorites'] );
	}

	/**
	 * Accurate Free/Pro counts per category for a type.
	 *
	 * Shape: { all, free, pro, categories: { <cat>: { total, free, pro } } }
	 */
	public function bblocks_template_counts(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? '' ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$type = 'pages' === sanitize_text_field( wp_unslash( $_POST['type'] ?? 'patterns' ) ) ? 'pages' : 'patterns';
		$data = $this->catalog_counts( $type );

		wp_send_json_success( [
			'all'        => $data['all'],
			'free'       => $data['free'],
			'pro'        => $data['pro'],
			'categories' => (object) $data['categories'],
		] );
	}

	/**
	 * Free/Pro counts per category of the b-blocks templates of a type.
	 *
	 * The library holds the templates of every bPlugins plugin, and its taxonomy
	 * endpoint only knows global totals (no per-plugin or per-category free/pro
	 * split). So the full lightweight b-blocks catalog (ID + category) is pulled and
	 * tallied. The API returns at most 100 templates per request, hence the paging.
	 * A complete tally is cached for 6 hours; both endpoints above read it.
	 *
	 * @param string $type patterns or pages.
	 * @return array { all, free, pro, categories: [ <cat> => { total, free, pro } ] }
	 */
	private function catalog_counts( $type ) {
		$cacheKey = 'bblocks_tpl_counts_' . $type;
		$cached   = get_transient( $cacheKey );
		if ( false !== $cached ) {
			// Older caches stored categories as an object.
			$cached['categories'] = (array) $cached['categories'];
			return $cached;
		}

		$limit = 100;
		$page  = 0;
		$items = [];
		$batch = [];
		$total = 0;
		$guard = 0;

		do {
			$response = wp_remote_get( self::api_base() . '/wp-json/gutenberg-templates/v1/blocks?' . http_build_query( [
				'type'     => $type,
				'start'    => $page,
				'end'      => $page + 1,
				'plugin'   => 'b-blocks',
				'category' => 'all',
				'keywords' => '',
				'limit'    => $limit,
				'fields'   => 'ID,category',
			] ), [ 'timeout' => 20 ] );

			if ( is_wp_error( $response ) ) {
				break;
			}

			$body  = json_decode( wp_remote_retrieve_body( $response ), true );
			$batch = isset( $body['patterns'] ) && is_array( $body['patterns'] ) ? $body['patterns'] : [];
			$total = isset( $body['count'] ) ? (int) $body['count'] : count( $items );
			$items = array_merge( $items, $batch );

			$page++;
			$guard++;
		} while ( count( $batch ) === $limit && count( $items ) < $total && $guard < 20 );

		$cats    = [];
		$allFree = 0;
		$allPro  = 0;

		foreach ( $items as $it ) {
			$itemCats = isset( $it['category'] ) && is_array( $it['category'] ) ? $it['category'] : [];
			$isPro    = in_array( 'pro', $itemCats, true );

			if ( $isPro ) { $allPro++; } else { $allFree++; }

			foreach ( $itemCats as $c ) {
				if ( 'pro' === $c || 'free' === $c ) {
					continue;
				}
				if ( ! isset( $cats[ $c ] ) ) {
					$cats[ $c ] = [ 'total' => 0, 'free' => 0, 'pro' => 0 ];
				}
				$cats[ $c ]['total']++;
				if ( $isPro ) { $cats[ $c ]['pro']++; } else { $cats[ $c ]['free']++; }
			}
		}

		$data = [
			'all'        => count( $items ),
			'free'       => $allFree,
			'pro'        => $allPro,
			'categories' => $cats,
		];

		// Cache only a complete tally (don't cache partial results from a failed run).
		if ( count( $items ) >= $total && $total > 0 ) {
			set_transient( $cacheKey, $data, 6 * HOUR_IN_SECONDS );
		}

		return $data;
	}

	public function bblocks_templates_main(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? null ) );
		$type = sanitize_text_field( wp_unslash( $_POST['type'] ?? 'patterns' ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$typeName   = 'patterns' === $type ? 'patterns' : 'pages';
		$typeFilter = $typeName . '-category';
		$response   = wp_remote_get( self::api_base() . "/wp-json/gutenberg-templates/v1/taxonomy/taxonomies/plugin,type,{$typeFilter}?" . http_build_query( [
			'plugin' => 'b-blocks',
		] ) );

		$body   = json_decode( wp_remote_retrieve_body( $response ) );
		$counts = $this->catalog_counts( $typeName );

		// The taxonomy lists the categories of every bPlugins plugin with their global counts. Keep
		// only the categories that have b-blocks templates, with b-blocks counts — the same numbers
		// bblocks_template_counts returns, so the sidebar does not change once those load.
		// If the catalog could not be read, send the list unchanged rather than an empty one.
		if ( $body && isset( $body->{$typeFilter} ) && is_array( $body->{$typeFilter} ) && $counts['all'] > 0 ) {
			$cats = [];
			foreach ( $body->{$typeFilter} as $cat ) {
				if ( 'pro' === $cat->name || 'free' === $cat->name ) {
					$cat->count = $counts[ $cat->name ];
				} elseif ( isset( $counts['categories'][ $cat->name ] ) ) {
					$cat->count = $counts['categories'][ $cat->name ]['total'];
				} else {
					continue;
				}
				$cats[] = $cat;
			}
			$body->{$typeFilter} = $cats;

			// The type total (used until the counts load) is also global; make it b-blocks only.
			foreach ( (array) ( $body->type ?? [] ) as $t ) {
				if ( $typeName === $t->name ) {
					$t->count = $counts['all'];
				}
			}
		}

		wp_send_json_success( $body );
	}

	public function bblocks_templates(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? null ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$type = sanitize_text_field( wp_unslash( $_POST['type'] ?? 'patterns') ) ;
        $category = sanitize_text_field( wp_unslash( $_POST['category'] ?? 'all' ) );
        $pageNumber = absint( wp_unslash( $_POST['pageNumber'] ?? 1 ) );
        $pageNumber = $pageNumber > 0 ? $pageNumber : 1;
        $start = $pageNumber - 1;
        $search = sanitize_text_field( wp_unslash( $_POST['search'] ?? '' ) );
		$perPage = max( 1, min( 100, absint( wp_unslash( $_POST['perPage'] ?? 9 ) ) ) );

		$typeFilter = 'patterns' === $type ? 'patterns': 'pages';

		try {
			$response = wp_remote_get( self::api_base() . '/wp-json/gutenberg-templates/v1/blocks?' . http_build_query( [
				'type'     => $typeFilter,
				'start'    => $start,
				'end'      => $pageNumber,
				'limit'    => $perPage,
				'category' => $category,
				'plugin'   => 'b-blocks',
				'keywords' => $search,
				'fields'   => 'ID,category,keywords,original_content,thumbnail,title,type,url,preview_url',
			] ) );
			
			// old
			// $response = wp_remote_get( "https://templates.bplugins.com/wp-json/gutenberg-templates/v1/$typeFilter?start=$start&end=$pageNumber&category=$category&keywords=$search&fields=ID,category,keywords,original_content,thumbnail,title,type,url" );
			
			$body = json_decode( wp_remote_retrieve_body( $response ) );
			wp_send_json_success( $body );
		} catch (\Throwable $th) {
			wp_send_json_error( $th->getMessage() );
		}
	}

	public function bblocks_template_import(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? '' ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$patternId = absint( wp_unslash( $_POST['id'] ?? 0 ) );

		try {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- serialized block markup: kses strips HTML comments, which are the block delimiters. Gated by the nonce and capability checks above.
			$content = wp_unslash( $_POST['original_content'] ?? '' );

			// Sideloading copies the template's images into the media library, so it is limited to
			// users who may upload. Everyone else gets the markup with its original image URLs.
			$data = current_user_can( 'upload_files' ) ? Image::instance()->maybe_import_images( $content ) : $content;
			$this->track_event( 'download', $patternId );
			wp_send_json_success( $data );
		} catch ( \Throwable $th ) {
			wp_send_json_error( $th->getMessage() );
		}
	}

	/**
	 * Favorite template IDs, in the bblocksFavoritesTemplates option as { patterns: [...ids], pages: [...ids] }.
	 * Saves when a favorites JSON payload is posted, then returns the current list.
	 */
	public function bblocks_template_favorites(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? '' ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		// Fixed for b-blocks: the component also posts a prefix, which must not pick another option.
		$optionKey = 'bblocksFavoritesTemplates';

		if ( isset( $_POST['favorites'] ) ) {
			$before = get_option( $optionKey, [ 'patterns' => [], 'pages' => [] ] );

			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- a JSON string; every decoded value is cast through absint() below.
			$raw = json_decode( wp_unslash( $_POST['favorites'] ), true );

			$favorites = [
				'patterns' => array_values( array_unique( array_map( 'absint', (array) ( $raw['patterns'] ?? [] ) ) ) ),
				'pages'    => array_values( array_unique( array_map( 'absint', (array) ( $raw['pages'] ?? [] ) ) ) ),
			];

			update_option( $optionKey, $favorites, false );

			// Tell the pattern library which templates were added or removed.
			foreach ( [ 'patterns', 'pages' ] as $favType ) {
				$was = array_map( 'absint', (array) ( $before[ $favType ] ?? [] ) );

				foreach ( array_diff( $favorites[ $favType ], $was ) as $id ) {
					$this->track_event( 'favorite', $id );
				}

				foreach ( array_diff( $was, $favorites[ $favType ] ) as $id ) {
					$this->track_event( 'unfavorite', $id );
				}
			}
		}

		wp_send_json_success( get_option( $optionKey, [ 'patterns' => [], 'pages' => [] ] ) );
	}

	/**
	 * Base URL of the pattern library. Filterable so a local copy of the library can be used while developing.
	 *
	 * @return string
	 */
	private static function api_base() {
		return untrailingslashit( apply_filters( 'b_blocks_templates_api_base', 'https://templates.bplugins.com' ) );
	}

	/**
	 * Whether the site owner agreed to share usage data (Freemius opt-in).
	 *
	 * @return bool
	 */
	private static function can_track() {
		$allowed = function_exists( 'b_blocks_fs' ) && method_exists( b_blocks_fs(), 'is_tracking_allowed' ) && b_blocks_fs()->is_tracking_allowed();

		return (bool) apply_filters( 'b_blocks_templates_tracking_allowed', $allowed );
	}

	/**
	 * Tell the pattern library about an import or a favorite change.
	 *
	 * Fire and forget: non-blocking, so the user never waits and a failure never affects the import.
	 * Nothing is sent unless the site owner opted in to usage tracking.
	 *
	 * @param string $event     download, favorite or unfavorite.
	 * @param int    $patternId Pattern ID from the library.
	 * @return void
	 */
	private function track_event( $event, $patternId ) {
		$patternId = absint( $patternId );

		if ( ! $patternId || ! self::can_track() ) {
			return;
		}

		wp_remote_post( self::api_base() . '/wp-json/gutenberg-templates/v1/track', [
			'blocking' => false,
			'timeout'  => 2,
			'body'     => [
				'event'  => $event,
				'id'     => $patternId,
				'plugin' => 'b-blocks',
			],
		] );
	}
}
new Templates();