<?php
require_once B_BLOCKS_DIR_PATH . 'includes/blocks/form/Helper.php';
require_once B_BLOCKS_DIR_PATH . 'includes/blocks/form/Sanitizer.php';
class BBlocksFormHandler{
	function __construct(){
		add_action('wp_ajax_nopriv_b_form_submit', [$this, 'b_form_submit']);	
		// add_action('wp_ajax_b_form_submit', [$this, 'b_form_submit']);
	}

	function b_form_submit(){

    // verify nonce
		if ( ! isset( $_POST['_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_nonce'] ) ), 'wp_ajax' ) ) {
			wp_send_json_error([ 'message' => __( 'Something went wrong.', 'b-blocks' ) ]);
		}
    // sanitize field data and validate and create wp user_error

    // $userEmail = $this->sanitize_array($_POST['userEmail']) ?? null;
		// $adminEmail = $this->sanitize_array($_POST['adminEmail']) ?? null;

		$payload = [
			'username' => sanitize_text_field($_POST['username'] ?? null),
			'email' => sanitize_email($_POST['email'] ?? null),
			'password' => sanitize_text_field($_POST['password'] ?? null),
			'first_name' => sanitize_text_field($_POST['first_name'] ?? null),
			'last_name' => sanitize_text_field($_POST['last_name'] ?? null),
			'user_url' => sanitize_text_field($_POST['user_url'] ?? null),
			'current_post_id' => sanitize_text_field($_POST['current_post_id'] ?? ''),
			'formId' => sanitize_text_field($_POST['formId'] ?? ''),
			'rememberme' => sanitize_text_field($_POST['rememberme'] ?? ''),
		];

		$form_type = sanitize_text_field( $_POST['type'] ?? '' );

		if($form_type === 'register'){
			return $this->register_user($payload);
		}

		if($form_type === 'login'){
			return $this->login_user($payload);
		}

		if($form_type === 'logout'){
			return $this->logout_user();
		}

		wp_send_json_error([
				'message' => __( 'Something went wrong.', 'b-blocks' )
			]);
	}

	function sanitize_array($array){
		if(!is_array($array)){
			return [];
		}

		foreach($array as $key => $value){
			if(strpos($key, 'secret_key') !== false && strlen($value) == 32){
				$value = sanitize_text_field(str_replace('<', '&lt;', $value) ); 
				$value = sanitize_text_field($value);
				$array[$key] = str_replace(['&lt;', '&gt;', '&amp;'], [ '<', '>', '&'], $value);
			}else {
				if(is_array($value)){
					$array[$key] = $this->sanitize_array($value);
				}else {
					$array[$key] =$value == 'true' ? true : ($value == 'false' ? false :  sanitize_text_field($value));
				}
			}
		}
		return $array;
	}


	function register_user($payload){

		if ( !get_option( 'users_can_register' ) ) {
			wp_send_json_error([
				'message' => __( 'User registration is turned off. Turn it on to allow user registration.', 'b-blocks' )
			]);
		}

		$block_data = BBlocksFormHelper::get_form_data($payload['current_post_id'], $payload['formId'], 'b-blocks/form-builder');

		if ( ( $block_data['attributes']['form']['formType'] ?? '' ) !== 'register' ) {
			wp_send_json_error([
				'message' => __( 'Something went wrong.', 'b-blocks' )
			]);
		}

		
	// 	$this->send_user_email($user_mail, $payload);
	// 	$this->send_admin_email($admin_mail, $payload);

	//  wp_send_json_success([
	// 		'message' => __( 'User registered successfully.', 'b-blocks' )
	// 	]);

		$error = $this->validate_registration_data($payload, BBlocksFormHelper::get_password_requirements($block_data['innerBlocks']));
		if($error){
			wp_send_json_error([
				'message' => $error
			]);
		}
	// ====================== ROLE FIX START ======================
    $requested_role = sanitize_text_field(
        $block_data['attributes']['formOptions']['userRole'] ?? 'subscriber'
    );

    $safe_role = 'subscriber';

    $post_id = intval($payload['current_post_id'] ?? 0);
    if ($post_id) {
        $post_author_id = (int) get_post_field('post_author', $post_id);

        if (user_can($post_author_id, 'promote_users') || user_can($post_author_id, 'manage_options')) {
            $allowed_roles = ['subscriber', 'contributor', 'author', 'editor'];

            if (in_array($requested_role, $allowed_roles, true) && 
                array_key_exists($requested_role, wp_roles()->roles)) {
                $safe_role = $requested_role;
            }
        }
    }
    // ====================== ROLE FIX END ======================

    $user_id = wp_create_user( $payload['username'], $payload['password'], $payload['email'] );
    
    if(is_wp_error($user_id)){
      wp_send_json_error($user_id->get_error_message());
    }

	$user = new \WP_User($user_id);
    $user->set_role($safe_role);

		// $role = ( $block_data['attributes']['formOptions']['userRole'] ?? '' );		
		// if (
		// 	! empty( $role ) &&
		// 	strtolower( $role ) !== 'default' &&
		// 	array_key_exists( $role, wp_roles()->roles )
		// ) {
		// 	$user = new \WP_User( $user_id );
		// 	$user->set_role( $role );
		// }


    if( $user_id ){ // sent mail after create account
				wp_update_user([
					'ID' => $user_id,
					'first_name' => $payload['first_name'],
					'last_name' => $payload['last_name'],
					'user_url' => $payload['user_url']
				]);
		}

		// handle custom fields;
		$custom_fields = $this->get_custom_fields($_POST);
		if ( ! empty( $block_data ) ) {
			$sorted_fields = BBlocksFormHelper::sort_fields( $block_data['innerBlocks'], $custom_fields );
			$schema = BBlocksFormHelper::generate_schema( $sorted_fields );
			$sanitized_fields = BBlocksSanitizer::sanitize($schema, $custom_fields );

			array_walk($sanitized_fields, function ( $value, $key ) use ( $user_id ) {
				update_user_meta( $user_id, 'bblocks_' . $key, $value );
			});
		}

		$user_data = get_userdata($user_id);

		// wp_set_current_user( $user_id );
		// wp_set_auth_cookie( $user_id );

		// $user_mail= $block_data['attributes']['emailOptions']['user'] ?? null;
		// $admin_mail= $block_data['attributes']['emailOptions']['admin'] ?? null;

		// $this->send_user_email($user_mail, $payload);
		// $this->send_admin_email($admin_mail, $payload);

		wp_send_json_success( [ 'message' => __( 'User registered successfully.', 'b-blocks' ) ] );
		
	}

	function login_user($payload){
		$block_data = BBlocksFormHelper::get_form_data( $payload['current_post_id'], $payload['formId'], 'b-blocks/form-builder' );

		

		$username = $payload['username'];
		$email = $payload['email'];
		$password = $payload['password'];
		$remember = isset( $payload['rememberme'] ) && $payload['rememberme'] === 'on';

		if($email && !$username){
			$username = $email;
		}

		$secure_cookie = is_ssl();
		$user_signon = wp_signon( array(
			'user_login' => $username,
			'user_password' => $password,
			'remember'      => $remember,
		), $secure_cookie );

		if ( is_wp_error( $user_signon ) ) {
			wp_send_json_error( [ 'message' => $user_signon->get_error_message(),'errorCode'=>$user_signon->get_error_code()] );
		}

		wp_set_current_user( $user_signon->ID );
		
		wp_send_json_success([
			'message'      => __( 'You have logged in successfully.', 'b-blocks' ),
		]);
	}	

	function logout_user(){
		
	}

	private function validate_registration_data( $payload, $passwordRequirements ) {
		if ( empty( $payload['username'] ) || ! validate_username( $payload['username'] ) ) {
			return __( 'Invalid username.', 'b-blocks' );
		} elseif ( username_exists( $payload['username'] ) ) {
			return __( 'Username already exists.', 'b-blocks' );
		}

		if ( empty( $payload['email'] ) || ! is_email( $payload['email'] ) ) {
			return __( 'Invalid email address.', 'b-blocks' );
		} elseif ( email_exists( $payload['email'] ) ) {
			return __( 'Email already exists.', 'b-blocks' );
		}

		if ( empty( $payload['password'] ) ) {
			return __( 'Password is required.', 'b-blocks' );
		}

		if($passwordRequirements['isWeek']){
			return null;
		}

		if($passwordRequirements['isLowerCase']){
			if ( empty( $payload['password'] ) || ! preg_match( '/[a-z]/', $payload['password'] ) ) {
				return __( 'Password must contain at least one lowercase letter.', 'b-blocks' );
			}
		}
		if($passwordRequirements['isNumber']){
			if ( empty( $payload['password'] ) || ! preg_match( '/[0-9]/', $payload['password'] ) ) {
				return __( 'Password must contain at least one number.', 'b-blocks' );
			}
		}
		if($passwordRequirements['isSpecialChar']){
			if ( empty( $payload['password'] ) || ! preg_match( '/[^a-zA-Z0-9]/', $payload['password'] ) ) {
				return __( 'Password must contain at least one special character.', 'b-blocks' );
			}
		}
		if($passwordRequirements['isUpperCase']){
			if ( empty( $payload['password'] ) || ! preg_match( '/[A-Z]/', $payload['password'] ) ) {
				return __( 'Password must contain at least one uppercase letter.', 'b-blocks' );
			}
		}
		if($passwordRequirements['minLength']){
			if ( empty( $payload['password'] ) || strlen( $payload['password'] ) < $passwordRequirements['minLength'] ) {
				/* translators: %d: minimum password length. */
				return sprintf( __( 'Password must be at least %d characters.', 'b-blocks' ), (int) $passwordRequirements['minLength'] );
			}
		}

		return null;
	}

	private function get_custom_fields( $form_data ) {
		$reserved_keys = [ 'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'user_url', 'current_post_id', 'block_id', 'security', 'action' ];
		return array_diff_key( $form_data, array_flip( $reserved_keys ) );
	}

	function send_user_email($user_email,$payload){
		if(!$user_email){
			return;
		}

		$template = $this->processEmailTemplate($user_email['mail']['message'], $payload);

		$headers[] =  'Content-Type: text/html; charset=UTF-8';
		
		$sent = wp_mail($payload['email'], $user_email['subject'], $template, $headers);
		
		if(!$sent){
			add_action('wp_mail_failed', function ($error) {
				error_log('Failed to send email to user - ' . $error->get_error_message());
			});
		}
	}
	function send_admin_email($admin_email,$payload){
		if(!$admin_email){
			return;
		}
		$template = $this->processEmailTemplate($admin_email['mail']['message'], $payload);
		
		$headers[] =  'Content-Type: text/html; charset=UTF-8';
		
		$sent = wp_mail($admin_email['email'], $admin_email['subject'], $template, $headers);
		
		if(!$sent){
			add_action('wp_mail_failed', function ($error) {
				error_log('Failed to send email to admin - ' . $error->get_error_message());
			});
		}
	}


	function processEmailTemplate($template,$data)
	{
			$processedTemplate = $template;

			foreach ($data as $key => $value) {
					$placeholder = '[' . $key . ']';
					$value = isset($value) ? (string)$value : '';

					$escapedPlaceholder = preg_quote($placeholder, '/');
					$regex = '/' . $escapedPlaceholder . '/g'; 
					$processedTemplate = preg_replace('/' . $escapedPlaceholder . '/', $value, $processedTemplate);
			}

			return $processedTemplate;
	}


}

new BBlocksFormHandler();
