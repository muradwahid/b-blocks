<?php
/**
 * Parallax Section block server-side render.
 *
 * Renders a full-width <section> wrapping arbitrary InnerBlocks content over a
 * parallax background image with an optional color/gradient overlay. The
 * scroll-driven parallax is hydrated by view.js (passive + rAF-throttled) and
 * honours prefers-reduced-motion / a mobile disable. Without JS the background
 * still shows statically (the content is never hidden pre-JS).
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would cause
 * a "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as media-text-section / sticky-sidebar).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksParallaxSection';
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
	// var() with a safe-char comma fallback only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

$sanitizeGradient = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	if ( preg_match( '/^(linear|radial|conic|repeating-linear|repeating-radial|repeating-conic)-gradient\([^;{}<>]+\)$/i', $value ) ) {
		return $value;
	}
	return '';
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

$sanitizeLength = static function ( $value, $fallback = '' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^[0-9]+(\.[0-9]+)?(px|vh|vw|rem|em|%)$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Resolve and validate attributes ---------------------------------

$bgImageId  = isset( $attributes['bgImageId'] ) ? absint( $attributes['bgImageId'] ) : 0;
$bgImageUrl = isset( $attributes['bgImageUrl'] ) ? esc_url_raw( (string) $attributes['bgImageUrl'] ) : '';
$bgImageAlt = isset( $attributes['bgImageAlt'] ) ? sanitize_text_field( (string) $attributes['bgImageAlt'] ) : '';

// Resolve from the attachment ID if the URL is missing.
if ( $bgImageId > 0 && '' === $bgImageUrl ) {
	$resolved = wp_get_attachment_url( $bgImageId );
	if ( $resolved ) {
		$bgImageUrl = esc_url_raw( $resolved );
	}
}
// Resolve alt from the media library if blank.
if ( '' === $bgImageAlt && $bgImageId > 0 ) {
	$resolvedAlt = get_post_meta( $bgImageId, '_wp_attachment_image_alt', true );
	if ( is_string( $resolvedAlt ) ) {
		$bgImageAlt = sanitize_text_field( $resolvedAlt );
	}
}

$positionAllow   = array( 'center center', 'center top', 'center bottom', 'left center', 'left top', 'left bottom', 'right center', 'right top', 'right bottom' );
$bgImagePosition = $pickFromList( $attributes['bgImagePosition'] ?? 'center center', $positionAllow, 'center center' );

$parallaxMode  = $pickFromList( $attributes['parallaxMode'] ?? 'scroll', array( 'scroll', 'fixed', 'none' ), 'scroll' );
$parallaxSpeed = $clampInt( $attributes['parallaxSpeed'] ?? 40, 0, 100, 40 );
$disableMobile = ! empty( $attributes['disableOnMobile'] );

$minHeight       = $sanitizeLength( $attributes['minHeight'] ?? '400px', '400px' );
$minHeightTablet = $sanitizeLength( $attributes['minHeightTablet'] ?? '', '' );
$minHeightMobile = $sanitizeLength( $attributes['minHeightMobile'] ?? '', '' );

$verticalAlign  = $pickFromList( $attributes['verticalAlign'] ?? 'center', array( 'top', 'center', 'bottom' ), 'center' );
$contentMaxWidth = $clampInt( $attributes['contentMaxWidth'] ?? 1200, 0, 1920, 1200 );

$padTop        = $clampInt( $attributes['paddingTop'] ?? 80, 0, 300, 80 );
$padBottom     = $clampInt( $attributes['paddingBottom'] ?? 80, 0, 300, 80 );
$padTopMobile  = $clampInt( $attributes['paddingTopMobile'] ?? 48, 0, 200, 48 );
$padBotMobile  = $clampInt( $attributes['paddingBottomMobile'] ?? 48, 0, 200, 48 );

$hasOverlay     = ! empty( $attributes['hasOverlay'] );
$overlayColor   = $sanitizeColor( $attributes['overlayColor'] ?? '#000000', '' );
$overlayOpacity = $clampInt( $attributes['overlayOpacity'] ?? 40, 0, 100, 40 );
$overlayAlpha   = max( 0, min( 1, $overlayOpacity / 100 ) );
$overlayGrad    = $sanitizeGradient( $attributes['overlayGradient'] ?? '' );

$bgColor      = $sanitizeColor( $attributes['bgColor'] ?? '#1a1a2e', '' );
$contentAlign = $pickFromList( $attributes['contentAlign'] ?? 'center', array( 'left', 'center', 'right' ), 'center' );

// --- Build per-instance CSS ------------------------------------------

$sel    = '#' . $id;
$valign = 'top' === $verticalAlign ? 'flex-start' : ( 'bottom' === $verticalAlign ? 'flex-end' : 'center' );
$css    = '';

$css .= $sel . "{position:relative;width:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:{$valign};";
if ( '' !== $bgColor ) {
	$css .= "background-color:$bgColor;";
}
$css .= "min-height:$minHeight;box-sizing:border-box;}";

// Background layer.
$css .= "$sel .bb-px-bg{position:absolute;inset:0;z-index:0;";
if ( '' !== $bgImageUrl ) {
	$css .= 'background-image:url("' . esc_url( $bgImageUrl ) . '");background-size:cover;background-position:' . $bgImagePosition . ';background-repeat:no-repeat;';
}
if ( 'fixed' === $parallaxMode ) {
	$css .= 'background-attachment:fixed;';
}
if ( 'scroll' === $parallaxMode ) {
	$css .= 'top:-5%;height:110%;will-change:transform;transform:translate3d(0,var(--bblocks-parallax-offset,0px),0);';
}
$css .= '}';

// Overlay.
if ( $hasOverlay ) {
	$overlayBg = '' !== $overlayGrad ? $overlayGrad : $overlayColor;
	$css      .= "$sel .bb-px-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;";
	if ( '' !== $overlayBg ) {
		$css .= "background:$overlayBg;";
	}
	$css .= "opacity:$overlayAlpha;}";
}

// Content.
$css .= "$sel .bb-px-content{position:relative;z-index:2;width:100%;margin-left:auto;margin-right:auto;box-sizing:border-box;";
$css .= "text-align:$contentAlign;padding-top:{$padTop}px;padding-bottom:{$padBottom}px;padding-left:24px;padding-right:24px;";
if ( $contentMaxWidth > 0 ) {
	$css .= "max-width:{$contentMaxWidth}px;";
}
$css .= '}';

// Tablet.
if ( '' !== $minHeightTablet ) {
	$css .= '@media (max-width:1024px){' . $sel . '{min-height:' . $minHeightTablet . ';}}';

}

// Mobile.
$css .= '@media (max-width:767px){';
$css .= "$sel .bb-px-content{padding-top:{$padTopMobile}px;padding-bottom:{$padBotMobile}px;}";
if ( '' !== $minHeightMobile ) {
	$css .= $sel . '{min-height:' . $minHeightMobile . ';}';

}
// Mobile disable: fixed mode reverts to scroll attachment for iOS compatibility.
if ( $disableMobile && 'fixed' === $parallaxMode ) {
	$css .= "$sel .bb-px-bg{background-attachment:scroll;}";
}
$css .= '}';

// Reduced motion: neutralize the scroll transform so the background is static.
if ( 'scroll' === $parallaxMode ) {
	$css .= '@media (prefers-reduced-motion: reduce){' . $sel . ' .bb-px-bg{transform:none;top:0;height:100%;}}';
}

// --- Wrapper classes -------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-px' );

$ariaLabel = '' !== $bgImageAlt ? $bgImageAlt : __( 'Content section', 'b-blocks' );
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClasses ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	aria-label="<?php echo esc_attr( $ariaLabel ); ?>"
	data-parallax-mode="<?php echo esc_attr( $parallaxMode ); ?>"
	data-parallax-speed="<?php echo esc_attr( (string) $parallaxSpeed ); ?>"
	data-disable-mobile="<?php echo esc_attr( $disableMobile ? '1' : '0' ); ?>"
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS string, HTML stripped ?></style>

	<div class="bb-px-bg" aria-hidden="true"></div>
	<?php if ( $hasOverlay ) : ?>
		<div class="bb-px-overlay" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="bb-px-content">
		<?php echo wp_kses( $innerBlocks, Utils::allowedInnerHTML() ); ?>
	</div>
</section>
