<?php
/**
 * Woo Add to Cart — shared server logic.
 *
 * Provides attribute sanitization helpers, product resolution, WooCommerce's
 * native add-to-cart form for variable / grouped / external products, and a
 * hardened add-to-cart AJAX endpoint (`bBlocksWooAddToCart`) used by the
 * frontend, so adding to the cart never reloads the page.
 *
 * Security model for `bBlocksWooAddToCart`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - product_id sanitized with absint() and validated against wc_get_product().
 *   - quantity sanitized with absint() and clamped to the product's own
 *     minimum / maximum (capped at MAX_QUANTITY); sold-individually products add 1.
 *   - Simple, variable (a variation of the posted product only) and grouped
 *     (the group's own children only) products; purchasable and in stock.
 *   - Every add passes `woocommerce_add_to_cart_validation`.
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
	 * The most the block's stepper and Default Quantity allow, for a product
	 * WooCommerce sets no maximum of its own for.
	 */
	const MAX_QUANTITY = 1000;

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bBlocksWooAddToCart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_ajax_nopriv_bBlocksWooAddToCart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_loaded', [ $this, 'keepFormHandlerOut' ], 0 );

		// A fresh nonce, for a page served from a cache that has outlived the one
		// printed in it (utils/cart.js asks once, then retries).
		add_action( 'wp_ajax_bBlocksWooAddToCartNonce', [ $this, 'ajaxNonce' ] );
		add_action( 'wp_ajax_nopriv_bBlocksWooAddToCartNonce', [ $this, 'ajaxNonce' ] );
	}

	/** A fresh `bBlocksWooAddToCart` nonce. */
	public function ajaxNonce() {
		nocache_headers();
		wp_send_json_success( [ 'nonce' => wp_create_nonce( 'bBlocksWooAddToCart' ) ] );
	}

	/**
	 * WooCommerce's form handler adds whatever `add-to-cart` names on every
	 * request, admin-ajax included, before this endpoint runs (wp_loaded, 20).
	 * A request to this endpoint is added here and only here, so the field is
	 * dropped first — or the product would go in twice.
	 */
	public function keepFormHandlerOut() {
		// Only compared, never output (sanitize_key() would lowercase it); the
		// endpoint itself checks the nonce.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$action = isset( $_REQUEST['action'] ) && is_string( $_REQUEST['action'] ) ? wp_unslash( $_REQUEST['action'] ) : '';
		if ( ! wp_doing_ajax() || 'bBlocksWooAddToCart' !== $action ) {
			return;
		}
		unset( $_REQUEST['add-to-cart'], $_POST['add-to-cart'], $_GET['add-to-cart'] );
	}

	/**
	 * Sanitize a CSS color value (hex, rgb/hsl, var(), or a CSS keyword).
	 *
	 * @param mixed  $color    Raw color.
	 * @param string $fallback Fallback when invalid.
	 * @return string
	 */
	public static function sanitizeColor( $color, $fallback = '' ) {
		$color = is_scalar( $color ) ? trim( (string) $color ) : '';
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
	 * Sanitize a CSS length: a number with an optional px, em, rem, %, vw or vh.
	 *
	 * @param mixed  $value    Raw value.
	 * @param string $fallback Returned when the value is empty or invalid.
	 * @return string
	 */
	public static function sanitizeLength( $value, $fallback = '' ) {
		$value = is_scalar( $value ) ? trim( (string) $value ) : '';

		return preg_match( '/^\d+(\.\d+)?(px|em|rem|%|vw|vh)?$/', $value ) ? $value : $fallback;
	}

	/**
	 * The product this block instance is for.
	 *
	 * A product picked in the block wins — that is what the block always did,
	 * and it is what makes it usable on any page. With none picked it takes the
	 * product in context: the Single Product template or a product loop (block
	 * context), the global product a classic template sets up, or the product
	 * page being viewed.
	 *
	 * @param array          $attributes Block attributes.
	 * @param \WP_Block|null $block      Block instance.
	 * @return \WC_Product|null
	 */
	public static function resolveProduct( array $attributes, $block = null ) {
		if ( ! function_exists( 'wc_get_product' ) ) {
			return null;
		}

		$product = is_array( $attributes['product'] ?? null ) ? $attributes['product'] : [];
		$id      = absint( $product['id'] ?? 0 );

		if ( ! $id && $block instanceof \WP_Block ) {
			$contextId   = absint( $block->context['postId'] ?? 0 );
			$contextType = (string) ( $block->context['postType'] ?? '' );

			if ( $contextId && 'product' === $contextType ) {
				$id = $contextId;
			}
		}

		if ( ! $id && isset( $GLOBALS['product'] ) && is_a( $GLOBALS['product'], 'WC_Product' ) ) {
			$id = $GLOBALS['product']->get_id();
		}

		if ( ! $id && is_singular( 'product' ) ) {
			$id = get_queried_object_id();
		}

		$found = $id ? wc_get_product( $id ) : null;
		if ( ! $found || ! is_a( $found, 'WC_Product' ) ) {
			return null;
		}

		// Only a product the visitor may see: a draft, private or trashed one, or
		// one behind a password, would otherwise leak its name, prices and
		// variations into the page.
		$productId = $found->get_id();
		if ( ( 'publish' !== get_post_status( $productId ) && ! current_user_can( 'read_post', $productId ) ) || post_password_required( $productId ) ) {
			return null;
		}

		return $found;
	}

	/**
	 * Quantity limits for the block's own stepper, from WooCommerce's rules.
	 *
	 * A product without a maximum of its own is capped at MAX_QUANTITY.
	 *
	 * @param \WC_Product $product Product.
	 * @return array { min: int, max: int, step: int }
	 */
	public static function quantityLimits( $product ) {
		$min  = max( 1, (int) apply_filters( 'woocommerce_quantity_input_min', $product->get_min_purchase_quantity(), $product ) );
		$max  = (int) apply_filters( 'woocommerce_quantity_input_max', $product->get_max_purchase_quantity(), $product );
		$max  = $max > 0 ? min( $max, self::MAX_QUANTITY ) : self::MAX_QUANTITY;
		$step = max( 1, (int) apply_filters( 'woocommerce_quantity_input_step', 1, $product ) );

		return [
			'min'  => $min,
			'max'  => max( $min, $max ),
			'step' => $step,
		];
	}

	/**
	 * The label for the add-to-cart button.
	 *
	 * The block's text when there is one; otherwise WooCommerce's own. An
	 * external product's own "Button text" always wins over the block's.
	 *
	 * @param \WC_Product $product Product.
	 * @param string      $label   Block's Button Text.
	 * @return string
	 */
	public static function buttonText( $product, $label ) {
		if ( self::hasOwnText( $product ) ) {
			return trim( (string) $product->get_button_text() );
		}

		return '' !== trim( $label ) ? $label : $product->single_add_to_cart_text();
	}

	/**
	 * Whether an external product sets its own button text in WooCommerce.
	 *
	 * @param \WC_Product $product Product.
	 * @return bool
	 */
	public static function hasOwnText( $product ) {
		return $product->is_type( 'external' ) && '' !== trim( (string) $product->get_button_text() );
	}

	/**
	 * WooCommerce's own add-to-cart form for a variable, grouped or external
	 * product, so its scripts and every add-to-cart hook keep working.
	 *
	 * The global product and post are swapped for the render and restored
	 * after, and the button-text filter is added only for this call — other
	 * add-to-cart buttons on the page never see it.
	 *
	 * @param \WC_Product $product      Product.
	 * @param string      $label        Block's Button Text.
	 * @param bool        $showQuantity Whether quantities are shown.
	 * @return string
	 */
	public static function nativeForm( $product, $label, $showQuantity ) {
		if ( ! function_exists( 'woocommerce_template_single_add_to_cart' ) ) {
			return '';
		}

		global $post;
		$previousProduct = $GLOBALS['product'] ?? null;
		$previousPost    = $post;

		$productId = $product->get_id();

		// Never calls back into single_add_to_cart_text(): that runs this very
		// filter, and the recursion never ends. WooCommerce's own text is
		// already $current, so keeping it is just returning it.
		$text = static function ( $current, $item = null ) use ( $product, $label, $productId ) {
			if ( ! $item || ! is_a( $item, 'WC_Product' ) || $item->get_id() !== $productId || self::hasOwnText( $product ) ) {
				return $current;
			}
			return '' !== trim( $label ) ? $label : $current;
		};

		// Grouped children default to 0. With quantities hidden that would add
		// nothing, so each child is submitted as 1 instead.
		// The filter is only attached for this one grouped render, and only the
		// children's inputs are named quantity[<id>].
		$groupedOne = static function ( $args ) {
			if ( 0 === strpos( (string) ( $args['input_name'] ?? '' ), 'quantity[' ) ) {
				$args['input_value'] = max( 1, (int) ( $args['min_value'] ?? 0 ) );
			}
			return $args;
		};

		add_filter( 'woocommerce_product_single_add_to_cart_text', $text, 99, 2 );
		if ( ! $showQuantity && $product->is_type( 'grouped' ) ) {
			add_filter( 'woocommerce_quantity_input_args', $groupedOne, 99 );
		}

		$GLOBALS['product'] = $product; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restored below.
		$post               = get_post( $productId ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restored below.
		setup_postdata( $post );

		ob_start();
		woocommerce_template_single_add_to_cart();
		$html = (string) ob_get_clean();

		// The post first: setup_postdata() fires `the_post`, on which WooCommerce
		// resets the global product — so that is put back last.
		$post = $previousPost; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restoring.
		if ( $previousPost ) {
			setup_postdata( $previousPost );
		} else {
			wp_reset_postdata();
		}
		$GLOBALS['product'] = $previousProduct; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- restoring.

		remove_filter( 'woocommerce_product_single_add_to_cart_text', $text, 99 );
		remove_filter( 'woocommerce_quantity_input_args', $groupedOne, 99 );

		return $html;
	}

	/* ----------------------------------------------------------------------
	 * Attributes handed to the React Style component
	 * ------------------------------------------------------------------- */

	/** An array, or an empty one. */
	protected static function arr( $value ) {
		return is_array( $value ) ? $value : [];
	}

	/**
	 * A box value (padding, radius): each side a length or empty.
	 *
	 * @param mixed $box { top, right, bottom, left }.
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
	 * The Advanced tab's settings (bpl-tools), checked before generateCSS()
	 * writes them into CSS: it prints every value as it is.
	 *
	 * Every value must be a plain CSS value — lengths, colours, gradients,
	 * keywords, numbers — with no `;`, braces, quotes or `url(`; an image is a
	 * URL of its own. The free-form Custom CSS is kept only when the post's
	 * author may publish unfiltered HTML, as WordPress itself decides for
	 * markup: for anyone else it could restyle or hide the whole page.
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

		$out = $walk( $advanced, '' );

		$canCss     = class_exists( '\BBlocks\Inc\Sanitize' ) && \BBlocks\Inc\Sanitize::authorCanUnfilteredHtml();
		$out['css'] = $canCss && is_string( $advanced['css'] ?? null ) ? $advanced['css'] : '';

		return $out;
	}

	/**
	 * The button's icon: an SVG from bpl-tools' IconLibrary, put into the page
	 * as markup — so through bBlocks' SVG sanitizer, which drops anything that
	 * is not plain drawing (scripts, event handlers, remote references) — and
	 * its position, size, gap and colours.
	 *
	 * @param mixed $icon The `button.icon` attribute.
	 * @return array
	 */
	public static function buttonIcon( $icon ) {
		$icon = self::arr( $icon );
		$svg  = is_string( $icon['svg'] ?? null ) ? trim( $icon['svg'] ) : '';

		if ( '' !== $svg ) {
			$svg = class_exists( '\BBlocks\Inc\Sanitize' ) ? \BBlocks\Inc\Sanitize::svg( $svg ) : '';
		}

		return [
			'svg'      => $svg,
			'position' => 'after' === ( $icon['position'] ?? '' ) ? 'after' : 'before',
			'size'     => self::sanitizeLength( $icon['size'] ?? '' ),
			'gap'      => self::sanitizeLength( $icon['gap'] ?? '' ),
			'color'    => [ 'text' => self::sanitizeColor( self::arr( $icon['color'] ?? null )['text'] ?? '', '' ) ],
			'hover'    => [ 'color' => [ 'text' => self::sanitizeColor( self::arr( self::arr( $icon['hover'] ?? null )['color'] ?? null )['text'] ?? '', '' ) ] ],
		];
	}

	/**
	 * A bpl-tools Background object: solid, gradient or image, every part
	 * checked, since Style.js writes it straight into CSS.
	 *
	 * @param mixed $bg Background attribute.
	 * @return array
	 */
	public static function background( $bg ) {
		$bg   = self::arr( $bg );
		$type = in_array( $bg['type'] ?? '', [ 'solid', 'gradient', 'image' ], true ) ? $bg['type'] : 'solid';
		// What is unset or invalid is left out rather than emptied: bpl-tools'
		// getBackgroundCSS() fills its own defaults for a missing key only (the
		// default gradient, no-repeat), which is what the editor shows.
		$out = [ 'type' => $type ];
		$set = static function ( $key, $value ) use ( &$out ) {
			if ( '' !== $value && null !== $value ) {
				$out[ $key ] = $value;
			}
		};

		$set( 'color', self::sanitizeColor( $bg['color'] ?? '', '' ) );

		if ( 'gradient' === $type ) {
			$gradient = is_string( $bg['gradient'] ?? null ) ? trim( $bg['gradient'] ) : '';
			// A CSS gradient and nothing else: no quote, semicolon, brace or tag.
			$set( 'gradient', preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\([a-z0-9#%.,()\s-]*\)$/i', $gradient ) ? $gradient : '' );
		}

		if ( 'image' === $type ) {
			$image    = self::arr( $bg['image'] ?? null );
			$position = is_string( $bg['position'] ?? null ) ? $bg['position'] : '';
			$size     = is_string( $bg['size'] ?? null ) ? $bg['size'] : '';

			// Position, attachment, repeat and size: a "Default" picked in the
			// control is an empty value, which getBackgroundCSS() prints nothing
			// for (the browser's own: repeat, top left). Kept as empty, not left
			// out — left out, its fallbacks (no-repeat, center) would show here
			// but not in the editor.
			$keep = static function ( $key, $value ) use ( &$out, $bg, $set ) {
				if ( array_key_exists( $key, $bg ) && '' === $value ) {
					$out[ $key ] = '';
					return;
				}
				$set( $key, $value );
			};

			$out['image'] = [ 'url' => esc_url_raw( is_string( $image['url'] ?? null ) ? $image['url'] : '' ) ];
			$keep( 'position', preg_match( '/^[a-z0-9%.\s-]{1,40}$/i', $position ) ? $position : '' );
			$keep( 'attachment', in_array( $bg['attachment'] ?? '', [ 'initial', 'scroll', 'fixed', 'local' ], true ) ? $bg['attachment'] : '' );
			$keep( 'repeat', in_array( $bg['repeat'] ?? '', [ 'no-repeat', 'repeat', 'repeat-x', 'repeat-y' ], true ) ? $bg['repeat'] : '' );
			$keep( 'size', in_array( $size, [ 'cover', 'auto', 'contain' ], true ) || '' !== self::sanitizeLength( $size ) ? $size : '' );
			$set( 'overlayColor', self::sanitizeColor( $bg['overlayColor'] ?? '', '' ) );
		}

		return $out;
	}

	/**
	 * A BorderBoxControl value: one border, or one per side.
	 *
	 * @param mixed $border Border value.
	 * @return array
	 */
	public static function border( $border ) {
		$border = self::arr( $border );
		$line   = static function ( $side ) {
			$side  = self::arr( $side );
			$style = $side['style'] ?? '';
			// Unset parts are left out, not emptied: getBorderBoxCSS() defaults
			// a missing width to 0px, as in the editor; an empty one would print
			// `border: solid …`, a 3px border the editor never showed.
			return array_filter(
				[
					'width' => self::sanitizeLength( $side['width'] ?? '' ),
					'style' => in_array( $style, [ 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none' ], true ) ? $style : '',
					'color' => self::sanitizeColor( $side['color'] ?? '', '' ),
				],
				static function ( $v ) {
					return '' !== $v;
				}
			);
		};

		$sides = array_intersect_key( $border, array_flip( [ 'top', 'right', 'bottom', 'left' ] ) );
		if ( $sides ) {
			return array_map( $line, $sides );
		}

		return $border ? $line( $border ) : [];
	}

	/**
	 * A ShadowControl value, each shadow's lengths and colour checked.
	 *
	 * @param mixed $value Shadows.
	 * @return array
	 */
	public static function shadowList( $value ) {
		$length = static function ( $v ) {
			$v = is_scalar( $v ) ? trim( (string) $v ) : '';
			return preg_match( '/^-?\d+(\.\d+)?(px|em|rem)?$/', $v ) ? $v : '0px';
		};

		$out = [];
		foreach ( array_slice( self::arr( $value ), 0, 5 ) as $shadow ) {
			$shadow = self::arr( $shadow );
			$color  = self::sanitizeColor( $shadow['color'] ?? '', '' );
			if ( '' === $color ) {
				continue;
			}
			$out[] = [
				'hOffset' => $length( $shadow['hOffset'] ?? '0px' ),
				'vOffset' => $length( $shadow['vOffset'] ?? '0px' ),
				'blur'    => $length( $shadow['blur'] ?? '0px' ),
				'spreed'  => $length( $shadow['spreed'] ?? '0px' ),
				'color'   => $color,
				'isInset' => ! empty( $shadow['isInset'] ),
			];
		}
		return $out;
	}

	/**
	 * A bpl-tools Typography value, every key checked against the shape the
	 * control produces. getTypoCSS() turns this into CSS on the client.
	 *
	 * @param mixed $typo Typography value.
	 * @return array
	 */
	public static function typo( $typo ) {
		$typo  = self::arr( $typo );
		$token = static function ( $value, $pattern ) {
			$value = is_scalar( $value ) ? trim( (string) $value ) : '';
			return ( '' !== $value && strlen( $value ) <= 60 && preg_match( $pattern, $value ) ) ? $value : '';
		};
		$size  = static function ( $value ) use ( $token ) {
			return $token( $value, '/^[0-9.]+(px|em|rem|%|vh|vw)?$/' );
		};

		$fontSize = $typo['fontSize'] ?? [];
		$fontSize = is_array( $fontSize ) ? $fontSize : [ 'desktop' => $fontSize ];

		$out = [
			'fontFamily'     => $token( $typo['fontFamily'] ?? '', '/^[a-zA-Z0-9 \-]+$/' ),
			'fontCategory'   => $token( $typo['fontCategory'] ?? '', '/^[a-zA-Z\-]+$/' ),
			'fontVariant'    => $token( $typo['fontVariant'] ?? '', '/^[0-9]{3}i?$/' ),
			'fontWeight'     => $token( $typo['fontWeight'] ?? '', '/^([1-9]00|normal|bold|lighter|bolder)$/' ),
			'isUploadFont'   => ! isset( $typo['isUploadFont'] ) || (bool) $typo['isUploadFont'],
			'fontStyle'      => $token( $typo['fontStyle'] ?? '', '/^(normal|italic|oblique)$/' ),
			'textTransform'  => $token( $typo['textTransform'] ?? '', '/^(none|capitalize|uppercase|lowercase)$/' ),
			'textDecoration' => $token( $typo['textDecoration'] ?? '', '/^(none|underline|overline|line-through)$/' ),
			'lineHeight'     => $token( $typo['lineHeight'] ?? '', '/^[0-9.]+(px|em|rem|%)?$/' ),
			'letterSpace'    => $token( $typo['letterSpace'] ?? '', '/^-?[0-9.]+(px|em|rem)?$/' ),
			'fontSize'       => [
				'desktop' => $size( $fontSize['desktop'] ?? '' ),
				'tablet'  => $size( $fontSize['tablet'] ?? '' ),
				'mobile'  => $size( $fontSize['mobile'] ?? '' ),
			],
		];

		// An unset family must read as the control's own "Default".
		if ( '' === $out['fontFamily'] ) {
			$out['fontFamily'] = 'Default';
		}

		// Other unset values are left out, not emptied: getTypoCSS() fills its
		// own defaults (a family's category, sans-serif) for a missing key only.
		return array_filter(
			$out,
			static function ( $v ) {
				return '' !== $v;
			}
		);
	}

	/**
	 * The attributes the frontend Style component reads, every value checked.
	 *
	 * Style.js turns these into CSS, so anything that reaches it must already
	 * be a valid colour, length or keyword — a raw value could close the CSS
	 * declaration or rule it is written into. Same grouped shape as block.json;
	 * only the presentation groups, since that is all Style.js needs.
	 *
	 * @param array $attributes Block attributes.
	 * @return array
	 */
	public static function viewAttributes( array $attributes ) {
		$g     = static function ( $name ) use ( $attributes ) {
			return self::arr( $attributes[ $name ] ?? null );
		};
		$color = static function ( $value ) {
			return self::sanitizeColor( $value, '' );
		};
		// An element's `color` object: { text } or { text, bg }.
		$colors = static function ( $node, array $keys = [ 'text' ] ) use ( $color ) {
			$node = self::arr( self::arr( $node )['color'] ?? null );
			$out  = [];
			foreach ( $keys as $key ) {
				$out[ $key ] = $color( $node[ $key ] ?? '' );
			}
			return $out;
		};

		// A hover state of a field: text colour, background, border.
		$hoverState = static function ( $node ) use ( $colors ) {
			$node = self::arr( $node );
			return [
				'color'  => $colors( $node ),
				'bg'     => self::background( $node['bg'] ?? [] ),
				'border' => self::border( $node['border'] ?? [] ),
			];
		};

		$layout     = $g( 'layout' );
		$button     = $g( 'button' );
		$quantity   = $g( 'quantity' );
		$stepper    = $g( 'stepper' );
		$variations = $g( 'variations' );
		$grouped    = $g( 'grouped' );
		$messages   = $g( 'messages' );
		$viewCart   = $g( 'viewCart' );

		$vTable = self::arr( $variations['table'] ?? null );
		$label  = self::arr( $variations['label'] ?? null );
		$select = self::arr( $variations['select'] ?? null );
		$clear  = self::arr( $variations['clear'] ?? null );
		$vPrice = self::arr( $variations['price'] ?? null );
		$table  = self::arr( $grouped['table'] ?? null );
		$name   = self::arr( $grouped['name'] ?? null );
		$price  = self::arr( $grouped['price'] ?? null );

		$alignment = $layout['alignment'] ?? 'left';

		$view = [
			'layout'     => [
				'alignment' => in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left',
				'fullWidth' => ! empty( $layout['fullWidth'] ),
			],
			'button'     => [
				'typo'   => self::typo( $button['typo'] ?? [] ),
				'shadow' => self::shadowList( $button['shadow'] ?? [] ),
				'icon'   => self::buttonIcon( $button['icon'] ?? null ),
				'added'  => [
					'color' => $colors( $button['added'] ?? null ),
					'bg'    => self::background( self::arr( $button['added'] ?? null )['bg'] ?? [] ),
				],
			],
			'quantity'   => [
				'typo'   => self::typo( $quantity['typo'] ?? [] ),
				'color'  => $colors( $quantity ),
				'bg'     => self::background( $quantity['bg'] ?? [] ),
				'border' => self::border( $quantity['border'] ?? [] ),
				'hover'  => $hoverState( $quantity['hover'] ?? null ),
			],
			'stepper'    => [
				'color' => $colors( $stepper ),
				'bg'    => self::background( $stepper['bg'] ?? [] ),
				'hover' => [
					'color' => $colors( $stepper['hover'] ?? null ),
					'bg'    => self::background( self::arr( $stepper['hover'] ?? null )['bg'] ?? [] ),
				],
			],
			'variations' => [
				'label'  => [
					'color' => $colors( $label ),
					'typo'  => self::typo( $label['typo'] ?? [] ),
					'hover' => [ 'color' => $colors( $label['hover'] ?? null ) ],
				],
				'select' => [
					'typo'   => self::typo( $select['typo'] ?? [] ),
					'color'  => $colors( $select ),
					'bg'     => self::background( $select['bg'] ?? [] ),
					'border' => self::border( $select['border'] ?? [] ),
					'hover'  => $hoverState( $select['hover'] ?? null ),
				],
				'clear'  => [
					'typo'  => self::typo( $clear['typo'] ?? [] ),
					'color' => $colors( $clear ),
					'hover' => [ 'color' => $colors( $clear['hover'] ?? null ) ],
				],
				'price'  => [
					'color' => $colors( $vPrice ),
					'typo'  => self::typo( $vPrice['typo'] ?? [] ),
				],
			],
			'grouped'    => [
				'table' => [
					'border' => self::border( $table['border'] ?? [] ),
					'bg'     => self::background( $table['bg'] ?? [] ),
				],
				'name'  => [
					'color' => $colors( $name ),
					'typo'  => self::typo( $name['typo'] ?? [] ),
					'hover' => [ 'color' => $colors( $name['hover'] ?? null ) ],
				],
				'price' => [
					'color' => $colors( $price ),
					'typo'  => self::typo( $price['typo'] ?? [] ),
				],
			],
			'messages'   => [
				'typo'  => self::typo( $messages['typo'] ?? [] ),
				'color' => array_map( $color, array_intersect_key( self::arr( $messages['color'] ?? null ), array_flip( [ 'text', 'inStock', 'outOfStock' ] ) ) ),
			],
			'viewCart'   => [
				'typo'  => self::typo( $viewCart['typo'] ?? [] ),
				'color' => $colors( $viewCart ),
				'hover' => [ 'color' => $colors( $viewCart['hover'] ?? null ) ],
			],
		];

		foreach ( [ 'normal', 'hover' ] as $state ) {
			$node                      = self::arr( $button[ $state ] ?? null );
			$view['button'][ $state ] = [
				'color'  => $colors( $node ),
				'bg'     => self::background( $node['bg'] ?? [] ),
				'border' => self::border( $node['border'] ?? [] ),
			];
		}

		foreach ( [ 'desktop', 'tablet', 'mobile' ] as $device ) {
			$slot = self::arr( $layout[ $device ] ?? null );
			$type = $slot['displayType'] ?? '';

			$view['layout'][ $device ] = [
				'displayType' => in_array( $type, [ 'inline', 'inline-reverse', 'stacked', 'stacked-reverse' ], true ) ? $type : '',
				'gap'         => self::sanitizeLength( $slot['gap'] ?? '' ),
			];

			$view['button'][ $device ] = [
				'padding' => self::box( self::arr( $button[ $device ] ?? null )['padding'] ?? [] ),
				'radius'  => self::box( self::arr( $button[ $device ] ?? null )['radius'] ?? [] ),
				'width'   => self::sanitizeLength( self::arr( $button[ $device ] ?? null )['width'] ?? '' ),
			];

			$view['stepper'][ $device ] = [
				'width' => self::sanitizeLength( self::arr( $stepper[ $device ] ?? null )['width'] ?? '' ),
			];

			$q                           = self::arr( $quantity[ $device ] ?? null );
			$view['quantity'][ $device ] = [
				'width'  => self::sanitizeLength( $q['width'] ?? '' ),
				'height' => self::sanitizeLength( $q['height'] ?? '' ),
				'radius' => self::box( $q['radius'] ?? [] ),
			];

			$s                                       = self::arr( $select[ $device ] ?? null );
			$view['variations']['select'][ $device ] = [
				'radius'  => self::box( $s['radius'] ?? [] ),
				'padding' => self::box( $s['padding'] ?? [] ),
				'width'   => self::sanitizeLength( $s['width'] ?? '' ),
			];

			$t                                      = self::arr( $vTable[ $device ] ?? null );
			$view['variations']['table'][ $device ] = [
				'rowGap'     => self::sanitizeLength( $t['rowGap'] ?? '' ),
				'labelWidth' => self::sanitizeLength( $t['labelWidth'] ?? '' ),
				'bottomGap'  => self::sanitizeLength( $t['bottomGap'] ?? '' ),
			];

			$view['grouped']['table'][ $device ] = [
				'rowGap'  => self::sanitizeLength( self::arr( $table[ $device ] ?? null )['rowGap'] ?? '' ),
				'padding' => self::box( self::arr( $table[ $device ] ?? null )['padding'] ?? [] ),
			];
		}

		return $view;
	}

	/**
	 * Everything the frontend renders the block from, for render.php to hand to
	 * view.js as `data-attributes`.
	 *
	 * Only what the browser cannot know is resolved here — which product is in
	 * context, its type, stock and quantity rules, WooCommerce's own label, the
	 * AJAX nonce — and, for any product the block's own button does not sell,
	 * WooCommerce's form (or availability message) as HTML, since its
	 * templates and hooks only run server-side. What to show from all that is
	 * decided by Components/Frontend/AddToCart.js.
	 *
	 * Presentation settings go through viewAttributes(): Style.js writes them
	 * straight into CSS.
	 *
	 * @param array         $attributes Block attributes.
	 * @param WP_Block|null $block      Block instance, for its context.
	 * @return array|null Null when there is no product to sell.
	 */
	public static function frontendAttributes( array $attributes, $block = null ) {
		$product = self::resolveProduct( $attributes, $block );
		if ( ! $product ) {
			return null;
		}

		$content = self::arr( $attributes['content'] ?? null );
		$options = self::arr( $attributes['options'] ?? null );
		$text    = static function ( $value ) {
			return is_scalar( $value ) ? wp_strip_all_tags( (string) $value ) : '';
		};

		$limits    = self::quantityLimits( $product );
		$buttonTxt = $text( $content['buttonText'] ?? '' );
		$isSimple  = $product->is_type( 'simple' );
		$canAjax   = $isSimple && $product->is_purchasable() && $product->is_in_stock();

		$html = '';
		if ( ! $isSimple ) {
			$html = self::nativeForm( $product, $buttonTxt, ! empty( $options['showQuantity'] ) );
		} elseif ( ! $canAjax ) {
			// As WooCommerce's own template: a product that cannot be bought
			// (no price, say) shows no stock count, only that it is unavailable.
			$html = $product->is_purchasable() ? wc_get_stock_html( $product ) : '';
			if ( '' === trim( $html ) ) {
				$html = '<p class="stock out-of-stock">' . esc_html__( 'This product is currently unavailable.', 'b-blocks' ) . '</p>';
			}
			$html = wp_kses_post( $html );
		}

		$view = self::viewAttributes( $attributes );

		$view['advanced'] = self::advanced( $attributes['advanced'] ?? null );

		$view['content'] = [
			'buttonText'   => $buttonTxt,
			'addedText'    => $text( $content['addedText'] ?? '' ),
			'viewCartText' => $text( $content['viewCartText'] ?? '' ),
		];

		$view['options'] = [
			'showQuantity'   => ! empty( $options['showQuantity'] ),
			// 0 is allowed: the stepper then starts empty (AddToCart.js).
			'quantity'       => self::clampInt( $options['quantity'] ?? 1, 0, self::MAX_QUANTITY, 1 ),
			// The quantity's look (simple products): − and + buttons, or a plain box.
			'quantityStyle'  => 'input' === ( $options['quantityStyle'] ?? '' ) ? 'input' : 'stepper',
			'redirectToCart' => ! empty( $options['redirectToCart'] ),
			'viewCart'       => ! empty( $options['viewCart'] ),
		];

		$view['product'] = [
			'id'               => $product->get_id(),
			'name'             => wp_strip_all_tags( $product->get_name() ),
			'url'              => esc_url_raw( (string) $product->get_permalink() ),
			'type'             => sanitize_key( $product->get_type() ),
			'purchasable'      => $product->is_purchasable(),
			'inStock'          => $product->is_in_stock(),
			'soldIndividually' => $product->is_sold_individually(),
			'min'              => $limits['min'],
			'max'              => $limits['max'],
			'step'             => $limits['step'],
			'label'            => wp_strip_all_tags( self::buttonText( $product, '' ) ),
			'ownLabel'         => self::hasOwnText( $product ),
			'html'             => $html,
		];

		$view['cart'] = [
			'ajaxUrl' => esc_url_raw( admin_url( 'admin-ajax.php' ) ),
			'cartUrl' => function_exists( 'wc_get_cart_url' ) ? esc_url_raw( wc_get_cart_url() ) : '',
			'nonce'   => wp_create_nonce( 'bBlocksWooAddToCart' ),
		];

		// The frontend's own text, translated here: view.js loads no
		// WordPress script (no wp-i18n), so it does not translate anything.
		$view['i18n'] = [
			'addToCart'      => __( 'Add to cart', 'b-blocks' ),
			'added'          => __( 'Added!', 'b-blocks' ),
			'viewCart'       => __( 'View cart', 'b-blocks' ),
			'quantity'       => __( 'Quantity', 'b-blocks' ),
			'decrease'       => __( 'Decrease quantity', 'b-blocks' ),
			'increase'       => __( 'Increase quantity', 'b-blocks' ),
			'chooseQuantity' => __( 'Choose a quantity first.', 'b-blocks' ),
			/* translators: %s: product name. */
			'addedToCart'    => __( '%s added to cart.', 'b-blocks' ),
			'failed'         => __( 'Could not add the product to the cart.', 'b-blocks' ),
		];

		// The plan class 1.x printed on the box, kept for custom CSS that uses it.
		$view['plan'] = class_exists( '\BBlocks\Inc\Utils' ) && \BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

		return $view;
	}

	/**
	 * Handle the `bBlocksWooAddToCart` AJAX request, so adding to the cart
	 * never reloads the page.
	 *
	 * - Simple: `product_id`, `quantity`.
	 * - Variable: `product_id` (the parent), `variation_id`, `quantity` and the
	 *   form's `attribute_*` fields; WC_Cart::add_to_cart() checks the chosen
	 *   attributes against the product.
	 * - Grouped: `product_id` (the group) and `quantity[<child id>]`, as
	 *   WooCommerce's own form posts them; only the group's own children.
	 *
	 * Each add passes `woocommerce_add_to_cart_validation`, as WooCommerce's own
	 * form handler does. Returns JSON { added, productName, cartCount, cartUrl },
	 * or an error with WooCommerce's own reason.
	 */
	public function ajaxAddToCart() {
		check_ajax_referer( 'bBlocksWooAddToCart', 'nonce' );

		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			wp_send_json_error( [ 'message' => __( 'WooCommerce is not available.', 'b-blocks' ) ] );
		}

		$productId = isset( $_POST['product_id'] ) ? absint( wp_unslash( $_POST['product_id'] ) ) : 0;
		$product   = $productId ? wc_get_product( $productId ) : null;
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			wp_send_json_error( [ 'message' => __( 'Product not found.', 'b-blocks' ) ] );
		}

		// By class, so types built on these (a variable subscription, say) are
		// handled as what they are.
		if ( $product instanceof \WC_Product_Variable ) {
			$result = self::addVariation( $product );
		} elseif ( $product instanceof \WC_Product_Grouped ) {
			$result = self::addGrouped( $product );
		} elseif ( $product->is_type( 'simple' ) ) {
			$result = self::addSimple( $product );
		} else {
			$result = __( 'This product cannot be added to the cart.', 'b-blocks' );
		}

		if ( true !== $result ) {
			wp_send_json_error( [ 'message' => self::takeErrors( $result ) ] );
		}

		// As WooCommerce's own AJAX add-to-cart: analytics and pixel plugins
		// record the add on this.
		do_action( 'woocommerce_ajax_added_to_cart', $product->get_id() );

		wp_send_json_success(
			[
				'added'       => true,
				'productName' => wp_strip_all_tags( $product->get_name() ),
				'cartCount'   => WC()->cart->get_cart_contents_count(),
				'cartUrl'     => function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '',
				// Part of a grouped add can fail while the rest goes in: say so,
				// rather than leave WooCommerce's notice for the next page.
				'message'     => self::takeErrors( '' ),
				// What WooCommerce's own add-to-cart returns, for its mini cart
				// and cart fragments (`added_to_cart`).
				'fragments'   => self::cartFragments(),
				'cartHash'    => WC()->cart->get_cart_hash(),
			]
		);
	}

	/**
	 * WooCommerce's cart fragments — the mini cart and whatever else hooks in —
	 * as its own AJAX add-to-cart returns them.
	 *
	 * @return array
	 */
	protected static function cartFragments() {
		if ( ! function_exists( 'woocommerce_mini_cart' ) ) {
			return [];
		}

		ob_start();
		woocommerce_mini_cart();
		$miniCart = (string) ob_get_clean();

		return (array) apply_filters( 'woocommerce_add_to_cart_fragments', [ 'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . $miniCart . '</div>' ] );
	}

	/**
	 * A posted quantity, checked against the product's own limits: the number,
	 * or why it cannot be added. Not quietly changed — stock can drop between
	 * the page and the click, and WooCommerce's own form refuses then too.
	 *
	 * @param \WC_Product $product Product.
	 * @param mixed       $value   Posted quantity.
	 * @return int|string
	 */
	protected static function postedQuantity( $product, $value ) {
		if ( $product->is_sold_individually() ) {
			return 1;
		}

		$limits   = self::quantityLimits( $product );
		$quantity = function_exists( 'wc_stock_amount' ) ? wc_stock_amount( is_scalar( $value ) ? $value : 0 ) : (int) $value;

		if ( $quantity < $limits['min'] ) {
			/* translators: %d: smallest quantity. */
			return sprintf( __( 'Please choose a quantity of at least %d.', 'b-blocks' ), $limits['min'] );
		}
		if ( $quantity > $limits['max'] ) {
			/* translators: %d: largest quantity. */
			return sprintf( __( 'You can add at most %d of this product.', 'b-blocks' ), $limits['max'] );
		}

		return $quantity;
	}

	/**
	 * @param \WC_Product $product Simple product.
	 * @return true|string True, or why not.
	 */
	protected static function addSimple( $product ) {
		if ( ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			return __( 'This product cannot be added to the cart.', 'b-blocks' );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in ajaxAddToCart().
		$quantity = self::postedQuantity( $product, isset( $_POST['quantity'] ) ? wp_unslash( $_POST['quantity'] ) : 1 );
		if ( is_string( $quantity ) ) {
			return $quantity;
		}

		if ( ! apply_filters( 'woocommerce_add_to_cart_validation', true, $product->get_id(), $quantity ) ) {
			return __( 'Could not add the product to the cart.', 'b-blocks' );
		}

		return false !== WC()->cart->add_to_cart( $product->get_id(), $quantity ) ? true : __( 'Could not add the product to the cart.', 'b-blocks' );
	}

	/**
	 * @param \WC_Product $product Variable product (the parent).
	 * @return true|string True, or why not.
	 */
	protected static function addVariation( $product ) {
		// phpcs:disable WordPress.Security.NonceVerification.Missing -- verified in ajaxAddToCart().
		$variationId = isset( $_POST['variation_id'] ) ? absint( wp_unslash( $_POST['variation_id'] ) ) : 0;
		$variation   = $variationId ? wc_get_product( $variationId ) : null;

		// Only a variation of this very product.
		if ( ! $variation || ! $variation->is_type( 'variation' ) || $variation->get_parent_id() !== $product->get_id() ) {
			return __( 'Please choose product options before adding this product to your cart.', 'b-blocks' );
		}

		// The form's chosen attributes, as WooCommerce's own form handler reads them.
		$attributes = [];
		foreach ( wp_unslash( $_POST ) as $key => $value ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each key and value is sanitized below.
			if ( is_string( $key ) && 0 === strpos( $key, 'attribute_' ) && is_scalar( $value ) ) {
				$attributes[ sanitize_title( $key ) ] = wc_clean( (string) $value );
			}
		}

		$quantity = self::postedQuantity( $variation, isset( $_POST['quantity'] ) ? wp_unslash( $_POST['quantity'] ) : 1 );
		// phpcs:enable WordPress.Security.NonceVerification.Missing
		if ( is_string( $quantity ) ) {
			return $quantity;
		}

		if ( ! $variation->is_purchasable() || ! $variation->is_in_stock() ) {
			return __( 'This product cannot be added to the cart.', 'b-blocks' );
		}

		if ( ! apply_filters( 'woocommerce_add_to_cart_validation', true, $product->get_id(), $quantity, $variationId, $attributes ) ) {
			return __( 'Could not add the product to the cart.', 'b-blocks' );
		}

		return false !== WC()->cart->add_to_cart( $product->get_id(), $quantity, $variationId, $attributes ) ? true : __( 'Could not add the product to the cart.', 'b-blocks' );
	}

	/**
	 * @param \WC_Product $product Grouped product.
	 * @return true|string True when anything was added, or why not.
	 */
	protected static function addGrouped( $product ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- verified in ajaxAddToCart(); each id and quantity is sanitized below.
		$posted   = isset( $_POST['quantity'] ) && is_array( $_POST['quantity'] ) ? wp_unslash( $_POST['quantity'] ) : [];
		$children = array_map( 'absint', $product->get_children() );
		$added    = false;
		$chosen   = false;
		$problems = [];

		// As WooCommerce's own grouped handler: the totals once at the end, not
		// once per product.
		$cart     = WC()->cart;
		$deferred = remove_action( 'woocommerce_add_to_cart', [ $cart, 'calculate_totals' ], 20 );

		foreach ( $posted as $childId => $value ) {
			$childId = absint( $childId );
			if ( ! is_scalar( $value ) || ( function_exists( 'wc_stock_amount' ) ? wc_stock_amount( $value ) : (int) $value ) <= 0 || ! in_array( $childId, $children, true ) ) {
				continue;
			}
			$chosen = true;

			$child = wc_get_product( $childId );
			if ( ! $child || ! $child->is_purchasable() || ! $child->is_in_stock() ) {
				continue;
			}

			$quantity = self::postedQuantity( $child, $value );
			if ( is_string( $quantity ) ) {
				$problems[] = wp_strip_all_tags( $child->get_name() ) . ': ' . $quantity;
				continue;
			}
			if ( apply_filters( 'woocommerce_add_to_cart_validation', true, $childId, $quantity ) && false !== $cart->add_to_cart( $childId, $quantity ) ) {
				$added = true;
			}
		}

		if ( $deferred ) {
			add_action( 'woocommerce_add_to_cart', [ $cart, 'calculate_totals' ], 20, 0 );
			$cart->calculate_totals();
		}

		// Reported with WooCommerce's own notices (takeErrors()).
		foreach ( $problems as $problem ) {
			wc_add_notice( $problem, 'error' );
		}

		if ( $added ) {
			return true;
		}

		return $chosen
			? __( 'Could not add the products to the cart.', 'b-blocks' )
			: __( 'Please choose the quantity of items you wish to add to your cart.', 'b-blocks' );
	}

	/**
	 * WooCommerce's own reason for a failed add — it leaves it as an error
	 * notice — as plain text, removed from the notices so it does not show up
	 * again on the next page; or the fallback.
	 *
	 * @param string $fallback Message when WooCommerce left none.
	 * @return string
	 */
	protected static function takeErrors( $fallback ) {
		if ( ! function_exists( 'wc_get_notices' ) || ! function_exists( 'wc_set_notices' ) ) {
			return $fallback;
		}

		$notices = wc_get_notices();
		$errors  = $notices['error'] ?? [];
		unset( $notices['error'] );
		wc_set_notices( $notices );

		$messages = array_filter(
			array_map(
				static function ( $notice ) {
					$notice = is_array( $notice ) ? ( $notice['notice'] ?? '' ) : (string) $notice;
					// WooCommerce adds a "View cart" button link to some notices;
					// as text it would only read "… View cart".
					$notice = preg_replace( '#<a\b[^>]*>.*?</a>#is', '', $notice );
					return trim( preg_replace( '/\s+/', ' ', html_entity_decode( wp_strip_all_tags( $notice ), ENT_QUOTES, 'UTF-8' ) ) );
				},
				$errors
			)
		);

		return $messages ? implode( ' ', $messages ) : $fallback;
	}
}

new WooAddToCart();
