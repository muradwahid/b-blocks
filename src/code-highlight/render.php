<?php
/**
 * Code Highlight block server-side render.
 *
 * Emits only an empty wrapper carrying the block attributes as JSON. The markup
 * is rendered on the client by view.js from the same shared component the editor
 * uses, matching the b-blocks convention (see image-hotspot / infographic).
 *
 * @package bBlocks
 */

$prefix = 'b-blocks-code-highlight';
$id     = empty( $attributes['blockId'] ) ? wp_unique_id( "$prefix-" ) : "$prefix-" . $attributes['blockId'];

$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes([ 'class' => $planClass ]); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
