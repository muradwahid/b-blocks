<?php
/**
 * Woo Add to Cart — shared server logic.
 *
 * Provides attribute sanitization helpers and a hardened single-product
 * add-to-cart AJAX endpoint (`bb_atc_add_to_cart`) used by the frontend
 * `view.js`.
 *
 * Security model for `bb_atc_add_to_cart`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - product_id sanitized with absint() and validated against wc_get_product().
 *   - quantity sanitized with absint() and clamped to 1..99.
 *   - Only purchasable, in-stock, simple (non-variable) products are added.
 *   - All responses use wp_send_json_success / wp_send_json_error.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooAddToCart {

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_atc_add_to_cart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_ajax_nopriv_bb_atc_add_to_cart', [ $this, 'ajaxAddToCart' ] );
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
	 * Sanitize a CSS length in px (digits + "px"). Falls back when invalid.
	 *
	 * @param mixed  $value    Raw value (e.g. "12px" or 12).
	 * @param int    $min      Minimum px.
	 * @param int    $max      Maximum px.
	 * @param string $fallback Fallback value (e.g. "12px").
	 * @return string
	 */
	public static function sanitizePx( $value, $min, $max, $fallback ) {
		$digits = preg_replace( '/[^0-9]/', '', (string) $value );
		if ( '' === $digits ) {
			return $fallback;
		}
		$n = (int) $digits;
		if ( $n < $min ) {
			$n = $min;
		}
		if ( $n > $max ) {
			$n = $max;
		}
		return $n . 'px';
	}

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
	 * Handle the `bb_atc_add_to_cart` AJAX request for simple products.
	 *
	 * Returns JSON: { added, productName, cartCount, cartUrl } or an error.
	 */
	public function ajaxAddToCart() {
		check_ajax_referer( 'bb_atc_add_to_cart', 'nonce' );

		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			wp_send_json_error( [ 'message' => __( 'WooCommerce is not available.', 'b-blocks' ) ] );
		}

		$productId = isset( $_POST['product_id'] ) ? absint( wp_unslash( $_POST['product_id'] ) ) : 0;
		if ( $productId < 1 ) {
			wp_send_json_error( [ 'message' => __( 'Invalid product.', 'b-blocks' ) ] );
		}

		$quantity = isset( $_POST['quantity'] ) ? absint( wp_unslash( $_POST['quantity'] ) ) : 1;
		$quantity = self::clampInt( $quantity, 1, 99, 1 );

		$product = wc_get_product( $productId );
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			wp_send_json_error( [ 'message' => __( 'Product not found.', 'b-blocks' ) ] );
		}

		if ( ! $product->is_type( 'simple' ) || ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			wp_send_json_error( [ 'message' => __( 'This product cannot be added to the cart.', 'b-blocks' ) ] );
		}

		$added = WC()->cart->add_to_cart( $productId, $quantity );

		if ( ! $added ) {
			wp_send_json_error( [ 'message' => __( 'Could not add the product to the cart.', 'b-blocks' ) ] );
		}

		wp_send_json_success(
			[
				'added'       => true,
				'productName' => wp_strip_all_tags( $product->get_name() ),
				'cartCount'   => WC()->cart->get_cart_contents_count(),
				'cartUrl'     => function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '',
			]
		);
	}
}

new WooAddToCart();
