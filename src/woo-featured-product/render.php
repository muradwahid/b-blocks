<?php
/**
 * Woo Featured Product block server-side render.
 *
 * Renders a single hand-picked WooCommerce product in a hero-style buy box.
 * Per-instance CSS custom properties are emitted inline, scoped under a
 * `wp_unique_id()` wrapper id, so multiple instances on one page never collide.
 * Simple products get an AJAX add-to-cart button; variable/grouped products
 * link to the product page. All dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooFeaturedProduct;

if ( ! class_exists( WooFeaturedProduct::class ) ) {
	return;
}

$id = wp_unique_id( 'bb-wfp-' );
$a  = WooFeaturedProduct::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! function_exists( 'wc_get_product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wfp' ] ); ?>
	>
		<p class='bb-wfp-empty'><?php echo esc_html__( 'WooCommerce is required to display the featured product.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

$product = $a['productId'] > 0 ? wc_get_product( $a['productId'] ) : false;

// No valid product selected.
if ( ! $product || ! is_a( $product, 'WC_Product' ) || 'publish' !== $product->get_status() ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wfp' ] ); ?>
	>
		<p class='bb-wfp-empty'><?php echo esc_html( $a['noProductMessage'] ); ?></p>
	</div>
	<?php
	return;
}

$productId   = $product->get_id();
$titleText   = $product->get_name();
$permalink   = get_permalink( $productId );
$isOnSale    = $product->is_on_sale();
$isSimple    = $product->is_type( 'simple' );
$canAjax     = $isSimple && $product->is_purchasable() && $product->is_in_stock();
$ratingValue = (float) $product->get_average_rating();
$ratingCount = (int) $product->get_rating_count();
$shortDesc   = $product->get_short_description();

// Image.
$imageUrl = '';
$imageAlt = $titleText;
if ( $a['showImage'] ) {
	$thumbId = $product->get_image_id();
	if ( $thumbId ) {
		$src = wp_get_attachment_image_url( $thumbId, 'woocommerce_single' );
		if ( $src ) {
			$imageUrl = $src;
			$metaAlt  = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
			if ( is_string( $metaAlt ) && '' !== trim( $metaAlt ) ) {
				$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
			}
		}
	}
	if ( '' === $imageUrl && function_exists( 'wc_placeholder_img_src' ) ) {
		$imageUrl = wc_placeholder_img_src( 'woocommerce_single' );
	}
}

$hasImage = $a['showImage'] && '' !== $imageUrl;

// Add-to-cart label.
$cartLabel = $a['addToCartLabel'];
if ( ! $canAjax ) {
	$cartLabel = $a['viewProductLabel'];
}

// Vertical alignment map.
$valignMap = [
	'top'    => 'flex-start',
	'center' => 'center',
	'bottom' => 'flex-end',
];

// Block alignment (margin) when max-width is set.
$blockMargin = '0';
if ( $a['maxWidth'] > 0 ) {
	if ( 'center' === $a['blockAlign'] ) {
		$blockMargin = '0 auto';
	} elseif ( 'right' === $a['blockAlign'] ) {
		$blockMargin = '0 0 0 auto';
	} else {
		$blockMargin = '0 auto 0 0';
	}
}

// Per-instance CSS variables.
$css  = "#$id.bb-wfp{";
$css .= '--bb-wfp-gap:' . $a['gap'] . 'px;';
$css .= '--bb-wfp-img-split:' . $a['imageSplit'] . '%;';
$css .= '--bb-wfp-content-split:' . ( 100 - $a['imageSplit'] ) . '%;';
$css .= '--bb-wfp-aspect:' . $a['imageRatio'] . ';';
$css .= '--bb-wfp-img-fit:' . $a['imageFit'] . ';';
$css .= '--bb-wfp-img-radius:' . $a['imageBorderRadius'] . 'px;';
$css .= '--bb-wfp-content-align:' . $a['contentAlign'] . ';';
$css .= '--bb-wfp-content-valign:' . ( $valignMap[ $a['contentVerticalAlign'] ] ?? 'center' ) . ';';
$css .= '--bb-wfp-block-bg:' . $a['blockBG'] . ';';
$css .= '--bb-wfp-block-radius:' . $a['blockBorderRadius'] . 'px;';
$css .= '--bb-wfp-block-pad-v:' . $a['blockPaddingVertical'] . 'px;';
$css .= '--bb-wfp-block-pad-h:' . $a['blockPaddingHorizontal'] . 'px;';
$css .= '--bb-wfp-max-width:' . ( $a['maxWidth'] > 0 ? $a['maxWidth'] . 'px' : 'none' ) . ';';
$css .= '--bb-wfp-block-margin:' . $blockMargin . ';';
$css .= '--bb-wfp-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-wfp-title-size:' . $a['titleSizeMobile'] . 'px;';
$css .= '--bb-wfp-title-weight:' . $a['titleFontWeight'] . ';';
$css .= '--bb-wfp-price-color:' . $a['priceColor'] . ';';
$css .= '--bb-wfp-regular-price-color:' . $a['regularPriceColor'] . ';';
$css .= '--bb-wfp-rating-color:' . $a['ratingColor'] . ';';
$css .= '--bb-wfp-desc-color:' . $a['descriptionColor'] . ';';
$css .= '--bb-wfp-desc-size:' . $a['descSizeMobile'] . 'px;';
$css .= '--bb-wfp-badge-bg:' . $a['badgeBG'] . ';';
$css .= '--bb-wfp-badge-text:' . $a['badgeTextColor'] . ';';
$css .= '--bb-wfp-btn-color:' . $a['btnColor'] . ';';
$css .= '--bb-wfp-btn-bg:' . $a['btnBG'] . ';';
$css .= '--bb-wfp-btn-hov-color:' . $a['btnHovColor'] . ';';
$css .= '--bb-wfp-btn-hov-bg:' . $a['btnHovBG'] . ';';
$css .= '--bb-wfp-btn-radius:' . $a['btnRadius'] . 'px;';
$css .= '--bb-wfp-btn-size:' . $a['btnSizeMobile'] . 'px;';
$css .= '--bb-wfp-btn-weight:' . $a['btnFontWeight'] . ';';
$css .= '--bb-wfp-btn-pad-v:' . $a['btnPaddingVertical'] . 'px;';
$css .= '--bb-wfp-btn-pad-h:' . $a['btnPaddingHorizontal'] . 'px;';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wfp{--bb-wfp-title-size:" . $a['titleSizeTablet'] . 'px;--bb-wfp-desc-size:' . $a['descSizeTablet'] . 'px;--bb-wfp-btn-size:' . $a['btnSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-wfp{--bb-wfp-title-size:" . $a['titleSizeDesktop'] . 'px;--bb-wfp-desc-size:' . $a['descSizeDesktop'] . 'px;--bb-wfp-btn-size:' . $a['btnSizeDesktop'] . 'px;}}';

// Wrapper classes.
$wrapperClasses  = 'bb-wfp';
$wrapperClasses .= ' bb-wfp--' . $a['layout'];
$wrapperClasses .= ' bb-wfp--img-' . $a['imagePosition'];
$wrapperClasses .= ' bb-wfp--align-' . $a['contentAlign'];
if ( $a['mobileMirror'] ) {
	$wrapperClasses .= ' bb-wfp--mobile-mirror';
}

$ariaLabel = sprintf(
	/* translators: %s: product name. */
	__( 'Featured product: %s', 'b-blocks' ),
	$titleText
);

