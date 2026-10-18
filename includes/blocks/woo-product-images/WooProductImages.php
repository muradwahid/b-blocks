<?php
/**
 * Woo Product Images — shared server logic.
 *
 * Resolves the product in context, lists its images (featured image first,
 * then the WooCommerce gallery, each in the sizes the gallery shows it at) and
 * checks every setting before it reaches the frontend, where
 * Components/Common/Style.js writes them straight into CSS.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductImages {

	/** Where the thumbnails sit. */
	const POSITIONS = [ 'left', 'right', 'top', 'bottom' ];

	/** Display Size (object-fit). */
	const FITS = [ 'cover', 'contain', 'fill', 'scale-down', 'none' ];

	/** Slide Effect. */
	const EFFECTS = [ 'slide', 'fade', 'flip', 'cube', 'cards', 'zoom', 'parallax' ];

	/** Thumbnail Transition Easing. */
	const EASINGS = [ 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out' ];

	/** Thumbnail Ratio (width/height). */
	const RATIOS = [ '1/1', '4/3', '3/2', '16/9', '3/4', '2/3' ];

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
		if ( $block instanceof \WP_Block && 'product' === ( $block->context['postType'] ?? '' ) ) {
			$id = absint( $block->context['postId'] ?? 0 );
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
	 * The product's image ids: the featured image, then the gallery, without
	 * repeats or anything that is not an image attachment.
	 *
	 * @param \WC_Product $product Product.
	 * @return int[]
	 */
	public static function imageIds( $product ) {
		$ids = array_merge( [ (int) $product->get_image_id() ], array_map( 'intval', (array) $product->get_gallery_image_ids() ) );

		return array_values(
			array_unique(
				array_filter(
					$ids,
					static function ( $id ) {
						return $id > 0 && wp_attachment_is_image( $id );
					}
				)
			)
		);
	}

	/**
	 * One image as the gallery shows it, with only what it reads of each size:
	 * large in the main view (src, srcset, sizes, and its width and height so
	 * its space is kept), small as a thumbnail (src, srcset, sizes), full size
	 * for zoom (src).
	 *
	 * @param int    $id   Attachment id.
	 * @param string $name Product name, the alt text when the image has none.
	 * @return array
	 */
	public static function imageData( $id, $name ) {
		$src = static function ( $which ) use ( $id ) {
			$image = wp_get_attachment_image_src( $id, $which );
			return $image ? esc_url_raw( $image[0] ) : '';
		};
		$responsive = static function ( $which ) use ( $id, $src ) {
			return [
				'src'    => $src( $which ),
				'srcset' => (string) wp_get_attachment_image_srcset( $id, $which ),
				'sizes'  => (string) wp_get_attachment_image_sizes( $id, $which ),
			];
		};

		$main    = wp_get_attachment_image_src( $id, 'woocommerce_single' );
		$alt     = trim( wp_strip_all_tags( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) ) );
		$caption = trim( wp_strip_all_tags( (string) wp_get_attachment_caption( $id ) ) );

		return [
			'id'      => (int) $id,
			'alt'     => '' !== $alt ? $alt : $name,
			// The image's own caption (empty without one), for the lightbox's Show Captions.
			'caption' => $caption,
			'main'    => $responsive( 'woocommerce_single' ) + [ 'width' => $main ? (int) $main[1] : 0, 'height' => $main ? (int) $main[2] : 0 ],
			'thumb'   => $responsive( 'woocommerce_gallery_thumbnail' ),
			'full'    => [ 'src' => $src( 'full' ) ],
		];
	}

	/**
	 * Every image of the product, or WooCommerce's placeholder when it has none.
	 *
	 * @param \WC_Product $product Product.
	 * @return array
	 */
	public static function images( $product ) {
		$name = wp_strip_all_tags( $product->get_name() );
		$ids  = self::imageIds( $product );

		if ( $ids ) {
			return array_map(
				static function ( $id ) use ( $name ) {
					return self::imageData( $id, $name );
				},
				$ids
			);
		}

		return [
			[
				'id'    => 0,
				'alt'   => $name,
				'main'  => [ 'src' => esc_url_raw( wc_placeholder_img_src( 'woocommerce_single' ) ) ],
				'thumb' => [ 'src' => esc_url_raw( wc_placeholder_img_src( 'woocommerce_gallery_thumbnail' ) ) ],
				'full'  => [ 'src' => esc_url_raw( wc_placeholder_img_src( 'full' ) ) ],
			],
		];
	}

	/**
	 * The first main image as markup, for render.php to print before the
	 * script runs: the page's largest image is then found and loaded at once
	 * (not lazily) and keeps its place. view.js replaces it with the gallery.
	 *
	 * @param array $image The first of images(): its id (0 for the placeholder) and alt.
	 * @return string
	 */
	public static function firstImage( array $image ) {
		$args = [
			'alt'           => $image['alt'] ?? '',
			'loading'       => 'eager',
			'fetchpriority' => 'high',
			'decoding'      => 'async',
		];

		return ! empty( $image['id'] )
			? wp_get_attachment_image( $image['id'], 'woocommerce_single', false, $args )
			: wc_placeholder_img( 'woocommerce_single', $args );
	}

	/* ----------------------------------------------------------------------
	 * Settings, checked: Style.js writes them straight into CSS.
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
	 * A 4-side box (margin, radius): each side a length or empty.
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
	 * One border (WordPress' BorderControl: width, style, colour); unset parts left out.
	 *
	 * @param mixed $border Raw border.
	 * @return array
	 */
	public static function border( $border ) {
		$border = self::arr( $border );
		$style  = $border['style'] ?? '';

		return array_filter(
			[
				'width' => self::sanitizeLength( $border['width'] ?? '' ),
				'style' => in_array( $style, [ 'none', 'solid', 'dashed', 'dotted', 'double' ], true ) ? $style : '',
				'color' => self::sanitizeColor( $border['color'] ?? '' ),
			],
			static function ( $v ) {
				return '' !== $v;
			}
		);
	}

	/**
	 * A Background control value (bpl-tools): a solid colour, a CSS gradient,
	 * or an image with its position, size, repeat, attachment and overlay
	 * colour. Anything else is left out, so getBackgroundCSS() prints nothing.
	 *
	 * @param mixed $bg Raw background.
	 * @return array
	 */
	public static function background( $bg ) {
		$bg   = self::arr( $bg );
		$type = $bg['type'] ?? 'solid';

		if ( 'gradient' === $type ) {
			$gradient = is_string( $bg['gradient'] ?? null ) ? trim( $bg['gradient'] ) : '';
			// A gradient function of colours, angles, positions and keywords — no url(), no other property.
			$safe = preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\([a-zA-Z0-9#%.,()\s\-]*\)$/', $gradient ) && ! preg_match( '/url\s*\(|expression/i', $gradient );
			return $safe ? [ 'type' => 'gradient', 'gradient' => $gradient ] : [];
		}

		if ( 'image' === $type ) {
			$image = self::arr( $bg['image'] ?? null );
			$url   = esc_url_raw( (string) ( $image['url'] ?? '' ), [ 'http', 'https' ] );
			if ( '' === $url ) {
				return [];
			}
			$pick = static function ( $value, array $allowed ) {
				return in_array( $value, $allowed, true ) ? $value : '';
			};
			$position = (string) ( $bg['position'] ?? '' );
			return [
				'type'         => 'image',
				'image'        => [ 'id' => absint( $image['id'] ?? 0 ), 'url' => $url ],
				'position'     => preg_match( '/^(top|center|bottom|left|right)( (top|center|bottom|left|right))?$/', $position ) ? $position : 'center center',
				'attachment'   => $pick( $bg['attachment'] ?? '', [ '', 'initial', 'scroll', 'fixed', 'local' ] ),
				'repeat'       => $pick( $bg['repeat'] ?? '', [ '', 'no-repeat', 'repeat', 'repeat-x', 'repeat-y' ] ),
				'size'         => $pick( $bg['size'] ?? '', [ '', 'cover', 'auto', 'contain' ] ),
				'overlayColor' => self::sanitizeColor( $bg['overlayColor'] ?? '' ),
			];
		}

		$color = self::sanitizeColor( $bg['color'] ?? '' );
		return '' !== $color ? [ 'type' => 'solid', 'color' => $color ] : [];
	}

	/**
	 * A BorderBoxControl value: one border for every side, or one per side
	 * (top, right, bottom, left), each checked as border() does.
	 *
	 * @param mixed $border Raw border.
	 * @return array
	 */
	public static function borderBox( $border ) {
		$border = self::arr( $border );
		$sides  = [ 'top', 'right', 'bottom', 'left' ];

		if ( ! array_intersect( $sides, array_keys( $border ) ) ) {
			return self::border( $border );
		}

		// Sides with nothing set are left out, so no 0px border is written for them.
		$out = [];
		foreach ( $sides as $side ) {
			$clean = self::border( $border[ $side ] ?? null );
			if ( $clean ) {
				$out[ $side ] = $clean;
			}
		}
		return $out;
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
	 * A ShadowControl value: lengths and colour checked, at most five.
	 *
	 * @param mixed $value Raw shadows.
	 * @return array
	 */
	public static function shadows( $value ) {
		$length = static function ( $v ) {
			$v = is_scalar( $v ) ? trim( (string) $v ) : '';
			return preg_match( '/^-?\d+(\.\d+)?(px|em|rem)?$/', $v ) ? $v : '0px';
		};

		$out = [];
		foreach ( array_slice( self::arr( $value ), 0, 5 ) as $shadow ) {
			$shadow = self::arr( $shadow );
			$color  = self::sanitizeColor( $shadow['color'] ?? '' );
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
	 * A Normal or Hover state: background, border, box shadow and border radius
	 * per device — and, for a thumbnail's states, padding per device.
	 *
	 * @param mixed $state       Raw state.
	 * @param bool  $withPadding The state has Padding (the thumbnails').
	 * @return array
	 */
	public static function state( $state, $withPadding = false ) {
		$state  = self::arr( $state );
		$radius = self::arr( $state['radius'] ?? null );
		$out    = [
			'bg'     => self::background( $state['bg'] ?? null ),
			'border' => self::borderBox( $state['border'] ?? null ),
			'shadow' => self::shadows( $state['shadow'] ?? null ),
			'radius' => [
				'desktop' => self::box( $radius['desktop'] ?? null ),
				'tablet'  => self::box( $radius['tablet'] ?? null ),
				'mobile'  => self::box( $radius['mobile'] ?? null ),
			],
		];

		if ( $withPadding ) {
			$padding        = self::arr( $state['padding'] ?? null );
			$out['padding'] = [
				'desktop' => self::box( $padding['desktop'] ?? null ),
				'tablet'  => self::box( $padding['tablet'] ?? null ),
				'mobile'  => self::box( $padding['mobile'] ?? null ),
			];
		}

		return $out;
	}

	/**
	 * The Advanced tab's settings (bpl-tools), checked before generateCSS()
	 * prints them: plain CSS values only; the free-form Custom CSS only when
	 * the post's author may publish unfiltered HTML.
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

	/**
	 * The product's biggest saving, in whole percent (the Sale Badge's
	 * {discount}): a variable product's best variation, a grouped product's
	 * best child; 0 when it is not on sale.
	 *
	 * @param \WC_Product $product Product.
	 * @return int
	 */
	public static function discount( $product ) {
		if ( ! $product->is_on_sale() ) {
			return 0;
		}

		$pairs = [];
		if ( $product instanceof \WC_Product_Variable ) {
			$prices = $product->get_variation_prices( true );
			foreach ( $prices['regular_price'] ?? [] as $id => $regular ) {
				$pairs[] = [ (float) $regular, (float) ( $prices['price'][ $id ] ?? $regular ) ];
			}
		} elseif ( $product instanceof \WC_Product_Grouped ) {
			foreach ( $product->get_children() as $id ) {
				$child = wc_get_product( $id );
				if ( $child && $child->is_on_sale() ) {
					$pairs[] = [ (float) $child->get_regular_price(), (float) $child->get_price() ];
				}
			}
		} else {
			$pairs[] = [ (float) $product->get_regular_price(), (float) $product->get_price() ];
		}

		$best = 0;
		foreach ( $pairs as [ $regular, $price ] ) {
			if ( $regular > 0 && $price < $regular ) {
				$best = max( $best, (int) round( ( $regular - $price ) / $regular * 100 ) );
			}
		}
		return $best;
	}

	/**
	 * Every setting, checked, in block.json's shape.
	 *
	 * @param array $attributes Block attributes.
	 * @return array
	 */
	public static function viewAttributes( array $attributes ) {
		$layout  = self::arr( $attributes['layout'] ?? null );
		$options = self::arr( $attributes['options'] ?? null );
		$tl      = self::arr( $attributes['thumbLayout'] ?? null );
		$image   = self::arr( $attributes['image'] ?? null );
		$thumbs  = self::arr( $attributes['thumbs'] ?? null );
		$active  = self::arr( $attributes['activeThumbs'] ?? null );
		$nav     = self::arr( $attributes['nav'] ?? null );
		$mainNav = self::arr( $attributes['mainNav'] ?? null );
		$dots    = self::arr( $attributes['pagination'] ?? null );
		$badge   = self::arr( $attributes['badge'] ?? null );
		$box     = self::arr( $attributes['lightbox'] ?? null );
		$sticky  = self::arr( $attributes['sticky'] ?? null );

		$position  = $layout['position'] ?? 'bottom';
		$fit       = $image['fit'] ?? 'cover';
		$alignment = $image['alignment'] ?? 'center';
		$ratio     = $tl['ratio'] ?? '1/1';
		$opacity   = $thumbs['opacity'] ?? 0.7;
		$transition = self::arr( $thumbs['transition'] ?? null );

		$view = [
			'layout'       => [ 'position' => in_array( $position, self::POSITIONS, true ) ? $position : 'bottom' ],
			'options'      => [
				'hideArrows'       => ! empty( $options['hideArrows'] ),
				'zoom'             => ! isset( $options['zoom'] ) || ! empty( $options['zoom'] ),
				'zoomScale'        => is_numeric( $options['zoomScale'] ?? null ) ? max( 1.1, min( 5, (float) $options['zoomScale'] ) ) : 2,
				'effect'           => in_array( $options['effect'] ?? '', self::EFFECTS, true ) ? $options['effect'] : 'slide',
				'speed'            => is_numeric( $options['speed'] ?? null ) ? max( 0, min( 3000, (int) $options['speed'] ) ) : 350,
				'mainArrows'       => ! empty( $options['mainArrows'] ),
				'pagination'       => in_array( $options['pagination'] ?? '', [ 'dots', 'fraction' ], true ) ? $options['pagination'] : 'none',
				'lightbox'         => ! empty( $options['lightbox'] ),
				'saleBadge'        => ! empty( $options['saleBadge'] ),
				'autoplay'         => ! empty( $options['autoplay'] ),
				'autoplayDelay'    => is_numeric( $options['autoplayDelay'] ?? null ) ? max( 1000, min( 20000, (int) $options['autoplayDelay'] ) ) : 4000,
				'autoplayPause'    => ! isset( $options['autoplayPause'] ) || ! empty( $options['autoplayPause'] ),
				'lightboxCaptions' => ! empty( $options['lightboxCaptions'] ),
			],
			'sticky'       => [
				'enabled' => ! empty( $sticky['enabled'] ),
				'offOn'   => array_values( array_intersect( [ 'desktop', 'tablet', 'mobile' ], (array) ( $sticky['offOn'] ?? [] ) ) ),
			],
			'thumbLayout'  => [
				'view'       => 'grid' === ( $tl['view'] ?? '' ) ? 'grid' : 'slider',
				'ratio'      => in_array( $ratio, self::RATIOS, true ) ? $ratio : '1/1',
				'fit'        => 'contain' === ( $tl['fit'] ?? '' ) ? 'contain' : 'cover',
				'changeOn'   => 'hover' === ( $tl['changeOn'] ?? '' ) ? 'hover' : 'click',
				'centered'   => ! empty( $tl['centered'] ),
				'mousewheel' => ! empty( $tl['mousewheel'] ),
				'hideOn'     => array_values( array_intersect( [ 'desktop', 'tablet', 'mobile' ], (array) ( $tl['hideOn'] ?? [] ) ) ),
			],
			'image'        => [
				'adaptiveHeight' => ! empty( $image['adaptiveHeight'] ),
				'fit'            => in_array( $fit, self::FITS, true ) ? $fit : 'cover',
				'alignment'      => in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center',
				'normal'         => self::state( $image['normal'] ?? null ),
				'hover'          => self::state( $image['hover'] ?? null ),
			],
			'thumbs'       => [
				'opacity'    => is_numeric( $opacity ) ? max( 0, min( 1, (float) $opacity ) ) : 0.7,
				'transition' => [
					'duration' => is_numeric( $transition['duration'] ?? null ) ? max( 0, min( 2000, (int) $transition['duration'] ) ) : 200,
					'easing'   => in_array( $transition['easing'] ?? '', self::EASINGS, true ) ? $transition['easing'] : 'ease',
				],
				'normal'     => self::state( $thumbs['normal'] ?? null, true ),
				'hover'      => self::state( $thumbs['hover'] ?? null, true ),
			],
			'activeThumbs' => [
				'normal' => self::state( $active['normal'] ?? null, true ),
				'hover'  => self::state( $active['hover'] ?? null, true ),
			],
			'nav'          => [
				'color'      => self::sanitizeColor( $nav['color'] ?? '' ),
				'hoverColor' => self::sanitizeColor( $nav['hoverColor'] ?? '' ),
				'bg'         => self::background( $nav['bg'] ?? null ),
				'hoverBg'    => self::background( $nav['hoverBg'] ?? null ),
			],
		];

		$view['mainNav']    = [
			'color'      => self::sanitizeColor( $mainNav['color'] ?? '' ),
			'hoverColor' => self::sanitizeColor( $mainNav['hoverColor'] ?? '' ),
			'bg'         => self::background( $mainNav['bg'] ?? null ),
			'hoverBg'    => self::background( $mainNav['hoverBg'] ?? null ),
		];
		$view['pagination'] = [
			'color'       => self::sanitizeColor( $dots['color'] ?? '' ),
			'activeColor' => self::sanitizeColor( $dots['activeColor'] ?? '' ),
			'textColor'   => self::sanitizeColor( $dots['textColor'] ?? '' ),
			'textBg'      => self::sanitizeColor( $dots['textBg'] ?? '' ),
		];
		$view['badge']      = [
			// Plain text, short. React prints it as text (escaping it itself), so the
			// entities sanitize_text_field() leaves — a lone < becomes &lt; — are
			// turned back, or they would show as written.
			'text'     => mb_substr( wp_specialchars_decode( sanitize_text_field( (string) ( $badge['text'] ?? '' ) ), ENT_QUOTES ), 0, 40 ),
			'position' => 'top-right' === ( $badge['position'] ?? '' ) ? 'top-right' : 'top-left',
			'typo'     => self::typography( $badge['typo'] ?? null ),
			'color'    => self::sanitizeColor( $badge['color'] ?? '' ),
			'bg'       => self::background( $badge['bg'] ?? null ),
			'border'   => self::borderBox( $badge['border'] ?? null ),
		];
		$view['lightbox']   = [
			'overlay' => self::sanitizeColor( $box['overlay'] ?? '' ),
			'color'   => self::sanitizeColor( $box['color'] ?? '' ),
		];

		foreach ( [ 'desktop', 'tablet', 'mobile' ] as $device ) {
			$l = self::arr( $layout[ $device ] ?? null );
			$i = self::arr( $image[ $device ] ?? null );
			$n = self::arr( $nav[ $device ] ?? null );
			$t = self::arr( $tl[ $device ] ?? null );
			$c = absint( $t['columns'] ?? 0 );

			$view['layout'][ $device ] = [
				'columnGap' => self::sanitizeLength( $l['columnGap'] ?? '' ),
				'thumbGap'  => self::sanitizeLength( $l['thumbGap'] ?? '' ),
			];
			$view['image'][ $device ]  = [
				'height' => self::sanitizeLength( $i['height'] ?? '' ),
				'width'  => self::sanitizeLength( $i['width'] ?? '' ),
				'margin' => self::box( $i['margin'] ?? null ),
			];
			$view['nav'][ $device ]    = [ 'iconSize' => self::sanitizeLength( $n['iconSize'] ?? '' ) ];
			$view['thumbLayout'][ $device ] = [
				'columns' => $c >= 1 && $c <= 10 ? $c : '',
				'size'    => self::sanitizeLength( $t['size'] ?? '' ),
			];
			$m = self::arr( $mainNav[ $device ] ?? null );
			$view['mainNav'][ $device ]    = [
				'size'     => self::sanitizeLength( $m['size'] ?? '' ),
				'iconSize' => self::sanitizeLength( $m['iconSize'] ?? '' ),
				'radius'   => self::box( $m['radius'] ?? null ),
			];
			$view['pagination'][ $device ] = [ 'size' => self::sanitizeLength( self::arr( $dots[ $device ] ?? null )['size'] ?? '' ) ];
			$b                             = self::arr( $badge[ $device ] ?? null );
			$view['sticky'][ $device ]     = [ 'top' => self::sanitizeLength( self::arr( $sticky[ $device ] ?? null )['top'] ?? '' ) ];
			$view['badge'][ $device ]      = [
				'padding' => self::box( $b['padding'] ?? null ),
				'radius'  => self::box( $b['radius'] ?? null ),
			];
		}

		return $view;
	}

	/**
	 * Everything the frontend renders the block from: the checked settings,
	 * the product's images and the block's own text, translated here (view.js
	 * loads no WordPress script).
	 *
	 * @param array       $attributes Block attributes.
	 * @param \WC_Product $product    The product (resolveProduct()).
	 * @return array
	 */
	public static function frontendAttributes( array $attributes, $product ) {
		$view             = self::viewAttributes( $attributes );
		$view['advanced'] = self::advanced( $attributes['advanced'] ?? null );
		$view['product']  = [
			'id'       => $product->get_id(),
			// Only a variable product's gallery follows a variation form.
			'variable' => $product instanceof \WC_Product_Variable,
			'onSale'   => $product->is_on_sale(),
			'discount' => self::discount( $product ),
			'images'   => self::images( $product ),
		];
		$view['i18n']     = [
			'gallery'   => __( 'Product images', 'b-blocks' ),
			/* translators: 1: image number, 2: number of images. */
			'view'      => __( 'View image %1$s of %2$s', 'b-blocks' ),
			'previous'  => __( 'Previous images', 'b-blocks' ),
			'next'      => __( 'Next images', 'b-blocks' ),
			'prevImage' => __( 'Previous image', 'b-blocks' ),
			'nextImage' => __( 'Next image', 'b-blocks' ),
			'open'      => __( 'View full size', 'b-blocks' ),
			'lightbox'  => __( 'Product image viewer', 'b-blocks' ),
			'close'     => __( 'Close', 'b-blocks' ),
			'sale'      => __( 'Sale!', 'b-blocks' ),
		];

		return $view;
	}
}
