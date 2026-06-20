<?php
/**
 * Server-side render for the b-blocks/timeline block.
 *
 * The block is hydrated on the front-end by view.js, which reads the
 * sanitized attributes from the data-attributes JSON payload and renders
 * the timeline. We output a single wrapping element here, escape all
 * attribute output, and avoid emitting any raw user-supplied HTML at
 * the PHP layer.
 *
 * @package bBlocks
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Block inner HTML (unused).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$bblocks_timeline_id = wp_unique_id( 'bBlocksTimeline-' );

// Allow-list the attributes we forward to the front-end so unexpected
// keys are dropped before the JSON payload is rendered.
$bblocks_timeline_allowed_layouts  = array( 'left', 'right', 'alternating' );
$bblocks_timeline_allowed_variants = array( 'modern', 'classic', 'minimal' );

$bblocks_timeline_layout = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'alternating';
if ( ! in_array( $bblocks_timeline_layout, $bblocks_timeline_allowed_layouts, true ) ) {
	$bblocks_timeline_layout = 'alternating';
}

$bblocks_timeline_variant = isset( $attributes['variant'] ) ? sanitize_key( $attributes['variant'] ) : 'modern';
if ( ! in_array( $bblocks_timeline_variant, $bblocks_timeline_allowed_variants, true ) ) {
	$bblocks_timeline_variant = 'modern';
}

$bblocks_timeline_line_color = isset( $attributes['lineColor'] ) ? sanitize_hex_color( $attributes['lineColor'] ) : '';
if ( empty( $bblocks_timeline_line_color ) ) {
	$bblocks_timeline_line_color = '#dee2e6';
}

$bblocks_timeline_show_icons = ! empty( $attributes['showIcons'] );

$bblocks_timeline_items = array();
if ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) {
	foreach ( $attributes['items'] as $bblocks_timeline_item ) {
		if ( ! is_array( $bblocks_timeline_item ) ) {
			continue;
		}

		$bblocks_timeline_accent = isset( $bblocks_timeline_item['accentColor'] )
			? sanitize_hex_color( $bblocks_timeline_item['accentColor'] )
			: '';

		$bblocks_timeline_items[] = array(
			'date'        => isset( $bblocks_timeline_item['date'] ) ? sanitize_text_field( $bblocks_timeline_item['date'] ) : '',
			'title'       => isset( $bblocks_timeline_item['title'] ) ? wp_kses_post( $bblocks_timeline_item['title'] ) : '',
			'description' => isset( $bblocks_timeline_item['description'] ) ? wp_kses_post( $bblocks_timeline_item['description'] ) : '',
			'icon'        => isset( $bblocks_timeline_item['icon'] ) ? sanitize_text_field( $bblocks_timeline_item['icon'] ) : '',
			'accentColor' => $bblocks_timeline_accent ? $bblocks_timeline_accent : '#0d6efd',
		);
	}
}

$bblocks_timeline_payload = array(
	'layout'    => $bblocks_timeline_layout,
	'variant'   => $bblocks_timeline_variant,
	'lineColor' => $bblocks_timeline_line_color,
	'showIcons' => (bool) $bblocks_timeline_show_icons,
	'items'     => $bblocks_timeline_items,
);

$bblocks_timeline_plan_class = ( class_exists( '\\BBlocks\\Inc\\Utils' ) && \BBlocks\Inc\Utils::isPro() ) ? 'pro' : 'free';

$bblocks_timeline_wrapper_classes = sprintf(
	'%s timeline-block timeline-variant-%s timeline-layout-%s',
	$bblocks_timeline_plan_class,
	$bblocks_timeline_variant,
	$bblocks_timeline_layout
);
?>
<div
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped.
	echo get_block_wrapper_attributes( array( 'class' => $bblocks_timeline_wrapper_classes ) );
	?>
	id="<?php echo esc_attr( $bblocks_timeline_id ); ?>"
	role="list"
	aria-label="<?php echo esc_attr__( 'Timeline', 'b-blocks' ); ?>"
	data-attributes='<?php echo esc_attr( wp_json_encode( $bblocks_timeline_payload ) ); ?>'
></div>
