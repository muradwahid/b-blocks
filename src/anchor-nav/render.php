<?php
/**
 * Anchor Navigation block server-side render.
 *
 * Renders a <nav aria-label> landmark containing real <a href="#anchor"> jump
 * links. The dependency-free view.js adds smooth scrolling, an optional
 * show-after-scroll reveal, and IntersectionObserver scroll-spy that toggles
 * the active link (class + aria-current). Markup is server-rendered so the
 * links work without JavaScript and are present for SEO / assistive tech.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as feature-tabs / image-accordion).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksAnchorNav';
$id        = wp_unique_id( "$prefix-" );
$planClass = Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

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
	// Hardened var() pattern — fallback restricted to safe chars only.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

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

$pickFromList = static function ( $value, array $allow, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allow, true ) ? $value : $fallback;
};

// --- Resolve and validate attributes ---------------------------------

$sticky        = ! empty( $attributes['sticky'] );
$showAfterPx   = $clampInt( $attributes['showAfterPx'] ?? 0, 0, 800, 0 );
$scrollOffset  = $clampInt( $attributes['scrollOffset'] ?? 72, 0, 200, 72 );
$barBorderW    = $clampInt( $attributes['barBorderWidth'] ?? 1, 0, 8, 1 );
$fontSize      = $clampInt( $attributes['fontSize'] ?? 14, 12, 24, 14 );
$linkPadX      = $clampInt( $attributes['linkPaddingX'] ?? 16, 8, 48, 16 );
$linkPadY      = $clampInt( $attributes['linkPaddingY'] ?? 10, 4, 24, 10 );
$barPadX       = $clampInt( $attributes['barPaddingX'] ?? 16, 0, 64, 16 );
$zIndex        = $clampInt( $attributes['zIndex'] ?? 100, 0, 99999, 100 );

$fontWeight    = $pickFromList( (string) ( $attributes['fontWeight'] ?? '500' ), array( '400', '500', '600', '700' ), '500' );
$indicator     = $pickFromList( $attributes['indicatorStyle'] ?? 'underline', array( 'underline', 'pill', 'none' ), 'underline' );
$alignment     = $pickFromList( $attributes['alignment'] ?? 'left', array( 'left', 'center', 'right' ), 'left' );

$activeColor   = $sanitizeColor( $attributes['activeColor'] ?? '', '#2563eb' );
$activeBgColor = $sanitizeColor( $attributes['activeBgColor'] ?? '' );
$linkColor     = $sanitizeColor( $attributes['linkColor'] ?? '', '#374151' );
$linkHover     = $sanitizeColor( $attributes['linkHoverColor'] ?? '', '#111827' );
$barBg         = $sanitizeColor( $attributes['barBg'] ?? '', '#ffffff' );
$barBorderC    = $sanitizeColor( $attributes['barBorderColor'] ?? '', '#e5e7eb' );

$barLabel = isset( $attributes['barLabel'] ) ? sanitize_text_field( (string) $attributes['barLabel'] ) : '';
if ( '' === $barLabel ) {
	$barLabel = __( 'Page sections', 'b-blocks' );
}

// Normalize links: { label, anchor }. Anchor sanitized so it is safe in
// href="#..." and as the IntersectionObserver target lookup key.
$rawLinks = isset( $attributes['links'] ) && is_array( $attributes['links'] ) ? $attributes['links'] : array();
$links    = array();
foreach ( $rawLinks as $link ) {
	if ( ! is_array( $link ) ) {
		continue;
	}
	$label  = isset( $link['label'] ) ? sanitize_text_field( (string) $link['label'] ) : '';
	$anchor = isset( $link['anchor'] ) ? sanitize_html_class( (string) $link['anchor'] ) : '';
	if ( '' === $label || '' === $anchor ) {
		continue;
	}
	$links[] = array(
		'label'  => $label,
		'anchor' => $anchor,
	);
	if ( count( $links ) >= 12 ) {
		break;
	}
}

if ( empty( $links ) ) {
	return;
}

// --- Build per-instance CSS ------------------------------------------

$sel    = '#' . $id;
$justify = 'left' === $alignment ? 'flex-start' : ( 'right' === $alignment ? 'flex-end' : 'center' );
$css    = '';

$css .= "$sel{background:$barBg;z-index:$zIndex;}";
if ( $sticky ) {
	$css .= "$sel{position:sticky;top:0;}";
}
if ( $barBorderW > 0 ) {
	$css .= "$sel{border-bottom:{$barBorderW}px solid $barBorderC;}";
}

$css .= "$sel .bb-an-list{display:flex;flex-wrap:nowrap;align-items:stretch;justify-content:$justify;gap:2px;margin:0;padding:0 {$barPadX}px;list-style:none;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}";
$css .= "$sel .bb-an-list::-webkit-scrollbar{display:none;}";
$css .= "$sel .bb-an-item{flex:0 0 auto;}";

$css .= "$sel .bb-an-link{position:relative;display:inline-flex;align-items:center;white-space:nowrap;text-decoration:none;font-size:{$fontSize}px;font-weight:{$fontWeight};line-height:1.2;color:$linkColor;padding:{$linkPadY}px {$linkPadX}px;border-radius:6px;border-bottom:2px solid transparent;transition:color .15s ease,background-color .15s ease;}";
$css .= "$sel .bb-an-link:hover{color:$linkHover;}";

// Active state by indicator style.
if ( 'underline' === $indicator ) {
	$css .= "$sel .bb-an-link.is-active{color:$activeColor;border-bottom-color:$activeColor;border-radius:0;}";
} elseif ( 'pill' === $indicator ) {
	$pillBg = '' !== $activeBgColor ? $activeBgColor : 'rgba(37,99,235,0.12)';
	$css   .= "$sel .bb-an-link.is-active{color:$activeColor;background:$pillBg;}";
} else {
	$css .= "$sel .bb-an-link.is-active{color:$activeColor;}";
}

$css .= "$sel .bb-an-link:focus-visible{outline:2px solid $activeColor;outline-offset:2px;border-radius:4px;}";

// Show-after-scroll reveal (only meaningful when sticky).
if ( $sticky && $showAfterPx > 0 ) {
	$css .= "{$sel}.bb-an-revealable{opacity:0;visibility:hidden;transition:opacity .15s ease,visibility .15s ease;}";
	$css .= "{$sel}.bb-an-revealable.is-visible{opacity:1;visibility:visible;}";
}

$css .= "@media (prefers-reduced-motion:reduce){{$sel} .bb-an-link{transition:none;}{$sel}.bb-an-revealable{transition:none;}}";

// --- Wrapper -----------------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-an' );
if ( $sticky && $showAfterPx > 0 ) {
	$wrapperClasses .= ' bb-an-revealable';
}

$config = wp_json_encode(
	array(
		'scrollOffset' => $scrollOffset,
		'showAfterPx'  => ( $sticky ? $showAfterPx : 0 ),
		'anchors'      => wp_list_pluck( $links, 'anchor' ),
	)
);
?>
<nav
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClasses ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is already escaped by core ?>
	id="<?php echo esc_attr( $id ); ?>"
	aria-label="<?php echo esc_attr( $barLabel ); ?>"
	data-bb-an-config="<?php echo esc_attr( $config ); ?>"
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS string, HTML stripped ?></style>

	<ul class="bb-an-list">
		<?php foreach ( $links as $index => $link ) : ?>
			<li class="bb-an-item">
				<a
					class="bb-an-link<?php echo 0 === $index ? ' is-active' : ''; ?>"
					href="#<?php echo esc_attr( $link['anchor'] ); ?>"
					data-anchor="<?php echo esc_attr( $link['anchor'] ); ?>"
					<?php echo 0 === $index ? 'aria-current="location"' : ''; ?>
				><?php echo esc_html( $link['label'] ); ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
</nav>
