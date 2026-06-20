<?php
/**
 * Video Popup block server-side render.
 *
 * Emits a poster-image trigger button that the frontend view.js converts
 * into an accessible lightbox containing the chosen video. All user input
 * is sanitized server-side:
 *
 *   - The video URL is parsed to extract the YouTube / Vimeo video id, and
 *     the embed URL is rebuilt from a trusted template (youtube-nocookie.com
 *     for YouTube; player.vimeo.com for Vimeo). Self-hosted MP4 URLs are
 *     run through esc_url().
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as code-highlight, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksVideoPopup';
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

// Extract the 11-char YouTube video ID from common URL patterns.
// Returns null if no valid id is found.
$extractYouTubeId = static function ( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return null;
	}
	$patterns = [
		'#(?:https?://)?(?:www\.)?youtube\.com/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})#i',
		'#(?:https?://)?(?:www\.)?youtu\.be/([A-Za-z0-9_-]{11})#i',
		'#(?:https?://)?(?:www\.)?youtube\.com/embed/([A-Za-z0-9_-]{11})#i',
		'#(?:https?://)?(?:www\.)?youtube\.com/shorts/([A-Za-z0-9_-]{11})#i',
		'#(?:https?://)?(?:www\.)?youtube-nocookie\.com/embed/([A-Za-z0-9_-]{11})#i',
	];
	foreach ( $patterns as $pattern ) {
		if ( preg_match( $pattern, $url, $m ) ) {
			return $m[1];
		}
	}
	return null;
};

// Extract the numeric Vimeo video ID. Returns null if not found.
$extractVimeoId = static function ( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return null;
	}
	$patterns = [
		'#(?:https?://)?(?:www\.)?vimeo\.com/(?:channels/[A-Za-z0-9_-]+/|groups/[A-Za-z0-9_-]+/videos/|album/\d+/video/)?(\d+)#i',
		'#(?:https?://)?player\.vimeo\.com/video/(\d+)#i',
	];
	foreach ( $patterns as $pattern ) {
		if ( preg_match( $pattern, $url, $m ) ) {
			return $m[1];
		}
	}
	return null;
};

// --- Pull and clamp attributes ----------------------------------------

$triggerType    = isset( $attributes['triggerType'] ) ? sanitize_key( $attributes['triggerType'] ) : 'first-frame';
$triggerType    = in_array( $triggerType, [ 'first-frame', 'button-only' ], true ) ? $triggerType : 'first-frame';

$posterId       = isset( $attributes['posterId'] ) ? (int) $attributes['posterId'] : 0;
$posterUrl      = isset( $attributes['posterUrl'] ) ? esc_url_raw( (string) $attributes['posterUrl'] ) : '';
$posterAlt      = isset( $attributes['posterAlt'] ) ? sanitize_text_field( (string) $attributes['posterAlt'] ) : '';

$videoSource    = isset( $attributes['videoSource'] ) ? sanitize_key( $attributes['videoSource'] ) : 'youtube';
$videoSource    = in_array( $videoSource, [ 'youtube', 'vimeo', 'self' ], true ) ? $videoSource : 'youtube';

$videoUrlRaw    = isset( $attributes['videoUrl'] ) ? trim( (string) $attributes['videoUrl'] ) : '';
$videoTitle     = isset( $attributes['videoTitle'] ) ? sanitize_text_field( (string) $attributes['videoTitle'] ) : '';

$videoRatio     = $sanitizeRatio( $attributes['videoRatio'] ?? '', '16/9' );
$maxWidth       = $sanitizeDim( $attributes['maxWidth'] ?? '', '900px' );

$autoplay       = isset( $attributes['autoplay'] ) ? (bool) $attributes['autoplay'] : true;

$playIcon       = isset( $attributes['playIcon'] ) && is_array( $attributes['playIcon'] ) ? $attributes['playIcon'] : [];
$playIconSize   = isset( $playIcon['size'] ) ? (int) $playIcon['size'] : 72;
$playIconSize   = max( 24, min( 200, $playIconSize ) );
$playIconColor  = $sanitizeColor( $playIcon['color'] ?? '', '#ffffff' );
$playIconBg     = $sanitizeColor( $playIcon['bgColor'] ?? '', 'rgba(0,0,0,0.55)' );
$playIconShape  = isset( $playIcon['bgShape'] ) ? sanitize_key( $playIcon['bgShape'] ) : 'circle';
$playIconShape  = in_array( $playIconShape, [ 'circle', 'rounded', 'none' ], true ) ? $playIconShape : 'circle';

$overlayColor   = $sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.85)' );
$posterRadius   = $sanitizeDim( $attributes['posterRadius'] ?? '', '0px' );
$posterWidth    = $sanitizeDim( $attributes['posterWidth'] ?? '', '100%' );

$alignment      = isset( $attributes['alignment'] ) ? sanitize_key( $attributes['alignment'] ) : 'center';
$alignment      = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$animation      = isset( $attributes['animation'] ) ? sanitize_key( $attributes['animation'] ) : 'zoom';
$animation      = in_array( $animation, [ 'zoom', 'fade', 'none' ], true ) ? $animation : 'zoom';

$animationDuration = isset( $attributes['animationDuration'] ) ? (float) $attributes['animationDuration'] : 0.3;
$animationDuration = max( 0.0, min( 2.0, $animationDuration ) );

// --- Resolve embed URL & data attributes for view.js ------------------

$embedUrl       = '';
$embedKind      = '';   // youtube | vimeo | mp4
$autoPosterUrl  = '';   // Derived poster when user hasn't supplied one.
$autoPosterKind = '';   // image | video — drives trigger markup choice.

if ( 'youtube' === $videoSource ) {
	$ytId = $extractYouTubeId( $videoUrlRaw );
	if ( $ytId ) {
		$autoplayParam = $autoplay ? '1' : '0';
		// youtube-nocookie.com avoids 3rd-party cookies until playback.
		$embedUrl  = sprintf( 'https://www.youtube-nocookie.com/embed/%s?autoplay=%s&rel=0&modestbranding=1', rawurlencode( $ytId ), $autoplayParam );
		$embedKind = 'youtube';
		// hqdefault.jpg is the safest YouTube thumbnail — always exists
		// for any valid id (maxresdefault.jpg 404s on non-HD uploads).
		$autoPosterUrl  = sprintf( 'https://i.ytimg.com/vi/%s/hqdefault.jpg', rawurlencode( $ytId ) );
		$autoPosterKind = 'image';
	}
} elseif ( 'vimeo' === $videoSource ) {
	$vId = $extractVimeoId( $videoUrlRaw );
	if ( $vId ) {
		$autoplayParam = $autoplay ? '1' : '0';
		$embedUrl  = sprintf( 'https://player.vimeo.com/video/%s?autoplay=%s', rawurlencode( $vId ), $autoplayParam );
		$embedKind = 'vimeo';
		// Vimeo has no predictable thumbnail URL — call oEmbed once and
		// cache the result (transient TTL: 1 week) to avoid hammering
		// vimeo.com on every page render.
		$vimeoCacheKey   = 'bb_vp_vimeo_thumb_' . md5( $vId );
		$vimeoCachedThumb = get_transient( $vimeoCacheKey );
		if ( false === $vimeoCachedThumb ) {
			$vimeoCachedThumb = '';
			$oembedResp = wp_safe_remote_get(
				sprintf( 'https://vimeo.com/api/oembed.json?url=%s', rawurlencode( 'https://vimeo.com/' . $vId ) ),
				[ 'timeout' => 4 ]
			);
			if ( ! is_wp_error( $oembedResp ) && 200 === wp_remote_retrieve_response_code( $oembedResp ) ) {
				$body = json_decode( wp_remote_retrieve_body( $oembedResp ), true );
				if ( is_array( $body ) && ! empty( $body['thumbnail_url'] ) ) {
					$vimeoCachedThumb = esc_url_raw( (string) $body['thumbnail_url'] );
				}
			}
			set_transient( $vimeoCacheKey, $vimeoCachedThumb, WEEK_IN_SECONDS );
		}
		if ( '' !== $vimeoCachedThumb ) {
			$autoPosterUrl  = $vimeoCachedThumb;
			$autoPosterKind = 'image';
		}
	}
} elseif ( 'self' === $videoSource ) {
	$mp4 = esc_url_raw( $videoUrlRaw );
	if ( $mp4 ) {
		$embedUrl  = $mp4;
		$embedKind = 'mp4';
		// For self-hosted video, the natural "first frame" preview is
		// produced by a <video> element with preload="metadata".
		$autoPosterUrl  = $mp4;
		$autoPosterKind = 'video';
	}
}

// --- Build per-instance CSS -------------------------------------------

$iconRadius     = ( 'circle' === $playIconShape ) ? '50%' : ( ( 'rounded' === $playIconShape ) ? '12px' : '0' );
$iconBg         = ( 'none' === $playIconShape ) ? 'transparent' : $playIconBg;

$css  = "#$id { text-align: $alignment; }";

// Play-icon appearance (size, color, background, radius) — applies in
// BOTH trigger modes. Positioning is handled per-mode below.
$css .= "#$id .bb-vp-trigger .bb-vp-play { width: {$playIconSize}px; height: {$playIconSize}px; display: inline-flex; align-items: center; justify-content: center; background-color: $iconBg; color: $playIconColor; border-radius: $iconRadius; transition: transform 0.2s ease, background-color 0.2s ease; pointer-events: none; }";
$css .= "#$id .bb-vp-trigger .bb-vp-play svg { width: 45%; height: 45%; display: block; }";

if ( 'button-only' === $triggerType ) {
	// Standalone button — sized to just the play icon, no poster tile.
	// border-radius matches the play icon's shape so the browser focus
	// ring follows the visible button outline (e.g. a circle around a
	// circle, not a square around a circle).
	$css .= "#$id .bb-vp-trigger { display: inline-flex; padding: 0; margin: 0; background: transparent; border: 0; cursor: pointer; border-radius: $iconRadius; }";
	$css .= "#$id .bb-vp-trigger:hover .bb-vp-play, #$id .bb-vp-trigger:focus-visible .bb-vp-play { transform: scale(1.08); }";
} else {
	// First-frame mode — full poster tile with the play icon centered on top.
	$css .= "#$id .bb-vp-trigger { display: inline-block; max-width: 100%; width: $posterWidth; padding: 0; margin: 0; background: transparent; border: 0; cursor: pointer; position: relative; overflow: hidden; border-radius: $posterRadius; }";
	$css .= "#$id .bb-vp-trigger--no-poster { aspect-ratio: $videoRatio; }";
	$css .= "#$id .bb-vp-trigger img, #$id .bb-vp-trigger video { display: block; width: 100%; height: auto; border-radius: inherit; }";
	$css .= "#$id .bb-vp-trigger .bb-vp-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }";
	$css .= "#$id .bb-vp-trigger:hover .bb-vp-play, #$id .bb-vp-trigger:focus-visible .bb-vp-play { transform: translate(-50%, -50%) scale(1.08); }";
}

$css .= "#$id .bb-vp-placeholder { display: inline-flex; align-items: center; justify-content: center; width: $posterWidth; max-width: 100%; aspect-ratio: $videoRatio; background: #e8e8e8; color: #444; border-radius: $posterRadius; font-size: 14px; padding: 16px; }";

// Lightbox styles — the lightbox root is appended to <body>, so target it via its id.
$css .= "#{$id}-lightbox { --bb-vp-overlay: $overlayColor; --bb-vp-anim-dur: {$animationDuration}s; }";
$css .= "#{$id}-lightbox .bb-vp-container { max-width: min($maxWidth, calc(100vw - 32px)); aspect-ratio: $videoRatio; }";

// Sanitize data attributes that we expose to view.js.
$dataConfig = [
	'lightboxId'        => $id . '-lightbox',
	'embedKind'         => $embedKind,
	'embedUrl'          => $embedUrl,
	'autoplay'          => $autoplay,
	'animation'         => $animation,
	'animationDuration' => $animationDuration,
	'videoTitle'        => $videoTitle,
];

$wrapperClasses = trim( $planClass . ' bb-video-popup bb-vp-align-' . $alignment );

// Build the poster preview element. Three paths, in order of preference:
//   1. User uploaded an image via the media library  → <img srcset>
//   2. User pasted a poster URL directly             → <img>
//   3. Auto-derived from the video source            → <img> (YT/Vimeo) or
//                                                      <video preload=metadata> (MP4)
//
// When triggerType is 'button-only', skip all of this — the trigger
// renders as a standalone play button with no poster underneath.
$posterMarkup = '';
if ( 'button-only' === $triggerType ) {
	$posterId       = 0;
	$posterUrl      = '';
	$autoPosterUrl  = '';
	$autoPosterKind = '';
}
if ( $posterId > 0 ) {
	$posterMarkup = wp_get_attachment_image(
		$posterId,
		'large',
		false,
		[
			'class'    => 'bb-vp-poster',
			'alt'      => $posterAlt, // wp_get_attachment_image will respect this.
			'loading'  => 'lazy',
			'decoding' => 'async',
		]
	);
}
if ( '' === $posterMarkup && '' !== $posterUrl ) {
	$posterMarkup = sprintf(
		'<img class="bb-vp-poster" src="%1$s" alt="%2$s" loading="lazy" decoding="async" />',
		esc_url( $posterUrl ),
		esc_attr( $posterAlt )
	);
}
if ( '' === $posterMarkup && '' !== $autoPosterUrl ) {
	if ( 'video' === $autoPosterKind ) {
		// Native first-frame preview via <video preload="metadata">. The
		// browser paints the first frame without downloading the whole
		// file. `muted` + `playsinline` make autoplay attempts harmless
		// even on iOS Safari (we don't actually call play() here).
		$posterMarkup = sprintf(
			'<video class="bb-vp-poster bb-vp-poster--video" src="%1$s" preload="metadata" muted playsinline disablepictureinpicture></video>',
			esc_url( $autoPosterUrl )
		);
	} else {
		$posterMarkup = sprintf(
			'<img class="bb-vp-poster" src="%1$s" alt="%2$s" loading="lazy" decoding="async" />',
			esc_url( $autoPosterUrl ),
			esc_attr( $posterAlt )
		);
	}
}

// Build a descriptive aria-label for the trigger button.
$triggerAriaBase = '' !== $videoTitle
	/* translators: %s: video title */
	? sprintf( __( 'Play video: %s', 'b-blocks' ), $videoTitle )
	: __( 'Play video', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-vp-config='<?php echo esc_attr( wp_json_encode( $dataConfig ) ); ?>'
	data-bb-vp-i18n-player='<?php echo esc_attr__( 'Video player', 'b-blocks' ); ?>'
	data-bb-vp-i18n-close='<?php echo esc_attr__( 'Close video', 'b-blocks' ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, stripped of any HTML tags. ?>
	</style>

	<?php
	$triggerClass = 'bb-vp-trigger';
	if ( 'button-only' === $triggerType ) {
		$triggerClass .= ' bb-vp-trigger--button-only';
	} elseif ( '' === $posterMarkup ) {
		$triggerClass .= ' bb-vp-trigger--no-poster';
	}
	?>
	<?php if ( '' !== $embedUrl ) : ?>
		<button
			type='button'
			class='<?php echo esc_attr( $triggerClass ); ?>'
			aria-haspopup='dialog'
			aria-controls='<?php echo esc_attr( $id . '-lightbox' ); ?>'
			aria-label='<?php echo esc_attr( $triggerAriaBase ); ?>'
			data-bb-vp-trigger
		>
			<?php
			if ( '' !== $posterMarkup ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $posterMarkup is built from wp_get_attachment_image() or hand-escaped above.
				echo $posterMarkup;
			}
			?>
			<span class='bb-vp-play' aria-hidden='true'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' focusable='false'>
					<path d='M8 5v14l11-7z' />
				</svg>
			</span>
		</button>
	<?php else : ?>
		<div class='bb-vp-placeholder' role='note'>
			<?php echo esc_html__( 'Paste a YouTube, Vimeo, or MP4 URL in the block sidebar.', 'b-blocks' ); ?>
		</div>
	<?php endif; ?>
</div>
