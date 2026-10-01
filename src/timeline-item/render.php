<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$id = wp_unique_id( 'bBlocksTimelineItem-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );

$item = isset( $attributes['item'] ) && is_array( $attributes['item'] ) ? $attributes['item'] : array();

$side = isset( $item['side'] ) ? sanitize_key( (string) $item['side'] ) : '';
$side = in_array( $side, array( 'left', 'right' ), true ) ? $side : '';

// Empty means follow the parent Timeline, so only an explicit choice emits a
// class. Mirrors getTimelineItemClasses in the parent's utils/functions.js.
$arrowAlign = isset( $item['arrowAlign'] ) ? sanitize_key( (string) $item['arrowAlign'] ) : '';
$arrowAlign = in_array( $arrowAlign, array( 'start', 'center', 'end' ), true ) ? $arrowAlign : '';

// The date is a RichText field, so it can carry inline formatting — bold,
// links, colour. wp_kses_post keeps exactly what a post is allowed to hold
// and strips the rest, matching how every other RichText in the plugin is
// rendered.
$date = isset( $attributes['date'] ) ? wp_kses_post( (string) $attributes['date'] ) : '';

/**
 * The marker icon is an inline SVG from the bpl-tools icon library rather
 * than a font class, so it carries no webfont dependency — but it also means
 * raw markup reaches the page and has to be filtered.
 *
 * The allowlist below is not guesswork: it is every element and attribute
 * that actually occurs across all 4,354 icons in the three bundled libraries
 * (Font Awesome, Bootstrap, Lucide). Anything outside it — script, style, on*
 * handlers, foreignObject — is stripped by wp_kses.
 */
$svgAttr = array(
	'xmlns'            => true,
	'viewbox'          => true,
	'width'            => true,
	'height'           => true,
	'fill'             => true,
	'fill-rule'        => true,
	'fill-opacity'     => true,
	'stroke'           => true,
	'stroke-width'     => true,
	'stroke-linecap'   => true,
	'stroke-linejoin'  => true,
	'class'            => true,
	'id'               => true,
	'transform'        => true,
	'aria-hidden'      => true,
	'focusable'        => true,
);

$shapeAttr = array(
	'd'                => true,
	'points'           => true,
	'cx'               => true,
	'cy'               => true,
	'r'                => true,
	'rx'               => true,
	'ry'               => true,
	'x'                => true,
	'y'                => true,
	'x1'               => true,
	'y1'               => true,
	'x2'               => true,
	'y2'               => true,
	'width'            => true,
	'height'           => true,
	'fill'             => true,
	'fill-rule'        => true,
	'fill-opacity'     => true,
	'stroke'           => true,
	'stroke-width'     => true,
	'stroke-linecap'   => true,
	'stroke-linejoin'  => true,
	'transform'        => true,
);

$iconAllowed = array(
	'svg'      => $svgAttr,
	'g'        => $shapeAttr,
	'path'     => $shapeAttr,
	'circle'   => $shapeAttr,
	'ellipse'  => $shapeAttr,
	'rect'     => $shapeAttr,
	'line'     => $shapeAttr,
	'polyline' => $shapeAttr,
	'polygon'  => $shapeAttr,
);

$icon = isset( $attributes['icon'] ) ? wp_kses( (string) $attributes['icon'], $iconAllowed ) : '';

$itemClasses = trim(
	'b-blocks-timeline-item'
	. ( $side ? ' b-blocks-timeline-side-' . $side : '' )
	. ( $arrowAlign ? ' b-blocks-timeline-item-arrow-' . $arrowAlign : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $itemClasses ) ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
>
	<div class='b-blocks-timeline-item-style'></div>

	<div class='b-blocks-timeline-content'>
		<div class='b-blocks-timeline-card'>
			<?php
			// $content is this entry's inner blocks, each of which rendered
			// and escaped its own markup.
			echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks render their own escaped markup
			?>
		</div>
	</div>

	<div class='b-blocks-timeline-marker' aria-hidden='true'>
		<?php
		// Sanitized with wp_kses against the icon allowlist above.
		echo $icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- filtered by wp_kses above
		?>
	</div>

	<div class='b-blocks-timeline-date'><?php echo $date; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses_post above ?></div>
</div>
