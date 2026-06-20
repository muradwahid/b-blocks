<?php
/**
 * Testimonial Slider — server-side render.
 *
 * Renders an auto-advancing, swipeable carousel of customer testimonials.
 * Every slide is present in the DOM (no JS-lazy rendering) for SEO and
 * accessibility. The vanilla-JS engine in view.js hydrates motion only.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. Helpers are inlined as static closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksTestimonialSlider';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named) ---
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
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

$clampInt = static function ( $value, $min, $max, $default ) {
	if ( ! is_numeric( $value ) ) {
		return $default;
	}
	return max( $min, min( $max, (int) $value ) );
};

// --- Single inline SVG star (no external dependency) -------------------
$renderStar = static function ( $filled ) {
	$cls = $filled ? 'bb-ts-star bb-ts-star--on' : 'bb-ts-star bb-ts-star--off';
	ob_start();
	?>
	<svg class="<?php echo esc_attr( $cls ); ?>" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
	</svg>
	<?php
	return ob_get_clean();
};

// --- Resolve and sanitize attributes -----------------------------------
$items = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : array();

$layout = isset( $attributes['layout'] ) && 'minimal' === $attributes['layout'] ? 'minimal' : 'card';

$slidesVisible = isset( $attributes['slidesVisible'] ) && is_array( $attributes['slidesVisible'] ) ? $attributes['slidesVisible'] : array();
$svDesktop     = $clampInt( $slidesVisible['desktop'] ?? 2, 1, 4, 2 );
$svTablet      = $clampInt( $slidesVisible['tablet'] ?? 1, 1, 3, 1 );
$svMobile      = $clampInt( $slidesVisible['mobile'] ?? 1, 1, 2, 1 );

$autoPlay       = ! empty( $attributes['autoPlay'] );
$autoPlaySpeed  = $clampInt( $attributes['autoPlaySpeed'] ?? 5000, 1000, 10000, 5000 );
$loop           = ! empty( $attributes['loop'] );
$showArrows     = ! empty( $attributes['showArrows'] );
$showDots       = ! empty( $attributes['showDots'] );
$slideGap       = $clampInt( $attributes['slideGap'] ?? 24, 0, 80, 24 );
$quoteIcon      = ! empty( $attributes['quoteIcon'] );
$showRating     = ! empty( $attributes['showRating'] );
$avatarSize     = $clampInt( $attributes['avatarSize'] ?? 56, 32, 120, 56 );

$avatarShape = isset( $attributes['avatarShape'] ) ? (string) $attributes['avatarShape'] : 'circle';
$avatarShape = in_array( $avatarShape, array( 'circle', 'rounded', 'square' ), true ) ? $avatarShape : 'circle';

$cardBg           = $sanitizeColor( $attributes['cardBg'] ?? '', '' );
$cardBorderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 12, 0, 48, 12 );
$cardPaddingV     = $clampInt( $attributes['cardPaddingV'] ?? 32, 8, 80, 32 );
$cardPaddingH     = $clampInt( $attributes['cardPaddingH'] ?? 32, 8, 80, 32 );

$cardShadow = isset( $attributes['cardShadow'] ) ? (string) $attributes['cardShadow'] : 'medium';
$cardShadow = in_array( $cardShadow, array( 'none', 'small', 'medium', 'large' ), true ) ? $cardShadow : 'medium';

$cardBorderWidth = $clampInt( $attributes['cardBorderWidth'] ?? 0, 0, 4, 0 );
$cardBorderColor = $sanitizeColor( $attributes['cardBorderColor'] ?? '', '' );

$quoteColor = $sanitizeColor( $attributes['quoteColor'] ?? '', '' );

$quoteFontSize = isset( $attributes['quoteFontSize'] ) && is_array( $attributes['quoteFontSize'] ) ? $attributes['quoteFontSize'] : array();
$qfsDesktop    = $clampInt( $quoteFontSize['desktop'] ?? 18, 12, 32, 18 );
$qfsTablet     = $clampInt( $quoteFontSize['tablet'] ?? 16, 12, 32, 16 );
$qfsMobile     = $clampInt( $quoteFontSize['mobile'] ?? 15, 12, 32, 15 );

$allowedWeights  = array( '300', '400', '500', '600', '700' );
$quoteFontWeight = isset( $attributes['quoteFontWeight'] ) && in_array( (string) $attributes['quoteFontWeight'], $allowedWeights, true ) ? (string) $attributes['quoteFontWeight'] : '400';

$quoteIconColor = $sanitizeColor( $attributes['quoteIconColor'] ?? '', '' );
$quoteIconSize  = $clampInt( $attributes['quoteIconSize'] ?? 40, 24, 80, 40 );

$authorNameColor = $sanitizeColor( $attributes['authorNameColor'] ?? '', '' );
$authorNameSize  = $clampInt( $attributes['authorNameFontSize'] ?? 16, 12, 28, 16 );

$nameWeights      = array( '400', '500', '600', '700' );
$authorNameWeight = isset( $attributes['authorNameFontWeight'] ) && in_array( (string) $attributes['authorNameFontWeight'], $nameWeights, true ) ? (string) $attributes['authorNameFontWeight'] : '600';

$authorMetaColor = $sanitizeColor( $attributes['authorMetaColor'] ?? '', '' );
$authorMetaSize  = $clampInt( $attributes['authorMetaFontSize'] ?? 13, 10, 24, 13 );

$starColor = $sanitizeColor( $attributes['starColor'] ?? '', '#F59E0B' );
$starSize  = $clampInt( $attributes['starSize'] ?? 16, 10, 28, 16 );

$arrowBg           = $sanitizeColor( $attributes['arrowBg'] ?? '', '' );
$arrowColor        = $sanitizeColor( $attributes['arrowColor'] ?? '', '' );
$arrowSize         = $clampInt( $attributes['arrowSize'] ?? 40, 24, 64, 40 );
$arrowBorderRadius = $clampInt( $attributes['arrowBorderRadius'] ?? 50, 0, 50, 50 );

$dotColor       = $sanitizeColor( $attributes['dotColor'] ?? '', '' );
$dotActiveColor = $sanitizeColor( $attributes['dotActiveColor'] ?? '', '' );
$dotSize        = $clampInt( $attributes['dotSize'] ?? 8, 4, 16, 8 );

$transitionSpeed = $clampInt( $attributes['transitionSpeed'] ?? 400, 100, 800, 400 );

$alignment = isset( $attributes['alignment'] ) && 'left' === $attributes['alignment'] ? 'left' : 'center';

$maxWidth = isset( $attributes['maxWidth'] ) ? (int) $attributes['maxWidth'] : 0;
$maxWidth = $maxWidth > 0 ? max( 200, min( 1600, $maxWidth ) ) : 0;

$avatarRadius = '50%';
if ( 'rounded' === $avatarShape ) {
	$avatarRadius = '12px';
} elseif ( 'square' === $avatarShape ) {
	$avatarRadius = '0px';
}

$shadowMap = array(
	'none'   => 'none',
	'small'  => '0 1px 3px rgba(0,0,0,0.10)',
	'medium' => '0 4px 16px rgba(0,0,0,0.10)',
	'large'  => '0 10px 30px rgba(0,0,0,0.15)',
);
$shadowValue = $shadowMap[ $cardShadow ];

// --- Filter to renderable items (need a quote or an author name) -------
$renderItems = array();
foreach ( $items as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$quote = isset( $item['quote'] ) ? trim( (string) $item['quote'] ) : '';
	$name  = isset( $item['authorName'] ) ? trim( (string) $item['authorName'] ) : '';
	if ( '' === $quote && '' === $name ) {
		continue;
	}
	$renderItems[] = $item;
}
$total = count( $renderItems );

// --- Wrapper classes ---------------------------------------------------
$wrapperClasses  = $planClass;
$wrapperClasses .= ' bb-ts--' . $layout;
$wrapperClasses .= ' bb-ts--align-' . $alignment;
$wrapperClasses .= ' bb-ts--shadow-' . $cardShadow;
if ( $maxWidth > 0 ) {
	$wrapperClasses .= ' has-max-width';
}

// --- Wrapper inline custom properties ----------------------------------
$styleParts = array(
	'--bb-ts-gap:' . $slideGap . 'px',
	'--bb-ts-sv-desktop:' . $svDesktop,
	'--bb-ts-sv-tablet:' . $svTablet,
	'--bb-ts-sv-mobile:' . $svMobile,
	'--bb-ts-card-radius:' . $cardBorderRadius . 'px',
	'--bb-ts-card-pv:' . $cardPaddingV . 'px',
	'--bb-ts-card-ph:' . $cardPaddingH . 'px',
	'--bb-ts-card-shadow:' . $shadowValue,
	'--bb-ts-card-border-width:' . $cardBorderWidth . 'px',
	'--bb-ts-quote-size-d:' . $qfsDesktop . 'px',
	'--bb-ts-quote-size-t:' . $qfsTablet . 'px',
	'--bb-ts-quote-size-m:' . $qfsMobile . 'px',
	'--bb-ts-quote-weight:' . $quoteFontWeight,
	'--bb-ts-quote-icon-size:' . $quoteIconSize . 'px',
	'--bb-ts-name-size:' . $authorNameSize . 'px',
	'--bb-ts-name-weight:' . $authorNameWeight,
	'--bb-ts-meta-size:' . $authorMetaSize . 'px',
	'--bb-ts-star-color:' . $starColor,
	'--bb-ts-star-size:' . $starSize . 'px',
	'--bb-ts-avatar-size:' . $avatarSize . 'px',
	'--bb-ts-avatar-radius:' . $avatarRadius,
	'--bb-ts-arrow-size:' . $arrowSize . 'px',
	'--bb-ts-arrow-radius:' . $arrowBorderRadius . '%',
	'--bb-ts-dot-size:' . $dotSize . 'px',
	'--bb-ts-speed:' . $transitionSpeed . 'ms',
);
if ( '' !== $cardBg ) {
	$styleParts[] = '--bb-ts-card-bg:' . $cardBg;
}
if ( '' !== $cardBorderColor ) {
	$styleParts[] = '--bb-ts-card-border-color:' . $cardBorderColor;
}
if ( '' !== $quoteColor ) {
	$styleParts[] = '--bb-ts-quote-color:' . $quoteColor;
}
if ( '' !== $quoteIconColor ) {
	$styleParts[] = '--bb-ts-quote-icon-color:' . $quoteIconColor;
}
if ( '' !== $authorNameColor ) {
	$styleParts[] = '--bb-ts-name-color:' . $authorNameColor;
}
if ( '' !== $authorMetaColor ) {
	$styleParts[] = '--bb-ts-meta-color:' . $authorMetaColor;
}
if ( '' !== $arrowBg ) {
	$styleParts[] = '--bb-ts-arrow-bg:' . $arrowBg;
}
if ( '' !== $arrowColor ) {
	$styleParts[] = '--bb-ts-arrow-color:' . $arrowColor;
}
if ( '' !== $dotColor ) {
	$styleParts[] = '--bb-ts-dot-color:' . $dotColor;
}
if ( '' !== $dotActiveColor ) {
	$styleParts[] = '--bb-ts-dot-active:' . $dotActiveColor;
}
if ( $maxWidth > 0 ) {
	$styleParts[] = '--bb-ts-max-width:' . $maxWidth . 'px';
}
$wrapperStyle = implode( ';', $styleParts ) . ';';

// Config consumed by view.js.
$config = array(
	'autoPlay'        => $autoPlay,
	'autoPlaySpeed'   => $autoPlaySpeed,
	'loop'            => $loop,
	'transitionSpeed' => $transitionSpeed,
	'total'           => $total,
	'slidesVisible'   => array(
		'desktop' => $svDesktop,
		'tablet'  => $svTablet,
		'mobile'  => $svMobile,
	),
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClasses ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	style="<?php echo esc_attr( $wrapperStyle ); ?>"
>
	<?php if ( 0 === $total ) : ?>
		<p class="bb-ts-empty"><?php echo esc_html__( 'Add at least one testimonial to display the slider.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<section
			class="bb-ts-slider"
			role="region"
			aria-roledescription="<?php echo esc_attr__( 'carousel', 'b-blocks' ); ?>"
			aria-label="<?php echo esc_attr__( 'Customer testimonials', 'b-blocks' ); ?>"
			aria-live="off"
			data-bb-ts-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"
		>
			<?php if ( $autoPlay && $total > 1 ) : ?>
				<button
					type="button"
					class="bb-ts-playpause"
					aria-label="<?php echo esc_attr__( 'Pause testimonial auto-rotation', 'b-blocks' ); ?>"
					aria-pressed="false"
				>
					<svg class="bb-ts-icon-pause" viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
					<svg class="bb-ts-icon-play" viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
				</button>
			<?php endif; ?>

			<div class="bb-ts-viewport">
				<ul class="bb-ts-track" role="list">
					<?php
					$index = 0;
					foreach ( $renderItems as $item ) :
						$index++;

						$quote       = isset( $item['quote'] ) ? (string) $item['quote'] : '';
						$authorName  = isset( $item['authorName'] ) ? sanitize_text_field( (string) $item['authorName'] ) : '';
						$authorRole  = isset( $item['authorRole'] ) ? sanitize_text_field( (string) $item['authorRole'] ) : '';
						$authorCmpny = isset( $item['authorCompany'] ) ? sanitize_text_field( (string) $item['authorCompany'] ) : '';
						$avatarUrl   = isset( $item['authorImageUrl'] ) ? esc_url_raw( (string) $item['authorImageUrl'] ) : '';
						$avatarAlt   = isset( $item['authorImageAlt'] ) ? sanitize_text_field( (string) $item['authorImageAlt'] ) : '';
						$rating      = isset( $item['rating'] ) ? (int) round( (float) $item['rating'] ) : 0;
						$rating      = max( 0, min( 5, $rating ) );

						$isFirst = ( 1 === $index );

						/* translators: 1: current slide number, 2: total slides. */
						$slideLabel = sprintf( __( '%1$d of %2$d', 'b-blocks' ), $index, $total );

						$metaItems = array();
						if ( '' !== $authorRole ) {
							$metaItems[] = $authorRole;
						}
						if ( '' !== $authorCmpny ) {
							$metaItems[] = $authorCmpny;
						}

						$hasAttribution = '' !== $authorName || ! empty( $metaItems );

						if ( '' === $avatarAlt && '' !== $authorName ) {
							/* translators: %s: reviewer name */
							$avatarAlt = sprintf( __( 'Avatar of %s', 'b-blocks' ), $authorName );
						}
						?>
						<li
							class="bb-ts-slide<?php echo $isFirst ? ' is-active' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded string, $isFirst is boolean ?>"
							role="group"
							aria-roledescription="<?php echo esc_attr__( 'slide', 'b-blocks' ); ?>"
							aria-label="<?php echo esc_attr( $slideLabel ); ?>"
							<?php echo $isFirst ? '' : 'aria-hidden="true"'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded attribute string ?>
						>
							<figure class="bb-ts-card">
								<?php if ( $quoteIcon ) : ?>
									<svg class="bb-ts-quote-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
										<path fill="currentColor" d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z" />
									</svg>
								<?php endif; ?>

								<?php if ( $showRating && $rating > 0 ) : ?>
									<?php
									$ratingAriaLabel = sprintf(
										/* translators: %d: rating value out of 5 */
										__( 'Rating: %d out of 5 stars', 'b-blocks' ),
										$rating
									);
									?>
									<span class="bb-ts-stars" role="img" aria-label="<?php echo esc_attr( $ratingAriaLabel ); ?>">
										<?php
										for ( $s = 1; $s <= 5; $s++ ) {
											echo $renderStar( $s <= $rating ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderStar
										}
										?>
									</span>
								<?php endif; ?>

								<?php if ( '' !== trim( $quote ) ) : ?>
									<blockquote class="bb-ts-quote"><?php echo wp_kses_post( $quote ); ?></blockquote>
								<?php endif; ?>

								<?php if ( ( '' !== $avatarUrl ) || $hasAttribution ) : ?>
									<figcaption class="bb-ts-caption">
										<?php if ( '' !== $avatarUrl ) : ?>
											<img
												class="bb-ts-avatar"
												src="<?php echo esc_url( $avatarUrl ); ?>"
												alt="<?php echo esc_attr( $avatarAlt ); ?>"
												width="<?php echo esc_attr( (string) $avatarSize ); ?>"
												height="<?php echo esc_attr( (string) $avatarSize ); ?>"
												loading="lazy"
												decoding="async"
											/>
										<?php endif; ?>

										<?php if ( $hasAttribution ) : ?>
											<cite class="bb-ts-cite">
												<?php if ( '' !== $authorName ) : ?>
													<span class="bb-ts-name"><?php echo esc_html( $authorName ); ?></span>
												<?php endif; ?>
												<?php if ( ! empty( $metaItems ) ) : ?>
													<span class="bb-ts-meta"><?php echo esc_html( implode( ', ', $metaItems ) ); ?></span>
												<?php endif; ?>
											</cite>
										<?php endif; ?>
									</figcaption>
								<?php endif; ?>
							</figure>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>

			<?php if ( $showArrows && $total > 1 ) : ?>
				<button type="button" class="bb-ts-arrow bb-ts-prev" aria-label="<?php echo esc_attr__( 'Previous testimonial', 'b-blocks' ); ?>"<?php echo $loop ? '' : ' aria-disabled="true"'; ?>>
					<svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
				</button>
				<button type="button" class="bb-ts-arrow bb-ts-next" aria-label="<?php echo esc_attr__( 'Next testimonial', 'b-blocks' ); ?>">
					<svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
				</button>
			<?php endif; ?>

			<?php if ( $showDots && $total > 1 ) : ?>
				<div class="bb-ts-dots" role="tablist" aria-label="<?php echo esc_attr__( 'Select testimonial', 'b-blocks' ); ?>">
					<?php for ( $d = 1; $d <= $total; $d++ ) : ?>
						<button
							type="button"
							class="bb-ts-dot<?php echo 1 === $d ? ' is-active' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded class string ?>"
							role="tab"
							aria-selected="<?php echo 1 === $d ? 'true' : 'false'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded boolean string ?>"
							aria-label="<?php echo esc_attr( sprintf( /* translators: %d: testimonial number. */ __( 'Show testimonial %d', 'b-blocks' ), $d ) ); ?>"
						></button>
					<?php endfor; ?>
				</div>
			<?php endif; ?>
		</section>
	<?php endif; ?>
</div>
