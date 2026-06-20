<?php
/**
 * Woo Product Carousel block server-side render.
 *
 * Renders a sanitized WooCommerce product carousel using wc_get_products().
 * Card markup is produced by the shared `BBlocks\Inc\Blocks\WooProductCarousel`
 * renderer; the carousel itself is hydrated by a dependency-free `view.js`.
 * Per-instance CSS custom properties are emitted inline, scoped under a
 * `wp_unique_id()` wrapper id, so multiple carousels on one page never collide.
 * All dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooProductCarousel;

if ( ! class_exists( WooProductCarousel::class ) ) {
	return;
}

$prefix    = 'bBlocksWooProductCarousel';
$id        = wp_unique_id( "$prefix-" );
$trackId   = $id . '-track';
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$a = WooProductCarousel::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! function_exists( 'wc_get_products' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wpc" ] ); ?>
	>
		<p class='bb-wpc-empty'><?php echo esc_html__( 'WooCommerce is required to display the product carousel.', 'b-blocks' ); ?></p>
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

// Per-instance CSS variables (mobile-first base values).
$css  = "#$id.bb-wpc{";
$css .= '--bb-wpc-spv:' . $a['slidesMobile'] . ';';
$css .= '--bb-wpc-gap:' . $a['slideGap'] . 'px;';
$css .= '--bb-wpc-speed:' . $a['transitionSpeed'] . 'ms;';
$css .= '--bb-wpc-card-bg:' . $a['cardBG'] . ';';
$css .= '--bb-wpc-card-pad:' . $a['cardPadding'] . 'px;';
$css .= '--bb-wpc-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-wpc-card-border:' . $cardBorder . ';';
$css .= '--bb-wpc-card-shadow:' . $shadowValue . ';';
$css .= '--bb-wpc-aspect:' . $a['imageRatio'] . ';';
$css .= '--bb-wpc-content-align:' . $a['contentAlign'] . ';';
$css .= '--bb-wpc-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-wpc-title-size:' . $a['titleSizeMobile'] . 'px;';
$css .= '--bb-wpc-title-weight:' . $a['titleWeight'] . ';';
$css .= '--bb-wpc-price-color:' . $a['priceColor'] . ';';
$css .= '--bb-wpc-regular-price-color:' . $a['regularPriceColor'] . ';';
$css .= '--bb-wpc-rating-color:' . $a['ratingColor'] . ';';
$css .= '--bb-wpc-badge-bg:' . $a['badgeBG'] . ';';
$css .= '--bb-wpc-badge-text:' . $a['badgeTextColor'] . ';';
$css .= '--bb-wpc-btn-color:' . $a['btnColor'] . ';';
$css .= '--bb-wpc-btn-bg:' . $a['btnBG'] . ';';
$css .= '--bb-wpc-btn-hov-color:' . $a['btnHoverColor'] . ';';
$css .= '--bb-wpc-btn-hov-bg:' . $a['btnHoverBG'] . ';';
$css .= '--bb-wpc-btn-radius:' . $a['btnRadius'] . 'px;';
$css .= '--bb-wpc-arrow-color:' . $a['arrowColor'] . ';';
$css .= '--bb-wpc-arrow-bg:' . $a['arrowBgColor'] . ';';
$css .= '--bb-wpc-arrow-radius:' . $a['arrowBorderRadius'] . '%;';
$css .= '--bb-wpc-dot-color:' . $a['dotColor'] . ';';
$css .= '--bb-wpc-dot-inactive:' . $a['dotInactiveColor'] . ';';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wpc{--bb-wpc-spv:" . $a['slidesTablet'] . ';--bb-wpc-title-size:' . $a['titleSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-wpc{--bb-wpc-spv:" . $a['slidesDesktop'] . ';--bb-wpc-title-size:' . $a['titleSizeDesktop'] . 'px;}}';

// Query products.
$args     = WooProductCarousel::buildQueryArgs( $a );
$products = wc_get_products( $args );
if ( ! is_array( $products ) ) {
	$products = [];
}

$config = WooProductCarousel::buildConfig( $a );

$regionLabel    = esc_attr__( 'Products carousel', 'b-blocks' );
$wrapperClasses = trim( $planClass . ' bb-wpc' . ' bb-wpc--align-' . $a['contentAlign'] );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	role='region'
	aria-roledescription='<?php echo esc_attr__( 'carousel', 'b-blocks' ); ?>'
	aria-label='<?php echo esc_attr( $regionLabel ); ?>'
	data-bb-wpc-config='<?php echo esc_attr( $config ); ?>'
	data-bb-wpc-nonce='<?php echo esc_attr( wp_create_nonce( 'bb_wpc_add_to_cart' ) ); ?>'
	data-bb-wpc-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-wpc-status' aria-live='polite' aria-atomic='true'></div>
	<div class='bb-wpc-live' aria-live='polite' aria-atomic='true'></div>

	<?php if ( ! empty( $products ) ) : ?>
		<div class='bb-wpc-viewport'>
			<?php if ( $a['isArrows'] ) : ?>
				<button
					type='button'
					class='bb-wpc-arrow bb-wpc-prev'
					aria-label='<?php echo esc_attr__( 'Previous product', 'b-blocks' ); ?>'
					aria-controls='<?php echo esc_attr( $trackId ); ?>'
				>
					<svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='M15 18l-6-6 6-6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>
				</button>
			<?php endif; ?>

			<ul class='bb-wpc-track' id='<?php echo esc_attr( $trackId ); ?>'>
				<?php echo wp_kses_post( WooProductCarousel::renderCards( $products, $a ) ); ?>
			</ul>

			<?php if ( $a['isArrows'] ) : ?>
				<button
					type='button'
					class='bb-wpc-arrow bb-wpc-next'
					aria-label='<?php echo esc_attr__( 'Next product', 'b-blocks' ); ?>'
					aria-controls='<?php echo esc_attr( $trackId ); ?>'
				>
					<svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='M9 18l6-6-6-6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>
				</button>
			<?php endif; ?>
		</div>

		<?php if ( $a['isDots'] ) : ?>
			<div class='bb-wpc-dots' role='tablist' aria-label='<?php echo esc_attr__( 'Slides', 'b-blocks' ); ?>'></div>
		<?php endif; ?>
	<?php else : ?>
		<p class='bb-wpc-empty'><?php echo esc_html( $a['noProductsMessage'] ); ?></p>
	<?php endif; ?>
</div>
