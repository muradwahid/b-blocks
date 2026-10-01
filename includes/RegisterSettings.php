<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class RegisterSettings
{
	function __construct()
	{
		add_action( 'admin_init', [$this, 'registerSettings'] );
		add_action( 'rest_api_init', [$this, 'registerSettings'] );
	}

	function registerSettings()
	{
		register_setting('bBlocksUtils', 'bBlocksUtils', [
			'show_in_rest' => [
				'name' => 'bBlocksUtils',
				'schema' => ['type' => 'string']
			],
			'type' => 'string',
			'default' => wp_json_encode(['nonce' => wp_create_nonce('wp_ajax')]),
			'sanitize_callback' => 'sanitize_text_field'
		]);
	}
}

new RegisterSettings();
