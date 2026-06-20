<?php
/**
 * Scroll Reveal block server-side render.
 *
 * A generic InnerBlocks wrapper that reveals its children with a fade + slide
 * entrance animation when they scroll into view. The behavior is pure
 * progressive enhancement:
 *
 *  - With JavaScript disabled, the inner blocks render fully visible. The
 *    pre-animation hidden state (opacity:0 + transform) is applied ONLY by
 *    view.js, so no content is ever hidden behind the animation.
 *  - When `prefers-reduced-motion: reduce` is active, view.js skips the hidden
 *    state entirely and leaves the content visible.
 *
 * All animation parameters are emitted as validated `data-*` attributes and
 * consumed by view.js. No inline animation styles are emitted here.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as sticky-sidebar / media-text-section).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksScrollReveal';
$id        = wp_unique_id( "$prefix-" );
$planClass = Utils::isPro() ? 'pro' : 'free';

$innerBlocks = $content;

// --- Sanitizers --------------------------------------------------------

$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$i = (int) $value;
	if ( $i < $min ) {
		return $min;
	}
	if ( $i > $max ) {
		return $max;
	}
	return $i;
};

$clampFloat = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$f = (float) $value;
	if ( $f < $min ) {
		return $min;
	}
	if ( $f > $max ) {
		return $max;
	}
	return $f;
};

$pickFromList = static function ( $value, array $allow, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allow, true ) ? $value : $fallback;
};

// --- Resolve and validate attributes ---------------------------------

$animation = $pickFromList(
	$attributes['animation'] ?? 'fade-up',
	array( 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'fade' ),
	'fade-up'
);
$easing    = $pickFromList(
	$attributes['easing'] ?? 'ease-out',
	array( 'ease-out', 'ease-in-out', 'linear' ),
	'ease-out'
);

$duration  = $clampInt( $attributes['duration'] ?? 600, 200, 2000, 600 );
$delay     = $clampInt( $attributes['delay'] ?? 0, 0, 2000, 0 );
$distance  = $clampInt( $attributes['translateDistance'] ?? 40, 10, 120, 40 );
$threshold = $clampFloat( $attributes['triggerThreshold'] ?? 0.15, 0, 0.5, 0.15 );

$once = ! isset( $attributes['once'] ) || ! empty( $attributes['once'] );

// --- Wrapper classes -------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-scroll-reveal bb-sr-anim-' . $animation );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'id' => $id, 'class' => $wrapperClasses ) ); ?>
	data-bb-scroll-reveal="1"
	data-bb-animation="<?php echo esc_attr( $animation ); ?>"
	data-bb-duration="<?php echo esc_attr( (string) $duration ); ?>"
	data-bb-delay="<?php echo esc_attr( (string) $delay ); ?>"
	data-bb-easing="<?php echo esc_attr( $easing ); ?>"
	data-bb-translate="<?php echo esc_attr( (string) $distance ); ?>"
	data-bb-threshold="<?php echo esc_attr( (string) $threshold ); ?>"
	data-bb-once="<?php echo esc_attr( $once ? '1' : '0' ); ?>"
>
	<div class="bb-sr-inner">
		<?php echo wp_kses( $innerBlocks, Utils::allowedInnerHTML() ); ?>
	</div>
</div>
