<?php
/**
 * HTML block server-side render.
 *
 * `htmlCode` is raw author markup that view.js injects into the page and then
 * activates any <script> inside it. That is exactly the capability WordPress
 * gates behind unfiltered_html, so the attribute is filtered here against the
 * POST AUTHOR's capability before it is ever handed to the frontend. An author
 * who may not publish unfiltered HTML gets a wp_kses_post() copy, which has no
 * <script> and no event-handler attributes left in it - so the activation pass
 * in view.js finds nothing to run.
 *
 * @package bBlocks
 *
 * @var array $attributes Block attributes.
 */

$id = wp_unique_id( 'bBlocksHtml-' );

$attributes['htmlCode'] = BBlocks\Inc\Sanitize::userHtml( $attributes['htmlCode'] ?? '' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
