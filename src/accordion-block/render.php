<?php
use BBlocks\Inc\Sanitize;

$id = wp_unique_id( 'bBlocksAccordionBlock-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$attributes = Sanitize::attributes($attributes);

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>