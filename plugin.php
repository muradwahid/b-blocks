<?php
/**
 * Plugin Name: B Blocks
 * Description: Gutenberg Blocks Collection and Page Builder.
 * Version: 1.5
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
define( 'B_BLOCKS_PLUGIN_VERSION', '1.5' );
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
    wp_enqueue_style( 'swiper-slider', B_BLOCKS_ASSETS_DIR . 'css/swiper-bundle.min.css', '', '6.6.2', 'all' );
    wp_enqueue_style( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'css/bootstrap.min.css', '', '4.6.0', 'all' );

    wp_enqueue_script( 'bootstrap', B_BLOCKS_ASSETS_DIR . 'js/bootstrap.bundle.min.js', array( 'jquery' ), '4.6.0', true );
    wp_enqueue_script( 'mailtoui', B_BLOCKS_ASSETS_DIR . 'js/mailtoui-min.js', array(), B_BLOCKS_PLUGIN_VERSION, true );
}
add_action( 'enqueue_block_assets', 'b_blocks_enqueue_block_assets' );

function b_blocks_enqueue_assets() {
    wp_enqueue_style( 'dashicon' );
    wp_enqueue_style( 'fancybox', B_BLOCKS_ASSETS_DIR . 'css/fancybox.min.css', '', '3.5.6', 'all' );

    wp_enqueue_script( 'fancybox', B_BLOCKS_ASSETS_DIR . 'js/fancybox.min.js', array( 'jquery' ), '3.5.6', true );
}
add_action( 'wp_enqueue_scripts', 'b_blocks_enqueue_assets' );

function b_blocks_register() {
    // Resister script in editor
    wp_register_script( 'b_blocks_editor_script', plugins_url( 'dist/editor.js', __FILE__ ), array( 'wp-blocks', 'wp-element', 'wp-data', 'wp-i18n', 'wp-editor', 'wp-components', 'wp-blob', 'wp-html-entities', 'wp-compose', 'wp-rich-text' ), null, false );
    // Register style in editor
    wp_register_style( 'b_blocks_editor_style', plugins_url( 'dist/editor.css', __FILE__ ), array( 'wp-edit-blocks', 'bootstrap' ), null );

    // Register script in frontend
    wp_register_script( 'b_blocks_script', plugins_url( 'dist/script.js', __FILE__ ), array( 'jquery', 'bootstrap', 'mailtoui' ), null, true );
    // Register style in frontend
    wp_register_style( 'b_blocks_style', plugins_url( 'dist/style.css', __FILE__ ), array( 'wp-editor', 'bootstrap' ), null );

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
    b_blocks_wp_register_script( 'image-gallery',array(
        'render_callback' => 'render_b_blocks_image_gallery',
        'attributes'      => image_gallery_attributes()
    ) );
    b_blocks_wp_register_script( 'image-comparison' );
    b_blocks_wp_register_script( 'flip-boxes',array(
        'render_callback' => 'render_b_blocks_flip_boxes',
        'attributes'      => flip_boxes_attributes()
    ) );
    b_blocks_wp_register_script( 'flip-box', array(
        'render_callback' => 'render_b_blocks_flip_box',
        'attributes'      => flip_box_attributes()
    ) );
    b_blocks_wp_register_script( 'team-members' );
    b_blocks_wp_register_script( 'team-member' );
    b_blocks_wp_register_script( 'price-lists' );
    b_blocks_wp_register_script( 'price-list' );
    b_blocks_wp_register_script( 'feature-boxes' );
    b_blocks_wp_register_script( 'feature-box' );
    b_blocks_wp_register_script( 'info-box' );
    b_blocks_wp_register_script( 'button-group' );
    b_blocks_wp_register_script( 'countdown' );
    b_blocks_wp_register_script( 'cards', array(
        'render_callback' => 'render_b_blocks_cards',
        'attributes'      => cards_attributes()
    ) );
    b_blocks_wp_register_script( 'card', array(
        'render_callback' => 'render_b_blocks_card',
        'attributes'      => card_attributes()
    ) );
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
        'b_blocks_editor_script',
        'bBlocksAdmin', // Array containing dynamic data for a JS Global.
        array(
            'pluginDirPath' => plugin_dir_path( __DIR__ ),
            'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
            'siteUrl'       => get_site_url(),
        )
    );
}
add_action( 'init', 'b_blocks_register' );

// After Setup Theme
function b_blocks_after_setup_theme() {
    add_theme_support( 'align-wide' );

    add_image_size( 'b_blocks_large', 1200, 800, true );
    add_image_size( 'b_blocks_medium', 525, 350, true );
    add_image_size( 'b_blocks_square', 300, 300, true );
    add_image_size( 'b_blocks_thumbnail', 150, 100, true );
}
add_action( 'after_setup_theme', 'b_blocks_after_setup_theme' );

// Generate Styles
class StyleGenerator {
    public static $styles = [];

    public static function addStyle($selector, $styles){
        if(array_key_exists($selector, self::$styles)){
           self::$styles[$selector] = wp_parse_args(self::$styles[$selector], $styles);
        }else {
            self::$styles[$selector] = $styles;
        }
    }

    public static function renderStyle(){
        $output = '';
        foreach(self::$styles as $selector => $style){
            $new = '';
            foreach($style as $property => $value){
                if($value == ''){
                    $new .= $property;
                }else {
                    $new .= " $property: $value;";
                }
            }
            $output .= "$selector { $new }";
        }

        return $output;
    }
}

// Posts Block.
require_once plugin_dir_path( __FILE__ ) . 'inc/posts.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/image-gallery.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/flip-box.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/card.php';

// Post API update
function b_blocks_custom_rest() {
    register_rest_field( 'post', 'wbImage', array(
        'get_callback'    => function ( $obj ) {
            $f_images = array();
            if ( !isset( $obj['featured_media'] ) ) {
                return $f_images;
            } else {
                $image = wp_get_attachment_image_src( $obj['featured_media'], 'full', false );
                if ( is_array( $image ) ) {
                    $f_images['full'] = $image;
                    $f_images['large'] = wp_get_attachment_image_src( $obj['featured_media'], 'b_blocks_large', false );
                    $f_images['medium'] = wp_get_attachment_image_src( $obj['featured_media'], 'b_blocks_medium', false );
                    $f_images['square'] = wp_get_attachment_image_src( $obj['featured_media'], 'b_blocks_square', false );
                    $f_images['thumbnail'] = wp_get_attachment_image_src( $obj['featured_media'], 'b_blocks_thumbnail', false );

                    return $f_images;
                }
            }
        },
        'update_callback' => null,
        'schema'          => array(
            'description' => __( 'Different sizes featured images', 'b-blocks' ),
            'type'        => 'array',
        ),
    ) );

    register_rest_field( 'post', 'wbAuthor', array(
        'get_callback'    => function ( $obj ) {
            $author['name'] = get_the_author_meta( 'display_name', isset( $obj['author'] ) ? $obj['author'] : '' );
            $author['link'] = get_author_posts_url( isset( $obj['author'] ) ? $obj['author'] : '' );
            return $author;
        },
        'update_callback' => null,
        'schema'          => array(
            'description' => __( 'Author name and link', 'b-blocks' ),
            'type'        => 'string',
        ),
    ) );

    register_rest_field( 'post', 'wbDate', array(
        'get_callback'    => function ( $obj ) {
            return get_the_date( 'M j, Y', $obj['id'] );
        },
        'update_callback' => null,
        'schema'          => array(
            'description' => __( 'Author name and link', 'b-blocks' ),
            'type'        => 'string',
        ),
    ) );

    register_rest_field( 'post', 'wbCategories', array(
        'get_callback'    => function ( $obj ) {
            $catsLink['space'] = get_the_category_list( esc_html__( ' ' ), '', $obj['id'] );
            $catsLink['coma'] = get_the_category_list( esc_html__( ', ' ), '', $obj['id'] );
            return $catsLink;
        },
        'update_callback' => null,
        'schema'          => array(
            'description' => __( 'Category link lists', 'b-blocks' ),
            'type'        => 'string',
        ),
    ) );

    register_rest_field( 'post', 'wbComment', array(
        'get_callback'    => function ( $obj ) {
            return wp_count_comments( $obj['id'] )->total_comments;
        },
        'update_callback' => null,
        'schema'          => array(
            'description' => __( 'Comment', 'b-blocks' ),
            'type'        => 'number',
        ),
    ) );
}
add_action( 'rest_api_init', 'b_blocks_custom_rest' );