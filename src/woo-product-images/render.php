<?php

use BBlocks\Inc\Blocks\WooProductImages;
use BBlocks\Inc\Sanitize;

if ( ! class_exists( WooProductImages::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$product = WooProductImages::resolveProduct( isset( $block ) ? $block : null );
if ( ! $product ) {
	return;
}

$data  = WooProductImages::frontendAttributes( $attributes, $product );
$first = WooProductImages::firstImage( $data['product']['images'][0] );

$id   = wp_unique_id( 'bBlocksWooProductImages-' );
$data = Sanitize::attributes( $data );
$json = wp_json_encode( $data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT );

$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes([ 'class' => $planClass ]); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( $json ); ?>'
>
	<div class='b-blocks-woo-product-images-skeleton'>
		<?php
		// wp_kses_post() would drop srcset, sizes and fetchpriority: the image's own attributes, allowed.
		echo wp_kses( $first, [ 'img' => array_fill_keys( [ 'src', 'srcset', 'sizes', 'width', 'height', 'alt', 'class', 'loading', 'fetchpriority', 'decoding' ], true ) ] );
		?>
	</div>
</div>