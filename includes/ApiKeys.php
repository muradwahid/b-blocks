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
            $apiKeys[$key] = ['key'=> $value];

            $maxToken = absint( wp_unslash( $_POST['maxToken'] ?? 0 ) );
            if ( 'openAi' === $key && $maxToken ) {
                $apiKeys[$key]['maxToken'] = $maxToken;
            }

            if ( 'openAi' === $key && $model ) {
                $apiKeys[$key]['model'] = $model;
            }

            update_option( 'bBlocksApiKeys',$apiKeys);
        }
        wp_send_json_success($apiKeys);
    }
}
new BBlocksApiKeys();