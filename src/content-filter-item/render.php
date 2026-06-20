<?php
/**
 * Content Filter Item Block server-side render.
 *
 * Renders a single tagged container with the inner-blocks content. Frontend
 * JS toggles visibility based on data-bb-cf-category attribute.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (the same pattern used in comparison-table and process-steps).
 *
 * @package bBlocks
 */

$prefix = 'bBlocksContentFilterItem';
$id     = wp_unique_id( "$prefix-" );

// --- Slugify category for use in data attribute -----------------------
$slugify = static function ( $label ) {
	$slug = sanitize_title( (string) $label );
	if ( '' === $slug ) {
		$slug = strtolower( preg_replace( '/[^a-z0-9]+/i', '-', (string) $label ) );
		$slug = trim( $slug, '-' );
	}
	return '' === $slug ? '' : $slug;
};

$rawCategory = isset( $attributes['category'] ) ? (string) $attributes['category'] : '';
$categorySlug = $slugify( $rawCategory );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-cf-item' ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-cf-category='<?php echo esc_attr( $categorySlug ); ?>'
>
	<?php
	// $content holds the saved InnerBlocks markup. Echo as-is.
	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks render their own escaped markup
	?>
</div>
