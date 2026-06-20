<?php
/**
 * Image Slider — server-side render.
 *
 * @package b-blocks
 */

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named) ---
if ( ! function_exists( 'bBlocksImageSliderSanitizeColor' ) ) {
	function bBlocksImageSliderSanitizeColor( $color, $fallback = '' ) {
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
		// var() — fallback value restricted to safe chars only (no {}, \, <, >).
		if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
			return $color;
		}
		return $fallback;
	}
}

$id        = wp_unique_id( 'bBlocksImageSlider-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$images          = isset( $attributes['images'] ) && is_array( $attributes['images'] ) ? $attributes['images'] : array();
$layout          = isset( $attributes['layout'] ) && 'multi' === $attributes['layout'] ? 'multi' : 'slide';
$slidesPerView   = isset( $attributes['slidesPerView'] ) && is_array( $attributes['slidesPerView'] ) ? $attributes['slidesPerView'] : array();
$gap             = isset( $attributes['gap'] ) ? (int) $attributes['gap'] : 16;
$aspectRatio     = isset( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '16:9';
$imageSize       = isset( $attributes['imageSize'] ) && in_array( $attributes['imageSize'], array( 'thumbnail', 'medium', 'large', 'full' ), true ) ? $attributes['imageSize'] : 'large';
$objectFit       = isset( $attributes['objectFit'] ) ? $attributes['objectFit'] : 'cover';
$showCaptions    = ! empty( $attributes['showCaptions'] );
$captionColor    = bBlocksImageSliderSanitizeColor( isset( $attributes['captionColor'] ) ? $attributes['captionColor'] : '', '' );
$captionFontSize = isset( $attributes['captionFontSize'] ) ? (int) $attributes['captionFontSize'] : 14;
$showArrows      = ! empty( $attributes['showArrows'] );
$arrowColor      = bBlocksImageSliderSanitizeColor( isset( $attributes['arrowColor'] ) ? $attributes['arrowColor'] : '', '#ffffff' );
$arrowBgColor    = bBlocksImageSliderSanitizeColor( isset( $attributes['arrowBgColor'] ) ? $attributes['arrowBgColor'] : '', 'rgba(0,0,0,0.4)' );
$arrowSize       = isset( $attributes['arrowSize'] ) ? (int) $attributes['arrowSize'] : 40;
$showDots        = ! empty( $attributes['showDots'] );
$dotColor        = bBlocksImageSliderSanitizeColor( isset( $attributes['dotColor'] ) ? $attributes['dotColor'] : '', 'rgba(255,255,255,0.5)' );
$dotActiveColor  = bBlocksImageSliderSanitizeColor( isset( $attributes['dotActiveColor'] ) ? $attributes['dotActiveColor'] : '', '#ffffff' );
$dotSize         = isset( $attributes['dotSize'] ) ? (int) $attributes['dotSize'] : 10;
$showThumbnails  = ! empty( $attributes['showThumbnails'] );
$thumbnailHeight = isset( $attributes['thumbnailHeight'] ) ? (int) $attributes['thumbnailHeight'] : 64;
$thumbnailGap    = isset( $attributes['thumbnailGap'] ) ? (int) $attributes['thumbnailGap'] : 8;
$autoplay        = ! empty( $attributes['autoplay'] );
$autoplayDelay   = isset( $attributes['autoplayDelay'] ) ? (int) $attributes['autoplayDelay'] : 3000;
$pauseOnHover    = ! empty( $attributes['pauseOnHover'] );
$loop            = ! empty( $attributes['loop'] );
$speed           = isset( $attributes['speed'] ) ? (int) $attributes['speed'] : 400;
$effect          = isset( $attributes['effect'] ) && 'fade' === $attributes['effect'] ? 'fade' : 'slide';
$lightbox        = ! empty( $attributes['lightbox'] );
$borderRadius    = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 0;
$maxWidth        = isset( $attributes['maxWidth'] ) ? (int) $attributes['maxWidth'] : 0;

$spvDesktop = isset( $slidesPerView['desktop'] ) ? (int) $slidesPerView['desktop'] : 1;
$spvTablet  = isset( $slidesPerView['tablet'] ) ? (int) $slidesPerView['tablet'] : 1;
$spvMobile  = isset( $slidesPerView['mobile'] ) ? (int) $slidesPerView['mobile'] : 1;

if ( 'slide' === $layout ) {
	$spvDesktop = 1;
	$spvTablet  = 1;
	$spvMobile  = 1;
}

$ratioMap = array(
	'16:9' => '16 / 9',
	'4:3'  => '4 / 3',
	'1:1'  => '1 / 1',
	'3:2'  => '3 / 2',
	'3:4'  => '3 / 4',
	'auto' => 'auto',
);
$ratioValue = isset( $ratioMap[ $aspectRatio ] ) ? $ratioMap[ $aspectRatio ] : '16 / 9';

// Only count images that will actually render (have a resolvable URL).
// Doing a pre-pass here so $total is accurate for aria-labels, dots, and the JS config.
$total = 0;
foreach ( $images as $_img ) {
	$_url = isset( $_img['url'] ) ? $_img['url'] : '';
	if ( '' !== $_url ) {
		$total++;
	}
}
unset( $_img, $_url );

// Inline CSS variables for the wrapper.
$styleVars  = '';
$styleVars .= '--bb-is-gap:' . $gap . 'px;';
$styleVars .= '--bb-is-ratio:' . $ratioValue . ';';
$styleVars .= '--bb-is-object-fit:' . ( 'contain' === $objectFit ? 'contain' : 'cover' ) . ';';
$styleVars .= '--bb-is-radius:' . $borderRadius . 'px;';
$styleVars .= '--bb-is-arrow-color:' . $arrowColor . ';';
$styleVars .= '--bb-is-arrow-bg:' . $arrowBgColor . ';';
$styleVars .= '--bb-is-arrow-size:' . $arrowSize . 'px;';
$styleVars .= '--bb-is-dot-color:' . $dotColor . ';';
$styleVars .= '--bb-is-dot-active:' . $dotActiveColor . ';';
$styleVars .= '--bb-is-dot-size:' . $dotSize . 'px;';
$styleVars .= '--bb-is-thumb-height:' . $thumbnailHeight . 'px;';
$styleVars .= '--bb-is-thumb-gap:' . $thumbnailGap . 'px;';
$styleVars .= '--bb-is-speed:' . $speed . 'ms;';
$styleVars .= '--bb-is-spv-desktop:' . $spvDesktop . ';';
$styleVars .= '--bb-is-spv-tablet:' . $spvTablet . ';';
$styleVars .= '--bb-is-spv-mobile:' . $spvMobile . ';';
if ( $showCaptions ) {
	$styleVars .= '--bb-is-caption-size:' . $captionFontSize . 'px;';
	if ( '' !== $captionColor ) {
		$styleVars .= '--bb-is-caption-color:' . $captionColor . ';';
	}
}
if ( $maxWidth > 0 ) {
	$styleVars .= '--bb-is-max-width:' . $maxWidth . 'px;';
}

// Config consumed by view.js.
$config = array(
	'layout'        => $layout,
	'effect'        => $effect,
	'loop'          => $loop,
	'speed'         => $speed,
	'autoplay'      => $autoplay,
	'autoplayDelay' => $autoplayDelay,
	'pauseOnHover'  => $pauseOnHover,
	'lightbox'      => $lightbox,
	'total'         => $total,
);

$wrapperClasses = 'bb-is-slider';
$wrapperClasses .= ' bb-is-layout-' . ( 'multi' === $layout ? 'multi' : 'slide' );
$wrapperClasses .= ' bb-is-effect-' . ( 'fade' === $effect ? 'fade' : 'slide' );
if ( $maxWidth > 0 ) {
	$wrapperClasses .= ' has-max-width';
}

/**
 * Resolve the best image URL + alt for a given size.
 *
 * @param array  $image    Stored image data.
 * @param string $sizeName Requested WP image size.
 * @return array{url:string,full:string,alt:string,caption:string}
 */
if ( ! function_exists( 'bBlocksImageSliderResolveImage' ) ) {
	function bBlocksImageSliderResolveImage( $image, $sizeName ) {
		$url     = isset( $image['url'] ) ? $image['url'] : '';
		$full    = $url;
		$caption = isset( $image['caption'] ) ? $image['caption'] : '';

		// Prefer a server-resolved size when an attachment id is present.
		if ( ! empty( $image['id'] ) ) {
			$sized = wp_get_attachment_image_src( (int) $image['id'], $sizeName );
			if ( $sized && ! empty( $sized[0] ) ) {
				$url = $sized[0];
			}
			$fullSrc = wp_get_attachment_image_src( (int) $image['id'], 'full' );
			if ( $fullSrc && ! empty( $fullSrc[0] ) ) {
				$full = $fullSrc[0];
			}
		}

		// Resolve alt text: per-item alt, then media library alt, then empty (decorative).
		$alt = isset( $image['alt'] ) ? trim( $image['alt'] ) : '';
		if ( '' === $alt && ! empty( $image['id'] ) ) {
			$metaAlt = get_post_meta( (int) $image['id'], '_wp_attachment_image_alt', true );
			if ( is_string( $metaAlt ) ) {
				$alt = trim( $metaAlt );
			}
		}

		return array(
			'url'     => $url,
			'full'    => $full,
			'alt'     => $alt,
			'caption' => $caption,
		);
	}
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $planClass ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
>
	<?php if ( 0 === $total ) : ?>
		<p class="bb-is-empty"><?php echo esc_html__( 'No images selected.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<section
			class="<?php echo esc_attr( $wrapperClasses ); ?>"
			style="<?php echo esc_attr( $styleVars ); ?>"
			role="region"
			aria-roledescription="carousel"
			aria-label="<?php echo esc_attr__( 'Image slideshow', 'b-blocks' ); ?>"
			aria-live="off"
			data-bb-is-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"
			tabindex="0"
		>
			<div class="bb-is-viewport">
				<div class="bb-is-track" role="list">
					<?php
					$index = 0;
					foreach ( $images as $image ) :
						$resolved = bBlocksImageSliderResolveImage( $image, $imageSize );
						if ( '' === $resolved['url'] ) {
							continue;
						}
						$index++;
						$isFirst = ( 1 === $index );
						/* translators: 1: current slide number, 2: total slides. */
						$slideLabel = sprintf( __( 'Slide %1$d of %2$d', 'b-blocks' ), $index, $total );
						?>
						<figure
							class="bb-is-slide<?php echo $isFirst ? ' is-active' : ''; ?>"
							role="group"
							aria-roledescription="slide"
							aria-label="<?php echo esc_attr( $slideLabel ); ?>"
							<?php echo $isFirst ? '' : 'aria-hidden="true"'; ?>
						>
							<?php
							$mediaTag  = $lightbox ? 'a' : 'span';
							$mediaAttr = '';
							if ( $lightbox ) {
								$mediaAttr .= ' href="' . esc_url( $resolved['full'] ) . '"';
								$mediaAttr .= ' data-bb-is-full="' . esc_url( $resolved['full'] ) . '"';
								$mediaAttr .= ' data-bb-is-alt="' . esc_attr( $resolved['alt'] ) . '"';
								$mediaAttr .= ' data-bb-is-caption="' . esc_attr( $resolved['caption'] ) . '"';
							}
							if ( ! $isFirst ) {
								$mediaAttr .= ' tabindex="-1"';
							}
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- attributes built from escaped values above.
							echo '<' . $mediaTag . ' class="bb-is-media"' . $mediaAttr . '>';
							?>
								<img
									class="bb-is-img"
									src="<?php echo esc_url( $resolved['url'] ); ?>"
									alt="<?php echo esc_attr( $resolved['alt'] ); ?>"
									loading="lazy"
									decoding="async"
								/>
							<?php echo '</' . esc_html( $mediaTag ) . '>'; ?>

							<?php if ( $showCaptions && '' !== $resolved['caption'] ) : ?>
								<figcaption class="bb-is-caption"><?php echo wp_kses_post( $resolved['caption'] ); ?></figcaption>
							<?php endif; ?>
						</figure>
					<?php endforeach; ?>
				</div>
			</div>

			<?php if ( $showArrows && $total > 1 ) : ?>
				<button type="button" class="bb-is-arrow bb-is-prev" aria-label="<?php echo esc_attr__( 'Previous slide', 'b-blocks' ); ?>"<?php echo $loop ? '' : ' disabled aria-disabled="true"'; ?>>
					<svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
				</button>
				<button type="button" class="bb-is-arrow bb-is-next" aria-label="<?php echo esc_attr__( 'Next slide', 'b-blocks' ); ?>">
					<svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
				</button>
			<?php endif; ?>

			<?php if ( $showDots && $total > 1 ) : ?>
				<div class="bb-is-dots" role="tablist" aria-label="<?php echo esc_attr__( 'Choose slide', 'b-blocks' ); ?>">
					<?php for ( $d = 1; $d <= $total; $d++ ) : ?>
						<?php /* translators: %d: slide number. */ ?>
						<button
							type="button"
							class="bb-is-dot<?php echo 1 === $d ? ' is-active' : ''; ?>"
							role="tab"
							aria-label="<?php echo esc_attr( sprintf( __( 'Slide %d', 'b-blocks' ), $d ) ); ?>"
							aria-current="<?php echo 1 === $d ? 'true' : 'false'; ?>"
						></button>
					<?php endfor; ?>
				</div>
			<?php endif; ?>

			<?php if ( $showThumbnails && $total > 1 ) : ?>
				<div class="bb-is-thumbs" role="list" aria-label="<?php echo esc_attr__( 'Slide thumbnails', 'b-blocks' ); ?>">
					<?php
					$tIndex = 0;
					foreach ( $images as $image ) :
						$thumb = bBlocksImageSliderResolveImage( $image, 'thumbnail' );
						if ( '' === $thumb['url'] ) {
							continue;
						}
						$tIndex++;
						/* translators: %d: slide number. */
						$thumbLabel = sprintf( __( 'Go to slide %d', 'b-blocks' ), $tIndex );
						?>
						<button
							type="button"
							class="bb-is-thumb<?php echo 1 === $tIndex ? ' is-active' : ''; ?>"
							aria-label="<?php echo esc_attr( $thumbLabel ); ?>"
						>
							<img src="<?php echo esc_url( $thumb['url'] ); ?>" alt="" loading="lazy" decoding="async" />
						</button>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</section>
	<?php endif; ?>
</div>
