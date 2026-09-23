<?php
/**
 * Instagram feed data for the Instagram block.
 *
 * The access token never reaches the browser: it is kept in a site option and
 * every Graph API call is made here, server-side. The block only ever asks this
 * endpoint for already-fetched media, so a published page carries no credential.
 *
 * Ported from bPlugins/my-social-feeds (includes/Instagram.php), minus the OAuth
 * connect screen — the token is entered in the block's own settings.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BBlocksInstagram {
	const OPTION    = 'b_blocks_instagram';
	const CACHE_KEY = 'b_blocks_instagram_feed_';

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

	/**
	 * Registered so the option is a known site setting, but deliberately kept out
	 * of REST: the token is only ever written through save_account() below, and is
	 * never read back to the browser at all.
	 */
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
						'nonce'   => wp_create_nonce( 'wp_ajax' ),
					]
				);
			}
		}
	}

	private function accounts() {
		$data = get_option( self::OPTION, [] );

		return isset( $data['accounts'] ) && is_array( $data['accounts'] ) ? $data['accounts'] : [];
	}

	/** The token saved on Dashboard -> Settings -> API Integrations, if any. */
	public static function dashboard_token() {
		$keys = get_option( 'bBlocksApiKeys', [] );

		return is_array( $keys ) ? (string) ( $keys['instagram']['key'] ?? '' ) : '';
	}

	/**
	 * The dashboard card wins, since that is the site-wide place a token is meant
	 * to be entered; a token stored on the block itself keeps older setups working.
	 */
	private function token_for( $account ) {
		$dashboard = self::dashboard_token();

		return '' !== $dashboard ? $dashboard : (string) ( $account['token'] ?? '' );
	}

	/** Matches the account the block asked for, by username or by id. */
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

	/** Only an administrator may see or change which account is connected. */
	private function guard() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, 'wp_ajax' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}
	}

	/**
	 * Reports whether a token is stored, never the token itself — it would end up
	 * in the editor's DOM for anyone looking over the author's shoulder.
	 */
	public function get_account() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, 'wp_ajax' ) || ! current_user_can( 'edit_posts' ) ) {
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

		// An empty token field means "leave the stored one alone", so the account
		// can be renamed without retyping the credential.
		$saved = [
			'id'       => $account['id'] ?? '',
			'username' => $username,
			'token'    => '' === $token ? ( $account['token'] ?? '' ) : $token,
		];

		update_option( self::OPTION, [ 'accounts' => '' === $saved['username'] && '' === $saved['token'] ? [] : [ $saved ] ] );

		self::flush();

		wp_send_json_success( [ 'username' => $saved['username'], 'hasToken' => ! empty( $saved['token'] ) ] );
	}

	/**
	 * Validates a token for the dashboard's API Integrations card. Graph answers
	 * with a 200 and an error in the body, so the body is what decides.
	 */
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

		// A new token must not keep serving the feed the old one fetched.
		self::flush();

		return [ 'valid' => true, 'message' => sprintf( '%s @%s', __( 'Connected as', 'b-blocks' ), $body['username'] ) ];
	}

	public function feed() {
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

		if ( ! wp_verify_nonce( $nonce, 'wp_ajax' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}

		$wanted  = sanitize_text_field( wp_unslash( $_POST['account'] ?? '' ) );
		$limit   = min( 100, max( 1, absint( $_POST['limit'] ?? 50 ) ) );
		$minutes = min( 10080, max( 0, absint( $_POST['cache'] ?? 30 ) ) );
		$account = $this->find_account( $wanted );

		$token = $account ? $this->token_for( $account ) : '';

		if ( '' === $token ) {
			wp_send_json_error( __( 'No Instagram account is connected. Add an access token under Dashboard → Settings → API Integrations.', 'b-blocks' ) );
		}

		$cache_key = self::CACHE_KEY . md5( $token . '|' . $limit );
		$cached    = $minutes ? get_transient( $cache_key ) : false;

		if ( false !== $cached ) {
			wp_send_json_success( $cached );
		}

		$payload = $this->fetch( $token, $limit );

		if ( is_wp_error( $payload ) ) {
			wp_send_json_error( $payload->get_error_message() );
		}

		if ( $minutes ) {
			set_transient( $cache_key, $payload, $minutes * MINUTE_IN_SECONDS );
		}

		wp_send_json_success( $payload );
	}

	/**
	 * Asks for the richer profile first. Graph rejects the whole request when a
	 * field is not available to the token's account type, so a plain token falls
	 * back to the fields every account has rather than returning nothing.
	 */
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

		// Graph reports its own failures in the body with a 200, so the error has
		// to be read out rather than inferred from the status code.
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

		if ( ! wp_verify_nonce( $nonce, 'wp_ajax' ) || ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( __( 'Invalid request.', 'b-blocks' ) );
		}

		self::flush();

		wp_send_json_success();
	}

	/** A changed account or token must not keep serving the old feed. */
	public static function flush() {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- transients have no bulk delete API.
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '_transient_' . self::CACHE_KEY . '%' ) );
	}
}

new BBlocksInstagram();
