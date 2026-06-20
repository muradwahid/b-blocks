<?php
/**
 * Google Map block server-side render.
 *
 * Renders a responsive Google Maps iframe from a user-supplied embed URL.
 * The URL is allowlist-validated server-side so an editor cannot inject
 * javascript: URLs, arbitrary iframe sources, or untrusted third-party
 * iframes:
 *
 *   1. Must parse cleanly via wp_parse_url().
 *   2. Scheme must be https.
 *   3. Host must match ^(www\.|maps\.)?google\.(com|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2,3})$
 *   4. Path must start with /maps/embed.
 *
 * If validation fails, no iframe is emitted — a friendly notice is shown
 * instead so the editor knows what to fix.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as video-popup, howto-schema).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksGoogleMap';
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

$sanitizeDim = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|pt)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

$sanitizeRatio = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( preg_match( '/^\d{1,2}\/\d{1,2}$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Validate the embed URL (the most important part of this block) ----
//
// Allowlist-validate the user-provided embed URL against a tight scheme +
// host + path policy so that even if a malicious editor pastes raw HTML
// or a javascript: URL, the iframe src is never trusted blindly.
$validateEmbedUrl = static function ( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return '';
	}

	$parts = wp_parse_url( $url );
	if ( ! is_array( $parts ) ) {
		return '';
	}

	// Scheme must be https.
	$scheme = isset( $parts['scheme'] ) ? strtolower( $parts['scheme'] ) : '';
	if ( 'https' !== $scheme ) {
		return '';
	}

	// Host must match the Google Maps domain allowlist. We allow the
	// common shapes: google.com, www.google.com, maps.google.com, and
	// localized TLDs (google.co.uk, google.com.au, google.de, etc.).
	$host = isset( $parts['host'] ) ? strtolower( $parts['host'] ) : '';
	if ( '' === $host ) {
		return '';
	}
	if ( ! preg_match( '/^(www\.|maps\.)?google\.(com|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2,3})$/', $host ) ) {
		return '';
	}

	// Path must start with /maps/embed (the official Embed a map endpoint).
	$path = isset( $parts['path'] ) ? $parts['path'] : '';
	if ( 0 !== strpos( $path, '/maps/embed' ) ) {
		return '';
	}

	// Rebuild from the trusted, validated parts. We keep only scheme,
	// host, path, and query — never user, pass, fragment, or anything
	// that could change the iframe's loading semantics.
	$rebuilt = 'https://' . $host . $path;
	if ( ! empty( $parts['query'] ) ) {
		$rebuilt .= '?' . $parts['query'];
	}

	return esc_url_raw( $rebuilt );
};

// --- Pull and clamp attributes ----------------------------------------

$embedUrlRaw    = isset( $attributes['embedUrl'] ) ? (string) $attributes['embedUrl'] : '';
$embedUrl       = $validateEmbedUrl( $embedUrlRaw );

$mapHeight       = isset( $attributes['mapHeight'] ) ? (int) $attributes['mapHeight'] : 450;
$mapHeight       = max( 100, min( 1200, $mapHeight ) );
$mapHeightTablet = isset( $attributes['mapHeightTablet'] ) ? (int) $attributes['mapHeightTablet'] : 350;
$mapHeightTablet = max( 100, min( 1200, $mapHeightTablet ) );
$mapHeightMobile = isset( $attributes['mapHeightMobile'] ) ? (int) $attributes['mapHeightMobile'] : 250;
$mapHeightMobile = max( 100, min( 1200, $mapHeightMobile ) );

$useAspectRatio  = isset( $attributes['useAspectRatio'] ) ? (bool) $attributes['useAspectRatio'] : false;
$aspectRatio     = $sanitizeRatio( $attributes['aspectRatio'] ?? '', '16/9' );

$mapAlign        = isset( $attributes['mapAlign'] ) ? sanitize_key( $attributes['mapAlign'] ) : 'center';
$mapAlign        = in_array( $mapAlign, [ 'left', 'center', 'right' ], true ) ? $mapAlign : 'center';

$caption         = isset( $attributes['caption'] ) ? sanitize_text_field( (string) $attributes['caption'] ) : '';
$captionAlign    = isset( $attributes['captionAlign'] ) ? sanitize_key( $attributes['captionAlign'] ) : 'center';
$captionAlign    = in_array( $captionAlign, [ 'left', 'center', 'right' ], true ) ? $captionAlign : 'center';

$borderRadius    = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 0;
$borderRadius    = max( 0, min( 100, $borderRadius ) );

$boxShadow       = isset( $attributes['boxShadow'] ) ? (bool) $attributes['boxShadow'] : false;

$maxWidth        = $sanitizeDim( $attributes['maxWidth'] ?? '', '' );

$captionColor    = $sanitizeColor( $attributes['captionColor'] ?? '', '' );
$captionFontSize = isset( $attributes['captionFontSize'] ) ? (int) $attributes['captionFontSize'] : 14;
$captionFontSize = max( 10, min( 48, $captionFontSize ) );

// --- Build per-instance CSS -------------------------------------------

// Wrapper margin per alignment when a max-width is set. Without a
// max-width, the wrapper spans the parent and the alignment is moot, so
// we still emit text-align fallbacks on the figure for the iframe to
// pick up via display.
$wrapperMargin = 'auto';
if ( 'left' === $mapAlign ) {
	$wrapperMargin = '0 auto 0 0';
} elseif ( 'right' === $mapAlign ) {
	$wrapperMargin = '0 0 0 auto';
}

$css  = "#$id { display: block; }";
$css .= "#$id .bb-gmap-wrapper { position: relative; width: 100%; overflow: hidden; border-radius: {$borderRadius}px; margin: $wrapperMargin; }";

if ( '' !== $maxWidth ) {
	$css .= "#$id .bb-gmap-wrapper { max-width: $maxWidth; }";
}

if ( $boxShadow ) {
	$css .= "#$id .bb-gmap-wrapper { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }";
}

if ( $useAspectRatio ) {
	$css .= "#$id .bb-gmap-wrapper { aspect-ratio: $aspectRatio; height: auto; }";
	$css .= "#$id .bb-gmap-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }";
} else {
	// Mobile-first responsive heights. Default = mobile height; tablet
	// and desktop are progressively wider breakpoints.
	$css .= "#$id .bb-gmap-wrapper { height: {$mapHeightMobile}px; }";
	$css .= "@media (min-width: 768px) { #$id .bb-gmap-wrapper { height: {$mapHeightTablet}px; } }";
	$css .= "@media (min-width: 1024px) { #$id .bb-gmap-wrapper { height: {$mapHeight}px; } }";
	$css .= "#$id .bb-gmap-iframe { width: 100%; height: 100%; border: 0; display: block; }";
}

if ( '' !== $caption ) {
	$css .= "#$id .bb-gmap-caption { text-align: $captionAlign; font-size: {$captionFontSize}px; margin-top: 8px;";
	if ( '' !== $captionColor ) {
		$css .= " color: $captionColor;";
	}
	$css .= " }";
}

// Build a screen-reader-friendly iframe title. If the user gave us a
// caption, prefer that; otherwise fall back to a generic label.
$iframeTitle = '' !== $caption
	/* translators: %s: caption text describing the map location */
	? sprintf( __( 'Google Map of %s', 'b-blocks' ), $caption )
	: __( 'Google Map', 'b-blocks' );

$wrapperClasses = trim( $planClass . ' bb-google-map bb-gmap-align-' . $mapAlign );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, stripped of any HTML tags. ?>
	</style>

	<?php if ( '' !== $embedUrl ) : ?>
		<figure class='bb-gmap-figure'>
			<div class='bb-gmap-wrapper'>
				<iframe
					class='bb-gmap-iframe'
					src='<?php echo esc_url( $embedUrl ); ?>'
					title='<?php echo esc_attr( $iframeTitle ); ?>'
					width='100%'
					loading='lazy'
					referrerpolicy='no-referrer-when-downgrade'
					allowfullscreen=''
				></iframe>
			</div>
			<?php if ( '' !== $caption ) : ?>
				<figcaption class='bb-gmap-caption'><?php echo esc_html( $caption ); ?></figcaption>
			<?php endif; ?>
		</figure>
	<?php else : ?>
		<div class='bb-gmap-placeholder' role='note'>
			<?php echo esc_html__( 'Paste a valid Google Maps embed URL from Google Maps → Share → Embed a map.', 'b-blocks' ); ?>
		</div>
	<?php endif; ?>
</div>
