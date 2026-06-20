<?php
/**
 * Image Mask Block server-side render.
 *
 * Applies a CSS clip-path or inline SVG <clipPath> mask shape to a single
 * media-library image, with optional caption, link, border, shadow, and
 * CSS-only hover effects.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as image-box, process-steps, modal-popup).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksImageMask';
$id        = wp_unique_id( "$prefix-" );
$clipId    = $id . '-clip';
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, named, or var()) -----
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
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	// Accept CSS custom property references produced by WordPress theme.json color presets.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp an integer between min/max with default fallback ------------
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

// --- Sanitize a CSS object-position value ------------------------------
$sanitizePosition = static function ( $value, $fallback = 'center center' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^[a-z0-9%.\s-]{1,40}$/i', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Shape registries (mirror of Components/Common/shapes.js) ----------
$clipShapes = [
	'circle'       => 'circle(50% at 50% 50%)',
	'ellipse'      => 'ellipse(50% 42% at 50% 50%)',
	'rounded-rect' => 'inset(0 round 18%)',
];

$svgShapes = [
	'hexagon'       => 'M0.5 0 L0.933 0.25 L0.933 0.75 L0.5 1 L0.067 0.75 L0.067 0.25 Z',
	'pentagon'      => 'M0.5 0 L1 0.38 L0.82 1 L0.18 1 L0 0.38 Z',
	'diamond'       => 'M0.5 0 L1 0.5 L0.5 1 L0 0.5 Z',
	'triangle'      => 'M0.5 0 L1 1 L0 1 Z',
	'star'          => 'M0.5 0 L0.618 0.345 L0.976 0.345 L0.691 0.559 L0.809 0.905 L0.5 0.691 L0.191 0.905 L0.309 0.559 L0.024 0.345 L0.382 0.345 Z',
	'heart'         => 'M0.5 1 L0.07 0.55 C-0.06 0.42 -0.02 0.18 0.18 0.13 C0.33 0.09 0.45 0.21 0.5 0.3 C0.55 0.21 0.67 0.09 0.82 0.13 C1.02 0.18 1.06 0.42 0.93 0.55 Z',
	'blob'          => 'M0.92 0.3 C1.02 0.5 0.93 0.78 0.72 0.9 C0.5 1.02 0.2 0.97 0.08 0.76 C-0.03 0.56 0.02 0.27 0.22 0.12 C0.43 -0.03 0.72 0.02 0.85 0.16 C0.88 0.2 0.9 0.25 0.92 0.3 Z',
	'wave'          => 'M0 0.15 C0.25 0 0.4 0.3 0.65 0.18 C0.82 0.1 0.92 0.12 1 0.2 L1 1 L0 1 Z',
	'arch'          => 'M0 1 L0 0.5 C0 0.22 0.22 0 0.5 0 C0.78 0 1 0.22 1 0.5 L1 1 Z',
	'parallelogram' => 'M0.22 0 L1 0 L0.78 1 L0 1 Z',
];

$shadowFilters = [
	'none' => '',
	'sm'   => 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
	'md'   => 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))',
	'lg'   => 'drop-shadow(0 14px 28px rgba(0,0,0,0.28))',
];

// --- Resolve and sanitize attributes -----------------------------------
$imageId  = isset( $attributes['imageId'] ) ? absint( $attributes['imageId'] ) : 0;
$imageUrl = isset( $attributes['imageUrl'] ) ? esc_url_raw( (string) $attributes['imageUrl'] ) : '';
$imageAlt = isset( $attributes['imageAlt'] ) ? sanitize_text_field( (string) $attributes['imageAlt'] ) : '';

$shape = isset( $attributes['shape'] ) ? sanitize_key( (string) $attributes['shape'] ) : 'circle';
$allowedShapes = array_merge( array_keys( $clipShapes ), array_keys( $svgShapes ), [ 'custom' ] );
if ( ! in_array( $shape, $allowedShapes, true ) ) {
	$shape = 'circle';
}

$customSvgUrl = isset( $attributes['customSvgUrl'] ) ? esc_url_raw( (string) $attributes['customSvgUrl'] ) : '';

$imageWidth  = $clampInt( $attributes['imageWidth'] ?? 300, 40, 800, 300 );
$imageHeight = $clampInt( $attributes['imageHeight'] ?? 300, 0, 800, 300 );

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$caption         = isset( $attributes['caption'] ) ? wp_kses_post( (string) $attributes['caption'] ) : '';
$captionColor    = $sanitizeColor( $attributes['captionColor'] ?? '', '' );
$captionFontSize = $clampInt( $attributes['captionFontSize'] ?? 14, 10, 28, 14 );

$linkUrl    = isset( $attributes['linkUrl'] ) ? esc_url_raw( (string) $attributes['linkUrl'] ) : '';
$linkNewTab = ! empty( $attributes['linkNewTab'] );

$hoverEffect = isset( $attributes['hoverEffect'] ) ? sanitize_key( (string) $attributes['hoverEffect'] ) : 'none';
$hoverEffect = in_array( $hoverEffect, [ 'none', 'zoom', 'tilt' ], true ) ? $hoverEffect : 'none';

$hoverDuration = $clampInt( $attributes['hoverDuration'] ?? 300, 0, 800, 300 );

$borderWidth = $clampInt( $attributes['borderWidth'] ?? 0, 0, 12, 0 );
$borderColor = $sanitizeColor( $attributes['borderColor'] ?? '', '#000000' );

$shadow = isset( $attributes['shadow'] ) ? sanitize_key( (string) $attributes['shadow'] ) : 'none';
$shadow = in_array( $shadow, [ 'none', 'sm', 'md', 'lg' ], true ) ? $shadow : 'none';

$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '' );

$objectFit = isset( $attributes['objectFit'] ) ? sanitize_key( (string) $attributes['objectFit'] ) : 'cover';
$objectFit = in_array( $objectFit, [ 'cover', 'contain' ], true ) ? $objectFit : 'cover';

$objectPosition = $sanitizePosition( $attributes['objectPosition'] ?? '', 'center center' );

// --- Resolve image URL + alt from attachment ID ------------------------
if ( '' === $imageUrl && $imageId > 0 ) {
	$resolved = wp_get_attachment_image_url( $imageId, 'large' );
	if ( $resolved ) {
		$imageUrl = $resolved;
	}
}
if ( '' === $imageAlt && $imageId > 0 ) {
	$attachmentAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
	if ( is_string( $attachmentAlt ) && '' !== $attachmentAlt ) {
		$imageAlt = sanitize_text_field( $attachmentAlt );
	}
}

// --- Compute clip / mask CSS for the <img> -----------------------------
$isCustom   = ( 'custom' === $shape );
$isSvgShape = array_key_exists( $shape, $svgShapes );

$clipValue = '';
if ( $isSvgShape ) {
	$clipValue = "url(#$clipId)";
} elseif ( ! $isCustom ) {
	$clipValue = $clipShapes[ $shape ] ?? $clipShapes['circle'];
}

// --- Build inline style for the masked <img> ---------------------------
$imgStyleParts = [
	'object-fit:' . $objectFit,
	'object-position:' . $objectPosition,
];
if ( '' !== $clipValue ) {
	$imgStyleParts[] = '-webkit-clip-path:' . $clipValue;
	$imgStyleParts[] = 'clip-path:' . $clipValue;
}
if ( $isCustom && '' !== $customSvgUrl ) {
	$maskCss = "url('" . esc_url( $customSvgUrl ) . "')";
	$imgStyleParts[] = '-webkit-mask-image:' . $maskCss;
	$imgStyleParts[] = 'mask-image:' . $maskCss;
	$imgStyleParts[] = '-webkit-mask-size:cover';
	$imgStyleParts[] = 'mask-size:cover';
	$imgStyleParts[] = '-webkit-mask-repeat:no-repeat';
	$imgStyleParts[] = 'mask-repeat:no-repeat';
	$imgStyleParts[] = '-webkit-mask-position:center';
	$imgStyleParts[] = 'mask-position:center';
}
if ( $borderWidth > 0 ) {
	$imgStyleParts[] = 'border:' . $borderWidth . 'px solid ' . $borderColor;
}
$imgStyle = implode( ';', $imgStyleParts ) . ';';

// --- Wrapper + mask container styles -----------------------------------
$heightCss = $imageHeight > 0 ? ( $imageHeight . 'px' ) : 'auto';

$figureMargin = [
	'left'   => '0 auto 0 0',
	'center' => '0 auto',
	'right'  => '0 0 0 auto',
];

$wrapperStyleParts = [
	'--bb-im-width:' . $imageWidth . 'px',
	'--bb-im-height:' . $heightCss,
	'--bb-im-duration:' . $hoverDuration . 'ms',
	'--bb-im-shadow:' . ( '' === $shadowFilters[ $shadow ] ? 'none' : $shadowFilters[ $shadow ] ),
	'--bb-im-bg:' . ( '' === $backgroundColor ? 'transparent' : $backgroundColor ),
	'--bb-im-figure-margin:' . $figureMargin[ $alignment ],
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-im-block'
	. ' bb-im-align-' . $alignment
	. ' bb-im-hover-' . $hoverEffect
	. ' bb-im-shape-' . $shape
);

// --- Accessible link label ---------------------------------------------
$hasLink     = ( '' !== $linkUrl );
$linkAriaRaw = '' !== $imageAlt ? $imageAlt : wp_strip_all_tags( $caption );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( '' === $imageUrl ) : ?>
		<p class='bb-im-empty'><?php esc_html_e( 'No image selected. Choose an image in the editor.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<?php if ( $isSvgShape ) : ?>
			<svg width='0' height='0' aria-hidden='true' focusable='false' style='position:absolute;width:0;height:0;'>
				<defs>
					<clipPath id='<?php echo esc_attr( $clipId ); ?>' clipPathUnits='objectBoundingBox'>
						<path d='<?php echo esc_attr( $svgShapes[ $shape ] ); ?>' />
					</clipPath>
				</defs>
			</svg>
		<?php endif; ?>

		<figure class='bb-im-figure'>
			<?php if ( $hasLink ) : ?>
				<a
					class='bb-im-link'
					href='<?php echo esc_url( $linkUrl ); ?>'
					<?php if ( $linkNewTab ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
					<?php if ( '' !== $linkAriaRaw ) : ?>aria-label='<?php echo esc_attr( $linkAriaRaw ); ?>'<?php endif; ?>
				>
			<?php endif; ?>

			<span class='bb-im-mask'>
				<img
					class='bb-im-img'
					src='<?php echo esc_url( $imageUrl ); ?>'
					alt='<?php echo esc_attr( $imageAlt ); ?>'
					loading='lazy'
					decoding='async'
					style='<?php echo esc_attr( $imgStyle ); ?>'
				/>
			</span>

			<?php if ( $hasLink ) : ?>
					<?php if ( $linkNewTab ) : ?>
						<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</a>
			<?php endif; ?>

			<?php if ( '' !== $caption ) : ?>
				<figcaption
					class='bb-im-caption'
					style='<?php echo esc_attr( ( '' !== $captionColor ? 'color:' . $captionColor . ';' : '' ) . 'font-size:' . $captionFontSize . 'px;' ); ?>'
				>
					<?php echo wp_kses_post( $caption ); ?>
				</figcaption>
			<?php endif; ?>
		</figure>
	<?php endif; ?>
</div>
