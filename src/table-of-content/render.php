<?php
// Attribute HTML is shown as HTML in the browser: unsafe markup out for authors without unfiltered_html.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
if ( !defined( 'ABSPATH' ) ) { exit; }

$id = wp_unique_id( 'tbcnbBlock-' );

?>

<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>