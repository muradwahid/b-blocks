<?php
/**
 * Icon Block server-side render.
 *
 * Renders a single configurable Font Awesome icon as a decorative <i>,
 * optionally inside a background "badge" container, optionally wrapped in
 * an accessible link. All styling is delivered through per-instance CSS
 * custom properties scoped to a wp_unique_id() wrapper id.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as icon-list, contact-card, divider, callout).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksIcon';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named).
// var() accepts a hardened comma-fallback allowlist so theme palette tokens
// like var(--wp--preset--color--primary, #123) pass but markup cannot.
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
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Sanitize a Font Awesome icon class string -------------------------
// Allowlist: letters, digits, hyphens, spaces only. Cap at 80 chars. Any
// token outside [a-zA-Z0-9- ] (e.g. quotes, angle brackets, slashes) voids
// the whole string so markup cannot be smuggled through the FA field.
$sanitizeIconClass = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	if ( strlen( $value ) > 80 ) {
		return '';
	}
	if ( ! preg_match( '/^[a-zA-Z0-9\-\s]+$/', $value ) ) {
		return '';
	}
	return $value;
};

// --- Resolve and sanitize attributes -----------------------------------
$iconClass = isset( $attributes['iconClass'] ) ? $sanitizeIconClass( $attributes['iconClass'] ) : '';
if ( '' === $iconClass ) {
	$iconClass = 'fa-solid fa-star';
}

$iconSize = isset( $attributes['iconSize'] ) ? max( 12, min( 200, (int) $attributes['iconSize'] ) ) : 48;

$bgShape = isset( $attributes['bgShape'] ) ? sanitize_key( (string) $attributes['bgShape'] ) : 'none';
$bgShape = in_array( $bgShape, [ 'none', 'circle', 'square', 'rounded' ], true ) ? $bgShape : 'none';

$bgSize    = isset( $attributes['bgSize'] ) ? max( 24, min( 300, (int) $attributes['bgSize'] ) ) : 80;
$bgPadding = isset( $attributes['bgPadding'] ) ? max( 0, min( 80, (int) $attributes['bgPadding'] ) ) : 16;

$borderWidth  = isset( $attributes['borderWidth'] ) ? max( 0, min( 8, (int) $attributes['borderWidth'] ) ) : 0;
$borderRadius = isset( $attributes['borderRadius'] ) ? max( 0, min( 50, (int) $attributes['borderRadius'] ) ) : 50;

$iconColor   = $sanitizeColor( $attributes['iconColor'] ?? '', '' );
$iconBgColor = $sanitizeColor( $attributes['iconBgColor'] ?? '', '' );
$borderColor = $sanitizeColor( $attributes['borderColor'] ?? '', '' );
$hoverColor   = $sanitizeColor( $attributes['hoverColor'] ?? '', '' );
$hoverBgColor = $sanitizeColor( $attributes['hoverBgColor'] ?? '', '' );

$linkUrl    = isset( $attributes['linkUrl'] ) ? esc_url_raw( (string) $attributes['linkUrl'] ) : '';
$linkNewTab = ! empty( $attributes['linkNewTab'] );
$ariaLabel  = isset( $attributes['ariaLabel'] ) ? sanitize_text_field( (string) $attributes['ariaLabel'] ) : '';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$maxWidth = isset( $attributes['maxWidth'] ) ? max( 0, min( 1000, (int) $attributes['maxWidth'] ) ) : 0;

$rotate = isset( $attributes['rotate'] ) ? (int) $attributes['rotate'] : 0;
$rotate = in_array( $rotate, [ 0, 45, 90, 135, 180 ], true ) ? $rotate : 0;

$shadow = isset( $attributes['shadow'] ) ? sanitize_key( (string) $attributes['shadow'] ) : 'none';
$shadow = in_array( $shadow, [ 'none', 'small', 'medium', 'large' ], true ) ? $shadow : 'none';

$hasBg     = 'none' !== $bgShape;
$hasHover  = '' !== $hoverColor || '' !== $hoverBgColor;
$shadowMap = [
	'none'   => 'none',
	'small'  => '0 1px 3px rgba(0,0,0,0.12)',
	'medium' => '0 4px 12px rgba(0,0,0,0.15)',
	'large'  => '0 10px 24px rgba(0,0,0,0.20)',
];

// --- Resolve the bg container border-radius per shape ------------------
if ( 'circle' === $bgShape ) {
	$resolvedRadius = '50%';
} elseif ( 'rounded' === $bgShape ) {
	$resolvedRadius = $borderRadius . '%';
} else {
	$resolvedRadius = '0';
}

// --- Wrapper CSS variables --------------------------------------------
$styleParts = [
	'--bb-icon-size:' . $iconSize . 'px',
	'--bb-icon-color:' . ( '' === $iconColor ? 'inherit' : $iconColor ),
	'--bb-icon-rotate:' . $rotate . 'deg',
	'--bb-icon-bg:' . ( '' === $iconBgColor ? 'transparent' : $iconBgColor ),
	'--bb-icon-bg-size:' . $bgSize . 'px',
	'--bb-icon-bg-padding:' . $bgPadding . 'px',
	'--bb-icon-bg-radius:' . $resolvedRadius,
	'--bb-icon-border-width:' . $borderWidth . 'px',
	'--bb-icon-border-color:' . ( '' === $borderColor ? 'transparent' : $borderColor ),
	'--bb-icon-shadow:' . $shadowMap[ $shadow ],
];
if ( '' !== $hoverColor ) {
	$styleParts[] = '--bb-icon-hover-color:' . $hoverColor;
}
if ( '' !== $hoverBgColor ) {
	$styleParts[] = '--bb-icon-hover-bg:' . $hoverBgColor;
}
if ( $maxWidth > 0 ) {
	$styleParts[] = '--bb-icon-max-width:' . $maxWidth . 'px';
}
$wrapperStyle = implode( ';', $styleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-icon-block'
	. ' bb-icon-align--' . $alignment
	. ( $hasBg ? ' bb-icon--shape-' . $bgShape : '' )
	. ( $hasBg ? ' has-icon-bg' : '' )
	. ( $hasHover ? ' has-hover' : '' )
	. ( $maxWidth > 0 ? ' has-max-width' : '' )
);

$srOnly = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';

// The decorative icon markup is identical in both branches.
$iconMarkup = '<i class="' . esc_attr( $iconClass ) . '" aria-hidden="true"></i>';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( '' !== $linkUrl ) : ?>
		<?php
		// When the icon is aria-hidden the <a> must carry an accessible name.
		// Use the author-supplied label when present; fall back to a generic
		// translatable string so screen readers always announce something.
		$resolvedAriaLabel = '' !== $ariaLabel
			? $ariaLabel
			: __( 'Icon link', 'b-blocks' );
		?>
		<a
			class='bb-icon-link'
			href='<?php echo esc_url( $linkUrl ); ?>'
			aria-label='<?php echo esc_attr( $resolvedAriaLabel ); ?>'
			<?php if ( $linkNewTab ) : ?>
				target='_blank' rel='noopener noreferrer'
			<?php endif; ?>
		>
			<span class='bb-icon-inner'>
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- class already esc_attr()'d above
				echo $iconMarkup;
				?>
			</span>
			<?php if ( $linkNewTab ) : ?>
				<span class='bb-icon-sr-only' style='<?php echo esc_attr( $srOnly ); ?>'>
					<?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?>
				</span>
			<?php endif; ?>
		</a>
	<?php else : ?>
		<span class='bb-icon-inner'>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- class already esc_attr()'d above
			echo $iconMarkup;
			?>
		</span>
	<?php endif; ?>
</div>
