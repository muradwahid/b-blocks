<?php
use BBlocks\Inc\Blocks\WooAddToCart;
use BBlocks\Inc\Sanitize;

if ( ! class_exists( WooAddToCart::class ) || ! function_exists( 'wc_get_product' ) ) {
	return;
}

$id         = wp_unique_id( 'bBlocksWooAddToCart-' );
$attributes = WooAddToCart::frontendAttributes( $attributes, isset( $block ) ? $block : null );

if ( ! $attributes ) {
	return;
}

$attributes = Sanitize::attributes( $attributes );

$json = wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( $json ); ?>'
>
	<?php
	// Without JavaScript the block cannot render; the product page still sells
	// it. view.js replaces this with the block.
	$productUrl = $attributes['product']['url'] ?? '';
	if ( $productUrl ) :
		?>
		<noscript><a href='<?php echo esc_url( $productUrl ); ?>'><?php echo esc_html__( 'View product', 'b-blocks' ); ?></a></noscript>
	<?php endif; ?>
</div>
