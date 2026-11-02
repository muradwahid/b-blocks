<?php
/**
 * Woo Product Carousel — shared server logic.
 *
 * The block is dynamic and renders with React on both sides: render.php puts
 * the products into the wrapper's `data-attributes`, and the editor asks for
 * the same payload over AJAX. Both run the *same* query builder below, so the
 * editor preview and the page always show the same products.
 *
 * Security model:
 *   - Both endpoints are editor-only: they verify the `wp_ajax` nonce and
 *     require `edit_posts`. The frontend never calls them — every product a
 *     carousel shows is already in its markup.
 *   - Query settings arriving over AJAX are untrusted: everything goes back
 *     through resolve(), which allowlists enums, casts IDs with absint() and
 *     caps the product count at MAX_PRODUCTS.
 *   - The two HTML fragments WooCommerce produces (price, category links are
 *     built from plain values instead) go through wp_kses() before they leave.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

use WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductCarousel {

	/** Hard ceiling on the products one carousel loads. */
	const MAX_PRODUCTS = 48;

	const ORDERBY     = [ 'date', 'title', 'price', 'popularity', 'rating', 'menu_order', 'rand', 'id' ];
	const ORDER       = [ 'ASC', 'DESC' ];
	const QUERY_TYPES = [ 'custom', 'related' ];
	const TAX_MODES   = [ 'include', 'exclude' ];

	/** WooCommerce core brands (WooCommerce 9.6+); optional everywhere. */
	const BRAND_TAXONOMY = 'product_brand';

	public function __construct() {
		add_action( 'wp_ajax_bb_wpc_query', [ $this, 'ajaxQuery' ] );
		add_action( 'wp_ajax_bb_wpc_search', [ $this, 'ajaxSearch' ] );
	}

	/* ----------------------------------------------------------------------
	 * Sanitizing
	 * ------------------------------------------------------------------- */

	/**
	 * @param mixed  $value    Raw value.
	 * @param array  $allowed  Allowed values.
	 * @param string $fallback Used when $value is not allowed.
	 * @return string
	 */
	protected static function pickFrom( $value, array $allowed, $fallback ) {
		return is_string( $value ) && in_array( $value, $allowed, true ) ? $value : $fallback;
	}

	/**
	 * @param mixed $value Raw value.
	 * @param int   $min   Minimum.
	 * @param int   $max   Maximum.
	 * @param int   $fallback Used when $value is not numeric.
	 * @return int
	 */
	protected static function clampInt( $value, $min, $max, $fallback ) {
		if ( ! is_numeric( $value ) ) {
			return $fallback;
		}

		return (int) min( $max, max( $min, (int) $value ) );
	}

	/**
	 * Unique positive IDs.
	 *
	 * @param mixed $value Raw list.
	 * @return int[]
	 */
	protected static function intArray( $value ) {
		if ( ! is_array( $value ) ) {
			return [];
		}

		// intval, not absint: absint would turn a stray -2 into post 2.
		$ids = array_filter(
			array_map( 'intval', $value ),
			static function ( $id ) {
				return $id > 0;
			}
		);

		return array_values( array_unique( $ids ) );
	}

	/**
	 * Whether the store has WooCommerce's brands taxonomy.
	 *
	 * @return bool
	 */
	public static function hasBrands() {
		return taxonomy_exists( self::BRAND_TAXONOMY );
	}

	/**
	 * An image size WordPress actually knows, else `full`.
	 *
	 * @param mixed $size Raw size slug.
	 * @return string
	 */
	protected static function imageSize( $size ) {
		$size = is_string( $size ) ? sanitize_key( $size ) : '';

		if ( 'full' === $size || in_array( $size, get_intermediate_image_sizes(), true ) ) {
			return $size;
		}

		return 'full';
	}

	/**
	 * The block's `query` attribute (plus the image size and the product being
	 * viewed), clamped and allowlisted.
	 *
	 * @param array  $query            Raw `query` attribute.
	 * @param string $imageSize        Raw `layout.imageSize`.
	 * @param int    $currentProductId Product being viewed, 0 elsewhere.
	 * @return array
	 */
	public static function resolve( $query, $imageSize = 'full', $currentProductId = 0 ) {
		$q = is_array( $query ) ? $query : [];

		$order = is_string( $q['order'] ?? null ) ? strtoupper( $q['order'] ) : 'DESC';

		return [
			'type'             => self::pickFrom( $q['type'] ?? 'custom', self::QUERY_TYPES, 'custom' ),
			'orderBy'          => self::pickFrom( $q['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'            => self::pickFrom( $order, self::ORDER, 'DESC' ),
			'perPage'          => self::clampInt( $q['perPage'] ?? 4, 1, self::MAX_PRODUCTS, 4 ),
			'offset'           => self::clampInt( $q['offset'] ?? 0, 0, 10000, 0 ),
			'include'          => self::intArray( $q['include'] ?? [] ),
			'exclude'          => self::intArray( $q['exclude'] ?? [] ),
			'categoryMode'     => self::pickFrom( $q['categoryMode'] ?? 'include', self::TAX_MODES, 'include' ),
			'categories'       => self::intArray( $q['categories'] ?? [] ),
			'tagMode'          => self::pickFrom( $q['tagMode'] ?? 'include', self::TAX_MODES, 'include' ),
			'tags'             => self::intArray( $q['tags'] ?? [] ),
			'brandMode'        => self::pickFrom( $q['brandMode'] ?? 'include', self::TAX_MODES, 'include' ),
			// Saved brand IDs are dropped, not queried, when the taxonomy is gone.
			'brands'           => self::hasBrands() ? self::intArray( $q['brands'] ?? [] ) : [],
			'imageSize'        => self::imageSize( $imageSize ),
			'currentProductId' => absint( $currentProductId ),
		];
	}

	/* ----------------------------------------------------------------------
	 * Query
	 * ------------------------------------------------------------------- */

	/**
	 * Mirror WooCommerce's own catalog loops: no catalog-hidden products, and
	 * no out-of-stock ones when the store hides them.
	 *
	 * @return array tax_query clause.
	 */
	protected static function visibilityClause() {
		$hidden = [ 'exclude-from-catalog' ];

		if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
			$hidden[] = 'outofstock';
		}

		return [
			'taxonomy' => 'product_visibility',
			'field'    => 'name',
			'terms'    => $hidden,
			'operator' => 'NOT IN',
		];
	}

	/**
	 * WP_Query args shared by every mode.
	 *
	 * @param int $perPage Products to load.
	 * @return array
	 */
	protected static function baseArgs( $perPage ) {
		return [
			'post_type'           => 'product',
			// Published only: never private, draft or password-protected products.
			'post_status'         => 'publish',
			'has_password'        => false,
			'posts_per_page'      => $perPage,
			'ignore_sticky_posts' => true,
			// A carousel never pages, so the row count is not needed.
			'no_found_rows'       => true,
		];
	}

	/**
	 * Sanitized WP_Query args for the Custom Query mode.
	 *
	 * @param array $a Resolved query, from resolve().
	 * @return array
	 */
	public static function buildQueryArgs( array $a ) {
		$args = self::baseArgs( $a['perPage'] );

		if ( $a['offset'] > 0 ) {
			$args['offset'] = $a['offset'];
		}

		$taxQuery = [
			'relation' => 'AND',
			self::visibilityClause(),
		];

		$taxonomies = [
			'product_cat'        => [ $a['categories'], $a['categoryMode'] ],
			'product_tag'        => [ $a['tags'], $a['tagMode'] ],
			self::BRAND_TAXONOMY => [ $a['brands'], $a['brandMode'] ],
		];

		foreach ( $taxonomies as $taxonomy => list( $terms, $mode ) ) {
			if ( empty( $terms ) ) {
				continue;
			}

			$taxQuery[] = [
				'taxonomy' => $taxonomy,
				'field'    => 'term_id',
				'terms'    => $terms,
				'operator' => 'exclude' === $mode ? 'NOT IN' : 'IN',
			];
		}

		$args['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- catalog visibility requires it, as in WooCommerce core.

		if ( ! empty( $a['include'] ) ) {
			$args['post__in'] = $a['include'];
		}

		if ( ! empty( $a['exclude'] ) ) {
			$args['post__not_in'] = $a['exclude'];
		}

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
		 * Filter the product-carousel query args.
		 *
		 * @param array $args WP_Query args.
		 * @param array $a    Resolved query settings.
		 */
		return apply_filters( 'b_blocks_woo_product_carousel_query', $args, $a );
	}

	/**
	 * The query for the settings, whichever mode they are in.
	 *
	 * Related Products uses WooCommerce's related logic on a single product
	 * page. Anywhere else there is nothing to be related to, so it falls back to
	 * the newest products (the inspector says so) rather than an empty carousel.
	 *
	 * @param array $a Resolved query, from resolve().
	 * @return WP_Query
	 */
	public static function query( array $a ) {
		if ( 'related' !== $a['type'] ) {
			return new WP_Query( self::buildQueryArgs( $a ) );
		}

		$args = self::baseArgs( $a['perPage'] );

		if ( ! $a['currentProductId'] || ! function_exists( 'wc_get_related_products' ) ) {
			$args['tax_query']    = [ self::visibilityClause() ]; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- catalog visibility, as above.
			$args['post__not_in'] = $a['exclude'];
			$args['orderby']      = 'date';
			$args['order']        = 'DESC';

			return new WP_Query( $args );
		}

		$ids = array_map(
			'absint',
			(array) wc_get_related_products( $a['currentProductId'], $a['perPage'], array_merge( [ $a['currentProductId'] ], $a['exclude'] ) )
		);

		// An empty post__in is ignored by WP_Query, which would widen the
		// query to every product — [0] keeps it correctly empty.
		$args['post__in'] = $ids ? $ids : [ 0 ];
		$args['orderby']  = 'post__in';

		return new WP_Query( $args );
	}

	/* ----------------------------------------------------------------------
	 * Data
	 * ------------------------------------------------------------------- */

	/**
	 * Allowlist for WooCommerce's price HTML: wp_kses_post() drops <bdi>, which
	 * WooCommerce wraps every formatted amount in.
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
	 * Everything the React card needs for one product.
	 *
	 * @param \WC_Product $product Product.
	 * @param string      $size    Image size.
	 * @return array
	 */
	protected static function productData( $product, $size ) {
		$id    = (int) $product->get_id();
		$title = $product->get_name();

		$image   = [
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
				$alt   = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
				$image = [
					'url'    => esc_url_raw( $src[0] ),
					'width'  => (int) $src[1],
					'height' => (int) $src[2],
					'srcset' => (string) wp_get_attachment_image_srcset( $imageId, $size ),
					'sizes'  => (string) wp_get_attachment_image_sizes( $imageId, $size ),
					'alt'    => ( is_string( $alt ) && '' !== trim( $alt ) ) ? trim( wp_strip_all_tags( $alt ) ) : $title,
				];
			}
		}

		if ( '' === $image['url'] && function_exists( 'wc_placeholder_img_src' ) ) {
			$image['url'] = esc_url_raw( wc_placeholder_img_src( $size ) );
		}

		$categories = [];
		$terms      = get_the_terms( $id, 'product_cat' );

		if ( is_array( $terms ) ) {
			foreach ( $terms as $term ) {
				$link = get_term_link( $term );

				if ( is_wp_error( $link ) ) {
					continue;
				}

				$categories[] = [
					'name' => html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' ),
					'link' => esc_url_raw( $link ),
				];
			}
		}

		$rating = round( (float) $product->get_average_rating(), 2 );
		$count  = (int) $product->get_rating_count();

		// `woocommerce_product_add_to_cart_url` is filterable, so the URL is vetted here as in Woo Product Grid.
		$cartUrl = esc_url_raw( $product->add_to_cart_url() );

		return [
			'id'          => $id,
			'title'       => $title,
			'link'        => esc_url_raw( get_permalink( $id ) ),
			// is_on_sale() covers scheduled sale dates and variable products
			// with any variation on sale.
			'onSale'      => (bool) $product->is_on_sale(),
			'image'       => $image,
			'priceHtml'   => wp_kses( (string) $product->get_price_html(), self::allowedTags() ),
			'categories'  => $categories,
			'rating'      => $rating,
			'ratingCount' => $count,
			'ratingLabel' => $count > 0
				? sprintf(
					/* translators: %s: rating out of 5. */
					__( 'Rated %s out of 5', 'b-blocks' ),
					number_format_i18n( round( $rating, 1 ), 1 )
				)
				: '',
			// WooCommerce's label for the type: "Add to cart", "Select options", "View products"...
			'cartText'    => html_entity_decode( (string) $product->add_to_cart_text(), ENT_QUOTES, 'UTF-8' ),
			// WooCommerce's add-to-cart script only enhances a link that carries these, and only for
			// products it can add in one step; anything else is an ordinary link to the product page.
			'cartAjax'    => $product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock(),
			'cartUrl'     => $cartUrl ? $cartUrl : esc_url_raw( get_permalink( $id ) ),
			'cartClass'   => 'product_type_' . sanitize_html_class( $product->get_type() ),
			// Which of the author's cart texts applies, as WooCommerce picks its own: simple products can be
			// added (or only read about), variable ones need options. Other types keep WooCommerce's text.
			'cartKind'    => $product->is_type( 'variable' )
				? ( $product->is_purchasable() ? 'options' : 'read' )
				: ( $product->is_type( 'simple' ) ? ( $product->is_purchasable() && $product->is_in_stock() ? 'add' : 'read' ) : '' ),
			'sku'         => (string) $product->get_sku(),
		];
	}

	/**
	 * The products for a carousel.
	 *
	 * @param array $a Resolved query, from resolve().
	 * @return array[]
	 */
	public static function getProducts( array $a ) {
		if ( ! function_exists( 'wc_get_product' ) ) {
			return [];
		}

		$query = self::query( $a );

		// One query for every thumbnail instead of one per card.
		update_post_thumbnail_cache( $query );

		$products = [];
		foreach ( $query->posts as $post ) {
			$product = wc_get_product( $post );

			if ( $product && is_a( $product, 'WC_Product' ) ) {
				$products[] = self::productData( $product, $a['imageSize'] );
			}
		}

		wp_reset_postdata();

		return $products;
	}

	/**
	 * Interface strings, shipped with the payload so the frontend bundle needs
	 * no translation runtime. Placeholders are swapped client-side.
	 *
	 * @return array
	 */
	public static function labels() {
		return [
			'carousel'     => __( 'Products', 'b-blocks' ),
			'roleCarousel' => __( 'carousel', 'b-blocks' ),
			'roleSlide'    => __( 'slide', 'b-blocks' ),
			'prev'         => __( 'Previous products', 'b-blocks' ),
			'next'         => __( 'Next products', 'b-blocks' ),
			'first'        => __( 'This is the first slide', 'b-blocks' ),
			'last'         => __( 'This is the last slide', 'b-blocks' ),
			/* translators: %d: slide number. */
			'goTo'         => __( 'Go to slide %d', 'b-blocks' ),
			/* translators: 1: slide number, 2: number of slides. */
			'slideOf'      => __( '%1$d of %2$d', 'b-blocks' ),
			/* translators: 1: button text, 2: product name. */
			'buttonAria'   => __( '%1$s: %2$s', 'b-blocks' ),
			'pause'        => __( 'Pause autoplay', 'b-blocks' ),
			'play'         => __( 'Play autoplay', 'b-blocks' ),
		];
	}

	/**
	 * Where to send an author whose site has no WooCommerce; empty when they
	 * cannot act on it.
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
	 * AJAX endpoints (editor only)
	 * ------------------------------------------------------------------- */

	/**
	 * Products for the editor preview.
	 *
	 * `query` arrives as a JSON string rather than nested form fields: nested
	 * fields would turn every boolean into "true"/"false", and "false" is
	 * truthy in PHP.
	 */
	public function ajaxQuery() {
		check_ajax_referer( 'wp_ajax', '_wpnonce' );

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized', 'b-blocks' ) ], 403 );
		}

		if ( ! function_exists( 'wc_get_product' ) ) {
			wp_send_json_success(
				[
					'woo'        => false,
					'installUrl' => self::wooInstallUrl(),
					'products'   => [],
				]
			);
		}

		// phpcs:disable WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- verified above; the JSON is decoded then fully sanitized by resolve().
		$query = isset( $_POST['query'] ) ? json_decode( wp_unslash( $_POST['query'] ), true ) : [];
		$size  = isset( $_POST['imageSize'] ) ? sanitize_key( wp_unslash( $_POST['imageSize'] ) ) : 'full';
		$id    = absint( $_POST['currentProductId'] ?? 0 );
		// phpcs:enable

		if ( $id && 'product' !== get_post_type( $id ) ) {
			$id = 0;
		}

		wp_send_json_success(
			[
				'woo'       => true,
				'hasBrands' => self::hasBrands(),
				'products'  => self::getProducts( self::resolve( $query, $size, $id ) ),
				'labels'    => self::labels(),
			]
		);
	}

	/**
	 * Lookups for the async selects: products, or terms of one of the three
	 * product taxonomies the panel offers.
	 */
	public function ajaxSearch() {
		check_ajax_referer( 'wp_ajax', '_wpnonce' );

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized', 'b-blocks' ) ], 403 );
		}

		// phpcs:disable WordPress.Security.NonceVerification.Missing -- verified above.
		$type     = sanitize_key( $_POST['type'] ?? '' );
		$search   = sanitize_text_field( wp_unslash( $_POST['search'] ?? '' ) );
		$include  = self::intArray( (array) ( $_POST['include'] ?? [] ) );
		$taxonomy = self::pickFrom( sanitize_key( $_POST['taxonomy'] ?? '' ), [ 'product_cat', 'product_tag', self::BRAND_TAXONOMY ], '' );
		// phpcs:enable

		if ( 'term' === $type ) {
			if ( '' === $taxonomy || ! taxonomy_exists( $taxonomy ) ) {
				wp_send_json_success( [ 'items' => [] ] );
			}

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
						'label' => html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' ),
					];
				}
			}

			wp_send_json_success( [ 'items' => $items ] );
		}

		if ( 'product' !== $type ) {
			wp_send_json_error( [ 'message' => __( 'Unsupported search type.', 'b-blocks' ) ] );
		}

		// Private and draft titles only for those who may see other people's
		// products anyway; the carousel itself only shows published ones.
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

new WooProductCarousel();
