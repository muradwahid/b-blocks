<?php
/**
 * Woo Single Product block server-side render.
 *
 * Renders a full, theme-consistent WooCommerce purchase area for one chosen
 * product by invoking WooCommerce's own single-product template hooks inside an
 * isolated wc_setup_product_data() context (handled by the shared renderer in
 * includes/blocks/woo-single-product/WooSingleProduct.php). The native gallery,
 * variation form, quantity stepper, add-to-cart form and product meta render
 * exactly as on the canonical product page.
 *
 * Interactivity (variation switching, gallery zoom, quantity) is handled by
 * WooCommerce's own enqueued scripts — no custom AJAX endpoint or nonce. This
 * file only enqueues those WooCommerce assets, emits per-instance layout CSS
 * variables scoped under a wp_unique_id() wrapper id, and escapes all output.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooSingleProduct;

if ( ! class_exists( WooSingleProduct::class ) ) {
	return;
}

$id = wp_unique_id( 'bb-wsp-' );
$a  = WooSingleProduct::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wsp' ] ); ?>
	>
		<p class='bb-wsp-empty' role='alert'>
			<?php echo esc_html__( 'WooCommerce is required to display this product.', 'b-blocks' ); ?>
		</p>
	</div>
	<?php
	return;
}

$product = $a['productId'] > 0 ? wc_get_product( $a['productId'] ) : false;

// No valid, visible, published product selected.
$isVisible = $product
	&& is_a( $product, 'WC_Product' )
	&& 'publish' === $product->get_status()
	&& ( ! method_exists( $product, 'is_visible' ) || $product->is_visible() || is_user_logged_in() );

if ( ! $isVisible ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wsp' ] ); ?>
	>
		<p class='bb-wsp-empty' role='status'>
			<?php echo esc_html( $a['noProductMessage'] ); ?>
		</p>
	</div>
	<?php
	return;
}

// Ensure WooCommerce's own single-product behavior scripts and base styles are
// available even on non-product-page templates. These handle variation
// switching, the gallery zoom/lightbox, and the quantity stepper natively.
if ( function_exists( 'wp_enqueue_script' ) ) {
	wp_enqueue_script( 'wc-single-product' );
	wp_enqueue_script( 'wc-add-to-cart-variation' );
	wp_enqueue_script( 'wc-add-to-cart' );
}
if ( function_exists( 'wp_enqueue_style' ) ) {
	wp_enqueue_style( 'woocommerce-general' );
}

// Block alignment (margin) when a max-width is set.
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

// Per-instance CSS variables (layout only — no text/colour overrides so the
// theme's native product styling is preserved).
$css  = "#$id.bb-wsp{";
$css .= '--bb-wsp-gap:' . $a['columnGap'] . 'px;';
$css .= '--bb-wsp-gallery-split:' . $a['gallerySplit'] . '%;';
$css .= '--bb-wsp-summary-split:' . ( 100 - $a['gallerySplit'] ) . '%;';
$css .= '--bb-wsp-max-width:' . ( $a['maxWidth'] > 0 ? $a['maxWidth'] . 'px' : 'none' ) . ';';
$css .= '--bb-wsp-block-margin:' . $blockMargin . ';';
$css .= '--bb-wsp-pad-v:' . $a['paddingVertical'] . 'px;';
$css .= '--bb-wsp-pad-h:' . $a['paddingHorizontal'] . 'px;';
$css .= '--bb-wsp-block-bg:' . $a['blockBG'] . ';';
$css .= '--bb-wsp-block-radius:' . $a['blockBorderRadius'] . 'px;';
$css .= '}';
// Stack the columns below the configured mobile breakpoint; flip order when
// summary-first is selected.
$css .= '@media (max-width:' . $a['mobileBreakpoint'] . 'px){';
$css .= "#$id.bb-wsp .bb-wsp-inner{flex-direction:column;}";
if ( 'summary-first' === $a['mobileStackOrder'] ) {
	$css .= "#$id.bb-wsp .bb-wsp-gallery{order:2;}";
	$css .= "#$id.bb-wsp .bb-wsp-summary{order:1;}";
}
$css .= '}';

// Wrapper classes.
$wrapperClasses  = 'bb-wsp';
$wrapperClasses .= ' bb-wsp-layout-' . $a['layout'];
if ( ! $a['showGallery'] || ! $a['showSummary'] ) {
	$wrapperClasses .= ' bb-wsp--single-col';
}

$productArea = WooSingleProduct::renderProductArea( $product, $a );

$ariaLabel = sprintf(
	/* translators: %s: product name. */
	__( 'Product: %s', 'b-blocks' ),
	$product->get_name()
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wsp-init='0'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-wsp-wrap product' aria-label='<?php echo esc_attr( $ariaLabel ); ?>'>
		<div class='bb-wsp-inner'>
			<?php
			// The product area is built from WooCommerce's own escaped template
			// output. wp_kses_post would strip required form/select/input markup
			// from the native add-to-cart and variation form, so the trusted
			// WooCommerce template output is echoed as-is.
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WooCommerce core template output.
			echo $productArea;
			?>
		</div>
	</div>
</div>
