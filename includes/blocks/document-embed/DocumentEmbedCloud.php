<?php
/**
 * Document Embed — cloud pickers (editor only).
 *
 * Dropbox and Google Drive pickers run entirely in the editor with the public ids saved in
 * Settings → Integration. Box needs an access token, so this class runs Box's OAuth sign-in:
 * the editor asks for a token; without one it gets a sign-in URL, Box redirects back to
 * admin-post.php, and the short-lived access token is kept for that user only. Box's refresh
 * token is discarded on purpose: no long-lived account access is stored on the site.
 *
 * @package bBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'BBlocksDocumentEmbedCloud' ) ) {

	class BBlocksDocumentEmbedCloud {

		const NONCE = 'bb_de_cloud';

		public function __construct() {
			add_action( 'wp_ajax_bb_de_box_token', [ $this, 'boxToken' ] );
			add_action( 'admin_post_bb_de_box_callback', [ $this, 'boxCallback' ] );
		}

		/**
		 * The client-side ids the editor needs, for users who can edit posts. Never the Box secret.
		 */
		public static function editorConfig() {
			if ( ! current_user_can( 'edit_posts' ) ) {
				return [];
			}

			$keys   = get_option( 'bBlocksApiKeys', [] );
			$drive  = $keys['googleDrive'] ?? [];
			$box    = $keys['box'] ?? [];

			return [
				'nonce'          => wp_create_nonce( self::NONCE ),
				'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
				'integrationUrl' => current_user_can( 'manage_options' ) ? admin_url( 'admin.php?page=b-blocks#/settings/integration' ) : '',
				'dropbox'        => (string) ( $keys['dropbox']['key'] ?? '' ),
				'google'         => ! empty( $drive['key'] ) && ! empty( $drive['clientId'] ) ? [
					'apiKey'   => (string) $drive['key'],
					'clientId' => (string) $drive['clientId'],
					'appId'    => (string) ( $drive['appId'] ?? '' ),
				] : '',
				'box'            => ! empty( $box['key'] ) && ! empty( $box['clientSecret'] ) ? '1' : '',
			];
		}

		public static function redirectUri() {
			return admin_url( 'admin-post.php?action=bb_de_box_callback' );
		}

		private static function tokenKey() {
			return 'bb_de_box_token_' . get_current_user_id();
		}

		/**
		 * The current user's Box access token, or the URL to sign in to Box.
		 */
		public function boxToken() {
			check_ajax_referer( self::NONCE, 'nonce' );

			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( [ 'message' => __( 'You are not allowed to do this.', 'b-blocks' ) ], 403 );
			}

			$box = get_option( 'bBlocksApiKeys', [] )['box'] ?? [];

			if ( empty( $box['key'] ) || empty( $box['clientSecret'] ) ) {
				wp_send_json_error( [ 'message' => __( 'Box is not connected in Settings → Integration.', 'b-blocks' ) ] );
			}

			$token = get_transient( self::tokenKey() );
			if ( is_string( $token ) && '' !== $token ) {
				wp_send_json_success( [ 'token' => $token ] );
			}

			// CSRF for the OAuth round trip: Box hands this back and the callback compares it.
			// Reused while it is still valid: two pickers open at once (block and sidebar) must not invalidate the
			// link the other one hands out.
			$state = get_transient( 'bb_de_box_state_' . get_current_user_id() );
			if ( ! is_string( $state ) || '' === $state ) {
				$state = wp_generate_password( 24, false );
				set_transient( 'bb_de_box_state_' . get_current_user_id(), $state, 10 * MINUTE_IN_SECONDS );
			}

			wp_send_json_success( [
				'authUrl' => add_query_arg( [
					'response_type' => 'code',
					'client_id'     => rawurlencode( $box['key'] ),
					'redirect_uri'  => rawurlencode( self::redirectUri() ),
					'state'         => $state,
				], 'https://account.box.com/api/oauth2/authorize' ),
			] );
		}

		/**
		 * Box sends the editor back here after sign-in. Swaps the code for an access token and
		 * closes the popup.
		 */
		public function boxCallback() {
			$message = '';
			$ok      = false;

			// phpcs:disable WordPress.Security.NonceVerification.Recommended -- OAuth redirect: the state parameter is the CSRF check.
			$state = isset( $_GET['state'] ) ? sanitize_text_field( wp_unslash( $_GET['state'] ) ) : '';
			$code  = isset( $_GET['code'] ) ? sanitize_text_field( wp_unslash( $_GET['code'] ) ) : '';
			$error = isset( $_GET['error_description'] ) ? sanitize_text_field( wp_unslash( $_GET['error_description'] ) ) : '';
			// phpcs:enable

			$stateKey = 'bb_de_box_state_' . get_current_user_id();
			$expected = get_transient( $stateKey );
			delete_transient( $stateKey );

			$box = get_option( 'bBlocksApiKeys', [] )['box'] ?? [];

			if ( ! current_user_can( 'edit_posts' ) ) {
				$message = __( 'You are not allowed to do this.', 'b-blocks' );
			} elseif ( '' !== $error ) {
				$message = $error;
			} elseif ( '' === $state || ! is_string( $expected ) || ! hash_equals( $expected, $state ) ) {
				$message = __( 'The Box sign-in expired. Please try again.', 'b-blocks' );
			} elseif ( '' === $code || empty( $box['key'] ) || empty( $box['clientSecret'] ) ) {
				$message = __( 'Box is not connected in Settings → Integration.', 'b-blocks' );
			} else {
				$response = wp_remote_post( 'https://api.box.com/oauth2/token', [
					'timeout' => 15,
					'body'    => [
						'grant_type'    => 'authorization_code',
						'code'          => $code,
						'client_id'     => $box['key'],
						'client_secret' => $box['clientSecret'],
						'redirect_uri'  => self::redirectUri(),
					],
				] );
				$body = json_decode( wp_remote_retrieve_body( $response ), true );

				if ( ! is_wp_error( $response ) && ! empty( $body['access_token'] ) ) {
					// Only the access token, for its own lifetime; the refresh token is not kept.
					$ttl = max( 60, absint( $body['expires_in'] ?? 3600 ) - 60 );
					set_transient( self::tokenKey(), sanitize_text_field( $body['access_token'] ), $ttl );
					$ok = true;
				} else {
					$message = is_wp_error( $response ) ? $response->get_error_message() : ( $body['error_description'] ?? __( 'Box did not return an access token.', 'b-blocks' ) );
				}
			}

			$payload = wp_json_encode( [ 'type' => $ok ? 'bb-box-connected' : 'bb-box-error', 'message' => $message ] );
			// The editor that opened this popup runs on the admin's origin.
			$origin  = wp_json_encode( admin_url() );
			nocache_headers();
			?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title><?php esc_html_e( 'Box', 'b-blocks' ); ?></title></head>
<body style="font-family: sans-serif; padding: 24px;">
	<p><?php echo $ok ? esc_html__( 'Connected to Box. You can close this window.', 'b-blocks' ) : esc_html( $message ); ?></p>
	<script>
		( function () {
			var origin = new URL( <?php echo $origin; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode() ?> ).origin;
			if ( window.opener ) {
				window.opener.postMessage( <?php echo $payload; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode() ?>, origin );
				<?php if ( $ok ) : ?>window.close();<?php endif; ?>
			}
		} )();
	</script>
</body>
</html>
			<?php
			exit;
		}
	}

	new BBlocksDocumentEmbedCloud();
}
