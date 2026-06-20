<?php
/**
 * Woo Featured Product — shared server logic.
 *
 * Provides attribute sanitization and a hardened add-to-cart AJAX endpoint
 * (`bb_wfp_add_to_cart`) used by the frontend `view.js` for simple products.
 *
 * Security model for `bb_wfp_add_to_cart`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - product_id sanitized with absint() and validated against wc_get_product().
 *   - Only purchasable, in-stock, simple products are added.
 *   - All responses use wp_send_json_success / wp_send_json_error.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooFeaturedProduct {

	/**
	 * Allowed aspect ratios.
	 *
	 * @var string[]
	 */
	const RATIOS = [ '1/1', '4/3', '3/4', '16/9' ];

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_wfp_add_to_cart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_ajax_nopriv_bb_wfp_add_to_cart', [ $this, 'ajaxAddToCart' ] );
	}

	/* ----------------------------------------------------------------------
	 * Sanitizers
	 * ------------------------------------------------------------------- */

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
	 * Extract a clamped pixel integer from a CSS size string.
	 *
	 * @param mixed $value    Raw value (e.g. "28px").
	 * @param int   $min      Minimum.
	 * @param int   $max      Maximum.
	 * @param int   $fallback Fallback.
	 * @return int
	 */
	public static function sizeInt( $value, $min, $max, $fallback ) {
		$num = preg_replace( '/[^0-9]/', '', (string) $value );
		return self::clampInt( '' === $num ? $fallback : $num, $min, $max, $fallback );
	}

	/**
	 * Normalize and sanitize the full attribute set into a safe, typed array.
	 *
	 * @param array $attributes Raw block attributes.
	 * @return array
	 */
	public static function resolveAttributes( array $attributes ) {
		$titleFont = (array) ( $attributes['titleFontSize'] ?? [] );
		$descFont  = (array) ( $attributes['descriptionFontSize'] ?? [] );
		$btnFont   = (array) ( $attributes['btnFontSize'] ?? [] );

		$saleBadgeLabel = isset( $attributes['saleBadgeLabel'] ) ? wp_strip_all_tags( (string) $attributes['saleBadgeLabel'] ) : '';
		$saleBadgeLabel = '' !== trim( $saleBadgeLabel ) ? $saleBadgeLabel : __( 'Sale', 'b-blocks' );

		$addToCartLabel = isset( $attributes['addToCartLabel'] ) ? wp_strip_all_tags( (string) $attributes['addToCartLabel'] ) : '';
		$addToCartLabel = '' !== trim( $addToCartLabel ) ? $addToCartLabel : __( 'Add to Cart', 'b-blocks' );

		$viewProductLabel = isset( $attributes['viewProductLabel'] ) ? wp_strip_all_tags( (string) $attributes['viewProductLabel'] ) : '';
		$viewProductLabel = '' !== trim( $viewProductLabel ) ? $viewProductLabel : __( 'View Product', 'b-blocks' );

		$noProductMessage = isset( $attributes['noProductMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductMessage'] ) : '';
		$noProductMessage = '' !== trim( $noProductMessage ) ? $noProductMessage : __( 'Please select a product.', 'b-blocks' );

		return [
			'productId'              => self::clampInt( $attributes['productId'] ?? 0, 0, PHP_INT_MAX, 0 ),
			'layout'                 => self::pickFrom( $attributes['layout'] ?? 'horizontal', [ 'horizontal', 'vertical' ], 'horizontal' ),
			'imagePosition'          => self::pickFrom( $attributes['imagePosition'] ?? 'left', [ 'left', 'right' ], 'left' ),
			'imageSplit'             => self::clampInt( $attributes['imageSplit'] ?? 50, 30, 70, 50 ),
			'imageRatio'             => self::pickFrom( $attributes['imageRatio'] ?? '1/1', self::RATIOS, '1/1' ),
			'imageFit'               => self::pickFrom( $attributes['imageFit'] ?? 'cover', [ 'cover', 'contain' ], 'cover' ),
			'imageBorderRadius'      => self::clampInt( $attributes['imageBorderRadius'] ?? 8, 0, 48, 8 ),
			'showImage'              => ! isset( $attributes['showImage'] ) || (bool) $attributes['showImage'],
			'showBadge'              => ! isset( $attributes['showBadge'] ) || (bool) $attributes['showBadge'],
			'saleBadgeLabel'         => $saleBadgeLabel,
			'showRating'             => ! isset( $attributes['showRating'] ) || (bool) $attributes['showRating'],
			'showPrice'              => ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'],
			'showShortDescription'   => ! isset( $attributes['showShortDescription'] ) || (bool) $attributes['showShortDescription'],
			'showAddToCart'          => ! isset( $attributes['showAddToCart'] ) || (bool) $attributes['showAddToCart'],
			'addToCartLabel'         => $addToCartLabel,
			'viewProductLabel'       => $viewProductLabel,
			'contentAlign'           => self::pickFrom( $attributes['contentAlign'] ?? 'left', [ 'left', 'center', 'right' ], 'left' ),
			'contentVerticalAlign'   => self::pickFrom( $attributes['contentVerticalAlign'] ?? 'center', [ 'top', 'center', 'bottom' ], 'center' ),
			'gap'                    => self::clampInt( $attributes['gap'] ?? 32, 0, 80, 32 ),
			'maxWidth'               => self::clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 ),
			'blockAlign'             => self::pickFrom( $attributes['blockAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' ),
			'blockPaddingVertical'   => self::clampInt( $attributes['blockPaddingVertical'] ?? 40, 0, 120, 40 ),
			'blockPaddingHorizontal' => self::clampInt( $attributes['blockPaddingHorizontal'] ?? 40, 0, 120, 40 ),
			'blockBG'                => self::sanitizeColor( $attributes['blockBG'] ?? '', 'transparent' ),
			'blockBorderRadius'      => self::clampInt( $attributes['blockBorderRadius'] ?? 0, 0, 48, 0 ),
			'titleColor'             => self::sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' ),
			'titleSizeDesktop'       => self::sizeInt( $titleFont['desktop'] ?? '28', 12, 80, 28 ),
			'titleSizeTablet'        => self::sizeInt( $titleFont['tablet'] ?? '24', 12, 72, 24 ),
			'titleSizeMobile'        => self::sizeInt( $titleFont['mobile'] ?? '20', 12, 64, 20 ),
			'titleFontWeight'        => self::clampInt( $attributes['titleFontWeight'] ?? 700, 400, 900, 700 ),
			'priceColor'             => self::sanitizeColor( $attributes['priceColor'] ?? '', '#e44d3a' ),
			'regularPriceColor'      => self::sanitizeColor( $attributes['regularPriceColor'] ?? '', '#999999' ),
			'ratingColor'            => self::sanitizeColor( $attributes['ratingColor'] ?? '', '#f5a623' ),
			'descriptionColor'       => self::sanitizeColor( $attributes['descriptionColor'] ?? '', 'inherit' ),
			'descSizeDesktop'        => self::sizeInt( $descFont['desktop'] ?? '15', 10, 40, 15 ),
			'descSizeTablet'         => self::sizeInt( $descFont['tablet'] ?? '14', 10, 36, 14 ),
			'descSizeMobile'         => self::sizeInt( $descFont['mobile'] ?? '14', 10, 32, 14 ),
			'badgeBG'                => self::sanitizeColor( $attributes['badgeBG'] ?? '', '#e44d3a' ),
			'badgeTextColor'         => self::sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' ),
			'btnColor'               => self::sanitizeColor( $attributes['btnColor'] ?? '', '#ffffff' ),
			'btnBG'                  => self::sanitizeColor( $attributes['btnBG'] ?? '', '#146EF5' ),
			'btnHovColor'            => self::sanitizeColor( $attributes['btnHovColor'] ?? '', '#ffffff' ),
			'btnHovBG'               => self::sanitizeColor( $attributes['btnHovBG'] ?? '', '#070127' ),
			'btnRadius'              => self::clampInt( $attributes['btnRadius'] ?? 6, 0, 48, 6 ),
			'btnSizeDesktop'         => self::sizeInt( $btnFont['desktop'] ?? '16', 10, 40, 16 ),
			'btnSizeTablet'          => self::sizeInt( $btnFont['tablet'] ?? '15', 10, 36, 15 ),
			'btnSizeMobile'          => self::sizeInt( $btnFont['mobile'] ?? '14', 10, 32, 14 ),
			'btnFontWeight'          => self::clampInt( $attributes['btnFontWeight'] ?? 600, 400, 900, 600 ),
			'btnPaddingVertical'     => self::clampInt( $attributes['btnPaddingVertical'] ?? 12, 4, 40, 12 ),
			'btnPaddingHorizontal'   => self::clampInt( $attributes['btnPaddingHorizontal'] ?? 28, 8, 80, 28 ),
			'mobileMirror'           => ! empty( $attributes['mobileMirror'] ),
			'noProductMessage'       => $noProductMessage,
		];
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoint
	 * ------------------------------------------------------------------- */

	/**
	 * Handle the `bb_wfp_add_to_cart` AJAX request for simple products.
	 *
	 * Returns JSON: { added: true, productName } or an error.
	 */
	public function ajaxAddToCart() {
		check_ajax_referer( 'bb_wfp_add_to_cart', 'nonce' );

		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			wp_send_json_error( [ 'message' => __( 'WooCommerce is not available.', 'b-blocks' ) ] );
		}

		$productId = isset( $_POST['product_id'] ) ? absint( wp_unslash( $_POST['product_id'] ) ) : 0;
		if ( $productId < 1 ) {
			wp_send_json_error( [ 'message' => __( 'Invalid product.', 'b-blocks' ) ] );
		}

		$product = wc_get_product( $productId );
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			wp_send_json_error( [ 'message' => __( 'Product not found.', 'b-blocks' ) ] );
		}

		if ( ! $product->is_type( 'simple' ) || ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			wp_send_json_error( [ 'message' => __( 'This product cannot be added to the cart.', 'b-blocks' ) ] );
		}

		$added = WC()->cart->add_to_cart( $productId, 1 );

		if ( ! $added ) {
			wp_send_json_error( [ 'message' => __( 'Could not add the product to the cart.', 'b-blocks' ) ] );
		}

		wp_send_json_success(
			[
				'added'       => true,
				'productName' => wp_strip_all_tags( $product->get_name() ),
				'cartCount'   => WC()->cart->get_cart_contents_count(),
			]
		);
	}
}

new WooFeaturedProduct();
