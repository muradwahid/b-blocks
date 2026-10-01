<?php

$prefix    = 'bBlocksGoogleMap';
$id        = wp_unique_id( "$prefix-" );
$api_keys  = get_option( 'bBlocksApiKeys', [] );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
$source  = isset( $attributes['source'] ) && is_array( $attributes['source'] ) ? $attributes['source'] : [];
$markers = isset( $attributes['markers'] ) && is_array( $attributes['markers'] ) ? $attributes['markers'] : [];
$caption = isset( $attributes['caption'] ) && is_array( $attributes['caption'] ) ? $attributes['caption'] : [];

// Best available human-readable location for the static fallback.
$fallback_address = '';
if ( ! empty( $source['center']['address'] ) ) {
	$fallback_address = $source['center']['address'];
} elseif ( ! empty( $markers[0]['address'] ) ) {
	$fallback_address = $markers[0]['address'];
} elseif ( ! empty( $markers[0]['title'] ) ) {
	$fallback_address = $markers[0]['title'];
} elseif ( ! empty( $caption['text'] ) ) {
	$fallback_address = $caption['text'];
}

// Fall back to raw coordinates so the deep link always resolves somewhere.
$fallback_query = $fallback_address;
if ( '' === $fallback_query && isset( $source['center']['lat'], $source['center']['lng'] ) ) {
	$fallback_query = $source['center']['lat'] . ',' . $source['center']['lng'];
}

$maps_url = $fallback_query ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( $fallback_query ) : 'https://www.google.com/maps';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
	data-mapkey='<?php echo esc_attr( $api_keys['googleMaps']['key'] ?? '' ); ?>'
>
	<div class='b-blocks-google-map-fallback'>
		<?php if ( $fallback_address ) : ?>
			<p class='b-blocks-google-map-fallback-address'><?php echo esc_html( $fallback_address ); ?></p>
		<?php endif; ?>

		<a class='b-blocks-google-map-fallback-link' href='<?php echo esc_url( $maps_url ); ?>' target='_blank' rel='noopener noreferrer'>
			<?php esc_html_e( 'Open in Google Maps', 'b-blocks' ); ?>
		</a>
	</div>
</div>
