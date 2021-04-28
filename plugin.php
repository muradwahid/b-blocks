<?php
/**
 * Plugin Name: B Blocks
 * Description: Gutenberg Blocks Collection and Page Builder.
 * Version: 1.1
 * Author: bPlugins LLC
 * Author URI: http://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: b-blocks
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) {
    exit;
}

// Constant
define( 'B_BLOCKS_PLUGIN_VERSION', '1.1' );
define( "B_BLOCKS_ASSETS_DIR", plugin_dir_url( __FILE__ ) . 'assets/' );

// Register Block Category
function b_blocks_block_categories( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'bBlocks',
                'title' => __( 'B Blocks', 'b-blocks' ),
            ),
        ),
        $categories
    );
}
add_filter( 'block_categories', 'b_blocks_block_categories' );

// Register Blocks
function b_blocks_wp_register_script( $block, $options = array() ) {
    register_block_type(
        'b-blocks/' . $block,
        array_merge(
            array(
                'editor_script' => 'b_blocks_editor_script',
                'editor_style'  => 'b_blocks_editor_style',
                'script'        => 'b_blocks_script',
                'style'         => 'b_blocks_style',
            ),
            $options
        )
    );
}

// Enqueue assets
function b_blocks_enqueue_block_assets() {
    wp_enqueue_style( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'css/bootstrap.min.css', '', '4.6.0', 'all' );

    wp_enqueue_script( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'js/bootstrap.bundle.min.js', array( 'jquery' ), '4.6.0', true );
    wp_enqueue_script( 'mailtoui', B_BLOCKS_ASSETS_DIR . 'js/mailtoui-min.js', array(), B_BLOCKS_PLUGIN_VERSION, true );
}
add_action( 'enqueue_block_assets', 'b_blocks_enqueue_block_assets' );

function b_blocks_register() {
    // Resister script in editor
    wp_register_script( 'b_blocks_editor_script', plugins_url( 'dist/editor.js', __FILE__ ), array( 'wp-blocks', 'wp-element', 'wp-data', 'wp-i18n', 'wp-editor', 'wp-components', 'wp-blob', 'wp-html-entities', 'wp-compose', 'wp-rich-text' ), null, false );
    // Register style in editor
    wp_register_style( 'b_blocks_editor_style', plugins_url( 'dist/editor.css', __FILE__ ), array( 'wp-edit-blocks' ), null );

    // Register script in frontend
    wp_register_script( 'b_blocks_script', plugins_url( 'dist/script.js', __FILE__ ), array( 'jquery' ), null, true );
    // Register style in frontend
    wp_register_style( 'b_blocks_style', plugins_url( 'dist/style.css', __FILE__ ), array( 'wp-editor' ), null );

    // Register Blocks
    b_blocks_wp_register_script( 'posts', array(
        'render_callback' => 'render_b_blocks_posts',
        // 'attributes'      => array(
        //     'postsPerPage'   => array( 'type' => 'number', 'default' => 5 ),
        // ),
    ) );
    b_blocks_wp_register_script( 'slider' );
    b_blocks_wp_register_script( 'section' );
    b_blocks_wp_register_script( 'section-heading' );
    b_blocks_wp_register_script( 'price-lists' );
    b_blocks_wp_register_script( 'price-list' );
    b_blocks_wp_register_script( 'feature-boxes' );
    b_blocks_wp_register_script( 'feature-box' );
    b_blocks_wp_register_script( 'info-box' );
    b_blocks_wp_register_script( 'card' );
    b_blocks_wp_register_script( 'mailto' );
    b_blocks_wp_register_script( 'modal' );
    b_blocks_wp_register_script( 'tabs' );
    b_blocks_wp_register_script( 'accordion' );
    b_blocks_wp_register_script( 'note' );
    b_blocks_wp_register_script( 'gif' );
    b_blocks_wp_register_script( 'qr-code' );
    b_blocks_wp_register_script( 'highlight-text' );
    b_blocks_wp_register_script( 'progress-bar' );
    b_blocks_wp_register_script( 'spacer' );
    b_blocks_wp_register_script( 'selection' );
    b_blocks_wp_register_script( 'divider' );
    b_blocks_wp_register_script( 'to-top' );

    // WP Localized globals.
    wp_localize_script(
        'b_blocks-js',
        'bBlocksAdmin', // Array containing dynamic data for a JS Global.
        [
            'pluginDirPath' => plugin_dir_path( __DIR__ ),
            'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
            'siteUrl'       => get_site_url(),
        ]
    );
}
add_action( 'init', 'b_blocks_register' );

// After Setup Theme
function b_blocks_after_setup_theme() {
    add_theme_support( 'align-wide' );
}
add_action( 'after_setup_theme', 'b_blocks_after_setup_theme' );

// Block Initializer.
require_once plugin_dir_path( __FILE__ ) . 'inc/posts.php';