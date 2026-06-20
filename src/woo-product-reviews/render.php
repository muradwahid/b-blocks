<?php
/**
 * Woo Product Reviews block server-side render.
 *
 * Renders a chosen WooCommerce product's average-rating summary and a list of
 * its approved customer reviews. This block is strictly READ-ONLY: it pulls
 * data with wc_get_product(), get_comments() (comment_type=review,
 * status=approve) and get_comment_meta() — there is NO submission form, NO
 * AJAX, NO nonce and NO custom endpoint. Per-instance CSS custom properties are
 * emitted inline, scoped under a wp_unique_id() wrapper id, so multiple
 * instances never collide. Every dynamic value is escaped on output.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooProductReviews;

if ( ! class_exists( WooProductReviews::class ) ) {
	return;
}

$id = wp_unique_id( 'bb-wpr-' );
$a  = WooProductReviews::resolveAttributes( $attributes );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wpr' ] ); ?>
	>
		<p class='bb-wpr-empty' role='alert'>
			<?php echo esc_html__( 'WooCommerce is required to display product reviews.', 'b-blocks' ); ?>
		</p>
	</div>
	<?php
	return;
}

$product = $a['productId'] > 0 ? wc_get_product( $a['productId'] ) : false;

// No valid, published, visible product selected.
$isValid = $product
	&& is_a( $product, 'WC_Product' )
	&& 'publish' === $product->get_status()
	&& $product->is_visible();

if ( ! $isValid ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wpr' ] ); ?>
	>
		<p class='bb-wpr-empty' role='status'>
			<?php echo esc_html( $a['noProductMessage'] ); ?>
		</p>
	</div>
	<?php
	return;
}

$productId    = $product->get_id();
$productName  = $product->get_name();
$averageRaw   = (float) $product->get_average_rating();
$average      = number_format_i18n( $averageRaw, 1 );
$reviewTotal  = (int) $product->get_review_count();

// Resolve sort order into get_comments() args. Only approved reviews.
$query = [
	'post_id'      => $productId,
	'comment_type' => 'review',
	'status'       => 'approve',
	'number'       => $a['reviewCount'],
];

if ( 'highest_rating' === $a['orderBy'] ) {
	$query['meta_key'] = 'rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- bounded by 'number'.
	$query['orderby']  = 'meta_value_num';
	$query['order']    = 'DESC';
} elseif ( 'lowest_rating' === $a['orderBy'] ) {
	$query['meta_key'] = 'rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- bounded by 'number'.
	$query['orderby']  = 'meta_value_num';
	$query['order']    = 'ASC';
} else {
	$query['orderby'] = 'comment_date_gmt';
	$query['order']   = 'DESC';
}

$reviews = get_comments( $query );

// Block alignment (margin) when a max-width is set.
$blockMargin = '0';
if ( $a['maxWidth'] > 0 ) {
	if ( 'center' === $a['blockAlign'] ) {
		$blockMargin = '0 auto';
	} elseif ( 'right' === $a['blockAlign'] ) {
		$blockMargin = '0 0 0 auto';
	} else {
		$blockMargin = '0 auto 0 0';
	}
}

// Summary fill percentage for the fractional star display in the summary.
$summaryFill = max( 0, min( 100, ( $averageRaw / 5 ) * 100 ) );

// Per-instance CSS variables.
$css  = "#$id.bb-wpr{";
$css .= '--bb-wpr-max-width:' . ( $a['maxWidth'] > 0 ? $a['maxWidth'] . 'px' : 'none' ) . ';';
$css .= '--bb-wpr-block-margin:' . $blockMargin . ';';
$css .= '--bb-wpr-rating-color:' . $a['ratingColor'] . ';';
$css .= '--bb-wpr-rating-empty-color:' . $a['ratingEmptyColor'] . ';';
$css .= '--bb-wpr-summary-bg:' . $a['summaryBG'] . ';';
$css .= '--bb-wpr-summary-text:' . $a['summaryTextColor'] . ';';
$css .= '--bb-wpr-summary-accent:' . $a['summaryAccentColor'] . ';';
$css .= '--bb-wpr-summary-fill:' . round( $summaryFill, 2 ) . '%;';
$css .= '--bb-wpr-review-bg:' . $a['reviewBG'] . ';';
$css .= '--bb-wpr-review-text:' . $a['reviewTextColor'] . ';';
$css .= '--bb-wpr-review-name:' . $a['reviewNameColor'] . ';';
$css .= '--bb-wpr-review-meta:' . $a['reviewMetaColor'] . ';';
$css .= '--bb-wpr-card-border-width:' . $a['cardBorderWidth'] . 'px;';
$css .= '--bb-wpr-card-border-color:' . $a['cardBorderColor'] . ';';
$css .= '--bb-wpr-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-wpr-card-padding:' . $a['cardPadding'] . 'px;';
$css .= '--bb-wpr-card-gap:' . $a['cardGap'] . 'px;';
$css .= '--bb-wpr-verified-bg:' . $a['verifiedBadgeBG'] . ';';
$css .= '--bb-wpr-verified-color:' . $a['verifiedBadgeColor'] . ';';
$css .= '--bb-wpr-avatar-size:' . $a['avatarSize'] . 'px;';
$css .= '--bb-wpr-name-size:' . $a['nameSizeMobile'] . 'px;';
$css .= '--bb-wpr-body-size:' . $a['bodySizeMobile'] . 'px;';
$css .= '--bb-wpr-meta-size:' . $a['metaSizeMobile'] . 'px;';
$css .= '--bb-wpr-summary-size:' . $a['summarySizeMobile'] . 'px;';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wpr{";
$css .= '--bb-wpr-name-size:' . $a['nameSizeTablet'] . 'px;';
$css .= '--bb-wpr-body-size:' . $a['bodySizeTablet'] . 'px;';
$css .= '--bb-wpr-meta-size:' . $a['metaSizeTablet'] . 'px;';
$css .= '--bb-wpr-summary-size:' . $a['summarySizeTablet'] . 'px;';
$css .= '}}';
$css .= "@media (min-width:1024px){#$id.bb-wpr{";
$css .= '--bb-wpr-name-size:' . $a['nameSizeDesktop'] . 'px;';
$css .= '--bb-wpr-body-size:' . $a['bodySizeDesktop'] . 'px;';
$css .= '--bb-wpr-meta-size:' . $a['metaSizeDesktop'] . 'px;';
$css .= '--bb-wpr-summary-size:' . $a['summarySizeDesktop'] . 'px;';
$css .= '}}';

/**
 * Output a whole-integer star row, marked up for accessibility.
 *
 * @param int $rating Rating 0-5.
 */
