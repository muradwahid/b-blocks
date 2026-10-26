<?php
/**
 * Woo Product Details — shared server logic.
 *
 * Resolves the product in context and renders its Description, Additional
 * information and Reviews through WooCommerce's own tabs (the
 * `woocommerce_product_tabs` filter and each tab's callback, so whatever a
 * theme or plugin changed there carries over).
 *
 * Loaded by plugin.php: WooCommerce's own tabs may render before the block,
 * and they leave Reviews to it (leaveReviews()).
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductDetails {

	/** WooCommerce's core tab keys, and the option that shows each. Third-party tabs are left out. */
	const TABS = [
		'description'            => 'showDescription',
		'additional_information' => 'showAdditional',
		'reviews'                => 'showReviews',
	];

	/** Headings WooCommerce prints at the top of a panel; the tab already names it. */
	const HEADINGS = [
		'description'            => 'woocommerce_product_description_heading',
		'additional_information' => 'woocommerce_product_additional_information_heading',
	];

	/** @var array Products whose tabs are rendering: the block in its own description stops there. */
	protected static $rendering = [];

	/** @var int Blocks rendered on this page, for ids of their own after the first. */
	protected static $instances = 0;

	/** @var bool A Reviews tab is on the page: its form works by fixed ids (#respond, #rating), so only one may be. */
	protected static $reviewsRendered = false;

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
	 * What the block shows, for data-attributes: the settings, with each tab's
	 * title, ids and WooCommerce's rendered content (view.js draws them). None
	 * when no tab has anything.
	 *
	 * @param array       $attributes Block attributes.
	 * @param \WC_Product $product    Product.
	 * @return array|null
	 */
	public static function render( array $attributes, $product ) {
		$options = self::options( $attributes );
		$wanted  = array_keys( array_filter( $options ) );
		if ( ! $wanted ) {
			return null;
		}

		$productId = $product->get_id();
		if ( isset( self::$rendering[ $productId ] ) ) {
			return null;
		}

		// WooCommerce's own tabs on the page print the bare ids: they are the first. Reviews stay
		// theirs only when no block of these takes it (leaveReviews()).
		if ( ! self::$instances && self::wooTabsOnPage() ) {
			self::$instances       = 1;
			self::$reviewsRendered = ! self::takesReviews();
		}

		++self::$instances;
		$suffix = 1 === self::$instances ? '' : '-' . self::$instances;

		self::$rendering[ $productId ] = true;
		try {
			$panels = self::panels( $product, $wanted, $suffix );
		} finally {
			unset( self::$rendering[ $productId ] );
		}

		if ( ! $panels ) {
			return null;
		}

		$view = $attributes;
		$css  = $view['advanced']['css'] ?? null;
		// Style values (colours, shadows, sizes…) go into the block's CSS: without braces they can't close its #id rule and style the rest of the page.
		foreach ( [ 'tabTitle', 'content', 'advanced' ] as $group ) {
			if ( isset( $view[ $group ] ) && is_array( $view[ $group ] ) ) {
				array_walk_recursive( $view[ $group ], [ __CLASS__, 'cssValue' ] );
			}
		}
		// The Advanced tab's free-form CSS only from authors who may publish unfiltered HTML.
		if ( null !== $css ) {
			$view['advanced']['css'] = \BBlocks\Inc\Sanitize::authorCanUnfilteredHtml() ? $css : '';
		}

		$view['product'] = [ 'tabs' => [] ];
		foreach ( $panels as $key => $panel ) {
			$view['product']['tabs'][] = [
				'key'     => $key,
				'title'   => $panel['title'],
				'tabId'   => $panel['tabId'],
				'panelId' => $panel['panelId'],
				'html'    => $panel['html'],
			];
		}
		$view['i18n'] = [ 'tablist' => __( 'Product details', 'b-blocks' ) ];

		return $view;
	}

	/**
	 * Whether WooCommerce prints its own tabs on this page: its Product Details
	 * (or classic single product) block in the block template, the
	 * [product_page] shortcode in the page, or a classic theme's single product page.
	 *
	 * @return bool
	 */
	protected static function wooTabsOnPage() {
		$template = $GLOBALS['_wp_current_template_content'] ?? null;
		if ( is_string( $template ) && ( has_block( 'woocommerce/product-details', $template ) || has_block( 'woocommerce/legacy-template', $template ) ) ) {
			return true;
		}

		// The [product_page] shortcode prints a classic single product, tabs included.
		if ( is_singular() && has_shortcode( (string) get_post_field( 'post_content', get_queried_object_id() ), 'product_page' ) ) {
			return true;
		}

		return is_singular( 'product' ) && ! wp_is_block_theme() && false !== has_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs' );
	}

	/**
	 * `woocommerce_product_tabs`: WooCommerce's own tabs (its Product Details
	 * block, a classic theme's) leave Reviews out when one of these blocks on
	 * the page shows them; this block's own call keeps it. Not while the block
	 * is switched off (bBlocks dashboard): saved ones then render nothing.
	 *
	 * @param mixed $tabs Product tabs.
	 * @return mixed
	 */
	public static function leaveReviews( $tabs ) {
		if ( ! self::$rendering && is_array( $tabs ) && isset( $tabs['reviews'] ) && \WP_Block_Type_Registry::get_instance()->is_registered( 'b-blocks/woo-product-details' ) && self::takesReviews() ) {
			unset( $tabs['reviews'] );
		}
		return $tabs;
	}

	/**
	 * Whether one of these blocks with its Reviews tab on is in this page's
	 * template (its template parts and synced patterns included) or content.
	 *
	 * @return bool
	 */
	protected static function takesReviews() {
		static $takes = null;
		if ( null === $takes ) {
			$sources = [ $GLOBALS['_wp_current_template_content'] ?? '' ];
			if ( is_singular() ) {
				$sources[] = get_post_field( 'post_content', get_queried_object_id() );
			}

			$takes = false;
			foreach ( $sources as $source ) {
				if ( is_string( $source ) && '' !== $source && self::reviewsOn( parse_blocks( $source ) ) ) {
					$takes = true;
					break;
				}
			}
		}
		return $takes;
	}

	/**
	 * Whether these parsed blocks hold one of these blocks with Reviews on,
	 * looking into template parts and synced patterns too.
	 *
	 * @param array $blocks Parsed blocks.
	 * @param int   $depth  Nesting reached (a pattern holding itself stops at 10).
	 * @return bool
	 */
	protected static function reviewsOn( array $blocks, $depth = 0 ) {
		if ( $depth > 10 ) {
			return false;
		}

		foreach ( $blocks as $block ) {
			$name  = $block['blockName'] ?? '';
			$attrs = self::arr( $block['attrs'] ?? null );
			if ( 'b-blocks/woo-product-details' === $name && self::options( $attrs )['reviews'] ) {
				return true;
			}

			// What a template part or a synced pattern holds.
			$inner = $block['innerBlocks'] ?? [];
			if ( 'core/template-part' === $name && ! empty( $attrs['slug'] ) ) {
				$part  = get_block_template( ( $attrs['theme'] ?? get_stylesheet() ) . '//' . $attrs['slug'], 'wp_template_part' );
				$inner = $part ? parse_blocks( $part->content ) : [];
			} elseif ( 'core/block' === $name && ! empty( $attrs['ref'] ) ) {
				$inner = parse_blocks( (string) get_post_field( 'post_content', (int) $attrs['ref'] ) );
			}

			if ( $inner && self::reviewsOn( $inner, $depth + 1 ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * The enabled tabs' content, rendered as WooCommerce renders its own: with
	 * the product set up as the global post and product (its templates read
	 * them), then everything put back as it was.
	 *
	 * @param \WC_Product $product Product.
	 * @param string[]    $wanted  Enabled tab keys.
	 * @param string      $suffix  Id suffix for this block ('' for the first).
	 * @return array
	 */
	protected static function panels( $product, array $wanted, $suffix ) {
		global $wp_query;

		$saved = [
			'post'            => $GLOBALS['post'] ?? null,
			'product'         => $GLOBALS['product'] ?? null,
			'withcomments'    => $GLOBALS['withcomments'] ?? null,
			'comment'         => $GLOBALS['comment'] ?? null,
			'overriddenCpage' => $GLOBALS['overridden_cpage'] ?? null,
			'more'            => $GLOBALS['more'] ?? null,
			'query'           => $wp_query instanceof \WP_Query ? [
				'comments'              => $wp_query->comments,
				'comment_count'         => $wp_query->comment_count,
				'max_num_comment_pages' => $wp_query->max_num_comment_pages,
				'comments_by_type'      => $wp_query->comments_by_type ?? null,
				'cpage'                 => $wp_query->get( 'cpage' ),
			] : null,
		];

		$GLOBALS['post'] = get_post( $product->get_id() );
		setup_postdata( $GLOBALS['post'] );
		$GLOBALS['product'] = $product;
		// The whole description, as on the product's own page: off it, setup_postdata() stops at <!--more-->.
		$GLOBALS['more'] = 1;

		$panels = [];
		try {
			$tabs = apply_filters( 'woocommerce_product_tabs', [] );

			foreach ( is_array( $tabs ) ? $tabs : [] as $key => $tab ) {
				if ( ! in_array( $key, $wanted, true ) || ! is_array( $tab ) || empty( $tab['callback'] ) || ! is_callable( $tab['callback'] ) ) {
					continue;
				}
				if ( 'reviews' === $key && self::$reviewsRendered ) {
					continue;
				}

				$html = self::tabContent( $key, $tab );
				if ( '' === trim( $html ) ) {
					continue;
				}

				// The title as WooCommerce prints it (tabs.php), as plain text: React prints it as text.
				$title = (string) apply_filters( 'woocommerce_product_' . $key . '_tab_title', $tab['title'] ?? '', $key );
				$title = trim( html_entity_decode( wp_strip_all_tags( wp_check_invalid_utf8( $title ) ), ENT_QUOTES, get_bloginfo( 'charset' ) ) );
				if ( '' === $title ) {
					$title = self::defaultTitle( $key );
				}

				if ( 'reviews' === $key ) {
					self::$reviewsRendered = true;
				}

				// Reviews are on the page once, so always under WooCommerce's own ids (#tab-reviews links).
				$keySuffix      = 'reviews' === $key ? '' : $suffix;
				$panels[ $key ] = [
					'title'   => $title,
					'html'    => $html,
					'tabId'   => 'tab-title-' . $key . $keySuffix,
					'panelId' => 'tab-' . $key . $keySuffix,
				];
			}
		} finally {
			self::restore( $saved );
		}

		// The review form's star rating and its checks.
		if ( isset( $panels['reviews'] ) && function_exists( 'wc_review_ratings_enabled' ) && wc_review_ratings_enabled() ) {
			self::enqueueReviewScript();
		}

		return $panels;
	}

	/**
	 * WooCommerce's single product script, which draws the review form's
	 * stars. It registers its scripts on wp_enqueue_scripts: a block theme
	 * renders its template before that, a classic theme after.
	 */
	protected static function enqueueReviewScript() {
		if ( did_action( 'wp_enqueue_scripts' ) ) {
			self::enqueueRegisteredReviewScript();
		} elseif ( false === has_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueueRegisteredReviewScript' ] ) ) {
			add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueueRegisteredReviewScript' ], 20 );
		}
	}

	/**
	 * The script, once WooCommerce has registered it.
	 */
	public static function enqueueRegisteredReviewScript() {
		if ( wp_script_is( 'wc-single-product', 'registered' ) ) {
			wp_enqueue_script( 'wc-single-product' );
		}
	}

	/**
	 * One tab's content: its callback's output, without the heading
	 * WooCommerce puts above the description and the attributes.
	 *
	 * @param string $key Tab key.
	 * @param array  $tab Tab, from `woocommerce_product_tabs`.
	 * @return string
	 */
	protected static function tabContent( $key, array $tab ) {
		$heading     = self::HEADINGS[ $key ] ?? '';
		$hideHeading = $heading && false === has_filter( $heading, '__return_empty_string' );
		if ( $hideHeading ) {
			add_filter( $heading, '__return_empty_string', 999 );
		}

		// comments_template() renders only on single posts and pages unless asked to.
		if ( 'reviews' === $key ) {
			$GLOBALS['withcomments'] = true;
		}

		ob_start();
		try {
			call_user_func( $tab['callback'], $key, $tab );
		} finally {
			$html = (string) ob_get_clean();
			if ( $hideHeading ) {
				remove_filter( $heading, '__return_empty_string', 999 );
			}
		}

		return $html;
	}

	/**
	 * Puts back the globals panels() changed: the post (and with it the
	 * product WooCommerce sets up for it), then the product, and what
	 * comments_template() leaves in the main query.
	 *
	 * @param array $saved Saved state.
	 */
	protected static function restore( array $saved ) {
		global $wp_query;

		if ( $saved['post'] instanceof \WP_Post ) {
			$GLOBALS['post'] = $saved['post'];
			setup_postdata( $saved['post'] );
		} else {
			unset( $GLOBALS['post'] );
		}

		if ( null !== $saved['product'] ) {
			$GLOBALS['product'] = $saved['product'];
		} else {
			unset( $GLOBALS['product'] );
		}

		foreach ( [ 'withcomments' => 'withcomments', 'comment' => 'comment', 'overriddenCpage' => 'overridden_cpage', 'more' => 'more' ] as $from => $global ) {
			if ( null !== $saved[ $from ] ) {
				$GLOBALS[ $global ] = $saved[ $from ];
			} else {
				unset( $GLOBALS[ $global ] );
			}
		}

		if ( $saved['query'] && $wp_query instanceof \WP_Query ) {
			$wp_query->comments              = $saved['query']['comments'];
			$wp_query->comment_count         = $saved['query']['comment_count'];
			$wp_query->max_num_comment_pages = $saved['query']['max_num_comment_pages'];
			$wp_query->comments_by_type      = $saved['query']['comments_by_type'];
			$wp_query->set( 'cpage', $saved['query']['cpage'] );
		}
	}

	/**
	 * A tab's title when a filter left it empty.
	 *
	 * @param string $key Tab key.
	 * @return string
	 */
	protected static function defaultTitle( $key ) {
		switch ( $key ) {
			case 'description':
				return __( 'Description', 'b-blocks' );
			case 'additional_information':
				return __( 'Additional information', 'b-blocks' );
			default:
				return __( 'Reviews', 'b-blocks' );
		}
	}

	/**
	 * A style value without the braces that would end the block's CSS rule.
	 *
	 * @param mixed $value Attribute value, changed in place.
	 */
	public static function cssValue( &$value ) {
		if ( is_string( $value ) ) {
			$value = str_replace( [ '{', '}' ], '', $value );
		}
	}

	/** An array, or an empty one. */
	protected static function arr( $value ) {
		return is_array( $value ) ? $value : [];
	}

	/**
	 * Which tabs are on (all are by default).
	 *
	 * @param array $attributes Block attributes.
	 * @return array
	 */
	public static function options( array $attributes ) {
		$options = self::arr( $attributes['options'] ?? null );
		$out     = [];
		foreach ( self::TABS as $key => $option ) {
			$out[ $key ] = false !== ( $options[ $option ] ?? true );
		}
		return $out;
	}
}

add_filter( 'woocommerce_product_tabs', [ WooProductDetails::class, 'leaveReviews' ], 98 );
