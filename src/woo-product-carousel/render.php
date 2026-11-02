<?php
use BBlocks\Inc\Blocks\WooProductCarousel;

if ( ! class_exists( WooProductCarousel::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$currentId = get_the_ID();
$currentId = $currentId && 'product' === get_post_type( $currentId ) ? (int) $currentId : 0;

$query    = WooProductCarousel::resolve( $attributes['query'] ?? [], $attributes['layout']['imageSize'] ?? 'full', $currentId );
$products = WooProductCarousel::getProducts( $query );

// Nothing to slide: the page shows nothing (the editor explains why).
if ( ! $products ) {
	return;
}

$id = wp_unique_id( 'bBlocksWooProductCarousel-' );

// Makes the cart buttons add simple products without leaving the page (WooCommerce's own script).
if ( ! empty( $attributes['elements']['cart'] ) && wp_script_is( 'wc-add-to-cart', 'registered' ) ) {
	wp_enqueue_script( 'wc-add-to-cart' );
}

$attributes['products'] = $products;
$attributes['labels']   = WooProductCarousel::labels();
$attributes             = BBlocks\Inc\Sanitize::attributes( $attributes );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	<?php // HEX flags: quotes and brackets in the price HTML stay JSON escapes, so reading the attribute can't break the JSON. ?>
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
></div>
