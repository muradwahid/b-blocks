<?php
/**
 * Woo Product Grid block server-side render.
 *
 * Renders a sanitized WooCommerce product grid using wc_get_products(). Card
 * markup is produced by the shared `BBlocks\Inc\Blocks\WooProductGrid` renderer.
 * Per-instance CSS custom properties are emitted inline, scoped under a
 * `wp_unique_id()` wrapper id, so multiple grids on one page never collide.
 * All dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooProductGrid;

if ( ! class_exists( WooProductGrid::class ) ) {
	return;
}

$prefix    = 'bBlocksWooProductGrid';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$a = WooProductGrid::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! function_exists( 'wc_get_products' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wpg" ] ); ?>
	>
		<p class='bb-wpg-empty'><?php echo esc_html__( 'WooCommerce is required to display the product grid.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

// Shadow presets.
$shadowMap = [
	'none' => 'none',
	'sm'   => '0 1px 3px rgba(15, 23, 42, 0.08)',
	'md'   => '0 4px 12px rgba(15, 23, 42, 0.1)',
	'lg'   => '0 8px 24px rgba(15, 23, 42, 0.14)',
];
$shadowValue = $shadowMap[ $a['cardShadow'] ] ?? $shadowMap['none'];
$cardBorder  = ( $a['cardBorderWidth'] > 0 ) ? ( $a['cardBorderWidth'] . 'px solid ' . $a['cardBorderColor'] ) : 'none';

// Per-instance CSS variables.
$css  = "#$id.bb-wpg{";
$css .= '--bb-wpg-cols:' . $a['columnsMobile'] . ';';
$css .= '--bb-wpg-col-gap:' . $a['columnGap'] . 'px;';
$css .= '--bb-wpg-row-gap:' . $a['rowGap'] . 'px;';
$css .= '--bb-wpg-card-bg:' . $a['cardBG'] . ';';
$css .= '--bb-wpg-card-pad:' . $a['cardPadding'] . 'px;';
$css .= '--bb-wpg-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-wpg-card-border:' . $cardBorder . ';';
$css .= '--bb-wpg-card-shadow:' . $shadowValue . ';';
$css .= '--bb-wpg-aspect:' . $a['imageRatio'] . ';';
$css .= '--bb-wpg-img-fit:' . $a['imageFit'] . ';';
$css .= '--bb-wpg-content-align:' . $a['contentAlign'] . ';';
$css .= '--bb-wpg-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-wpg-title-size:' . $a['titleSizeMobile'] . 'px;';
$css .= '--bb-wpg-price-color:' . $a['priceColor'] . ';';
$css .= '--bb-wpg-regular-price-color:' . $a['regularPriceColor'] . ';';
$css .= '--bb-wpg-rating-color:' . $a['ratingColor'] . ';';
$css .= '--bb-wpg-badge-bg:' . $a['badgeBG'] . ';';
$css .= '--bb-wpg-badge-text:' . $a['badgeTextColor'] . ';';
$css .= '--bb-wpg-btn-color:' . $a['btnColor'] . ';';
$css .= '--bb-wpg-btn-bg:' . $a['btnBG'] . ';';
$css .= '--bb-wpg-btn-hov-color:' . $a['btnHovColor'] . ';';
$css .= '--bb-wpg-btn-hov-bg:' . $a['btnHovBG'] . ';';
$css .= '--bb-wpg-btn-radius:' . $a['btnRadius'] . 'px;';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wpg{--bb-wpg-cols:" . $a['columnsTablet'] . ';--bb-wpg-title-size:' . $a['titleSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-wpg{--bb-wpg-cols:" . $a['columnsDesktop'] . ';--bb-wpg-title-size:' . $a['titleSizeDesktop'] . 'px;}}';

// Query products.
$args     = WooProductGrid::buildQueryArgs( $a );
$products = wc_get_products( $args );
if ( ! is_array( $products ) ) {
	$products = [];
}

$wrapperClasses = trim( $planClass . ' bb-wpg' . ' bb-wpg--align-' . $a['contentAlign'] );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wpg-nonce='<?php echo esc_attr( wp_create_nonce( 'bb_wpg_add_to_cart' ) ); ?>'
	data-bb-wpg-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-wpg-status' aria-live='polite' aria-atomic='true'></div>

	<?php if ( ! empty( $products ) ) : ?>
		<div class='bb-wpg-grid' role='list' aria-label='<?php echo esc_attr__( 'Product grid', 'b-blocks' ); ?>'>
			<?php echo wp_kses_post( WooProductGrid::renderCards( $products, $a ) ); ?>
		</div>
	<?php else : ?>
		<p class='bb-wpg-empty'><?php echo esc_html( $a['noProductsMessage'] ); ?></p>
	<?php endif; ?>
</div>
