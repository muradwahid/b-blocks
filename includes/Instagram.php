<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BBlocksInstagram {
	const OPTION    = 'b_blocks_instagram';
	const CACHE_KEY = 'b_blocks_instagram_feed_';

	/**
	 * Nonce action for every endpoint in this class.
	 *
	 * Deliberately NOT the generic 'wp_ajax' the rest of the plugin used to
	 * share: a nonce minted for one endpoint should not authenticate a
	 * different one. The feed is a nopriv endpoint, so this nonce is public
	 * by construction (wp_create_nonce() for a logged-out visitor is the same
	 * value for every anonymous visitor) - it is CSRF friction, never access
	 * control. Authorization on the privileged endpoints comes from the
	 * capability checks below, and abuse of the public endpoint is bounded by
	 * the cache floor and the rate limiter in feed().
	 */
	const NONCE_ACTION = 'b_blocks_instagram_feed';

	const CACHE_MIN_MINUTES = 5;

	const CACHE_MAX_MINUTES = 10080;

	const LOCK_SECONDS = 20;

	/**
	 * Upstream Instagram fetches allowed per IP, per window, for callers who
	 * cannot edit posts. Cache *hits* are never counted - only a cache miss
	 * that would hit graph.instagram.com consumes budget, so ordinary visitors
	 * loading a cached feed are unaffected no matter how many times they load
	 * the page.
	 */
	const PUBLIC_FETCH_MAX    = 5;
	const PUBLIC_FETCH_WINDOW = 300;

	public function __construct() {
		add_action( 'init', [ $this, 'register_option' ] );
		add_action( 'wp_ajax_bBlocksInstagramFeed', [ $this, 'feed' ] );
		add_action( 'wp_ajax_nopriv_bBlocksInstagramFeed', [ $this, 'feed' ] );
		add_action( 'wp_ajax_bBlocksInstagramClearCache', [ $this, 'clear_cache' ] );
		add_action( 'wp_ajax_bBlocksInstagramGetAccount', [ $this, 'get_account' ] );
		add_action( 'wp_ajax_bBlocksInstagramSaveAccount', [ $this, 'save_account' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'localize' ], 20 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'localize' ], 20 );
	}

	public function register_option() {
		register_setting(
			'options',
			self::OPTION,
			[
				'type'         => 'object',
				'default'      => [ 'accounts' => [] ],
				'show_in_rest' => false,
			]
		);
	}

	public function localize() {
		foreach ( [ 'b-blocks-instagram-view-script', 'b-blocks-index-script' ] as $handle ) {
			if ( wp_script_is( $handle, 'registered' ) ) {
				wp_localize_script(
					$handle,
					'bBlocksInstagram',
					[
						'ajaxUrl' => admin_url( 'admin-ajax.php' ),
						'nonce'   => wp_create_nonce( self::NONCE_ACTION ),
					]
				);
			}
		}
	}

	private function accounts() {
		$data = get_option( self::OPTION, [] );

		return isset( $data['accounts'] ) && is_array( $data['accounts'] ) ? $data['accounts'] : [];
	}


	public static function dashboard_token() {
		$keys = get_option( 'bBlocksApiKeys', [] );

		return is_array( $keys ) ? (string) ( $keys['instagram']['key'] ?? '' ) : '';
	}


	private function token_for( $account ) {
		$dashboard = self::dashboard_token();

		return '' !== $dashboard ? $dashboard : (string) ( $account['token'] ?? '' );
	}


	private function find_account( $wanted ) {
		$dashboard = self::dashboard_token();

		if ( '' !== $dashboard ) {
			return [ 'id' => '', 'username' => $wanted, 'token' => $dashboard ];
		}

		foreach ( $this->accounts() as $account ) {
			if ( '' === $wanted || ( $account['username'] ?? '' ) === $wanted || (string) ( $account['id'] ?? '' ) === (string) $wanted ) {
				return $account;
			}
		}

		return null;
	}

	private function guard() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}
	}

	public function get_account() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) || ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}

		$account   = $this->accounts()[0] ?? [];
		$dashboard = self::dashboard_token();

		wp_send_json_success(
			[
				'username'      => $account['username'] ?? '',
				'hasToken'      => '' !== $dashboard || '' !== ( $account['token'] ?? '' ),
				'fromDashboard' => '' !== $dashboard,
			]
		);
	}

	public function save_account() {
		$this->guard();

		$account  = $this->accounts()[0] ?? [];
		$username = sanitize_text_field( wp_unslash( $_POST['username'] ?? '' ) );
		$token    = sanitize_text_field( wp_unslash( $_POST['token'] ?? '' ) );

		$saved = [
			'id'       => $account['id'] ?? '',
			'username' => $username,
			'token'    => '' === $token ? ( $account['token'] ?? '' ) : $token,
		];

		update_option( self::OPTION, [ 'accounts' => '' === $saved['username'] && '' === $saved['token'] ? [] : [ $saved ] ] );

		self::flush();

		wp_send_json_success( [ 'username' => $saved['username'], 'hasToken' => ! empty( $saved['token'] ) ] );
	}

	public static function test_token( $token ) {
		$token = trim( (string) $token );

		if ( '' === $token ) {
			return [ 'valid' => false, 'message' => __( 'No access token provided', 'b-blocks' ) ];
		}

		$res = wp_remote_get( add_query_arg(
			[ 'fields' => 'id,username', 'access_token' => $token ],
			'https://graph.instagram.com/me'
		), [ 'timeout' => 10 ] );

		if ( is_wp_error( $res ) ) {
			return [ 'valid' => false, 'message' => 'Connection failed: ' . $res->get_error_message() ];
		}

		$body = json_decode( wp_remote_retrieve_body( $res ), true );

		if ( isset( $body['error']['message'] ) ) {
			return [ 'valid' => false, 'message' => $body['error']['message'] ];
		}

		if ( empty( $body['username'] ) ) {
			return [ 'valid' => false, 'message' => __( 'Instagram did not return an account for this token', 'b-blocks' ) ];
		}

		self::flush();

		return [ 'valid' => true, 'message' => sprintf( '%s @%s', __( 'Connected as', 'b-blocks' ), $body['username'] ) ];
	}

	public function feed() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}

		$wanted  = sanitize_text_field( wp_unslash( $_POST['account'] ?? '' ) );
		$limit   = min( 100, max( 1, absint( $_POST['limit'] ?? 50 ) ) );
		$minutes = $this->cache_minutes( $_POST['cache'] ?? 30 );
		$account = $this->find_account( $wanted );

		$token = $account ? $this->token_for( $account ) : '';

		if ( '' === $token ) {
			wp_send_json_error( __( 'No Instagram account is connected. Add an access token under Dashboard → Settings → API Integrations.', 'b-blocks' ) );
		}

		$privileged = current_user_can( 'edit_posts' );
		$bucket     = $this->fetch_bucket( $limit, $privileged );
		$cache_key  = self::CACHE_KEY . md5( $token . '|' . $bucket );
		$cached     = $minutes ? get_transient( $cache_key ) : false;

		if ( false !== $cached ) {
			wp_send_json_success( $this->take( $cached, $limit ) );
		}

		$lock = $cache_key . '_lock';

		if ( get_transient( $lock ) ) {
			wp_send_json_error( __( 'The Instagram feed is being refreshed. Please try again in a moment.', 'b-blocks' ) );
		}

		// Past this point the request costs an outbound call to Instagram.
		// Everything above is served from cache, so the limiter sits here
		// rather than at the top of the method: normal visitors on a warm
		// cache never touch it, and only the callers actually driving
		// upstream traffic spend budget.
		if ( ! $privileged ) {
			$this->throttle_fetch();
		}

		set_transient( $lock, 1, self::LOCK_SECONDS );

		$payload = $this->fetch( $token, $bucket );

		delete_transient( $lock );

		if ( is_wp_error( $payload ) ) {
			wp_send_json_error( $payload->get_error_message() );
		}

		if ( $minutes ) {
			set_transient( $cache_key, $payload, $minutes * MINUTE_IN_SECONDS );
		}

		wp_send_json_success( $this->take( $payload, $limit ) );
	}

	private function cache_minutes( $requested ) {
		$minutes = min( self::CACHE_MAX_MINUTES, absint( $requested ) );

		if ( current_user_can( 'edit_posts' ) ) {
			return $minutes;
		}

		$floor = (int) apply_filters( 'b_blocks_instagram_min_cache_minutes', self::CACHE_MIN_MINUTES );

		return max( $floor, $minutes );
	}

	/**
	 * Per-IP throttle on cache-missing feed requests.
	 *
	 * Sends a 429 and exits when the caller is over budget. Mirrors the
	 * counter in BBlocksOptinRateLimit but with its own window, because a
	 * feed refresh and a form submission are not the same kind of traffic.
	 */
	private function throttle_fetch() {
		$max    = (int) apply_filters( 'b_blocks_instagram_public_fetch_max', self::PUBLIC_FETCH_MAX );
		$window = (int) apply_filters( 'b_blocks_instagram_public_fetch_window', self::PUBLIC_FETCH_WINDOW );

		if ( $max <= 0 || $window <= 0 ) {
			return;
		}

		$key  = 'bb_ig_rl_' . md5( $this->client_ip() );
		$hits = (int) get_transient( $key );

		if ( $hits >= $max ) {
			wp_send_json_error( __( 'Too many Instagram refreshes. Please wait a moment and try again.', 'b-blocks' ), 429 );
		}

		// The expiry is never refreshed on later hits, so the window rolls
		// from the first request rather than sliding forward forever.
		set_transient( $key, $hits + 1, $window );
	}

	/**
	 * Client IP for the throttle key, validated so a spoofed proxy header
	 * cannot inject arbitrary text into the transient name. A spoofed value
	 * only changes which bucket the caller lands in; it does not skip the
	 * check.
	 */
	private function client_ip() {
		$candidates = [];

		if ( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
			$candidates[] = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) );
		}

		if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$forwarded    = explode( ',', sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) );
			$candidates[] = trim( $forwarded[0] );
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

	/**
	 * Size of the upstream request, which is also what varies the cache key.
	 *
	 * For callers who cannot edit posts this is pinned to the maximum, so a
	 * public caller gets exactly one cache entry per token. Letting `limit`
	 * pick the bucket gave them four (25/50/75/100) and therefore four ways
	 * to force an upstream fetch inside one cache window. take() slices the
	 * payload back down to the requested count either way, so the response
	 * is unchanged.
	 */
	private function fetch_bucket( $limit, $privileged = false ) {
		if ( ! $privileged ) {
			return 100;
		}

		return (int) min( 100, ceil( $limit / 25 ) * 25 );
	}

	private function take( $payload, $limit ) {
		if ( isset( $payload['media'] ) && is_array( $payload['media'] ) ) {
			$payload['media'] = array_slice( $payload['media'], 0, $limit );
		}

		return $payload;
	}

	private function user( $token ) {
		$sets = [
			'id,username,media_count,account_type,name,profile_picture_url,followers_count',
			'id,username,media_count,account_type',
		];

		foreach ( $sets as $fields ) {
			$res = wp_remote_get( add_query_arg(
				[ 'fields' => $fields, 'access_token' => $token ],
				'https://graph.instagram.com/me'
			), [ 'timeout' => 15 ] );

			if ( is_wp_error( $res ) ) {
				return $res;
			}

			$body = json_decode( wp_remote_retrieve_body( $res ), true );

			if ( ! isset( $body['error'] ) ) {
				return $body;
			}

			$last = $body;
		}

		return new \WP_Error( 'b_blocks_instagram', $last['error']['message'] ?? __( 'Instagram rejected the request.', 'b-blocks' ) );
	}

	private function fetch( $token, $limit ) {
		$fields = 'id,username,media_type,media_url,thumbnail_url,caption,permalink,timestamp,children{id,media_type,media_url,thumbnail_url,permalink}';

		$user = $this->user( $token );

		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$media_res = wp_remote_get( add_query_arg(
			[ 'fields' => $fields, 'access_token' => $token, 'limit' => $limit ],
			'https://graph.instagram.com/me/media'
		), [ 'timeout' => 15 ] );

		if ( is_wp_error( $media_res ) ) {
			return $media_res;
		}

		$media = json_decode( wp_remote_retrieve_body( $media_res ), true );

		if ( isset( $media['error']['message'] ) ) {
			return new \WP_Error( 'b_blocks_instagram', $media['error']['message'] );
		}

		return [
			'user'  => [
				'id'                  => $user['id'] ?? '',
				'username'            => $user['username'] ?? '',
				'name'                => $user['name'] ?? '',
				'profile_picture_url' => $user['profile_picture_url'] ?? '',
				'followers_count'     => $user['followers_count'] ?? 0,
				'mediaCount'          => $user['media_count'] ?? 0,
				'accountType'         => $user['account_type'] ?? '',
			],
			'media' => array_values( $media['data'] ?? [] ),
		];
	}

	public function clear_cache() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) || ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}

		self::flush();

		wp_send_json_success();
	}

	public static function flush() {
		global $wpdb;

		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '_transient_' . self::CACHE_KEY . '%' ) );
	}
}

new BBlocksInstagram();