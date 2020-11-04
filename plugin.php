<?php
/**
 * Plugin Name: B Blocks
 * Description: B Blocks for demo project.
 * Author: Wasek Bellah
 * Author URI: https://wasek-bellah.web.app/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Block Initializer.
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

// Constant
define( 'B_BLOCKS_PLUGIN_VERSION', '1.0.0' );
define( "B_BLOCKS_ASSETS_DIR", plugin_dir_url( __FILE__ ) . 'assets/' );

// Assets
function b_blocks_assets() {
    wp_enqueue_style( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'css/bootstrap.min.css', '', B_BLOCKS_PLUGIN_VERSION, 'all' );

    wp_enqueue_script( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'js/bootstrap.bundle.min.js', array( 'jquery' ), B_BLOCKS_PLUGIN_VERSION, true );
    wp_enqueue_script( 'b-blocks-script', B_BLOCKS_ASSETS_DIR . 'js/script.js', array( 'jquery' ), B_BLOCKS_PLUGIN_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'b_blocks_assets' );
add_action( 'admin_enqueue_scripts', 'b_blocks_assets' );