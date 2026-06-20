<?php
/**
 * Testimonials Grid block server-side render.
 *
 * Renders multiple customer testimonials at once as a static, responsive CSS
 * grid. The outer grid is a `role="list"` with `aria-label`; each testimonial
 * is a `role="listitem"` wrapping a semantic `<figure>` that holds an optional
 * decorative quote icon (minimal style), a star rating exposed to screen
 * readers as a single `role="img"` label, a `<blockquote>` quote body, and a
 * `<figcaption>` attribution (avatar, name, role, company).
 *
 * Per-instance CSS is emitted inline, scoped under a `wp_unique_id()` wrapper
 * id, so multiple grids on one page never collide. The hover-lift effect is
 * CSS-only; `view.js` only suppresses motion when the visitor prefers reduced
 * motion. Default `cardBackground` (#ffffff) with the quote color falling back
 * to inherited body text is chosen to meet WCAG AA (4.5:1) on typical themes;
 * editors who override colors are responsible for maintaining contrast.
 *
 * All `render.php` helpers are inlined as static closures to avoid the
 * "Cannot redeclare function" fatal Gutenberg can trigger by including this
 * file more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksTestimonialsGrid';
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

// --- Box-shadow presets. ---
$shadowFor = static function ( $preset ) {
	switch ( $preset ) {
		case 'none':
			return 'none';
		case 'md':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'lg':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'sm':
		default:
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
	}
};

// --- Single inline SVG star (full / half / empty). No external dependency. ---
$renderStar = static function ( $state, $uid ) {
	// $state: 'full' | 'half' | 'empty'.
	$path = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z';
	ob_start();
	if ( 'half' === $state ) {
		$gradId = 'bb-tg-half-' . $uid;
		?>
		<svg class='bb-tg-star bb-tg-star--half' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
			<defs>
				<linearGradient id='<?php echo esc_attr( $gradId ); ?>'>
					<stop offset='50%' stop-color='var(--bb-tg-rating-color, #f59e0b)' />
					<stop offset='50%' stop-color='#d1d5db' />
				</linearGradient>
			</defs>
			<path d='<?php echo esc_attr( $path ); ?>' fill='url(#<?php echo esc_attr( $gradId ); ?>)' />
		</svg>
		<?php
	} else {
		$cls = 'full' === $state ? 'bb-tg-star bb-tg-star--on' : 'bb-tg-star bb-tg-star--off';
		?>
		<svg class='<?php echo esc_attr( $cls ); ?>' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
			<path d='<?php echo esc_attr( $path ); ?>' />
		</svg>
		<?php
	}
	return ob_get_clean();
};

// --- Resolve layout / behavior attributes. ---
$style     = $pickFrom( $attributes['style'] ?? 'card', [ 'card', 'minimal' ], 'card' );
$alignment = $pickFrom( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], 'left' );
$textAlign = $pickFrom( $attributes['textAlign'] ?? 'left', [ 'left', 'center' ], 'left' );

$colDesktop = $clampInt( $attributes['columnsDesktop'] ?? 3, 1, 4, 3 );
$colTablet  = $clampInt( $attributes['columnsTablet'] ?? 2, 1, 3, 2 );
$colMobile  = $clampInt( $attributes['columnsMobile'] ?? 1, 1, 2, 1 );
$gap        = $clampInt( $attributes['gap'] ?? 24, 8, 80, 24 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );

$showAvatar  = isset( $attributes['showAvatar'] ) ? (bool) $attributes['showAvatar'] : true;
$avatarSize  = $clampInt( $attributes['avatarSize'] ?? 48, 32, 96, 48 );
$avatarShape = $pickFrom( $attributes['avatarShape'] ?? 'circle', [ 'circle', 'rounded', 'square' ], 'circle' );

$showRating  = isset( $attributes['showRating'] ) ? (bool) $attributes['showRating'] : true;
$ratingColor = $sanitizeColor( $attributes['ratingColor'] ?? '', '#f59e0b' );
$starSize    = $clampInt( $attributes['starSize'] ?? 16, 10, 28, 16 );

$quoteIconVisible = isset( $attributes['quoteIconVisible'] ) ? (bool) $attributes['quoteIconVisible'] : true;
$quoteIconSize    = $clampInt( $attributes['quoteIconSize'] ?? 32, 16, 72, 32 );

$accentColor    = $sanitizeColor( $attributes['accentColor'] ?? '', '#6366f1' );
$quoteIconColor = $sanitizeColor( $attributes['quoteIconColor'] ?? '', $accentColor );

$cardBackground   = $sanitizeColor( $attributes['cardBackground'] ?? '', '#ffffff' );
$cardBorderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 8, 0, 48, 8 );
$cardPaddingV     = $clampInt( $attributes['cardPaddingV'] ?? 24, 8, 64, 24 );
$cardPaddingH     = $clampInt( $attributes['cardPaddingH'] ?? 24, 8, 64, 24 );
$cardShadow       = $pickFrom( $attributes['cardShadow'] ?? 'sm', [ 'none', 'sm', 'md', 'lg' ], 'sm' );

$quoteColor    = $sanitizeColor( $attributes['quoteColor'] ?? '', 'inherit' );
$quoteFontSize = $clampInt( $attributes['quoteFontSize'] ?? 16, 12, 28, 16 );
$nameColor     = $sanitizeColor( $attributes['nameColor'] ?? '', 'inherit' );
$nameFontSize  = $clampInt( $attributes['nameFontSize'] ?? 14, 10, 24, 14 );
$metaColor     = $sanitizeColor( $attributes['metaColor'] ?? '', '#6b7280' );
$metaFontSize  = $clampInt( $attributes['metaFontSize'] ?? 13, 10, 20, 13 );

$borderWidth = $clampInt( $attributes['borderWidth'] ?? 0, 0, 4, 0 );
$borderColor = $sanitizeColor( $attributes['borderColor'] ?? '', 'transparent' );

$allowedWeights  = [ '400', '500', '600', '700' ];
$quoteFontWeight = in_array( (string) ( $attributes['quoteFontWeight'] ?? '400' ), $allowedWeights, true ) ? (string) $attributes['quoteFontWeight'] : '400';
$nameFontWeight  = in_array( (string) ( $attributes['nameFontWeight'] ?? '600' ), $allowedWeights, true ) ? (string) $attributes['nameFontWeight'] : '600';

$avatarRadius = '50%';
if ( 'rounded' === $avatarShape ) {
	$avatarRadius = '12px';
} elseif ( 'square' === $avatarShape ) {
	$avatarRadius = '0px';
}

$items = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [];

$justify     = 'left' === $alignment ? 'flex-start' : ( 'right' === $alignment ? 'flex-end' : 'center' );
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-tg{";
$css .= "--bb-tg-cols-desktop:$colDesktop;";
$css .= "--bb-tg-cols-tablet:$colTablet;";
$css .= "--bb-tg-cols-mobile:$colMobile;";
$css .= "--bb-tg-gap:{$gap}px;";
$css .= "--bb-tg-max-width:$maxWidthCss;";
$css .= "--bb-tg-justify:$justify;";
$css .= '--bb-tg-text-align:' . ( 'center' === $textAlign ? 'center' : 'left' ) . ';';
$css .= "--bb-tg-avatar-size:{$avatarSize}px;";
$css .= "--bb-tg-avatar-radius:$avatarRadius;";
$css .= "--bb-tg-star-size:{$starSize}px;";
$css .= "--bb-tg-rating-color:$ratingColor;";
$css .= "--bb-tg-quote-icon-size:{$quoteIconSize}px;";
$css .= "--bb-tg-quote-icon-color:$quoteIconColor;";
$css .= "--bb-tg-card-bg:$cardBackground;";
$css .= "--bb-tg-card-radius:{$cardBorderRadius}px;";
$css .= "--bb-tg-card-pv:{$cardPaddingV}px;";
$css .= "--bb-tg-card-ph:{$cardPaddingH}px;";
$css .= '--bb-tg-card-shadow:' . $shadowFor( $cardShadow ) . ';';
$css .= "--bb-tg-accent:$accentColor;";
$css .= "--bb-tg-quote-color:$quoteColor;";
$css .= "--bb-tg-quote-size:{$quoteFontSize}px;";
$css .= "--bb-tg-quote-weight:$quoteFontWeight;";
$css .= "--bb-tg-name-color:$nameColor;";
$css .= "--bb-tg-name-size:{$nameFontSize}px;";
$css .= "--bb-tg-name-weight:$nameFontWeight;";
$css .= "--bb-tg-meta-color:$metaColor;";
$css .= "--bb-tg-meta-size:{$metaFontSize}px;";
$css .= "--bb-tg-border-width:{$borderWidth}px;";
$css .= "--bb-tg-border-color:$borderColor;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-tg'
	. ' bb-tg--' . $style
	. ' bb-tg--align-' . $alignment
	. ' bb-tg--text-' . $textAlign
	. ( $borderWidth > 0 ? ' bb-tg--has-border' : '' )
);

$listLabel = __( 'Customer testimonials', 'b-blocks' );

// --- Keep only items that have something to display. ---
$renderable = [];
foreach ( $items as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$quote = isset( $item['quote'] ) ? trim( (string) $item['quote'] ) : '';
	$name  = isset( $item['authorName'] ) ? trim( (string) $item['authorName'] ) : '';
	$role  = isset( $item['authorRole'] ) ? trim( (string) $item['authorRole'] ) : '';
	$comp  = isset( $item['authorCompany'] ) ? trim( (string) $item['authorCompany'] ) : '';
	$av    = isset( $item['avatarUrl'] ) ? trim( (string) $item['avatarUrl'] ) : '';
	if ( '' === $quote && '' === $name && '' === $role && '' === $comp && '' === $av ) {
		continue;
	}
	$renderable[] = $item;
}

if ( empty( $renderable ) ) {
	return;
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<ul class='bb-tg-grid' role='list' aria-label='<?php echo esc_attr( $listLabel ); ?>'>
		<?php
		foreach ( $renderable as $index => $item ) :
			$quote = isset( $item['quote'] ) ? (string) $item['quote'] : '';
			$name  = isset( $item['authorName'] ) ? sanitize_text_field( (string) $item['authorName'] ) : '';
			$role  = isset( $item['authorRole'] ) ? sanitize_text_field( (string) $item['authorRole'] ) : '';
			$comp  = isset( $item['authorCompany'] ) ? sanitize_text_field( (string) $item['authorCompany'] ) : '';

			$avatarUrl = isset( $item['avatarUrl'] ) ? esc_url_raw( (string) $item['avatarUrl'] ) : '';
			$avatarId  = isset( $item['avatarId'] ) ? absint( $item['avatarId'] ) : 0;
			$avatarAlt = isset( $item['avatarAlt'] ) ? trim( wp_strip_all_tags( (string) $item['avatarAlt'] ) ) : '';

			// Alt fallback: per-item alt -> media library alt -> author name.
			if ( '' === $avatarAlt && $avatarId > 0 ) {
				$metaAlt = get_post_meta( $avatarId, '_wp_attachment_image_alt', true );
				if ( is_string( $metaAlt ) ) {
					$avatarAlt = trim( wp_strip_all_tags( $metaAlt ) );
				}
			}
			if ( '' === $avatarAlt && '' !== $name ) {
				/* translators: %s: author name */
				$avatarAlt = sprintf( __( 'Avatar of %s', 'b-blocks' ), $name );
			}
			if ( '' === $avatarAlt ) {
				$avatarAlt = __( 'Reviewer avatar', 'b-blocks' );
			}

			$rating = isset( $item['rating'] ) ? (float) $item['rating'] : 0;
			$rating = max( 0, min( 5, $rating ) );
			// Round to nearest half for star rendering.
			$ratingHalf = round( $rating * 2 ) / 2;

			$metaItems = [];
			if ( '' !== $role ) {
				$metaItems[] = $role;
			}
			if ( '' !== $comp ) {
				$metaItems[] = $comp;
			}

			$hasAttribution = '' !== $name || ! empty( $metaItems );

			$figureAriaLabel = '' !== $name
				/* translators: %s: author name */
				? sprintf( __( 'Testimonial from %s', 'b-blocks' ), $name )
				: __( 'Testimonial', 'b-blocks' );

			$ratingAriaLabel = sprintf(
				/* translators: %s: rating value out of 5 (may include a half) */
				__( 'Rating: %s out of 5 stars', 'b-blocks' ),
				rtrim( rtrim( number_format_i18n( $ratingHalf, 1 ), '0' ), '.,' )
			);
			?>
			<li class='bb-tg-item' role='listitem'>
				<figure class='bb-tg-card' aria-label='<?php echo esc_attr( $figureAriaLabel ); ?>'>
					<?php if ( 'minimal' === $style && $quoteIconVisible ) : ?>
						<svg class='bb-tg-quote-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
							<path fill='currentColor' d='M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z' />
						</svg>
					<?php endif; ?>

					<?php if ( $showRating && $ratingHalf > 0 ) : ?>
						<span class='bb-tg-stars' role='img' aria-label='<?php echo esc_attr( $ratingAriaLabel ); ?>'>
							<?php
							for ( $i = 1; $i <= 5; $i++ ) {
								if ( $ratingHalf >= $i ) {
									$state = 'full';
								} elseif ( $ratingHalf >= $i - 0.5 ) {
									$state = 'half';
								} else {
									$state = 'empty';
								}
								echo $renderStar( $state, $id . '-' . $index . '-' . $i ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderStar.
							}
							?>
						</span>
					<?php endif; ?>

					<?php if ( '' !== trim( $quote ) ) : ?>
						<blockquote class='bb-tg-quote'><?php echo wp_kses_post( $quote ); ?></blockquote>
					<?php endif; ?>

					<?php if ( ( $showAvatar && '' !== $avatarUrl ) || $hasAttribution ) : ?>
						<figcaption class='bb-tg-caption'>
							<?php if ( $showAvatar && '' !== $avatarUrl ) : ?>
								<img
									class='bb-tg-avatar'
									src='<?php echo esc_url( $avatarUrl ); ?>'
									alt='<?php echo esc_attr( $avatarAlt ); ?>'
									width='<?php echo esc_attr( (string) $avatarSize ); ?>'
									height='<?php echo esc_attr( (string) $avatarSize ); ?>'
									loading='lazy'
									decoding='async'
								/>
							<?php endif; ?>

							<?php if ( $hasAttribution ) : ?>
								<cite class='bb-tg-cite'>
									<?php if ( '' !== $name ) : ?>
										<span class='bb-tg-name'><?php echo esc_html( $name ); ?></span>
									<?php endif; ?>
									<?php if ( ! empty( $metaItems ) ) : ?>
										<span class='bb-tg-meta'><?php echo esc_html( implode( ', ', $metaItems ) ); ?></span>
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
