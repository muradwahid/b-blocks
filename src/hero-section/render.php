<?php
/**
 * Hero Section block server-side render.
 *
 * Following the bplugins convention (see image-hotspot / article-card), the
 * server only emits an empty wrapper carrying the block attributes as JSON.
 * React hydrates the hero on the frontend via view.js.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$id = wp_unique_id( 'hero-section-' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