$render_stars = static function ( $rating ) {
	$out = '';
	for ( $i = 1; $i <= 5; $i++ ) {
		$cls = 'bb-wpr-star' . ( $rating >= $i ? ' is-full' : '' );
		$out .= '<span class="' . esc_attr( $cls ) . '" aria-hidden="true">★</span>';
	}
	return $out;
};

$sectionLabel = sprintf(
	/* translators: %s: product name. */
	__( 'Customer reviews for %s', 'b-blocks' ),
	esc_html( $productName )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wpr' ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<section class='bb-wpr-inner' aria-label='<?php echo esc_attr( $sectionLabel ); ?>'>
		<?php if ( $a['showSummary'] ) : ?>
			<?php
			$summaryStarLabel = sprintf(
				/* translators: %s: average rating value out of 5. */
				__( 'Average rating: %s out of 5 stars', 'b-blocks' ),
				$average
			);
			?>
			<div class='bb-wpr-summary'>
				<div class='bb-wpr-summary-score'>
					<span class='bb-wpr-summary-average' aria-hidden='true'><?php echo esc_html( $average ); ?></span>
					<span class='screen-reader-text'><?php echo esc_html( $summaryStarLabel ); ?></span>
					<span class='bb-wpr-summary-stars' aria-hidden='true' data-rating='<?php echo esc_attr( (string) round( $averageRaw, 2 ) ); ?>'>
						<span class='bb-wpr-summary-stars-empty'>★★★★★</span>
						<span class='bb-wpr-summary-stars-full' style='width:var(--bb-wpr-summary-fill);'>★★★★★</span>
					</span>
				</div>
				<p class='bb-wpr-summary-count'>
					<?php
					if ( $reviewTotal > 0 ) {
						echo esc_html(
							sprintf(
								/* translators: %s: number of reviews. */
								_n( 'Based on %s review', 'Based on %s reviews', $reviewTotal, 'b-blocks' ),
								number_format_i18n( $reviewTotal )
							)
						);
					} else {
						echo esc_html( $a['noReviewsMessage'] );
					}
					?>
				</p>
			</div>
		<?php endif; ?>

		<?php if ( empty( $reviews ) ) : ?>
			<?php if ( ! $a['showSummary'] ) : ?>
				<p class='bb-wpr-no-reviews' role='status'><?php echo esc_html( $a['noReviewsMessage'] ); ?></p>
			<?php endif; ?>
		<?php else : ?>
			<div class='bb-wpr-list'>
				<?php
				foreach ( $reviews as $review ) :
					$rating   = (int) get_comment_meta( $review->comment_ID, 'rating', true );
					$rating   = max( 0, min( 5, $rating ) );
					$verified = (bool) get_comment_meta( $review->comment_ID, 'verified', true );
					$author   = $review->comment_author;
					$dateGmt  = mysql2date( 'Y-m-d', $review->comment_date_gmt );
					$dateText = date_i18n( get_option( 'date_format' ), strtotime( $review->comment_date ) );

					$starLabel = sprintf(
						/* translators: %d: rating value out of 5. */
						__( 'Rating: %d out of 5 stars', 'b-blocks' ),
						$rating
					);
					?>
					<article class='bb-wpr-card'>
						<header class='bb-wpr-card-head'>
							<?php if ( $a['showAvatar'] ) : ?>
								<span class='bb-wpr-avatar'>
									<?php
									// get_avatar() returns safe, escaped <img> markup.
									echo get_avatar( $review, $a['avatarSize'], '', $author ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_avatar() output is safe.
									?>
								</span>
							<?php endif; ?>

							<div class='bb-wpr-card-meta'>
								<div class='bb-wpr-card-meta-top'>
									<strong class='bb-wpr-author'><?php echo esc_html( $author ); ?></strong>

									<?php if ( $a['showVerifiedBadge'] && $verified ) : ?>
										<span class='bb-wpr-verified' aria-label='<?php echo esc_attr__( 'Verified Owner', 'b-blocks' ); ?>'>
											<svg class='bb-wpr-verified-icon' viewBox='0 0 16 16' width='12' height='12' aria-hidden='true' focusable='false'>
												<path fill='currentColor' d='M6.4 11.2 3.6 8.4l1.1-1.1 1.7 1.7 4.2-4.2 1.1 1.1z' />
											</svg>
											<span class='bb-wpr-verified-text'><?php echo esc_html__( 'Verified Owner', 'b-blocks' ); ?></span>
										</span>
									<?php endif; ?>
								</div>

								<span class='bb-wpr-stars' role='img' aria-label='<?php echo esc_attr( $starLabel ); ?>'>
									<?php
									echo $render_stars( $rating ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- each star is escaped inside the closure.
									?>
								</span>

								<?php if ( $a['showDate'] ) : ?>
									<time class='bb-wpr-date' datetime='<?php echo esc_attr( $dateGmt ); ?>'><?php echo esc_html( $dateText ); ?></time>
								<?php endif; ?>
							</div>
						</header>

						<div class='bb-wpr-body'>
							<?php echo wp_kses_post( wpautop( get_comment_text( $review ) ) ); ?>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</section>
</div>
