<?php
/**
 * Callout Block — server-side render.
 *
 * Renders an inline editorial Note / Tip / Warning / Danger / Success box that
 * authors drop INSIDE post content while writing. Five built-in types each
 * ship with sensible default colors AND a default Font Awesome icon, and the
 * editor can override any default per instance (icon, colors, title, layout).
 *
 * Output structure (semantic + accessible):
 *
 *   <aside role="note" aria-label="<type>: <title>">
 *     <div class="bb-co__icon" aria-hidden="true">
 *       <i class="<font-awesome-icon-class>"></i>
 *     </div>
 *     <div class="bb-co__body">
 *       <h4 class="bb-co__title">Title text</h4>   (configurable heading tag)
 *       <div class="bb-co__content">
 *         <!-- InnerBlocks output -->
 *       </div>
 *     </div>
 *   </aside>
 *
 * Helpers are intentionally inlined as static closures — Gutenberg may include
 * this file more than once per request which would cause a "Cannot redeclare
 * function" fatal if helpers were declared at file scope. Same pattern as
 * blockquote / click-to-share / author-box / process-steps.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksCallout';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, var(), or named) -----
$sanitizeColor = static function ( $color, $fallback = '' ) {
	$color = trim( (string) $color );
	if ( '' === $color ) {
		return $fallback;
	}
	if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
		return $color;
	}
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp an int to a [min, max] range with a fallback -----------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( null === $value || '' === $value ) {
		return $fallback;
	}
	$n = (int) $value;
	if ( $n < $min ) {
		return $min;
	}
	if ( $n > $max ) {
		return $max;
	}
	return $n;
};

// --- Sanitize a Font Awesome class string. Only letters, digits, spaces,
// hyphens, and underscores are allowed. Caps the length at 80 characters
// so a malicious editor can't smuggle markup through this attribute. -----
$sanitizeIconClass = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( strlen( $value ) > 80 ) {
		return $fallback;
	}
	if ( ! preg_match( '/^[a-zA-Z0-9 _\-]+$/', $value ) ) {
		return $fallback;
	}
	return $value;
};

// --- Type → default palette + default icon table ------------------------
$typePresets = [
	'note'    => [
		'accent' => '#0ea5e9',
		'bg'     => '#f0f9ff',
		'title'  => '#075985',
		'body'   => '#0c4a6e',
		'icon'   => 'fa-solid fa-circle-info',
		'label'  => __( 'Note', 'b-blocks' ),
	],
	'tip'     => [
		'accent' => '#10b981',
		'bg'     => '#ecfdf5',
		'title'  => '#065f46',
		'body'   => '#064e3b',
		'icon'   => 'fa-solid fa-lightbulb',
		'label'  => __( 'Tip', 'b-blocks' ),
	],
	'warning' => [
		'accent' => '#f59e0b',
		'bg'     => '#fffbeb',
		'title'  => '#92400e',
		'body'   => '#78350f',
		'icon'   => 'fa-solid fa-triangle-exclamation',
		'label'  => __( 'Warning', 'b-blocks' ),
	],
	'danger'  => [
		'accent' => '#ef4444',
		'bg'     => '#fef2f2',
		'title'  => '#991b1b',
		'body'   => '#7f1d1d',
		'icon'   => 'fa-solid fa-circle-exclamation',
		'label'  => __( 'Danger', 'b-blocks' ),
	],
	'success' => [
		'accent' => '#22c55e',
		'bg'     => '#f0fdf4',
		'title'  => '#166534',
		'body'   => '#14532d',
		'icon'   => 'fa-solid fa-circle-check',
		'label'  => __( 'Success', 'b-blocks' ),
	],
];

// --- Resolve and sanitize attributes -----------------------------------
$attributes = is_array( $attributes ) ? $attributes : [];

$calloutTypeRaw = isset( $attributes['calloutType'] ) ? strtolower( trim( (string) $attributes['calloutType'] ) ) : 'note';
$calloutType    = isset( $typePresets[ $calloutTypeRaw ] ) ? $calloutTypeRaw : 'note';
$preset         = $typePresets[ $calloutType ];

$layoutRaw = isset( $attributes['layout'] ) ? strtolower( trim( (string) $attributes['layout'] ) ) : 'accent-bar';
$layout    = in_array( $layoutRaw, [ 'accent-bar', 'filled', 'outlined' ], true ) ? $layoutRaw : 'accent-bar';

$alignmentRaw = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'left';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center', 'right' ], true ) ? $alignmentRaw : 'left';

$title     = isset( $attributes['title'] ) ? trim( (string) $attributes['title'] ) : '';
$showTitle = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;

$titleTagRaw = isset( $attributes['titleTag'] ) ? strtolower( trim( (string) $attributes['titleTag'] ) ) : 'h4';
$titleTag    = in_array( $titleTagRaw, [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ], true ) ? $titleTagRaw : 'h4';

$showIcon   = isset( $attributes['showIcon'] ) ? (bool) $attributes['showIcon'] : true;
$iconClass  = $sanitizeIconClass( $attributes['iconClass'] ?? $preset['icon'], $preset['icon'] );
$iconSize   = $clampInt( $attributes['iconSize'] ?? 20, 12, 64, 20 );

$accentColor     = $sanitizeColor( $attributes['accentColor']     ?? '', '' );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '' );
$titleColor      = $sanitizeColor( $attributes['titleColor']      ?? '', '' );
$bodyColor       = $sanitizeColor( $attributes['bodyColor']       ?? '', '' );
$iconColor       = $sanitizeColor( $attributes['iconColor']       ?? '', '' );

$accentBarWidth = $clampInt( $attributes['accentBarWidth'] ?? 4, 1, 16, 4 );
$borderRadius   = $clampInt( $attributes['borderRadius']   ?? 6, 0, 32, 6 );

$paddingTop    = $clampInt( $attributes['paddingTop']    ?? 16, 0, 96, 16 );
$paddingRight  = $clampInt( $attributes['paddingRight']  ?? 20, 0, 96, 20 );
$paddingBottom = $clampInt( $attributes['paddingBottom'] ?? 16, 0, 96, 16 );
$paddingLeft   = $clampInt( $attributes['paddingLeft']   ?? 20, 0, 96, 20 );

$titleFontSize = $clampInt( $attributes['titleFontSize'] ?? 15, 10, 48, 15 );
$bodyFontSize  = $clampInt( $attributes['bodyFontSize']  ?? 15, 10, 36, 15 );

$titleFontWeight = isset( $attributes['titleFontWeight'] ) ? trim( (string) $attributes['titleFontWeight'] ) : '600';
if ( ! in_array( $titleFontWeight, [ '300', '400', '500', '600', '700', '800' ], true ) ) {
	$titleFontWeight = '600';
}

// --- Resolved color tokens (override → preset) -------------------------
$resolvedAccent = '' !== $accentColor     ? $accentColor     : $preset['accent'];
$resolvedBg     = '' !== $backgroundColor ? $backgroundColor : $preset['bg'];
$resolvedTitle  = '' !== $titleColor      ? $titleColor      : $preset['title'];
$resolvedBody   = '' !== $bodyColor       ? $bodyColor       : $preset['body'];
$resolvedIcon   = '' !== $iconColor       ? $iconColor       : $resolvedAccent;

$hasTitle = $showTitle && '' !== $title;

// --- Accessibility label -----------------------------------------------
// When the title renders as a heading (h2–h6) screen readers already get the
// type announced via the heading text. When there's no title OR the title is
// rendered as a paragraph we add an aria-label so the type is still spoken.
$ariaLabel = '';
$useAriaLabel = ! $hasTitle || 'p' === $titleTag;
if ( $useAriaLabel ) {
	if ( $hasTitle ) {
		/* translators: 1: callout type label (Note/Tip/...), 2: callout title text */
		$ariaLabel = sprintf( __( '%1$s: %2$s', 'b-blocks' ), $preset['label'], $title );
	} else {
		$ariaLabel = $preset['label'];
	}
}

