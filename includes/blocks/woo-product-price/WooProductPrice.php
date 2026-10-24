<?php
/**
 * Woo Product Price — shared server logic.
 *
 * Resolves the product in context, gets its price as WooCommerce formats it
 * ($product->get_price_html(), so the woocommerce_get_price_html filter, tax
 * display, ranges, scheduled sales and the screen-reader text all apply), and
 * checks every setting before render.php hands them to view.js, where
 * Components/Frontend/Price.js renders the block and Components/Common/Style.js
 * writes the settings straight into CSS.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductPrice {

	/** Sale Price Position. */
	const SALE_POSITIONS = [ 'after', 'before' ];

	/** Alignment. */
	const ALIGNMENTS = [ 'left', 'center', 'right' ];

	/** Layout: inline (a row) or stacked (a column). */
	const DIRECTIONS = [ 'row', 'column' ];

	/** Currency Sign → Alignment (vertical-align). */
	const VERTICAL_ALIGNS = [ 'baseline', 'top', 'middle', 'bottom', 'super', 'sub' ];

	/* ----------------------------------------------------------------------
	 * Product: which one, its price, its savings.
	 * ------------------------------------------------------------------- */

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
		if ( ( 'publish' !== get_post_status( $productId ) && ! current_user_can( 'read_post', $productId ) ) || post_password_required( $productId ) ) {
			return null;
		}

		return $product;
	}

	/**
	 * The product's price as WooCommerce prints it, through its own filter
	 * (currency switchers, dynamic pricing). wp_kses_post() would drop <bdi>,
	 * which WooCommerce wraps every amount in: it is allowed too.
	 *
	 * @param \WC_Product $product Product.
	 * @return string Safe HTML, or '' when the product has no price.
	 */
	public static function priceHtml( $product ) {
		$allowed        = wp_kses_allowed_html( 'post' );
		$allowed['bdi'] = [];

		return trim( wp_kses( (string) $product->get_price_html(), $allowed ) );
	}

	/**
	 * What a shopper saves (Savings): the biggest saving in whole percent and
	 * in money — a variable product's best variation, a grouped product's best
	 * child — at the prices the shop displays (tax included or not). None when
	 * it is not on sale.
	 *
	 * @param \WC_Product $product Product.
	 * @return array{ percent: int, amount: string } The amount as text, in the shop's currency format.
	 */
	public static function savings( $product ) {
		$pairs = [];
		if ( $product->is_on_sale() ) {
			if ( $product instanceof \WC_Product_Variable ) {
				$prices = $product->get_variation_prices( true );
				foreach ( $prices['regular_price'] ?? [] as $id => $regular ) {
					$pairs[] = [ (float) $regular, (float) ( $prices['price'][ $id ] ?? $regular ) ];
				}
			} elseif ( $product instanceof \WC_Product_Grouped ) {
				foreach ( $product->get_children() as $id ) {
					$child = wc_get_product( $id );
					if ( $child && $child->is_on_sale() ) {
						$pairs[] = [ (float) wc_get_price_to_display( $child, [ 'price' => $child->get_regular_price() ] ), (float) wc_get_price_to_display( $child ) ];
					}
				}
			} else {
				$pairs[] = [ (float) wc_get_price_to_display( $product, [ 'price' => $product->get_regular_price() ] ), (float) wc_get_price_to_display( $product ) ];
			}
		}

		$percent = 0;
		$amount  = 0.0;
		foreach ( $pairs as [ $regular, $price ] ) {
			if ( $regular > 0 && $price < $regular ) {
				$percent = max( $percent, (int) round( ( $regular - $price ) / $regular * 100 ) );
				$amount  = max( $amount, $regular - $price );
			}
		}

		return [
			'percent' => $percent,
			'amount'  => $amount > 0 ? trim( html_entity_decode( wp_strip_all_tags( wc_price( $amount ) ), ENT_QUOTES, 'UTF-8' ) ) : '',
		];
	}

	/* ----------------------------------------------------------------------
	 * What view.js renders the block from.
	 * ------------------------------------------------------------------- */

	/**
	 * What view.js renders the block from: every setting, checked, with the
	 * product's price (WooCommerce's markup, and whether it is on sale).
	 *
	 * @param array       $attributes Block attributes.
	 * @param \WC_Product $product    The product (resolveProduct()).
	 * @return array None when the product has no price.
	 */
	public static function frontendAttributes( array $attributes, $product ) {
		$price = self::priceHtml( $product );
		if ( '' === $price ) {
			return [];
		}

		$options = self::arr( $attributes['options'] ?? null );
		$view    = self::viewAttributes( $attributes );

		$view['options']['onSaleOnly'] = ! empty( $options['onSaleOnly'] );
		$view['prefix']                = self::affix( $attributes['prefix'] ?? null, 'prefix', __( 'Limited Time Offer', 'b-blocks' ) );
		$view['suffix']                = self::affix( $attributes['suffix'] ?? null, 'suffix', __( 'Sales Ongoing', 'b-blocks' ) );
		$view['product']               = [
			'priceHtml' => $price,
			'onSale'    => $product->is_on_sale(),
		];

		$savings         = self::arr( $attributes['savings'] ?? null );
		$text            = isset( $savings['text'] ) && is_scalar( $savings['text'] ) ? (string) $savings['text'] : __( 'Save {percent}', 'b-blocks' );
		$view['savings'] = [
			'show' => ! empty( $savings['show'] ),
			// {percent} and {amount} are filled in by Price.js; printed as text by React.
			'text' => trim( wp_check_invalid_utf8( $text ) ),
		];
		if ( $view['savings']['show'] ) {
			$view['product']['savings'] = self::savings( $product );
		}

		return $view;
	}

	/**
	 * Every style setting, checked, in block.json's shape (Style.js).
	 *
	 * @param array $attributes Block attributes.
	 * @return array
	 */
	public static function viewAttributes( array $attributes ) {
		$options  = self::arr( $attributes['options'] ?? null );
		$layout   = self::arr( $attributes['layout'] ?? null );
		$currency = self::arr( $attributes['currency'] ?? null );
		$position = $options['salePosition'] ?? 'after';
		$align    = $currency['align'] ?? 'baseline';

		$price = static function ( $value ) {
			$value = self::arr( $value );
			return [
				'color'   => self::sanitizeColor( $value['color'] ?? '' ),
				'bg'      => self::background( $value['bg'] ?? null ),
				'typo'    => self::typography( $value['typo'] ?? null ),
				'padding' => self::boxes( $value['padding'] ?? null ),
				'radius'  => self::boxes( $value['radius'] ?? null ),
			];
		};
		$sign = static function ( $value ) {
			$value = self::arr( $value );
			return [
				'color' => self::sanitizeColor( $value['color'] ?? '' ),
				'size'  => self::sanitizeSize( $value['size'] ?? '' ),
			];
		};
		$affix = static function ( $value ) {
			$value = self::arr( $value );
			return [
				'color'    => self::sanitizeColor( $value['color'] ?? '' ),
				'bg'       => self::background( $value['bg'] ?? null ),
				'typo'     => self::typography( $value['typo'] ?? null ),
				'iconSize' => self::sanitizeLength( $value['iconSize'] ?? '' ),
				'padding'  => self::boxes( $value['padding'] ?? null ),
				'radius'   => self::boxes( $value['radius'] ?? null ),
			];
		};
		$strike = self::arr( self::arr( $attributes['regularPrice'] ?? null )['strike'] ?? null );

		$view = [
			'options'      => [
				'salePosition' => in_array( $position, self::SALE_POSITIONS, true ) ? $position : 'after',
				'showRegular'  => false !== ( $options['showRegular'] ?? true ),
			],
			'regularPrice' => $price( $attributes['regularPrice'] ?? null ) + [
				'strike' => [
					'color'     => self::sanitizeColor( $strike['color'] ?? '' ),
					'thickness' => self::sanitizeLength( $strike['thickness'] ?? '' ),
				],
			],
			'salePrice'    => $price( $attributes['salePrice'] ?? null ),
			'currency'     => [
				'color'   => self::sanitizeColor( $currency['color'] ?? '' ),
				'size'    => self::sanitizeSize( $currency['size'] ?? '' ),
				'align'   => in_array( $align, self::VERTICAL_ALIGNS, true ) ? $align : 'baseline',
				'regular' => $sign( $currency['regular'] ?? null ),
				'sale'    => $sign( $currency['sale'] ?? null ),
			],
			'prefixStyle'  => $affix( $attributes['prefixStyle'] ?? null ),
			'suffixStyle'  => $affix( $attributes['suffixStyle'] ?? null ),
			'savingsStyle' => $affix( $attributes['savingsStyle'] ?? null ),
			'advanced'     => self::advanced( $attributes['advanced'] ?? null ),
		];

		foreach ( [ 'desktop', 'tablet', 'mobile' ] as $device ) {
			$l         = self::arr( $layout[ $device ] ?? null );
			$alignment = $l['alignment'] ?? '';
			$direction = $l['direction'] ?? '';

			$view['layout'][ $device ] = [
				'alignment' => in_array( $alignment, self::ALIGNMENTS, true ) ? $alignment : '',
				'direction' => in_array( $direction, self::DIRECTIONS, true ) ? $direction : '',
				'gap'       => self::sanitizeLength( $l['gap'] ?? '' ),
				'priceGap'  => self::sanitizeLength( $l['priceGap'] ?? '' ),
			];
		}

		return $view;
	}

	/**
	 * The prefix or the suffix, checked: shown unless turned off, its text
	 * (the translated default until it is edited) and its icon (block.json's
	 * for a block saved without one; '' when removed in the picker), sanitized.
	 *
	 * @param mixed  $affix    The `prefix` or `suffix` attribute.
	 * @param string $which    'prefix' or 'suffix'.
	 * @param string $fallback The default text.
	 * @return array{ show: bool, type: string, text: string, icon: string }
	 */
	public static function affix( $affix, $which, $fallback ) {
		$affix = self::arr( $affix );
		$type  = 'icon' === ( $affix['type'] ?? 'text' ) ? 'icon' : 'text';
		// Unset (or null) is the default, as `??` in the editor; '' is nothing.
		$text = isset( $affix['text'] ) ? $affix['text'] : $fallback;
		$icon = isset( $affix['icon'] ) ? $affix['icon'] : self::defaultIcon( $which );

		return [
			// Hidden only when turned off, as in the editor (Price.js).
			'show' => false !== ( $affix['show'] ?? true ),
			'type' => $type,
			// Printed as text by React (view.js), as in the editor: kept as typed.
			'text' => trim( wp_check_invalid_utf8( is_scalar( $text ) ? (string) $text : '' ) ),
			'icon' => 'icon' === $type && is_string( $icon ) && class_exists( '\BBlocks\Inc\Sanitize' ) ? \BBlocks\Inc\Sanitize::svg( $icon ) : '',
		];
	}

	/**
	 * The prefix's or the suffix's default icon (block.json).
	 *
	 * @param string $which 'prefix' or 'suffix'.
	 * @return string
	 */
	protected static function defaultIcon( $which ) {
		$type = \WP_Block_Type_Registry::get_instance()->get_registered( 'b-blocks/woo-product-price' );
		return $type ? (string) ( $type->attributes[ $which ]['default']['icon'] ?? '' ) : '';
	}

	/* ----------------------------------------------------------------------
	 * Setting checks: Style.js writes the settings straight into CSS.
	 * ------------------------------------------------------------------- */

	/** An array, or an empty one. */
	protected static function arr( $value ) {
		return is_array( $value ) ? $value : [];
	}

	/**
	 * A CSS length: a number with px, em, rem, %, vw or vh, or nothing.
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public static function sanitizeLength( $value ) {
		$value = is_scalar( $value ) ? trim( (string) $value ) : '';
		return preg_match( '/^\d+(\.\d+)?(px|em|rem|%|vw|vh)?$/', $value ) ? $value : '';
	}

	/**
	 * A CSS colour: hex, rgb/hsl, var() or a keyword, or nothing.
	 *
	 * @param mixed $color Raw colour.
	 * @return string
	 */
	public static function sanitizeColor( $color ) {
		$color = is_scalar( $color ) ? trim( (string) $color ) : '';
		if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color )
			|| preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color )
			|| preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color )
			|| preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
			return $color;
		}
		return '';
	}

	/**
	 * A Background control value (bpl-tools): a solid colour, or a CSS
	 * gradient of colours, angles and positions (no url(), no other property).
	 * A background saved before it is a colour string.
	 *
	 * @param mixed $bg Raw background.
	 * @return array None for nothing to paint.
	 */
	public static function background( $bg ) {
		if ( is_string( $bg ) ) {
			$bg = [ 'type' => 'solid', 'color' => $bg ];
		}
		$bg = self::arr( $bg );

		if ( 'gradient' === ( $bg['type'] ?? 'solid' ) ) {
			$gradient = is_string( $bg['gradient'] ?? null ) ? trim( $bg['gradient'] ) : '';
			$safe     = preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\([a-zA-Z0-9#%.,()\s\-]*\)$/', $gradient ) && ! preg_match( '/url\s*\(|expression/i', $gradient );
			return $safe ? [ 'type' => 'gradient', 'gradient' => $gradient ] : [];
		}

		$color = self::sanitizeColor( $bg['color'] ?? '' );
		return '' !== $color ? [ 'type' => 'solid', 'color' => $color ] : [];
	}

	/**
	 * Currency Sign → Size: a CSS length, or '' to inherit. A size saved
	 * before Unit Control is a number of pixels (0–200).
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public static function sanitizeSize( $value ) {
		if ( is_int( $value ) || is_float( $value ) ) {
			return max( 0, min( 200, $value ) ) . 'px';
		}
		return self::sanitizeLength( $value );
	}

	/**
	 * A 4-side box (padding, radius): each side a length or empty.
	 *
	 * @param mixed $box Raw box.
	 * @return array
	 */
	public static function box( $box ) {
		$box = self::arr( $box );
		$out = [];
		foreach ( [ 'top', 'right', 'bottom', 'left' ] as $side ) {
			$out[ $side ] = self::sanitizeLength( $box[ $side ] ?? '' );
		}
		return $out;
	}

	/**
	 * A box per device (Padding, Border Radius).
	 *
	 * @param mixed $value Raw value: { desktop, tablet, mobile }.
	 * @return array
	 */
	public static function boxes( $value ) {
		$value = self::arr( $value );
		return [
			'desktop' => self::box( $value['desktop'] ?? null ),
			'tablet'  => self::box( $value['tablet'] ?? null ),
			'mobile'  => self::box( $value['mobile'] ?? null ),
		];
	}

	/**
	 * A Typography control value (bpl-tools): every part checked, as each
	 * goes into the CSS — and the font family into a Google Fonts URL too.
	 *
	 * @param mixed $typo Raw typography.
	 * @return array
	 */
	public static function typography( $typo ) {
		$typo   = self::arr( $typo );
		$family = trim( (string) ( $typo['fontFamily'] ?? '' ) );
		$sizes  = self::arr( $typo['fontSize'] ?? null );
		$pick   = static function ( $value, array $allowed ) {
			return in_array( $value, $allowed, true ) ? $value : null;
		};
		$weight  = $typo['fontWeight'] ?? null;
		$variant = (string) ( $typo['fontVariant'] ?? '' );
		$line    = $typo['lineHeight'] ?? null;

		return array_filter(
			[
				'fontFamily'     => preg_match( '/^[A-Za-z0-9 ]{1,60}$/', $family ) ? $family : null,
				'fontCategory'   => $pick( $typo['fontCategory'] ?? '', [ 'serif', 'sans-serif', 'display', 'handwriting', 'monospace' ] ),
				'fontWeight'     => is_numeric( $weight ) && (int) $weight >= 100 && (int) $weight <= 900 ? (int) $weight : null,
				'fontVariant'    => preg_match( '/^[1-9]00i?$/', $variant ) ? $variant : null,
				'isUploadFont'   => isset( $typo['isUploadFont'] ) ? ! empty( $typo['isUploadFont'] ) : null,
				'fontSize'       => [
					'desktop' => self::sanitizeLength( $sizes['desktop'] ?? '' ),
					'tablet'  => self::sanitizeLength( $sizes['tablet'] ?? '' ),
					'mobile'  => self::sanitizeLength( $sizes['mobile'] ?? '' ),
				],
				'fontStyle'      => $pick( $typo['fontStyle'] ?? '', [ 'normal', 'italic', 'oblique' ] ),
				'textTransform'  => $pick( $typo['textTransform'] ?? '', [ 'none', 'capitalize', 'uppercase', 'lowercase' ] ),
				'textDecoration' => $pick( $typo['textDecoration'] ?? '', [ 'auto', 'underline', 'overline', 'line-through', 'none' ] ),
				'lineHeight'     => is_numeric( $line ) ? (float) $line : ( self::sanitizeLength( $line ) ?: null ),
				'letterSpace'    => self::sanitizeLength( $typo['letterSpace'] ?? '' ) ?: null,
			],
			static function ( $v ) {
				return null !== $v;
			}
		);
	}

	/**
	 * The Advanced tab (bpl-tools): every string limited to CSS-safe
	 * characters; Custom CSS only from an author who may publish raw HTML.
	 *
	 * @param mixed $advanced The `advanced` attribute.
	 * @return array
	 */
	public static function advanced( $advanced ) {
		$advanced = self::arr( $advanced );

		$walk = static function ( $value, $key ) use ( &$walk ) {
			if ( is_array( $value ) ) {
				$out = [];
				foreach ( $value as $k => $v ) {
					$clean = $walk( $v, (string) $k );
					if ( null !== $clean ) {
						$out[ $k ] = $clean;
					}
				}
				return $out;
			}
			if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
				return $value;
			}
			if ( ! is_string( $value ) ) {
				return null;
			}
			if ( 'url' === $key ) {
				return esc_url_raw( $value );
			}
			$safe = preg_match( '/^[a-zA-Z0-9#%.,()\s\-+_\/:]*$/', $value ) && ! preg_match( '/url\s*\(|expression|javascript:|@import/i', $value );
			return $safe ? $value : '';
		};

		$out        = $walk( $advanced, '' );
		$canCss     = class_exists( '\BBlocks\Inc\Sanitize' ) && \BBlocks\Inc\Sanitize::authorCanUnfilteredHtml();
		$out['css'] = $canCss && is_string( $advanced['css'] ?? null ) ? $advanced['css'] : '';

		return $out;
	}
}
