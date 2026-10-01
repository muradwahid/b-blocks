<?php
$id = wp_unique_id( 'bBlocksList-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
?>
<div <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>