<?php
namespace BBlocks\Inc;

class BBlocksAjax{
	function __construct(){
		add_action( 'wp_ajax_bBlocksUserRoles', [$this, 'bBlocksUserRoles'] );
		add_action( 'wp_ajax_bBlocksPipeChecker', [$this, 'bBlocksPipeChecker'] );
		add_action( 'wp_ajax_nopriv_bBlocksPipeChecker', [$this, 'bBlocksPipeChecker'] );
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

	function bBlocksPipeChecker()
	{
		$nonce = sanitize_text_field(wp_unslash($_POST['_wpnonce'] ?? null ));

		if (!wp_verify_nonce($nonce, 'wp_ajax')) {
			wp_send_json_error('Invalid Request');
		}

		wp_send_json_success([
			'isPipe' => Utils::isPro()
		]);
	}
}

new BBlocksAjax();