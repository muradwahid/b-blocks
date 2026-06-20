<?php
/**
 * Woo Best Sellers block server-side render.
 *
 * Renders a preset-driven, ranked WooCommerce product grid using
 * wc_get_products(). Card markup is produced by the shared
 * `BBlocks\Inc\Blocks\WooBestSellers` renderer. Per-instance CSS custom
 * properties are emitted inline, scoped under a `wp_unique_id()` wrapper id,
 * so multiple instances on one page never collide. All dynamic output is
 * escaped. When WooCommerce is inactive a `role="alert"` notice is shown.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooBestSellers;

if ( ! class_exists( WooBestSellers::class ) ) {
	return;
}

$prefix    = 'bBlocksWooBestSellers';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$a = WooBestSellers::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly accessible notice instead of fataling.
if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_products' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wbs" ] ); ?>
	>
		<p class='bb-wbs-empty' role='alert'><?php echo esc_html__( 'WooCommerce is required to display this block.', 'b-blocks' ); ?></p>
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
$css  = "#$id.bb-wbs{";
$css .= '--bb-wbs-cols:' . $a['columnsMobile'] . ';';
$css .= '--bb-wbs-col-gap:' . $a['columnGap'] . 'px;';
$css .= '--bb-wbs-row-gap:' . $a['rowGap'] . 'px;';
$css .= '--bb-wbs-card-bg:' . $a['cardBG'] . ';';
$css .= '--bb-wbs-card-pad:' . $a['cardPadding'] . 'px;';
$css .= '--bb-wbs-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-wbs-card-border:' . $cardBorder . ';';
$css .= '--bb-wbs-card-shadow:' . $shadowValue . ';';
$css .= '--bb-wbs-aspect:' . $a['imageRatio'] . ';';
$css .= '--bb-wbs-img-fit:' . $a['imageFit'] . ';';
$css .= '--bb-wbs-content-align:' . $a['contentAlign'] . ';';
$css .= '--bb-wbs-rank-bg:' . $a['rankBadgeBG'] . ';';
$css .= '--bb-wbs-rank-color:' . $a['rankBadgeColor'] . ';';
$css .= '--bb-wbs-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-wbs-title-size:' . $a['titleSizeMobile'] . 'px;';
$css .= '--bb-wbs-price-color:' . $a['priceColor'] . ';';
$css .= '--bb-wbs-regular-price-color:' . $a['regularPriceColor'] . ';';
$css .= '--bb-wbs-rating-color:' . $a['ratingColor'] . ';';
$css .= '--bb-wbs-badge-bg:' . $a['badgeBG'] . ';';
$css .= '--bb-wbs-badge-text:' . $a['badgeTextColor'] . ';';
$css .= '--bb-wbs-btn-color:' . $a['btnColor'] . ';';
$css .= '--bb-wbs-btn-bg:' . $a['btnBG'] . ';';
$css .= '--bb-wbs-btn-hov-color:' . $a['btnHovColor'] . ';';
$css .= '--bb-wbs-btn-hov-bg:' . $a['btnHovBG'] . ';';
$css .= '--bb-wbs-btn-radius:' . $a['btnRadius'] . 'px;';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wbs{--bb-wbs-cols:" . $a['columnsTablet'] . ';--bb-wbs-title-size:' . $a['titleSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-wbs{--bb-wbs-cols:" . $a['columnsDesktop'] . ';--bb-wbs-title-size:' . $a['titleSizeDesktop'] . 'px;}}';

// Query products.
$args     = WooBestSellers::buildQueryArgs( $a );
$products = wc_get_products( $args );
if ( ! is_array( $products ) ) {
	$products = [];
}

$listLabel      = WooBestSellers::presetLabel( $a['preset'] );
$wrapperClasses = trim( $planClass . ' bb-wbs' . ' bb-wbs--align-' . $a['contentAlign'] );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wbs-nonce='<?php echo esc_attr( wp_create_nonce( 'bb_wbs_add_to_cart' ) ); ?>'
	data-bb-wbs-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-wbs-status' aria-live='polite' aria-atomic='true'></div>

	<?php if ( ! empty( $products ) ) : ?>
		<div class='bb-wbs-grid' role='list' aria-label='<?php echo esc_attr( $listLabel ); ?>'>
			<?php echo wp_kses_post( WooBestSellers::renderCards( $products, $a ) ); ?>
		</div>
	<?php else : ?>
		<p class='bb-wbs-empty'><?php echo esc_html( $a['noProductsMessage'] ); ?></p>
	<?php endif; ?>
</div>
