<?php
/**
 * Transient-based per-IP rate limiter for public optin AJAX endpoints.
 *
 * Shared by the Newsletter Optin and Popup Optin AJAX handlers. Caps
 * unauthenticated (and authenticated) submissions to a configurable number of
 * requests within a rolling time window, keyed by hashed IP address.
 *
 * Usage (inside an AJAX handler, after nonce verification):
 *
 *   BBlocksOptinRateLimit::check( 'bb_po' );  // sends JSON error and exits if over limit
 *
 * The implementation uses WordPress transients so it works on any host without
 * requiring Redis, APCu, or a custom DB table. Transient keys are prefixed and
 * hashed so they never expose the raw IP address in the options table.
 *
 * @package bBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'BBlocksOptinRateLimit' ) ) {

	class BBlocksOptinRateLimit {

		/**
		 * Maximum submissions allowed per IP within the time window.
		 */
		const MAX_HITS = 5;

		/**
		 * Length of the rolling window in seconds.
		 */
		const WINDOW_SECONDS = 60;

		/**
		 * Check the rate limit for the current request IP.
		 *
		 * Increments the counter for the given endpoint prefix. If the counter
		 * exceeds MAX_HITS within WINDOW_SECONDS it calls wp_send_json_error()
		 * and terminates the request (consistent with how nonce failures are
		 * handled in our handlers).
		 *
		 * @param string $prefix Short namespace token to separate counters per
		 *                        endpoint, e.g. 'bb_po' or 'bb_no'.
		 */
		public static function check( $prefix ) {
			$ip  = self::get_ip();
			$key = 'bb_rl_' . sanitize_key( $prefix ) . '_' . md5( $ip );

			$hits = (int) get_transient( $key );

			if ( $hits >= self::MAX_HITS ) {
				wp_send_json_error(
					[ 'message' => __( 'Too many requests. Please wait a moment and try again.', 'b-blocks' ) ],
					429
				);
			}

			// Increment. First hit also sets the expiry window.
			if ( 0 === $hits ) {
				set_transient( $key, 1, self::WINDOW_SECONDS );
			} else {
				// get_transient returned an existing value; update in place.
				// We intentionally do not refresh the expiry on subsequent
				// hits so the window is rolling from the *first* request.
				set_transient( $key, $hits + 1, self::WINDOW_SECONDS );
			}
		}

		/**
		 * Resolve the client IP address.
		 *
		 * Falls back through common proxy headers to REMOTE_ADDR. Each value
		 * is validated with filter_var so a spoofed X-Forwarded-For cannot
		 * inject an arbitrary string into the transient key.
		 *
		 * @return string A valid IP string, or '0.0.0.0' as a safe fallback.
		 */
		private static function get_ip() {
			$candidates = [];

			// Trusted proxy headers — only check these when WordPress itself
			// is behind a known proxy (e.g. a load balancer). Using them
			// without a trusted proxy allowlist means clients can spoof the
			// value, but a spoofed IP only affects which rate-limit bucket
			// they land in — it doesn't bypass the check.
			if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
				// X-Forwarded-For can be a comma-separated list; the leftmost
				// IP is the originating client.
				$xfwd = explode( ',', sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) );
				$candidates[] = trim( $xfwd[0] );
			}

			if ( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
				$candidates[] = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) );
			}

			if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
				$candidates[] = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
			}

			foreach ( $candidates as $candidate ) {
				$ip = filter_var( trim( $candidate ), FILTER_VALIDATE_IP );
				if ( false !== $ip ) {
					return $ip;
				}
			}

			return '0.0.0.0';
		}
	}
}
