<?php

function b_blocks_init() {
    // Custom Block Category
    function b_blocks_category( $categories ) {
        return array_merge( $categories, [
            array(
                'slug'  => 'bBlocks',
                'title' => 'B Blocks',
                'icon'  => 'wordpress-alt',
            ),
        ] );
    }
    add_filter( 'block_categories', 'b_blocks_category', 9 );

    // Register block styles for both frontend + backend.
    wp_register_style( 'b_blocks-style-css', plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), is_admin() ? array( 'wp-editor' ) : null, null );

    // Register block editor script for backend.
    wp_register_script( 'b_blocks-js', plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor', 'wp-api' ), null, true );

    // Register block editor styles for backend.
    wp_register_style( 'b_blocks-editor-css', plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), array( 'wp-edit-blocks' ), null );

    // WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
    wp_localize_script(
        'b_blocks-js',
        'cgbGlobal', // Array containing dynamic data for a JS Global.
        [
            'pluginDirPath' => plugin_dir_path( __DIR__ ),
            'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
            // Add more data here that you want to access from `cgbGlobal` object.
            'siteUrl'       => get_site_url(),
        ]
    );

    // Register Gutenberg block on server-side.
    register_block_type( 'wasek/b-blocks', array(
        'style'         => 'b_blocks-style-css',
        'editor_script' => 'b_blocks-js',
        'editor_style'  => 'b_blocks-editor-css',
    ) );
}
add_action( 'init', 'b_blocks_init' );

// Posts Block
require 'blocks/posts/posts.php';
require 'blocks/posts/advance-posts.php';