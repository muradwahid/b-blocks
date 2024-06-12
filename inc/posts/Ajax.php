<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

class BBlocksPostsPremium extends BBlocksPosts{
	function __construct(){
		add_action( 'wp_ajax_bBlocksPosts', [$this, 'bBlocksPosts'] );
		add_action( 'wp_ajax_nopriv_bBlocksPosts', [$this, 'bBlocksPosts'] );
	}

	function bBlocksPosts(){
		$nonce = sanitize_text_field( $_POST['_wpnonce'] ) ?? null;

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		$attributes = BBlocks\Inc\Posts\Helpers\Functions::sanitize_array( $_POST['queryAttr'] ) ?? [];
		$pageNumber = (int) sanitize_text_field( $_POST['pageNumber'] ) ?? 1;

		wp_send_json_success( $this->getPosts( $attributes, $pageNumber ) );
	}
}
new BBlocksPostsPremium();