// --- Wrapper classes ---------------------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-callout'
	. ' bb-co-type--' . $calloutType
	. ' bb-co-style--' . $layout
	. ' bb-co-align--' . $alignment
	. ( $showIcon ? ' has-icon' : ' no-icon' )
);

// --- CSS custom properties for per-instance styling --------------------
$cssVars = [
	'--bb-co-accent: '         . $resolvedAccent,
	'--bb-co-bg: '             . $resolvedBg,
	'--bb-co-title-color: '    . $resolvedTitle,
	'--bb-co-body-color: '     . $resolvedBody,
	'--bb-co-icon-color: '     . $resolvedIcon,
	'--bb-co-accent-width: '   . $accentBarWidth . 'px',
	'--bb-co-radius: '         . $borderRadius . 'px',
	'--bb-co-pad-top: '        . $paddingTop . 'px',
	'--bb-co-pad-right: '      . $paddingRight . 'px',
	'--bb-co-pad-bottom: '     . $paddingBottom . 'px',
	'--bb-co-pad-left: '       . $paddingLeft . 'px',
	'--bb-co-title-size: '     . $titleFontSize . 'px',
	'--bb-co-title-weight: '   . $titleFontWeight,
	'--bb-co-body-size: '      . $bodyFontSize . 'px',
	'--bb-co-icon-size: '      . $iconSize . 'px',
];
$wrapperStyle = implode( '; ', $cssVars ) . ';';

// Heading tag — allowlist already enforced; wp_kses keeps tag_escape extra safe.
$safeTitleTag = tag_escape( $titleTag );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<aside
		class='bb-co'
		role='note'
		<?php if ( '' !== $ariaLabel ) : ?>
			aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
		<?php endif; ?>
	>
		<?php if ( $showIcon ) : ?>
			<div class='bb-co__icon' aria-hidden='true'>
				<i class='<?php echo esc_attr( $iconClass ); ?>'></i>
			</div>
		<?php endif; ?>

		<div class='bb-co__body'>
			<?php if ( $hasTitle ) : ?>
				<<?php echo $safeTitleTag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- allowlisted heading tag, escaped via tag_escape(). ?>
					class='bb-co__title'
				>
					<?php echo esc_html( $title ); ?>
				</<?php echo $safeTitleTag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- allowlisted heading tag, escaped via tag_escape(). ?>>
			<?php endif; ?>

			<div class='bb-co__content'>
				<?php
				// $content is the rendered InnerBlocks markup. Core already
				// runs each inner block's render through its own escaping
				// pipeline (RichText → wp_kses_post, etc.), so echoing the
				// pre-rendered tree directly is the documented pattern.
				echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-rendered InnerBlocks content.
				?>
			</div>
		</div>
	</aside>
</div>
