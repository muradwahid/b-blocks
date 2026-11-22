<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if (!function_exists('b_blocks_fs')) {
	// Create a helper function for easy SDK access.
	function b_blocks_fs()
	{
		global $b_blocks_fs;

		if (!isset($b_blocks_fs)) {
			// Include Freemius SDK.
			require_once B_BLOCKS_DIR_PATH . 'freemius/start.php';

			$b_blocks_fs = fs_dynamic_init(array(
				'id' => '12845',
				'slug' => 'b-blocks',
				'premium_slug' => 'b-blocks-pro',
				'type' => 'plugin',
				'public_key' => 'pk_d6426b344df4918bc066a7a0b4719',
				'is_premium' => true,
				'premium_suffix' => 'Pro',
				'has_premium_version' => true,
				'has_addons' => false,
				'has_paid_plans' => true,
				'trial' => array(
					'days' => 7,
					'is_require_payment' => true,
				),
				'menu' => array(
					'slug' => 'b-blocks',
					'first-path' => 'admin.php?page=b-blocks',
					'contact' => false,
					'support' => false,
				),
			));
		}

		return $b_blocks_fs;
	}

	// Init Freemius.
	b_blocks_fs();
	// Signal that SDK was initiated.
	do_action('b_blocks_fs_loaded');
}
