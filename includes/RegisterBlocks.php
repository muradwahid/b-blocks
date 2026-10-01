<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class RegisterBlocks
{
	function __construct()
	{
		add_action( 'init', [$this, 'registerBlocks'] );
		add_filter( 'block_categories_all', [$this, 'registerCategories'] );
	}

	function registerBlocks()
	{
		$disabledBlocks = BlocksList::disabled();
		$premiumBlocks  = BlocksList::premium();

		foreach ( BlocksList::all() as $block ) {
			$dir = B_BLOCKS_DIR_PATH . "build/$block";

			// The dashboard toggles and the editor bundle both key off the
			// block's NAME, which is not always its directory — data-table is
			// registered as b-blocks/table. Matching on the directory alone
			// leaves such a block registered server-side after it has been
			// disabled, so both keys are checked.
			$name = $this->blockName( $dir, $block );
			$keys = array_unique( [ $name, "b-blocks/$block" ] );

			if ( array_intersect( $keys, $disabledBlocks ) || array_intersect( $keys, $premiumBlocks ) ) {
				continue;
			}

			$registered = register_block_type( $dir );

			// Every block shares one editor bundle, so the per-block handle is
			// dropped to keep it from being loaded again — leaving them all in
			// place runs the bundle once per block, re-registering every
			// inline format.
			$handle = ( $registered instanceof \WP_Block_Type ) ? $registered->name : $name;
			wp_deregister_script( generate_block_asset_handle( $handle, 'editorScript' ) );
		}
	}

	/**
	 * The name block.json registers the block under. Falls back to the
	 * directory-derived name when the metadata cannot be read.
	 */
	private function blockName( $dir, $block )
	{
		$file = "$dir/block.json";

		if ( file_exists( $file ) ) {
			$metadata = wp_json_file_decode( $file, [ 'associative' => true ] );

			if ( ! empty( $metadata['name'] ) ) {
				return $metadata['name'];
			}
		}

		return "b-blocks/$block";
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
}

new RegisterBlocks();

/**
 * ---------------------------------------------------------------------------
 * Kept from plugin.php, unchanged: wp_set_script_translations() calls for
 * blocks that are currently commented out of BlocksList::all(). They are
 * dead today; re-enable them alongside their block. Safe to delete.
 * ---------------------------------------------------------------------------
 */
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

// The woo-product-grid view.js carries no translation runtime: its strings are
// translated in PHP and shipped with the payload, so no script translations are
// registered for it.

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
