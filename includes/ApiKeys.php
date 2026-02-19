<?php
namespace BBlocks\Inc;
class BBlocksApiKeys{
	function __construct(){
		add_action( 'wp_ajax_bblocks_api_keys', [$this, 'bBlocksApiKeys'] );
		add_action( 'wp_ajax_nopriv_bblocks_api_keys', [$this, 'bBlocksApiKeys'] );
	}

    function bBlocksTestApiKeys($key,$value){
        if ($key == 'openAi') {
            return BBlocksAi::get_instance()->test_api_key($value);
        }
    }

    function bBlocksApiKeys(){
        $nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce']?? null ) ) ;
        if (!current_user_can('manage_options')) {
            wp_send_json_error( 'Unauthorized' );
        }
        if( !wp_verify_nonce( $nonce, 'wp_ajax' ) ){
            wp_send_json_error( 'Invalid Request' );
        }
        $key = $_POST['key'];
        $value = $_POST['value'];
        $apiKeys = get_option('bBlocksApiKeys',[]);
        $error = $this->bBlocksTestApiKeys($key,$value);
        
        if (isset($error['valid']) && !$error['valid']) {
            wp_send_json_error([$key=>$error]);
        }
        if ($key) {
            $apiKeys[$key] = ['key'=> $value];
            update_option( 'bBlocksApiKeys',$apiKeys);
        }
        wp_send_json_success($apiKeys);
    }
}
new BBlocksApiKeys();

