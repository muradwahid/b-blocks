<?php
/**
 * Plugin Name: B Blocks
 * Description: Gutenberg Blocks Collection and Page Builder.
 * Version: 1.7.8
 * Author: bPlugins LLC
 * Author URI: http://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: b-blocks
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) { exit; }

// Constant
define( 'B_BLOCKS_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.7.8' );
define( 'B_BLOCKS_DIR', plugin_dir_url( __FILE__ ) );
define( 'B_BLOCKS_DIST', B_BLOCKS_DIR . 'dist/' );
define( 'B_BLOCKS_ASSETS', B_BLOCKS_DIR . 'assets/' );

if ( ! function_exists( 'bb_fs' ) ) {
    // Create a helper function for easy SDK access.
    function bb_fs() {
        global $bb_fs;

        if ( ! isset( $bb_fs ) ) {
            // Activate multisite network integration.
            if ( ! defined( 'WP_FS__PRODUCT_12845_MULTISITE' ) ) {
                define( 'WP_FS__PRODUCT_12845_MULTISITE', true );
            }

            // Include Freemius SDK.
            require_once dirname(__FILE__) . '/freemius/start.php';

            $bb_fs = fs_dynamic_init( array(
                'id'                  => '12845',
                'slug'                => 'b-blocks',
                'premium_slug'        => 'b-blocks-pro',
                'type'                => 'plugin',
                'public_key'          => 'pk_d6426b344df4918bc066a7a0b4719',
                'is_premium'          => true,
                'premium_suffix'      => 'Pro',
                // If your plugin is a serviceware, set this option to false.
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'trial'               => array(
                    'days'               => 7,
                    'is_require_payment' => true,
                ),
                'menu'                => array(
                    'first-path'     => 'plugins.php',
                ),
                // Set the SDK to work in a sandbox mode (for development & testing).
                // IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
                'secret_key'          => 'sk_nhpu<pa1bS#~tO{8<;spDwO?3:d_b',
            ) );
        }

        return $bb_fs;
    }

    // Init Freemius.
    bb_fs();
    // Signal that SDK was initiated.
    do_action( 'bb_fs_loaded' );
}

// Generate Styles
class BBlocksStyleGenerator {
	public static $styles = [];
	public static function addStyle( $selector, $styles ){
		if( array_key_exists( $selector, self::$styles ) ){
			self::$styles[$selector] = wp_parse_args( self::$styles[$selector], $styles );
		}else { self::$styles[$selector] = $styles; }
	}
	public static function renderStyle(){
		$output = '';
		foreach( self::$styles as $selector => $style ){
			$new = '';
			foreach( $style as $property => $value ){
				if( $value == '' ){
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

// B Blocks
class BBlocks{
	protected static $_instance = null;

	function __construct(){
		add_action( 'init', [$this, 'onInit'] );
		add_action( 'enqueue_block_assets', [$this, 'enqueueBockAssets'] );
		add_action( 'enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets'] );
		add_filter( 'script_loader_tag', [$this, 'scriptLoaderTag'], 10, 3 );
		if ( version_compare( $GLOBALS['wp_version'], '5.8-alpha-1', '<' ) ) {
			add_filter( 'block_categories', [$this, 'registerCategories'] );
		} else { add_filter( 'block_categories_all', [$this, 'registerCategories'] ); }
	}

	public static function instance(){
		if( self::$_instance === null ){
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	// Register categories
	function registerCategories( $categories ){
		return array_merge( [ [
			'slug'	=> 'bBlocks',
			'title'	=> __( 'B Blocks', 'b-blocks' ),
		] ], $categories );
	}

	// Enqueue block assets
	function enqueueBockAssets(){
		wp_register_script( 'easyTicker', B_BLOCKS_ASSETS . 'js/easy-ticker.min.js', [ 'jquery' ], '3.2.1', true ); // Posts
		wp_register_script( 'swiper', B_BLOCKS_ASSETS . 'js/swiper.min.js', [], '8.0.7', true ); // Posts, Slider
		wp_register_script( 'lottiePlayer', B_BLOCKS_ASSETS . 'js/lottie-player.js', [], '1.5.7', true ); // Lottie Player
		wp_register_script( 'chart', B_BLOCKS_ASSETS . 'js/chart.min.js', [], '3.5.1', true ); // Chart
		wp_register_script( 'plyr', B_BLOCKS_ASSETS . 'js/plyr.js', [], '3.7.2', true ); // Video
		wp_register_script( 'textillate', B_BLOCKS_ASSETS . 'js/jquery.textillate.min.js', [ 'jquery' ], '0.6.1', true ); // Animated Text
		wp_register_script( 'goodShare', B_BLOCKS_ASSETS . 'js/goodshare.min.js', [], B_BLOCKS_VERSION, true ); // Social Share
		wp_register_script( 'modelViewer', B_BLOCKS_ASSETS . 'js/model-viewer.min.js', [], B_BLOCKS_VERSION, true ); // 3D Viewer

		wp_register_style( 'fontAwesome', B_BLOCKS_ASSETS . 'css/fontAwesome.min.css', [], '5.15.4' ); // Font Awesome
		wp_register_style( 'swiper', B_BLOCKS_ASSETS . 'css/swiper.min.css', [], '8.0.7' ); // Posts, Slider
		wp_register_style( 'animate', B_BLOCKS_ASSETS . 'css/animate.min.css', [], '4.1.1' ); // Animated Text
		wp_register_style( 'plyr', B_BLOCKS_ASSETS . 'css/plyr.css', [], '3.7.2' ); // Video

		wp_enqueue_style( 'bBlocksStyle', B_BLOCKS_DIST . 'style.css', [], B_BLOCKS_VERSION ); // Style

		// Single Block Styles
		wp_register_style( 'b-blocks-td-viewer-style', B_BLOCKS_DIST . '3d-viewer.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-alert-style', B_BLOCKS_DIST . 'alert.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-animated-text-style', B_BLOCKS_DIST . 'animated-text.css', [ 'animate' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-button-group-style', B_BLOCKS_DIST . 'button-group.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-cards-style', B_BLOCKS_DIST . 'cards.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-chart-style', B_BLOCKS_DIST . 'chart.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-countdown-style', B_BLOCKS_DIST . 'countdown.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-counters-style', B_BLOCKS_DIST . 'counters.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-feature-boxes-style', B_BLOCKS_DIST . 'feature-boxes.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-flip-boxes-style', B_BLOCKS_DIST . 'flip-boxes.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-gif-style', B_BLOCKS_DIST . 'gif.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-image-comparison-style', B_BLOCKS_DIST . 'image-comparison.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-image-gallery-style', B_BLOCKS_DIST . 'image-gallery.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-info-box-style', B_BLOCKS_DIST . 'info-box.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-lottie-player-style', B_BLOCKS_DIST . 'lottie-player.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-mailto-style', B_BLOCKS_DIST . 'mailto.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-posts-style', B_BLOCKS_DIST . 'posts.css', [ 'swiper' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-price-lists-style', B_BLOCKS_DIST . 'price-lists.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-pricing-table-style', B_BLOCKS_DIST . 'pricing-table.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-qr-code-style', B_BLOCKS_DIST . 'qr-code.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-row-style', B_BLOCKS_DIST . 'row.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-section-heading-style', B_BLOCKS_DIST . 'section-heading.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-services-style', B_BLOCKS_DIST . 'services.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-shape-divider-style', B_BLOCKS_DIST . 'shape-divider.css', [], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-slider-style', B_BLOCKS_DIST . 'slider.css', [ 'swiper' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-social-share-style', B_BLOCKS_DIST . 'social-share.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-team-members-style', B_BLOCKS_DIST . 'team-members.css', [ 'fontAwesome' ], B_BLOCKS_VERSION );
		wp_register_style( 'b-blocks-video-style', B_BLOCKS_DIST . 'video.css', [ 'plyr' ], B_BLOCKS_VERSION );
	}

	// Enqueue Block Editor Assets
	function enqueueBlockEditorAssets(){
		wp_register_script( 'jqueryUI', B_BLOCKS_ASSETS . 'js/jquery-ui.min.js', [ 'jquery' ], '1.13.0', true ); // Slider Block

		wp_enqueue_script( 'bBlocksEditorScript', B_BLOCKS_DIST . 'editor.js', [ 'wp-blob', 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-compose', 'wp-data', 'wp-element', 'wp-html-entities', 'wp-i18n', 'wp-rich-text', 'jquery', 'jqueryUI', 'modelViewer', 'easyTicker', 'swiper', 'lottiePlayer', 'chart', 'plyr', 'textillate', 'goodShare' ], B_BLOCKS_VERSION, false ); // Backend Script

		wp_enqueue_style( 'bBlocksEditorStyle', B_BLOCKS_DIST . 'editor.css', [
			'fontAwesome',
			'bBlocksStyle',
			'b-blocks-td-viewer-style',
			'b-blocks-alert-style',
			'b-blocks-animated-text-style',
			'b-blocks-button-group-style',
			'b-blocks-cards-style',
			'b-blocks-chart-style',
			'b-blocks-countdown-style',
			'b-blocks-counters-style',
			'b-blocks-feature-boxes-style',
			'b-blocks-flip-boxes-style',
			'b-blocks-gif-style',
			'b-blocks-image-comparison-style',
			'b-blocks-image-gallery-style',
			'b-blocks-info-box-style',
			'b-blocks-lottie-player-style',
			'b-blocks-mailto-style',
			'b-blocks-posts-style',
			'b-blocks-price-lists-style',
			'b-blocks-pricing-table-style',
			'b-blocks-qr-code-style',
			'b-blocks-row-style',
			'b-blocks-section-heading-style',
			'b-blocks-services-style',
			'b-blocks-slider-style',
			'b-blocks-shape-divider-style',
			'b-blocks-social-share-style',
			'b-blocks-team-members-style',
			'b-blocks-video-style'
		], B_BLOCKS_VERSION ); // Backend Style
	}

	function scriptLoaderTag( $tag, $handle, $src ){
        // if not your script, do nothing and return original $tag
        if ( 'modelViewer' !== $handle ) {
            return $tag;
        }
        // change the script tag by adding type="module" and return it.
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
        return $tag;
    }

	// On Init
	function onInit(){
		wp_set_script_translations( 'bBlocksEditorScript', 'b-blocks', plugin_dir_path( __FILE__ ) . 'languages' ); // Translate
	}
}
BBlocks::instance();

// Require files
require_once plugin_dir_path( __FILE__ ) . 'inc/getCSS.php';

require_once plugin_dir_path( __FILE__ ) . 'inc/row/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/row/column/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/posts/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/slider/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/section-heading/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/video/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/services/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/services/child/child.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/3d-viewer/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/image-gallery/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/image-comparison/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/flip-boxes/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/team-members/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/cards/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/pricing-table/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/price-lists/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/feature-boxes/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/info-box/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/lottie-player/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/chart/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/button-group/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/countdown/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/counters/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/mailto/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/gif/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/qr-code/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/social-share/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/animated-text/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/alert/block.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/shape-divider/block.php';