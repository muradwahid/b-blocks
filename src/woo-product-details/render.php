<?php
use BBlocks\Inc\Blocks\WooProductDetails;

if ( ! class_exists( WooProductDetails::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$product = WooProductDetails::resolveProduct( isset( $block ) ? $block : null );
if ( ! $product ) {
	return;
}

$view = WooProductDetails::render( $attributes, $product );
if ( ! $view ) {
	return;
}

$id = wp_unique_id( 'woo-product-details-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $view );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php // `woocommerce`: its stylesheets scope the reviews, stars and attributes table to it (the body has it only on product pages). ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => 'woocommerce' ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	<?php // HEX flags: the tabs' HTML keeps its entities (&quot;…) as JSON escapes, so reading the attribute can't decode them into the JSON. ?>
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
></div>