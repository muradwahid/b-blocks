<?php
namespace BBlocks\Inc;

class BBlocksAjax{
	function __construct(){
		add_action( 'wp_ajax_bBlocksUserRoles', [$this, 'bBlocksUserRoles'] );
	}

	function bBlocksUserRoles(){
		$nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ?? '' ) );

		if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
			wp_send_json_error( 'Invalid Request' );
		}

		if ( !current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		global $wp_roles;
		wp_send_json_success( $wp_roles->get_names() );
	}
}

new BBlocksAjax();