<?php
/**
 * Plugin Name: bBlocks
 * Description: Gutenberg Blocks Collection and Page Builder.
 * Version: 2.1.1
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: b-blocks
 * @fs_premium_only /includes/posts/Ajax.php, /includes/LicenseActivation.php
 */

// ABS PATH
if (!defined('ABSPATH')) {
	exit;
}

if (function_exists('b_blocks_fs')) {
	register_activation_hook(__FILE__, function () {
		if (is_plugin_active('b-blocks/plugin.php')) {
			deactivate_plugins('b-blocks/plugin.php');
		}
		if (is_plugin_active('b-blocks-pro/plugin.php')) {
			deactivate_plugins('b-blocks-pro/plugin.php');
		}
	});
} else {
	// Constant. On a local dev host, use a changing version so the browser
	// always loads freshly-built assets (no stale-bundle caching). Production
	// keeps the real, stable version.
	$bb_host    = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
	$bb_isLocal = $bb_host && ( 0 === strpos( $bb_host, 'localhost' ) || 0 === strpos( $bb_host, '127.0.0.1' ) || (bool) preg_match( '/\.(local|test|ddev\.site)(:\d+)?$/', $bb_host ) );
	define( 'B_BLOCKS_VERSION', $bb_isLocal ? (string) time() : '2.1.0' );
	define('B_BLOCKS_DIR_PATH', plugin_dir_path(__FILE__));
	define('B_BLOCKS_DIR_URL', plugin_dir_url(__FILE__));
	define('B_BLOCKS_HAS_PRO', 'b-blocks-pro/plugin.php' === plugin_basename(__FILE__));
	define('B_BLOCKS_BUILD', B_BLOCKS_DIR_URL . 'build/');
	define('B_BLOCKS_ASSETS', B_BLOCKS_DIR_URL . 'assets/');

	if (!function_exists('b_blocks_fs')) {
		// Create a helper function for easy SDK access.
		function b_blocks_fs()
		{
			global $b_blocks_fs;

			if (!isset($b_blocks_fs)) {
				// Include Freemius SDK.
				require_once dirname(__FILE__) . '/freemius/start.php';

				$b_blocks_fs = fs_dynamic_init(array(
					'id' => '12845',
					'slug' => 'b-blocks',
					'premium_slug' => 'b-blocks-pro',
					'type' => 'plugin',
					'public_key' => 'pk_d6426b344df4918bc066a7a0b4719',
					'is_premium' => true,
					'premium_suffix' => 'Pro',
					// If your plugin is a serviceware, set this option to false.
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

	// Generate Styles
	class BBlocksStyleGenerator
	{
		public static $styles = [];
		public static function addStyle($selector, $styles)
		{
			if (array_key_exists($selector, self::$styles)) {
				self::$styles[$selector] = wp_parse_args(self::$styles[$selector], $styles);
			} else {
				self::$styles[$selector] = $styles;
			}
		}
		public static function renderStyle()
		{
			$output = '';
			foreach (self::$styles as $selector => $style) {
				$new = '';
				foreach ($style as $property => $value) {
					if ( '' === $value ) {
						$new .= "$property ;";
					} else {
						$new .= " $property: $value;";
					}
				}
				$output .= "$selector { $new }";
			}
			return $output;
		}
	}

	// Require files
	require_once B_BLOCKS_DIR_PATH . 'includes/Dashboard.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/EnqueueScripts.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Utils.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/GetCSS.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Ajax.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/posts/Posts.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Templates/Templates.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/LoginForm.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/cursor.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Ai.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/ApiKeys.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/OptinRateLimit.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/form/FormHandler.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/newsletter/NewsletterHandler.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/popup-optin/PopupOptinHandler.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/post-filter-grid/PostFilterGrid.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/post-masonry-grid/PostMasonryGrid.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-add-to-cart/WooAddToCart.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-best-sellers/WooBestSellers.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-featured-product/WooFeaturedProduct.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-mini-cart/WooMiniCart.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-carousel/WooProductCarousel.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-grid/WooProductGrid.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-reviews/WooProductReviews.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-single-product/WooSingleProduct.php';

	// License Activation
	if (file_exists(B_BLOCKS_DIR_PATH . 'includes/LicenseActivation.php') && B_BLOCKS_HAS_PRO ) {
		require_once B_BLOCKS_DIR_PATH . 'includes/LicenseActivation.php';
	}
	


	class BBlocks
	{
		protected static $_instance = null;

		function __construct()
		{
			add_action('init', [$this, 'onInit']);
			add_action('wp_ajax_bBlocksPipeChecker', [$this, 'bBlocksPipeChecker']);
			add_action('wp_ajax_nopriv_bBlocksPipeChecker', [$this, 'bBlocksPipeChecker']);
			add_action('admin_init', [$this, 'registerSettings']);
			add_action('rest_api_init', [$this, 'registerSettings']);
			add_filter('block_categories_all', [$this, 'registerCategories']);

			add_filter('upload_mimes', [$this, 'uploadMimes']);
			add_filter('wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 5);

			add_action('wp_ajax_b-blocks-enable-svg-mime-type', [$this, 'enableSvgMimeType']);
			add_filter( 'plugin_row_meta', [$this, 'pluginRowMeta'], 10, 2 );
		}



		function pluginRowMeta( $plugin_meta, $plugin_file ) {
			return $plugin_meta;
		}

		public static function instance()
		{
			if (self::$_instance === null) {
				self::$_instance = new self();
			}
			return self::$_instance;
		}

		function bBlocksPipeChecker()
		{
			$nonce = sanitize_text_field(wp_unslash($_POST['_wpnonce'] ?? null ));

			if (!wp_verify_nonce($nonce, 'wp_ajax')) {
				wp_send_json_error('Invalid Request');
			}

			wp_send_json_success([
				'isPipe' => BBlocks\Inc\Utils::isPro()
			]);
		}

		function onInit()
		{

			$disabledBlocks = get_option('bBlocksDisabledBlocks', []);
			$disabledBlocks = is_array($disabledBlocks) ? $disabledBlocks : [];
			$premiumBlocks = BBlocks\Inc\Utils::isPro() ? [] : ['b-blocks/logo-slider', 'b-blocks/content-ticker', 'b-blocks/image-hotspot', 'b-blocks/stacked-cards','b-blocks/key-takeaways', 'b-blocks/stat-cards', 'b-blocks/article-card', 'b-blocks/event-card', 'b-blocks/file-download-card'];

			// Add dependent blocks
			if (in_array('b-blocks/row', $disabledBlocks) && !in_array('b-blocks/column', $disabledBlocks)) {
				$disabledBlocks[] = 'b-blocks/column';
			}
			if (in_array('b-blocks/services', $disabledBlocks) && !in_array('b-blocks/service', $disabledBlocks)) {
				$disabledBlocks[] = 'b-blocks/service';
			}

			$blocks = [
				'alert',
				// 'anchor-nav',
				'advanced-image',
				'animated-text',
				'advanced-tabs',
				'article-card',
				'audio-player',
				// 'author-box',
				'blockquote',
				'button',
				'button-group',
				'breadcrumb',
				// 'business-hours',
				// 'call-to-action',
				// 'callout',
				'cards',
				'chart',
				'column',
				'container',
				'content-ticker',
				'countdown',
				'counters',
				'data-table',
				'table-head',
				'table-body',
				'table-row',
				'table-cell',
				'table-footer',
				'carousel',
				'carousel-slide',
				// 'click-to-share',
				// 'code-highlight',
				'comparison-table',
				// 'contact-card',
				// 'content-filter',
				// 'content-filter-item',
				// 'cookie-consent-bar',
				// 'coupon-code',
				'divider',
				'dual-color-heading',
				'emoji-stack-separator',
				'event-card',
				'expand-content',
				'facebook-embed',
				'facebook-page',
				// 'faq-block',
				'feature-boxes',
				// 'feature-tabs',
				'file-download-card',
				'flip-boxes',
				// 'floating-cta',
				'gif',
				'form-builder',
				'google-map',
				'hero-section',
				// 'howto-schema',
				'html',
				// 'icon',
				'icon-box',
				// 'icon-list',
				// 'image-accordion',
				// 'image-box',
				'image-comparison',
				'image-gallery',
				'image-hotspot',
				// 'image-mask',
				'image-scroller',
				// 'image-slider',
				'info-box',
				'input-field',
				'interactive-checklist',
				'key-takeaways',
				// 'logo-grid',
				'logo-slider',
				'lottie-player',
				'list',
				'mailto',
				// 'marquee',
				'media-text-section',
				// 'milestone-timeline',
				// 'modal-popup',
				'navigation',
				'news-ticker',
				// 'newsletter-optin',
				// 'notification-bar',
				'off-canvas',
				// 'parallax-section',
				// 'pdf-embed',
				// 'popup-optin',
				// 'portfolio-gallery',
				// 'post-carousel',
				// 'post-filter-grid',
				// 'post-masonry-grid',
				// 'post-navigation',
				// 'post-timeline',
				'posts',
				'price-lists',
				'pricing-table',
				// 'pricing-toggle',
				'process-steps',
				// 'progress-bar',
				// 'progress-circle',
				// 'promo-strip',
				'qr-code',
				// 'reading-progress',
				// 'review-box',
				'row',
				'section-heading',
				'skill-bar',
				'service',
				'services',
				'shape-divider',
				'slider',
				// 'scroll-reveal',
				'scroll-to-top',
				// 'search-bar',
				'social-share',
				// 'social-share-bar',
				'whatsapp-chat',
				// 'woo-add-to-cart',
				// 'woo-best-sellers',
				// 'woo-category-grid',
				// 'woo-featured-product',
				// 'woo-mini-cart',
				// 'woo-product-carousel',
				// 'woo-product-filter',
				// 'woo-product-grid',
				// 'woo-product-reviews',
				// 'woo-sale-badge',
				// 'woo-single-product',
				'star-rating',
				'stacked-cards',
				'stat-cards',
				// 'sticky-sidebar',
				'svg-draw',
				'table-of-content',
				// 'taxonomy-grid',
				'td-viewer',
				'team-members',
				// 'testimonial-card',
				// 'testimonial-slider',
				'testimonials',
				// 'testimonials-grid',
				'timeline',
				'toggle-content',
				'accordion-block',
				'video',
				// 'video-popup',
				'text-path',
				// 'typing-headline',
				// 'urgency-timer'
			];

			foreach ($blocks as $block) {
				if (!in_array("b-blocks/$block", $disabledBlocks) && !in_array("b-blocks/$block", $premiumBlocks)) {
					register_block_type(__DIR__ . "/build/$block");
					wp_deregister_script("b-blocks-$block-editor-script");
				}
			}

			// The newsletter-optin view.js uses @wordpress/i18n – register translations
			// for the auto-generated view-script handle so frontend error/success strings
			// are translatable. The handle is derived from the block name by WordPress core.
			// if ( ! in_array( 'b-blocks/newsletter-optin', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-newsletter-optin-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The popup-optin view.js imports @wordpress/i18n for frontend
			// validation / status strings, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/popup-optin', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-popup-optin-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The floating-cta view.js imports @wordpress/i18n (__('Button') and __('Dismiss'))
			// so its view-script handle also needs translations registered.
			// if ( ! in_array( 'b-blocks/floating-cta', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-floating-cta-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The image-slider view.js imports @wordpress/i18n for lightbox aria-labels
			// so its view-script handle needs translations registered.
			// if ( ! in_array( 'b-blocks/image-slider', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-image-slider-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The testimonial-slider view.js imports @wordpress/i18n for the
			// play/pause toggle aria-labels, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/testimonial-slider', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-testimonial-slider-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The post-filter-grid view.js imports @wordpress/i18n for the
			// aria-live status announcements, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/post-filter-grid', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-post-filter-grid-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The post-masonry-grid view.js imports @wordpress/i18n for the
			// aria-live status announcements, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/post-masonry-grid', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-post-masonry-grid-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-add-to-cart view.js uses @wordpress/i18n for the aria-live
			// add-to-cart status announcements, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/woo-add-to-cart', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-add-to-cart-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-mini-cart view.js uses @wordpress/i18n for the cart
			// aria-label and aria-live announcements, so its view-script
			// handle needs translations registered.
			// if ( ! in_array( 'b-blocks/woo-mini-cart', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-mini-cart-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-best-sellers view.js imports @wordpress/i18n for the
			// aria-live add-to-cart status announcements ("added to cart",
			// error messages), so its view-script handle needs translations
			// registered.
			// if ( ! in_array( 'b-blocks/woo-best-sellers', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-best-sellers-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-featured-product view.js uses @wordpress/i18n for the
			// aria-live add-to-cart status announcements, so its view-script
			// handle needs translations registered.
			// if ( ! in_array( 'b-blocks/woo-featured-product', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-featured-product-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-product-grid view.js uses @wordpress/i18n for the aria-live
			// add-to-cart status announcements, so its view-script handle needs
			// translations registered.
			// if ( ! in_array( 'b-blocks/woo-product-grid', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-product-grid-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The woo-product-carousel view.js uses @wordpress/i18n for slide
			// aria-live announcements and the add-to-cart status region, so its
			// view-script handle needs translations registered.
			// if ( ! in_array( 'b-blocks/woo-product-carousel', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-woo-product-carousel-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The sticky-sidebar view.js uses @wordpress/i18n for the scrollable
			// sidebar aria-label, so its view-script handle needs translations registered.
			// if ( ! in_array( 'b-blocks/sticky-sidebar', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-sticky-sidebar-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }

			// The search-bar view.js imports @wordpress/i18n for the live-search
			// no-results / aria-live result-count strings, so its view-script
			// handle needs translations registered.
			// if ( ! in_array( 'b-blocks/search-bar', $disabledBlocks ) ) {
			// 	wp_set_script_translations(
			// 		'b-blocks-search-bar-view-script',
			// 		'b-blocks',
			// 		B_BLOCKS_DIR_PATH . 'languages'
			// 	);
			// }
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

		function registerCategories($categories)
		{
			return array_merge([
				[
					'slug' => 'bBlocks',
					'title' => __('bBlocks', 'b-blocks'),
				]
			], $categories);
		} // Register categories

		//Allow some additional file types for upload
		function uploadMimes($mimes)
		{
			$mimes['glb'] = 'model/gltf-binary'; // 3D Viewer
			$mimes['gltf'] = 'model/gltf-binary'; // 3D Viewer
			$mimes['json'] = 'application/json'; // Lottie Player
			$mimes['lottie'] = 'application/json'; // Lottie Player
			if (get_transient('b-blocks-enable-svg-mime-type') === 'true') {
				$mimes['svg'] = 'image/svg+xml';
			}
			return $mimes;
		}
		function wpCheckFiletypeAndExt($data, $file, $filename, $mimes, $real_mime = null)
		{
			// If file extension is 2 or more 
			$f_sp = explode('.', $filename);
			$f_exp_count = count($f_sp);

			if ($f_exp_count <= 1) {
				return $data;
			} else {
				$f_name = $f_sp[0];
				$ext = $f_sp[$f_exp_count - 1];
			}

			if ( 'glb' === $ext || 'gltf' === $ext ) { // 3D Viewer
				$type = 'model/gltf-binary';
				$proper_filename = '';
				return compact('ext', 'type', 'proper_filename');
			} elseif ( 'json' === $ext || 'lottie' === $ext ) { // Lottie Player
				$type = 'application/json';
				$proper_filename = '';
				return compact('ext', 'type', 'proper_filename');
			} else {
				return $data;
			}
		}

		public function enableSvgMimeType()
		{
			if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'] ?? null)), 'wp_ajax')) {
				wp_send_json_error();
			}

			if (!current_user_can('manage_options')) {
				wp_send_json_error();
			}

			set_transient('b-blocks-enable-svg-mime-type', 'true', 80);

			wp_send_json_success();
		}
	}
	BBlocks::instance();
}