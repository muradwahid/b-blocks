<?php
/**
 * Plugin Name: bBlocks
 * Description: Gutenberg blocks plugin with 90+ customizable blocks, patterns and templates that turn the WordPress block editor into a fast, lightweight page builder.
 * Version: 2.1.18
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

	define( 'B_BLOCKS_FILE', __FILE__ );

	require_once plugin_dir_path( __FILE__ ) . 'includes/Constants.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/FInit.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/StyleGenerator.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Sanitize.php';

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
	require_once B_BLOCKS_DIR_PATH . 'includes/Performance.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/SiteScanner.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Instagram.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/OptinRateLimit.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/form/FormHandler.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/newsletter/NewsletterHandler.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/document-embed/DocumentEmbedHandler.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/document-embed/DocumentEmbedCloud.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/advanced-search/AdvancedSearch.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/popup-optin/PopupOptinHandler.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/post-filter-grid/PostFilterGrid.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/post-masonry-grid/PostMasonryGrid.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-add-to-cart/WooAddToCart.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-best-sellers/WooBestSellers.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-featured-product/WooFeaturedProduct.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-mini-cart/WooMiniCart.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-carousel/WooProductCarousel.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-details/WooProductDetails.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-grid/WooProductGrid.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-images/WooProductImages.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-price/WooProductPrice.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-rating/WooProductRating.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-product-reviews/WooProductReviews.php';
	// require_once B_BLOCKS_DIR_PATH . 'includes/blocks/woo-single-product/WooSingleProduct.php';

	// Blocks, settings and uploads
	require_once B_BLOCKS_DIR_PATH . 'includes/BlocksList.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/RegisterBlocks.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/RegisterSettings.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/UploadFileTypes.php';
	require_once B_BLOCKS_DIR_PATH . 'includes/Campaign.php';

	// License Activation
	if (file_exists(B_BLOCKS_DIR_PATH . 'includes/LicenseActivation.php') && B_BLOCKS_HAS_PRO ) {
		require_once B_BLOCKS_DIR_PATH . 'includes/LicenseActivation.php';
	}
}