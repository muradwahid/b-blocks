<?php
$id = wp_unique_id( 'bBlocksFacebookPage-' );
$api_keys   = get_option( 'bBlocksApiKeys', [] );
?>
<div id="fb-root"></div>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
	data-facebookkey='<?php echo esc_attr( $api_keys['facebook']['key'] ?? '' ); ?>'>
</div>