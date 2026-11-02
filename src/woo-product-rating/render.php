<?php
use BBlocks\Inc\Blocks\WooProductRating;

if ( ! class_exists( WooProductRating::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$product = WooProductRating::resolveProduct( isset( $block ) ? $block : null );
if ( ! $product ) {
	return;
}

// The settings, checked, with the product's rating and texts; none when there is nothing to show.
$view = WooProductRating::render( $attributes, $product );
if ( ! $view ) {
	return;
}

$id = wp_unique_id( 'bBlocksWooProductRating-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $view );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	<?php // HEX flags: quotes and brackets in the captions stay JSON escapes, so reading the attribute can't break the JSON. ?>
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
></div>