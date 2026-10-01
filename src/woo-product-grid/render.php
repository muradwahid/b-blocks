<?php

use BBlocks\Inc\Blocks\WooProductGrid;
use BBlocks\Inc\Sanitize;

if ( ! class_exists( WooProductGrid::class ) ) {
	return;
}

$id = wp_unique_id( 'bBlocksWooProductGrid-' );

$currentId = get_the_ID();
if ( $currentId && 'product' === get_post_type( $currentId ) ) {
	$attributes['query']['currentProductId'] = (int) $currentId;
}

if ( ! function_exists( 'wc_get_product' ) ) {
	if ( ! current_user_can( 'activate_plugins' ) && ! current_user_can( 'install_plugins' ) ) {
		return;
	}

	$installUrl = WooProductGrid::wooInstallUrl();

	$linkOpen  = $installUrl ? '<a href="' . esc_url( $installUrl ) . '" target="_blank" rel="noreferrer noopener">' : '<strong>';
	$linkClose = $installUrl ? '</a>' : '</strong>';

	$message = __( 'WooCommerce is not installed/activated on your site. Please install and activate <a>WooCommerce</a> first.', 'b-blocks' );
	$message = str_replace( [ '<a>', '</a>' ], [ $linkOpen, $linkClose ], $message );
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes(); ?>
	>
		<p class='b-blocks-woo-product-grid-notice'>
			<?php
			echo wp_kses(
				$message,
				[
					'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
					'strong' => [],
				]
			);
			?>
		</p>
	</div>
	<?php
	return;
}

$a = WooProductGrid::resolveAttributes( $attributes );

$attributes = Sanitize::attributes( WooProductGrid::viewAttributes( $attributes, $a ) );

if ( wp_script_is( 'wc-add-to-cart', 'registered' ) ) {
	wp_enqueue_script( 'wc-add-to-cart' );
}

$firstData           = WooProductGrid::getProducts( $a, 0, 1 );
$firstData['terms']  = WooProductGrid::filterTerms( $a );
$firstData['labels'] = WooProductGrid::labels();
$firstData           = Sanitize::attributes( $firstData );

wp_reset_postdata();

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
	data-nonce='<?php echo esc_attr( wp_json_encode( wp_create_nonce( 'wp_ajax' ) ) ); ?>'
	data-ajax-url='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
	data-first-products='<?php echo esc_attr( wp_json_encode( $firstData ) ); ?>'
	data-bblocks-advanced='<?php echo esc_attr( wp_json_encode( $attributes['advanced'] ?? [] ) ); ?>'
></div>