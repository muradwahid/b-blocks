<?php
/**
 * Post Carousel block server-side render.
 *
 * Runs a sanitized `WP_Query` and renders each post as a card inside a Swiper
 * markup tree. The carousel itself is hydrated on the frontend by `view.js`,
 * which reads the JSON config baked into `data-bb-pc-config`. The outer element
 * is a `<section aria-roledescription="carousel">`; each slide is a
 * `role="group"` with `aria-roledescription="slide"`. Per-instance CSS custom
 * properties are emitted inline, scoped under a `wp_unique_id()` wrapper id, so
 * multiple carousels on one page never collide.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksPostCarousel';
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

// --- Resolve query attributes. ---
$postTypeRaw = isset( $attributes['postType'] ) ? sanitize_key( (string) $attributes['postType'] ) : 'post';
$postType    = post_type_exists( $postTypeRaw ) ? $postTypeRaw : 'post';

$postsPerPage = $clampInt( $attributes['postsPerPage'] ?? 6, 1, 50, 6 );

$categoryIds = array_values( array_filter( array_map( 'absint', (array) ( $attributes['selectedCategories'] ?? [] ) ) ) );
$tagIds      = array_values( array_filter( array_map( 'absint', (array) ( $attributes['selectedTags'] ?? [] ) ) ) );

$orderBy = $pickFrom( $attributes['postsOrderBy'] ?? 'date', [ 'date', 'title', 'rand', 'comment_count' ], 'date' );
$order   = $pickFrom( strtoupper( (string) ( $attributes['postsOrder'] ?? 'desc' ) ), [ 'DESC', 'ASC' ], 'DESC' );

$isExcludeCurrent = isset( $attributes['isExcludeCurrent'] ) ? (bool) $attributes['isExcludeCurrent'] : true;

// --- Resolve carousel attributes. ---
$slidesPerView = (array) ( $attributes['slidesPerView'] ?? [] );
$slidesDesktop = $clampInt( $slidesPerView['desktop'] ?? 3, 1, 6, 3 );
$slidesTablet  = $clampInt( $slidesPerView['tablet'] ?? 2, 1, 4, 2 );
$slidesMobile  = $clampInt( $slidesPerView['mobile'] ?? 1, 1, 2, 1 );

$slideGap            = $clampInt( $attributes['slideGap'] ?? 24, 0, 80, 24 );
$isLoop              = isset( $attributes['isLoop'] ) ? (bool) $attributes['isLoop'] : true;
$isAutoplay          = isset( $attributes['isAutoplay'] ) ? (bool) $attributes['isAutoplay'] : true;
$autoplayDelay       = $clampInt( $attributes['autoplayDelay'] ?? 3000, 500, 8000, 3000 );
$autoplayPauseOnHover = isset( $attributes['autoplayPauseOnHover'] ) ? (bool) $attributes['autoplayPauseOnHover'] : true;
$transitionSpeed     = $clampInt( $attributes['transitionSpeed'] ?? 500, 100, 1500, 500 );
$isArrows            = isset( $attributes['isArrows'] ) ? (bool) $attributes['isArrows'] : true;
$isDots              = isset( $attributes['isDots'] ) ? (bool) $attributes['isDots'] : true;

$arrowColor        = $sanitizeColor( $attributes['arrowColor'] ?? '', '#146EF5' );
$arrowBgColor      = $sanitizeColor( $attributes['arrowBgColor'] ?? '', '#ffffff' );
$arrowBorderRadius = $clampInt( $attributes['arrowBorderRadius'] ?? 50, 0, 50, 50 );
$dotColor          = $sanitizeColor( $attributes['dotColor'] ?? '', '#146EF5' );
$dotInactiveColor  = $sanitizeColor( $attributes['dotInactiveColor'] ?? '', '#cccccc' );

// --- Resolve card-content attributes. ---
$isFeaturedImage  = isset( $attributes['isFeaturedImage'] ) ? (bool) $attributes['isFeaturedImage'] : true;
$imageAspectRatio = $pickFrom( $attributes['imageAspectRatio'] ?? '16/9', [ '16/9', '4/3', '1/1', '3/2' ], '16/9' );
$imageBorderRadius = $clampInt( $attributes['imageBorderRadius'] ?? 8, 0, 32, 8 );

$isCategory = isset( $attributes['isCategory'] ) ? (bool) $attributes['isCategory'] : true;
$isTitle    = isset( $attributes['isTitle'] ) ? (bool) $attributes['isTitle'] : true;
$titleTag   = $pickFrom( $attributes['titleTag'] ?? 'h3', [ 'h2', 'h3', 'h4' ], 'h3' );
$titleLines = $clampInt( $attributes['titleLines'] ?? 2, 0, 4, 2 );

$isExcerpt     = isset( $attributes['isExcerpt'] ) ? (bool) $attributes['isExcerpt'] : true;
$excerptLength = $clampInt( $attributes['excerptLength'] ?? 20, 5, 50, 20 );
$isMeta        = isset( $attributes['isMeta'] ) ? (bool) $attributes['isMeta'] : true;
$isReadMore    = isset( $attributes['isReadMore'] ) ? (bool) $attributes['isReadMore'] : true;

$readMoreLabel = isset( $attributes['readMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['readMoreLabel'] ) : '';
$readMoreLabel = '' !== trim( $readMoreLabel ) ? $readMoreLabel : __( 'Read More', 'b-blocks' );

// --- Resolve style attributes. ---
$cardBg           = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$cardBorderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 12, 0, 32, 12 );
$cardBorderColor  = $sanitizeColor( $attributes['cardBorderColor'] ?? '', '' );
$cardBorderWidth  = $clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 4, 1 );
$cardShadow       = isset( $attributes['cardShadow'] ) ? (bool) $attributes['cardShadow'] : true;

$titleColor   = $sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' );
$excerptColor = $sanitizeColor( $attributes['excerptColor'] ?? '', 'inherit' );
$metaColor    = $sanitizeColor( $attributes['metaColor'] ?? '', 'inherit' );

$categoryBadgeBg    = $sanitizeColor( $attributes['categoryBadgeBg'] ?? '', '#146EF5' );
$categoryBadgeColor = $sanitizeColor( $attributes['categoryBadgeColor'] ?? '', '#ffffff' );
$readMoreBg         = $sanitizeColor( $attributes['readMoreBg'] ?? '', '#146EF5' );
$readMoreColor      = $sanitizeColor( $attributes['readMoreColor'] ?? '', '#ffffff' );
$readMoreBorderRadius = $clampInt( $attributes['readMoreBorderRadius'] ?? 4, 0, 50, 4 );

$titleFont    = (array) ( $attributes['titleFontSize'] ?? [] );
$titleSizeD   = $clampInt( $titleFont['desktop'] ?? 18, 12, 40, 18 );
$titleSizeT   = $clampInt( $titleFont['tablet'] ?? 17, 12, 40, 17 );
$titleSizeM   = $clampInt( $titleFont['mobile'] ?? 16, 12, 40, 16 );
$excerptSize  = $clampInt( $attributes['excerptFontSize'] ?? 14, 11, 24, 14 );
$metaSize     = $clampInt( $attributes['metaFontSize'] ?? 13, 10, 20, 13 );

$noPostsMessage = isset( $attributes['noPostsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noPostsMessage'] ) : '';
$noPostsMessage = '' !== trim( $noPostsMessage ) ? $noPostsMessage : __( 'No posts found.', 'b-blocks' );

// --- Build the query. ---
$queryArgs = [
	'post_type'           => $postType,
	'posts_per_page'      => $postsPerPage,
	'post_status'         => 'publish',
	'orderby'             => $orderBy,
	'order'               => $order,
	'has_password'        => false,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
];

if ( $isExcludeCurrent ) {
	$currentId = get_the_ID();
	if ( $currentId ) {
		$queryArgs['post__not_in'] = [ $currentId ];
	}
}

$taxQuery = [];
if ( ! empty( $categoryIds ) ) {
	$taxQuery[] = [
		'taxonomy' => 'category',
		'field'    => 'term_id',
		'terms'    => $categoryIds,
	];
}
if ( ! empty( $tagIds ) ) {
	$taxQuery[] = [
		'taxonomy' => 'post_tag',
		'field'    => 'term_id',
		'terms'    => $tagIds,
	];
}
if ( count( $taxQuery ) > 1 ) {
	$taxQuery['relation'] = 'AND';
}
if ( ! empty( $taxQuery ) ) {
	$queryArgs['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
}

$query      = new WP_Query( $queryArgs );
$totalSlides = (int) $query->post_count;

// --- Per-instance CSS variables. ---
$shadowValue = $cardShadow ? '0 8px 24px rgba(15, 23, 42, 0.1)' : 'none';
$cardBorder  = ( '' !== $cardBorderColor && $cardBorderWidth > 0 ) ? "{$cardBorderWidth}px solid {$cardBorderColor}" : 'none';

$titleClamp = $titleLines > 0 ? (string) $titleLines : 'none';

$css  = "#$id.bb-pc{";
$css .= "--bb-pc-gap:{$slideGap}px;";
$css .= "--bb-pc-arrow-color:$arrowColor;";
$css .= "--bb-pc-arrow-bg:$arrowBgColor;";
$css .= "--bb-pc-arrow-radius:{$arrowBorderRadius}%;";
$css .= "--bb-pc-dot-color:$dotColor;";
$css .= "--bb-pc-dot-inactive:$dotInactiveColor;";
$css .= "--bb-pc-card-bg:$cardBg;";
$css .= "--bb-pc-card-radius:{$cardBorderRadius}px;";
$css .= "--bb-pc-card-border:$cardBorder;";
$css .= "--bb-pc-card-shadow:$shadowValue;";
$css .= "--bb-pc-img-radius:{$imageBorderRadius}px;";
$css .= "--bb-pc-aspect:$imageAspectRatio;";
$css .= "--bb-pc-title-color:$titleColor;";
$css .= "--bb-pc-title-size:{$titleSizeM}px;";
$css .= "--bb-pc-title-clamp:$titleClamp;";
$css .= "--bb-pc-excerpt-color:$excerptColor;";
$css .= "--bb-pc-excerpt-size:{$excerptSize}px;";
$css .= "--bb-pc-meta-color:$metaColor;";
$css .= "--bb-pc-meta-size:{$metaSize}px;";
$css .= "--bb-pc-badge-bg:$categoryBadgeBg;";
$css .= "--bb-pc-badge-color:$categoryBadgeColor;";
$css .= "--bb-pc-readmore-bg:$readMoreBg;";
$css .= "--bb-pc-readmore-color:$readMoreColor;";
$css .= "--bb-pc-readmore-radius:{$readMoreBorderRadius}px;";
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-pc{--bb-pc-title-size:{$titleSizeT}px;}}";
$css .= "@media (min-width:1024px){#$id.bb-pc{--bb-pc-title-size:{$titleSizeD}px;}}";

// --- Carousel config passed to view.js. ---
$config = [
	'slidesPerView'        => [
		'desktop' => $slidesDesktop,
		'tablet'  => $slidesTablet,
		'mobile'  => $slidesMobile,
	],
	'spaceBetween'         => $slideGap,
	'loop'                 => $isLoop,
	'autoplay'             => $isAutoplay,
	'autoplayDelay'        => $autoplayDelay,
	'autoplayPauseOnHover' => $autoplayPauseOnHover,
	'speed'                => $transitionSpeed,
	'arrows'               => $isArrows,
	'dots'                 => $isDots,
];

$wrapperClasses = trim(
	$planClass
	. ' bb-pc'
	. ( $isArrows ? ' bb-pc--has-arrows' : '' )
	. ( $isDots ? ' bb-pc--has-dots' : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $query->have_posts() ) : ?>
		<section
			class='bb-pc-wrapper'
			aria-label='<?php echo esc_attr__( 'Post carousel', 'b-blocks' ); ?>'
			aria-roledescription='<?php echo esc_attr__( 'carousel', 'b-blocks' ); ?>'
			data-bb-pc-config='<?php echo esc_attr( wp_json_encode( $config ) ); ?>'
		>
			<div class='bb-pc-live' aria-live='polite' aria-atomic='true'></div>

			<div class='swiper bb-pc-swiper'>
				<div class='swiper-wrapper'>
					<?php
					$index = 0;
					while ( $query->have_posts() ) :
						$query->the_post();
						$index++;
						$postId    = get_the_ID();
						$permalink = get_permalink( $postId );
						$titleText = get_the_title( $postId );

						/* translators: 1: current slide number, 2: total slides. */
						$slideLabel = sprintf( __( 'Slide %1$d of %2$d', 'b-blocks' ), $index, $totalSlides );

						// Featured image.
						$imageUrl = '';
						$imageAlt = '';
						if ( $isFeaturedImage && has_post_thumbnail( $postId ) ) {
							$thumbUrl = get_the_post_thumbnail_url( $postId, 'large' );
							if ( $thumbUrl ) {
								$imageUrl = $thumbUrl;
								$thumbId  = get_post_thumbnail_id( $postId );
								if ( $thumbId ) {
									$metaAlt = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
									if ( is_string( $metaAlt ) ) {
										$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
									}
								}
								if ( '' === $imageAlt ) {
									$imageAlt = $titleText;
								}
							}
						}

						// Primary category.
						$categoryName = '';
						$categoryLink = '';
						if ( $isCategory && 'post' === $postType ) {
							$terms = get_the_terms( $postId, 'category' );
							if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
								$firstTerm    = $terms[0];
								$categoryName = $firstTerm->name;
								$termLink     = get_term_link( $firstTerm );
								if ( ! is_wp_error( $termLink ) ) {
									$categoryLink = $termLink;
								}
							}
						}

						// Excerpt.
						$excerptText = '';
						if ( $isExcerpt ) {
							$rawExcerpt  = get_the_excerpt( $postId );
							$excerptText = wp_trim_words( $rawExcerpt, $excerptLength, '&hellip;' );
						}
						?>
						<div
							class='swiper-slide bb-pc-slide'
							role='group'
							aria-roledescription='<?php echo esc_attr__( 'slide', 'b-blocks' ); ?>'
							aria-label='<?php echo esc_attr( $slideLabel ); ?>'
						>
							<article class='bb-pc-card'>
								<?php if ( '' !== $imageUrl ) : ?>
									<a class='bb-pc-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
										<img class='bb-pc-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
									</a>
								<?php endif; ?>

								<div class='bb-pc-card-body'>
									<?php if ( $isCategory && '' !== $categoryName ) : ?>
										<div class='bb-pc-badges'>
											<?php
											$badgeLabel = sprintf(
												/* translators: %s: category name. */
												__( 'Category: %s', 'b-blocks' ),
												$categoryName
											);
											if ( '' !== $categoryLink ) :
												?>
												<a class='bb-pc-badge' href='<?php echo esc_url( $categoryLink ); ?>' aria-label='<?php echo esc_attr( $badgeLabel ); ?>'>
													<?php echo esc_html( $categoryName ); ?>
												</a>
											<?php else : ?>
												<span class='bb-pc-badge' aria-label='<?php echo esc_attr( $badgeLabel ); ?>'>
													<?php echo esc_html( $categoryName ); ?>
												</span>
											<?php endif; ?>
										</div>
									<?php endif; ?>

									<?php if ( $isTitle && '' !== $titleText ) : ?>
										<<?php echo esc_attr( $titleTag ); ?> class='bb-pc-title'>
											<a class='bb-pc-title-link' href='<?php echo esc_url( $permalink ); ?>'>
												<?php echo esc_html( $titleText ); ?>
											</a>
										</<?php echo esc_attr( $titleTag ); ?>>
									<?php endif; ?>

									<?php if ( $isMeta ) : ?>
										<div class='bb-pc-meta'>
											<span class='bb-pc-meta-author'>
												<span class='screen-reader-text'><?php echo esc_html__( 'Author:', 'b-blocks' ); ?> </span>
												<?php echo esc_html( get_the_author_meta( 'display_name', get_post_field( 'post_author', $postId ) ) ); ?>
											</span>
											<span class='bb-pc-meta-sep' aria-hidden='true'>&middot;</span>
											<time class='bb-pc-meta-date' datetime='<?php echo esc_attr( get_the_date( 'c', $postId ) ); ?>'>
												<?php echo esc_html( get_the_date( '', $postId ) ); ?>
											</time>
										</div>
									<?php endif; ?>

									<?php if ( $isExcerpt && '' !== $excerptText ) : ?>
										<p class='bb-pc-excerpt'><?php echo wp_kses_post( $excerptText ); ?></p>
									<?php endif; ?>

									<?php if ( $isReadMore ) : ?>
										<a class='bb-pc-readmore' href='<?php echo esc_url( $permalink ); ?>'>
											<?php echo esc_html( $readMoreLabel ); ?>
											<span class='screen-reader-text'> &mdash; <?php echo esc_html( $titleText ); ?></span>
										</a>
									<?php endif; ?>
								</div>
							</article>
						</div>
						<?php
					endwhile;
					wp_reset_postdata();
					?>
				</div>
			</div>

			<?php if ( $isDots ) : ?>
				<div class='swiper-pagination bb-pc-pagination'></div>
			<?php endif; ?>

			<?php if ( $isArrows ) : ?>
				<button type='button' class='bb-pc-arrow bb-pc-arrow-prev' aria-label='<?php echo esc_attr__( 'Previous post', 'b-blocks' ); ?>'>
					<svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'><path d='M15 18l-6-6 6-6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>
				</button>
				<button type='button' class='bb-pc-arrow bb-pc-arrow-next' aria-label='<?php echo esc_attr__( 'Next post', 'b-blocks' ); ?>'>
					<svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'><path d='M9 6l6 6-6 6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>
				</button>
			<?php endif; ?>
		</section>
	<?php else : ?>
		<p class='bb-pc-empty'><?php echo esc_html( $noPostsMessage ); ?></p>
	<?php endif; ?>
</div>
