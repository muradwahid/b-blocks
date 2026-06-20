<?php
/**
 * Review Box block server-side render.
 *
 * Outputs a structured product/service review with optional product image,
 * scored criteria table, overall rating (computed or manual), pros/cons
 * lists, summary text, affiliate-friendly CTA button, and optional
 * JSON-LD Review schema markup for Google rich results.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures
 * or short scalar expressions, mirroring the progress-bar pattern.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksReviewBox';
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

// --- Sanitize a length-style value (e.g. "8px", "24px", "1rem", "5%") --
$sanitizeLength = static function ( $value, $fallback = '0px' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(\.\d+)?(px|em|rem|%|vh|vw)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- SVG star (inline; no external dependency) -------------------------
$renderStar = static function ( $fillPct, $color, $size = 18 ) {
	$fillPct  = max( 0, min( 100, (float) $fillPct ) );
	$starId   = 'bb-rb-star-' . wp_unique_id();
	$safeSize = (int) $size;
	$safeCol  = $color;
	ob_start();
	?>
	<span class='bb-review-stars__star' aria-hidden='true' style='--bb-star-size:<?php echo esc_attr( $safeSize ); ?>px;'>
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='<?php echo esc_attr( $safeSize ); ?>' height='<?php echo esc_attr( $safeSize ); ?>' focusable='false' aria-hidden='true'>
			<defs>
				<linearGradient id='<?php echo esc_attr( $starId ); ?>' x1='0' x2='1' y1='0' y2='0'>
					<stop offset='<?php echo esc_attr( $fillPct ); ?>%' stop-color='<?php echo esc_attr( $safeCol ); ?>' />
					<stop offset='<?php echo esc_attr( $fillPct ); ?>%' stop-color='#d8d8d8' />
				</linearGradient>
			</defs>
			<path fill='url(#<?php echo esc_attr( $starId ); ?>)' stroke='#bfbfbf' stroke-width='0.5' d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z' />
		</svg>
	</span>
	<?php
	return ob_get_clean();
};

// --- Resolve and sanitize attributes -----------------------------------
$productName         = isset( $attributes['productName'] ) ? sanitize_text_field( (string) $attributes['productName'] ) : '';
$reviewAuthor        = isset( $attributes['reviewAuthor'] ) ? sanitize_text_field( (string) $attributes['reviewAuthor'] ) : '';
$reviewDate          = isset( $attributes['reviewDate'] ) ? (string) $attributes['reviewDate'] : '';
// Validate ISO 8601 date (YYYY-MM-DD) to prevent unexpected characters in schema.
$reviewDate          = preg_match( '/^\d{4}-\d{2}-\d{2}$/', $reviewDate ) ? $reviewDate : '';
$reviewSummary       = isset( $attributes['reviewSummary'] ) ? (string) $attributes['reviewSummary'] : '';
$ratingMode          = isset( $attributes['ratingMode'] ) ? (string) $attributes['ratingMode'] : 'auto';
$ratingMode          = in_array( $ratingMode, [ 'auto', 'manual' ], true ) ? $ratingMode : 'auto';
$manualRating        = isset( $attributes['overallRating'] ) ? (float) $attributes['overallRating'] : 0;
$maxRating           = isset( $attributes['maxRating'] ) ? (int) $attributes['maxRating'] : 5;
$maxRating           = max( 1, min( 10, $maxRating ) );
$criteria            = ( isset( $attributes['criteria'] ) && is_array( $attributes['criteria'] ) ) ? $attributes['criteria'] : [];
$pros                = ( isset( $attributes['pros'] ) && is_array( $attributes['pros'] ) ) ? $attributes['pros'] : [];
$cons                = ( isset( $attributes['cons'] ) && is_array( $attributes['cons'] ) ) ? $attributes['cons'] : [];
$ctaLabel            = isset( $attributes['ctaLabel'] ) ? (string) $attributes['ctaLabel'] : '';
$ctaUrl              = isset( $attributes['ctaUrl'] ) ? (string) $attributes['ctaUrl'] : '';
$ctaNewTab           = ! empty( $attributes['ctaNewTab'] );
$ctaNofollow         = ! empty( $attributes['ctaNofollow'] );
$showSchema          = ! empty( $attributes['showSchema'] );
$showProsConsColumns = ! empty( $attributes['showProsConsColumns'] );
$showCriteria        = ! empty( $attributes['showCriteria'] );

$productImage = isset( $attributes['productImage'] ) && is_array( $attributes['productImage'] ) ? $attributes['productImage'] : [];
$productImageUrl = isset( $productImage['url'] ) ? esc_url_raw( (string) $productImage['url'] ) : '';
$productImageAlt = isset( $productImage['alt'] ) ? (string) $productImage['alt'] : '';

$styles           = isset( $attributes['styles'] ) && is_array( $attributes['styles'] ) ? $attributes['styles'] : [];
$bgColor          = $sanitizeColor( $styles['backgroundColor'] ?? '', '' );
$accentColor      = $sanitizeColor( $styles['accentColor'] ?? '', '#2271b1' );
$textColor        = $sanitizeColor( $styles['textColor'] ?? '', '' );
$ratingColor      = $sanitizeColor( $styles['ratingColor'] ?? '', '#f5a623' );
$borderRadius     = $sanitizeLength( $styles['borderRadius'] ?? '', '8px' );
$padding          = $sanitizeLength( $styles['padding'] ?? '', '24px' );

// --- Compute overall rating --------------------------------------------
$overallRating = 0.0;
if ( 'manual' === $ratingMode ) {
	$overallRating = max( 0.0, min( (float) $maxRating, (float) $manualRating ) );
} else {
	$scoreSum   = 0;
	$scoreCount = 0;
	foreach ( $criteria as $criterion ) {
		if ( isset( $criterion['score'] ) ) {
			$scoreSum += max( 0, min( $maxRating, (int) $criterion['score'] ) );
			$scoreCount++;
		}
	}
	$overallRating = $scoreCount > 0 ? round( $scoreSum / $scoreCount, 1 ) : 0.0;
}
$overallRating = round( (float) $overallRating, 1 );

$overallPct      = $maxRating > 0 ? ( $overallRating / $maxRating ) * 100 : 0;
$ratingAriaLabel = sprintf(
	/* translators: 1: rating value, 2: maximum rating */
	__( '%1$s out of %2$s stars', 'b-blocks' ),
	number_format_i18n( $overallRating, 1 ),
	number_format_i18n( $maxRating )
);

