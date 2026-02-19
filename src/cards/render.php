<?php
$id = wp_unique_id( 'bBlocksCards-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) ); ?>'
></div>