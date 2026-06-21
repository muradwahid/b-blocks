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
	}

	/**
	 * Accurate Free/Pro counts per category for a type.
	 *
	 * The taxonomy endpoint only exposes a category total plus a single global
	 * "pro" total, with no per-category free/pro split. So we pull the full
	 * lightweight catalog once (ID + category only, 100/page) and tally it.
	 * Result is cached in a transient since the catalog changes rarely.
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

		$cacheKey = 'bblocks_tpl_counts_' . $type;
		$cached   = get_transient( $cacheKey );
		if ( false !== $cached ) {
			wp_send_json_success( $cached );
		}

		$limit = 100;
		$page  = 0;
		$items = [];
		$batch = [];
		$total = 0;
		$guard = 0;

		do {
			$response = wp_remote_get( 'https://templates.bplugins.com/wp-json/gutenberg-templates/v1/blocks?' . http_build_query( [
				'type'     => $type,
				'start'    => $page,
				'end'      => $page + 1,
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
			'categories' => (object) $cats,
		];

		// Cache only a complete tally (don't cache partial results from a failed run).
		if ( count( $items ) >= $total && $total > 0 ) {
			set_transient( $cacheKey, $data, 6 * HOUR_IN_SECONDS );
		}

		wp_send_json_success( $data );
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

		$typeFilter = 'patterns' === $type ? 'patterns-category': 'pages-category';
		// $response =  wp_remote_get('https://templates.bplugins.com/wp-json/gutenberg-templates/v1/taxonomy/taxonomies/plugin,type,'.$typeFilter.'-category');
		$response =  wp_remote_get("https://templates.bplugins.com/wp-json/gutenberg-templates/v1/taxonomy/taxonomies/plugin,type,{$typeFilter}");

		$body = json_decode( wp_remote_retrieve_body( $response ) );
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

		$typeFilter = 'patterns' === $type ? 'patterns': 'pages';

		try {
			$response = wp_remote_get( 'https://templates.bplugins.com/wp-json/gutenberg-templates/v1/blocks?' . http_build_query( [
				'type'     => $typeFilter,
				'start'    => $start,
				'end'      => $pageNumber,
				'category' => $category,
				'keywords' => $search,
				'fields'   => 'ID,category,keywords,original_content,thumbnail,title,type,url',
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

		try {
			$data = Image::instance()->maybe_import_images( wp_unslash( $_POST['original_content'] ?? '' ) );
			wp_send_json_success( $data );
		} catch ( \Throwable $th ) {
			wp_send_json_error( $th->getMessage() );
		}
	}
}
new Templates();