$cartAria = sprintf(
	/* translators: %s: product name. */
	__( 'Add %s to cart', 'b-blocks' ),
	$titleText
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wfp-nonce='<?php echo esc_attr( wp_create_nonce( 'bb_wfp_add_to_cart' ) ); ?>'
	data-bb-wfp-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<section class='bb-wfp-inner' aria-label='<?php echo esc_attr( $ariaLabel ); ?>'>
		<?php if ( $hasImage ) : ?>
			<div class='bb-wfp-media'>
				<a class='bb-wfp-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
					<?php if ( $a['showBadge'] && $isOnSale ) : ?>
						<span class='bb-wfp-badge' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
							<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
						</span>
					<?php endif; ?>
					<img class='bb-wfp-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
				</a>
			</div>
		<?php endif; ?>

		<div class='bb-wfp-content'>
			<?php if ( $a['showBadge'] && $isOnSale && ! $hasImage ) : ?>
				<span class='bb-wfp-badge bb-wfp-badge--inline' role='img' aria-label='<?php echo esc_attr__( 'On sale', 'b-blocks' ); ?>'>
					<?php echo esc_html( $a['saleBadgeLabel'] ); ?>
				</span>
			<?php endif; ?>

			<h2 class='bb-wfp-title'>
				<a class='bb-wfp-title-link' href='<?php echo esc_url( $permalink ); ?>'>
					<?php echo esc_html( $titleText ); ?>
				</a>
			</h2>

			<?php if ( $a['showRating'] && $ratingCount > 0 ) : ?>
				<?php
				$roundedRating = round( $ratingValue * 2 ) / 2;
				$ratingLabel   = sprintf(
					/* translators: %s: rating value out of 5. */
					__( 'Rating: %s out of 5 stars', 'b-blocks' ),
					number_format_i18n( $ratingValue, 1 )
				);
				?>
				<span class='bb-wfp-rating' role='img' aria-label='<?php echo esc_attr( $ratingLabel ); ?>'>
					<?php
					for ( $i = 1; $i <= 5; $i++ ) {
						$starClass = 'bb-wfp-star';
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
				<div class='bb-wfp-price'>
					<?php echo wp_kses_post( $product->get_price_html() ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $a['showShortDescription'] && '' !== trim( wp_strip_all_tags( $shortDesc ) ) ) : ?>
				<div class='bb-wfp-desc'>
					<?php echo wp_kses_post( wpautop( $shortDesc ) ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $a['showAddToCart'] ) : ?>
				<div class='bb-wfp-actions'>
					<?php if ( $canAjax ) : ?>
						<button
							type='button'
							class='bb-wfp-atc-btn'
							data-product-id='<?php echo esc_attr( (string) $productId ); ?>'
							data-product-type='simple'
							data-adding-label='<?php echo esc_attr__( 'Adding…', 'b-blocks' ); ?>'
							data-added-label='<?php echo esc_attr__( 'Added!', 'b-blocks' ); ?>'
							aria-label='<?php echo esc_attr( $cartAria ); ?>'
						>
							<span class='bb-wfp-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
						</button>
					<?php else : ?>
						<a
							class='bb-wfp-atc-btn bb-wfp-atc-btn--link'
							href='<?php echo esc_url( $permalink ); ?>'
							data-product-type='<?php echo esc_attr( $product->get_type() ); ?>'
						>
							<span class='bb-wfp-atc-label'><?php echo esc_html( $cartLabel ); ?></span>
						</a>
					<?php endif; ?>

					<span class='bb-wfp-status' role='status' aria-live='polite' aria-atomic='true'></span>
					<span class='bb-wfp-error' role='alert' aria-live='assertive' aria-atomic='true'></span>
				</div>
			<?php endif; ?>
		</div>
	</section>
</div>
