<?php
/**
 * Woo Product Grid — shared server logic.
 *
 * Provides attribute sanitization, WooCommerce query building, product-card
 * markup rendering, and a hardened add-to-cart AJAX endpoint
 * (`bb_wpg_add_to_cart`) used by the frontend `view.js` for simple products.
 *
 * Security model for `bb_wpg_add_to_cart`:
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

class WooProductGrid {

	/**
	 * Allowed orderby values mapped to WC_Product_Query orderby keys.
	 *
	 * @var string[]
	 */
	const ORDERBY = [ 'date', 'price', 'rating', 'popularity', 'rand', 'title' ];

	/**
	 * Allowed order values (uppercased).
	 *
	 * @var string[]
	 */
	const ORDER = [ 'ASC', 'DESC' ];

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
		add_action( 'wp_ajax_bb_wpg_add_to_cart', [ $this, 'ajaxAddToCart' ] );
		add_action( 'wp_ajax_nopriv_bb_wpg_add_to_cart', [ $this, 'ajaxAddToCart' ] );
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
		$columns   = (array) ( $attributes['columns'] ?? [] );
		$titleFont = (array) ( $attributes['titleFontSize'] ?? [] );

		$saleBadgeLabel = isset( $attributes['saleBadgeLabel'] ) ? wp_strip_all_tags( (string) $attributes['saleBadgeLabel'] ) : '';
		$saleBadgeLabel = '' !== trim( $saleBadgeLabel ) ? $saleBadgeLabel : __( 'Sale', 'b-blocks' );

		$addToCartLabel = isset( $attributes['addToCartLabel'] ) ? wp_strip_all_tags( (string) $attributes['addToCartLabel'] ) : '';
		$addToCartLabel = '' !== trim( $addToCartLabel ) ? $addToCartLabel : __( 'Add to Cart', 'b-blocks' );

		$noProductsMessage = isset( $attributes['noProductsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductsMessage'] ) : '';
		$noProductsMessage = '' !== trim( $noProductsMessage ) ? $noProductsMessage : __( 'No products found.', 'b-blocks' );

		return [
			'columnsDesktop'    => self::clampInt( $columns['desktop'] ?? 3, 1, 6, 3 ),
			'columnsTablet'     => self::clampInt( $columns['tablet'] ?? 2, 1, 6, 2 ),
			'columnsMobile'     => self::clampInt( $columns['mobile'] ?? 1, 1, 6, 1 ),
			'columnGap'         => self::clampInt( $attributes['columnGap'] ?? 20, 0, 60, 20 ),
			'rowGap'            => self::clampInt( $attributes['rowGap'] ?? 20, 0, 60, 20 ),

			'productsPerPage'   => self::clampInt( $attributes['productsPerPage'] ?? 9, 1, 48, 9 ),
			'orderBy'           => self::pickFrom( $attributes['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'             => self::pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'desc' ) ), self::ORDER, 'DESC' ),
			'productCategories' => self::intArray( $attributes['productCategories'] ?? [] ),
			'productTags'       => self::intArray( $attributes['productTags'] ?? [] ),
			'onSaleOnly'        => ! empty( $attributes['onSaleOnly'] ),
			'featuredOnly'      => ! empty( $attributes['featuredOnly'] ),

			'showImage'         => ! isset( $attributes['showImage'] ) || (bool) $attributes['showImage'],
			'imageFit'          => self::pickFrom( $attributes['imageFit'] ?? 'cover', [ 'cover', 'contain' ], 'cover' ),
			'imageRatio'        => self::pickFrom( $attributes['imageRatio'] ?? '3/4', self::RATIOS, '3/4' ),

			'showTitle'         => ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'],
			'showPrice'         => ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'],
			'showRating'        => ! isset( $attributes['showRating'] ) || (bool) $attributes['showRating'],
			'showSaleBadge'     => ! isset( $attributes['showSaleBadge'] ) || (bool) $attributes['showSaleBadge'],
			'saleBadgeLabel'    => $saleBadgeLabel,
			'showAddToCart'     => ! isset( $attributes['showAddToCart'] ) || (bool) $attributes['showAddToCart'],
			'addToCartLabel'    => $addToCartLabel,
			'contentAlign'      => self::pickFrom( $attributes['contentAlign'] ?? 'left', [ 'left', 'center', 'right' ], 'left' ),

			'cardBG'            => self::sanitizeColor( $attributes['cardBG'] ?? '', '#ffffff' ),
			'cardPadding'       => self::clampInt( $attributes['cardPadding'] ?? 16, 0, 48, 16 ),
			'cardBorderWidth'   => self::clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 8, 1 ),
			'cardBorderColor'   => self::sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e2e8f0' ),
			'cardRadius'        => self::clampInt( $attributes['cardRadius'] ?? 8, 0, 32, 8 ),
			'cardShadow'        => self::pickFrom( $attributes['cardShadow'] ?? 'none', [ 'none', 'sm', 'md', 'lg' ], 'none' ),

			'titleColor'        => self::sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' ),
			'priceColor'        => self::sanitizeColor( $attributes['priceColor'] ?? '', '#e44d3a' ),
			'regularPriceColor' => self::sanitizeColor( $attributes['regularPriceColor'] ?? '', '#999999' ),
			'ratingColor'       => self::sanitizeColor( $attributes['ratingColor'] ?? '', '#f5a623' ),
			'badgeBG'           => self::sanitizeColor( $attributes['badgeBG'] ?? '', '#e44d3a' ),
			'badgeTextColor'    => self::sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' ),
			'btnColor'          => self::sanitizeColor( $attributes['btnColor'] ?? '', '#ffffff' ),
			'btnBG'             => self::sanitizeColor( $attributes['btnBG'] ?? '', '#146EF5' ),
			'btnHovColor'       => self::sanitizeColor( $attributes['btnHovColor'] ?? '', '#ffffff' ),
			'btnHovBG'          => self::sanitizeColor( $attributes['btnHovBG'] ?? '', '#070127' ),
			'btnRadius'         => self::clampInt( $attributes['btnRadius'] ?? 4, 0, 32, 4 ),

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
		// Map our orderby to WooCommerce-recognized values.
		$orderByMap = [
			'date'       => 'date',
			'price'      => 'price',
			'rating'     => 'rating',
			'popularity' => 'popularity',
			'rand'       => 'rand',
			'title'      => 'title',
		];

		$args = [
			'status'   => 'publish',
			'limit'    => $a['productsPerPage'],
			'orderby'  => $orderByMap[ $a['orderBy'] ] ?? 'date',
			'order'    => $a['order'],
			'paginate' => false,
			'return'   => 'objects',
		];

		if ( ! empty( $a['productCategories'] ) ) {
			$args['category'] = self::termIdsToSlugs( $a['productCategories'], 'product_cat' );
		}

		if ( ! empty( $a['productTags'] ) ) {
			$args['tag'] = self::termIdsToSlugs( $a['productTags'], 'product_tag' );
		}

		if ( $a['featuredOnly'] ) {
			$args['featured'] = true;
		}

		if ( $a['onSaleOnly'] && function_exists( 'wc_get_product_ids_on_sale' ) ) {
			$onSale = wc_get_product_ids_on_sale();
			// Empty include with on-sale-only means no products; use a sentinel.
			$args['include'] = ! empty( $onSale ) ? $onSale : [ 0 ];
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
	 * Card rendering
	 * ------------------------------------------------------------------- */

	/**
	 * Render the product cards as an escaped HTML fragment.
	 *
	 * @param \WC_Product[] $products Products.
	 * @param array         $a        Resolved attributes.
	 * @return string Escaped HTML.
	 */
	public static function renderCards( array $products, array $a ) {
		ob_start();

		foreach ( $products as $product ) :
			if ( ! is_a( $product, 'WC_Product' ) ) {
				continue;
			}

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
			?>
			<article class='bb-wpg-card' role='listitem' aria-label='<?php echo esc_attr( $titleText ); ?>'>
				<?php if ( $a['showImage'] && '' !== $imageUrl ) : ?>
					<a class='bb-wpg-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
						<?php if ( $a['showSaleBadge'] && $isOnSale ) : ?>
							<span class='bb-wpg-sale-badge' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
								<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
							</span>
						<?php endif; ?>
						<img class='bb-wpg-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
					</a>
				<?php elseif ( $a['showSaleBadge'] && $isOnSale ) : ?>
					<span class='bb-wpg-sale-badge bb-wpg-sale-badge--noimg' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
						<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
					</span>
				<?php endif; ?>

				<div class='bb-wpg-card-body'>
					<?php if ( $a['showTitle'] && '' !== $titleText ) : ?>
						<h3 class='bb-wpg-title'>
							<a class='bb-wpg-title-link' href='<?php echo esc_url( $permalink ); ?>'>
								<?php echo esc_html( $titleText ); ?>
							</a>
						</h3>
					<?php endif; ?>

					<?php if ( $a['showRating'] && $ratingCount > 0 ) : ?>
						<?php
						$roundedRating = round( $ratingValue * 2 ) / 2;
						$ratingLabel   = sprintf(
							/* translators: %s: rating value out of 5. */
							__( '%s out of 5 stars', 'b-blocks' ),
							number_format_i18n( $ratingValue, 1 )
						);
						?>
						<span class='bb-wpg-rating' role='img' aria-label='<?php echo esc_attr( $ratingLabel ); ?>'>
							<?php
							for ( $i = 1; $i <= 5; $i++ ) {
								$starClass = 'bb-wpg-star';
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
						<div class='bb-wpg-price'>
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
								class='bb-wpg-atc-btn'
								data-product-id='<?php echo esc_attr( (string) $productId ); ?>'
								aria-label='<?php echo esc_attr( $cartAria ); ?>'
							>
								<span class='bb-wpg-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
								<span class='bb-wpg-atc-added' aria-hidden='true'><?php echo esc_html__( 'Added', 'b-blocks' ); ?></span>
							</button>
						<?php else : ?>
							<a
								class='bb-wpg-atc-btn bb-wpg-atc-btn--link'
								href='<?php echo esc_url( $permalink ); ?>'
								aria-label='<?php echo esc_attr( $cartAria ); ?>'
							>
								<span class='bb-wpg-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
							</a>
						<?php endif; ?>
					<?php endif; ?>
				</div>
			</article>
			<?php
		endforeach;

		return ob_get_clean();
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoint
	 * ------------------------------------------------------------------- */

	/**
	 * Handle the `bb_wpg_add_to_cart` AJAX request for simple products.
	 *
	 * Returns JSON: { added: true, productName } or an error.
	 */
	public function ajaxAddToCart() {
		check_ajax_referer( 'bb_wpg_add_to_cart', 'nonce' );

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

new WooProductGrid();
