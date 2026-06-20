<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

if( !class_exists( 'LGFRLoginForm' ) ){
	class LGFRLoginForm{
		function __construct(){
			add_action('wp_ajax_nopriv_lgfr_login', [$this, 'onSubmit']);
			add_action('wp_ajax_nopriv_lgfr_password_reset', [$this, 'reset_password_callback']);
		}

	function onSubmit(){
		$nonce    = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );
		$username = sanitize_text_field( wp_unslash( $_POST['user_login'] ?? '' ) );
		$password = sanitize_text_field( wp_unslash( $_POST['user_password'] ?? '' ) );
		$remember = sanitize_text_field( wp_unslash( $_POST['remember'] ?? '' ) ) === 'true';

		if(!wp_verify_nonce($nonce, 'wp_ajax')){
			wp_send_json_error([
				'message' => 'Invalid request',
			]);
		}

		$user = wp_signon([
			'user_login' => $username,
			'user_password' => $password,
			'remember' => $remember
		]);

		if ( is_wp_error( $user ) ) {
			wp_send_json_error([
				'message' => $user->get_error_message()
			]);
		}
		wp_send_json_success([
			'message' => 'Successfully logged in.',
			'user' => $user
		]);
	}

	function reset_password_callback(){
		global $wpdb, $current_site;

		$nonce      = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );
		$user_email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
		$user = get_user_by('email', $user_email);
		$user_login = isset($user->data->user_login) ? $user->data->user_login : false;


		if(!wp_verify_nonce($nonce, 'wp_ajax') || !$user){
			wp_send_json_error([
				'message' => 'Invalid request',
			]);
		}
		
		$key = get_password_reset_key($user);
		if(is_wp_error($key)){
			wp_send_json_error(['message' => $key->get_error_message()]);
		}


		$message = __('Someone requested that the password be reset for the following account:', 'b-blocks') . "\r\n\r\n";
		$message .= network_home_url( '/' ) . "\r\n\r\n";
		$message .= sprintf(__('Username:', 'b-blocks').' %s', $user_login) . "\r\n\r\n";
		$message .= __('If this was a mistake, just ignore this email and nothing will happen.', 'b-blocks') . "\r\n\r\n";
		$message .= __('To reset your password, visit the following address:', 'b-blocks') . "\r\n\r\n";
		$message .= network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login') . ">\r\n";

		if ( is_multisite() ){
				$blogname = $GLOBALS['current_site']->site_name;
			}else{
				// The blogname option is escaped with esc_html on the way into the database in sanitize_option
				// we want to reverse this for the plain text arena of emails.
				$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
			}

		$title = sprintf('[%s]'. __(' Password Reset', 'b-blocks'), $blogname );

		$title = apply_filters('retrieve_password_title', $title);
		$message = apply_filters('retrieve_password_message', $message, $key);

		if ( $message && !wp_mail($user_email, $title, $message) ){
				wp_send_json_error([
					'message' => __('The e-mail could not be sent.', 'b-blocks') . "<br />\n" . __('Possible reason: your host may have disabled the mail() function...', 'b-blocks')
				]);
		}
		
		wp_send_json_success([
			'message' => 'Successfully send mail!',
		]);
		}
	}
	new LGFRLoginForm();
}