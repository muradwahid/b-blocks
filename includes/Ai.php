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

            wp_enqueue_script('b-blocks-ai-generate-content-script', B_BLOCKS_BUILD . 'b-blocks-ai/content-generate-ai.js',['react', 'wp-util', 'wp-hooks', 'wp-components', 'wp-block-editor', 'wp-compose', 'wp-i18n'],B_BLOCKS_VERSION, true);
			// Only a flag goes to the editor; the key itself stays on the server
			$api_data = get_option( 'bBlocksApiKeys', [] );
			wp_localize_script( 'b-blocks-ai-generate-content-script', 'aiContentGenerator', [
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'wp_ajax' ),
				'hasApiKey' => ! empty( trim( $api_data['openAi']['key'] ?? '' ) )
			] );
            wp_enqueue_script( 'b-blocks-ai-generate-content-script');
        }

		public function test_api_key( $api_key, $model = '' ) {
			if ( empty( $api_key ) ) {
				return [ 'valid' => false, 'message' => 'No API key provided' ];
			}

			$model = ! empty( $model ) ? $model : 'gpt-4.1-mini';

			$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
				'timeout' => 10,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type' => 'application/json'
				],
				'body' => json_encode( [
					'model' => $model,
					'messages' => [
						[
							'role' => 'user',
							'content' => 'Say "hi"'
						]
					],
					// GPT-5 models reject max_tokens; max_completion_tokens works for all
					'max_completion_tokens' => 5
				] )
			] );

			if ( is_wp_error( $response ) ) {
				return [ 'valid' => false, 'message' => 'Connection failed: ' . $response->get_error_message() ];
			}

			$response_code = wp_remote_retrieve_response_code( $response );
			$data = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( $response_code === 401 ) {
				return [ 'valid' => false, 'message' => 'Invalid API key' ];
			}
			elseif ( $response_code === 429 ) {
				return [ 'valid' => true, 'message' => 'Valid key (rate limit exceeded)' ];
			} elseif ( $response_code === 200 ) {
				return [ 'valid' => true, 'message' => 'Valid API key' ];
			}
			else {
				// e.g. a deprecated or unavailable model comes back as 404 with the reason in the body
				$message = $data['error']['message'] ?? 'API error (HTTP ' . $response_code . ')';
				return [ 'valid' => false, 'message' => $message ];
			}
		}

		public function handle_open_ai_generation() {
			// Verify nonce
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) ), 'wp_ajax' ) ) {
				wp_send_json_error( [ 'message' => 'Security check failed' ] );
				return;
			}

			// Check if user has permissions
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( [ 'message' => 'Insufficient permissions' ] );
				return;
			}

			$prompt = sanitize_text_field( wp_unslash( $_POST['prompt'] ?? '' ) );
			
			if ( empty( $prompt ) ) {
				wp_send_json_error( [ 'message' => 'Prompt is required' ] );
				return;
			}

			$length = sanitize_key( wp_unslash( $_POST['length'] ?? 'medium' ) );
			$tone   = sanitize_key( wp_unslash( $_POST['tone'] ?? 'informative' ) );

			$custom_words = absint( wp_unslash( $_POST['customWords'] ?? 0 ) );

			$generated_content = $this->call_ai_service( $prompt, $length, $tone, $custom_words );
			
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

		private function call_ai_service( $prompt, $length = 'medium', $tone = 'informative', $custom_words = 0 ) {
			$api_data = get_option( 'bBlocksApiKeys', [] );
			$openAi   = isset( $api_data['openAi'] ) && is_array( $api_data['openAi'] ) ? $api_data['openAi'] : [];
			$api_key  = $openAi['key'] ?? '';
			// Same default the dashboard's Max Token field shows
			$max_tokens = absint( $openAi['maxToken'] ?? 0 ) ?: 1500;
			$model    = ! empty( $openAi['model'] ) ? $openAi['model'] : 'gpt-4.1-mini';

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

			// Keys must match the Length / Tone options in ContentGenerateApi.js
			$lengths = [
				'short'  => '3-8',
				'medium' => '10-15',
				'large'  => '20-30',
				'big'    => '40-60',
			];
			$tones = [ 'informative', 'casual', 'friendly', 'professional', 'inspirational', 'minimal' ];

			// Custom word count is capped at 500, same as the number field's max
			if ( 'custom' === $length && $custom_words ) {
				$words = 'about ' . min( $custom_words, 500 );
			} else {
				$words = $lengths[ $length ] ?? $lengths['medium'];
			}
			$tone  = in_array( $tone, $tones, true ) ? $tone : 'informative';

			$newPrompt = "You are a professional content writer.\n" .
				"Topic: $prompt\n" .
				"Tone: $tone.\n" .
				"Target Audience: Web Readers\n" .
				"Length: $words words.\n" .
				"Output Instructions:\n" .
				"- Provide only the generated content as plain text.\n" .
				"- Do not use headings, bullet points, or surrounding quotes.\n" .
				"- Do not include any meta-text, introductions, or post-generation explanations.\n";

			// max_completion_tokens works for every chat model; GPT-5 models reject max_tokens
			// and only accept the default temperature. Their reasoning tokens count against
			// max_completion_tokens, so keep reasoning low or it can use the whole budget and
			// return empty content. 'low' is the lowest value every GPT-5 model accepts
			// (gpt-5.5 rejects 'minimal').
			$body = [
				'model' => $model,
				'messages' => [
					[
						'role' => 'user',
						'content' => $newPrompt
					]
				],
				'max_completion_tokens' => $max_tokens,
			];
			if ( 0 === strpos( $model, 'gpt-5' ) ) {
				$body['reasoning_effort'] = 'low';
			} else {
				$body['temperature'] = 0.7;
			}

			$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
				'timeout' => 30,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type' => 'application/json'
				],
				'body' => json_encode( $body )
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
			
			$content = trim( (string) ( $data['choices'][0]['message']['content'] ?? '' ) );

			if ( '' === $content && 'length' === ( $data['choices'][0]['finish_reason'] ?? '' ) ) {
				wp_send_json_error( [ 'message' => 'The AI ran out of tokens before writing anything. Increase "Max Token" in the dashboard settings and try again.' ] );
			}

			if ( '' !== $content ) {
				wp_send_json_success( [ 'content' => $content ] );
				// return trim( $data['choices'][0]['message']['content'] );
			}
			wp_send_json_error( [ 'message' => 'Invalid response format from AI service' ] );
			// return new WP_Error( 'invalid_response', 'Invalid response format from AI service' );
		}
	}
	new BBlocksAi();
}