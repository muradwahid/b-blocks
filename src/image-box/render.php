<?php
/**
 * Image Box Block server-side render.
 *
 * Renders a responsive CSS Grid of image cards. Each card is either a
 * full-card <a> link (when an item URL is set) or a non-link <div>; the
 * inner overlay holds the title and optional description, revealed on
 * hover or keyboard focus via CSS.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as process-steps, comparison-table, modal-popup).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksImageBox';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named) -----
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
	return $fallback;
};

// --- Sanitize a CSS length string (px-only or numeric → px) ------------
$sanitizeLength = static function ( $value, $fallback = '' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(?:\.\d+)?(?:px|em|rem|%)$/', $value ) ) {
		return $value;
	}
	if ( is_numeric( $value ) ) {
		return ( (float) $value ) . 'px';
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

// --- Clamp a float between min/max with default fallback ---------------
$clampFloat = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$f = (float) $value;
	if ( $f < $min ) {
		return $min;
	}
	if ( $f > $max ) {
		return $max;
	}
	return $f;
};

// --- Resolve and sanitize attributes -----------------------------------
$rawItems = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : [];

$overlayMode = isset( $attributes['overlayMode'] ) ? sanitize_key( (string) $attributes['overlayMode'] ) : 'hover';
$overlayMode = in_array( $overlayMode, [ 'hover', 'always', 'slide-up' ], true ) ? $overlayMode : 'hover';

$aspectRatio = isset( $attributes['aspectRatio'] ) ? sanitize_key( (string) $attributes['aspectRatio'] ) : '4-3';
$aspectRatio = in_array( $aspectRatio, [ '1-1', '4-3', '16-9', '3-2', '3-4' ], true ) ? $aspectRatio : '4-3';

$titleFontWeight = isset( $attributes['titleFontWeight'] ) ? sanitize_key( (string) $attributes['titleFontWeight'] ) : '600';
$titleFontWeight = in_array( $titleFontWeight, [ '400', '500', '600', '700' ], true ) ? $titleFontWeight : '600';

$borderRadius   = $clampInt( $attributes['borderRadius'] ?? 8, 0, 64, 8 );
$columnGap      = $clampInt( $attributes['columnGap'] ?? 24, 0, 80, 24 );
$rowGap         = $clampInt( $attributes['rowGap'] ?? 24, 0, 80, 24 );
$animDuration   = $clampInt( $attributes['animDuration'] ?? 300, 0, 800, 300 );
$overlayOpacity = $clampFloat( $attributes['overlayOpacity'] ?? 0.55, 0.0, 1.0, 0.55 );
$zoomScale      = $clampFloat( $attributes['zoomScale'] ?? 1.08, 1.0, 1.5, 1.08 );

$showDesc    = isset( $attributes['showDesc'] ) ? ! empty( $attributes['showDesc'] ) : true;
$showArrow   = isset( $attributes['showArrow'] ) ? ! empty( $attributes['showArrow'] ) : true;
$zoomOnHover = isset( $attributes['zoomOnHover'] ) ? ! empty( $attributes['zoomOnHover'] ) : true;

$overlayColor = $sanitizeColor( $attributes['overlayColor'] ?? '', '#000000' );
$titleColor   = $sanitizeColor( $attributes['titleColor'] ?? '', '#ffffff' );
$descColor    = $sanitizeColor( $attributes['descColor'] ?? '', '#f1f5f9' );

// --- Responsive font sizes --------------------------------------------
$titleFontAttr = isset( $attributes['titleFontSize'] ) && is_array( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : [];
$titleFont     = [
	'desktop' => $sanitizeLength( $titleFontAttr['desktop'] ?? '', '20px' ),
	'tablet'  => $sanitizeLength( $titleFontAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $titleFontAttr['mobile'] ?? '', '' ),
];

$descFontAttr = isset( $attributes['descFontSize'] ) && is_array( $attributes['descFontSize'] ) ? $attributes['descFontSize'] : [];
$descFont     = [
	'desktop' => $sanitizeLength( $descFontAttr['desktop'] ?? '', '15px' ),
	'tablet'  => $sanitizeLength( $descFontAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $descFontAttr['mobile'] ?? '', '' ),
];

// --- Responsive columns -----------------------------------------------
$colAttr = isset( $attributes['columns'] ) && is_array( $attributes['columns'] ) ? $attributes['columns'] : [];
$cols    = [
	'desktop' => $clampInt( $colAttr['desktop'] ?? 3, 1, 6, 3 ),
	'tablet'  => $clampInt( $colAttr['tablet'] ?? 2, 1, 6, 2 ),
	'mobile'  => $clampInt( $colAttr['mobile'] ?? 1, 1, 6, 1 ),
];

// --- Aspect ratio → CSS value -----------------------------------------
$aspectRatioCss = [
	'1-1'  => '1 / 1',
	'4-3'  => '4 / 3',
	'16-9' => '16 / 9',
	'3-2'  => '3 / 2',
	'3-4'  => '3 / 4',
];
$aspectRatioValue = $aspectRatioCss[ $aspectRatio ] ?? '4 / 3';

// --- Build clean item list (drop items with no image AND no title) ----
$cleanItems = [];
foreach ( $rawItems as $item ) {
	$imageId    = isset( $item['imageId'] ) ? absint( $item['imageId'] ) : 0;
	$imageUrl   = isset( $item['imageUrl'] ) ? esc_url_raw( (string) $item['imageUrl'] ) : '';
	$imageAlt   = isset( $item['imageAlt'] ) ? sanitize_text_field( (string) $item['imageAlt'] ) : '';
	$title      = isset( $item['title'] ) ? sanitize_text_field( (string) $item['title'] ) : '';
	$desc       = isset( $item['description'] ) ? sanitize_text_field( (string) $item['description'] ) : '';
	$ctaUrl     = isset( $item['ctaUrl'] ) ? esc_url_raw( (string) $item['ctaUrl'] ) : '';
	$ctaLabel   = isset( $item['ctaLabel'] ) ? sanitize_text_field( (string) $item['ctaLabel'] ) : '';
	$ctaNewTab  = ! empty( $item['ctaNewTab'] );

	// Resolve image URL from attachment ID if URL missing but ID present.
	if ( '' === $imageUrl && $imageId > 0 ) {
		$resolved = wp_get_attachment_image_url( $imageId, 'large' );
		if ( $resolved ) {
			$imageUrl = $resolved;
		}
	}

	// Pull alt from WP attachment if not overridden.
	if ( '' === $imageAlt && $imageId > 0 ) {
		$attachmentAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
		if ( is_string( $attachmentAlt ) && '' !== $attachmentAlt ) {
			$imageAlt = sanitize_text_field( $attachmentAlt );
		}
	}

	if ( '' === $imageUrl && '' === $title ) {
		continue;
	}

	$cleanItems[] = [
		'imageId'   => $imageId,
		'imageUrl'  => $imageUrl,
		'imageAlt'  => $imageAlt,
		'title'     => $title,
		'desc'      => $desc,
		'ctaUrl'    => $ctaUrl,
		'ctaLabel'  => $ctaLabel,
		'ctaNewTab' => $ctaNewTab,
	];
}

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-ib-cols:' . $cols['desktop'],
	'--bb-ib-cols-tablet:' . $cols['tablet'],
	'--bb-ib-cols-mobile:' . $cols['mobile'],
	'--bb-ib-col-gap:' . $columnGap . 'px',
	'--bb-ib-row-gap:' . $rowGap . 'px',
	'--bb-ib-radius:' . $borderRadius . 'px',
	'--bb-ib-aspect:' . $aspectRatioValue,
	'--bb-ib-overlay-color:' . $overlayColor,
	'--bb-ib-overlay-opacity:' . $overlayOpacity,
	'--bb-ib-title-color:' . $titleColor,
	'--bb-ib-title-font-size:' . ( '' === $titleFont['desktop'] ? '20px' : $titleFont['desktop'] ),
	'--bb-ib-title-font-size-tablet:' . ( '' === $titleFont['tablet'] ? ( '' === $titleFont['desktop'] ? '20px' : $titleFont['desktop'] ) : $titleFont['tablet'] ),
	'--bb-ib-title-font-size-mobile:' . ( '' === $titleFont['mobile'] ? ( '' === $titleFont['tablet'] ? ( '' === $titleFont['desktop'] ? '20px' : $titleFont['desktop'] ) : $titleFont['tablet'] ) : $titleFont['mobile'] ),
	'--bb-ib-title-weight:' . $titleFontWeight,
	'--bb-ib-desc-color:' . $descColor,
	'--bb-ib-desc-font-size:' . ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ),
	'--bb-ib-desc-font-size-tablet:' . ( '' === $descFont['tablet'] ? ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ) : $descFont['tablet'] ),
	'--bb-ib-desc-font-size-mobile:' . ( '' === $descFont['mobile'] ? ( '' === $descFont['tablet'] ? ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ) : $descFont['tablet'] ) : $descFont['mobile'] ),
	'--bb-ib-zoom:' . $zoomScale,
	'--bb-ib-duration:' . $animDuration . 'ms',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-ib-block'
	. ' bb-ib-overlay--' . $overlayMode
	. ( $zoomOnHover ? ' has-zoom' : ' no-zoom' )
	. ( $showArrow ? ' has-arrow' : '' )
);

$gridAriaLabel = __( 'Image gallery', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( empty( $cleanItems ) ) : ?>
		<p class='bb-ib-empty'><?php esc_html_e( 'No items to display. Add an image and title in the editor.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<ul class='bb-ib-grid' role='list' aria-label='<?php echo esc_attr( $gridAriaLabel ); ?>'>
			<?php foreach ( $cleanItems as $item ) :
				$hasLink = '' !== $item['ctaUrl'];
				$tag     = $hasLink ? 'a' : 'div';
				$linkAttrs = '';
				if ( $hasLink ) {
					$linkAttrs = " href='" . esc_url( $item['ctaUrl'] ) . "'";
					if ( $item['ctaNewTab'] ) {
						$linkAttrs .= " target='_blank' rel='noopener noreferrer'";
					}
					// Accessible link label: prefer item title, fallback to CTA label.
					$ariaLabelText = '' !== $item['title']
						? $item['title']
						: ( '' !== $item['ctaLabel'] ? $item['ctaLabel'] : __( 'Open link', 'b-blocks' ) );
					$linkAttrs .= " aria-label='" . esc_attr( $ariaLabelText ) . "'";
				}
				?>
				<li class='bb-ib-item'>
					<<?php echo esc_html( $tag ); ?>
						class='bb-ib-card'
						<?php
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $linkAttrs assembled from esc_url + esc_attr above.
						echo $linkAttrs;
						?>
					>
						<?php if ( '' !== $item['imageUrl'] ) : ?>
							<img
								class='bb-ib-img'
								src='<?php echo esc_url( $item['imageUrl'] ); ?>'
								alt='<?php echo esc_attr( $item['imageAlt'] ); ?>'
								loading='lazy'
								decoding='async'
							/>
						<?php else : ?>
							<span class='bb-ib-img bb-ib-img--placeholder' aria-hidden='true'></span>
						<?php endif; ?>

						<span class='bb-ib-overlay'>
							<?php if ( '' !== $item['title'] ) : ?>
								<span class='bb-ib-title'>
									<span class='bb-ib-title__text'><?php echo esc_html( $item['title'] ); ?></span>
									<?php if ( $showArrow && $hasLink ) : ?>
										<span class='bb-ib-title__arrow' aria-hidden='true'>&rarr;</span>
									<?php endif; ?>
								</span>
							<?php endif; ?>

							<?php if ( $showDesc && '' !== $item['desc'] ) : ?>
								<span class='bb-ib-desc'><?php echo esc_html( $item['desc'] ); ?></span>
							<?php endif; ?>

							<?php if ( $hasLink && '' !== $item['ctaLabel'] ) : ?>
								<span class='bb-ib-cta-label' aria-hidden='true'><?php echo esc_html( $item['ctaLabel'] ); ?></span>
							<?php endif; ?>
						</span>
					</<?php echo esc_html( $tag ); ?>>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>
