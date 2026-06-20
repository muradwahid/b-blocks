<?php
/**
 * Woo Single Product — shared server logic.
 *
 * Responsibilities:
 *   - Sanitize the block attribute set into a safe, typed array.
 *   - Render the native WooCommerce single-product purchase area for one chosen
 *     product inside an isolated wc_setup_product_data() context, firing
 *     WooCommerce's own template hooks (woocommerce_show_product_images,
 *     woocommerce_single_product_summary, woocommerce_after_single_product_summary)
 *     so the gallery, variation form, native add-to-cart form and meta render
 *     exactly as on the canonical product page.
 *
 * No custom add-to-cart AJAX endpoint or nonce is needed: WooCommerce's own
 * enqueued scripts (wc-single-product, wc-add-to-cart-variation) handle all
 * interactivity. After rendering, the product/post globals are always reset so
 * the rest of the page is not polluted.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooSingleProduct {

	/**
	 * Clamp a value to an integer range.
	 *
	 * @param mixed $value    Raw value.
	 * @param int   $min      Minimum.
	 * @param int   $max      Maximum.
	 * @param int   $fallback Fallback when non-numeric.
	 * @return int
	 */
	public static function clampInt( $value, $min, $max, $fallback ) {
		if ( ! is_numeric( $value ) ) {
			return (int) $fallback;
		}
		$value = (int) $value;
		if ( $value < $min ) {
			return (int) $min;
		}
		if ( $value > $max ) {
			return (int) $max;
		}
		return $value;
	}

	/**
	 * Pick a value from an allowlist.
	 *
	 * @param mixed    $value    Raw value.
	 * @param string[] $allowed  Allowed values.
	 * @param string   $fallback Fallback.
	 * @return string
	 */
	public static function pickFrom( $value, array $allowed, $fallback ) {
		$value = is_string( $value ) ? trim( $value ) : '';
		return in_array( $value, $allowed, true ) ? $value : $fallback;
	}

	/**
	 * Sanitize a CSS color value (hex, rgb/hsl, var(), or a CSS keyword).
	 *
	 * @param mixed  $color    Raw color.
	 * @param string $fallback Fallback when invalid.
	 * @return string
	 */
	public static function sanitizeColor( $color, $fallback = '' ) {
		$color = trim( (string) $color );
		if ( '' === $color ) {
			return $fallback;
		}
		if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
			return $color;
		}
		return $fallback;
	}

	/**
	 * Normalize and sanitize the full attribute set into a safe, typed array.
	 *
	 * @param array $attributes Raw block attributes.
	 * @return array
	 */
	public static function resolveAttributes( array $attributes ) {
		$noProductMessage = isset( $attributes['noProductMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductMessage'] ) : '';
		$noProductMessage = '' !== trim( $noProductMessage ) ? $noProductMessage : __( 'Please select a product.', 'b-blocks' );

		return [
			'productId'         => self::clampInt( $attributes['productId'] ?? 0, 0, PHP_INT_MAX, 0 ),
			'layout'            => self::pickFrom( $attributes['layout'] ?? 'horizontal', [ 'horizontal', 'vertical' ], 'horizontal' ),
			'gallerySplit'      => self::clampInt( $attributes['gallerySplit'] ?? 50, 20, 70, 50 ),
			'showGallery'       => ! isset( $attributes['showGallery'] ) || (bool) $attributes['showGallery'],
			'showSummary'       => ! isset( $attributes['showSummary'] ) || (bool) $attributes['showSummary'],
			'showAfterSummary'  => ! empty( $attributes['showAfterSummary'] ),
			'columnGap'         => self::clampInt( $attributes['columnGap'] ?? 32, 0, 80, 32 ),
			'maxWidth'          => self::clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 ),
			'blockAlign'        => self::pickFrom( $attributes['blockAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' ),
			'paddingVertical'   => self::clampInt( $attributes['paddingVertical'] ?? 0, 0, 120, 0 ),
			'paddingHorizontal' => self::clampInt( $attributes['paddingHorizontal'] ?? 0, 0, 120, 0 ),
			'blockBG'           => self::sanitizeColor( $attributes['blockBG'] ?? '', 'transparent' ),
			'blockBorderRadius' => self::clampInt( $attributes['blockBorderRadius'] ?? 0, 0, 48, 0 ),
			'mobileStackOrder'  => self::pickFrom( $attributes['mobileStackOrder'] ?? 'gallery-first', [ 'gallery-first', 'summary-first' ], 'gallery-first' ),
			'mobileBreakpoint'  => self::clampInt( $attributes['mobileBreakpoint'] ?? 767, 480, 960, 767 ),
			'noProductMessage'  => $noProductMessage,
		];
	}

	/**
	 * Demote the first <h1> in an HTML string to <h2>.
	 *
	 * WooCommerce's single-product title template wraps the_title() output in
	 * <h1 class="product_title entry-title">. Because this block is embedded on a
	 * non-product page, an <h1> would harm the document heading outline. We apply
	 * this transformation on the fully-rendered ob_get_clean() HTML (not via the
	 * the_title filter, which only sees the raw text of the title) so the first
	 * <h1>...</h1> pair inside the summary wrapper is reliably swapped to <h2>.
	 *
	 * @param string $html Rendered HTML of the bb-wsp-summary section.
	 * @return string
	 */
	public static function demoteTitleHeading( $html ) {
		if ( ! is_string( $html ) ) {
			return $html;
		}
		$replaced = preg_replace(
			[ '/<h1(\s|>)/i', '/<\/h1>/i' ],
			[ '<h2$1', '</h2>' ],
			$html,
			1
		);
		return null === $replaced ? $html : $replaced;
	}

	/**
	 * Render the native purchase area for one product.
	 *
	 * Sets up the global product/post context, fires WooCommerce's own template
	 * hooks for the gallery, summary and (optionally) after-summary sections,
	 * then resets the globals. Returns the rendered HTML string (the gallery and
	 * summary column wrappers only — the outer block wrapper is added by render.php).
	 *
	 * @param WC_Product $product The resolved, visible product.
	 * @param array      $a       Sanitized attributes from resolveAttributes().
	 * @return string
	 */
	public static function renderProductArea( $product, array $a ) {
		// Save the globals we are about to overwrite so we can restore them
		// after rendering and never pollute the main query / page context.
		$savedPost    = isset( $GLOBALS['post'] ) ? $GLOBALS['post'] : null;
		$savedProduct = isset( $GLOBALS['product'] ) ? $GLOBALS['product'] : null;

		// Set the global $product / $post WooCommerce template functions expect.
		$postObject = get_post( $product->get_id() );
		if ( $postObject instanceof \WP_Post ) {
			$GLOBALS['post'] = $postObject; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restored below.
			setup_postdata( $postObject );
		}
		wc_setup_product_data( $postObject instanceof \WP_Post ? $postObject : $product->get_id() );

		ob_start();

		if ( $a['showGallery'] ) {
			echo '<div class="bb-wsp-gallery">';
			/**
			 * Fires WooCommerce's native product image gallery (featured image +
			 * thumbnail strip, sale flash, zoom/lightbox triggers).
			 */
			woocommerce_show_product_images();
			echo '</div>';
		}

		if ( $a['showSummary'] ) {
			ob_start();

			/**
			 * Fires the native summary column: title, rating, price, short
			 * description, the add-to-cart form (including variation selectors
			 * for variable products), and the product meta (SKU / categories /
			 * tags), in standard WooCommerce priority order.
			 */
			do_action( 'woocommerce_single_product_summary' );

			// Demote the first <h1> to <h2> in the rendered summary HTML so the
			// embedded product does not create a duplicate top-level heading on
			// the host page. Applied to the fully-buffered output so the regex
			// can reliably match the <h1 class="product_title entry-title"> tag
			// (the_title filter only sees the raw post title text, not the tag).
			$summaryHtml = self::demoteTitleHeading( ob_get_clean() );

			echo '<div class="bb-wsp-summary summary entry-summary">';
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WooCommerce core template output with heading tag already demoted.
			echo $summaryHtml;
			echo '</div>';
		}

		if ( $a['showAfterSummary'] ) {
			echo '<div class="bb-wsp-after-summary">';
			/**
			 * Fires the native after-summary hooks: product data tabs
			 * (Description, Additional information, Reviews) and upsells.
			 */
			do_action( 'woocommerce_after_single_product_summary' );
			echo '</div>';
		}

		$html = ob_get_clean();

		// Tear down the product context and restore the original globals so the
		// rest of the page sees an untouched main query and product global.
		if ( null !== $savedProduct ) {
			$GLOBALS['product'] = $savedProduct; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restoring saved value.
		} else {
			unset( $GLOBALS['product'] );
		}

		if ( null !== $savedPost ) {
			$GLOBALS['post'] = $savedPost; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restoring saved value.
			setup_postdata( $savedPost );
		} else {
			wp_reset_postdata();
		}

		return $html;
	}
}
