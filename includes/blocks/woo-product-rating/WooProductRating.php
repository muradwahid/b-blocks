<?php
/**
 * Woo Product Rating — shared server logic.
 *
 * Resolves the product in context, reads its rating and review count, builds
 * the texts (translated; Singular or Plural Caption by count) and checks every setting before
 * render.php hands them to view.js, where Components/Frontend/Rating.js
 * renders the stars and the review link and Components/Common/Style.js writes
 * the settings into CSS. utils/data.js builds the same texts in the editor.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductRating {

	/** Stars Type. */
	const STARS_TYPES = [ 'style-1', 'style-2', 'style-3', 'style-4', 'style-5' ];

	/** Display Type. */
	const DISPLAYS = [ 'inline', 'block', 'block-reverse', 'inline-reverse' ];

	/** Alignment. */
	const ALIGNMENTS = [ 'left', 'center', 'right' ];

	/**
	 * The product this block is for: the Single Product template's or a
	 * product loop's (block context), the global one a classic template sets
	 * up, or the product page being viewed. Only one the visitor may see.
	 *
	 * @param \WP_Block|null $block Block instance.
	 * @return \WC_Product|null
	 */
	public static function resolveProduct( $block = null ) {
		if ( ! function_exists( 'wc_get_product' ) ) {
			return null;
		}

		$id = 0;
		// The postId's own type: WooCommerce's Single Product block sets postId to
		// its product but leaves postType as the page's around it.
		if ( $block instanceof \WP_Block && ! empty( $block->context['postId'] ) && 'product' === get_post_type( absint( $block->context['postId'] ) ) ) {
			$id = absint( $block->context['postId'] );
		}
		if ( ! $id && isset( $GLOBALS['product'] ) && is_a( $GLOBALS['product'], 'WC_Product' ) ) {
			$id = $GLOBALS['product']->get_id();
		}
		if ( ! $id && is_singular( 'product' ) ) {
			$id = get_queried_object_id();
		}

		$product = $id ? wc_get_product( $id ) : null;
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			return null;
		}

		$productId = $product->get_id();
		$status    = get_post_status( $productId );
		if ( 'trash' === $status || ( 'publish' !== $status && ! current_user_can( 'read_post', $productId ) ) || post_password_required( $productId ) ) {
			return null;
		}

		return $product;
	}

	/**
	 * What view.js renders the block from: the settings, checked, with the
	 * product's rating and texts. None when star ratings are off in WooCommerce,
	 * or the product has no ratings and Show Empty Rating is off.
	 *
	 * @param array       $attributes Block attributes.
	 * @param \WC_Product $product    The product (resolveProduct()).
	 * @return array|null
	 */
	public static function render( array $attributes, $product ) {
		if ( ! function_exists( 'wc_review_ratings_enabled' ) || ! wc_review_ratings_enabled() ) {
			return null;
		}

		$options = self::options( $attributes['options'] ?? null );
		$view    = self::product( $product, $options );
		if ( ! $view['hasRating'] && ! $options['showEmpty'] ) {
			return null;
		}

		$advanced = self::advanced( $attributes['advanced'] ?? null );
		// Advanced → Animation plays through AOS (bpl-tools sets data-aos): loaded only for a block that animates.
		if ( ! empty( $advanced['animation']['type'] ) ) {
			wp_enqueue_script( 'aos' );
			wp_enqueue_style( 'aos' );
		}

		return [
			'options'  => $options,
			'layout'   => self::layout( $attributes['layout'] ?? null ),
			'link'     => self::styleValues( $attributes['link'] ?? null ),
			'stars'    => self::styleValues( $attributes['stars'] ?? null ),
			'advanced' => $advanced,
			'product'  => $view,
		];
	}

	/**
	 * The rating as Rating.js shows it (utils/data.js productView() in the editor).
	 *
	 * Has ratings: get_rating_count() > 0, as WooCommerce's own rating template.
	 * The link counts get_review_count() — what WooCommerce's "(3 customer reviews)"
	 * link counts too; get_rating_count() would leave out reviews without stars.
	 * The link shows only while the product takes reviews (comments_open(), as
	 * WooCommerce's template), so it never points at a reviews section that isn't there.
	 *
	 * @param \WC_Product $product Product.
	 * @param array       $options options().
	 * @return array{ rating: float, hasRating: bool, label: string, count: array|null, emptyText: string }
	 */
	public static function product( $product, array $options ) {
		$average   = round( max( 0.0, min( 5.0, (float) $product->get_average_rating() ) ), 2 );
		$hasRating = $product->get_rating_count() > 0 && $average > 0;
		$count     = null;

		if ( $hasRating && $options['showCount'] && comments_open( $product->get_id() ) ) {
			$count = [
				'text' => self::linkText( (int) $product->get_review_count(), $options ),
				'link' => esc_url_raw( self::reviewsLink( $product ) ),
			];
		}

		return [
			'rating'    => $hasRating ? $average : 0,
			'hasRating' => $hasRating,
			'label'     => $hasRating
				/* translators: %s: average rating, e.g. 4.30. */
				? sprintf( __( 'Rated %s out of 5', 'b-blocks' ), number_format_i18n( $average, 2 ) )
				: __( 'No customer ratings', 'b-blocks' ),
			'count'     => $count,
			'emptyText' => ! $hasRating && $options['showCount'] ? trim( $options['emptyText'] ) : '',
		];
	}

	/**
	 * The review link's text: Before, count, caption, After — an empty caption adds no space.
	 *
	 * @param int   $count   Review count.
	 * @param array $options options().
	 * @return string
	 */
	public static function linkText( $count, array $options ) {
		$number  = number_format_i18n( $count );
		$caption = trim( 1 === $count ? $options['singular'] : $options['plural'] );

		return $options['before'] . $number . ( '' !== $caption ? ' ' . $caption : '' ) . $options['after'];
	}

	/**
	 * Where the review link goes: the reviews section on this page when it is
	 * the product's own page, the product page's otherwise (a product loop).
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	public static function reviewsLink( $product ) {
		if ( is_singular( 'product' ) && get_queried_object_id() === $product->get_id() ) {
			return '#reviews';
		}
		return get_permalink( $product->get_id() ) . '#reviews';
	}

	/**
	 * General settings, with the texts: the translated default until edited
	 * (unset or null), '' when emptied — as in the editor (utils/data.js).
	 *
	 * @param mixed $options The `options` attribute.
	 * @return array
	 */
	public static function options( $options ) {
		$options  = self::arr( $options );
		$defaults = [
			'singular'  => __( 'Customer Rating', 'b-blocks' ),
			'plural'    => __( 'Customer Ratings', 'b-blocks' ),
			'before'    => _x( '(', 'before the review count', 'b-blocks' ),
			'after'     => _x( ')', 'after the review count', 'b-blocks' ),
			'emptyText' => __( 'No Customer Ratings', 'b-blocks' ),
		];

		$out = [
			'showEmpty' => ! empty( $options['showEmpty'] ),
			'showCount' => false !== ( $options['showCount'] ?? true ),
		];
		foreach ( $defaults as $key => $default ) {
			$text = isset( $options[ $key ] ) && is_scalar( $options[ $key ] ) ? (string) $options[ $key ] : $default;
			$text = wp_check_invalid_utf8( $text );
			// Printed as text by React: tags dropped, spaces kept (Before/After may hold them) — wp_strip_all_tags() trims, so they go back on.
			preg_match( '/^(\s*).*?(\s*)$/s', $text, $space );
			$out[ $key ] = ( $space[1] ?? '' ) . wp_strip_all_tags( $text ) . ( $space[2] ?? '' );
		}

		return $out;
	}

	/**
	 * Stars Type, Display Type and Alignment from their lists; Count Gap per device.
	 *
	 * @param mixed $layout The `layout` attribute.
	 * @return array
	 */
	public static function layout( $layout ) {
		$layout = self::arr( $layout );
		$pick   = static function ( $value, array $allowed, $fallback ) {
			return in_array( $value, $allowed, true ) ? $value : $fallback;
		};

		return [
			'starsType' => $pick( $layout['starsType'] ?? '', self::STARS_TYPES, 'style-1' ),
			'display'   => $pick( $layout['display'] ?? '', self::DISPLAYS, 'inline' ),
			'alignment' => $pick( $layout['alignment'] ?? '', self::ALIGNMENTS, 'left' ),
			'countGap'  => self::styleValues( $layout['countGap'] ?? null ),
		];
	}

	/**
	 * Style values (colours, sizes, typography) for the block's CSS: strings
	 * without braces or angle brackets, so they can't close the #id rule or the
	 * <style> element; numbers and booleans as they are.
	 *
	 * @param mixed $value Raw value.
	 * @return array
	 */
	public static function styleValues( $value ) {
		$value = self::arr( $value );
		array_walk_recursive(
			$value,
			static function ( &$v ) {
				if ( is_string( $v ) ) {
					$v = str_replace( [ '{', '}', '<', '>' ], '', $v );
				} elseif ( ! is_int( $v ) && ! is_float( $v ) && ! is_bool( $v ) ) {
					$v = '';
				}
			}
		);
		return $value;
	}

	/**
	 * The Advanced tab (bpl-tools): style values checked as above; Custom CSS
	 * only from an author who may publish unfiltered HTML.
	 *
	 * @param mixed $advanced The `advanced` attribute.
	 * @return array
	 */
	public static function advanced( $advanced ) {
		$advanced = self::arr( $advanced );
		$css      = $advanced['css'] ?? null;
		$out      = self::styleValues( $advanced );

		$canCss     = class_exists( '\BBlocks\Inc\Sanitize' ) && \BBlocks\Inc\Sanitize::authorCanUnfilteredHtml();
		$out['css'] = $canCss && is_string( $css ) ? $css : '';

		return $out;
	}

	/** An array, or an empty one. */
	protected static function arr( $value ) {
		return is_array( $value ) ? $value : [];
	}
}
