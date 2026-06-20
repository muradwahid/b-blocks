<?php
if( !class_exists( 'BBlocksCustomCursor' ) ){
	class BBlocksCustomCursor{
		function __construct(){
			add_action( 'init', [ $this, 'bBlocksRegisterPostMeta' ] );
			add_action( 'the_content', [ $this, 'bBlocksTheContent' ] );
			add_action("enqueue_block_assets",array( $this, 'bBlocksEnqueueBlockAssets'));
			add_action("enqueue_block_editor_assets",array( $this, 'bBlocksEnqueueBlockEditorAssets' ));
			add_action('wp_ajax_bBlocks_cursor_data_settings', [$this, 'bBlocks_cursor_data_settings']);
			add_action('wp_ajax_bBlocks_get_cursor_data_settings', [$this, 'bBlocks_get_cursor_data_settings']);
			add_action('wp_ajax_nopriv_bBlocks_get_cursor_data_settings', [$this, 'bBlocks_get_cursor_data_settings']);
		}

		function bBlocksRegisterPostMeta(){
			register_post_meta( '', 'bBlocksCursorData', [
				'show_in_rest' => true,
				'single' => true,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			] );
		}

		function bBlocksTheContent( $content ){
			$id = get_the_ID();
			$postMeta = get_post_meta( $id, 'bBlocksCursorData', true );

			if( !$postMeta ){
				return $content;
			}

			return $content . '<div id="bBlocksCursorData" data-cursor="'. esc_attr( $postMeta ) .'"></div>';
		}

		public function bBlocks_cursor_data_settings(){

			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) ), 'wp_ajax' ) ) {
				wp_send_json_error( 'invalid request' );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( 'Unauthorized' );
			}

			$data = json_decode( sanitize_text_field( wp_unslash( $_POST['bBlocksCustomCursor'] ?? '' ) ), true );

			if(!$data){
				$data = get_option('bBlocks_custom_cursor_settings', []);
				wp_send_json_success($data);
			}

			update_option('bBlocks_custom_cursor_settings', $data);
			
			wp_send_json_success($data);

		}

		public function bBlocks_get_cursor_data_settings(){
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) ), 'wp_ajax' ) ) {
				wp_send_json_error('invalid request');
			}

			$data = get_option('bBlocks_custom_cursor_settings', []);
			wp_send_json_success($data);
			

		}

		public function bBlocksEnqueueBlockAssets() {
			wp_enqueue_script( 'bBlocks-cursor', B_BLOCKS_DIR_URL . 'build/cursor/cursor.js', array('react', 'react-dom', 'wp-util'), B_BLOCKS_VERSION, true);
			wp_enqueue_style( 'bBlocks-cursor', B_BLOCKS_DIR_URL . 'build/cursor/cursor.css', array(), B_BLOCKS_VERSION);

			wp_localize_script( 'bBlocks-cursor', 'bBlocksCursorDataConfig', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce('wp_ajax'),
				'dirUrl' => B_BLOCKS_DIR_URL
			));
		}
		
		function bBlocksEnqueueBlockEditorAssets(){
			wp_enqueue_script('bBlocks-cursor-settings', B_BLOCKS_DIR_URL . 'build/cursor/settings.js', array('wp-compose','wp-data','wp-editor','wp-plugins','wp-components','wp-i18n','react','react-dom'), B_BLOCKS_VERSION, true);
			wp_enqueue_style("bBlocks-cursor-settings", B_BLOCKS_DIR_URL . 'build/cursor/settings.css', array(), B_BLOCKS_VERSION);
		}
	}
	new BBlocksCustomCursor();	
}