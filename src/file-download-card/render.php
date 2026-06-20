<?php
/**
 * File Download Card block server-side render.
 *
 * Renders a styled single-file download card as a semantic `<article>` with a
 * file-type badge, an editable title, an optional description, an auto-detected
 * file-size / file-type meta row, and a native `<a download>` button.
 *
 * When the chosen file is a media-library attachment ( `fileId > 0` ) the URL,
 * MIME type, and file size are resolved server-side from the attachment id
 * rather than trusting the values saved in the editor — so the card stays
 * accurate even if the file is replaced in the media library. External URLs
 * ( `fileId === 0` ) fall back to the stored values.
 *
 * The MIME type is mapped to a short, allowlisted badge label (PDF, ZIP, DOC …)
 * so no raw MIME string is ever echoed.
 *
 * Per-instance styling is delivered via CSS custom properties scoped under a
 * `wp_unique_id()` wrapper id so multiple cards on one page never collide. All
 * helpers are inlined as static closures to avoid the "Cannot redeclare
 * function" fatal Gutenberg can trigger by including this file more than once.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksFileDownloadCard';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named). ---
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
	// Hardened var() allowlist: optional comma-fallback restricted to safe chars only.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
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

// --- Allowlist helper. ---
$pickFrom = static function ( $value, array $allowed, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allowed, true ) ? $value : $fallback;
};

// --- Box-shadow presets. ---
$shadowFor = static function ( $preset ) {
	switch ( $preset ) {
		case 'sm':
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
		case 'md':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'lg':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'none':
		default:
			return 'none';
	}
};

// --- Map a MIME type to a short, safe badge label (allowlist only). ---
$badgeForMime = static function ( $mime, $url ) {
	$mime = is_string( $mime ) ? strtolower( trim( $mime ) ) : '';

	$map = [
		'application/pdf'                                                           => 'PDF',
		'application/zip'                                                           => 'ZIP',
		'application/x-zip-compressed'                                              => 'ZIP',
		'application/x-rar-compressed'                                              => 'RAR',
		'application/x-7z-compressed'                                               => '7Z',
		'application/gzip'                                                          => 'GZ',
		'application/msword'                                                        => 'DOC',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   => 'DOC',
		'application/vnd.ms-excel'                                                  => 'XLS',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         => 'XLS',
		'application/vnd.ms-powerpoint'                                             => 'PPT',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'PPT',
		'application/json'                                                          => 'JSON',
		'application/rtf'                                                           => 'RTF',
		'application/epub+zip'                                                      => 'EPUB',
		'text/plain'                                                                => 'TXT',
		'text/csv'                                                                  => 'CSV',
		'text/html'                                                                 => 'HTML',
		'image/png'                                                                 => 'PNG',
		'image/jpeg'                                                                => 'JPG',
		'image/gif'                                                                 => 'GIF',
		'image/webp'                                                                => 'WEBP',
		'image/svg+xml'                                                             => 'SVG',
		'audio/mpeg'                                                                => 'MP3',
		'audio/wav'                                                                 => 'WAV',
		'audio/ogg'                                                                 => 'OGG',
		'video/mp4'                                                                 => 'MP4',
		'video/quicktime'                                                           => 'MOV',
		'video/webm'                                                                => 'WEBM',
	];

	if ( '' !== $mime && isset( $map[ $mime ] ) ) {
		return $map[ $mime ];
	}

	// Fall back to a sanitized extension drawn from the URL path.
	$path = wp_parse_url( (string) $url, PHP_URL_PATH );
	if ( is_string( $path ) ) {
		$ext = strtoupper( pathinfo( $path, PATHINFO_EXTENSION ) );
		if ( '' !== $ext && preg_match( '/^[A-Z0-9]{1,5}$/', $ext ) ) {
			return $ext;
		}
	}

	return 'FILE';
};

// --- Resolve layout / behavior attributes. ---
$layout       = $pickFrom( $attributes['layout'] ?? 'horizontal', [ 'horizontal', 'vertical' ], 'horizontal' );
$iconStyle    = $pickFrom( $attributes['iconStyle'] ?? 'filled', [ 'filled', 'outline' ], 'filled' );
$alignment    = $pickFrom( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], 'left' );
$shadowPreset = $pickFrom( $attributes['shadow'] ?? 'sm', [ 'none', 'sm', 'md', 'lg' ], 'sm' );

$openNewTab   = ! empty( $attributes['openNewTab'] );
$showFileType = isset( $attributes['showFileType'] ) ? (bool) $attributes['showFileType'] : true;
$showFileSize = isset( $attributes['showFileSize'] ) ? (bool) $attributes['showFileSize'] : true;

// --- Advanced. ---
$addID    = isset( $attributes['addID'] ) ? sanitize_html_class( (string) $attributes['addID'] ) : '';
$addClass = isset( $attributes['addClass'] ) ? sanitize_text_field( (string) $attributes['addClass'] ) : '';
$addCSS   = isset( $attributes['addCSS'] ) ? wp_strip_all_tags( (string) $attributes['addCSS'] ) : '';

// Use the custom id if provided; fall back to the auto-generated one.
if ( '' !== $addID ) {
	$id = $addID;
}

// --- Content. ---
$cardTitle = isset( $attributes['cardTitle'] ) ? sanitize_text_field( (string) $attributes['cardTitle'] ) : '';
$cardDesc  = isset( $attributes['cardDescription'] ) ? sanitize_text_field( (string) $attributes['cardDescription'] ) : '';
$btnLabel  = isset( $attributes['buttonLabel'] ) ? sanitize_text_field( (string) $attributes['buttonLabel'] ) : '';
if ( '' === trim( $btnLabel ) ) {
	$btnLabel = __( 'Download', 'b-blocks' );
}

// --- Resolve the file from the attachment id where possible. ---
$fileId   = $clampInt( $attributes['fileId'] ?? 0, 0, PHP_INT_MAX, 0 );
$fileUrl  = isset( $attributes['fileUrl'] ) ? esc_url_raw( (string) $attributes['fileUrl'] ) : '';
$fileName = isset( $attributes['fileName'] ) ? sanitize_text_field( (string) $attributes['fileName'] ) : '';
$fileMime = isset( $attributes['fileType'] ) ? (string) $attributes['fileType'] : '';
$fileSize = isset( $attributes['fileSize'] ) ? sanitize_text_field( (string) $attributes['fileSize'] ) : '';

if ( $fileId > 0 ) {
	// Trust the attachment id over client-saved values.
	$resolvedUrl = wp_get_attachment_url( $fileId );
	if ( is_string( $resolvedUrl ) && '' !== $resolvedUrl ) {
		$fileUrl = esc_url_raw( $resolvedUrl );
	}

	$resolvedMime = get_post_mime_type( $fileId );
	if ( is_string( $resolvedMime ) && '' !== $resolvedMime ) {
		$fileMime = $resolvedMime;
	}

	if ( '' === trim( $fileName ) ) {
		$attTitle = get_the_title( $fileId );
		if ( is_string( $attTitle ) && '' !== $attTitle ) {
			$fileName = sanitize_text_field( $attTitle );
		}
	}

	// Resolve a real, human-readable size from the file on disk.
	$attPath = get_attached_file( $fileId );
	if ( is_string( $attPath ) && '' !== $attPath && file_exists( $attPath ) ) {
		$bytes = filesize( $attPath );
		if ( false !== $bytes && $bytes > 0 ) {
			$fileSize = size_format( $bytes, 1 );
		}
	}
}

// Nothing usable to download.
if ( '' === $fileUrl ) {
	return;
}

// Badge label is always derived from the (allowlisted) MIME / extension.
$badgeLabel = $badgeForMime( $fileMime, $fileUrl );

// Title fallback: explicit title → file name → generic.
$displayTitle = '' !== trim( $cardTitle ) ? $cardTitle : $fileName;
if ( '' === trim( $displayTitle ) ) {
	$displayTitle = __( 'Download file', 'b-blocks' );
}

// --- Numeric / dimension attributes. ---
$maxWidth     = $clampInt( $attributes['maxWidth'] ?? 480, 0, 1600, 480 );
$borderWidth  = $clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 8, 1 );
$borderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 8, 0, 32, 8 );
$paddingV     = $clampInt( $attributes['paddingV'] ?? 20, 0, 80, 20 );
$paddingH     = $clampInt( $attributes['paddingH'] ?? 24, 0, 80, 24 );
$iconSize     = $clampInt( $attributes['iconSize'] ?? 48, 32, 96, 48 );
$iconRadius   = $clampInt( $attributes['iconRadius'] ?? 8, 0, 48, 8 );
$titleSize    = $clampInt( $attributes['titleSize'] ?? 16, 12, 36, 16 );
$descSize     = $clampInt( $attributes['descSize'] ?? 14, 11, 24, 14 );
$metaSize     = $clampInt( $attributes['metaSize'] ?? 12, 10, 18, 12 );
$btnRadius    = $clampInt( $attributes['btnRadius'] ?? 6, 0, 9999, 6 );
$btnPaddingV  = $clampInt( $attributes['btnPaddingV'] ?? 10, 0, 48, 10 );
$btnPaddingH  = $clampInt( $attributes['btnPaddingH'] ?? 20, 0, 80, 20 );
$btnSize      = $clampInt( $attributes['btnSize'] ?? 14, 11, 20, 14 );

$weights     = [ '400', '500', '600', '700' ];
$titleWeight = $pickFrom( $attributes['titleWeight'] ?? '600', $weights, '600' );
$btnWeight   = $pickFrom( $attributes['btnWeight'] ?? '600', $weights, '600' );

// --- Colors. ---
$cardBg          = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$cardBorderColor = $sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e0e0e0' );
$iconBg          = $sanitizeColor( $attributes['iconBg'] ?? '', '#2563eb' );
$iconColor       = $sanitizeColor( $attributes['iconColor'] ?? '', '#ffffff' );
$titleColor      = $sanitizeColor( $attributes['titleColor'] ?? '', '#111827' );
$descColor       = $sanitizeColor( $attributes['descColor'] ?? '', '#6b7280' );
$metaColor       = $sanitizeColor( $attributes['metaColor'] ?? '', '#9ca3af' );
$btnBg           = $sanitizeColor( $attributes['btnBg'] ?? '', '#2563eb' );
$btnText         = $sanitizeColor( $attributes['btnText'] ?? '', '#ffffff' );
$btnHoverBg      = $sanitizeColor( $attributes['btnHoverBg'] ?? '', '#1d4ed8' );
$btnHoverText    = $sanitizeColor( $attributes['btnHoverText'] ?? '', '#ffffff' );

$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

$hasDesc = '' !== trim( $cardDesc );
$hasMeta = ( $showFileType && '' !== $badgeLabel ) || ( $showFileSize && '' !== trim( $fileSize ) );

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-fdc{";
$css .= "--bb-fdc-max-width:$maxWidthCss;";
$css .= "--bb-fdc-card-bg:$cardBg;";
$css .= "--bb-fdc-border-color:$cardBorderColor;";
$css .= "--bb-fdc-border-width:{$borderWidth}px;";
$css .= "--bb-fdc-radius:{$borderRadius}px;";
$css .= '--bb-fdc-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= "--bb-fdc-pad-v:{$paddingV}px;";
$css .= "--bb-fdc-pad-h:{$paddingH}px;";
$css .= "--bb-fdc-icon-bg:$iconBg;";
$css .= "--bb-fdc-icon-color:$iconColor;";
$css .= "--bb-fdc-icon-size:{$iconSize}px;";
$css .= "--bb-fdc-icon-radius:{$iconRadius}px;";
$css .= "--bb-fdc-title-color:$titleColor;";
$css .= "--bb-fdc-title-size:{$titleSize}px;";
$css .= "--bb-fdc-title-weight:$titleWeight;";
$css .= "--bb-fdc-desc-color:$descColor;";
$css .= "--bb-fdc-desc-size:{$descSize}px;";
$css .= "--bb-fdc-meta-color:$metaColor;";
$css .= "--bb-fdc-meta-size:{$metaSize}px;";
$css .= "--bb-fdc-btn-bg:$btnBg;";
$css .= "--bb-fdc-btn-text:$btnText;";
$css .= "--bb-fdc-btn-hover-bg:$btnHoverBg;";
$css .= "--bb-fdc-btn-hover-text:$btnHoverText;";
$css .= "--bb-fdc-btn-radius:{$btnRadius}px;";
$css .= "--bb-fdc-btn-pad-v:{$btnPaddingV}px;";
$css .= "--bb-fdc-btn-pad-h:{$btnPaddingH}px;";
$css .= "--bb-fdc-btn-size:{$btnSize}px;";
$css .= "--bb-fdc-btn-weight:$btnWeight;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-fdc'
	. ' bb-fdc--' . $layout
	. ' bb-fdc--icon-' . $iconStyle
	. ' bb-fdc--align-' . $alignment
	. ( $borderWidth > 0 ? ' bb-fdc--has-border' : '' )
	. ( '' !== $addClass ? ' ' . $addClass : '' )
);

// Accessible name: includes title + type + size for screen readers.
$ariaParts = [];
/* translators: %s: file or download title. */
$ariaParts[] = sprintf( __( 'Download: %s', 'b-blocks' ), trim( $displayTitle ) );
if ( $showFileType && '' !== $badgeLabel ) {
	$ariaParts[] = $badgeLabel;
}
if ( $showFileSize && '' !== trim( $fileSize ) ) {
	$ariaParts[] = trim( $fileSize );
}
$btnAriaLabel = implode( ', ', $ariaParts );

