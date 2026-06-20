<?php
/**
 * Testimonial Card block server-side render.
 *
 * Outputs a single semantic testimonial as a <figure> containing a
 * <blockquote> with the review body and a <figcaption> holding the
 * reviewer attribution (avatar, name, role, company) and a star rating.
 *
 * All per-instance styling is delivered via CSS custom properties on the
 * wrapper so theme styles inherit when an override is unset.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. Helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksTestimonialCard';
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

// --- Single inline SVG star (no external dependency) -------------------
$renderStar = static function ( $filled ) {
	$cls = $filled ? 'bb-tc-star bb-tc-star--on' : 'bb-tc-star bb-tc-star--off';
	ob_start();
	?>
	<svg class='<?php echo esc_attr( $cls ); ?>' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
		<path d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z' />
	</svg>
	<?php
	return ob_get_clean();
};

// --- Resolve and sanitize attributes -----------------------------------
$reviewText      = isset( $attributes['reviewText'] ) ? (string) $attributes['reviewText'] : '';
$reviewerName    = isset( $attributes['reviewerName'] ) ? sanitize_text_field( (string) $attributes['reviewerName'] ) : '';
$reviewerRole    = isset( $attributes['reviewerRole'] ) ? sanitize_text_field( (string) $attributes['reviewerRole'] ) : '';
$reviewerCompany = isset( $attributes['reviewerCompany'] ) ? sanitize_text_field( (string) $attributes['reviewerCompany'] ) : '';
$avatarUrl       = isset( $attributes['avatarUrl'] ) ? esc_url_raw( (string) $attributes['avatarUrl'] ) : '';

$rating = isset( $attributes['rating'] ) ? (int) $attributes['rating'] : 5;
$rating = max( 0, min( 5, $rating ) );

$layout = isset( $attributes['layout'] ) ? (string) $attributes['layout'] : 'card';
$layout = in_array( $layout, [ 'card', 'minimal', 'bubble' ], true ) ? $layout : 'card';

$avatarPosition = isset( $attributes['avatarPosition'] ) ? (string) $attributes['avatarPosition'] : 'left';
$avatarPosition = in_array( $avatarPosition, [ 'left', 'top', 'right' ], true ) ? $avatarPosition : 'left';

$avatarShape = isset( $attributes['avatarShape'] ) ? (string) $attributes['avatarShape'] : 'circle';
$avatarShape = in_array( $avatarShape, [ 'circle', 'rounded', 'square' ], true ) ? $avatarShape : 'circle';

$alignment = isset( $attributes['alignment'] ) ? (string) $attributes['alignment'] : 'left';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left';

$bubbleTail = isset( $attributes['bubbleTailPosition'] ) ? (string) $attributes['bubbleTailPosition'] : 'bottom-left';
$bubbleTail = in_array( $bubbleTail, [ 'bottom-left', 'bottom-right' ], true ) ? $bubbleTail : 'bottom-left';

$showCompany = ! empty( $attributes['showCompany'] );
$showAvatar  = ! empty( $attributes['showAvatar'] );
$showRating  = ! empty( $attributes['showRating'] );
$quoteIcon   = ! empty( $attributes['quoteIcon'] );

$avatarSize   = isset( $attributes['avatarSize'] ) ? max( 32, min( 120, (int) $attributes['avatarSize'] ) ) : 56;
$borderWidth  = isset( $attributes['borderWidth'] ) ? max( 0, min( 8, (int) $attributes['borderWidth'] ) ) : 1;
$borderRadius = isset( $attributes['borderRadius'] ) ? max( 0, min( 48, (int) $attributes['borderRadius'] ) ) : 12;
$paddingTop    = isset( $attributes['paddingTop'] ) ? max( 0, min( 96, (int) $attributes['paddingTop'] ) ) : 24;
$paddingRight  = isset( $attributes['paddingRight'] ) ? max( 0, min( 96, (int) $attributes['paddingRight'] ) ) : 24;
$paddingBottom = isset( $attributes['paddingBottom'] ) ? max( 0, min( 96, (int) $attributes['paddingBottom'] ) ) : 24;
$paddingLeft   = isset( $attributes['paddingLeft'] ) ? max( 0, min( 96, (int) $attributes['paddingLeft'] ) ) : 24;
$textFontSize  = isset( $attributes['textFontSize'] ) ? max( 12, min( 32, (int) $attributes['textFontSize'] ) ) : 16;
$nameFontSize  = isset( $attributes['nameFontSize'] ) ? max( 12, min( 28, (int) $attributes['nameFontSize'] ) ) : 16;
$metaFontSize  = isset( $attributes['metaFontSize'] ) ? max( 10, min( 20, (int) $attributes['metaFontSize'] ) ) : 13;
$starSize      = isset( $attributes['starSize'] ) ? max( 10, min( 32, (int) $attributes['starSize'] ) ) : 18;
$maxWidth      = isset( $attributes['maxWidth'] ) ? (int) $attributes['maxWidth'] : 0;
$maxWidth      = $maxWidth > 0 ? max( 300, min( 1200, $maxWidth ) ) : 0;

$allowedWeights = [ '400', '500', '600', '700' ];
$textFontWeight = isset( $attributes['textFontWeight'] ) && in_array( (string) $attributes['textFontWeight'], $allowedWeights, true ) ? (string) $attributes['textFontWeight'] : '400';
$nameFontWeight = isset( $attributes['nameFontWeight'] ) && in_array( (string) $attributes['nameFontWeight'], $allowedWeights, true ) ? (string) $attributes['nameFontWeight'] : '700';

$accentColor    = $sanitizeColor( $attributes['accentColor'] ?? '', '#0d6efd' );
$cardBg         = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$textColor      = $sanitizeColor( $attributes['textColor'] ?? '', '' );
$nameColor      = $sanitizeColor( $attributes['nameColor'] ?? '', '' );
$metaColor      = $sanitizeColor( $attributes['metaColor'] ?? '', '' );
$borderColor    = $sanitizeColor( $attributes['borderColor'] ?? '', '' );
$quoteIconColor = $sanitizeColor( $attributes['quoteIconColor'] ?? '', '' );

$avatarRadius = '50%';
if ( 'rounded' === $avatarShape ) {
	$avatarRadius = '12px';
} elseif ( 'square' === $avatarShape ) {
	$avatarRadius = '0px';
}

// --- Wrapper classes ---------------------------------------------------
$wrapperClasses  = $planClass;
$wrapperClasses .= ' bb-tc--' . $layout;
$wrapperClasses .= ' bb-tc--avatar-' . $avatarPosition;
$wrapperClasses .= ' bb-tc--align-' . $alignment;
if ( 'bubble' === $layout ) {
	$wrapperClasses .= ( 'bottom-right' === $bubbleTail ) ? ' bb-tc--tail-br' : ' bb-tc--tail-bl';
}

// --- Wrapper inline custom properties ----------------------------------
$styleParts = [
	'--bb-tc-accent:' . $accentColor,
	'--bb-tc-card-bg:' . $cardBg,
	'--bb-tc-border-width:' . $borderWidth . 'px',
	'--bb-tc-border-radius:' . $borderRadius . 'px',
	'--bb-tc-pt:' . $paddingTop . 'px',
	'--bb-tc-pr:' . $paddingRight . 'px',
	'--bb-tc-pb:' . $paddingBottom . 'px',
	'--bb-tc-pl:' . $paddingLeft . 'px',
	'--bb-tc-text-size:' . $textFontSize . 'px',
	'--bb-tc-text-weight:' . $textFontWeight,
	'--bb-tc-name-size:' . $nameFontSize . 'px',
	'--bb-tc-name-weight:' . $nameFontWeight,
	'--bb-tc-meta-size:' . $metaFontSize . 'px',
	'--bb-tc-star-size:' . $starSize . 'px',
	'--bb-tc-avatar-size:' . $avatarSize . 'px',
	'--bb-tc-avatar-radius:' . $avatarRadius,
];
if ( '' !== $textColor ) {
	$styleParts[] = '--bb-tc-text:' . $textColor;
}
if ( '' !== $nameColor ) {
	$styleParts[] = '--bb-tc-name-color:' . $nameColor;
}
if ( '' !== $metaColor ) {
	$styleParts[] = '--bb-tc-meta-color:' . $metaColor;
}
if ( '' !== $borderColor ) {
	$styleParts[] = '--bb-tc-border-color:' . $borderColor;
}
if ( '' !== $quoteIconColor ) {
	$styleParts[] = '--bb-tc-quote-color:' . $quoteIconColor;
}
if ( $maxWidth > 0 ) {
	$styleParts[] = '--bb-tc-max-width:' . $maxWidth . 'px';
}
$wrapperStyle = implode( ';', $styleParts ) . ';';

$hasAttribution = '' !== trim( $reviewerName ) || '' !== trim( $reviewerRole ) || ( $showCompany && '' !== trim( $reviewerCompany ) );

$figureAriaLabel = '' !== trim( $reviewerName )
	/* translators: %s: reviewer name */
	? sprintf( __( 'Testimonial from %s', 'b-blocks' ), $reviewerName )
	: __( 'Testimonial', 'b-blocks' );

