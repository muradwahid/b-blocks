<?php
use BBlocks\Inc\Blocks\WooProductPrice;

if ( ! class_exists( WooProductPrice::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$product = WooProductPrice::resolveProduct( isset( $block ) ? $block : null );
if ( ! $product ) {
	return;
}

// The settings, checked, with the product's price; none when it has no price.
$attributes = WooProductPrice::frontendAttributes( $attributes, $product );
if ( ! $attributes ) {
	return;
}

$id = wp_unique_id( 'woo-product-price-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
