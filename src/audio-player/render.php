<?php
/**
 * Audio Player block server-side render.
 *
 * Renders a single-track, custom-styled HTML5 audio player. The markup ships a
 * hidden native <audio> element plus fully custom, accessible controls
 * (play/pause <button>, seek <input type="range">, volume <input type="range">,
 * a timecode <span>, and an optional download link). view.js hydrates the native
 * HTMLMediaElement API and updates time/aria via textContent (never innerHTML).
 *
 * All user-facing control strings are translated here and delivered to view.js
 * through esc_attr'd data-* attributes, so the view script needs no
 * wp_set_script_translations registration.
 *
 * No global helper functions are declared at file scope — Gutenberg may include
 * this file more than once per request, which would cause a "Cannot redeclare
 * function" fatal. All helpers are inlined as static closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksAudioPlayer';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, named, or var()). ---
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
	// var(--token) with an optional comma fallback (hardened allowlist).
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp a numeric attribute. ---
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return (int) $fallback;
	}
	$value = (int) $value;
	if ( $value < $min ) {
		return (int) $min;
	}
	if ( $value > $max ) {
		return (int) $max;
	}
	return $value;
};

// --- Validate that a URL points at an allowed audio source. ---
$validateAudioUrl = static function ( $url, $attachmentId ) {
	$url = esc_url_raw( trim( (string) $url ) );
	if ( '' === $url ) {
		return '';
	}

	// If it maps to a real attachment, trust its mime type.
	$attachmentId = (int) $attachmentId;
	if ( $attachmentId > 0 ) {
		$mime = get_post_mime_type( $attachmentId );
		if ( $mime && 0 === strpos( $mime, 'audio/' ) ) {
			return $url;
		}
	}

	// Otherwise validate by extension against WordPress's allowed audio types.
	$allowed = wp_get_mime_types();
	$path    = wp_parse_url( $url, PHP_URL_PATH );
	$ext     = $path ? strtolower( pathinfo( $path, PATHINFO_EXTENSION ) ) : '';
	if ( '' === $ext ) {
		return '';
	}
	foreach ( $allowed as $exts => $mime ) {
		if ( 0 !== strpos( $mime, 'audio/' ) ) {
			continue;
		}
		if ( in_array( $ext, explode( '|', $exts ), true ) ) {
			return $url;
		}
	}
	return '';
};

// --- Source & metadata ---
$audioId  = isset( $attributes['audioId'] ) ? (int) $attributes['audioId'] : 0;
$audioUrl = $validateAudioUrl( $attributes['audioUrl'] ?? '', $audioId );

$trackTitle = isset( $attributes['trackTitle'] ) ? sanitize_text_field( (string) $attributes['trackTitle'] ) : '';
$artistName = isset( $attributes['artistName'] ) ? sanitize_text_field( (string) $attributes['artistName'] ) : '';

$albumArt    = isset( $attributes['albumArt'] ) && is_array( $attributes['albumArt'] ) ? $attributes['albumArt'] : [];
$albumArtUrl = isset( $albumArt['url'] ) ? esc_url_raw( (string) $albumArt['url'] ) : '';

// --- Layout / behavior ---
$playerStyle = isset( $attributes['playerStyle'] ) ? sanitize_key( (string) $attributes['playerStyle'] ) : 'bar';
$playerStyle = in_array( $playerStyle, [ 'bar', 'card' ], true ) ? $playerStyle : 'bar';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left';

$autoPlay     = isset( $attributes['autoPlay'] ) ? (bool) $attributes['autoPlay'] : false;
$loop         = isset( $attributes['loop'] ) ? (bool) $attributes['loop'] : false;
$showDownload = isset( $attributes['showDownload'] ) ? (bool) $attributes['showDownload'] : false;
$showTimecode = isset( $attributes['showTimecode'] ) ? (bool) $attributes['showTimecode'] : true;
$showVolume   = isset( $attributes['showVolume'] ) ? (bool) $attributes['showVolume'] : true;

// --- Dimensions ---
$borderRadius = $clampInt( $attributes['borderRadius'] ?? 8, 0, 60, 8 );
$paddingV     = $clampInt( $attributes['paddingV'] ?? 16, 0, 80, 16 );
$paddingH     = $clampInt( $attributes['paddingH'] ?? 20, 0, 80, 20 );
$titleSize    = $clampInt( $attributes['titleSize'] ?? 15, 10, 40, 15 );
$artistSize   = $clampInt( $attributes['artistSize'] ?? 13, 8, 32, 13 );
$maxWidth     = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1200, 0 );

// --- Colors ---
$playerBg     = $sanitizeColor( $attributes['playerBg'] ?? '', '#1e1e1e' );
$controlColor = $sanitizeColor( $attributes['controlColor'] ?? '', '#ffffff' );
$accentColor  = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );

$maxWidthCss = $maxWidth > 0 ? ( $maxWidth . 'px' ) : 'none';

// Translatable control strings delivered to view.js via data attributes.
$labelPlay     = __( 'Play', 'b-blocks' );
$labelPause    = __( 'Pause', 'b-blocks' );
$labelSeek     = __( 'Seek', 'b-blocks' );
$labelVolume   = __( 'Volume', 'b-blocks' );
$labelRegion   = __( 'Audio player', 'b-blocks' );
$labelDownload = __( 'Download audio', 'b-blocks' );

$wrapperClasses = trim(
	'bb-ap ' . $planClass
	. ' bb-ap-style-' . $playerStyle
	. ' bb-ap-align-' . $alignment
);

// Per-instance CSS variables.
$css  = "#$id.bb-ap {";
$css .= "--bb-ap-bg: $playerBg;";
$css .= "--bb-ap-control: $controlColor;";
$css .= "--bb-ap-accent: $accentColor;";
$css .= "--bb-ap-radius: {$borderRadius}px;";
$css .= "--bb-ap-pad-y: {$paddingV}px;";
$css .= "--bb-ap-pad-x: {$paddingH}px;";
$css .= "--bb-ap-title-size: {$titleSize}px;";
$css .= "--bb-ap-artist-size: {$artistSize}px;";
$css .= "--bb-ap-max-w: $maxWidthCss;";
$css .= "}";

$hasMeta = ( '' !== $trackTitle ) || ( '' !== $artistName );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( '' === $audioUrl ) : ?>
		<div class='bb-ap-empty'>
			<?php echo esc_html__( 'No audio file selected.', 'b-blocks' ); ?>
		</div>
	<?php else : ?>
		<div
			class='bb-ap-player'
			role='region'
			aria-label='<?php echo esc_attr( $labelRegion ); ?>'
			data-bb-ap-label-play='<?php echo esc_attr( $labelPlay ); ?>'
			data-bb-ap-label-pause='<?php echo esc_attr( $labelPause ); ?>'
		>
			<audio
				class='bb-ap-audio'
				preload='metadata'
				<?php echo $loop ? 'loop' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static literal string, no user data involved. ?>
				<?php echo $autoPlay ? 'autoplay muted' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static literal string, no user data involved. ?>
			>
				<source src='<?php echo esc_url( $audioUrl ); ?>' />
				<?php echo esc_html__( 'Your browser does not support the audio element.', 'b-blocks' ); ?>
			</audio>

			<?php if ( 'card' === $playerStyle ) : ?>
				<div class='bb-ap-art'>
					<?php if ( '' !== $albumArtUrl ) : ?>
						<img
							class='bb-ap-art-img'
							src='<?php echo esc_url( $albumArtUrl ); ?>'
							alt=''
							loading='lazy'
							decoding='async'
						/>
					<?php else : ?>
						<span class='bb-ap-art-placeholder' aria-hidden='true'>
							<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false'><path d='M9 18V6l10-2v12' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/><circle cx='6' cy='18' r='3' stroke='currentColor' stroke-width='1.6'/><circle cx='16' cy='16' r='3' stroke='currentColor' stroke-width='1.6'/></svg>
						</span>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<div class='bb-ap-body'>
				<?php if ( $hasMeta ) : ?>
					<div class='bb-ap-meta'>
						<?php if ( '' !== $trackTitle ) : ?>
							<p class='bb-ap-title'><?php echo esc_html( $trackTitle ); ?></p>
						<?php endif; ?>
						<?php if ( '' !== $artistName ) : ?>
							<p class='bb-ap-artist'><?php echo esc_html( $artistName ); ?></p>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<div class='bb-ap-controls'>
					<button
						type='button'
						class='bb-ap-playpause'
						aria-label='<?php echo esc_attr( $labelPlay ); ?>'
						aria-pressed='false'
					>
						<span class='bb-ap-icon bb-ap-icon-play' aria-hidden='true'>
							<svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'><path d='M8 5v14l11-7z'/></svg>
						</span>
						<span class='bb-ap-icon bb-ap-icon-pause' aria-hidden='true' hidden>
							<svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'><path d='M6 5h4v14H6zM14 5h4v14h-4z'/></svg>
						</span>
						<span class='bb-ap-spinner' aria-hidden='true' hidden></span>
					</button>

					<div class='bb-ap-seek-wrap'>
						<input
							type='range'
							class='bb-ap-seek'
							min='0'
							max='100'
							value='0'
							step='0.1'
							aria-label='<?php echo esc_attr( $labelSeek ); ?>'
							aria-valuemin='0'
							aria-valuemax='0'
							aria-valuenow='0'
							style='--progress:0%;'
						/>
					</div>

					<?php if ( $showTimecode ) : ?>
						<span class='bb-ap-time' aria-hidden='true'>
							<span class='bb-ap-current'>0:00</span><span class='bb-ap-sep'> / </span><span class='bb-ap-duration'>0:00</span>
						</span>
					<?php endif; ?>

					<?php if ( $showVolume ) : ?>
						<input
							type='range'
							class='bb-ap-volume'
							min='0'
							max='1'
							step='0.01'
							value='1'
							aria-label='<?php echo esc_attr( $labelVolume ); ?>'
							style='--progress:100%;'
						/>
					<?php endif; ?>

					<?php if ( $showDownload ) : ?>
						<a
							class='bb-ap-download'
							href='<?php echo esc_url( $audioUrl ); ?>'
							download
							aria-label='<?php echo esc_attr( $labelDownload ); ?>'
						>
							<svg viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'><path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/></svg>
							<span class='screen-reader-text'><?php echo esc_html( $labelDownload ); ?></span>
						</a>
					<?php endif; ?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>
