<?php
/**
 * Plugin Name: B Blocks
 * Description: Gutenberg Blocks Collection and Page Builder.
 * Version: 1.7.6
 * Author: bPlugins LLC
 * Author URI: http://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: b-blocks
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) { exit; }

// Constant
define( 'B_BLOCKS_PLUGIN_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.7.6' );
define( 'B_BLOCKS_ASSETS_DIR', plugin_dir_url( __FILE__ ) . 'assets/' );

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
		add_action( 'wp_enqueue_scripts', [$this, 'wpEnqueueScripts'] );
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
		wp_register_script( 'easyTicker', B_BLOCKS_ASSETS_DIR . 'js/easy-ticker.min.js', [], '3.2.1', true ); // Posts
		wp_register_script( 'swiper', B_BLOCKS_ASSETS_DIR . 'js/swiper.min.js', [], '8.0.7', true ); // Posts, Slider
		wp_register_script( 'lottiePlayer', B_BLOCKS_ASSETS_DIR . 'js/lottie-player.js', [], '1.5.7', true ); // Lottie Player
		wp_register_script( 'chart', B_BLOCKS_ASSETS_DIR . 'js/chart.min.js', [], '3.5.1', true ); // Chart
		wp_register_script( 'plyr', B_BLOCKS_ASSETS_DIR . 'js/plyr.js', [], '3.7.2', true ); // Video
		wp_register_script( 'textillate', B_BLOCKS_ASSETS_DIR . 'js/jquery.textillate.min.js', [], '0.6.1', true ); // Animated Text
		wp_register_script( 'goodShare', B_BLOCKS_ASSETS_DIR . 'js/goodshare.min.js', [], B_BLOCKS_PLUGIN_VERSION, true ); // Social Share

		echo wp_get_script_tag( [ 'src'	=> B_BLOCKS_ASSETS_DIR . 'js/model-viewer.min.js', 'type' => 'module' ] ); // 3D Viewer

		wp_register_style( 'fontAwesome', B_BLOCKS_ASSETS_DIR . 'css/fontAwesome.min.css', [], '5.15.4' ); // Font Awesome
		wp_register_style( 'swiper', B_BLOCKS_ASSETS_DIR . 'css/swiper.min.css', [], '8.0.7' ); // Posts, Slider
		wp_register_style( 'plyr', B_BLOCKS_ASSETS_DIR . 'css/plyr.css', [], '3.7.2' ); // Video
		wp_register_style( 'animate', B_BLOCKS_ASSETS_DIR . 'css/animate.min.css', [], '4.1.1' ); // Animated Text

		wp_enqueue_style( 'bBlocksStyle', plugins_url( 'dist/style.css', __FILE__ ), [ 'fontAwesome', 'swiper' ], B_BLOCKS_PLUGIN_VERSION ); // Style
	}

	// Enqueue Block Editor Assets
	function enqueueBlockEditorAssets(){
		wp_enqueue_script( 'jqueryUI', B_BLOCKS_ASSETS_DIR . 'js/jquery-ui.min.js', [], '1.13.0', true ); // Slider Block

		wp_enqueue_script( 'bBlocksEditorScript', plugins_url( 'dist/editor.js', __FILE__ ), [ 'wp-blob', 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-compose', 'wp-data', 'wp-element', 'wp-html-entities', 'wp-i18n', 'wp-rich-text', 'jquery', 'jqueryUI', 'easyTicker', 'swiper', 'lottiePlayer', 'chart', 'plyr', 'textillate', 'goodShare' ], B_BLOCKS_PLUGIN_VERSION, false ); // Backend Script

		wp_enqueue_style( 'bBlocksEditorStyle', plugins_url( 'dist/editor.css', __FILE__ ), [ 'plyr', 'bBlocksStyle' ], B_BLOCKS_PLUGIN_VERSION ); // Backend Style
	}

	// WP enqueue scripts
	function wpEnqueueScripts() {
		wp_enqueue_script( 'bBlocksScript', plugins_url( 'dist/script.js', __FILE__ ), [ 'wp-element', 'jquery', 'easyTicker', 'swiper' ], B_BLOCKS_PLUGIN_VERSION, true ); // Frontend Script
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