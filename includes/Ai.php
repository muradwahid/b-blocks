<?php
namespace BBlocks\Inc;
    if( !class_exists( 'BBlocksAi' ) ){
	class BBlocksAi{

		public static $_instance = null;

		function __construct(){
			add_action( 'wp_ajax_generate_ai_content', [ $this, 'handle_open_ai_generation' ] );
            add_action( 'enqueue_block_editor_assets', [ $this, 'editorContentGenerateAiAssets' ] );
		}

		public static function get_instance(){
			if(self::$_instance === null){
				self::$_instance = new self();
			}
			return self::$_instance;
		
		}

        function editorContentGenerateAiAssets(){

			wp_enqueue_style( 'b-blocks-ai-generate-content-style', B_BLOCKS_BUILD . 'b-blocks-ai/content-generate-ai.css', ['wp-components','wp-edit-blocks','wp-block-editor'], B_BLOCKS_VERSION );

            wp_enqueue_script('b-blocks-ai-generate-content-script', B_BLOCKS_BUILD . 'b-blocks-ai/content-generate-ai.js',['react'],B_BLOCKS_VERSION, true);
            wp_localize_script( 'b-blocks-ai-generate-content-script', 'aiContentGenerator', [
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'wp_ajax' )
			] );
            wp_enqueue_script( 'b-blocks-ai-generate-content-script');
        }

		public function test_api_key( $api_key ) {
			if ( empty( $api_key ) ) {
				return [ 'valid' => false, 'message' => 'No API key provided' ];
			}

			$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
				'timeout' => 10,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type' => 'application/json'
				],
				'body' => json_encode( [
					'model' => 'gpt-3.5-turbo',
					'messages' => [
						[
							'role' => 'user',
							'content' => 'Say "test"'
						]
					],
					'max_tokens' => 5
				] )
			] );

			if ( is_wp_error( $response ) ) {
				return [ 'valid' => false, 'message' => 'Connection failed: ' . $response->get_error_message() ];
			}

			$response_code = wp_remote_retrieve_response_code( $response );
			
			if ( $response_code === 401 ) {
				return [ 'valid' => false, 'message' => 'Invalid API key' ];
			} 
			elseif ( $response_code === 429 ) {
				return [ 'valid' => true, 'message' => 'Valid key (rate limit exceeded)' ];
			} elseif ( $response_code === 200 ) {
				return [ 'valid' => true, 'message' => 'Valid API key' ];
			} 
			else {
				return [ 'valid' => false, 'message' => 'API error (HTTP ' . $response_code . ')' ];
			}
		}

		public function handle_open_ai_generation() {
			// Verify nonce
			if ( ! wp_verify_nonce( $_POST['nonce'], 'wp_ajax' ) ) {
				wp_send_json_error( [ 'message' => 'Security check failed' ] );
				return;
			}

			// Check if user has permissions
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( [ 'message' => 'Insufficient permissions' ] );
				return;
			}

			$prompt = sanitize_text_field( $_POST['prompt'] );
			
			if ( empty( $prompt ) ) {
				wp_send_json_error( [ 'message' => 'Prompt is required' ] );
				return;
			}

			$generated_content = $this->call_ai_service( $prompt );
			
			if ( is_wp_error( $generated_content ) ) {
				// wp_send_json_success( ['conteddnt' => $generated_content] );
				wp_send_json_error( [ 
					'message' => $generated_content->get_error_message()
				] );
				return;
			}

			wp_send_json_success( [ 
				'content' => $generated_content 
			] );
		}

		private function call_ai_service( $prompt ) {
			$api_data = get_option( 'bBlocksApiKeys', [] );
			$openAi = $api_data['openAi'];
			$api_key = $openAi['key'];
			
			// Check if API key is set
			if ( empty( $api_key ) ) {
				wp_send_json_error( [ 'message' => 'OpenAI API key is not configured. Please set it in Settings.' ] );
				// return new WP_Error( 'missing_api_key', 'OpenAI API key is not configured. Please set it in Settings > AI Content Generator.' );
			}

			// Remove strict validation - just check if it's not empty
			if ( empty( trim( $api_key ) )) {
				wp_send_json_error( [ 'message' =>  'API key appears to be empty. Please check your settings.' ] );
				// return new WP_Error( 'invalid_api_key', 'API key appears to be empty. Please check your settings.' );
			}

				$newPrompt = "You are a professional content writer.\n" .
				"Topic: $prompt\n" .
				"Tone: professional, informative, and persuasive.\n" .
				"Length: approximately 150-200 words, formatted with headings and bullet points.\n" .
				"Format the content with proper headings, paragraphs, and bullet points where appropriate.\n" .
				"The content should be engaging, well-structured, and optimized for web reading.\n" .
				"\n" .
				"Output only the content (no meta text or explanations).";

			$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
				'timeout' => 30,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type' => 'application/json'
				],
				'body' => json_encode( [
					'model' => 'gpt-3.5-turbo',
					'messages' => [
						[
							'role' => 'user',
							'content' => $newPrompt
						]
					],
					'max_tokens' => 1000,
					'temperature' => 0.7
				] )
			] );
			
			if ( is_wp_error( $response ) ) {
				wp_send_json_error( [ 'message' => 'Failed to connect to OpenAI API: ' . $response->get_error_message()] );
				// return new WP_Error( 'api_connection_error', 'Failed to connect to OpenAI API: ' . $response->get_error_message() );
			}
			
			$response_code = wp_remote_retrieve_response_code( $response );
			$response_body = wp_remote_retrieve_body( $response );
			$data = json_decode( $response_body, true );
			
			if ( $response_code === 401 ) {
				wp_send_json_error( [ 'message' => 'Invalid OpenAI API key. Please check your API key in the dashboard settings.' ] );
				// return new WP_Error( 'invalid_api_key', 'Invalid OpenAI API key. Please check your API key in the plugin settings.' );
			}
			
			if ( $response_code === 429 ) {
				$error_message = 'OpenAI API rate limit exceeded. You may have exceeded your quota or are making too many requests.';
				if ( isset( $data['error']['message'] ) ) {
					$error_message = $data['error']['message'];
				}
				wp_send_json_error( [ 'message' => $error_message ] );
				// return new WP_Error( 'rate_limit', $error_message );
			}
			
			if ( $response_code !== 200 ) {
				$error_message = isset( $data['error']['message'] ) ? $data['error']['message'] : 'Unknown API error (HTTP ' . $response_code . ')';
				wp_send_json_error( [ 'message' => $error_message ] );
				// return new \WP_Error( 'api_error', $error_message );
			}
			
			if ( isset( $data['choices'][0]['message']['content'] ) ) {
				wp_send_json_success( [ 'content' => $data['choices'][0]['message']['content'] ] );
				// return trim( $data['choices'][0]['message']['content'] );
			}
			wp_send_json_error( [ 'message' => 'Invalid response format from AI service' ] );
			// return new WP_Error( 'invalid_response', 'Invalid response format from AI service' );
		}
	}
	new BBlocksAi();
}
?>