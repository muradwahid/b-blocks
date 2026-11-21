<?php
namespace BBlocks\Inc;
class BBlocksApiKeys{
	function __construct(){
		add_action( 'wp_ajax_bblocks_api_keys', [$this, 'bBlocksApiKeys'] );
		// nopriv hook intentionally omitted — this action requires manage_options capability.
	}

    function bBlocksTestApiKeys($key,$value,$model = ''){
        if ($key == 'openAi') {
            return BBlocksAi::get_instance()->test_api_key($value, $model);
        }
        if ($key == 'instagram') {
            return BBlocksInstagram::test_token($value);
        }

        // Document Embed cloud pickers: these ids are only checked for their format here; the
        // provider confirms them the first time someone browses from the editor.
        $invalid = fn( $message ) => [ 'valid' => false, 'message' => $message ];

        if ( 'dropbox' === $key && ! preg_match( '/^[a-z0-9]{8,40}$/i', $value ) ) {
            return $invalid( __( 'This does not look like a Dropbox app key.', 'b-blocks' ) );
        }

        if ( 'googleDrive' === $key ) {
            if ( ! preg_match( '/^[A-Za-z0-9_\-]{20,60}$/', $value ) ) {
                return $invalid( __( 'This does not look like a Google API key.', 'b-blocks' ) );
            }
            if ( ! preg_match( '/^[A-Za-z0-9\-]+\.apps\.googleusercontent\.com$/', $this->field( 'clientId' ) ) ) {
                return $invalid( __( 'The OAuth client ID ends with .apps.googleusercontent.com.', 'b-blocks' ) );
            }
            if ( ! preg_match( '/^\d{6,20}$/', $this->field( 'appId' ) ) ) {
                return $invalid( __( 'The App ID is your Google Cloud project number (digits only).', 'b-blocks' ) );
            }
        }

        if ( 'box' === $key ) {
            if ( ! preg_match( '/^[a-z0-9]{20,64}$/i', $value ) ) {
                return $invalid( __( 'This does not look like a Box client ID.', 'b-blocks' ) );
            }
            $saved = get_option( 'bBlocksApiKeys', [] );
            if ( '' === $this->field( 'clientSecret' ) && empty( $saved['box']['clientSecret'] ) ) {
                return $invalid( __( 'Enter the Box client secret.', 'b-blocks' ) );
            }
        }
    }

    // An extra credential field sent with a key (cloud pickers).
    private function field( $name ) {
        return sanitize_text_field( wp_unslash( $_POST[ $name ] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in bBlocksApiKeys().
    }

    // Saved keys for the settings page: the Box client secret never goes back to the browser.
    private function forBrowser( $apiKeys ) {
        if ( ! empty( $apiKeys['box']['clientSecret'] ) ) {
            $apiKeys['box']['clientSecret'] = '';
            $apiKeys['box']['hasSecret']    = true;
        }

        return $apiKeys;
    }

    function bBlocksApiKeys(){
        $nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce']?? null ) ) ;

        if( !wp_verify_nonce( $nonce, 'wp_ajax' ) ){
            wp_send_json_error( ['message'=>'Invalid Request'] );
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error( ['message'=>'Unauthorized'] );
        }

        $key   = sanitize_text_field(wp_unslash($_POST['key'] ?? ''));
        $value = sanitize_text_field(wp_unslash($_POST['value'] ?? ''));
        $apiKeys = get_option('bBlocksApiKeys',[]);

        // Model ids are like "gpt-4.1-mini"; reject anything else.
        $model = sanitize_text_field( wp_unslash( $_POST['model'] ?? 'gpt-4.1-mini' ) );

        if ( '' !== $value ) {
            $error = $this->bBlocksTestApiKeys($key,$value,$model);
            
            if (isset($error['valid']) && !$error['valid']) {
                wp_send_json_error([$key=>$error]);
            }
        } elseif ( 'instagram' === $key && class_exists( __NAMESPACE__ . '\BBlocksInstagram' ) ) {
            BBlocksInstagram::flush();
        }

        if ($key) {
            $previous      = $apiKeys[$key] ?? [];
            $apiKeys[$key] = ['key'=> $value];

            // Cloud pickers: the extra ids go with the key, and are cleared with it.
            if ( 'googleDrive' === $key && '' !== $value ) {
                $apiKeys[$key]['clientId'] = $this->field( 'clientId' );
                $apiKeys[$key]['appId']    = $this->field( 'appId' );
            }
            if ( 'box' === $key && '' !== $value ) {
                // Left empty on a later save: keep the secret already stored.
                $secret = $this->field( 'clientSecret' );
                $apiKeys[$key]['clientSecret'] = '' !== $secret ? $secret : ( $previous['clientSecret'] ?? '' );
            }

            $maxToken = absint( wp_unslash( $_POST['maxToken'] ?? 0 ) );
            if ( 'openAi' === $key && $maxToken ) {
                $apiKeys[$key]['maxToken'] = $maxToken;
            }

            if ( 'openAi' === $key && $model ) {
                $apiKeys[$key]['model'] = $model;
            }

            update_option( 'bBlocksApiKeys',$apiKeys);
        }
        wp_send_json_success( $this->forBrowser( $apiKeys ) );
    }
}
new BBlocksApiKeys();