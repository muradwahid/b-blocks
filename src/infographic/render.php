<?php
$prefix = 'bBlocksInfographic';
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
$id     = empty( $attributes['blockId'] ) ? wp_unique_id( "$prefix-" ) : "$prefix-" . $attributes['blockId'];
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes([ 'class' => $planClass ]); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>