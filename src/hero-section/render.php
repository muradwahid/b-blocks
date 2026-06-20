<?php
/**
 * Hero Section block server-side render.
 *
 * Renders a full-width landing-page hero (eyebrow + headline + sub-headline +
 * dual CTAs) over a configurable background (color / gradient / image / video).
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are inlined
 * as static closures (same pattern as contact-card, portfolio-gallery,
 * business-hours, howto-schema).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksHeroSection';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

$sanitizeColor = static function ( $color, $fallback ) {
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

$minHeight = $pickFromList( $attributes['minHeight'] ?? '60vh', [ '100vh', '90vh', '75vh', '60vh', '50vh', 'auto' ], '60vh' );

$contentAlign = $pickFromList( $attributes['contentAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

$verticalAlign = $pickFromList( $attributes['verticalAlign'] ?? 'middle', [ 'top', 'middle', 'bottom' ], 'middle' );

$contentMaxWidth = $clampInt( $attributes['contentMaxWidth'] ?? 800, 320, 1400, 800 );

$paddingTop         = $clampInt( $attributes['paddingTop'] ?? 96, 0, 320, 96 );
$paddingBottom      = $clampInt( $attributes['paddingBottom'] ?? 96, 0, 320, 96 );
$paddingTopMobile   = $clampInt( $attributes['paddingTopMobile'] ?? 64, 0, 320, 64 );
$paddingBottomMobile = $clampInt( $attributes['paddingBottomMobile'] ?? 64, 0, 320, 64 );

$bgType = $pickFromList( $attributes['bgType'] ?? 'color', [ 'color', 'gradient', 'image', 'video' ], 'color' );

$bgColor = $sanitizeColor( $attributes['bgColor'] ?? '', '#1a1a2e' );

$bgGradientFrom = $sanitizeColor( $attributes['bgGradientFrom'] ?? '', '#1a1a2e' );
$bgGradientTo   = $sanitizeColor( $attributes['bgGradientTo'] ?? '', '#16213e' );
$bgGradientAngle = $clampInt( $attributes['bgGradientAngle'] ?? 135, 0, 360, 135 );

$bgImageId  = isset( $attributes['bgImageId'] ) ? absint( $attributes['bgImageId'] ) : 0;
$bgImageUrl = isset( $attributes['bgImageUrl'] ) ? esc_url_raw( (string) $attributes['bgImageUrl'] ) : '';
$bgImageAlt = isset( $attributes['bgImageAlt'] ) ? sanitize_text_field( (string) $attributes['bgImageAlt'] ) : '';

// Resolve image URL from the attachment ID if needed.
if ( 'image' === $bgType && $bgImageId > 0 && '' === $bgImageUrl ) {
	$resolved = wp_get_attachment_image_url( $bgImageId, 'full' );
	if ( $resolved ) {
		$bgImageUrl = $resolved;
	}
}

$bgImagePosition = $pickFromList( $attributes['bgImagePosition'] ?? 'center center', [ 'center center', 'top center', 'bottom center', 'center left', 'center right', 'top left', 'top right', 'bottom left', 'bottom right' ], 'center center' );

$bgImageSize = $pickFromList( $attributes['bgImageSize'] ?? 'cover', [ 'cover', 'contain', 'auto' ], 'cover' );

$bgVideoId  = isset( $attributes['bgVideoId'] ) ? absint( $attributes['bgVideoId'] ) : 0;
$bgVideoUrl = isset( $attributes['bgVideoUrl'] ) ? esc_url_raw( (string) $attributes['bgVideoUrl'] ) : '';

if ( 'video' === $bgType && $bgVideoId > 0 && '' === $bgVideoUrl ) {
	$resolvedVideo = wp_get_attachment_url( $bgVideoId );
	if ( $resolvedVideo ) {
		$bgVideoUrl = $resolvedVideo;
	}
}

$bgVideoPosterId  = isset( $attributes['bgVideoPosterId'] ) ? absint( $attributes['bgVideoPosterId'] ) : 0;
$bgVideoPosterUrl = isset( $attributes['bgVideoPosterUrl'] ) ? esc_url_raw( (string) $attributes['bgVideoPosterUrl'] ) : '';

if ( 'video' === $bgType && $bgVideoPosterId > 0 && '' === $bgVideoPosterUrl ) {
	$resolvedPoster = wp_get_attachment_image_url( $bgVideoPosterId, 'full' );
	if ( $resolvedPoster ) {
		$bgVideoPosterUrl = $resolvedPoster;
	}
}

$overlayColor   = $sanitizeColor( $attributes['overlayColor'] ?? '', '#000000' );
$overlayOpacity = $clampInt( $attributes['overlayOpacity'] ?? 40, 0, 100, 40 );

// --- Eyebrow ---------------------------------------------------------
$showEyebrow         = ! empty( $attributes['showEyebrow'] );
$eyebrowText         = isset( $attributes['eyebrowText'] ) ? wp_kses_post( (string) $attributes['eyebrowText'] ) : '';
$eyebrowColor        = $sanitizeColor( $attributes['eyebrowColor'] ?? '', '#ffffff' );
$eyebrowBgColor      = $sanitizeColor( $attributes['eyebrowBgColor'] ?? '', 'rgba(255,255,255,0.14)' );
$eyebrowFontSize     = $clampInt( $attributes['eyebrowFontSize'] ?? 13, 10, 32, 13 );
$eyebrowFontWeight   = $pickFromList( $attributes['eyebrowFontWeight'] ?? '600', [ '400', '500', '600', '700', '800' ], '600' );
$eyebrowLetterSpacing = $clampInt( $attributes['eyebrowLetterSpacing'] ?? 2, 0, 10, 2 );

// --- Headline --------------------------------------------------------
$headingTag = $pickFromList( $attributes['headingTag'] ?? 'h1', [ 'h1', 'h2', 'h3' ], 'h1' );
$headingText = isset( $attributes['headingText'] ) ? wp_kses_post( (string) $attributes['headingText'] ) : '';

$headingFontSize        = $clampInt( $attributes['headingFontSize'] ?? 56, 20, 96, 56 );
$headingFontSizeTablet  = $clampInt( $attributes['headingFontSizeTablet'] ?? 40, 20, 96, 40 );
$headingFontSizeMobile  = $clampInt( $attributes['headingFontSizeMobile'] ?? 28, 16, 80, 28 );
$headingFontWeight      = $pickFromList( $attributes['headingFontWeight'] ?? '700', [ '400', '500', '600', '700', '800', '900' ], '700' );
$headingColor           = $sanitizeColor( $attributes['headingColor'] ?? '', '#ffffff' );
$headingLineHeight      = $clampInt( $attributes['headingLineHeight'] ?? 120, 80, 200, 120 );

// --- Sub-headline ----------------------------------------------------
$showSubHeading           = ! empty( $attributes['showSubHeading'] );
$subHeadingText           = isset( $attributes['subHeadingText'] ) ? wp_kses_post( (string) $attributes['subHeadingText'] ) : '';
$subHeadingFontSize       = $clampInt( $attributes['subHeadingFontSize'] ?? 18, 12, 36, 18 );
$subHeadingFontSizeMobile = $clampInt( $attributes['subHeadingFontSizeMobile'] ?? 15, 10, 30, 15 );
$subHeadingColor          = $sanitizeColor( $attributes['subHeadingColor'] ?? '', 'rgba(255,255,255,0.85)' );
$subHeadingMaxWidth       = $clampInt( $attributes['subHeadingMaxWidth'] ?? 600, 200, 1200, 600 );

// --- Primary button --------------------------------------------------
$showPrimaryBtn          = ! empty( $attributes['showPrimaryBtn'] );
$primaryBtnText          = isset( $attributes['primaryBtnText'] ) ? sanitize_text_field( (string) $attributes['primaryBtnText'] ) : '';
$primaryBtnUrl           = isset( $attributes['primaryBtnUrl'] ) ? esc_url_raw( (string) $attributes['primaryBtnUrl'] ) : '';
$primaryBtnNewTab        = ! empty( $attributes['primaryBtnNewTab'] );
$primaryBtnBgColor       = $sanitizeColor( $attributes['primaryBtnBgColor'] ?? '', '#ffffff' );
$primaryBtnTextColor     = $sanitizeColor( $attributes['primaryBtnTextColor'] ?? '', '#1a1a2e' );
$primaryBtnHoverBgColor  = $sanitizeColor( $attributes['primaryBtnHoverBgColor'] ?? '', '#e6e6f0' );
$primaryBtnHoverTextColor = $sanitizeColor( $attributes['primaryBtnHoverTextColor'] ?? '', '#1a1a2e' );
$primaryBtnBorderRadius  = $clampInt( $attributes['primaryBtnBorderRadius'] ?? 6, 0, 50, 6 );
$primaryBtnPaddingV      = $clampInt( $attributes['primaryBtnPaddingV'] ?? 14, 4, 40, 14 );
$primaryBtnPaddingH      = $clampInt( $attributes['primaryBtnPaddingH'] ?? 28, 8, 80, 28 );
$primaryBtnFontSize      = $clampInt( $attributes['primaryBtnFontSize'] ?? 16, 12, 28, 16 );
$primaryBtnFontWeight    = $pickFromList( $attributes['primaryBtnFontWeight'] ?? '600', [ '400', '500', '600', '700' ], '600' );

// --- Secondary button -----------------------------------------------
$showSecondaryBtn          = ! empty( $attributes['showSecondaryBtn'] );
$secondaryBtnText          = isset( $attributes['secondaryBtnText'] ) ? sanitize_text_field( (string) $attributes['secondaryBtnText'] ) : '';
$secondaryBtnUrl           = isset( $attributes['secondaryBtnUrl'] ) ? esc_url_raw( (string) $attributes['secondaryBtnUrl'] ) : '';
$secondaryBtnNewTab        = ! empty( $attributes['secondaryBtnNewTab'] );
$secondaryBtnVariant       = $pickFromList( $attributes['secondaryBtnVariant'] ?? 'outline', [ 'outline', 'ghost', 'solid' ], 'outline' );
$secondaryBtnColor         = $sanitizeColor( $attributes['secondaryBtnColor'] ?? '', '#ffffff' );
$secondaryBtnTextColor     = $sanitizeColor( $attributes['secondaryBtnTextColor'] ?? '', '#ffffff' );
$secondaryBtnHoverBgColor  = $sanitizeColor( $attributes['secondaryBtnHoverBgColor'] ?? '', 'rgba(255,255,255,0.14)' );
$secondaryBtnHoverTextColor = $sanitizeColor( $attributes['secondaryBtnHoverTextColor'] ?? '', '#ffffff' );
$secondaryBtnBorderRadius  = $clampInt( $attributes['secondaryBtnBorderRadius'] ?? 6, 0, 50, 6 );
$secondaryBtnPaddingV      = $clampInt( $attributes['secondaryBtnPaddingV'] ?? 14, 4, 40, 14 );
$secondaryBtnPaddingH      = $clampInt( $attributes['secondaryBtnPaddingH'] ?? 28, 8, 80, 28 );
$secondaryBtnFontSize      = $clampInt( $attributes['secondaryBtnFontSize'] ?? 16, 12, 28, 16 );
$secondaryBtnFontWeight    = $pickFromList( $attributes['secondaryBtnFontWeight'] ?? '600', [ '400', '500', '600', '700' ], '600' );

$btnGap = $clampInt( $attributes['btnGap'] ?? 16, 4, 64, 16 );

// --- Compute derived values -----------------------------------------

$heroHeadingId = $id . '-heading';

// Build the gradient CSS string.
$gradientCss = sprintf( 'linear-gradient(%ddeg, %s 0%%, %s 100%%)', $bgGradientAngle, $bgGradientFrom, $bgGradientTo );

// Overlay opacity stored as 0..100 → CSS 0..1.
$overlayAlpha = max( 0, min( 1, $overlayOpacity / 100 ) );

// Wrapper class list.
$wrapperClasses = trim(
	$planClass
	. ' bb-hs'
	. ' bb-hs-bg--' . $bgType
	. ' bb-hs-align--' . $contentAlign
	. ' bb-hs-valign--' . $verticalAlign
	. ' bb-hs-minh--' . $minHeight
	. ( 'video' === $bgType && '' !== $bgVideoUrl ? ' has-video-bg' : '' )
);

// Inline CSS — per-instance scoped under the wrapper ID.
$mainSl = '#' . $id;
$css    = '';

// Core wrapper layout.
$css .= "$mainSl{";
$css .= 'position:relative;display:flex;width:100%;overflow:hidden;';
if ( 'auto' === $minHeight ) {
	$css .= 'min-height:auto;';
} else {
	$css .= 'min-height:' . esc_attr( $minHeight ) . ';';
}
$css .= 'padding-top:' . $paddingTop . 'px;padding-bottom:' . $paddingBottom . 'px;';
$css .= '}';

// Background layer.
$css .= "$mainSl .bb-hs-bg{position:absolute;inset:0;z-index:0;pointer-events:none;";
if ( 'color' === $bgType ) {
	$css .= 'background:' . $bgColor . ';';
} elseif ( 'gradient' === $bgType ) {
	$css .= 'background:' . $gradientCss . ';';
} elseif ( 'image' === $bgType && '' !== $bgImageUrl ) {
	$css .= 'background-image:url(' . esc_url( $bgImageUrl ) . ');';
	$css .= 'background-position:' . esc_attr( $bgImagePosition ) . ';';
	$css .= 'background-size:' . esc_attr( $bgImageSize ) . ';';
	$css .= 'background-repeat:no-repeat;';
} elseif ( 'video' === $bgType ) {
	// Behind the video, use the bgColor as a fallback in case the video fails / is still loading.
	$css .= 'background:' . $bgColor . ';';
}
$css .= '}';

// Video element (covers its parent .bb-hs-bg).
$css .= "$mainSl .bb-hs-bg video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}";

// Overlay layer.
if ( $overlayOpacity > 0 && in_array( $bgType, [ 'image', 'gradient', 'video' ], true ) ) {
	$css .= "$mainSl .bb-hs-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;background:" . $overlayColor . ';opacity:' . $overlayAlpha . ';}';
}

// Container (the content column).
$css .= "$mainSl .bb-hs-container{position:relative;z-index:2;width:100%;max-width:" . $contentMaxWidth . 'px;margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px;display:flex;flex-direction:column;gap:20px;text-align:' . $contentAlign . ';';
if ( 'left' === $contentAlign ) {
	$css .= 'align-items:flex-start;';
} elseif ( 'right' === $contentAlign ) {
	$css .= 'align-items:flex-end;';
} else {
	$css .= 'align-items:center;';
}
$css .= '}';

// Vertical alignment of the container inside the section.
if ( 'top' === $verticalAlign ) {
	$css .= "$mainSl{align-items:flex-start;}";
} elseif ( 'bottom' === $verticalAlign ) {
	$css .= "$mainSl{align-items:flex-end;}";
} else {
	$css .= "$mainSl{align-items:center;}";
}

// Eyebrow.
$css .= "$mainSl .bb-hs-eyebrow{display:inline-block;color:" . $eyebrowColor . ';background:' . $eyebrowBgColor . ';font-size:' . $eyebrowFontSize . 'px;font-weight:' . $eyebrowFontWeight . ';letter-spacing:' . $eyebrowLetterSpacing . 'px;text-transform:uppercase;padding:6px 14px;border-radius:999px;line-height:1.4;}';

// Headline.
$css .= "$mainSl .bb-hs-headline{margin:0;color:" . $headingColor . ';font-size:' . $headingFontSize . 'px;font-weight:' . $headingFontWeight . ';line-height:' . ( $headingLineHeight / 100 ) . ';}';

// Sub-headline.
$css .= "$mainSl .bb-hs-subheadline{margin:0;color:" . $subHeadingColor . ';font-size:' . $subHeadingFontSize . 'px;line-height:1.55;max-width:' . $subHeadingMaxWidth . 'px;';
if ( 'center' === $contentAlign ) {
	$css .= 'margin-left:auto;margin-right:auto;';
}
$css .= '}';

// Actions container.
$css .= "$mainSl .bb-hs-actions{display:flex;flex-wrap:wrap;gap:" . $btnGap . 'px;margin-top:8px;';
if ( 'center' === $contentAlign ) {
	$css .= 'justify-content:center;';
} elseif ( 'right' === $contentAlign ) {
	$css .= 'justify-content:flex-end;';
} else {
	$css .= 'justify-content:flex-start;';
}
$css .= '}';

// CTA base.
$css .= "$mainSl .bb-hs-cta{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:none;cursor:pointer;line-height:1.2;transition:background-color .2s ease,color .2s ease,border-color .2s ease,transform .15s ease;}";

// Primary CTA.
$css .= "$mainSl .bb-hs-cta--primary{background:" . $primaryBtnBgColor . ';color:' . $primaryBtnTextColor . ';border-radius:' . $primaryBtnBorderRadius . 'px;padding:' . $primaryBtnPaddingV . 'px ' . $primaryBtnPaddingH . 'px;font-size:' . $primaryBtnFontSize . 'px;font-weight:' . $primaryBtnFontWeight . ';}';
$css .= "$mainSl .bb-hs-cta--primary:hover,$mainSl .bb-hs-cta--primary:focus-visible{background:" . $primaryBtnHoverBgColor . ';color:' . $primaryBtnHoverTextColor . ';}';

// Secondary CTA.
$secCss = '';
if ( 'outline' === $secondaryBtnVariant ) {
	$secCss .= 'background:transparent;border:2px solid ' . $secondaryBtnColor . ';color:' . $secondaryBtnTextColor . ';';
} elseif ( 'ghost' === $secondaryBtnVariant ) {
	$secCss .= 'background:transparent;color:' . $secondaryBtnTextColor . ';';
} else {
	$secCss .= 'background:' . $secondaryBtnColor . ';color:' . $secondaryBtnTextColor . ';';
}
$secCss .= 'border-radius:' . $secondaryBtnBorderRadius . 'px;padding:' . $secondaryBtnPaddingV . 'px ' . $secondaryBtnPaddingH . 'px;font-size:' . $secondaryBtnFontSize . 'px;font-weight:' . $secondaryBtnFontWeight . ';';
$css .= "$mainSl .bb-hs-cta--secondary{" . $secCss . '}';
$css .= "$mainSl .bb-hs-cta--secondary:hover,$mainSl .bb-hs-cta--secondary:focus-visible{background:" . $secondaryBtnHoverBgColor . ';color:' . $secondaryBtnHoverTextColor . ';}';

// Focus ring for accessibility (visible against any background).
$css .= "$mainSl .bb-hs-cta:focus-visible{outline:2px solid #ffffff;outline-offset:3px;}";

// Reduced-motion: pause/hide the video.
$css .= '@media (prefers-reduced-motion: reduce){' . $mainSl . ' .bb-hs-bg video{display:none;}' . $mainSl . ' .bb-hs-cta{transition:none;}}';

// Mobile: pause/hide the video (saves bandwidth, browsers may block autoplay).
$css .= '@media (max-width: 600px){' . $mainSl . ' .bb-hs-bg video{display:none;}}';

// Responsive typography.
$css .= '@media (max-width: 1024px){';
$css .= $mainSl . ' .bb-hs-headline{font-size:' . $headingFontSizeTablet . 'px;}';
$css .= '}';
$css .= '@media (max-width: 600px){';
$css .= $mainSl . '{padding-top:' . $paddingTopMobile . 'px;padding-bottom:' . $paddingBottomMobile . 'px;}';
$css .= $mainSl . ' .bb-hs-headline{font-size:' . $headingFontSizeMobile . 'px;}';
$css .= $mainSl . ' .bb-hs-subheadline{font-size:' . $subHeadingFontSizeMobile . 'px;}';
$css .= $mainSl . ' .bb-hs-container{padding-left:20px;padding-right:20px;}';
$css .= '}';

// --- Link target attributes ------------------------------------------
$primaryTargetAttr = $primaryBtnNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
$secondaryTargetAttr = $secondaryBtnNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
$primaryNewTabSr = $primaryBtnNewTab ? '<span class="screen-reader-text"> ' . esc_html__( '(opens in a new tab)', 'b-blocks' ) . '</span>' : '';
$secondaryNewTabSr = $secondaryBtnNewTab ? '<span class="screen-reader-text"> ' . esc_html__( '(opens in a new tab)', 'b-blocks' ) . '</span>' : '';
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	aria-labelledby='<?php echo esc_attr( $heroHeadingId ); ?>'
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS output, no HTML after wp_strip_all_tags() ?></style>

	<div class='bb-hs-bg' aria-hidden='true'>
		<?php if ( 'video' === $bgType && '' !== $bgVideoUrl ) : ?>
			<video
				autoplay
				muted
				loop
				playsinline
				preload='metadata'
				<?php if ( '' !== $bgVideoPosterUrl ) : ?>
					poster='<?php echo esc_url( $bgVideoPosterUrl ); ?>'
				<?php endif; ?>
			>
				<source src='<?php echo esc_url( $bgVideoUrl ); ?>' type='video/mp4' />
			</video>
		<?php endif; ?>
	</div>

	<?php if ( $overlayOpacity > 0 && in_array( $bgType, [ 'image', 'gradient', 'video' ], true ) ) : ?>
		<div class='bb-hs-overlay' aria-hidden='true'></div>
	<?php endif; ?>

	<div class='bb-hs-container'>
		<?php if ( $showEyebrow && '' !== trim( wp_strip_all_tags( $eyebrowText ) ) ) : ?>
			<span class='bb-hs-eyebrow'><?php echo wp_kses_post( $eyebrowText ); ?></span>
		<?php endif; ?>

		<?php if ( '' !== trim( wp_strip_all_tags( $headingText ) ) ) : ?>
			<<?php echo esc_attr( $headingTag ); ?>
				id='<?php echo esc_attr( $heroHeadingId ); ?>'
				class='bb-hs-headline'
			><?php echo wp_kses_post( $headingText ); ?></<?php echo esc_attr( $headingTag ); ?>>
		<?php endif; ?>

		<?php if ( $showSubHeading && '' !== trim( wp_strip_all_tags( $subHeadingText ) ) ) : ?>
			<p class='bb-hs-subheadline'><?php echo wp_kses_post( $subHeadingText ); ?></p>
		<?php endif; ?>

		<?php if ( ( $showPrimaryBtn && '' !== $primaryBtnText ) || ( $showSecondaryBtn && '' !== $secondaryBtnText ) ) : ?>
			<div class='bb-hs-actions'>
				<?php if ( $showPrimaryBtn && '' !== $primaryBtnText ) : ?>
					<a
						class='bb-hs-cta bb-hs-cta--primary'
						href='<?php echo esc_url( $primaryBtnUrl ?: '#' ); ?>'
						<?php echo $primaryTargetAttr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute fragment ?>
					><?php echo esc_html( $primaryBtnText ); echo $primaryNewTabSr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup ?></a>
				<?php endif; ?>

				<?php if ( $showSecondaryBtn && '' !== $secondaryBtnText ) : ?>
					<a
						class='bb-hs-cta bb-hs-cta--secondary bb-hs-cta--<?php echo esc_attr( $secondaryBtnVariant ); ?>'
						href='<?php echo esc_url( $secondaryBtnUrl ?: '#' ); ?>'
						<?php echo $secondaryTargetAttr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute fragment ?>
					><?php echo esc_html( $secondaryBtnText ); echo $secondaryNewTabSr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup ?></a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
