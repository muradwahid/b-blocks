<?php
// Attribute HTML is shown as HTML in the browser: unsafe markup out for authors without unfiltered_html.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
$id = wp_unique_id( 'bBlocksInputField-' );
?>
<div <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>