$ratingAriaLabel = sprintf(
	/* translators: %d: rating value out of 5 */
	__( 'Rating: %d out of 5 stars', 'b-blocks' ),
	$rating
);

$avatarAlt = '' !== trim( $reviewerName )
	/* translators: %s: reviewer name */
	? sprintf( __( 'Avatar of %s', 'b-blocks' ), $reviewerName )
	: __( 'Reviewer avatar', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<figure class='bb-tc' aria-label='<?php echo esc_attr( $figureAriaLabel ); ?>'>
		<?php if ( $quoteIcon ) : ?>
			<svg class='bb-tc-quote-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
				<path fill='currentColor' d='M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z' />
			</svg>
		<?php endif; ?>

		<?php if ( $showRating && $rating > 0 ) : ?>
			<span class='bb-tc-stars' role='img' aria-label='<?php echo esc_attr( $ratingAriaLabel ); ?>'>
				<?php
				for ( $i = 1; $i <= 5; $i++ ) {
					echo $renderStar( $i <= $rating ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderStar
				}
				?>
			</span>
		<?php endif; ?>

		<?php if ( '' !== trim( $reviewText ) ) : ?>
			<blockquote class='bb-tc-quote'><?php echo wp_kses_post( $reviewText ); ?></blockquote>
		<?php endif; ?>

		<?php if ( $showAvatar && '' !== $avatarUrl || $hasAttribution ) : ?>
			<figcaption class='bb-tc-caption'>
				<?php if ( $showAvatar && '' !== $avatarUrl ) : ?>
					<img
						class='bb-tc-avatar'
						src='<?php echo esc_url( $avatarUrl ); ?>'
						alt='<?php echo esc_attr( $avatarAlt ); ?>'
						width='<?php echo esc_attr( (string) $avatarSize ); ?>'
						height='<?php echo esc_attr( (string) $avatarSize ); ?>'
						loading='lazy'
						decoding='async'
					/>
				<?php endif; ?>

				<?php if ( $hasAttribution ) : ?>
					<cite class='bb-tc-cite'>
						<?php if ( '' !== trim( $reviewerName ) ) : ?>
							<span class='bb-tc-name'><?php echo esc_html( $reviewerName ); ?></span>
						<?php endif; ?>

						<?php
						$metaItems = [];
						if ( '' !== trim( $reviewerRole ) ) {
							$metaItems[] = $reviewerRole;
						}
						if ( $showCompany && '' !== trim( $reviewerCompany ) ) {
							$metaItems[] = $reviewerCompany;
						}
						if ( ! empty( $metaItems ) ) :
							?>
							<span class='bb-tc-meta'><?php echo esc_html( implode( ', ', $metaItems ) ); ?></span>
						<?php endif; ?>
					</cite>
				<?php endif; ?>
			</figcaption>
		<?php endif; ?>
	</figure>
</div>
