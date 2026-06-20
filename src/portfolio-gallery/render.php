<?php
/**
 * Portfolio Gallery Block server-side render.
 *
 * Renders a filterable, lightbox-enabled gallery of media-library images.
 * Each item is tagged with one category; visitors click a button in the
 * toolbar to filter by category, and clicking an image opens a native
 * <dialog> lightbox with prev/next/Escape keyboard support.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (the same pattern used in content-filter, image-box,
 * modal-popup, comparison-table, process-steps).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksPortfolioGallery';
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

// --- Slugify a category label for use in data attributes -------------
$slugify = static function ( $label ) {
	$slug = sanitize_title( (string) $label );
	if ( '' === $slug ) {
		// sanitize_title may return empty for purely non-ASCII strings.
		$slug = strtolower( preg_replace( '/[^a-z0-9]+/i', '-', (string) $label ) );
		$slug = trim( $slug, '-' );
	}
	return '' === $slug ? 'cat' : $slug;
};

// --- Clamp an integer between min/max with default fallback ----------
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

// --- Resolve and sanitize categories ---------------------------------
$rawCategories = ( isset( $attributes['categories'] ) && is_array( $attributes['categories'] ) ) ? $attributes['categories'] : [];
$categories    = [];
$seenSlugs     = [];
$slugByLabel   = [];
foreach ( $rawCategories as $rawCat ) {
	$label = trim( (string) $rawCat );
	if ( '' === $label ) {
		continue;
	}
	if ( count( $categories ) >= 20 ) {
		break;
	}
	$slug = $slugify( $label );
	if ( isset( $seenSlugs[ $slug ] ) ) {
		continue;
	}
	$seenSlugs[ $slug ] = true;
	$slugByLabel[ $label ] = $slug;
	$categories[]       = [
		'label' => $label,
		'slug'  => $slug,
	];
}

// --- Scalar attributes -----------------------------------------------
$layout = isset( $attributes['layout'] ) ? sanitize_key( (string) $attributes['layout'] ) : 'grid';
$layout = in_array( $layout, [ 'grid', 'masonry' ], true ) ? $layout : 'grid';

$aspectRatio = isset( $attributes['aspectRatio'] ) ? sanitize_key( (string) $attributes['aspectRatio'] ) : 'auto';
$aspectRatio = in_array( $aspectRatio, [ 'auto', '1-1', '4-3', '16-9', '3-4' ], true ) ? $aspectRatio : 'auto';

$colAttr = isset( $attributes['columns'] ) && is_array( $attributes['columns'] ) ? $attributes['columns'] : [];
$cols    = [
	'desktop' => $clampInt( $colAttr['desktop'] ?? 3, 1, 6, 3 ),
	'tablet'  => $clampInt( $colAttr['tablet'] ?? 2, 1, 6, 2 ),
	'mobile'  => $clampInt( $colAttr['mobile'] ?? 1, 1, 6, 1 ),
];

$columnGap   = $clampInt( $attributes['columnGap'] ?? 16, 0, 80, 16 );
$rowGap      = $clampInt( $attributes['rowGap'] ?? 16, 0, 80, 16 );
$imageRadius = $clampInt( $attributes['imageRadius'] ?? 0, 0, 64, 0 );

$showCaptions  = isset( $attributes['showCaptions'] ) ? ! empty( $attributes['showCaptions'] ) : false;

$captionPosition = isset( $attributes['captionPosition'] ) ? sanitize_key( (string) $attributes['captionPosition'] ) : 'below';
$captionPosition = in_array( $captionPosition, [ 'below', 'overlay' ], true ) ? $captionPosition : 'below';

$captionColor    = $sanitizeColor( $attributes['captionColor'] ?? '', '' );
$captionFontSize = $clampInt( $attributes['captionFontSize'] ?? 14, 10, 24, 14 );

$showFilter     = isset( $attributes['showFilter'] ) ? ! empty( $attributes['showFilter'] ) : true;
$showAllButton  = isset( $attributes['showAllButton'] ) ? ! empty( $attributes['showAllButton'] ) : true;
$filterAllLabel = isset( $attributes['filterAllLabel'] ) ? trim( (string) $attributes['filterAllLabel'] ) : 'All';
if ( '' === $filterAllLabel ) {
	$filterAllLabel = __( 'All', 'b-blocks' );
}

$defaultFilter = isset( $attributes['defaultFilter'] ) ? sanitize_title( (string) $attributes['defaultFilter'] ) : 'all';
if ( 'all' !== $defaultFilter ) {
	$validSlugs = array_keys( $seenSlugs );
	if ( ! in_array( $defaultFilter, $validSlugs, true ) ) {
		$defaultFilter = 'all';
	}
}
if ( 'all' === $defaultFilter && ! $showAllButton && ! empty( $categories ) ) {
	$defaultFilter = $categories[0]['slug'];
}

$filterAlign = isset( $attributes['filterAlign'] ) ? sanitize_key( (string) $attributes['filterAlign'] ) : 'center';
$filterAlign = in_array( $filterAlign, [ 'left', 'center', 'right' ], true ) ? $filterAlign : 'center';

$filterBarGap = $clampInt( $attributes['filterBarGap'] ?? 24, 0, 80, 24 );

$btnActiveBg      = $sanitizeColor( $attributes['btnActiveBg'] ?? '', '#0d6efd' );
$btnActiveColor   = $sanitizeColor( $attributes['btnActiveColor'] ?? '', '#ffffff' );
$btnInactiveBg    = $sanitizeColor( $attributes['btnInactiveBg'] ?? '', '#f0f0f0' );
$btnInactiveColor = $sanitizeColor( $attributes['btnInactiveColor'] ?? '', '#333333' );
$btnFontSize      = $clampInt( $attributes['btnFontSize'] ?? 14, 10, 24, 14 );
$btnPaddingV      = $clampInt( $attributes['btnPaddingV'] ?? 8, 0, 32, 8 );
$btnPaddingH      = $clampInt( $attributes['btnPaddingH'] ?? 20, 0, 64, 20 );
$btnBorderRadius  = $clampInt( $attributes['btnBorderRadius'] ?? 4, 0, 50, 4 );
$btnGap           = $clampInt( $attributes['btnGap'] ?? 8, 0, 32, 8 );

$btnFontWeight = isset( $attributes['btnFontWeight'] ) ? sanitize_key( (string) $attributes['btnFontWeight'] ) : '500';
$btnFontWeight = in_array( $btnFontWeight, [ '400', '500', '600', '700' ], true ) ? $btnFontWeight : '500';

$hoverEffect = isset( $attributes['hoverEffect'] ) ? sanitize_key( (string) $attributes['hoverEffect'] ) : 'zoom';
$hoverEffect = in_array( $hoverEffect, [ 'none', 'zoom', 'darken' ], true ) ? $hoverEffect : 'zoom';

$hoverDuration = $clampInt( $attributes['hoverDuration'] ?? 300, 0, 800, 300 );

$lightbox             = isset( $attributes['lightbox'] ) ? ! empty( $attributes['lightbox'] ) : true;
$lightboxOverlayColor = $sanitizeColor( $attributes['lightboxOverlayColor'] ?? '', 'rgba(0,0,0,0.9)' );
$lightboxShowCaption  = isset( $attributes['lightboxShowCaption'] ) ? ! empty( $attributes['lightboxShowCaption'] ) : true;

$filterTransitionDuration = $clampInt( $attributes['filterTransitionDuration'] ?? 400, 0, 1200, 400 );

// --- Aspect ratio → CSS value -----------------------------------------
$aspectRatioCss = [
	'auto' => 'auto',
	'1-1'  => '1 / 1',
	'4-3'  => '4 / 3',
	'16-9' => '16 / 9',
	'3-4'  => '3 / 4',
];
$aspectRatioValue = $aspectRatioCss[ $aspectRatio ] ?? 'auto';

// --- Resolve items ---------------------------------------------------
$rawItems   = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : [];
$cleanItems = [];

foreach ( $rawItems as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$imageId  = isset( $item['imageId'] ) ? absint( $item['imageId'] ) : 0;
	$imageUrl = isset( $item['imageUrl'] ) ? esc_url_raw( (string) $item['imageUrl'] ) : '';
	$imageAlt = isset( $item['imageAlt'] ) ? sanitize_text_field( (string) $item['imageAlt'] ) : '';
	$caption  = isset( $item['caption'] ) ? sanitize_text_field( (string) $item['caption'] ) : '';
	$rawCat   = isset( $item['categorySlug'] ) ? (string) $item['categorySlug'] : '';

	// Resolve image URL from attachment ID if URL missing but ID present.
	$fullUrl = '';
	if ( $imageId > 0 ) {
		$full = wp_get_attachment_image_url( $imageId, 'full' );
		if ( $full ) {
			$fullUrl = $full;
		}
		if ( '' === $imageUrl ) {
			$large = wp_get_attachment_image_url( $imageId, 'large' );
			if ( $large ) {
				$imageUrl = $large;
			} elseif ( $full ) {
				$imageUrl = $full;
			}
		}
		if ( '' === $imageAlt ) {
			$attachmentAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
			if ( is_string( $attachmentAlt ) && '' !== $attachmentAlt ) {
				$imageAlt = sanitize_text_field( $attachmentAlt );
			}
		}
	}

	if ( '' === $fullUrl ) {
		$fullUrl = $imageUrl;
	}

	if ( '' === $imageUrl ) {
		continue;
	}

	// Determine the canonical category slug. The editor stores the slug
	// directly, but we re-slugify to keep PHP/JS output identical and
	// drop tags that point at categories the editor has since deleted.
	$catSlug = '';
	if ( '' !== $rawCat ) {
		$candidate = $slugify( $rawCat );
		if ( isset( $seenSlugs[ $candidate ] ) ) {
			$catSlug = $candidate;
		}
	}

	// Fallback alt: use caption when alt text is missing entirely.
	if ( '' === $imageAlt && '' !== $caption ) {
		$imageAlt = $caption;
	}

	$cleanItems[] = [
		'imageId'  => $imageId,
		'imageUrl' => $imageUrl,
		'fullUrl'  => $fullUrl,
		'imageAlt' => $imageAlt,
		'caption'  => $caption,
		'catSlug'  => $catSlug,
	];
}

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-pg-cols-desktop:' . $cols['desktop'],
	'--bb-pg-cols-tablet:' . $cols['tablet'],
	'--bb-pg-cols-mobile:' . $cols['mobile'],
	'--bb-pg-col-gap:' . $columnGap . 'px',
	'--bb-pg-row-gap:' . $rowGap . 'px',
	'--bb-pg-img-radius:' . $imageRadius . 'px',
	'--bb-pg-aspect:' . $aspectRatioValue,
	'--bb-pg-caption-color:' . ( '' === $captionColor ? 'currentColor' : $captionColor ),
	'--bb-pg-caption-size:' . $captionFontSize . 'px',
	'--bb-pg-filter-bar-gap:' . $filterBarGap . 'px',
	'--bb-pg-btn-gap:' . $btnGap . 'px',
	'--bb-pg-btn-active-bg:' . $btnActiveBg,
	'--bb-pg-btn-active-color:' . $btnActiveColor,
	'--bb-pg-btn-inactive-bg:' . $btnInactiveBg,
	'--bb-pg-btn-inactive-color:' . $btnInactiveColor,
	'--bb-pg-btn-font-size:' . $btnFontSize . 'px',
	'--bb-pg-btn-font-weight:' . $btnFontWeight,
	'--bb-pg-btn-pad-v:' . $btnPaddingV . 'px',
	'--bb-pg-btn-pad-h:' . $btnPaddingH . 'px',
	'--bb-pg-btn-radius:' . $btnBorderRadius . 'px',
	'--bb-pg-hover-duration:' . $hoverDuration . 'ms',
	'--bb-pg-filter-duration:' . $filterTransitionDuration . 'ms',
	'--bb-pg-lb-overlay:' . $lightboxOverlayColor,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-pg-wrapper'
	. ' bb-pg-layout--' . $layout
	. ' bb-pg-align--' . $filterAlign
	. ' bb-pg-hover--' . $hoverEffect
	. ( 'auto' !== $aspectRatio && 'masonry' !== $layout ? ' has-aspect' : '' )
	. ( $showCaptions ? ' has-captions bb-pg-caption--' . $captionPosition : '' )
	. ( $lightbox ? ' has-lightbox' : '' )
);

$toolbarLabel  = __( 'Filter gallery', 'b-blocks' );
$gridAriaLabel = __( 'Gallery images', 'b-blocks' );
$lbAriaLabel   = __( 'Image lightbox', 'b-blocks' );

$itemTotal = count( $cleanItems );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-bb-pg-init='0'
	data-bb-pg-default='<?php echo esc_attr( $defaultFilter ); ?>'
	data-bb-pg-lightbox='<?php echo esc_attr( $lightbox ? '1' : '0' ); ?>'
	data-bb-pg-duration='<?php echo esc_attr( (string) $filterTransitionDuration ); ?>'
>
	<?php if ( $showFilter && ( ! empty( $categories ) || $showAllButton ) ) : ?>
		<div
			class='bb-pg-bar'
			role='toolbar'
			aria-label='<?php echo esc_attr( $toolbarLabel ); ?>'
		>
			<?php if ( $showAllButton ) :
				$isAllActive = ( 'all' === $defaultFilter );
				?>
				<button
					type='button'
					class='bb-pg-btn<?php echo esc_attr( $isAllActive ? ' is-active' : '' ); ?>'
					data-bb-pg-filter='*'
					aria-pressed='<?php echo esc_attr( $isAllActive ? 'true' : 'false' ); ?>'
				>
					<?php echo esc_html( $filterAllLabel ); ?>
				</button>
			<?php endif; ?>

			<?php foreach ( $categories as $cat ) :
				$isActive = ( $cat['slug'] === $defaultFilter );
				?>
				<button
					type='button'
					class='bb-pg-btn<?php echo esc_attr( $isActive ? ' is-active' : '' ); ?>'
					data-bb-pg-filter='<?php echo esc_attr( $cat['slug'] ); ?>'
					aria-pressed='<?php echo esc_attr( $isActive ? 'true' : 'false' ); ?>'
				>
					<?php echo esc_html( $cat['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<?php if ( 0 === $itemTotal ) : ?>
		<p class='bb-pg-empty'><?php esc_html_e( 'No images yet. Add the first one from the sidebar.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<ul class='bb-pg-grid' role='list' aria-label='<?php echo esc_attr( $gridAriaLabel ); ?>'>
			<?php foreach ( $cleanItems as $idx => $item ) :
				$linkAriaBase = '' !== $item['caption']
					? $item['caption']
					: ( '' !== $item['imageAlt'] ? $item['imageAlt'] : __( 'image', 'b-blocks' ) );
				/* translators: %s: image caption or alt text */
				$linkAria = sprintf( __( 'Open image: %s', 'b-blocks' ), $linkAriaBase );
				?>
				<li
					class='bb-pg-item'
					data-bb-pg-category='<?php echo esc_attr( $item['catSlug'] ); ?>'
					data-bb-pg-index='<?php echo esc_attr( (string) $idx ); ?>'
				>
					<?php if ( $lightbox ) : ?>
						<a
							class='bb-pg-link'
							href='<?php echo esc_url( $item['fullUrl'] ); ?>'
							data-bb-pg-lightbox='<?php echo esc_attr( (string) $idx ); ?>'
							data-bb-pg-full='<?php echo esc_url( $item['fullUrl'] ); ?>'
							data-bb-pg-caption='<?php echo esc_attr( $item['caption'] ); ?>'
							data-bb-pg-alt='<?php echo esc_attr( $item['imageAlt'] ); ?>'
							aria-label='<?php echo esc_attr( $linkAria ); ?>'
						>
							<figure class='bb-pg-figure'>
								<img
									class='bb-pg-img'
									src='<?php echo esc_url( $item['imageUrl'] ); ?>'
									alt='<?php echo esc_attr( $item['imageAlt'] ); ?>'
									loading='lazy'
									decoding='async'
								/>
								<?php if ( $showCaptions && '' !== $item['caption'] ) : ?>
									<figcaption class='bb-pg-caption'><?php echo esc_html( $item['caption'] ); ?></figcaption>
								<?php endif; ?>
								<?php if ( 'darken' === $hoverEffect ) : ?>
									<span class='bb-pg-darken' aria-hidden='true'></span>
								<?php endif; ?>
							</figure>
						</a>
					<?php else : ?>
						<figure class='bb-pg-figure'>
							<img
								class='bb-pg-img'
								src='<?php echo esc_url( $item['imageUrl'] ); ?>'
								alt='<?php echo esc_attr( $item['imageAlt'] ); ?>'
								loading='lazy'
								decoding='async'
							/>
							<?php if ( $showCaptions && '' !== $item['caption'] ) : ?>
								<figcaption class='bb-pg-caption'><?php echo esc_html( $item['caption'] ); ?></figcaption>
							<?php endif; ?>
							<?php if ( 'darken' === $hoverEffect ) : ?>
								<span class='bb-pg-darken' aria-hidden='true'></span>
							<?php endif; ?>
						</figure>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( $lightbox && $itemTotal > 0 ) : ?>
		<dialog
			class='bb-pg-lightbox'
			aria-label='<?php echo esc_attr( $lbAriaLabel ); ?>'
			data-bb-pg-show-caption='<?php echo esc_attr( $lightboxShowCaption ? '1' : '0' ); ?>'
		>
			<button
				type='button'
				class='bb-pg-close'
				aria-label='<?php echo esc_attr__( 'Close lightbox', 'b-blocks' ); ?>'
			>&times;</button>
			<button
				type='button'
				class='bb-pg-prev'
				aria-label='<?php echo esc_attr__( 'Previous image', 'b-blocks' ); ?>'
			>&lsaquo;</button>
			<button
				type='button'
				class='bb-pg-next'
				aria-label='<?php echo esc_attr__( 'Next image', 'b-blocks' ); ?>'
			>&rsaquo;</button>
			<figure class='bb-pg-lightbox-figure'>
				<img class='bb-pg-lightbox-img' src='' alt='' />
				<figcaption class='bb-pg-lightbox-caption'></figcaption>
			</figure>
		</dialog>
	<?php endif; ?>
</div>