// Visually-hidden meta string for screen readers ("PDF, 2.4 MB").
$srMetaParts = [];
if ( $showFileType && '' !== $badgeLabel ) {
	$srMetaParts[] = $badgeLabel;
}
if ( $showFileSize && '' !== trim( $fileSize ) ) {
	$srMetaParts[] = trim( $fileSize );
}
$srMeta = implode( ', ', $srMetaParts );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
		<?php if ( '' !== $addCSS ) : ?>
		<?php echo wp_strip_all_tags( $addCSS ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
		<?php endif; ?>
	</style>

	<article class='bb-fdc-card'>
		<span class='bb-fdc-badge' aria-hidden='true'><?php echo esc_html( $badgeLabel ); ?></span>

		<div class='bb-fdc-body'>
			<h3 class='bb-fdc-title'><?php echo esc_html( $displayTitle ); ?></h3>

			<?php if ( $hasDesc ) : ?>
				<p class='bb-fdc-desc'><?php echo esc_html( $cardDesc ); ?></p>
			<?php endif; ?>

			<?php if ( $hasMeta ) : ?>
				<p class='bb-fdc-meta'>
					<?php if ( $showFileType && '' !== $badgeLabel ) : ?>
						<span class='bb-fdc-meta-type' aria-hidden='true'><?php echo esc_html( $badgeLabel ); ?></span>
					<?php endif; ?>
					<?php if ( $showFileType && '' !== $badgeLabel && $showFileSize && '' !== trim( $fileSize ) ) : ?>
						<span class='bb-fdc-meta-sep' aria-hidden='true'>&middot;</span>
					<?php endif; ?>
					<?php if ( $showFileSize && '' !== trim( $fileSize ) ) : ?>
						<span class='bb-fdc-meta-size' aria-hidden='true'><?php echo esc_html( $fileSize ); ?></span>
					<?php endif; ?>
					<?php if ( '' !== $srMeta ) : ?>
						<span class='screen-reader-text'><?php echo esc_html( $srMeta ); ?></span>
					<?php endif; ?>
				</p>
			<?php endif; ?>
		</div>

		<div class='bb-fdc-action'>
			<a
				class='bb-fdc-btn'
				href='<?php echo esc_url( $fileUrl ); ?>'
				download
				aria-label='<?php echo esc_attr( $btnAriaLabel ); ?>'
				<?php if ( $openNewTab ) : ?>target='_blank' rel='noopener noreferrer'<?php else : ?>rel='noopener'<?php endif; ?>
			>
				<svg class='bb-fdc-btn-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
					<path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
				</svg>
				<span class='bb-fdc-btn-label'><?php echo esc_html( $btnLabel ); ?></span>
				<?php if ( $openNewTab ) : ?>
					<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
				<?php endif; ?>
			</a>
		</div>
	</article>
</div>
