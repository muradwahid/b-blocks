<?php
/**
 * Process Steps Block server-side render.
 *
 * Emits only an empty wrapper carrying the block attributes as JSON. The
 * markup is rendered on the client by view.js (React hydration), matching the
 * b-blocks convention (see image-hotspot / button-group).
 *
 * @package bBlocks
 */

$id = wp_unique_id( 'bBlocksProcessSteps-' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
