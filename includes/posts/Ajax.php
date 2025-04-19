<?php
namespace BBlocks\Inc\Posts;

if ( !defined( 'ABSPATH' ) ) { exit; }

class Ajax{
	function __construct(){
		add_action( 'wp_ajax_bBlocksPosts', [$this, 'postsAjax'] );
		add_action( 'wp_ajax_nopriv_bBlocksPosts', [$this, 'postsAjax'] );
	}

	function postsAjax(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ) ?? null;

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		$attributes = Functions::sanitize_array( wp_unslash( $_POST['queryAttr'] ) ) ?? [];
		$pageNumber = (int) sanitize_text_field( wp_unslash( $_POST['pageNumber'] ) ) ?? 1;

		wp_send_json_success( Posts::getPosts( $attributes, $pageNumber ) );
	}
}
new Ajax();