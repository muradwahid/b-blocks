<?php
/**
 * Woo Product Grid — shared server logic.
 *
 * The block is dynamic: this class owns attribute sanitization, the WooCommerce
 * query builder, the card/filter/pager markup and the three AJAX endpoints the
 * frontend talks to. render.php and the AJAX handlers run the *same* builder and
 * the *same* renderer, so a filtered or paged swap is byte-identical to the
 * initial server render.
 *
 * Security model:
 *   - `bb_wpg_query` is public (nopriv) and verifies a `wp_ajax` nonce;
 *     `bb_wpg_search` additionally requires `edit_posts` because it is only
 *     ever called from the editor. Adding to the cart is left to WooCommerce's
 *     own endpoint rather than a second one here.
 *   - Attributes arriving over AJAX are untrusted: every value goes back through
 *     resolveAttributes(), which clamps numbers, allowlists enums, and casts IDs
 *     with absint(). `productsPerPage` is capped at MAX_PER_PAGE either way.
 *   - Card markup is escaped at the point of output and filtered once more on the
 *     way out through allowedTags().
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

use BBlocks\Inc\GetCSS;
use BBlocks\Inc\Sanitize;
use WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductGrid {

	/** Hard ceiling on page size, applied to editor input and AJAX alike. */
	const MAX_PER_PAGE = 48;

	const LAYOUTS      = [ 'grid', 'list' ];
	const ORDERBY      = [ 'date', 'title', 'price', 'popularity', 'rating', 'menu_order', 'rand', 'id' ];
	const ORDER        = [ 'ASC', 'DESC' ];
	const QUERY_TYPES  = [ 'custom', 'related' ];
	const TAX_MODES    = [ 'include', 'exclude' ];
	const RATING_STYLE = [ 'star', 'star-count', 'number' ];
	const TITLE_TAGS   = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

	/** Where the cart / view buttons sit. */
	const ACTION_POSITIONS = [ 'overlay', 'below', 'split' ];

	/** Where they sit inside the image, when they are on it. */
	const ACTION_ALIGNS = [ 'center', 'right', 'bottom' ];

	/** Which of the two comes first. */
	const ACTION_ORDER = [ 'cart', 'view' ];

	/** Which side of the label a button's icon sits on. */
	const ICON_POSITIONS = [ 'left', 'right' ];
	const IMAGE_SIZES  = [ 'default', 'thumbnail', 'medium', 'large', 'full' ];
	const BADGE_ALIGN  = [ 'top', 'left', 'right' ];
	const BADGE_CONTENT = [ 'text', 'amount', 'percent' ];
	const MORE_TYPES   = [ 'button', 'pagination', 'prev-next' ];
	const ALIGNS       = [ 'left', 'center', 'right' ];
	const RATIOS       = [ '3/4', '1/1', '4/3', '16/9' ];
	const FITS         = [ 'cover', 'contain' ];
	const SHADOWS      = [ 'none', 'sm', 'md', 'lg' ];

	/** Card elements the Sorting Content panel reorders. */
	const ELEMENTS = [ 'price', 'rating', 'title', 'category', 'soldCount' ];

	/**
	 * Register the AJAX endpoints. Query and add-to-cart are public because the
	 * grid has to work for logged-out shoppers; search is editor-only.
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_wpg_query', [ $this, 'ajaxQuery' ] );
		add_action( 'wp_ajax_nopriv_bb_wpg_query', [ $this, 'ajaxQuery' ] );

		add_action( 'wp_ajax_bb_wpg_search', [ $this, 'ajaxSearch' ] );
	}

	const NESTED_MAP = [
		'layouts'            => [ 'layout', 'type' ],
		'titleTag'           => [ 'layout', 'titleTag' ],
		'actionPosition'     => [ 'layout', 'actionPosition' ],
		'actionAlign'        => [ 'layout', 'actionAlign' ],
		'actionFull'         => [ 'layout', 'actionFull' ],
		'actionIconOnly'     => [ 'layout', 'actionIconOnly' ],
		'actionOrder'        => [ 'layout', 'actionOrder' ],
		'imageSize'          => [ 'layout', 'imageSize' ],
		'showImage'          => [ 'elements', 'image' ],
		'showCategory'       => [ 'elements', 'category' ],
		'showRating'         => [ 'elements', 'rating' ],
		'showPrice'          => [ 'elements', 'price' ],
		'showSaleBadge'      => [ 'elements', 'saleBadge' ],
		'showSoldCount'      => [ 'elements', 'soldCount' ],
		'showProgressBar'    => [ 'elements', 'progressBar' ],
		'showViewButton'     => [ 'elements', 'viewButton' ],
		'showTitle'          => [ 'elements', 'title' ],
		'showAddToCart'      => [ 'elements', 'cart' ],
		'queryType'          => [ 'query', 'type' ],
		'orderBy'            => [ 'query', 'orderBy' ],
		'order'              => [ 'query', 'order' ],
		'productsPerPage'    => [ 'query', 'perPage' ],
		'offset'             => [ 'query', 'offset' ],
		'includeProducts'    => [ 'query', 'include' ],
		'excludeProducts'    => [ 'query', 'exclude' ],
		'categoryMode'       => [ 'query', 'categoryMode' ],
		'productCategories'  => [ 'query', 'categories' ],
		'tagMode'            => [ 'query', 'tagMode' ],
		'productTags'        => [ 'query', 'tags' ],
		'onSaleOnly'         => [ 'query', 'onSaleOnly' ],
		'featuredOnly'       => [ 'query', 'featuredOnly' ],
		'currentProductId'   => [ 'query', 'currentProductId' ],
		'noProductsMessage'  => [ 'query', 'noProductsMessage' ],
		'useCustomCartText'  => [ 'cart', 'useCustomText' ],
		'cartTextSimple'     => [ 'cart', 'simple' ],
		'cartTextVariable'   => [ 'cart', 'variable' ],
		'cartTextGrouped'    => [ 'cart', 'grouped' ],
		'cartTextExternal'   => [ 'cart', 'external' ],
		'cartTextDefault'    => [ 'cart', 'default' ],
		'btnColor'           => [ 'cart', 'normal', 'color' ],
		'btnBG'              => [ 'cart', 'normal', 'bg' ],
		'btnHovColor'        => [ 'cart', 'hover', 'color' ],
		'btnHovBG'           => [ 'cart', 'hover', 'bg' ],
		'cartShowIcon'       => [ 'cart', 'showIcon' ],
		'cartIcon'           => [ 'cart', 'icon' ],
		'cartIconColor'      => [ 'cart', 'iconColor' ],
		'cartIconPosition'   => [ 'cart', 'iconPosition' ],
		'btnTypo'            => [ 'cart', 'typo' ],
		'btnTransition'      => [ 'cart', 'transition' ],
		'btnBorder'          => [ 'cart', 'normal', 'border' ],
		'btnHovBorder'       => [ 'cart', 'hover', 'border' ],
		'viewButtonText'     => [ 'viewButton', 'text' ],
		'viewBtnColor'       => [ 'viewButton', 'normal', 'color' ],
		'viewBtnBG'          => [ 'viewButton', 'normal', 'bg' ],
		'viewBtnHovColor'    => [ 'viewButton', 'hover', 'color' ],
		'viewBtnHovBG'       => [ 'viewButton', 'hover', 'bg' ],
		'viewShowIcon'       => [ 'viewButton', 'showIcon' ],
		'viewIcon'           => [ 'viewButton', 'icon' ],
		'viewIconColor'      => [ 'viewButton', 'iconColor' ],
		'viewIconPosition'   => [ 'viewButton', 'iconPosition' ],
		'viewBtnTypo'        => [ 'viewButton', 'typo' ],
		'viewBtnTransition'  => [ 'viewButton', 'transition' ],
		'viewBtnBorder'      => [ 'viewButton', 'normal', 'border' ],
		'viewBtnHovBorder'   => [ 'viewButton', 'hover', 'border' ],
		'badgeAlign'         => [ 'badge', 'align' ],
		'saleBadgeLabel'     => [ 'badge', 'text' ],
		'badgeContent'       => [ 'badge', 'content' ],
		'badgeBG'            => [ 'badge', 'bg' ],
		'badgeTextColor'     => [ 'badge', 'color' ],
		'badgeTypo'          => [ 'badge', 'typo' ],
		'enableLoadMore'     => [ 'pager', 'enable' ],
		'morePostsType'      => [ 'pager', 'type' ],
		'loadMoreText'       => [ 'pager', 'text' ],
		'loadMoreAlign'      => [ 'pager', 'align' ],
		'pagerColor'         => [ 'pager', 'normal', 'color' ],
		'pagerBG'            => [ 'pager', 'normal', 'bg' ],
		'pagerHovColor'      => [ 'pager', 'hover', 'color' ],
		'pagerHovBG'         => [ 'pager', 'hover', 'bg' ],
		'pagerActiveColor'   => [ 'pager', 'active', 'color' ],
		'pagerActiveBG'      => [ 'pager', 'active', 'bg' ],
		'pagerTypo'          => [ 'pager', 'typo' ],
		'pagerTransition'    => [ 'pager', 'transition' ],
		'pagerBorder'        => [ 'pager', 'normal', 'border' ],
		'pagerHovBorder'     => [ 'pager', 'hover', 'border' ],
		'pagerActiveBorder'  => [ 'pager', 'active', 'border' ],
		'showTaxonomyFilter' => [ 'filter', 'enable' ],
		'filterTaxonomy'     => [ 'filter', 'taxonomy' ],
		'filterAllText'      => [ 'filter', 'allText' ],
		'filterAlign'        => [ 'filter', 'align' ],
		'filterColor'        => [ 'filter', 'normal', 'color' ],
		'filterBG'           => [ 'filter', 'normal', 'bg' ],
		'filterActiveColor'  => [ 'filter', 'hover', 'color' ],
		'filterActiveBG'     => [ 'filter', 'hover', 'bg' ],
		'filterTypo'         => [ 'filter', 'typo' ],
		'filterTransition'   => [ 'filter', 'transition' ],
		'filterBorder'       => [ 'filter', 'normal', 'border' ],
		'filterHovBorder'    => [ 'filter', 'hover', 'border' ],
		'cardBodyBG'         => [ 'card', 'bodyBg' ],
		'cardDivider'        => [ 'card', 'divider' ],
		'cardBG'             => [ 'card', 'normal', 'bg' ],
		'cardTransition'     => [ 'card', 'transition' ],
		'cardBorder'         => [ 'card', 'normal', 'border' ],
		'cardShadow'         => [ 'card', 'normal', 'shadow' ],
		'cardHovBG'          => [ 'card', 'hover', 'bg' ],
		'cardHovBorder'      => [ 'card', 'hover', 'border' ],
		'cardHovShadow'      => [ 'card', 'hover', 'shadow' ],
		'imageRatio'         => [ 'media', 'ratio' ],
		'imageFit'           => [ 'media', 'fit' ],
		'imageBG'            => [ 'media', 'bg' ],
		'overlayBG'          => [ 'media', 'overlay' ],
		'titleTypo'          => [ 'title', 'typo' ],
		'titleTransition'    => [ 'title', 'transition' ],
		'titleColor'         => [ 'title', 'normal', 'color' ],
		'titleHovColor'      => [ 'title', 'hover', 'color' ],
		'priceTypo'          => [ 'price', 'typo' ],
		'priceColor'         => [ 'price', 'color' ],
		'regularPriceColor'  => [ 'price', 'regularColor' ],
		'ratingStyle'        => [ 'rating', 'style' ],
		'ratingShowEmpty'    => [ 'rating', 'showEmpty' ],
		'ratingColor'        => [ 'rating', 'color' ],
		'ratingEmptyColor'   => [ 'rating', 'emptyColor' ],
		'ratingCountColor'   => [ 'rating', 'countColor' ],
		'ratingSize'         => [ 'rating', 'size' ],
		'categoryTypo'       => [ 'category', 'typo' ],
		'categoryTransition' => [ 'category', 'transition' ],
		'categoryColor'      => [ 'category', 'normal', 'color' ],
		'categoryHovColor'   => [ 'category', 'hover', 'color' ],
		'soldPrefix'         => [ 'sold', 'prefix' ],
		'soldSuffix'         => [ 'sold', 'suffix' ],
		'withoutStockValue'  => [ 'sold', 'withoutStock' ],
		'soldTypo'           => [ 'sold', 'typo' ],
		'soldColor'          => [ 'sold', 'color' ],
		'soldBG'             => [ 'sold', 'bg' ],
		'progressTrackColor' => [ 'sold', 'progress', 'trackColor' ],
		'progressFillColor'  => [ 'sold', 'progress', 'fillColor' ],
		'progressHeight'     => [ 'sold', 'progress', 'height' ],
	];

	/**
	 * Values set per breakpoint, stored device-first:
	 *
	 *     layout: { desktop: { columnGap: '20px' }, tablet: { … }, mobile: { … } }
	 *
	 * flat => [ the container holding the device keys, the prop inside each,
	 * 'box' for a BoxControl value or 'scalar' for a plain one ].
	 *
	 * flatten() turns each into { desktop, tablet, mobile } under its flat key,
	 * which is the shape resolveAttributes has always read, so nothing downstream
	 * of it needed to change. viewAttributes writes them back device-first.
	 */
	const DEVICE_MAP = [
		'columns'            => [ [ 'layout' ], 'columns', 'scalar' ],
		'contentAlign'       => [ [ 'layout' ], 'contentAlign', 'scalar' ],
		'columnGap'          => [ [ 'layout' ], 'columnGap', 'scalar' ],
		'rowGap'             => [ [ 'layout' ], 'rowGap', 'scalar' ],
		'cartIconSize'       => [ [ 'cart' ], 'iconSize', 'scalar' ],
		'btnPadding'         => [ [ 'cart', 'normal' ], 'padding', 'box' ],
		'btnMargin'          => [ [ 'cart', 'normal' ], 'margin', 'box' ],
		'btnRadius'          => [ [ 'cart', 'normal' ], 'radius', 'box' ],
		'btnHovPadding'      => [ [ 'cart', 'hover' ], 'padding', 'box' ],
		'btnHovMargin'       => [ [ 'cart', 'hover' ], 'margin', 'box' ],
		'btnHovRadius'       => [ [ 'cart', 'hover' ], 'radius', 'box' ],
		'viewIconSize'       => [ [ 'viewButton' ], 'iconSize', 'scalar' ],
		'viewBtnPadding'     => [ [ 'viewButton', 'normal' ], 'padding', 'box' ],
		'viewBtnMargin'      => [ [ 'viewButton', 'normal' ], 'margin', 'box' ],
		'viewBtnRadius'      => [ [ 'viewButton', 'normal' ], 'radius', 'box' ],
		'viewBtnHovPadding'  => [ [ 'viewButton', 'hover' ], 'padding', 'box' ],
		'viewBtnHovMargin'   => [ [ 'viewButton', 'hover' ], 'margin', 'box' ],
		'viewBtnHovRadius'   => [ [ 'viewButton', 'hover' ], 'radius', 'box' ],
		'badgeRadius'        => [ [ 'badge' ], 'radius', 'box' ],
		'badgePadding'       => [ [ 'badge' ], 'padding', 'box' ],
		'badgeOffset'        => [ [ 'badge' ], 'offset', 'scalar' ],
		'pagerPadding'       => [ [ 'pager', 'normal' ], 'padding', 'box' ],
		'pagerRadius'        => [ [ 'pager', 'normal' ], 'radius', 'box' ],
		'pagerHovPadding'    => [ [ 'pager', 'hover' ], 'padding', 'box' ],
		'pagerHovRadius'     => [ [ 'pager', 'hover' ], 'radius', 'box' ],
		'pagerActivePadding' => [ [ 'pager', 'active' ], 'padding', 'box' ],
		'pagerActiveRadius'  => [ [ 'pager', 'active' ], 'radius', 'box' ],
		'filterPadding'      => [ [ 'filter', 'normal' ], 'padding', 'box' ],
		'filterRadius'       => [ [ 'filter', 'normal' ], 'radius', 'box' ],
		'filterHovPadding'   => [ [ 'filter', 'hover' ], 'padding', 'box' ],
		'filterHovRadius'    => [ [ 'filter', 'hover' ], 'radius', 'box' ],
		'cardBodyMargin'     => [ [ 'card' ], 'bodyMargin', 'box' ],
		'cardPadding'        => [ [ 'card', 'normal' ], 'padding', 'box' ],
		'cardRadius'         => [ [ 'card', 'normal' ], 'radius', 'box' ],
		'cardHovPadding'     => [ [ 'card', 'hover' ], 'padding', 'box' ],
		'cardHovRadius'      => [ [ 'card', 'hover' ], 'radius', 'box' ],
		'imageRadius'        => [ [ 'media' ], 'radius', 'box' ],
		'imageMargin'        => [ [ 'media' ], 'margin', 'box' ],
		'progressRadius'     => [ [ 'sold', 'progress' ], 'radius', 'box' ],
	];

	/**
	 * Read a nested attribute set back into the flat keys this class works in.
	 *
	 * Attributes are grouped by concern in block.json (the bBlocks convention,
	 * see image-hotspot), but the query builder, renderer and CSS all read flat
	 * keys. Converting once on the way in keeps that single translation point.
	 *
	 * @param array $attributes Nested block attributes.
	 * @return array Flat attributes.
	 */
	public static function flatten( array $attributes ) {
		foreach ( self::NESTED_MAP as $flat => $path ) {
			$node = $attributes;

			foreach ( $path as $segment ) {
				if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
					$node = null;
					break;
				}
				$node = $node[ $segment ];
			}

			if ( null !== $node ) {
				$attributes[ $flat ] = $node;
			}
		}

		foreach ( self::DEVICE_MAP as $flat => $spec ) {
			$value = self::deviceValue( $attributes, $spec[0], $spec[1] );

			if ( null !== $value ) {
				$attributes[ $flat ] = $value;
			}
		}

		return $attributes;
	}

	/**
	 * Gather one per-device prop into { desktop, tablet, mobile }.
	 *
	 * Read device-first — `container.desktop.prop` — and, for any breakpoint that
	 * has no value there, from the shapes a post may still hold from before:
	 * prop-first `container.prop.desktop`, or a single value in `container.prop`
	 * that applied to every screen and is taken as desktop. Each breakpoint falls
	 * back on its own, so a post edited half in the new shape still reads whole.
	 *
	 * @param array    $attributes Raw block attributes.
	 * @param string[] $container  Path to the object holding the device keys.
	 * @param string   $prop       The prop inside each device.
	 * @return array|null Per-device values, or null when nothing is set at all.
	 */
	protected static function deviceValue( array $attributes, array $container, $prop ) {
		$node = $attributes;

		foreach ( $container as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				return null;
			}
			$node = $node[ $segment ];
		}

		if ( ! is_array( $node ) ) {
			return null;
		}

		$legacy   = $node[ $prop ] ?? null;
		$byDevice = is_array( $legacy ) && ( isset( $legacy['desktop'] ) || isset( $legacy['tablet'] ) || isset( $legacy['mobile'] ) );

		$out = [];
		$any = false;

		foreach ( [ 'desktop', 'tablet', 'mobile' ] as $device ) {
			if ( is_array( $node[ $device ] ?? null ) && array_key_exists( $prop, $node[ $device ] ) ) {
				$out[ $device ] = $node[ $device ][ $prop ];
			} elseif ( $byDevice ) {
				$out[ $device ] = $legacy[ $device ] ?? null;
			} else {
				$out[ $device ] = 'desktop' === $device ? $legacy : null;
			}

			$any = $any || null !== $out[ $device ];
		}

		return $any ? $out : null;
	}

	/**
	 * Write a value into a nested array, creating the intermediate levels.
	 *
	 * @param array $target Array to write into, by reference.
	 * @param array $path   Path segments.
	 * @param mixed $value  Value to set.
	 */
	protected static function setPath( array &$target, array $path, $value ) {
		$node = &$target;

		foreach ( $path as $segment ) {
			if ( ! isset( $node[ $segment ] ) || ! is_array( $node[ $segment ] ) ) {
				$node[ $segment ] = [];
			}
			$node = &$node[ $segment ];
		}

		$node = $value;
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
		// Scalars only: a malformed post, or a crafted request to the public
		// query endpoint, can put an array here, and casting one to a string
		// raises a PHP warning on every render.
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

		return (int) min( $max, max( $min, (int) $value ) );
	}

	/**
	 * Clamp a fractional number, for values a RangeControl stores with a step
	 * below 1 — transition durations in seconds, in this block's case.
	 *
	 * Rounded so a crafted payload cannot push a long decimal into the CSS.
	 *
	 * @param mixed $value    Raw value.
	 * @param float $min      Lower bound.
	 * @param float $max      Upper bound.
	 * @param float $fallback Value for anything non-numeric.
	 * @return float
	 */
	public static function clampFloat( $value, $min, $max, $fallback ) {
		if ( ! is_numeric( $value ) ) {
			return (float) $fallback;
		}

		return round( min( $max, max( $min, (float) $value ) ), 2 );
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
	 * Sanitize an array of positive integer IDs.
	 *
	 * @param mixed $value Raw array.
	 * @return int[]
	 */
	public static function intArray( $value ) {
		if ( ! is_array( $value ) ) {
			return [];
		}

		$out = [];
		foreach ( $value as $item ) {
			if ( ! is_scalar( $item ) ) {
				continue;
			}

			// Cast rather than absint(): a negative id posted over AJAX should be
			// dropped, not flipped into a different, valid product.
			$id = (int) $item;

			if ( $id > 0 ) {
				$out[] = $id;
			}
		}

		return array_values( array_unique( $out ) );
	}

	/**
	 * Plain single-line text with a guaranteed fallback.
	 *
	 * @param mixed  $value    Raw value.
	 * @param string $fallback Used when the value is missing or blank.
	 * @return string
	 */
	public static function text( $value, $fallback = '' ) {
		$value = is_scalar( $value ) ? wp_strip_all_tags( (string) $value ) : '';

		return '' !== trim( $value ) ? $value : $fallback;
	}

	/**
	 * Text that is allowed to be empty (a deliberately blank prefix/suffix).
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public static function optionalText( $value ) {
		return is_scalar( $value ) ? wp_strip_all_tags( (string) $value ) : '';
	}

	/**
	 * A boolean attribute that defaults to true when the key is absent.
	 *
	 * @param array  $attributes Raw attributes.
	 * @param string $key        Attribute name.
	 * @return bool
	 */
	protected static function boolOn( array $attributes, $key ) {
		return ! isset( $attributes[ $key ] ) || (bool) $attributes[ $key ];
	}

	/**
	 * Sanitize an icon from the library.
	 *
	 * IconLibrary stores the icon as SVG markup, not a class, and React renders
	 * it with dangerouslySetInnerHTML — so it goes through the plugin's SVG
	 * sanitizer, which strips scripts, event handlers and remote references.
	 * Anything that is not an SVG is dropped rather than passed along.
	 *
	 * @param mixed $value Raw markup from the picker.
	 * @return string
	 */
	public static function iconMarkup( $value ) {
		$value = is_string( $value ) ? trim( $value ) : '';

		if ( '' === $value || false === stripos( $value, '<svg' ) ) {
			return '';
		}

		return (string) Sanitize::markup( $value );
	}

	/** Background types the Background control can produce. */
	const BG_TYPES = [ 'solid', 'color', 'gradient', 'image' ];

	/** Units the gap controls offer. */
	const CSS_UNITS = [ 'px', 'em', 'rem', '%', 'vh', 'vw' ];

	/**
	 * Sanitize a CSS length such as `20px`, `1.5rem` or `5%`.
	 *
	 * A bare number is accepted and read as pixels — attributes come back
	 * through AJAX, so a unitless value has to land somewhere defined.
	 *
	 * @param mixed  $value    Raw value.
	 * @param string $fallback Fallback length.
	 * @return string
	 */
	public static function cssLength( $value, $fallback = '0px' ) {
		if ( is_int( $value ) || is_float( $value ) ) {
			return $value . 'px';
		}

		$value = is_string( $value ) ? trim( $value ) : '';

		if ( '' === $value ) {
			return $fallback;
		}

		if ( preg_match( '/^-?\d+(\.\d+)?$/', $value ) ) {
			return $value . 'px';
		}

		$units = implode( '|', self::CSS_UNITS );

		return preg_match( '/^-?\d+(\.\d+)?(' . $units . ')$/', $value ) ? $value : $fallback;
	}

	/**
	 * Sanitize a bpl-tools BoxControl value into a CSS shorthand.
	 *
	 * The control stores { top, right, bottom, left }. A bare number is accepted
	 * and applied to all four corners, for the same reason cssLength() takes one.
	 *
	 * @param mixed  $box      Raw box value.
	 * @param string $fallback Fallback shorthand.
	 * @return string
	 */
	public static function boxCSS( $box, $fallback = '0px' ) {
		if ( is_int( $box ) || is_float( $box ) || ( is_string( $box ) && preg_match( '/^-?\d+(\.\d+)?$/', (string) $box ) ) ) {
			return $box . 'px';
		}

		if ( is_string( $box ) ) {
			return self::cssLength( $box, $fallback );
		}

		if ( ! is_array( $box ) ) {
			return $fallback;
		}

		$sides = [];
		foreach ( [ 'top', 'right', 'bottom', 'left' ] as $side ) {
			$sides[] = self::cssLength( $box[ $side ] ?? '', '0px' );
		}

		// All four empty means the author cleared it; fall back rather than
		// emitting a meaningless `0px 0px 0px 0px`.
		return implode( ' ', $sides ) === '0px 0px 0px 0px' && empty( array_filter( (array) $box ) ) ? $fallback : implode( ' ', $sides );
	}

	/** Border styles BorderBoxControl can produce. */
	const BORDER_STYLES = [ 'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset' ];

	/**
	 * Sanitize one side of a border: { width, style, color }.
	 *
	 * @param mixed $side Raw side.
	 * @return array|null Cleaned side, or null when nothing usable is set.
	 */
	protected static function borderSide( $side ) {
		if ( ! is_array( $side ) ) {
			return null;
		}

		$width = self::cssLength( $side['width'] ?? '', '' );
		$color = self::sanitizeColor( $side['color'] ?? '', '' );
		$style = self::pickFrom( $side['style'] ?? 'solid', self::BORDER_STYLES, 'solid' );

		if ( '' === $width && '' === $color ) {
			return null;
		}

		return [
			'width' => '' === $width ? '0px' : $width,
			'style' => $style,
			'color' => $color,
		];
	}

	/**
	 * Sanitize a BorderBoxControl value.
	 *
	 * The control emits either one border — { width, style, color } — or a split
	 * one keyed by side.
	 *
	 * @param mixed $border Raw BorderBoxControl value.
	 * @return array
	 */
	public static function borderBox( $border ) {
		if ( ! is_array( $border ) || empty( $border ) ) {
			return [];
		}

		$sides = [ 'top', 'right', 'bottom', 'left' ];
		$split = (bool) array_intersect( $sides, array_keys( $border ) );

		if ( ! $split ) {
			$side = self::borderSide( $border );

			return $side ? $side : [];
		}

		$clean = [];
		foreach ( $sides as $side ) {
			$value = self::borderSide( $border[ $side ] ?? null );
			if ( $value ) {
				$clean[ $side ] = $value;
			}
		}

		return $clean;
	}

	/**
	 * Turn a `top right bottom left` shorthand back into its four sides.
	 *
	 * resolveAttributes() flattens boxes to a shorthand for CSS; React needs the
	 * object shape BoxControl reads.
	 *
	 * @param string $shorthand Result of boxCSS().
	 * @return array
	 */
	public static function boxSides( $shorthand ) {
		$sides = [ 'top', 'right', 'bottom', 'left' ];
		$parts = preg_split( '/\s+/', trim( (string) $shorthand ) );

		// Spell the sides out even when unset, so the JSON stays an object and
		// BoxControl gets the shape it expects — the same form article-card uses.
		if ( 4 !== count( $parts ) || '' === $parts[0] ) {
			return array_fill_keys( $sides, '' );
		}

		return array_combine( $sides, $parts );
	}

	/**
	 * Render a sanitized border box as CSS declarations.
	 *
	 * @param array $border Result of borderBox().
	 * @return string
	 */
	public static function borderBoxCSS( $border ) {
		if ( ! is_array( $border ) || empty( $border ) ) {
			return '';
		}

		$declaration = static function ( $side ) {
			return $side['width'] . ' ' . $side['style'] . ' ' . $side['color'];
		};

		if ( isset( $border['width'] ) ) {
			return 'border:' . $declaration( $border ) . ';';
		}

		$css = '';
		foreach ( [ 'top', 'right', 'bottom', 'left' ] as $side ) {
			if ( isset( $border[ $side ] ) ) {
				$css .= 'border-' . $side . ':' . $declaration( $border[ $side ] ) . ';';
			}
		}

		return $css;
	}

	/** Upper bound on stacked shadows, so a crafted payload cannot balloon the CSS. */
	const MAX_SHADOWS = 10;

	/**
	 * Sanitize a bpl-tools ShadowControl value.
	 *
	 * The control stores a list of { hOffset, vOffset, blur, spreed, color,
	 * isInset }.
	 *
	 * @param mixed $value Raw shadow value.
	 * @return array
	 */
	public static function shadows( $value ) {
		if ( ! is_array( $value ) ) {
			return [];
		}

		$out = [];

		foreach ( array_slice( $value, 0, self::MAX_SHADOWS ) as $shadow ) {
			if ( ! is_array( $shadow ) ) {
				continue;
			}

			$out[] = [
				'hOffset' => self::cssLength( $shadow['hOffset'] ?? '', '0px' ),
				'vOffset' => self::cssLength( $shadow['vOffset'] ?? '', '0px' ),
				'blur'    => self::cssLength( $shadow['blur'] ?? '', '0px' ),
				'spreed'  => self::cssLength( $shadow['spreed'] ?? '', '0px' ),
				'color'   => self::sanitizeColor( $shadow['color'] ?? '', '#7090b0' ),
				'isInset' => ! empty( $shadow['isInset'] ),
			];
		}

		return $out;
	}

	/**
	 * Render sanitized shadows as a box-shadow value.
	 *
	 * @param array $shadows Result of shadows().
	 * @return string
	 */
	public static function shadowCSS( $shadows ) {
		if ( ! is_array( $shadows ) || empty( $shadows ) ) {
			return 'none';
		}

		$parts = [];

		foreach ( $shadows as $shadow ) {
			$parts[] = trim(
				$shadow['hOffset'] . ' ' . $shadow['vOffset'] . ' ' . $shadow['blur'] . ' ' .
				$shadow['spreed'] . ' ' . $shadow['color'] . ( $shadow['isInset'] ? ' inset' : '' )
			);
		}

		return implode( ', ', $parts );
	}

	/**
	 * Sanitize a bpl-tools Background object.
	 *
	 * The control stores { type, color, gradient, image, position, … }.
	 *
	 * @param mixed  $bg       Raw background value.
	 * @param string $fallback Fallback colour.
	 * @return array
	 */
	public static function background( $bg, $fallback = '' ) {
		if ( ! is_array( $bg ) ) {
			return [ 'type' => 'solid', 'color' => $fallback ];
		}

		$type = self::pickFrom( $bg['type'] ?? 'solid', self::BG_TYPES, 'solid' );

		$clean = [
			'type'  => $type,
			'color' => self::sanitizeColor( $bg['color'] ?? '', $fallback ),
		];

		if ( 'gradient' === $type ) {
			$gradient = is_string( $bg['gradient'] ?? null ) ? trim( $bg['gradient'] ) : '';

			// Only the gradient functions, and only the characters they need —
			// this lands in a CSS declaration.
			$clean['gradient'] = preg_match( '/^(linear|radial|conic)-gradient\([a-zA-Z0-9\s,%.#()\-]+\)$/', $gradient )
				? $gradient
				: '';
		}

		if ( 'image' === $type ) {
			$image = is_array( $bg['image'] ?? null ) ? $bg['image'] : [];

			$clean['image']        = [
				'id'  => absint( $image['id'] ?? 0 ),
				'url' => esc_url_raw( $image['url'] ?? '' ),
			];
			$clean['position']     = self::cssToken( $bg['position'] ?? '' );
			$clean['attachment']   = self::cssToken( $bg['attachment'] ?? '' );
			$clean['repeat']       = self::cssToken( $bg['repeat'] ?? '' );
			$clean['size']         = self::cssToken( $bg['size'] ?? '' );
			$clean['overlayColor'] = self::sanitizeColor( $bg['overlayColor'] ?? '', '' );
		}

		return $clean;
	}

	/**
	 * A short CSS keyword such as `center center` or `no-repeat`.
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public static function cssToken( $value ) {
		$value = is_string( $value ) ? trim( $value ) : '';

		return preg_match( '/^[a-zA-Z0-9%\s.-]{0,40}$/', $value ) ? $value : '';
	}

	/**
	 * Sanitize a bpl-tools typography object so it is safe to hand to GetCSS.
	 *
	 * Only the keys getTypoCSS reads are kept, and each is reduced to a short
	 * CSS-safe token — the object arrives from the client over AJAX.
	 *
	 * @param mixed $typo Raw typography object.
	 * @return array
	 */
	public static function typo( $typo ) {
		$typo = is_array( $typo ) ? $typo : [];

		$token = static function ( $value, $pattern, $max = 40 ) {
			$value = is_scalar( $value ) ? trim( (string) $value ) : '';

			return ( '' !== $value && strlen( $value ) <= $max && preg_match( $pattern, $value ) ) ? $value : '';
		};

		$size = static function ( $value ) use ( $token ) {
			return $token( $value, '/^[0-9.]+(px|em|rem|%|vh|vw)?$/' );
		};

		// Letter spacing is the one size that can go below zero — tightening
		// display type is common — and the Typography control allows it. The
		// shared pattern dropped it here, so the editor showed -0.5px and the
		// published page showed nothing.
		$spacing = static function ( $value ) use ( $token ) {
			return $token( $value, '/^-?[0-9.]+(px|em|rem|%|vh|vw)?$/' );
		};

		$fontSize = is_array( $typo['fontSize'] ?? null ) ? $typo['fontSize'] : [];

		$clean = [
			'fontFamily'     => $token( $typo['fontFamily'] ?? '', '/^[a-zA-Z0-9 \-]+$/', 60 ),
			'fontCategory'   => $token( $typo['fontCategory'] ?? '', '/^[a-zA-Z\-]+$/' ),
			'fontVariant'    => $token( $typo['fontVariant'] ?? '', '/^[0-9]{3}i?$/' ),
			'fontWeight'     => $token( $typo['fontWeight'] ?? '', '/^([0-9]{3}|normal|bold|lighter|bolder)$/' ),
			'isUploadFont'   => ! isset( $typo['isUploadFont'] ) || (bool) $typo['isUploadFont'],
			'fontStyle'      => $token( $typo['fontStyle'] ?? '', '/^(normal|italic|oblique)$/' ),
			'textTransform'  => $token( $typo['textTransform'] ?? '', '/^(none|capitalize|uppercase|lowercase)$/' ),
			'textDecoration' => $token( $typo['textDecoration'] ?? '', '/^(none|underline|overline|line-through)$/' ),
			'lineHeight'     => $size( $typo['lineHeight'] ?? '' ),
			'letterSpace'    => $spacing( $typo['letterSpace'] ?? '' ),
			'fontSize'       => [
				'desktop' => $size( $fontSize['desktop'] ?? '' ),
				'tablet'  => $size( $fontSize['tablet'] ?? '' ),
				'mobile'  => $size( $fontSize['mobile'] ?? '' ),
			],
		];

		// getTypoCSS cascades desktop -> tablet -> mobile itself, but only when
		// the narrower keys are absent rather than empty strings.
		foreach ( [ 'tablet', 'mobile' ] as $device ) {
			if ( '' === $clean['fontSize'][ $device ] ) {
				unset( $clean['fontSize'][ $device ] );
			}
		}

		return $clean;
	}

	/**
	 * Normalize and sanitize the full attribute set into a safe, typed array.
	 *
	 * Everything downstream — query, markup and CSS — reads only this array, so
	 * an attribute that never lands here can never reach output.
	 *
	 * @param array $attributes Raw block attributes.
	 * @return array
	 */
	public static function resolveAttributes( array $attributes ) {
		$attributes = self::flatten( $attributes );

		$columns = is_array( $attributes['columns'] ?? null ) ? $attributes['columns'] : [];

		// Per-device boxes are { desktop, tablet, mobile }, each a BoxControl
		// object. Anything else came off the wire malformed, so only the desktop
		// slot takes it and the other two fall back to their own defaults.
		$box = static function ( $key, $device ) use ( $attributes ) {
			$value = $attributes[ $key ] ?? null;

			if ( is_array( $value ) && ( isset( $value['desktop'] ) || isset( $value['tablet'] ) || isset( $value['mobile'] ) ) ) {
				return $value[ $device ] ?? null;
			}

			return 'desktop' === $device ? $value : null;
		};

		$contentAlign = $attributes['contentAlign'] ?? [];
		$contentAlign = is_array( $contentAlign ) ? $contentAlign : [];
		$titleTypo    = self::typo( $attributes['titleTypo'] ?? [] );

		$order = self::contentOrder( $attributes['contentOrder'] ?? [] );

		return [
			/* Layout */
			'layouts'            => self::pickFrom( $attributes['layouts'] ?? 'grid', self::LAYOUTS, 'grid' ),
			'columnsDesktop'     => self::clampInt( $columns['desktop'] ?? 4, 1, 12, 4 ),
			'columnsTablet'      => self::clampInt( $columns['tablet'] ?? 2, 1, 12, 2 ),
			'columnsMobile'      => self::clampInt( $columns['mobile'] ?? 1, 1, 12, 1 ),
			'showImage'          => self::boolOn( $attributes, 'showImage' ),
			'showCategory'       => self::boolOn( $attributes, 'showCategory' ),
			'showRating'         => self::boolOn( $attributes, 'showRating' ),
			'ratingStyle'        => self::pickFrom( $attributes['ratingStyle'] ?? 'star', self::RATING_STYLE, 'star' ),
			'ratingShowEmpty'    => self::boolOn( $attributes, 'ratingShowEmpty' ),
			'showPrice'          => self::boolOn( $attributes, 'showPrice' ),
			'showSaleBadge'      => self::boolOn( $attributes, 'showSaleBadge' ),
			'showSoldCount'      => self::boolOn( $attributes, 'showSoldCount' ),
			'showProgressBar'    => self::boolOn( $attributes, 'showProgressBar' ),
			'soldPrefix'         => self::optionalText( $attributes['soldPrefix'] ?? __( 'Sold', 'b-blocks' ) ),
			'soldSuffix'         => self::optionalText( $attributes['soldSuffix'] ?? '+' ),
			'withoutStockValue'  => self::clampInt( $attributes['withoutStockValue'] ?? 50, 0, 100, 50 ),
			'showViewButton'     => self::boolOn( $attributes, 'showViewButton' ),
			'viewButtonText'     => self::text( $attributes['viewButtonText'] ?? '', __( 'Visit Product', 'b-blocks' ) ),
			'showTitle'          => self::boolOn( $attributes, 'showTitle' ),
			'titleTag'           => self::pickFrom( is_string( $attributes['titleTag'] ?? null ) ? strtolower( $attributes['titleTag'] ) : 'h4', self::TITLE_TAGS, 'h4' ),
			'actionPosition'     => self::pickFrom( $attributes['actionPosition'] ?? 'overlay', self::ACTION_POSITIONS, 'overlay' ),
			'actionAlign'        => self::pickFrom( $attributes['actionAlign'] ?? 'center', self::ACTION_ALIGNS, 'center' ),
			'actionFull'         => ! empty( $attributes['actionFull'] ),
			'actionIconOnly'     => ! empty( $attributes['actionIconOnly'] ),
			'actionOrder'        => self::pickFrom( $attributes['actionOrder'] ?? 'cart', self::ACTION_ORDER, 'cart' ),
			'imageSize'          => self::pickFrom( $attributes['imageSize'] ?? 'default', self::IMAGE_SIZES, 'default' ),

			/* Query */
			'queryType'          => self::pickFrom( $attributes['queryType'] ?? 'custom', self::QUERY_TYPES, 'custom' ),
			'orderBy'            => self::pickFrom( $attributes['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'              => self::pickFrom( is_string( $attributes['order'] ?? null ) ? strtoupper( $attributes['order'] ) : 'DESC', self::ORDER, 'DESC' ),
			'productsPerPage'    => self::clampInt( $attributes['productsPerPage'] ?? 4, 1, self::MAX_PER_PAGE, 4 ),
			'offset'             => self::clampInt( $attributes['offset'] ?? 0, 0, 10000, 0 ),
			'includeProducts'    => self::intArray( $attributes['includeProducts'] ?? [] ),
			'excludeProducts'    => self::intArray( $attributes['excludeProducts'] ?? [] ),
			'categoryMode'       => self::pickFrom( $attributes['categoryMode'] ?? 'include', self::TAX_MODES, 'include' ),
			'productCategories'  => self::intArray( $attributes['productCategories'] ?? [] ),
			'tagMode'            => self::pickFrom( $attributes['tagMode'] ?? 'include', self::TAX_MODES, 'include' ),
			'productTags'        => self::intArray( $attributes['productTags'] ?? [] ),
			'onSaleOnly'         => ! empty( $attributes['onSaleOnly'] ),
			'featuredOnly'       => ! empty( $attributes['featuredOnly'] ),
			'currentProductId'   => absint( $attributes['currentProductId'] ?? 0 ),

			/* Cart text */
			'showAddToCart'      => self::boolOn( $attributes, 'showAddToCart' ),
			'useCustomCartText'  => self::boolOn( $attributes, 'useCustomCartText' ),
			'cartTextSimple'     => self::text( $attributes['cartTextSimple'] ?? '', __( 'Buy Now', 'b-blocks' ) ),
			'cartTextVariable'   => self::text( $attributes['cartTextVariable'] ?? '', __( 'Select options', 'b-blocks' ) ),
			'cartTextGrouped'    => self::text( $attributes['cartTextGrouped'] ?? '', __( 'View products', 'b-blocks' ) ),
			'cartTextExternal'   => self::text( $attributes['cartTextExternal'] ?? '', __( 'Buy now', 'b-blocks' ) ),
			'cartTextDefault'    => self::text( $attributes['cartTextDefault'] ?? '', __( 'Read more', 'b-blocks' ) ),

			/* Sale badge */
			'badgeAlign'         => self::pickFrom( $attributes['badgeAlign'] ?? 'top', self::BADGE_ALIGN, 'top' ),
			'saleBadgeLabel'     => self::text( $attributes['saleBadgeLabel'] ?? '', __( 'Sale', 'b-blocks' ) ),
			'badgeContent'       => self::pickFrom( $attributes['badgeContent'] ?? 'text', self::BADGE_CONTENT, 'text' ),

			/* Load more */
			'enableLoadMore'     => self::boolOn( $attributes, 'enableLoadMore' ),
			'morePostsType'      => self::pickFrom( $attributes['morePostsType'] ?? 'button', self::MORE_TYPES, 'button' ),
			'loadMoreText'       => self::text( $attributes['loadMoreText'] ?? '', __( 'Load More', 'b-blocks' ) ),
			'loadMoreAlign'      => self::pickFrom( $attributes['loadMoreAlign'] ?? 'center', self::ALIGNS, 'center' ),

			/* Sorting */
			'contentOrder'       => $order,

			/* Taxonomy filter */
			'showTaxonomyFilter' => ! empty( $attributes['showTaxonomyFilter'] ),
			'filterTaxonomy'     => self::taxonomy( $attributes['filterTaxonomy'] ?? 'product_cat' ),
			'filterAllText'      => self::text( $attributes['filterAllText'] ?? '', __( 'All', 'b-blocks' ) ),
			'filterAlign'        => self::pickFrom( $attributes['filterAlign'] ?? 'left', self::ALIGNS, 'left' ),

			/* Style — grid & card */
			'columnGapDesktop'   => self::cssLength( $box( 'columnGap', 'desktop' ) ?? '20px', '20px' ),
			'columnGapTablet'    => self::cssLength( $box( 'columnGap', 'tablet' ) ?? '', '' ),
			'columnGapMobile'    => self::cssLength( $box( 'columnGap', 'mobile' ) ?? '', '' ),
			'rowGapDesktop'      => self::cssLength( $box( 'rowGap', 'desktop' ) ?? '20px', '20px' ),
			'rowGapTablet'       => self::cssLength( $box( 'rowGap', 'tablet' ) ?? '', '' ),
			'rowGapMobile'       => self::cssLength( $box( 'rowGap', 'mobile' ) ?? '', '' ),
			'cardBG'             => self::background( $attributes['cardBG'] ?? '', '#ffffff' ),
			'cardBodyBG'         => self::background( $attributes['cardBodyBG'] ?? '', '' ),
			'cardDivider'        => self::sanitizeColor( $attributes['cardDivider'] ?? '', '#f1f5f9' ),
			'cardBodyMarginDesktop' => self::boxCSS( $box( 'cardBodyMargin', 'desktop' ), '' ),
			'cardBodyMarginTablet'  => self::boxCSS( $box( 'cardBodyMargin', 'tablet' ), '' ),
			'cardBodyMarginMobile'  => self::boxCSS( $box( 'cardBodyMargin', 'mobile' ), '' ),
			'cardPaddingDesktop' => self::boxCSS( $box( 'cardPadding', 'desktop' ), '16px' ),
			'cardPaddingTablet'  => self::boxCSS( $box( 'cardPadding', 'tablet' ), '' ),
			'cardPaddingMobile'  => self::boxCSS( $box( 'cardPadding', 'mobile' ), '' ),
			'cardBorder'         => self::borderBox( $attributes['cardBorder'] ?? null ),
			'cardRadiusDesktop'  => self::boxCSS( $box( 'cardRadius', 'desktop' ), '8px' ),
			'cardRadiusTablet'   => self::boxCSS( $box( 'cardRadius', 'tablet' ), '' ),
			'cardRadiusMobile'   => self::boxCSS( $box( 'cardRadius', 'mobile' ), '' ),
			'cardHovPaddingDesktop' => self::boxCSS( $box( 'cardHovPadding', 'desktop' ), '' ),
			'cardHovPaddingTablet'  => self::boxCSS( $box( 'cardHovPadding', 'tablet' ), '' ),
			'cardHovPaddingMobile'  => self::boxCSS( $box( 'cardHovPadding', 'mobile' ), '' ),
			'cardHovRadiusDesktop'  => self::boxCSS( $box( 'cardHovRadius', 'desktop' ), '' ),
			'cardHovRadiusTablet'   => self::boxCSS( $box( 'cardHovRadius', 'tablet' ), '' ),
			'cardHovRadiusMobile'   => self::boxCSS( $box( 'cardHovRadius', 'mobile' ), '' ),
			'cardShadow'         => self::shadows( $attributes['cardShadow'] ?? [] ),
			'cardTransition'     => self::clampFloat( $attributes['cardTransition'] ?? 0.25, 0, 5, 0.25 ),
			'cardHovBG'          => self::background( $attributes['cardHovBG'] ?? '', '' ),
			'cardHovBorder'      => self::borderBox( $attributes['cardHovBorder'] ?? null ),
			'cardHovShadow'      => self::shadows( $attributes['cardHovShadow'] ?? [] ),
			'contentAlignDesktop' => self::pickFrom( $contentAlign['desktop'] ?? 'left', self::ALIGNS, 'left' ),
			'contentAlignTablet'  => self::pickFrom( $contentAlign['tablet'] ?? '', self::ALIGNS, '' ),
			'contentAlignMobile'  => self::pickFrom( $contentAlign['mobile'] ?? '', self::ALIGNS, '' ),

			/* Style — image & overlay */
			'imageRatio'         => self::pickFrom( $attributes['imageRatio'] ?? '3/4', self::RATIOS, '3/4' ),
			'imageFit'           => self::pickFrom( $attributes['imageFit'] ?? 'cover', self::FITS, 'cover' ),
			'imageRadiusDesktop' => self::boxCSS( $box( 'imageRadius', 'desktop' ), '8px' ),
			'imageRadiusTablet'  => self::boxCSS( $box( 'imageRadius', 'tablet' ), '' ),
			'imageRadiusMobile'  => self::boxCSS( $box( 'imageRadius', 'mobile' ), '' ),
			'imageMarginDesktop' => self::boxCSS( $box( 'imageMargin', 'desktop' ), '' ),
			'imageMarginTablet'  => self::boxCSS( $box( 'imageMargin', 'tablet' ), '' ),
			'imageMarginMobile'  => self::boxCSS( $box( 'imageMargin', 'mobile' ), '' ),
			'imageBG'            => self::background( $attributes['imageBG'] ?? '', '#f1f5f9' ),
			'overlayBG'          => self::background( $attributes['overlayBG'] ?? '', 'rgba(7, 1, 39, 0.45)' ),

			/* Style — content */
			'titleTypo'          => $titleTypo,
			'titleTransition'    => self::clampFloat( $attributes['titleTransition'] ?? 0.2, 0, 5, 0.2 ),
			'titleColor'         => self::sanitizeColor( $attributes['titleColor'] ?? '', '#070127' ),
			'titleHovColor'      => self::sanitizeColor( $attributes['titleHovColor'] ?? '', '#146EF5' ),
			'priceTypo'          => self::typo( $attributes['priceTypo'] ?? [] ),
			'priceColor'         => self::sanitizeColor( $attributes['priceColor'] ?? '', '#e44d3a' ),
			'regularPriceColor'  => self::sanitizeColor( $attributes['regularPriceColor'] ?? '', '#999999' ),
			'ratingColor'        => self::sanitizeColor( $attributes['ratingColor'] ?? '', '#f5a623' ),
			'ratingEmptyColor'   => self::sanitizeColor( $attributes['ratingEmptyColor'] ?? '', '#d1d5db' ),
			'ratingCountColor'   => self::sanitizeColor( $attributes['ratingCountColor'] ?? '', '#64748b' ),
			'ratingSize'         => self::clampInt( $attributes['ratingSize'] ?? 14, 8, 40, 14 ),
			'categoryTypo'       => self::typo( $attributes['categoryTypo'] ?? [] ),
			'categoryTransition' => self::clampFloat( $attributes['categoryTransition'] ?? 0.2, 0, 5, 0.2 ),
			'categoryColor'      => self::sanitizeColor( $attributes['categoryColor'] ?? '', '#6b7280' ),
			'categoryHovColor'   => self::sanitizeColor( $attributes['categoryHovColor'] ?? '', '#146EF5' ),
			'soldTypo'           => self::typo( $attributes['soldTypo'] ?? [] ),
			'soldColor'          => self::sanitizeColor( $attributes['soldColor'] ?? '', '#6b7280' ),
			'soldBG'             => self::background( $attributes['soldBG'] ?? '', '' ),
			'progressTrackColor' => self::sanitizeColor( $attributes['progressTrackColor'] ?? '', '#e2e8f0' ),
			'progressFillColor'  => self::sanitizeColor( $attributes['progressFillColor'] ?? '', '#146EF5' ),
			'progressHeight'     => self::clampInt( $attributes['progressHeight'] ?? 6, 2, 24, 6 ),
			'progressRadiusDesktop' => self::boxCSS( $box( 'progressRadius', 'desktop' ), '3px' ),
			'progressRadiusTablet'  => self::boxCSS( $box( 'progressRadius', 'tablet' ), '' ),
			'progressRadiusMobile'  => self::boxCSS( $box( 'progressRadius', 'mobile' ), '' ),

			/* Style — buttons */
			'btnColor'           => self::sanitizeColor( $attributes['btnColor'] ?? '', '#ffffff' ),
			'btnBG'              => self::background( $attributes['btnBG'] ?? '', '#146EF5' ),
			'btnHovColor'        => self::sanitizeColor( $attributes['btnHovColor'] ?? '', '#ffffff' ),
			'btnHovBG'           => self::background( $attributes['btnHovBG'] ?? '', '#070127' ),
			'cartShowIcon'       => self::boolOn( $attributes, 'cartShowIcon' ),
						'cartIcon'           => self::iconMarkup( $attributes['cartIcon'] ?? '' ),
			'cartIconColor'      => self::sanitizeColor( $attributes['cartIconColor'] ?? '', '' ),
			'cartIconSizeDesktop' => self::cssLength( $box( 'cartIconSize', 'desktop' ) ?? '', '' ),
			'cartIconSizeTablet'  => self::cssLength( $box( 'cartIconSize', 'tablet' ) ?? '', '' ),
			'cartIconSizeMobile'  => self::cssLength( $box( 'cartIconSize', 'mobile' ) ?? '', '' ),
			'cartIconPosition'   => self::pickFrom( $attributes['cartIconPosition'] ?? 'left', self::ICON_POSITIONS, 'left' ),
			'btnTypo'            => self::typo( $attributes['btnTypo'] ?? [] ),
			'btnTransition'      => self::clampFloat( $attributes['btnTransition'] ?? 0.2, 0, 5, 0.2 ),
			'btnBorder'          => self::borderBox( $attributes['btnBorder'] ?? null ),
			'btnHovBorder'       => self::borderBox( $attributes['btnHovBorder'] ?? null ),
			'btnMarginDesktop'    => self::boxCSS( $box( 'btnMargin', 'desktop' ), '' ),
			'btnMarginTablet'    => self::boxCSS( $box( 'btnMargin', 'tablet' ), '' ),
			'btnMarginMobile'    => self::boxCSS( $box( 'btnMargin', 'mobile' ), '' ),
			'btnPaddingDesktop'  => self::boxCSS( $box( 'btnPadding', 'desktop' ), '13px 14px 13px 14px' ),
			'btnPaddingTablet'   => self::boxCSS( $box( 'btnPadding', 'tablet' ), '' ),
			'btnPaddingMobile'   => self::boxCSS( $box( 'btnPadding', 'mobile' ), '' ),
			'btnRadiusDesktop'   => self::boxCSS( $box( 'btnRadius', 'desktop' ), '4px' ),
			'btnRadiusTablet'    => self::boxCSS( $box( 'btnRadius', 'tablet' ), '' ),
			'btnRadiusMobile'    => self::boxCSS( $box( 'btnRadius', 'mobile' ), '' ),
			'btnHovMarginDesktop'  => self::boxCSS( $box( 'btnHovMargin', 'desktop' ), '' ),
			'btnHovMarginTablet'  => self::boxCSS( $box( 'btnHovMargin', 'tablet' ), '' ),
			'btnHovMarginMobile'  => self::boxCSS( $box( 'btnHovMargin', 'mobile' ), '' ),
			'btnHovPaddingDesktop' => self::boxCSS( $box( 'btnHovPadding', 'desktop' ), '' ),
			'btnHovPaddingTablet'  => self::boxCSS( $box( 'btnHovPadding', 'tablet' ), '' ),
			'btnHovPaddingMobile'  => self::boxCSS( $box( 'btnHovPadding', 'mobile' ), '' ),
			'btnHovRadiusDesktop'  => self::boxCSS( $box( 'btnHovRadius', 'desktop' ), '' ),
			'btnHovRadiusTablet'   => self::boxCSS( $box( 'btnHovRadius', 'tablet' ), '' ),
			'btnHovRadiusMobile'   => self::boxCSS( $box( 'btnHovRadius', 'mobile' ), '' ),
			'viewBtnColor'       => self::sanitizeColor( $attributes['viewBtnColor'] ?? '', '#070127' ),
			'viewBtnBG'          => self::background( $attributes['viewBtnBG'] ?? '', '#ffffff' ),
			'viewBtnHovColor'    => self::sanitizeColor( $attributes['viewBtnHovColor'] ?? '', '#ffffff' ),
			'viewBtnHovBG'       => self::background( $attributes['viewBtnHovBG'] ?? '', '#146EF5' ),
			'viewShowIcon'       => self::boolOn( $attributes, 'viewShowIcon' ),
						'viewIcon'           => self::iconMarkup( $attributes['viewIcon'] ?? '' ),
			'viewIconColor'      => self::sanitizeColor( $attributes['viewIconColor'] ?? '', '' ),
			'viewIconSizeDesktop' => self::cssLength( $box( 'viewIconSize', 'desktop' ) ?? '', '' ),
			'viewIconSizeTablet'  => self::cssLength( $box( 'viewIconSize', 'tablet' ) ?? '', '' ),
			'viewIconSizeMobile'  => self::cssLength( $box( 'viewIconSize', 'mobile' ) ?? '', '' ),
			'viewIconPosition'   => self::pickFrom( $attributes['viewIconPosition'] ?? 'left', self::ICON_POSITIONS, 'left' ),
			'viewBtnTypo'        => self::typo( $attributes['viewBtnTypo'] ?? [] ),
			'viewBtnTransition'  => self::clampFloat( $attributes['viewBtnTransition'] ?? 0.2, 0, 5, 0.2 ),
			'viewBtnBorder'      => self::borderBox( $attributes['viewBtnBorder'] ?? null ),
			'viewBtnHovBorder'   => self::borderBox( $attributes['viewBtnHovBorder'] ?? null ),
			'viewBtnMarginDesktop'  => self::boxCSS( $box( 'viewBtnMargin', 'desktop' ), '' ),
			'viewBtnMarginTablet'  => self::boxCSS( $box( 'viewBtnMargin', 'tablet' ), '' ),
			'viewBtnMarginMobile'  => self::boxCSS( $box( 'viewBtnMargin', 'mobile' ), '' ),
			'viewBtnPaddingDesktop' => self::boxCSS( $box( 'viewBtnPadding', 'desktop' ), '13px 14px 13px 14px' ),
			'viewBtnPaddingTablet'  => self::boxCSS( $box( 'viewBtnPadding', 'tablet' ), '' ),
			'viewBtnPaddingMobile'  => self::boxCSS( $box( 'viewBtnPadding', 'mobile' ), '' ),
			'viewBtnRadiusDesktop'  => self::boxCSS( $box( 'viewBtnRadius', 'desktop' ), '4px' ),
			'viewBtnRadiusTablet'   => self::boxCSS( $box( 'viewBtnRadius', 'tablet' ), '' ),
			'viewBtnRadiusMobile'   => self::boxCSS( $box( 'viewBtnRadius', 'mobile' ), '' ),
			'viewBtnHovMarginDesktop'  => self::boxCSS( $box( 'viewBtnHovMargin', 'desktop' ), '' ),
			'viewBtnHovMarginTablet'  => self::boxCSS( $box( 'viewBtnHovMargin', 'tablet' ), '' ),
			'viewBtnHovMarginMobile'  => self::boxCSS( $box( 'viewBtnHovMargin', 'mobile' ), '' ),
			'viewBtnHovPaddingDesktop' => self::boxCSS( $box( 'viewBtnHovPadding', 'desktop' ), '' ),
			'viewBtnHovPaddingTablet'  => self::boxCSS( $box( 'viewBtnHovPadding', 'tablet' ), '' ),
			'viewBtnHovPaddingMobile'  => self::boxCSS( $box( 'viewBtnHovPadding', 'mobile' ), '' ),
			'viewBtnHovRadiusDesktop'  => self::boxCSS( $box( 'viewBtnHovRadius', 'desktop' ), '' ),
			'viewBtnHovRadiusTablet'   => self::boxCSS( $box( 'viewBtnHovRadius', 'tablet' ), '' ),
			'viewBtnHovRadiusMobile'   => self::boxCSS( $box( 'viewBtnHovRadius', 'mobile' ), '' ),
			'badgeBG'            => self::background( $attributes['badgeBG'] ?? '', '#e44d3a' ),
			'badgeTextColor'     => self::sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' ),
			'badgeRadiusDesktop' => self::boxCSS( $box( 'badgeRadius', 'desktop' ), '4px' ),
			'badgeRadiusTablet'  => self::boxCSS( $box( 'badgeRadius', 'tablet' ), '' ),
			'badgeRadiusMobile'  => self::boxCSS( $box( 'badgeRadius', 'mobile' ), '' ),
			'badgeTypo'          => self::typo( $attributes['badgeTypo'] ?? [] ),
			'badgePaddingDesktop' => self::boxCSS( $box( 'badgePadding', 'desktop' ), '3px 10px 3px 10px' ),
			'badgePaddingTablet'  => self::boxCSS( $box( 'badgePadding', 'tablet' ), '' ),
			'badgePaddingMobile'  => self::boxCSS( $box( 'badgePadding', 'mobile' ), '' ),
			'badgeOffsetDesktop' => self::cssLength( $box( 'badgeOffset', 'desktop' ) ?? '10px', '10px' ),
			'badgeOffsetTablet'  => self::cssLength( $box( 'badgeOffset', 'tablet' ) ?? '', '' ),
			'badgeOffsetMobile'  => self::cssLength( $box( 'badgeOffset', 'mobile' ) ?? '', '' ),

			/* Style — navigation */
			'filterColor'        => self::sanitizeColor( $attributes['filterColor'] ?? '', '#070127' ),
			'filterBG'           => self::background( $attributes['filterBG'] ?? '', '#f1f5f9' ),
			'filterActiveColor'  => self::sanitizeColor( $attributes['filterActiveColor'] ?? '', '#ffffff' ),
			'filterActiveBG'     => self::background( $attributes['filterActiveBG'] ?? '', '#146EF5' ),
			'filterTypo'         => self::typo( $attributes['filterTypo'] ?? [] ),
			'filterTransition'   => self::clampFloat( $attributes['filterTransition'] ?? 0.2, 0, 5, 0.2 ),
			'filterBorder'       => self::borderBox( $attributes['filterBorder'] ?? null ),
			'filterHovBorder'    => self::borderBox( $attributes['filterHovBorder'] ?? null ),
			'filterPaddingDesktop' => self::boxCSS( $box( 'filterPadding', 'desktop' ), '6px 14px 6px 14px' ),
			'filterPaddingTablet'  => self::boxCSS( $box( 'filterPadding', 'tablet' ), '' ),
			'filterPaddingMobile'  => self::boxCSS( $box( 'filterPadding', 'mobile' ), '' ),
			'filterRadiusDesktop'  => self::boxCSS( $box( 'filterRadius', 'desktop' ), '4px' ),
			'filterRadiusTablet'   => self::boxCSS( $box( 'filterRadius', 'tablet' ), '' ),
			'filterRadiusMobile'   => self::boxCSS( $box( 'filterRadius', 'mobile' ), '' ),
			'filterHovPaddingDesktop' => self::boxCSS( $box( 'filterHovPadding', 'desktop' ), '' ),
			'filterHovPaddingTablet'  => self::boxCSS( $box( 'filterHovPadding', 'tablet' ), '' ),
			'filterHovPaddingMobile'  => self::boxCSS( $box( 'filterHovPadding', 'mobile' ), '' ),
			'filterHovRadiusDesktop'  => self::boxCSS( $box( 'filterHovRadius', 'desktop' ), '' ),
			'filterHovRadiusTablet'   => self::boxCSS( $box( 'filterHovRadius', 'tablet' ), '' ),
			'filterHovRadiusMobile'   => self::boxCSS( $box( 'filterHovRadius', 'mobile' ), '' ),
			'pagerColor'         => self::sanitizeColor( $attributes['pagerColor'] ?? '', '#ffffff' ),
			'pagerBG'            => self::background( $attributes['pagerBG'] ?? '', '#146EF5' ),
			'pagerHovColor'      => self::sanitizeColor( $attributes['pagerHovColor'] ?? '', '#ffffff' ),
			'pagerHovBG'         => self::background( $attributes['pagerHovBG'] ?? '', '#070127' ),
			'pagerActiveColor'   => self::sanitizeColor( $attributes['pagerActiveColor'] ?? '', '#ffffff' ),
			'pagerActiveBG'      => self::background( $attributes['pagerActiveBG'] ?? '', '#070127' ),
			'pagerTypo'          => self::typo( $attributes['pagerTypo'] ?? [] ),
			'pagerTransition'    => self::clampFloat( $attributes['pagerTransition'] ?? 0.2, 0, 5, 0.2 ),
			'pagerBorder'        => self::borderBox( $attributes['pagerBorder'] ?? null ),
			'pagerHovBorder'     => self::borderBox( $attributes['pagerHovBorder'] ?? null ),
			'pagerActiveBorder'  => self::borderBox( $attributes['pagerActiveBorder'] ?? null ),
			'pagerPaddingDesktop' => self::boxCSS( $box( 'pagerPadding', 'desktop' ), '8px 18px 8px 18px' ),
			'pagerPaddingTablet'  => self::boxCSS( $box( 'pagerPadding', 'tablet' ), '' ),
			'pagerPaddingMobile'  => self::boxCSS( $box( 'pagerPadding', 'mobile' ), '' ),
			'pagerRadiusDesktop'  => self::boxCSS( $box( 'pagerRadius', 'desktop' ), '4px' ),
			'pagerRadiusTablet'   => self::boxCSS( $box( 'pagerRadius', 'tablet' ), '' ),
			'pagerRadiusMobile'   => self::boxCSS( $box( 'pagerRadius', 'mobile' ), '' ),
			'pagerHovPaddingDesktop' => self::boxCSS( $box( 'pagerHovPadding', 'desktop' ), '' ),
			'pagerHovPaddingTablet'  => self::boxCSS( $box( 'pagerHovPadding', 'tablet' ), '' ),
			'pagerHovPaddingMobile'  => self::boxCSS( $box( 'pagerHovPadding', 'mobile' ), '' ),
			'pagerHovRadiusDesktop'  => self::boxCSS( $box( 'pagerHovRadius', 'desktop' ), '' ),
			'pagerHovRadiusTablet'   => self::boxCSS( $box( 'pagerHovRadius', 'tablet' ), '' ),
			'pagerHovRadiusMobile'   => self::boxCSS( $box( 'pagerHovRadius', 'mobile' ), '' ),
			'pagerActivePaddingDesktop' => self::boxCSS( $box( 'pagerActivePadding', 'desktop' ), '' ),
			'pagerActivePaddingTablet'  => self::boxCSS( $box( 'pagerActivePadding', 'tablet' ), '' ),
			'pagerActivePaddingMobile'  => self::boxCSS( $box( 'pagerActivePadding', 'mobile' ), '' ),
			'pagerActiveRadiusDesktop'  => self::boxCSS( $box( 'pagerActiveRadius', 'desktop' ), '' ),
			'pagerActiveRadiusTablet'   => self::boxCSS( $box( 'pagerActiveRadius', 'tablet' ), '' ),
			'pagerActiveRadiusMobile'   => self::boxCSS( $box( 'pagerActiveRadius', 'mobile' ), '' ),

			'noProductsMessage'  => self::text( $attributes['noProductsMessage'] ?? '', __( 'No products found.', 'b-blocks' ) ),
		];
	}

	/**
	 * The card element order, repaired against the current element list so an
	 * order saved by an older version still renders every element exactly once.
	 *
	 * @param mixed $raw Stored order.
	 * @return string[]
	 */
	public static function contentOrder( $raw ) {
		$raw = is_array( $raw ) ? $raw : [];

		$kept = [];
		foreach ( $raw as $key ) {
			if ( is_string( $key ) && in_array( $key, self::ELEMENTS, true ) && ! in_array( $key, $kept, true ) ) {
				$kept[] = $key;
			}
		}

		return array_merge( $kept, array_values( array_diff( self::ELEMENTS, $kept ) ) );
	}

	/**
	 * Accept only a taxonomy actually attached to the product post type.
	 *
	 * @param mixed $taxonomy Raw slug.
	 * @return string
	 */
	public static function taxonomy( $taxonomy ) {
		$taxonomy = is_string( $taxonomy ) ? sanitize_key( $taxonomy ) : '';

		if ( '' === $taxonomy || ! taxonomy_exists( $taxonomy ) ) {
			return 'product_cat';
		}

		return in_array( $taxonomy, get_object_taxonomies( 'product' ), true ) ? $taxonomy : 'product_cat';
	}

	/* ----------------------------------------------------------------------
	 * Query
	 * ------------------------------------------------------------------- */

	/**
	 * Run the product query for one page.
	 *
	 * Both the initial render and the AJAX swap come through here, so a filtered
	 * page can never drift from what the server rendered first.
	 *
	 * @param array $a      Resolved attributes.
	 * @param int   $termId Active taxonomy-filter term, 0 for "All".
	 * @param int   $page   1-based page number.
	 * @return array { query: WP_Query, maxPages: int, total: int }
	 */
	public static function query( array $a, $termId = 0, $page = 1 ) {
		$page    = max( 1, (int) $page );
		$termId  = absint( $termId );
		$perPage = $a['productsPerPage'];

		if ( 'related' === $a['queryType'] ) {
			return self::relatedQuery( $a, $termId, $page, $perPage );
		}

		$args  = self::buildQueryArgs( $a, $termId, $page );
		$query = new WP_Query( $args );

		$total    = max( 0, (int) $query->found_posts - $a['offset'] );
		$maxPages = (int) ceil( $total / $perPage );

		return [
			'query'    => $query,
			'maxPages' => $maxPages,
			'total'    => $total,
		];
	}

	/**
	 * Build sanitized WP_Query args for the custom-query mode.
	 *
	 * @param array $a      Resolved attributes.
	 * @param int   $termId Active taxonomy-filter term.
	 * @param int   $page   1-based page number.
	 * @return array
	 */
	public static function buildQueryArgs( array $a, $termId = 0, $page = 1 ) {
		$page    = max( 1, (int) $page );
		$perPage = $a['productsPerPage'];

		$args = [
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'posts_per_page'      => $perPage,
			'ignore_sticky_posts' => true,
		];

		// WP_Query honours `offset` *or* `paged`, never both, so an author-set
		// offset means paging has to be worked out by hand.
		if ( $a['offset'] > 0 ) {
			$args['offset'] = $a['offset'] + ( ( $page - 1 ) * $perPage );
		} else {
			$args['paged'] = $page;
		}

		/* Visibility — mirror WooCommerce's own catalog loops. */
		$hidden = [ 'exclude-from-catalog' ];
		if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
			$hidden[] = 'outofstock';
		}

		$taxQuery = [
			'relation' => 'AND',
			[
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => $hidden,
				'operator' => 'NOT IN',
			],
		];

		if ( $a['featuredOnly'] ) {
			$taxQuery[] = [
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => [ 'featured' ],
				'operator' => 'IN',
			];
		}

		if ( ! empty( $a['productCategories'] ) ) {
			$taxQuery[] = [
				'taxonomy' => 'product_cat',
				'field'    => 'term_id',
				'terms'    => $a['productCategories'],
				'operator' => 'exclude' === $a['categoryMode'] ? 'NOT IN' : 'IN',
			];
		}

		if ( ! empty( $a['productTags'] ) ) {
			$taxQuery[] = [
				'taxonomy' => 'product_tag',
				'field'    => 'term_id',
				'terms'    => $a['productTags'],
				'operator' => 'exclude' === $a['tagMode'] ? 'NOT IN' : 'IN',
			];
		}

		if ( $termId > 0 ) {
			$taxQuery[] = [
				'taxonomy' => $a['filterTaxonomy'],
				'field'    => 'term_id',
				'terms'    => [ $termId ],
				'operator' => 'IN',
			];
		}

		$args['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- catalog visibility requires it, as in WooCommerce core.

		/* Include / exclude. */
		$include = $a['includeProducts'];

		if ( $a['onSaleOnly'] && function_exists( 'wc_get_product_ids_on_sale' ) ) {
			$onSale  = array_map( 'absint', (array) wc_get_product_ids_on_sale() );
			$include = ! empty( $include ) ? array_values( array_intersect( $include, $onSale ) ) : $onSale;

			// An empty post__in is ignored by WP_Query, which would silently
			// widen the query to everything — 0 keeps it correctly empty.
			if ( empty( $include ) ) {
				$include = [ 0 ];
			}
		}

		if ( ! empty( $include ) ) {
			$args['post__in'] = $include;
		}

		if ( ! empty( $a['excludeProducts'] ) ) {
			$args['post__not_in'] = $a['excludeProducts'];
		}

		/* Ordering. */
		switch ( $a['orderBy'] ) {
			case 'title':
				$args['orderby'] = 'title';
				break;
			case 'menu_order':
				$args['orderby'] = 'menu_order title';
				break;
			case 'rand':
				$args['orderby'] = 'rand';
				break;
			case 'id':
				$args['orderby'] = 'ID';
				break;
			case 'price':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- same ordering WooCommerce uses for price.
				break;
			case 'popularity':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- same ordering WooCommerce uses for popularity.
				break;
			case 'rating':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- same ordering WooCommerce uses for rating.
				break;
			default:
				$args['orderby'] = 'date';
		}

		$args['order'] = $a['order'];

		/**
		 * Filter the product-grid query args.
		 *
		 * @param array $args WP_Query args.
		 * @param array $a    Resolved block attributes.
		 */
		return apply_filters( 'b_blocks_woo_product_grid_query', $args, $a );
	}

	/**
	 * Related-products mode: resolve WooCommerce's related IDs once, then page
	 * through the list in PHP because the set is already fully materialized.
	 *
	 * @param array $a       Resolved attributes.
	 * @param int   $termId  Active taxonomy-filter term.
	 * @param int   $page    1-based page number.
	 * @param int   $perPage Page size.
	 * @return array { query: WP_Query, maxPages: int, total: int }
	 */
	protected static function relatedQuery( array $a, $termId, $page, $perPage ) {
		// Off a single product page there is nothing to be related to. The
		// inspector tells the author this falls back to the newest products, so
		// it has to actually do that rather than render an empty grid.
		if ( ! $a['currentProductId'] ) {
			$args  = self::buildQueryArgs( array_merge( $a, [ 'queryType' => 'custom' ] ), $termId, $page );
			$query = new WP_Query( $args );
			$total = max( 0, (int) $query->found_posts - $a['offset'] );

			return [
				'query'    => $query,
				'maxPages' => (int) ceil( $total / $perPage ),
				'total'    => $total,
			];
		}

		$ids = self::relatedIds( $a );

		if ( $termId > 0 ) {
			$filtered = [];
			foreach ( $ids as $id ) {
				if ( has_term( $termId, $a['filterTaxonomy'], $id ) ) {
					$filtered[] = $id;
				}
			}
			$ids = $filtered;
		}

		$total    = count( $ids );
		$maxPages = (int) ceil( $total / $perPage );
		$slice    = array_slice( $ids, ( $page - 1 ) * $perPage, $perPage );

		$query = new WP_Query(
			[
				'post_type'           => 'product',
				'post_status'         => 'publish',
				'posts_per_page'      => $perPage,
				'post__in'            => ! empty( $slice ) ? $slice : [ 0 ],
				'orderby'             => 'post__in',
				'ignore_sticky_posts' => true,
				'no_found_rows'       => true,
			]
		);

		return [
			'query'    => $query,
			'maxPages' => $maxPages,
			'total'    => $total,
		];
	}

	/**
	 * WooCommerce's related-product IDs for the product being viewed.
	 *
	 * Returns an empty list anywhere there is no current product — the caller
	 * then renders the empty-state message rather than an unrelated grid.
	 *
	 * @param array $a Resolved attributes.
	 * @return int[]
	 */
	public static function relatedIds( array $a ) {
		$productId = $a['currentProductId'];

		if ( ! $productId || ! function_exists( 'wc_get_related_products' ) ) {
			return [];
		}

		// Fetch several pages' worth up front so Load More has somewhere to go.
		$limit   = (int) min( 100, max( $a['productsPerPage'] * 5, $a['productsPerPage'] ) );
		$exclude = array_merge( [ $productId ], $a['excludeProducts'] );

		return array_map( 'absint', (array) wc_get_related_products( $productId, $limit, $exclude ) );
	}

	/* ----------------------------------------------------------------------
	 * Data
	 * ------------------------------------------------------------------- */

	/**
	 * Allowlist for the two HTML fragments WooCommerce itself produces.
	 *
	 * wp_kses_post() drops <bdi>, which WooCommerce wraps every formatted amount
	 * in, so the post set is extended rather than replaced.
	 *
	 * @return array
	 */
	public static function allowedTags() {
		static $tags = null;

		if ( null === $tags ) {
			$tags        = wp_kses_allowed_html( 'post' );
			$tags['bdi'] = [ 'class' => true ];
		}

		return $tags;
	}

	/**
	 * The WordPress image size to request for a card.
	 *
	 * @param array $a Resolved attributes.
	 * @return string
	 */
	protected static function imageSize( array $a ) {
		if ( 'default' !== $a['imageSize'] ) {
			return $a['imageSize'];
		}

		return has_image_size( 'woocommerce_thumbnail' ) ? 'woocommerce_thumbnail' : 'medium';
	}

	/**
	 * Cart button label for a product type.
	 *
	 * @param \WC_Product $product Product.
	 * @param array       $a       Resolved attributes.
	 * @return string
	 */
	protected static function cartLabel( $product, array $a ) {
		if ( ! $a['useCustomCartText'] ) {
			return self::text( $product->add_to_cart_text(), __( 'Read more', 'b-blocks' ) );
		}

		switch ( $product->get_type() ) {
			case 'simple':
				return $a['cartTextSimple'];
			case 'variable':
				return $a['cartTextVariable'];
			case 'grouped':
				return $a['cartTextGrouped'];
			case 'external':
				return $a['cartTextExternal'];
			default:
				return $a['cartTextDefault'];
		}
	}

	/**
	 * What a product on sale saves, for the badge's Amount Saved / Percent Off.
	 *
	 * Prices go through wc_get_price_to_display(), so the saving matches the
	 * prices the card shows whichever way the store displays tax. A variable
	 * product reports its best saving across variations, flagged as a range when
	 * they differ, so the badge can say "up to". Anything without both a regular
	 * and a lower sale price — grouped, external with no sale — saves nothing,
	 * and the badge falls back to its own text.
	 *
	 * @param \WC_Product $product Product.
	 * @return array { amount: float, percent: int, isRange: bool }
	 */
	protected static function savings( $product ) {
		$none = [
			'amount'  => 0.0,
			'percent' => 0,
			'isRange' => false,
		];

		if ( ! $product->is_on_sale() ) {
			return $none;
		}

		$pairs = [];

		if ( $product->is_type( 'variable' ) ) {
			$prices = $product->get_variation_prices( true );

			foreach ( (array) ( $prices['regular_price'] ?? [] ) as $variationId => $regular ) {
				$pairs[] = [ (float) $regular, (float) ( $prices['sale_price'][ $variationId ] ?? $regular ) ];
			}
		} elseif ( '' !== $product->get_regular_price() && '' !== $product->get_sale_price() ) {
			$pairs[] = [
				(float) wc_get_price_to_display( $product, [ 'price' => $product->get_regular_price() ] ),
				(float) wc_get_price_to_display( $product, [ 'price' => $product->get_sale_price() ] ),
			];
		}

		$decimals = wc_get_price_decimals();
		$amounts  = [];
		$percent  = 0;

		foreach ( $pairs as list( $regular, $sale ) ) {
			if ( $regular <= 0 || $sale >= $regular ) {
				continue;
			}

			$amounts[] = round( $regular - $sale, $decimals );
			$percent   = max( $percent, (int) round( ( ( $regular - $sale ) / $regular ) * 100 ) );
		}

		if ( ! $amounts ) {
			return $none;
		}

		return [
			'amount'  => max( $amounts ),
			'percent' => $percent,
			// Variations that are not on sale save nothing, which is also a
			// difference worth the "up to".
			'isRange' => count( array_unique( $amounts ) ) > 1 || count( $amounts ) < count( $pairs ),
		];
	}

	/**
	 * The two computed badge labels, already translated and formatted.
	 *
	 * The amount is plain text: wc_price() wraps it in markup, and the badge
	 * renders a string. Whole amounts drop their decimals — "Save $60", not
	 * "Save $60.00" — which is how a saving is normally written.
	 *
	 * @param array $saving From savings().
	 * @return array { saveLabel: string, percentLabel: string }
	 */
	protected static function savingLabels( array $saving ) {
		if ( $saving['amount'] <= 0 ) {
			return [
				'saveLabel'    => '',
				'percentLabel' => '',
			];
		}

		$isWhole = abs( $saving['amount'] - round( $saving['amount'] ) ) < 0.005;
		$money   = html_entity_decode(
			wp_strip_all_tags( wc_price( $saving['amount'], [ 'decimals' => $isWhole ? 0 : wc_get_price_decimals() ] ) ),
			ENT_QUOTES,
			'UTF-8'
		);

		// wc_price() separates symbol and number with a no-break space in some
		// locales; a normal one reads the same and survives JSON cleanly.
		$money = trim( str_replace( "\xC2\xA0", ' ', $money ) );

		return [
			'saveLabel'    => $saving['isRange']
				/* translators: %s: largest amount saved, with currency. */
				? sprintf( __( 'Save up to %s', 'b-blocks' ), $money )
				/* translators: %s: amount saved, with currency. */
				: sprintf( __( 'Save %s', 'b-blocks' ), $money ),
			'percentLabel' => $saving['isRange']
				/* translators: %d: largest percentage off. */
				? sprintf( __( 'Up to -%d%%', 'b-blocks' ), $saving['percent'] )
				/* translators: %d: percentage off. */
				: sprintf( __( '-%d%%', 'b-blocks' ), $saving['percent'] ),
		];
	}

	/**
	 * Flatten one product into everything the React card needs.
	 *
	 * Anything that has to be locale-formatted or capability-checked is resolved
	 * here rather than in JS: the sold label goes through number_format_i18n(),
	 * and the two HTML fragments are filtered before they leave the server.
	 *
	 * @param \WC_Product $product Product.
	 * @param array       $a       Resolved attributes.
	 * @param string      $size    Image size.
	 * @return array
	 */
	protected static function productData( $product, array $a, $size ) {
		$id    = (int) $product->get_id();
		$title = $product->get_name();

		/* Image, with the responsive sources WordPress already knows about. */
		$image = [
			'url'    => '',
			'alt'    => $title,
			'srcset' => '',
			'sizes'  => '',
			'width'  => 0,
			'height' => 0,
		];

		$imageId = $product->get_image_id();
		if ( $imageId ) {
			$src = wp_get_attachment_image_src( $imageId, $size );

			if ( $src ) {
				$alt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );

				$image = [
					'url'    => $src[0],
					'width'  => (int) $src[1],
					'height' => (int) $src[2],
					'srcset' => (string) wp_get_attachment_image_srcset( $imageId, $size ),
					'sizes'  => (string) wp_get_attachment_image_sizes( $imageId, $size ),
					'alt'    => ( is_string( $alt ) && '' !== trim( $alt ) ) ? trim( wp_strip_all_tags( $alt ) ) : $title,
				];
			}
		}

		if ( '' === $image['url'] && function_exists( 'wc_placeholder_img_src' ) ) {
			$image['url'] = wc_placeholder_img_src( $size );
		}

		/* Sold count: sold / (sold + remaining stock), or the author's stand-in
		   percentage when the product does not manage stock at all. */
		$sold  = max( 0, (int) $product->get_total_sales() );
		$stock = $product->get_stock_quantity();

		if ( $product->managing_stock() && null !== $stock ) {
			$denominator = $sold + max( 0, (int) $stock );
			$percent     = $denominator > 0 ? (int) round( ( $sold / $denominator ) * 100 ) : 0;
		} else {
			$percent = $a['withoutStockValue'];
		}

		$categories = function_exists( 'wc_get_product_category_list' )
			? wc_get_product_category_list( $id, ', ' )
			: get_the_term_list( $id, 'product_cat', '', ', ' );

		if ( is_wp_error( $categories ) || ! $categories ) {
			$categories = '';
		}

		// React renders this as an href and does not vet the scheme itself.
		// WooCommerce rejects a javascript: product URL on save, but
		// `woocommerce_product_add_to_cart_url` is filterable, so the protocol
		// allowlist is applied here too — as it already is for image URLs.
		$cartUrl = esc_url_raw( $product->add_to_cart_url() );

		$saving = self::savingLabels( self::savings( $product ) );

		return [
			'id'             => $id,
			'title'          => $title,
			'link'           => esc_url_raw( get_permalink( $id ) ),
			'type'           => $product->get_type(),
			'onSale'         => (bool) $product->is_on_sale(),
			'saveLabel'      => $saving['saveLabel'],
			'percentLabel'   => $saving['percentLabel'],
			'image'          => $image,
			'priceHtml'      => wp_kses( (string) $product->get_price_html(), self::allowedTags() ),
			'rating'         => round( (float) $product->get_average_rating(), 2 ),
			'ratingCount'    => (int) $product->get_rating_count(),

			// Screen-reader text is built here rather than in JS: PHP already has
			// the translations loaded, which keeps @wordpress/i18n out of the
			// frontend bundle entirely.
			// A product nobody has reviewed is not rated zero — it is not rated
			// yet, and saying "0.0 out of 5" to a screen reader would be wrong.
			'ratingLabel'    => $product->get_rating_count() > 0
				? sprintf(
					/* translators: %s: rating out of 5. */
					__( 'Rated %s out of 5', 'b-blocks' ),
					number_format_i18n( round( (float) $product->get_average_rating(), 1 ), 1 )
				)
				: __( 'Not yet rated', 'b-blocks' ),
			'categoriesHtml' => wp_kses( $categories, self::allowedTags() ),
			'sold'           => $sold,
			'soldLabel'      => trim( $a['soldPrefix'] . ' ' . number_format_i18n( $sold ) . $a['soldSuffix'] ),
			'soldPercent'    => (int) min( 100, max( 0, $percent ) ),
			'soldBarLabel'   => sprintf(
				/* translators: %d: percentage of stock sold. */
				__( '%d%% sold', 'b-blocks' ),
				(int) min( 100, max( 0, $percent ) )
			),
			'cartText'       => self::cartLabel( $product, $a ),
			/* translators: %1$s: button text, %2$s: product name. */
			'cartAria'       => sprintf( __( '%1$s: %2$s', 'b-blocks' ), self::cartLabel( $product, $a ), $title ),
			/* translators: %1$s: button text, %2$s: product name. */
			'viewAria'       => sprintf( __( '%1$s: %2$s', 'b-blocks' ), $a['viewButtonText'], $title ),

			// WooCommerce's add-to-cart script only enhances a link that carries
			// these, and only for products it can add in one step; everything
			// else falls through to the product page as an ordinary link.
			'cartAjax'       => $product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock(),
			'cartUrl'        => $cartUrl ? $cartUrl : esc_url_raw( get_permalink( $id ) ),
			'cartClass'      => 'product_type_' . $product->get_type(),
			'sku'            => (string) $product->get_sku(),
			'external'       => $product->is_type( 'external' ),
		];
	}

	/**
	 * One page of products, as a JSON-serializable payload.
	 *
	 * render.php embeds the first page of this and the AJAX endpoint serves
	 * every page after it, so the editor, the initial paint and a filtered swap
	 * all render from an identical structure.
	 *
	 * @param array $a      Resolved attributes.
	 * @param int   $termId Active taxonomy-filter term, 0 for "All".
	 * @param int   $page   1-based page number.
	 * @return array
	 */
	public static function getProducts( array $a, $termId = 0, $page = 1 ) {
		$page = max( 1, (int) $page );

		if ( ! function_exists( 'wc_get_product' ) ) {
			return [
				'products' => [],
				'maxPages' => 0,
				'total'    => 0,
				'page'     => $page,
			];
		}

		$result = self::query( $a, $termId, $page );
		$size   = self::imageSize( $a );

		$products = [];
		foreach ( $result['query']->posts as $post ) {
			$product = wc_get_product( $post );

			if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
				continue;
			}

			$products[] = self::productData( $product, $a, $size );
		}

		return [
			'products' => $products,
			'maxPages' => (int) $result['maxPages'],
			'total'    => (int) $result['total'],
			'page'     => $page,
		];
	}

	/**
	 * Interface strings for the rendered grid.
	 *
	 * Shipped with the payload so the frontend bundle carries no translation
	 * runtime: PHP already has the text domain loaded, and the two that take a
	 * count are substituted client-side with a placeholder swap.
	 *
	 * @return array
	 */
	public static function labels() {
		return [
			'products'   => __( 'Products', 'b-blocks' ),
			'filter'     => __( 'Filter products', 'b-blocks' ),
			'pagination' => __( 'Product pagination', 'b-blocks' ),
			/* translators: %d: page number. */
			'goToPage'   => __( 'Go to page %d', 'b-blocks' ),
			'prevPage'   => __( 'Previous page', 'b-blocks' ),
			'nextPage'   => __( 'Next page', 'b-blocks' ),
			'prev'       => __( 'Prev', 'b-blocks' ),
			'next'       => __( 'Next', 'b-blocks' ),
			/* translators: %d: number of products shown. */
			'showing'    => __( 'Showing %d products.', 'b-blocks' ),
			'error'      => __( 'Products could not be loaded. Please refresh the page and try again.', 'b-blocks' ),
		];
	}

	/**
	 * Terms for the filter bar, flattened for JSON.
	 *
	 * @param array $a Resolved attributes.
	 * @return array
	 */
	public static function filterTerms( array $a ) {
		if ( ! $a['showTaxonomyFilter'] ) {
			return [];
		}

		$args = [
			'taxonomy'   => $a['filterTaxonomy'],
			'hide_empty' => true,
			'number'     => 50,
		];

		// Offer only terms the grid can actually show. A grid limited to Men
		// used to list Women too, and that button always came back empty.
		$limits = [
			'product_cat' => [ $a['productCategories'], $a['categoryMode'] ],
			'product_tag' => [ $a['productTags'], $a['tagMode'] ],
		];

		if ( isset( $limits[ $a['filterTaxonomy'] ] ) ) {
			list( $ids, $mode ) = $limits[ $a['filterTaxonomy'] ];

			if ( ! empty( $ids ) && 'exclude' === $mode ) {
				$args['exclude_tree'] = $ids;
			} elseif ( ! empty( $ids ) ) {
				// Children too: products in Men > Hoodies are in the query when
				// Men is, so Hoodies is a filter that returns something.
				foreach ( $ids as $id ) {
					$children = get_term_children( $id, $a['filterTaxonomy'] );
					if ( ! is_wp_error( $children ) ) {
						$ids = array_merge( $ids, $children );
					}
				}

				$args['include'] = array_values( array_unique( array_map( 'absint', $ids ) ) );
			}
		}

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) ) {
			return [];
		}

		// Two terms can share a name under different parents — Men > Hoodies and
		// Women > Hoodies — and two identical buttons cannot be told apart. Those
		// get their parent's name; unique names are left as they are.
		$counts = array_count_values( wp_list_pluck( $terms, 'name' ) );

		$items = [];
		foreach ( $terms as $term ) {
			$name = $term->name;

			if ( $counts[ $name ] > 1 && $term->parent ) {
				$parent = get_term( $term->parent, $a['filterTaxonomy'] );

				if ( $parent && ! is_wp_error( $parent ) ) {
					/* translators: %1$s: term name, %2$s: parent term name. */
					$name = sprintf( __( '%1$s (%2$s)', 'b-blocks' ), $name, $parent->name );
				}
			}

			$items[] = [
				'id'   => (int) $term->term_id,
				'name' => $name,
			];
		}

		return $items;
	}

	/**
	 * The attribute set handed to the React tree, in the nested shape.
	 *
	 * Everything React reads comes straight from `data-attributes`, so anything
	 * it turns into an element name, a class name or a CSS declaration must be
	 * the value resolveAttributes() already allowlisted or clamped — a raw
	 * `titleTag` of "script" would otherwise become a real <script> element, and
	 * a raw colour could close the CSS declaration Style.js builds.
	 *
	 * Rebuilding from the resolved set rather than patching the raw one also
	 * means a legacy flat post is handed the current nested shape, so the
	 * components never need to know which era a post was saved in.
	 *
	 * @param array $attributes Raw block attributes.
	 * @param array $a          Resolved attributes.
	 * @return array
	 */
	public static function viewAttributes( array $attributes, array $a ) {
		$view = [
			'align'        => $attributes['align'] ?? '',
			'contentOrder' => $a['contentOrder'],
			'advanced'     => $attributes['advanced'] ?? [],
		];

		foreach ( self::NESTED_MAP as $flat => $path ) {
			// Legacy-only keys have no resolved counterpart and nothing reads them.
			if ( ! array_key_exists( $flat, $a ) ) {
				continue;
			}

			self::setPath( $view, $path, $a[ $flat ] );
		}

		// Per-device values come back device-first — container.desktop.prop — the
		// shape the panels read. Boxes are a shorthand per breakpoint in the
		// resolved set, so they are expanded back into the four sides BoxControl
		// edits; plain values go back as they are.
		foreach ( self::DEVICE_MAP as $flat => list( $container, $prop, $kind ) ) {
			foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $device ) {
				$value = $a[ $flat . $device ] ?? '';

				self::setPath(
					$view,
					array_merge( $container, [ strtolower( $device ), $prop ] ),
					'box' === $kind ? self::boxSides( $value ) : $value
				);
			}
		}

		return $view;
	}

	/* ----------------------------------------------------------------------
	 * Server-rendered shell
	 * ------------------------------------------------------------------- */

	/**
	 * Where to send an author whose site has no WooCommerce.
	 *
	 * Downloaded-but-inactive and not-installed-at-all need different pages, and
	 * neither link is worth showing to someone without the capability to act on
	 * it — an empty string tells the editor to render the notice as plain text.
	 *
	 * @return string
	 */
	public static function wooInstallUrl() {
		$isDownloaded = defined( 'WP_PLUGIN_DIR' ) && file_exists( WP_PLUGIN_DIR . '/woocommerce/woocommerce.php' );

		if ( $isDownloaded && current_user_can( 'activate_plugins' ) ) {
			return admin_url( 'plugins.php?s=woocommerce&plugin_status=all' );
		}

		if ( ! $isDownloaded && current_user_can( 'install_plugins' ) ) {
			return admin_url( 'plugin-install.php?tab=search&type=term&s=woocommerce' );
		}

		return '';
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoints
	 * ------------------------------------------------------------------- */

	/**
	 * Attributes posted by the editor or the frontend, put back through the
	 * sanitizer.
	 *
	 * `queryAttr` arrives as a JSON string rather than a nested form field on
	 * purpose: jQuery flattens nested data, which would turn every boolean into
	 * the string "true" or "false" — and "false" is truthy in PHP.
	 *
	 * @return array
	 */
	protected static function postedAttributes() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- callers verify the nonce; the JSON is decoded then fully sanitized by resolveAttributes().
		$raw = isset( $_POST['queryAttr'] ) ? json_decode( wp_unslash( $_POST['queryAttr'] ), true ) : [];

		return self::resolveAttributes( is_array( $raw ) ? $raw : [] );
	}

	/**
	 * Serve one page of product data for the filter bar, Load More, pagination
	 * and the editor preview.
	 */
	public function ajaxQuery() {
		check_ajax_referer( 'wp_ajax', '_wpnonce' );

		$a = self::postedAttributes();

		if ( ! function_exists( 'wc_get_product' ) ) {
			wp_send_json_success(
				[
					'woo'        => false,
					'installUrl' => self::wooInstallUrl(),
					'products'   => [],
					'terms'      => [],
					'maxPages'   => 0,
					'total'      => 0,
					'page'       => 1,
				]
			);
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$termId = absint( $_POST['termId'] ?? 0 );
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$page = max( 1, absint( $_POST['pageNumber'] ?? 1 ) );

		$payload           = self::getProducts( $a, $termId, $page );
		$payload['woo']    = true;
		$payload['terms']  = self::filterTerms( $a );
		// Echoed so an out-of-order response can be recognised and discarded.
		$payload['termId'] = $termId;
		$payload['labels'] = self::labels();

		wp_reset_postdata();

		wp_send_json_success( $payload );
	}

	/**
	 * Editor-only lookups for the async selects and the taxonomy dropdown.
	 *
	 * Gated on `edit_posts` as well as the nonce: this is the only endpoint that
	 * enumerates content, and nothing on the frontend calls it.
	 */
	public function ajaxSearch() {
		check_ajax_referer( 'wp_ajax', '_wpnonce' );

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized', 'b-blocks' ) ] );
		}

		// phpcs:disable WordPress.Security.NonceVerification.Missing -- verified above.
		$type     = sanitize_key( $_POST['type'] ?? '' );
		$search   = sanitize_text_field( wp_unslash( $_POST['search'] ?? '' ) );
		$include  = self::intArray( (array) ( $_POST['include'] ?? [] ) );
		$taxonomy = self::taxonomy( $_POST['taxonomy'] ?? 'product_cat' );
		// phpcs:enable WordPress.Security.NonceVerification.Missing

		if ( 'taxonomies' === $type ) {
			$items = [];

			foreach ( get_object_taxonomies( 'product', 'objects' ) as $tax ) {
				if ( empty( $tax->public ) || empty( $tax->show_ui ) ) {
					continue;
				}

				$items[] = [
					'id'    => $tax->name,
					'label' => $tax->labels->singular_name ? $tax->labels->singular_name : $tax->name,
				];
			}

			wp_send_json_success( [ 'items' => $items ] );
		}

		if ( 'term' === $type ) {
			$args = [
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'number'     => 30,
			];

			if ( ! empty( $include ) ) {
				$args['include'] = $include;
				$args['number']  = count( $include );
			} else {
				$args['search'] = $search;
			}

			$terms = get_terms( $args );
			$items = [];

			if ( ! is_wp_error( $terms ) ) {
				foreach ( $terms as $term ) {
					$items[] = [
						'id'    => (int) $term->term_id,
						'label' => $term->name,
					];
				}
			}

			wp_send_json_success( [ 'items' => $items ] );
		}

		if ( 'product' !== $type ) {
			wp_send_json_error( [ 'message' => __( 'Unsupported search type.', 'b-blocks' ) ] );
		}

		// Private and draft titles only for those who may see other people's
		// products anyway. edit_posts alone — a Contributor — would otherwise
		// be able to list them. The grid itself only ever shows published ones.
		$statuses = current_user_can( 'edit_others_products' ) ? [ 'publish', 'private', 'draft' ] : [ 'publish' ];

		$args = [
			'post_type'           => 'product',
			'post_status'         => $statuses,
			'posts_per_page'      => 30,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
			'orderby'             => 'title',
			'order'               => 'ASC',
		];

		if ( ! empty( $include ) ) {
			$args['post__in']       = $include;
			$args['posts_per_page'] = count( $include );
			$args['orderby']        = 'post__in';
		} else {
			$args['s'] = $search;
		}

		$query = new WP_Query( $args );
		$items = [];

		foreach ( $query->posts as $post ) {
			$items[] = [
				'id'    => (int) $post->ID,
				'label' => html_entity_decode( get_the_title( $post ), ENT_QUOTES, get_bloginfo( 'charset' ) ),
			];
		}

		wp_reset_postdata();

		wp_send_json_success( [ 'items' => $items ] );
	}
}

new WooProductGrid();
