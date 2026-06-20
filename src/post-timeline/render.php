<?php
/**
 * Post Timeline block server-side render.
 *
 * Runs a sanitized `WP_Query` and renders each post as an `<article>` row on a
 * vertical timeline spine. The outer list is a `role="list"` with each row a
 * `role="listitem"` so screen readers announce list semantics. The spine line
 * and connector dots are decorative (`aria-hidden`). Per-instance CSS custom
 * properties are emitted inline, scoped under a `wp_unique_id()` wrapper id, so
 * multiple timelines on one page never collide.
 *
 * All helpers are inlined as static closures to avoid the "Cannot redeclare
 * function" fatal Gutenberg can trigger by including this file more than once
 * per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksPostTimeline';
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
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
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

// --- Resolve attributes. ---
$postCount = $clampInt( $attributes['postCount'] ?? 6, 1, 20, 6 );

$postTypeRaw = isset( $attributes['postType'] ) ? sanitize_key( (string) $attributes['postType'] ) : 'post';
$postType    = post_type_exists( $postTypeRaw ) ? $postTypeRaw : 'post';

$categoryIds = array_values( array_filter( array_map( 'absint', (array) ( $attributes['categoryIds'] ?? [] ) ) ) );
$tagIds      = array_values( array_filter( array_map( 'absint', (array) ( $attributes['tagIds'] ?? [] ) ) ) );

$orderBy = $pickFrom( $attributes['orderBy'] ?? 'date', [ 'date', 'modified', 'title', 'rand' ], 'date' );
$order   = $pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'DESC' ) ), [ 'DESC', 'ASC' ], 'DESC' );

$showFeaturedImage = isset( $attributes['showFeaturedImage'] ) ? (bool) $attributes['showFeaturedImage'] : true;
$showExcerpt       = isset( $attributes['showExcerpt'] ) ? (bool) $attributes['showExcerpt'] : true;
$excerptLength     = $clampInt( $attributes['excerptLength'] ?? 20, 10, 60, 20 );
$showDate          = isset( $attributes['showDate'] ) ? (bool) $attributes['showDate'] : true;
$dateFormat        = $pickFrom( $attributes['dateFormat'] ?? 'M j, Y', [ 'M j, Y', 'F j, Y', 'm/d/Y', 'Y-m-d' ], 'M j, Y' );
$showCategory      = isset( $attributes['showCategory'] ) ? (bool) $attributes['showCategory'] : true;
$showAuthor        = isset( $attributes['showAuthor'] ) ? (bool) $attributes['showAuthor'] : false;
$showReadMore      = isset( $attributes['showReadMore'] ) ? (bool) $attributes['showReadMore'] : true;
$readMoreLabel     = isset( $attributes['readMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['readMoreLabel'] ) : '';
$readMoreLabel     = '' !== trim( $readMoreLabel ) ? $readMoreLabel : __( 'Read More', 'b-blocks' );

$imageSize        = $pickFrom( $attributes['imageSize'] ?? 'medium', [ 'thumbnail', 'medium', 'large', 'full' ], 'medium' );
$imageAspectRatio = $pickFrom( $attributes['imageAspectRatio'] ?? '16/9', [ '16/9', '4/3', '1/1', '3/4' ], '16/9' );

$layout = $pickFrom( $attributes['layout'] ?? 'alternating', [ 'alternating', 'left', 'right' ], 'alternating' );

$lineColor = $sanitizeColor( $attributes['lineColor'] ?? '', '#e2e8f0' );
$lineWidth = $clampInt( $attributes['lineWidth'] ?? 2, 1, 8, 2 );
$dotSize   = $clampInt( $attributes['dotSize'] ?? 14, 8, 32, 14 );
$dotColor  = $sanitizeColor( $attributes['dotColor'] ?? '', '#6366f1' );

$dateBadgeBg    = $sanitizeColor( $attributes['dateBadgeBg'] ?? '', '#6366f1' );
$dateBadgeColor = $sanitizeColor( $attributes['dateBadgeColor'] ?? '', '#ffffff' );

$cardBg           = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$cardBorderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 8, 0, 32, 8 );
$cardPadding      = $clampInt( $attributes['cardPadding'] ?? 20, 8, 64, 20 );
$cardShadow       = isset( $attributes['cardShadow'] ) ? (bool) $attributes['cardShadow'] : true;

$titleColor  = $sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' );
$titleSize   = $clampInt( $attributes['titleSize'] ?? 20, 12, 40, 20 );
$titleWeight = preg_replace( '/[^0-9]/', '', (string) ( $attributes['titleWeight'] ?? '600' ) );
$titleWeight = '' !== $titleWeight ? $titleWeight : '600';

$metaColor   = $sanitizeColor( $attributes['metaColor'] ?? '', 'inherit' );
$metaSize    = $clampInt( $attributes['metaSize'] ?? 13, 10, 20, 13 );
$excerptColor = $sanitizeColor( $attributes['excerptColor'] ?? '', 'inherit' );
$excerptSize  = $clampInt( $attributes['excerptSize'] ?? 15, 12, 20, 15 );

$maxWidth      = $clampInt( $attributes['maxWidth'] ?? 900, 400, 1400, 900 );
$noPostsMessage = isset( $attributes['noPostsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noPostsMessage'] ) : '';
$noPostsMessage = '' !== trim( $noPostsMessage ) ? $noPostsMessage : __( 'No posts found.', 'b-blocks' );

// --- Build the query. ---
$queryArgs = [
	'post_type'           => $postType,
	'posts_per_page'      => $postCount,
	'post_status'         => 'publish',
	'orderby'             => $orderBy,
	'order'               => $order,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
];

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

$query = new WP_Query( $queryArgs );

// --- Per-instance CSS variables. ---
$shadowValue = $cardShadow ? '0 4px 16px rgba(15, 23, 42, 0.08)' : 'none';

$css  = "#$id.bb-pt{";
$css .= "--bb-pt-max-width:{$maxWidth}px;";
$css .= "--bb-pt-line-color:$lineColor;";
$css .= "--bb-pt-line-width:{$lineWidth}px;";
$css .= "--bb-pt-dot-size:{$dotSize}px;";
$css .= "--bb-pt-dot-color:$dotColor;";
$css .= "--bb-pt-badge-bg:$dateBadgeBg;";
$css .= "--bb-pt-badge-color:$dateBadgeColor;";
$css .= "--bb-pt-card-bg:$cardBg;";
$css .= "--bb-pt-card-radius:{$cardBorderRadius}px;";
$css .= "--bb-pt-card-padding:{$cardPadding}px;";
$css .= "--bb-pt-card-shadow:$shadowValue;";
$css .= "--bb-pt-title-color:$titleColor;";
$css .= "--bb-pt-title-size:{$titleSize}px;";
$css .= "--bb-pt-title-weight:$titleWeight;";
$css .= "--bb-pt-meta-color:$metaColor;";
$css .= "--bb-pt-meta-size:{$metaSize}px;";
$css .= "--bb-pt-excerpt-color:$excerptColor;";
$css .= "--bb-pt-excerpt-size:{$excerptSize}px;";
$css .= "--bb-pt-aspect:$imageAspectRatio;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-pt'
	. ' bb-pt--layout-' . $layout
	. ( $cardShadow ? ' bb-pt--shadow' : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-pt-init='1'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $query->have_posts() ) : ?>
		<div class='bb-pt-list' role='list' aria-label='<?php echo esc_attr__( 'Post timeline', 'b-blocks' ); ?>'>
			<span class='bb-pt-spine' aria-hidden='true'></span>

			<?php
			$index = 0;
			while ( $query->have_posts() ) :
				$query->the_post();
				$postId   = get_the_ID();
				$sideClass = 'alternating' === $layout
					? ( 0 === $index % 2 ? 'bb-pt-item--left' : 'bb-pt-item--right' )
					: '';
				$index++;

				$permalink = get_permalink( $postId );
				$titleText = get_the_title( $postId );

				// Featured image.
				$imageUrl = '';
				$imageAlt = '';
				if ( $showFeaturedImage && has_post_thumbnail( $postId ) ) {
					$thumbUrl = get_the_post_thumbnail_url( $postId, $imageSize );
					if ( $thumbUrl ) {
						$imageUrl = $thumbUrl;
						$thumbId  = get_post_thumbnail_id( $postId );
						if ( $thumbId ) {
							$metaAlt = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
							if ( is_string( $metaAlt ) ) {
								$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
							}
						}
					}
				}

				// Primary category.
				$categoryName = '';
				$categoryLink = '';
				if ( $showCategory ) {
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
				if ( $showExcerpt ) {
					$rawExcerpt  = get_the_excerpt( $postId );
					$excerptText = wp_trim_words( $rawExcerpt, $excerptLength, '&hellip;' );
				}
				?>
				<div class='bb-pt-item <?php echo esc_attr( $sideClass ); ?>' role='listitem'>
					<span class='bb-pt-dot' aria-hidden='true'></span>

					<?php if ( $showDate ) : ?>
						<div class='bb-pt-badge'>
							<time class='bb-pt-badge-time' datetime='<?php echo esc_attr( get_the_date( 'Y-m-d', $postId ) ); ?>'>
								<?php echo esc_html( get_the_date( $dateFormat, $postId ) ); ?>
							</time>
						</div>
					<?php endif; ?>

					<article class='bb-pt-card'>
						<?php if ( '' !== $imageUrl ) : ?>
							<a class='bb-pt-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
								<img class='bb-pt-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
							</a>
						<?php endif; ?>

						<div class='bb-pt-card-body'>
							<h3 class='bb-pt-title'>
								<a class='bb-pt-title-link' href='<?php echo esc_url( $permalink ); ?>'>
									<?php echo esc_html( $titleText ); ?>
								</a>
							</h3>

							<?php if ( ( $showCategory && '' !== $categoryName ) || $showAuthor ) : ?>
								<div class='bb-pt-meta'>
									<?php if ( $showCategory && '' !== $categoryName ) : ?>
										<span class='bb-pt-meta-item bb-pt-meta-category'>
											<span class='screen-reader-text'><?php echo esc_html__( 'Category:', 'b-blocks' ); ?> </span>
											<?php if ( '' !== $categoryLink ) : ?>
												<a href='<?php echo esc_url( $categoryLink ); ?>'><?php echo esc_html( $categoryName ); ?></a>
											<?php else : ?>
												<?php echo esc_html( $categoryName ); ?>
											<?php endif; ?>
										</span>
									<?php endif; ?>

									<?php if ( $showAuthor ) : ?>
										<span class='bb-pt-meta-item bb-pt-meta-author'>
											<span class='screen-reader-text'><?php echo esc_html__( 'Author:', 'b-blocks' ); ?> </span>
											<?php echo esc_html( get_the_author_meta( 'display_name', get_post_field( 'post_author', $postId ) ) ); ?>
										</span>
									<?php endif; ?>
								</div>
							<?php endif; ?>

							<?php if ( $showExcerpt && '' !== $excerptText ) : ?>
								<p class='bb-pt-excerpt'><?php echo wp_kses_post( $excerptText ); ?></p>
							<?php endif; ?>

							<?php if ( $showReadMore ) : ?>
								<a class='bb-pt-readmore' href='<?php echo esc_url( $permalink ); ?>'>
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
	<?php else : ?>
		<p class='bb-pt-empty'><?php echo esc_html( $noPostsMessage ); ?></p>
	<?php endif; ?>
</div>
