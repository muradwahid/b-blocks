<?php
/**
 * Server render for the Floating CTA block.
 *
 * Emits an empty wrapper carrying the block attributes as a JSON payload.
 * The frontend `view.js` (and the editor) hydrate the actual button so that
 * the markup, styling, and scroll/dismiss behavior live in one place.
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$id = wp_unique_id( 'bBlocksFloatingCta-' );

// Provide a stable client id so the dismiss localStorage key is deterministic
// across page loads when the editor has not supplied one.
if ( empty( $attributes['cId'] ) ) {
	$attributes['cId'] = $id;
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id="<?php echo esc_attr( $id ); ?>"
	data-attributes="<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>"
></div>
