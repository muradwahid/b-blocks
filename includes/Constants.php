<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$bb_host    = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
$bb_isLocal = $bb_host && ( 0 === strpos( $bb_host, 'localhost' ) || 0 === strpos( $bb_host, '127.0.0.1' ) || preg_match( '/\.(local|test|ddev\.site)(:\d+)?$/', $bb_host ) );

define( 'B_BLOCKS_VERSION', $bb_isLocal ? time() : '2.1.13' );
define( 'B_BLOCKS_DIR_PATH', plugin_dir_path( B_BLOCKS_FILE ) );
define( 'B_BLOCKS_DIR_URL', plugin_dir_url( B_BLOCKS_FILE ) );
define( 'B_BLOCKS_HAS_PRO', 'b-blocks-pro/plugin.php' === plugin_basename( B_BLOCKS_FILE ) );
define( 'B_BLOCKS_BUILD', B_BLOCKS_DIR_URL . 'build/' );
define( 'B_BLOCKS_ASSETS', B_BLOCKS_DIR_URL . 'assets/' );