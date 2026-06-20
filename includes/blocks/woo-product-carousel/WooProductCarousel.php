<?php
/**
 * Woo Product Carousel — shared server logic.
 *
 * Provides attribute sanitization, WooCommerce query building (including
 * featured / on-sale / best-selling / top-rated product types), product-card
 * markup rendering, the carousel JSON config, and a hardened add-to-cart AJAX
 * endpoint (`bb_wpc_add_to_cart`) used by the frontend `view.js` for simple
 * products.
 *
 * Security model for `bb_wpc_add_to_cart`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - product_id sanitized with absint() and validated against wc_get_product().
 *   - Only purchasable, in-stock, simple/non-variable products are added.
 *   - All responses use wp_send_json_success / wp_send_json_error.
 *
 * All card output is escaped (esc_html / esc_url / esc_attr / wp_kses_post).
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooProductCarousel {

	/**
	 * Allowed orderby values (carousel-specific, includes price-desc).
	 *
	 * @var string[]
	 */
	const ORDERBY = [ 'date', 'popularity', 'rating', 'price', 'price-desc', 'title', 'rand' ];

	/**
	 * Allowed order values (uppercased).
	 *
	 * @var string[]
	 */
	const ORDER = [ 'ASC', 'DESC' ];

	/**
	 * Allowed product types.
	 *
	 * @var string[]
	 */
	const TYPES = [ 'all', 'featured', 'on_sale', 'best_selling', 'top_rated' ];

	/**
	 * Allowed aspect ratios.
	 *
	 * @var string[]
	 */
	const RATIOS = [ '3/4', '1/1', '4/3', '16/9' ];

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_wpc_add_to_cart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_ajax_nopriv_bb_wpc_add_to_cart', [ $this, 'ajaxAddToCart' ] );
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
			$id = absint( $item );
			if ( $id > 0 ) {
				$out[] = $id;
			}
		}
		return array_values( array_unique( $out ) );
	}

	/**
	 * Normalize and sanitize the full attribute set into a safe, typed array.
	 *
	 * @param array $attributes Raw block attributes.
	 * @return array
	 */
	public static function resolveAttributes( array $attributes ) {
		$spv       = (array) ( $attributes['slidesPerView'] ?? [] );
		$titleFont = (array) ( $attributes['titleFontSize'] ?? [] );

		$saleBadgeLabel = isset( $attributes['saleBadgeLabel'] ) ? wp_strip_all_tags( (string) $attributes['saleBadgeLabel'] ) : '';
		$saleBadgeLabel = '' !== trim( $saleBadgeLabel ) ? $saleBadgeLabel : __( 'Sale', 'b-blocks' );

		$addToCartLabel = isset( $attributes['addToCartLabel'] ) ? wp_strip_all_tags( (string) $attributes['addToCartLabel'] ) : '';
		$addToCartLabel = '' !== trim( $addToCartLabel ) ? $addToCartLabel : __( 'Add to Cart', 'b-blocks' );

		$noProductsMessage = isset( $attributes['noProductsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductsMessage'] ) : '';
		$noProductsMessage = '' !== trim( $noProductsMessage ) ? $noProductsMessage : __( 'No products found.', 'b-blocks' );

		$allowedWeights = [ 400, 500, 600, 700, 800 ];
		$titleWeight    = (int) ( $attributes['titleFontWeight'] ?? 600 );
		if ( ! in_array( $titleWeight, $allowedWeights, true ) ) {
			$titleWeight = 600;
		}

		return [
			'productsToShow'    => self::clampInt( $attributes['productsToShow'] ?? 8, 1, 24, 8 ),
			'orderBy'           => self::pickFrom( $attributes['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'             => self::pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'desc' ) ), self::ORDER, 'DESC' ),
			'productType'       => self::pickFrom( $attributes['productType'] ?? 'all', self::TYPES, 'all' ),
			'productCategories' => self::intArray( $attributes['productCategories'] ?? [] ),
			'productTags'       => self::intArray( $attributes['productTags'] ?? [] ),
			'excludeOutOfStock' => ! isset( $attributes['excludeOutOfStock'] ) || (bool) $attributes['excludeOutOfStock'],

			'slidesDesktop'     => self::clampInt( $spv['desktop'] ?? 3, 1, 6, 3 ),
			'slidesTablet'      => self::clampInt( $spv['tablet'] ?? 2, 1, 4, 2 ),
			'slidesMobile'      => self::clampInt( $spv['mobile'] ?? 1, 1, 2, 1 ),
			'slideGap'          => self::clampInt( $attributes['slideGap'] ?? 24, 0, 60, 24 ),
			'isLoop'            => ! isset( $attributes['isLoop'] ) || (bool) $attributes['isLoop'],
			'isAutoplay'        => ! isset( $attributes['isAutoplay'] ) || (bool) $attributes['isAutoplay'],
			'autoplayDelay'     => self::clampInt( $attributes['autoplayDelay'] ?? 3000, 1000, 10000, 3000 ),
			'autoplayPauseOnHover' => ! isset( $attributes['autoplayPauseOnHover'] ) || (bool) $attributes['autoplayPauseOnHover'],
			'transitionSpeed'   => self::clampInt( $attributes['transitionSpeed'] ?? 500, 100, 2000, 500 ),
			'isArrows'          => ! isset( $attributes['isArrows'] ) || (bool) $attributes['isArrows'],
			'isDots'            => ! isset( $attributes['isDots'] ) || (bool) $attributes['isDots'],

			'showImage'         => ! isset( $attributes['showImage'] ) || (bool) $attributes['showImage'],
			'imageRatio'        => self::pickFrom( $attributes['imageRatio'] ?? '3/4', self::RATIOS, '3/4' ),
			'showTitle'         => ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'],
			'showPrice'         => ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'],
			'showRating'        => ! isset( $attributes['showRating'] ) || (bool) $attributes['showRating'],
			'showSaleBadge'     => ! isset( $attributes['showSaleBadge'] ) || (bool) $attributes['showSaleBadge'],
			'saleBadgeLabel'    => $saleBadgeLabel,
			'showAddToCart'     => ! isset( $attributes['showAddToCart'] ) || (bool) $attributes['showAddToCart'],
			'addToCartLabel'    => $addToCartLabel,
			'contentAlign'      => self::pickFrom( $attributes['contentAlign'] ?? 'left', [ 'left', 'center' ], 'left' ),

			'cardBG'            => self::sanitizeColor( $attributes['cardBG'] ?? '', '#ffffff' ),
			'cardBorderWidth'   => self::clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 8, 1 ),
			'cardBorderColor'   => self::sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e2e8f0' ),
			'cardRadius'        => self::clampInt( $attributes['cardRadius'] ?? 8, 0, 48, 8 ),
			'cardShadow'        => self::pickFrom( $attributes['cardShadow'] ?? 'none', [ 'none', 'sm', 'md', 'lg' ], 'none' ),
			'cardPadding'       => self::clampInt( $attributes['cardPadding'] ?? 16, 0, 48, 16 ),

			'titleColor'        => self::sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' ),
			'titleWeight'       => $titleWeight,
			'priceColor'        => self::sanitizeColor( $attributes['priceColor'] ?? '', '#e44d3a' ),
			'regularPriceColor' => self::sanitizeColor( $attributes['regularPriceColor'] ?? '', '#999999' ),
			'ratingColor'       => self::sanitizeColor( $attributes['ratingColor'] ?? '', '#f5a623' ),
			'badgeBG'           => self::sanitizeColor( $attributes['badgeBG'] ?? '', '#e44d3a' ),
			'badgeTextColor'    => self::sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' ),
			'btnColor'          => self::sanitizeColor( $attributes['btnColor'] ?? '', '#ffffff' ),
			'btnBG'             => self::sanitizeColor( $attributes['btnBG'] ?? '', '#146EF5' ),
			'btnHoverColor'     => self::sanitizeColor( $attributes['btnHoverColor'] ?? '', '#ffffff' ),
			'btnHoverBG'        => self::sanitizeColor( $attributes['btnHoverBG'] ?? '', '#070127' ),
			'btnRadius'         => self::clampInt( $attributes['btnRadius'] ?? 4, 0, 48, 4 ),

			'arrowColor'        => self::sanitizeColor( $attributes['arrowColor'] ?? '', '#146EF5' ),
			'arrowBgColor'      => self::sanitizeColor( $attributes['arrowBgColor'] ?? '', '#ffffff' ),
			'arrowBorderRadius' => self::clampInt( $attributes['arrowBorderRadius'] ?? 50, 0, 50, 50 ),
			'dotColor'          => self::sanitizeColor( $attributes['dotColor'] ?? '', '#146EF5' ),
			'dotInactiveColor'  => self::sanitizeColor( $attributes['dotInactiveColor'] ?? '', '#cccccc' ),

			'titleSizeDesktop'  => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['desktop'] ?? '17' ) ), 12, 40, 17 ),
			'titleSizeTablet'   => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['tablet'] ?? '16' ) ), 12, 36, 16 ),
			'titleSizeMobile'   => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['mobile'] ?? '15' ) ), 12, 32, 15 ),

			'noProductsMessage' => $noProductsMessage,
		];
	}

	/* ----------------------------------------------------------------------
	 * Query
	 * ------------------------------------------------------------------- */

	/**
	 * Build sanitized wc_get_products() args.
	 *
	 * @param array $a Resolved attributes.
	 * @return array
	 */
	public static function buildQueryArgs( array $a ) {
		$orderByMap = [
			'date'       => [ 'orderby' => 'date', 'order' => $a['order'] ],
			'title'      => [ 'orderby' => 'title', 'order' => $a['order'] ],
			'rating'     => [ 'orderby' => 'rating', 'order' => $a['order'] ],
			'popularity' => [ 'orderby' => 'popularity', 'order' => $a['order'] ],
			'price'      => [ 'orderby' => 'price', 'order' => 'ASC' ],
			'price-desc' => [ 'orderby' => 'price', 'order' => 'DESC' ],
			'rand'       => [ 'orderby' => 'rand', 'order' => $a['order'] ],
		];
		$mapped = $orderByMap[ $a['orderBy'] ] ?? $orderByMap['date'];

		$args = [
			'status'   => 'publish',
			'limit'    => $a['productsToShow'],
			'orderby'  => $mapped['orderby'],
			'order'    => $mapped['order'],
			'paginate' => false,
			'return'   => 'objects',
		];

		if ( $a['excludeOutOfStock'] ) {
			$args['stock_status'] = 'instock';
		}

		if ( ! empty( $a['productCategories'] ) ) {
			$args['category'] = self::termIdsToSlugs( $a['productCategories'], 'product_cat' );
		}

		if ( ! empty( $a['productTags'] ) ) {
			$args['tag'] = self::termIdsToSlugs( $a['productTags'], 'product_tag' );
		}

		switch ( $a['productType'] ) {
			case 'featured':
				$args['featured'] = true;
				break;

			case 'on_sale':
				if ( function_exists( 'wc_get_product_ids_on_sale' ) ) {
					$onSale          = wc_get_product_ids_on_sale();
					$args['include'] = ! empty( $onSale ) ? $onSale : [ 0 ];
				}
				break;

			case 'best_selling':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['order']    = 'DESC';
				break;

			case 'top_rated':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['order']    = 'DESC';
				break;
		}

		return $args;
	}

	/**
	 * Convert term IDs to slugs for a taxonomy (wc_get_products expects slugs).
	 *
	 * @param int[]  $ids      Term IDs.
	 * @param string $taxonomy Taxonomy.
	 * @return string[]
	 */
	protected static function termIdsToSlugs( array $ids, $taxonomy ) {
		$slugs = [];
		foreach ( $ids as $id ) {
			$term = get_term( (int) $id, $taxonomy );
			if ( $term && ! is_wp_error( $term ) ) {
				$slugs[] = $term->slug;
			}
		}
		return $slugs;
	}

	/* ----------------------------------------------------------------------
	 * Carousel config
	 * ------------------------------------------------------------------- */

	/**
	 * Build the JSON config consumed by view.js.
	 *
	 * @param array $a Resolved attributes.
	 * @return string JSON string.
	 */
	public static function buildConfig( array $a ) {
		$config = [
			'slidesPerView'  => [
				'desktop' => $a['slidesDesktop'],
				'tablet'  => $a['slidesTablet'],
				'mobile'  => $a['slidesMobile'],
			],
			'loop'           => $a['isLoop'],
			'autoplay'       => $a['isAutoplay'],
			'autoplayDelay'  => $a['autoplayDelay'],
			'pauseOnHover'   => $a['autoplayPauseOnHover'],
			'transitionSpeed' => $a['transitionSpeed'],
			'arrows'         => $a['isArrows'],
			'dots'           => $a['isDots'],
		];
		return wp_json_encode( $config );
	}

	/* ----------------------------------------------------------------------
	 * Card rendering
	 * ------------------------------------------------------------------- */

	/**
	 * Render the product cards as escaped slide <li> markup.
	 *
	 * @param \WC_Product[] $products Products.
	 * @param array         $a        Resolved attributes.
	 * @return string Escaped HTML.
	 */
	public static function renderCards( array $products, array $a ) {
		ob_start();

		$total = count( $products );
		$index = 0;

		foreach ( $products as $product ) :
			if ( ! is_a( $product, 'WC_Product' ) ) {
				continue;
			}
			$index++;

			$productId = $product->get_id();
			$titleText = $product->get_name();
			$permalink = get_permalink( $productId );
			$isOnSale  = $product->is_on_sale();
			$isSimple  = $product->is_type( 'simple' );
			$canAjax   = $isSimple && $product->is_purchasable() && $product->is_in_stock();

			// Image.
			$imageUrl = '';
			$imageAlt = $titleText;
			if ( $a['showImage'] ) {
				$thumbId = $product->get_image_id();
				if ( $thumbId ) {
					$src = wp_get_attachment_image_url( $thumbId, 'woocommerce_thumbnail' );
					if ( $src ) {
						$imageUrl = $src;
						$metaAlt  = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
						if ( is_string( $metaAlt ) && '' !== trim( $metaAlt ) ) {
							$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
						}
					}
				}
				if ( '' === $imageUrl && function_exists( 'wc_placeholder_img_src' ) ) {
					$imageUrl = wc_placeholder_img_src( 'woocommerce_thumbnail' );
				}
			}

			// Rating.
			$ratingValue = (float) $product->get_average_rating();
			$ratingCount = (int) $product->get_rating_count();

			// Add-to-cart label.
			$cartLabel = $a['addToCartLabel'];
			if ( ! $isSimple ) {
				$wcLabel = $product->add_to_cart_text();
				if ( is_string( $wcLabel ) && '' !== trim( $wcLabel ) ) {
					$cartLabel = wp_strip_all_tags( $wcLabel );
				}
			}

			$slideLabel = sprintf(
				/* translators: 1: current slide number, 2: total slides. */
				__( '%1$d of %2$d', 'b-blocks' ),
				$index,
				$total
			);
			?>
			<li class='bb-wpc-slide' role='group' aria-roledescription='<?php echo esc_attr__( 'slide', 'b-blocks' ); ?>' aria-label='<?php echo esc_attr( $slideLabel ); ?>'>
				<article class='bb-wpc-card' aria-label='<?php echo esc_attr( $titleText ); ?>'>
					<?php if ( $a['showImage'] && '' !== $imageUrl ) : ?>
						<a class='bb-wpc-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
							<?php if ( $a['showSaleBadge'] && $isOnSale ) : ?>
								<span class='bb-wpc-sale-badge' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
									<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
								</span>
							<?php endif; ?>
							<img class='bb-wpc-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
						</a>
					<?php elseif ( $a['showSaleBadge'] && $isOnSale ) : ?>
						<span class='bb-wpc-sale-badge bb-wpc-sale-badge--noimg' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
							<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
						</span>
					<?php endif; ?>

					<div class='bb-wpc-card-body'>
						<?php if ( $a['showTitle'] && '' !== $titleText ) : ?>
							<h3 class='bb-wpc-title'>
								<a class='bb-wpc-title-link' href='<?php echo esc_url( $permalink ); ?>'>
									<?php echo esc_html( $titleText ); ?>
								</a>
							</h3>
						<?php endif; ?>

						<?php if ( $a['showRating'] && $ratingCount > 0 ) : ?>
							<?php
							$roundedRating = round( $ratingValue * 2 ) / 2;
							$ratingLabel   = sprintf(
								/* translators: %s: rating value out of 5. */
								__( 'Rated %s out of 5 stars', 'b-blocks' ),
								number_format_i18n( $ratingValue, 1 )
							);
							?>
							<span class='bb-wpc-rating' role='img' aria-label='<?php echo esc_attr( $ratingLabel ); ?>'>
								<?php
								for ( $i = 1; $i <= 5; $i++ ) {
									$starClass = 'bb-wpc-star';
									if ( $roundedRating >= $i ) {
										$starClass .= ' is-full';
									} elseif ( $roundedRating >= ( $i - 0.5 ) ) {
										$starClass .= ' is-half';
									}
									echo '<span class="' . esc_attr( $starClass ) . '" aria-hidden="true">★</span>';
								}
								?>
							</span>
						<?php endif; ?>

						<?php if ( $a['showPrice'] ) : ?>
							<div class='bb-wpc-price'>
								<?php echo wp_kses_post( $product->get_price_html() ); ?>
							</div>
						<?php endif; ?>

						<?php
						if ( $a['showAddToCart'] ) :
							$cartAria = sprintf(
								/* translators: %s: product name. */
								__( 'Add %s to cart', 'b-blocks' ),
								$titleText
							);
							if ( $canAjax ) :
								?>
								<button
									type='button'
									class='bb-wpc-atc-btn'
									data-product-id='<?php echo esc_attr( (string) $productId ); ?>'
									aria-label='<?php echo esc_attr( $cartAria ); ?>'
								>
									<span class='bb-wpc-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
									<span class='bb-wpc-atc-added' aria-hidden='true'><?php echo esc_html__( 'Added', 'b-blocks' ); ?></span>
								</button>
							<?php else : ?>
								<a
									class='bb-wpc-atc-btn bb-wpc-atc-btn--link'
									href='<?php echo esc_url( $permalink ); ?>'
									aria-label='<?php echo esc_attr( $cartAria ); ?>'
								>
									<span class='bb-wpc-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
								</a>
							<?php endif; ?>
						<?php endif; ?>
					</div>
				</article>
			</li>
			<?php
		endforeach;

		return ob_get_clean();
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoint
	 * ------------------------------------------------------------------- */

	/**
	 * Handle the `bb_wpc_add_to_cart` AJAX request for simple products.
	 *
	 * Returns JSON: { added: true, productName } or an error.
	 */
	public function ajaxAddToCart() {
		check_ajax_referer( 'bb_wpc_add_to_cart', 'nonce' );

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

new WooProductCarousel();
