<?php
/**
 * Woo Product Reviews — shared server logic.
 *
 * Provides attribute sanitization for the read-only Woo Product Reviews block.
 * The block has NO AJAX endpoint, NO nonce and NO custom REST route — it only
 * reads approved review data with standard WordPress/WooCommerce functions
 * (wc_get_product(), get_comments(), get_comment_meta()) at render time.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductReviews {

	/**
	 * Allowed sort orders.
	 *
	 * @var string[]
	 */
	const ORDER_BY = [ 'newest', 'highest_rating', 'lowest_rating' ];

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
	 * @param mixed $value    Raw value (e.g. "15px").
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
		$nameFont    = (array) ( $attributes['nameFontSize'] ?? [] );
		$bodyFont    = (array) ( $attributes['bodyFontSize'] ?? [] );
		$metaFont    = (array) ( $attributes['metaFontSize'] ?? [] );
		$summaryFont = (array) ( $attributes['summaryRatingFontSize'] ?? [] );

		$noReviewsMessage = isset( $attributes['noReviewsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noReviewsMessage'] ) : '';
		$noReviewsMessage = '' !== trim( $noReviewsMessage ) ? $noReviewsMessage : __( 'No reviews yet.', 'b-blocks' );

		$noProductMessage = isset( $attributes['noProductMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductMessage'] ) : '';
		$noProductMessage = '' !== trim( $noProductMessage ) ? $noProductMessage : __( 'Please select a product.', 'b-blocks' );

		return [
			'productId'             => self::clampInt( $attributes['productId'] ?? 0, 0, PHP_INT_MAX, 0 ),
			'reviewCount'           => self::clampInt( $attributes['reviewCount'] ?? 5, 1, 50, 5 ),
			'orderBy'               => self::pickFrom( $attributes['orderBy'] ?? 'newest', self::ORDER_BY, 'newest' ),
			'showSummary'           => ! isset( $attributes['showSummary'] ) || (bool) $attributes['showSummary'],
			'showAvatar'            => ! isset( $attributes['showAvatar'] ) || (bool) $attributes['showAvatar'],
			'showDate'              => ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'],
			'showVerifiedBadge'     => ! isset( $attributes['showVerifiedBadge'] ) || (bool) $attributes['showVerifiedBadge'],
			'noReviewsMessage'      => $noReviewsMessage,
			'noProductMessage'      => $noProductMessage,
			'avatarSize'            => self::clampInt( $attributes['avatarSize'] ?? 48, 24, 96, 48 ),
			'ratingColor'           => self::sanitizeColor( $attributes['ratingColor'] ?? '', '#f5a623' ),
			'ratingEmptyColor'      => self::sanitizeColor( $attributes['ratingEmptyColor'] ?? '', '#d1d5db' ),
			'summaryBG'             => self::sanitizeColor( $attributes['summaryBG'] ?? '', 'transparent' ),
			'summaryTextColor'      => self::sanitizeColor( $attributes['summaryTextColor'] ?? '', 'inherit' ),
			'summaryAccentColor'    => self::sanitizeColor( $attributes['summaryAccentColor'] ?? '', '#f5a623' ),
			'reviewBG'              => self::sanitizeColor( $attributes['reviewBG'] ?? '', '#ffffff' ),
			'reviewTextColor'       => self::sanitizeColor( $attributes['reviewTextColor'] ?? '', 'inherit' ),
			'reviewNameColor'       => self::sanitizeColor( $attributes['reviewNameColor'] ?? '', 'inherit' ),
			'reviewMetaColor'       => self::sanitizeColor( $attributes['reviewMetaColor'] ?? '', '#6b7280' ),
			'cardBorderWidth'       => self::clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 8, 1 ),
			'cardBorderColor'       => self::sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e2e8f0' ),
			'cardRadius'            => self::clampInt( $attributes['cardRadius'] ?? 8, 0, 48, 8 ),
			'cardPadding'           => self::clampInt( $attributes['cardPadding'] ?? 20, 8, 64, 20 ),
			'cardGap'               => self::clampInt( $attributes['cardGap'] ?? 16, 0, 64, 16 ),
			'verifiedBadgeBG'       => self::sanitizeColor( $attributes['verifiedBadgeBG'] ?? '', '#dcfce7' ),
			'verifiedBadgeColor'    => self::sanitizeColor( $attributes['verifiedBadgeColor'] ?? '', '#16a34a' ),
			'maxWidth'              => self::clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 ),
			'blockAlign'            => self::pickFrom( $attributes['blockAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' ),
			'nameSizeDesktop'       => self::sizeInt( $nameFont['desktop'] ?? '15', 10, 40, 15 ),
			'nameSizeTablet'        => self::sizeInt( $nameFont['tablet'] ?? '14', 10, 36, 14 ),
			'nameSizeMobile'        => self::sizeInt( $nameFont['mobile'] ?? '14', 10, 32, 14 ),
			'bodySizeDesktop'       => self::sizeInt( $bodyFont['desktop'] ?? '15', 10, 40, 15 ),
			'bodySizeTablet'        => self::sizeInt( $bodyFont['tablet'] ?? '14', 10, 36, 14 ),
			'bodySizeMobile'        => self::sizeInt( $bodyFont['mobile'] ?? '14', 10, 32, 14 ),
			'metaSizeDesktop'       => self::sizeInt( $metaFont['desktop'] ?? '13', 9, 32, 13 ),
			'metaSizeTablet'        => self::sizeInt( $metaFont['tablet'] ?? '12', 9, 28, 12 ),
			'metaSizeMobile'        => self::sizeInt( $metaFont['mobile'] ?? '12', 9, 24, 12 ),
			'summarySizeDesktop'    => self::sizeInt( $summaryFont['desktop'] ?? '48', 20, 96, 48 ),
			'summarySizeTablet'     => self::sizeInt( $summaryFont['tablet'] ?? '40', 20, 88, 40 ),
			'summarySizeMobile'     => self::sizeInt( $summaryFont['mobile'] ?? '36', 18, 80, 36 ),
		];
	}
}
