<?php
/**
 * Event Card block server-side render.
 *
 * Following the bplugins convention (see image-hotspot), the server only emits
 * an empty wrapper carrying the block attributes as JSON. React hydrates the
 * card — and outputs the schema.org Event JSON-LD — on the frontend via view.js.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */
// Attribute HTML is shown as HTML in the browser: unsafe markup out for authors without unfiltered_html.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );

$id = wp_unique_id( 'bBlocksEventCard-' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
