<?php
/**
 * PDF Embed block server-side render.
 *
 * Embeds a PDF document inline using a native browser `<iframe>` viewer — no
 * external JavaScript library or third-party service. The PDF is chosen from
 * the WordPress media library; when an attachment id is present ( `pdfId > 0` )
 * the URL is resolved server-side from the attachment and validated to be a
 * real PDF (MIME `application/pdf` via `get_post_mime_type()` with a `.pdf`
 * extension allowlist fallback) before it is ever echoed. A non-PDF, missing,
 * or unusable file empties the embed so nothing untrusted is output.
 *
 * Inside the `<iframe>` is a no-JS / unsupported-browser fallback: a plain
 * download link to the PDF (`esc_url` + `download`). An optional standalone
 * download button renders below the viewer.
 *
 * Per-instance responsive height is delivered via CSS custom properties scoped
 * under a `wp_unique_id()` wrapper id so multiple embeds on one page never
 * collide. All helpers are inlined as static closures to avoid the "Cannot
 * redeclare function" fatal Gutenberg can trigger by including this file more
 * than once.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksPdfEmbed';
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

// --- Validate a CSS length value (px, %, vh, vw, rem, em). ---
$sanitizeLength = static function ( $value, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^\d{1,5}(\.\d{1,3})?(px|%|vh|vw|rem|em)$/', $value ) ) {
		return $value;
	}
	if ( preg_match( '/^\d{1,5}$/', $value ) ) {
		return $value . 'px';
	}
	return $fallback;
};

// --- Box-shadow presets. ---
$shadowFor = static function ( $preset ) {
	switch ( $preset ) {
		case 'small':
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
		case 'medium':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'large':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'none':
		default:
			return 'none';
	}
};

// --- Resolve and VALIDATE the PDF source. ---
$pdfId  = $clampInt( $attributes['pdfId'] ?? 0, 0, PHP_INT_MAX, 0 );
$pdfUrl = isset( $attributes['pdfUrl'] ) ? esc_url_raw( (string) $attributes['pdfUrl'] ) : '';
$isPdf  = false;

if ( $pdfId > 0 ) {
	// Trust the attachment id over client-saved values.
	$resolvedUrl  = wp_get_attachment_url( $pdfId );
	$resolvedMime = get_post_mime_type( $pdfId );

	$mimeOk = is_string( $resolvedMime ) && 'application/pdf' === strtolower( trim( $resolvedMime ) );
	$extOk  = false;
	if ( is_string( $resolvedUrl ) && '' !== $resolvedUrl ) {
		$path = wp_parse_url( $resolvedUrl, PHP_URL_PATH );
		if ( is_string( $path ) ) {
			$extOk = 'pdf' === strtolower( pathinfo( $path, PATHINFO_EXTENSION ) );
		}
	}

	if ( ( $mimeOk || $extOk ) && is_string( $resolvedUrl ) && '' !== $resolvedUrl ) {
		$pdfUrl = esc_url_raw( $resolvedUrl );
		$isPdf  = true;
	} else {
		// Attachment is not a valid PDF — reject it entirely.
		$pdfUrl = '';
	}
} elseif ( '' !== $pdfUrl ) {
	// External URL: allow only when the path resolves to a .pdf extension.
	$path = wp_parse_url( $pdfUrl, PHP_URL_PATH );
	if ( is_string( $path ) && 'pdf' === strtolower( pathinfo( $path, PATHINFO_EXTENSION ) ) ) {
		$isPdf = true;
	} else {
		$pdfUrl = '';
	}
}

// Nothing usable to embed.
if ( '' === $pdfUrl || ! $isPdf ) {
	return;
}

// --- Resolve the document title / accessible name. ---
$pdfName = isset( $attributes['pdfName'] ) ? sanitize_text_field( (string) $attributes['pdfName'] ) : '';
if ( '' === trim( $pdfName ) && $pdfId > 0 ) {
	$attTitle = get_the_title( $pdfId );
	if ( is_string( $attTitle ) && '' !== $attTitle ) {
		$pdfName = sanitize_text_field( $attTitle );
	}
}
$frameTitle = '' !== trim( $pdfName ) ? trim( $pdfName ) : __( 'PDF document', 'b-blocks' );

// --- Layout / behavior. ---
$heightAttr   = isset( $attributes['height'] ) && is_array( $attributes['height'] ) ? $attributes['height'] : [];
$hDesktop     = $sanitizeLength( $heightAttr['desktop'] ?? '600px', '600px' );
$hTablet      = $sanitizeLength( $heightAttr['tablet'] ?? '500px', '500px' );
$hMobile      = $sanitizeLength( $heightAttr['mobile'] ?? '400px', '400px' );
$width        = $sanitizeLength( $attributes['width'] ?? '100%', '100%' );
$maxWidth     = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );
$alignment    = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );
$shadowPreset = $pickFrom( $attributes['shadow'] ?? 'none', [ 'none', 'small', 'medium', 'large' ], 'none' );

$showDownload = isset( $attributes['showDownload'] ) ? (bool) $attributes['showDownload'] : true;
$noindex      = ! empty( $attributes['noindex'] );

$downloadLabel = isset( $attributes['downloadLabel'] ) ? sanitize_text_field( (string) $attributes['downloadLabel'] ) : '';
if ( '' === trim( $downloadLabel ) ) {
	$downloadLabel = __( 'Download PDF', 'b-blocks' );
}

$fallbackText = isset( $attributes['fallbackText'] ) ? sanitize_text_field( (string) $attributes['fallbackText'] ) : '';
if ( '' === trim( $fallbackText ) ) {
	$fallbackText = __( 'Your browser does not support embedded PDFs. Please download the file to view it.', 'b-blocks' );
}

// --- Style. ---
$borderWidth  = $clampInt( $attributes['borderWidth'] ?? 1, 0, 8, 1 );
$borderRadius = $clampInt( $attributes['borderRadius'] ?? 4, 0, 32, 4 );
$borderColor  = $sanitizeColor( $attributes['borderColor'] ?? '', '#e0e0e0' );

// --- Advanced. ---
$addID    = isset( $attributes['addID'] ) ? sanitize_html_class( (string) $attributes['addID'] ) : '';
$addClass = isset( $attributes['addClass'] ) ? sanitize_text_field( (string) $attributes['addClass'] ) : '';
$addCSS   = isset( $attributes['addCSS'] ) ? wp_strip_all_tags( (string) $attributes['addCSS'] ) : '';

if ( '' !== $addID ) {
	$id = $addID;
}

$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

// Accessible download link name.
$downloadAria = '' !== trim( $downloadLabel )
	? trim( $downloadLabel )
	/* translators: %s: PDF document title. */
	: sprintf( __( 'Download %s', 'b-blocks' ), $frameTitle );

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-pe{";
$css .= "--bb-pe-width:$width;";
$css .= "--bb-pe-max-width:$maxWidthCss;";
$css .= "--bb-pe-h-desktop:$hDesktop;";
$css .= "--bb-pe-h-tablet:$hTablet;";
$css .= "--bb-pe-h-mobile:$hMobile;";
$css .= "--bb-pe-radius:{$borderRadius}px;";
$css .= "--bb-pe-border-width:{$borderWidth}px;";
$css .= "--bb-pe-border-color:$borderColor;";
$css .= '--bb-pe-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-pe'
	. ' bb-pe--align-' . $alignment
	. ( $borderWidth > 0 ? ' bb-pe--has-border' : '' )
	. ( '' !== $addClass ? ' ' . $addClass : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	role='region'
	aria-label='<?php echo esc_attr( $frameTitle ); ?>'
	<?php if ( $noindex ) : ?>data-bb-pe-noindex='1'<?php endif; ?>
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
		<?php if ( '' !== $addCSS ) : ?>
		<?php echo wp_strip_all_tags( $addCSS ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
		<?php endif; ?>
	</style>

	<div class='bb-pe-frame-wrap'>
		<iframe
			class='bb-pe-frame'
			src='<?php echo esc_url( $pdfUrl ); ?>'
			title='<?php echo esc_attr( $frameTitle ); ?>'
			loading='lazy'
			referrerpolicy='no-referrer-when-downgrade'
		>
			<p class='bb-pe-fallback'>
				<?php echo esc_html( $fallbackText ); ?>
				<a href='<?php echo esc_url( $pdfUrl ); ?>' download rel='noopener'><?php echo esc_html( $downloadAria ); ?></a>
			</p>
		</iframe>
	</div>

	<?php if ( $showDownload ) : ?>
		<div class='bb-pe-download'>
			<a
				class='bb-pe-btn'
				href='<?php echo esc_url( $pdfUrl ); ?>'
				download
				rel='noopener'
				aria-label='<?php echo esc_attr( $downloadAria ); ?>'
			>
				<svg class='bb-pe-btn-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
					<path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
				</svg>
				<span class='bb-pe-btn-label'><?php echo esc_html( $downloadLabel ); ?></span>
			</a>
		</div>
	<?php endif; ?>
</div>