// --- Wrapper classes & inline styles -----------------------------------
$wrapperClasses = $planClass;
if ( $showProsConsColumns ) {
	$wrapperClasses .= ' rb-cols';
}

$wrapperStyleParts = [];
if ( '' !== $bgColor ) {
	$wrapperStyleParts[] = 'background-color:' . $bgColor;
}
if ( '' !== $textColor ) {
	$wrapperStyleParts[] = 'color:' . $textColor;
}
$wrapperStyleParts[] = 'border-radius:' . $borderRadius;
$wrapperStyleParts[] = 'padding:' . $padding;
$wrapperStyleParts[] = '--bb-rb-accent:' . $accentColor;
$wrapperStyleParts[] = '--bb-rb-rating:' . $ratingColor;
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

// --- CTA rel attribute --------------------------------------------------
$relParts = [];
if ( $ctaNofollow ) {
	$relParts[] = 'nofollow';
}
if ( $ctaNewTab ) {
	$relParts[] = 'noopener';
	$relParts[] = 'noreferrer';
}
$relAttr = implode( ' ', array_unique( $relParts ) );

// --- Render row of stars (for the overall rating display) --------------
$renderStarRow = static function ( $value, $max, $color, $size = 18 ) use ( $renderStar ) {
	$value = max( 0.0, min( (float) $max, (float) $value ) );
	$html  = '';
	for ( $i = 1; $i <= $max; $i++ ) {
		$delta = $value - ( $i - 1 );
		$pct   = max( 0, min( 1, $delta ) ) * 100;
		$html .= $renderStar( $pct, $color, $size );
	}
	return $html;
};
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<div class='<?php echo esc_attr( $prefix ); ?>'>
		<header class='bb-review-box__header'>
			<?php if ( '' !== $productImageUrl ) : ?>
				<div class='bb-review-box__media'>
					<img
						src='<?php echo esc_url( $productImageUrl ); ?>'
						alt='<?php echo esc_attr( $productImageAlt ); ?>'
						loading='lazy'
						decoding='async'
					/>
				</div>
			<?php endif; ?>

			<div class='bb-review-box__heading'>
				<?php if ( '' !== trim( $productName ) ) : ?>
					<h3 class='bb-review-box__title'><?php echo esc_html( $productName ); ?></h3>
				<?php endif; ?>

				<div class='bb-review-box__overall'>
					<div
						class='bb-review-stars'
						role='img'
						aria-label='<?php echo esc_attr( $ratingAriaLabel ); ?>'
						data-rating='<?php echo esc_attr( (string) $overallRating ); ?>'
						data-max='<?php echo esc_attr( (string) $maxRating ); ?>'
					>
						<?php echo $renderStarRow( $overallRating, $maxRating, $ratingColor, 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderStar ?>
					</div>
					<span class='bb-review-box__score' aria-hidden='true'>
						<?php echo esc_html( number_format_i18n( $overallRating, 1 ) . '/' . number_format_i18n( $maxRating ) ); ?>
					</span>
				</div>
			</div>
		</header>

		<?php if ( $showCriteria && ! empty( $criteria ) ) : ?>
			<table class='bb-review-box__criteria' aria-label='<?php echo esc_attr__( 'Review criteria', 'b-blocks' ); ?>'>
				<tbody>
					<?php foreach ( $criteria as $criterion ) :
						$label = isset( $criterion['label'] ) ? (string) $criterion['label'] : '';
						$score = isset( $criterion['score'] ) ? max( 0, min( $maxRating, (int) $criterion['score'] ) ) : 0;
						$rowAria = sprintf(
							/* translators: 1: criterion score, 2: maximum rating */
							__( '%1$s out of %2$s', 'b-blocks' ),
							number_format_i18n( $score ),
							number_format_i18n( $maxRating )
						);
						?>
						<tr>
							<th scope='row'><?php echo esc_html( $label ); ?></th>
							<td>
								<div class='bb-review-stars bb-review-stars--row' role='img' aria-label='<?php echo esc_attr( $rowAria ); ?>'>
									<?php echo $renderStarRow( $score, $maxRating, $ratingColor, 14 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- internally escaped ?>
								</div>
							</td>
							<td class='bb-review-box__criteria-score' aria-hidden='true'>
								<?php echo esc_html( number_format_i18n( $score ) . '/' . number_format_i18n( $maxRating ) ); ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>

		<?php if ( '' !== trim( $reviewSummary ) ) : ?>
			<p class='bb-review-box__summary'><?php echo wp_kses_post( $reviewSummary ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $pros ) || ! empty( $cons ) ) : ?>
			<div class='bb-review-box__proscons<?php echo esc_attr( $showProsConsColumns ? ' bb-review-box__proscons--cols' : '' ); ?>'>
				<?php if ( ! empty( $pros ) ) : ?>
					<div class='bb-review-box__pros'>
						<strong class='bb-review-box__proscons-title'><?php esc_html_e( 'Pros', 'b-blocks' ); ?></strong>
						<ul role='list'>
							<?php foreach ( $pros as $pro ) :
								$pro = (string) $pro;
								if ( '' === trim( $pro ) ) {
									continue;
								}
								?>
								<li>
									<svg class='bb-review-box__icon bb-review-box__icon--pro' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
										<path fill='currentColor' d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
									</svg>
									<span><?php echo esc_html( $pro ); ?></span>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $cons ) ) : ?>
					<div class='bb-review-box__cons'>
						<strong class='bb-review-box__proscons-title'><?php esc_html_e( 'Cons', 'b-blocks' ); ?></strong>
						<ul role='list'>
							<?php foreach ( $cons as $con ) :
								$con = (string) $con;
								if ( '' === trim( $con ) ) {
									continue;
								}
								?>
								<li>
									<svg class='bb-review-box__icon bb-review-box__icon--con' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
										<path fill='currentColor' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
									</svg>
									<span><?php echo esc_html( $con ); ?></span>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( '' !== trim( $ctaLabel ) && '' !== trim( $ctaUrl ) ) : ?>
			<div class='bb-review-box__cta'>
				<a
					class='bb-review-box__btn'
					href='<?php echo esc_url( $ctaUrl ); ?>'
					<?php if ( $ctaNewTab ) : ?>target='_blank'<?php endif; ?>
					<?php if ( '' !== $relAttr ) : ?>rel='<?php echo esc_attr( $relAttr ); ?>'<?php endif; ?>
				>
					<?php echo esc_html( $ctaLabel ); ?>
					<?php if ( $ctaNewTab ) : ?>
						<span class='screen-reader-text'> <?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
	</div>

	<?php
	// ---------------------------------------------------------------
	// JSON-LD Review schema output. Only emit when showSchema is true.
	// Build a clean array, then encode with wp_json_encode() — we
	// never echo raw attributes inside the <script> tag.
	// ---------------------------------------------------------------
	if ( $showSchema && '' !== trim( $productName ) ) :
		$schema = [
			'@context'      => 'https://schema.org',
			'@type'         => 'Review',
			'name'          => $productName . ' Review',
			'reviewRating'  => [
				'@type'       => 'Rating',
				'ratingValue' => (string) $overallRating,
				'bestRating'  => (string) $maxRating,
				'worstRating' => '1',
			],
			'itemReviewed'  => [
				'@type' => 'Product',
				'name'  => $productName,
			],
		];

		if ( '' !== trim( $reviewAuthor ) ) {
			$schema['author'] = [
				'@type' => 'Person',
				'name'  => $reviewAuthor,
			];
		}

		if ( '' !== trim( $reviewDate ) ) {
			$schema['datePublished'] = $reviewDate;
		}

		if ( '' !== trim( $reviewSummary ) ) {
			$schema['reviewBody'] = wp_strip_all_tags( $reviewSummary );
		}

		if ( '' !== $productImageUrl ) {
			$schema['itemReviewed']['image'] = $productImageUrl;
		}

		// JSON_HEX_TAG encodes < and > as Unicode escapes (< / >),
		// preventing a malicious product name containing "</script>" from
		// breaking out of the <script type="application/ld+json"> block.
		// JSON_UNESCAPED_SLASHES is intentionally omitted for the same reason.
		$jsonLd = wp_json_encode( $schema, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE );

		if ( false !== $jsonLd ) :
			?>
			<script type='application/ld+json'><?php echo $jsonLd; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output is safe within a JSON-LD script tag ?></script>
			<?php
		endif;
	endif;
	?>
</div>
