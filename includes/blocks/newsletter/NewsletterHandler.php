<?php
/**
 * Newsletter Optin Block — AJAX submission handler.
 *
 * Receives subscribe submissions from the Newsletter Optin block frontend
 * (src/newsletter-optin/view.js) and emails the subscriber details to the
 * configured recipient.
 *
 * SECURITY: the mail recipient is NEVER taken from the client POST. It is
 * resolved server-side by parsing the saved block attributes of the post that
 * contains the newsletter form (per-block `adminEmail` override), falling back
 * to the site admin email. This mirrors the open-mail-relay fix applied to the
 * popup-optin handler and prevents an unauthenticated caller from redirecting
 * notification emails to an arbitrary address.
 *
 * @package bBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'BBlocksNewsletterHandler' ) ) {

	class BBlocksNewsletterHandler {

		public function __construct() {
			add_action( 'wp_ajax_bb_newsletter_optin', [ $this, 'handle_submit' ] );
			add_action( 'wp_ajax_nopriv_bb_newsletter_optin', [ $this, 'handle_submit' ] );
		}

		/**
		 * Resolve the mail recipient from saved block content, never from POST.
		 *
		 * Walks the blocks of the given post, finds the first
		 * `b-blocks/newsletter-optin` block with a non-empty, valid `adminEmail`
		 * attribute, and returns it. Falls back to the site admin email.
		 *
		 * @param int $post_id Post that contained the form.
		 * @return string A valid recipient email, or '' if none can be resolved.
		 */
		private function resolve_recipient( $post_id ) {
			$fallback = get_option( 'admin_email' );
			$fallback = is_email( $fallback ) ? $fallback : '';

			if ( $post_id <= 0 ) {
				return $fallback;
			}

			$post = get_post( $post_id );
			if ( ! $post || empty( $post->post_content ) ) {
				return $fallback;
			}

			// Only consider published/viewable posts to avoid leaking config.
			if ( ! in_array( $post->post_status, [ 'publish', 'private' ], true ) ) {
				return $fallback;
			}

			if ( ! has_blocks( $post->post_content ) ) {
				return $fallback;
			}

			$blocks   = parse_blocks( $post->post_content );
			$override = $this->find_admin_email( $blocks );

			if ( '' !== $override && is_email( $override ) ) {
				return $override;
			}

			return $fallback;
		}

		/**
		 * Recursively search parsed blocks for a newsletter-optin adminEmail override.
		 *
		 * @param array $blocks Parsed block tree.
		 * @return string The first valid override found, or ''.
		 */
		private function find_admin_email( $blocks ) {
			foreach ( $blocks as $block ) {
				if ( isset( $block['blockName'] ) && 'b-blocks/newsletter-optin' === $block['blockName'] ) {
					if ( ! empty( $block['attrs']['adminEmail'] ) ) {
						$candidate = sanitize_email( (string) $block['attrs']['adminEmail'] );
						if ( '' !== $candidate && is_email( $candidate ) ) {
							return $candidate;
						}
					}
				}

				if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					$nested = $this->find_admin_email( $block['innerBlocks'] );
					if ( '' !== $nested ) {
						return $nested;
					}
				}
			}

			return '';
		}

		public function handle_submit() {
			// Verify nonce.
			$nonce = isset( $_POST['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ) : '';
			if ( '' === $nonce || ! wp_verify_nonce( $nonce, 'bb_newsletter_optin' ) ) {
				wp_send_json_error( [ 'message' => __( 'Security check failed. Please reload the page and try again.', 'b-blocks' ) ] );
			}

			// Transient-based per-IP rate limit (max 5 submissions per 60 seconds).
			BBlocksOptinRateLimit::check( 'bb_no' );

			// Validate email.
			$email_raw = isset( $_POST['bb_no_email'] ) ? sanitize_email( wp_unslash( $_POST['bb_no_email'] ) ) : '';
			if ( '' === $email_raw || ! is_email( $email_raw ) ) {
				wp_send_json_error( [ 'message' => __( 'Please enter a valid email address.', 'b-blocks' ) ] );
			}

			// Optional name.
			$name = isset( $_POST['bb_no_name'] ) ? sanitize_text_field( wp_unslash( $_POST['bb_no_name'] ) ) : '';

			// Resolve recipient SERVER-SIDE from saved block config — never POST.
			$post_id   = isset( $_POST['post_id'] ) ? absint( wp_unslash( $_POST['post_id'] ) ) : 0;
			$recipient = $this->resolve_recipient( $post_id );

			if ( '' === $recipient || ! is_email( $recipient ) ) {
				wp_send_json_error( [ 'message' => __( 'Subscription could not be processed. Please try again later.', 'b-blocks' ) ] );
			}

			// Strip HTML tags and CRLF from site name to prevent mail-header injection.
			$site_name = wp_strip_all_tags( wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) );
			$site_name = str_replace( [ "\r", "\n" ], ' ', $site_name );

			/* translators: %s: site name */
			$subject = sprintf( __( 'New newsletter subscriber on %s', 'b-blocks' ), $site_name );

			$lines   = [];
			$lines[] = __( 'You have a new newsletter subscriber.', 'b-blocks' );
			$lines[] = '';
			if ( '' !== $name ) {
				/* translators: %s: subscriber name */
				$lines[] = sprintf( __( 'Name: %s', 'b-blocks' ), $name );
			}
			/* translators: %s: subscriber email */
			$lines[] = sprintf( __( 'Email: %s', 'b-blocks' ), $email_raw );

			$message = implode( "\n", $lines );
			$headers = [ 'Reply-To: ' . $email_raw ];

			$sent = wp_mail( $recipient, $subject, $message, $headers );

			if ( ! $sent ) {
				wp_send_json_error( [ 'message' => __( 'Subscription could not be processed. Please try again later.', 'b-blocks' ) ] );
			}

			wp_send_json_success( [ 'message' => __( 'Thank you for subscribing!', 'b-blocks' ) ] );
		}
	}

	new BBlocksNewsletterHandler();
}
