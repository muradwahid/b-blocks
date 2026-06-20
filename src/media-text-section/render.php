<?php
/**
 * Media & Text Section block server-side render.
 *
 * Renders a full-width <section> with two flex panels: a media panel
 * (image or self-hosted video) beside an InnerBlocks content panel. Supports
 * sticky media, an optional overlay, per-panel backgrounds, split ratio,
 * vertical alignment, and responsive stacking.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as hero-section / contact-card).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksMediaTextSection';
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
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
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
	// Only allow CSS gradient functions; reject anything containing url()/expression etc.
	if ( preg_match( '/^(linear|radial|conic|repeating-linear|repeating-radial|repeating-conic)-gradient\([^;{}]+\)$/i', $value ) ) {
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

$ratioPercents = static function ( $ratio ) {
	$map = array(
		'30-70' => array( 30, 70 ),
		'40-60' => array( 40, 60 ),
		'50-50' => array( 50, 50 ),
		'60-40' => array( 60, 40 ),
		'70-30' => array( 70, 30 ),
	);
	return isset( $map[ $ratio ] ) ? $map[ $ratio ] : $map['50-50'];
};

// --- Resolve and validate attributes ---------------------------------

$mediaPosition = $pickFromList( $attributes['mediaPosition'] ?? 'left', array( 'left', 'right' ), 'left' );
$mediaType     = $pickFromList( $attributes['mediaType'] ?? 'image', array( 'image', 'video' ), 'image' );
$mediaId       = isset( $attributes['mediaId'] ) ? absint( $attributes['mediaId'] ) : 0;
$mediaUrl      = isset( $attributes['mediaUrl'] ) ? esc_url_raw( (string) $attributes['mediaUrl'] ) : '';
$mediaAlt      = isset( $attributes['mediaAlt'] ) ? sanitize_text_field( (string) $attributes['mediaAlt'] ) : '';
$mediaPoster   = isset( $attributes['mediaPosterUrl'] ) ? esc_url_raw( (string) $attributes['mediaPosterUrl'] ) : '';

// Resolve media URL from the attachment ID if missing.
if ( $mediaId > 0 && '' === $mediaUrl ) {
	$resolved = wp_get_attachment_url( $mediaId );
	if ( $resolved ) {
		$mediaUrl = esc_url_raw( $resolved );
	}
}

// Resolve image alt from media library if blank.
if ( 'image' === $mediaType && '' === $mediaAlt && $mediaId > 0 ) {
	$resolvedAlt = get_post_meta( $mediaId, '_wp_attachment_image_alt', true );
	if ( is_string( $resolvedAlt ) ) {
		$mediaAlt = sanitize_text_field( $resolvedAlt );
	}
}

$splitRatio = $pickFromList( $attributes['splitRatio'] ?? '50-50', array( '30-70', '40-60', '50-50', '60-40', '70-30' ), '50-50' );
list( $leftPct, $rightPct ) = $ratioPercents( $splitRatio );

$minHeight     = $clampInt( $attributes['minHeight'] ?? 0, 0, 1200, 0 );
$mediaFit      = $pickFromList( $attributes['mediaFit'] ?? 'cover', array( 'cover', 'contain', 'fill' ), 'cover' );
$verticalAlign = $pickFromList( $attributes['verticalAlign'] ?? 'center', array( 'top', 'center', 'bottom' ), 'center' );
$mobileStack   = $pickFromList( $attributes['mobileStackOrder'] ?? 'media-first', array( 'media-first', 'content-first' ), 'media-first' );

$focal = isset( $attributes['mediaFocal'] ) && is_array( $attributes['mediaFocal'] ) ? $attributes['mediaFocal'] : array();
$fx    = isset( $focal['x'] ) && is_numeric( $focal['x'] ) ? max( 0, min( 1, (float) $focal['x'] ) ) : 0.5;
$fy    = isset( $focal['y'] ) && is_numeric( $focal['y'] ) ? max( 0, min( 1, (float) $focal['y'] ) ) : 0.5;

$stickyMedia    = ! empty( $attributes['stickyMedia'] );
$overlayColor   = $sanitizeColor( $attributes['mediaOverlayColor'] ?? '' );
$overlayOpacity = $clampInt( $attributes['mediaOverlayOpacity'] ?? 0, 0, 100, 0 );
$overlayAlpha   = max( 0, min( 1, $overlayOpacity / 100 ) );

$imageRadius   = $clampInt( $attributes['imageBorderRadius'] ?? 0, 0, 64, 0 );
$imageShadow   = ! empty( $attributes['imageBoxShadow'] );
$mediaPanelBg  = $sanitizeColor( $attributes['mediaPanelBg'] ?? '' );
$contentBg     = $sanitizeColor( $attributes['contentPanelBg'] ?? '' );
$sectionBg     = $sanitizeColor( $attributes['sectionBg'] ?? '' );
$sectionGrad   = $sanitizeGradient( $attributes['sectionBgGradient'] ?? '' );

$padTop    = $clampInt( $attributes['contentPaddingTop'] ?? 40, 0, 200, 40 );
$padBottom = $clampInt( $attributes['contentPaddingBottom'] ?? 40, 0, 200, 40 );
$padLeft   = $clampInt( $attributes['contentPaddingLeft'] ?? 40, 0, 200, 40 );
$padRight  = $clampInt( $attributes['contentPaddingRight'] ?? 40, 0, 200, 40 );

$gap = $clampInt( $attributes['gapBetweenPanels'] ?? 0, 0, 80, 0 );

$sectionLabel = isset( $attributes['sectionLabel'] ) ? sanitize_text_field( (string) $attributes['sectionLabel'] ) : '';

$isReverse = 'right' === $mediaPosition;

// --- Build per-instance CSS ------------------------------------------

$sel    = '#' . $id;
$valign = 'top' === $verticalAlign ? 'flex-start' : ( 'bottom' === $verticalAlign ? 'flex-end' : 'center' );
$css    = '';

$bg = '' !== $sectionGrad ? $sectionGrad : $sectionBg;
if ( '' !== $bg ) {
	$css .= "$sel{background:$bg;}";
}

$css .= "$sel .bb-mts-inner{display:flex;flex-direction:row;align-items:$valign;gap:{$gap}px;width:100%;";
if ( $minHeight > 0 ) {
	$css .= "min-height:{$minHeight}px;";
}
$css .= '}';
$css .= "$sel .bb-mts-inner.is-reverse{flex-direction:row-reverse;}";

$css .= "$sel .bb-mts-media{position:relative;flex:0 0 {$leftPct}%;max-width:{$leftPct}%;align-self:stretch;overflow:hidden;";
if ( '' !== $mediaPanelBg ) {
	$css .= "background:$mediaPanelBg;";
}
$css .= '}';

if ( $stickyMedia ) {
	$css .= "$sel .bb-mts-inner.has-sticky .bb-mts-media{position:sticky;top:0;align-self:flex-start;}";
}

$mediaMinH = $minHeight > 0 ? $minHeight : 280;
$css      .= "$sel .bb-mts-media-el{display:block;width:100%;height:100%;min-height:{$mediaMinH}px;object-fit:$mediaFit;";
if ( 'cover' === $mediaFit ) {
	$css .= 'object-position:' . round( $fx * 100 ) . '% ' . round( $fy * 100 ) . '%;';
}
if ( $imageRadius > 0 ) {
	$css .= "border-radius:{$imageRadius}px;";
}
if ( $imageShadow ) {
	$css .= 'box-shadow:0 18px 40px rgba(0,0,0,0.18);';
}
$css .= '}';

if ( '' !== $overlayColor && $overlayAlpha > 0 ) {
	$css .= "$sel .bb-mts-overlay{position:absolute;inset:0;pointer-events:none;background:$overlayColor;opacity:$overlayAlpha;";
	if ( $imageRadius > 0 ) {
		$css .= "border-radius:{$imageRadius}px;";
	}
	$css .= '}';
}

$css .= "$sel .bb-mts-content{flex:0 0 {$rightPct}%;max-width:{$rightPct}%;box-sizing:border-box;padding:{$padTop}px {$padRight}px {$padBottom}px {$padLeft}px;";
if ( '' !== $contentBg ) {
	$css .= "background:$contentBg;";
}
$css .= '}';

$mobileDir = 'content-first' === $mobileStack ? 'column-reverse' : 'column';
$css      .= '@media (max-width:767px){';
$css      .= "$sel .bb-mts-inner,$sel .bb-mts-inner.is-reverse{flex-direction:$mobileDir;}";
$css      .= "$sel .bb-mts-media,$sel .bb-mts-content{flex:0 0 100%;max-width:100%;}";
$css      .= "$sel .bb-mts-inner.has-sticky .bb-mts-media{position:static;}";
$css      .= '}';

// Reduced motion: stop decorative video, show poster fallback.
$css .= '@media (prefers-reduced-motion: reduce){' . $sel . ' .bb-mts-media-el[data-bb-video]{display:none;}}';

// --- Wrapper classes -------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-mts' );

// --- aria attributes -------------------------------------------------

$ariaAttr = '';
if ( '' !== $sectionLabel ) {
	$ariaAttr = ' aria-label="' . esc_attr( $sectionLabel ) . '"';
}

$innerClasses = 'bb-mts-inner';
if ( $isReverse ) {
	$innerClasses .= ' is-reverse';
}
if ( $stickyMedia ) {
	$innerClasses .= ' has-sticky';
}

$videoFilename = '' !== $mediaUrl ? wp_basename( $mediaUrl ) : '';
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClasses ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	data-bb-mts-label="<?php echo esc_attr( $sectionLabel ); ?>"
	<?php echo $ariaAttr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- assembled from esc_attr() above ?>
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS string, HTML stripped ?></style>

	<div class="<?php echo esc_attr( $innerClasses ); ?>">
		<div class="bb-mts-media">
			<?php if ( '' !== $mediaUrl ) : ?>
				<?php if ( 'video' === $mediaType ) : ?>
					<video
						class="bb-mts-media-el"
						data-bb-video="1"
						autoplay
						muted
						loop
						playsinline
						preload="metadata"
						<?php if ( '' !== $mediaPoster ) : ?>
							poster="<?php echo esc_url( $mediaPoster ); ?>"
						<?php endif; ?>
					>
						<source src="<?php echo esc_url( $mediaUrl ); ?>" type="video/mp4" />
					</video>
					<p class="screen-reader-text">
						<?php
						/* translators: %s: video file name. */
						echo esc_html( sprintf( __( 'Background video: %s', 'b-blocks' ), $videoFilename ) );
						?>
					</p>
				<?php else : ?>
					<img class="bb-mts-media-el" src="<?php echo esc_url( $mediaUrl ); ?>" alt="<?php echo esc_attr( $mediaAlt ); ?>" loading="lazy" decoding="async" />
				<?php endif; ?>
			<?php endif; ?>

			<?php if ( '' !== $overlayColor && $overlayAlpha > 0 ) : ?>
				<span class="bb-mts-overlay" aria-hidden="true"></span>
			<?php endif; ?>
		</div>

		<div class="bb-mts-content">
			<?php echo wp_kses( $innerBlocks, Utils::allowedInnerHTML() ); ?>
		</div>
	</div>
</section>
