<?php
/**
 * Sticky Sidebar block server-side render.
 *
 * Renders a two-column CSS Grid wrapper around an InnerBlocks slot. The first
 * top-level inner block is the main content column; the second is the sticky
 * sidebar column (CSS `position: sticky`). DOM source order is always
 * main-first / sidebar-second for screen readers and keyboard users; the
 * visual side of the sidebar is controlled purely by the CSS `order` property.
 * Below the configured mobile breakpoint the grid collapses to a single column.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as media-text-section / hero-section).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksStickySidebar';
$id        = wp_unique_id( "$prefix-" );
$planClass = Utils::isPro() ? 'pro' : 'free';

$innerBlocks = $content;

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
	// Hardened var() fallback allowlist — no {}, \, <, > which could break CSS context.
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

$ratioPercents = static function ( $ratio ) {
	$map = array(
		'25/75' => array( 25, 75 ),
		'30/70' => array( 30, 70 ),
		'35/65' => array( 35, 65 ),
		'40/60' => array( 40, 60 ),
		'50/50' => array( 50, 50 ),
	);
	return isset( $map[ $ratio ] ) ? $map[ $ratio ] : $map['30/70'];
};

// --- Resolve and validate attributes ---------------------------------

$sidebarSide   = $pickFromList( $attributes['sidebarSide'] ?? 'right', array( 'left', 'right' ), 'right' );
$splitRatio    = $pickFromList( $attributes['splitRatio'] ?? '30/70', array( '25/75', '30/70', '35/65', '40/60', '50/50' ), '30/70' );
$mobileStack   = $pickFromList( $attributes['mobileStackOrder'] ?? 'main-first', array( 'main-first', 'sidebar-first' ), 'main-first' );
$align         = $pickFromList( $attributes['align'] ?? 'center', array( 'left', 'center', 'right' ), 'center' );

list( $sidebarPct, $mainPct ) = $ratioPercents( $splitRatio );

$stickyTop  = $clampInt( $attributes['stickyTop'] ?? 32, 0, 200, 32 );
$stickyMaxH = $clampInt( $attributes['stickyMaxHeight'] ?? 0, 0, 1200, 0 );
$gap        = $clampInt( $attributes['gap'] ?? 40, 0, 120, 40 );
$breakpoint = $clampInt( $attributes['mobileBreakpoint'] ?? 767, 480, 1024, 767 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );

$mainPadV = $clampInt( $attributes['mainPaddingV'] ?? 0, 0, 96, 0 );
$mainPadH = $clampInt( $attributes['mainPaddingH'] ?? 0, 0, 96, 0 );
$sidePadV = $clampInt( $attributes['sidebarPaddingV'] ?? 0, 0, 96, 0 );
$sidePadH = $clampInt( $attributes['sidebarPaddingH'] ?? 0, 0, 96, 0 );

$sideRadius  = $clampInt( $attributes['sidebarBorderRadius'] ?? 0, 0, 48, 0 );
$sideBorderW = $clampInt( $attributes['sidebarBorderWidth'] ?? 0, 0, 8, 0 );

$mainBg      = $sanitizeColor( $attributes['mainBg'] ?? '' );
$sidebarBg   = $sanitizeColor( $attributes['sidebarBg'] ?? '' );
$sideBorderC = $sanitizeColor( $attributes['sidebarBorderColor'] ?? '' );

$onRight = 'right' === $sidebarSide;

// grid-template-columns matches visual order (left fraction first).
$leftCol  = $onRight ? $mainPct : $sidebarPct;
$rightCol = $onRight ? $sidebarPct : $mainPct;
// main = first child, sidebar = second child.
$mainOrder    = $onRight ? 1 : 2;
$sidebarOrder = $onRight ? 2 : 1;

// --- Build per-instance CSS ------------------------------------------

$sel        = '#' . $id;
$mainSel    = "$sel .bb-ss-grid > *:nth-child(1)";
$sidebarSel = "$sel .bb-ss-grid > *:nth-child(2)";
$css        = '';

// Outer wrapper max-width + alignment.
if ( $maxWidth > 0 ) {
	$margin = '0 auto';
	if ( 'left' === $align ) {
		$margin = '0 auto 0 0';
	} elseif ( 'right' === $align ) {
		$margin = '0 0 0 auto';
	}
	$css .= "$sel{max-width:{$maxWidth}px;margin:$margin;}";
}

// Grid layout.
$css .= "$sel .bb-ss-grid{display:grid;grid-template-columns:{$leftCol}fr {$rightCol}fr;gap:{$gap}px;align-items:start;width:100%;}";

// Main column (first child).
$css .= "$mainSel{order:$mainOrder;min-width:0;box-sizing:border-box;";
if ( $mainPadV > 0 || $mainPadH > 0 ) {
	$css .= "padding:{$mainPadV}px {$mainPadH}px;";
}
if ( '' !== $mainBg ) {
	$css .= "background:$mainBg;";
}
$css .= '}';

// Sidebar column (second child, sticky).
$css .= "$sidebarSel{order:$sidebarOrder;min-width:0;box-sizing:border-box;position:sticky;top:{$stickyTop}px;align-self:start;";
if ( $sidePadV > 0 || $sidePadH > 0 ) {
	$css .= "padding:{$sidePadV}px {$sidePadH}px;";
}
if ( '' !== $sidebarBg ) {
	$css .= "background:$sidebarBg;";
}
if ( $sideRadius > 0 ) {
	$css .= "border-radius:{$sideRadius}px;";
}
if ( $sideBorderW > 0 && '' !== $sideBorderC ) {
	$css .= "border:{$sideBorderW}px solid $sideBorderC;";
}
if ( $stickyMaxH > 0 ) {
	$css .= "max-height:{$stickyMaxH}px;overflow-y:auto;";
}
$css .= '}';

// Mobile stack.
$mainMobileOrder    = 'sidebar-first' === $mobileStack ? 2 : 1;
$sidebarMobileOrder = 'sidebar-first' === $mobileStack ? 1 : 2;
$css               .= "@media (max-width:{$breakpoint}px){";
$css               .= "$sel .bb-ss-grid{grid-template-columns:1fr;}";
$css               .= "$mainSel{order:$mainMobileOrder;}";
$css               .= "$sidebarSel{order:$sidebarMobileOrder;position:static;top:auto;max-height:none;overflow:visible;}";
$css               .= '}';

// --- Wrapper classes -------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-ss' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'id' => $id, 'class' => $wrapperClasses ) ); ?>
	data-bb-ss-maxheight="<?php echo esc_attr( (string) $stickyMaxH ); ?>"
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS string, HTML stripped ?></style>

	<div class="bb-ss-grid">
		<?php echo wp_kses( $innerBlocks, Utils::allowedInnerHTML() ); ?>
	</div>
</div>
