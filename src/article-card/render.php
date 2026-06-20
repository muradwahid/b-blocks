<?php
/**
 * Article Card block server-side render.
 *
 * Renders a single, manually authored article / resource preview card as a
 * semantic `<article>` containing an optional image, a category badge, a
 * heading (configurable tag), an excerpt, an optional meta line, and a CTA.
 *
 * Two link modes:
 *  - Standard (default): the card is an `<article>`; the CTA `<a>` is the only
 *    focusable link. New-tab CTAs append an off-screen "(opens in a new tab)".
 *  - Card-link mode: the whole card body is wrapped in one `<a>` (no separate
 *    CTA is rendered) whose accessible name is the heading text.
 *
 * Per-instance styling is delivered via CSS custom properties scoped under a
 * `wp_unique_id()` wrapper id so multiple cards on one page never collide.
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

$prefix    = 'bBlocksArticleCard';
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
	// Hardened var() allowlist: optional comma-fallback restricted to safe chars only.
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

// --- Sanitize a Font Awesome icon class string. ---
$sanitizeIconClass = static function ( $value, $fallback = '' ) {
	$value = trim( (string) $value );
	if ( '' === $value || strlen( $value ) > 80 ) {
		return $fallback;
	}
	if ( ! preg_match( '/^[a-zA-Z0-9 _\-]+$/', $value ) ) {
		return $fallback;
	}
	return $value;
};

// --- Box-shadow presets. ---
$shadowFor = static function ( $preset ) {
	switch ( $preset ) {
		case 'sm':
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
		case 'md':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'lg':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'none':
		default:
			return 'none';
	}
};

// --- Resolve layout / behavior attributes. ---
$layout        = $pickFrom( $attributes['layout'] ?? 'horizontal', [ 'horizontal', 'vertical' ], 'horizontal' );
$imagePosition = $pickFrom( $attributes['imagePosition'] ?? 'left', [ 'left', 'right' ], 'left' );
$imageRatio    = $pickFrom( $attributes['imageRatio'] ?? '16/9', [ '16/9', '4/3', '1/1', '3/4' ], '16/9' );
$headingTag    = $pickFrom( $attributes['headingTag'] ?? 'h3', [ 'h2', 'h3', 'h4', 'p' ], 'h3' );
$ctaStyle      = $pickFrom( $attributes['ctaStyle'] ?? 'button', [ 'button', 'link' ], 'button' );
$alignment     = $pickFrom( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], 'left' );
$splitRatio    = $pickFrom( $attributes['imageSplitRatio'] ?? '40', [ '30', '40', '50' ], '40' );
$shadowPreset  = $pickFrom( $attributes['shadow'] ?? 'sm', [ 'none', 'sm', 'md', 'lg' ], 'sm' );
$mobileImgPos  = $pickFrom( $attributes['mobileImagePosition'] ?? 'top', [ 'top', 'hidden' ], 'top' );

$cardLinkMode = ! empty( $attributes['cardLinkMode'] );
$linkTarget   = ! empty( $attributes['linkTarget'] );
$mobileStack  = isset( $attributes['mobileStack'] ) ? (bool) $attributes['mobileStack'] : true;

// --- Content. ---
$badge      = isset( $attributes['badge'] ) ? sanitize_text_field( (string) $attributes['badge'] ) : '';
$heading    = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$excerpt    = isset( $attributes['excerpt'] ) ? (string) $attributes['excerpt'] : '';
$meta       = isset( $attributes['meta'] ) ? sanitize_text_field( (string) $attributes['meta'] ) : '';
$metaIcon   = $sanitizeIconClass( $attributes['metaIcon'] ?? '', '' );
$ctaLabel   = isset( $attributes['ctaLabel'] ) ? sanitize_text_field( (string) $attributes['ctaLabel'] ) : '';
$linkUrl    = isset( $attributes['linkUrl'] ) ? esc_url_raw( (string) $attributes['linkUrl'] ) : '';

$imageUrl = isset( $attributes['imageUrl'] ) ? esc_url_raw( (string) $attributes['imageUrl'] ) : '';
$imageId  = $clampInt( $attributes['imageId'] ?? 0, 0, PHP_INT_MAX, 0 );
$imageAlt = isset( $attributes['imageAlt'] ) ? sanitize_text_field( (string) $attributes['imageAlt'] ) : '';

// Resolve alt: per-attribute → media library → heading text fallback.
if ( '' === $imageAlt && $imageId > 0 ) {
	$mediaAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
	if ( is_string( $mediaAlt ) && '' !== trim( $mediaAlt ) ) {
		$imageAlt = sanitize_text_field( $mediaAlt );
	}
}
if ( '' === $imageAlt ) {
	$imageAlt = trim( wp_strip_all_tags( $heading ) );
}

// --- Numeric / dimension attributes. ---
$maxWidth      = $clampInt( $attributes['maxWidth'] ?? 640, 0, 1600, 640 );
$borderWidth   = $clampInt( $attributes['borderWidth'] ?? 1, 0, 8, 1 );
$borderRadius  = $clampInt( $attributes['borderRadius'] ?? 8, 0, 48, 8 );
$paddingV      = $clampInt( $attributes['paddingV'] ?? 20, 0, 80, 20 );
$paddingH      = $clampInt( $attributes['paddingH'] ?? 20, 0, 80, 20 );
$ctaPaddingV   = $clampInt( $attributes['ctaPaddingV'] ?? 8, 0, 48, 8 );
$ctaPaddingH   = $clampInt( $attributes['ctaPaddingH'] ?? 18, 0, 80, 18 );
$ctaRadius     = $clampInt( $attributes['ctaBorderRadius'] ?? 6, 0, 48, 6 );
$ctaFontSize   = $clampInt( $attributes['ctaFontSize'] ?? 14, 10, 24, 14 );

$headSizeD = $clampInt( $attributes['headingSizeDesktop'] ?? 18, 12, 48, 18 );
$headSizeT = $clampInt( $attributes['headingSizeTablet'] ?? 17, 12, 48, 17 );
$headSizeM = $clampInt( $attributes['headingSizeMobile'] ?? 16, 12, 48, 16 );
$excSizeD  = $clampInt( $attributes['excerptSizeDesktop'] ?? 14, 10, 28, 14 );
$excSizeM  = $clampInt( $attributes['excerptSizeMobile'] ?? 13, 10, 28, 13 );

$weights        = [ '400', '500', '600', '700', '800' ];
$headingWeight  = $pickFrom( $attributes['headingWeight'] ?? '600', $weights, '600' );
$excerptWeight  = $pickFrom( $attributes['excerptWeight'] ?? '400', $weights, '400' );
$ctaWeight      = $pickFrom( $attributes['ctaWeight'] ?? '600', $weights, '600' );

// --- Colors. ---
$cardBg        = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$headingColor  = $sanitizeColor( $attributes['headingColor'] ?? '', '#111827' );
$textColor     = $sanitizeColor( $attributes['textColor'] ?? '', '#374151' );
$metaColor     = $sanitizeColor( $attributes['metaColor'] ?? '', '#6b7280' );
$badgeBg       = $sanitizeColor( $attributes['badgeBg'] ?? '', '#2563eb' );
$badgeColor    = $sanitizeColor( $attributes['badgeColor'] ?? '', '#ffffff' );
$ctaBg         = $sanitizeColor( $attributes['ctaBg'] ?? '', '#2563eb' );
$ctaColor      = $sanitizeColor( $attributes['ctaColor'] ?? '', '#ffffff' );
$ctaHoverBg    = $sanitizeColor( $attributes['ctaHoverBg'] ?? '', '#1d4ed8' );
$ctaHoverColor = $sanitizeColor( $attributes['ctaHoverColor'] ?? '', '#ffffff' );
$borderColor   = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );

$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

$splitPct = (int) $splitRatio;
$imgBasis = $splitPct . '%';
$bodyBasis = ( 100 - $splitPct ) . '%';

$hasImage   = '' !== $imageUrl;
$hasHeading = '' !== trim( wp_strip_all_tags( $heading ) );
$hasExcerpt = '' !== trim( wp_strip_all_tags( $excerpt ) );
$hasMeta    = '' !== trim( $meta );
$hasBadge   = '' !== trim( $badge );
$hasCta     = '' !== trim( $ctaLabel ) && '' !== $linkUrl && ! $cardLinkMode;

// Card-link mode needs a destination; without one it degrades to standard.
if ( $cardLinkMode && '' === $linkUrl ) {
	$cardLinkMode = false;
}

// Nothing to show.
if ( ! $hasImage && ! $hasHeading && ! $hasExcerpt && ! $hasMeta && ! $hasBadge ) {
	return;
}

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-ac{";
$css .= "--bb-ac-max-width:$maxWidthCss;";
$css .= "--bb-ac-img-ratio:$imageRatio;";
$css .= "--bb-ac-img-basis:$imgBasis;";
$css .= "--bb-ac-body-basis:$bodyBasis;";
$css .= "--bb-ac-card-bg:$cardBg;";
$css .= "--bb-ac-heading-color:$headingColor;";
$css .= "--bb-ac-text-color:$textColor;";
$css .= "--bb-ac-meta-color:$metaColor;";
$css .= "--bb-ac-badge-bg:$badgeBg;";
$css .= "--bb-ac-badge-color:$badgeColor;";
$css .= "--bb-ac-cta-bg:$ctaBg;";
$css .= "--bb-ac-cta-color:$ctaColor;";
$css .= "--bb-ac-cta-hover-bg:$ctaHoverBg;";
$css .= "--bb-ac-cta-hover-color:$ctaHoverColor;";
$css .= "--bb-ac-border-color:$borderColor;";
$css .= "--bb-ac-border-width:{$borderWidth}px;";
$css .= "--bb-ac-radius:{$borderRadius}px;";
$css .= '--bb-ac-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= "--bb-ac-pad-v:{$paddingV}px;";
$css .= "--bb-ac-pad-h:{$paddingH}px;";
$css .= "--bb-ac-head-size-d:{$headSizeD}px;";
$css .= "--bb-ac-head-size-t:{$headSizeT}px;";
$css .= "--bb-ac-head-size-m:{$headSizeM}px;";
$css .= "--bb-ac-head-weight:$headingWeight;";
$css .= "--bb-ac-exc-size-d:{$excSizeD}px;";
$css .= "--bb-ac-exc-size-m:{$excSizeM}px;";
$css .= "--bb-ac-exc-weight:$excerptWeight;";
$css .= "--bb-ac-cta-size:{$ctaFontSize}px;";
$css .= "--bb-ac-cta-weight:$ctaWeight;";
$css .= "--bb-ac-cta-pad-v:{$ctaPaddingV}px;";
$css .= "--bb-ac-cta-pad-h:{$ctaPaddingH}px;";
$css .= "--bb-ac-cta-radius:{$ctaRadius}px;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-ac'
	. ' bb-ac--' . $layout
	. ( 'horizontal' === $layout ? ' bb-ac--img-' . $imagePosition : '' )
	. ' bb-ac--align-' . $alignment
	. ' bb-ac--cta-' . $ctaStyle
	. ( $borderWidth > 0 ? ' bb-ac--has-border' : '' )
	. ( 'horizontal' === $layout && $mobileStack ? ' bb-ac--mobile-stack' : '' )
	. ( 'horizontal' === $layout && $mobileStack && 'hidden' === $mobileImgPos ? ' bb-ac--mobile-hide-img' : '' )
);

$headingPlain = trim( wp_strip_all_tags( $heading ) );

// Accessible name for the whole-card link.
$cardAriaLabel = '' !== $headingPlain ? $headingPlain : __( 'Read article', 'b-blocks' );

// Build the image markup once (reused by both modes).
$imageMarkup = '';
if ( $hasImage ) {
	ob_start();
	?>
	<div class='bb-ac-media'>
		<img
			class='bb-ac-img'
			src='<?php echo esc_url( $imageUrl ); ?>'
			alt='<?php echo esc_attr( $imageAlt ); ?>'
			loading='lazy'
			decoding='async'
		/>
	</div>
	<?php
	$imageMarkup = ob_get_clean();
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

	<article class='bb-ac-card'>
		<?php if ( $cardLinkMode ) : ?>
			<a
				class='bb-ac-link'
				href='<?php echo esc_url( $linkUrl ); ?>'
				aria-label='<?php echo esc_attr( $cardAriaLabel ); ?>'
				data-bb-ac-hover='1'
				<?php if ( $linkTarget ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
			>
				<?php
				echo $imageMarkup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- internally escaped above.
				?>
				<div class='bb-ac-body'>
					<?php if ( $hasBadge ) : ?>
						<span class='bb-ac-badge'><?php echo esc_html( $badge ); ?></span>
					<?php endif; ?>

					<?php if ( $hasHeading ) : ?>
						<<?php echo esc_attr( $headingTag ); ?> class='bb-ac-heading'><?php echo wp_kses_post( $heading ); ?></<?php echo esc_attr( $headingTag ); ?>>
					<?php endif; ?>

					<?php if ( $hasExcerpt ) : ?>
						<p class='bb-ac-excerpt'><?php echo wp_kses_post( $excerpt ); ?></p>
					<?php endif; ?>

					<?php if ( $hasMeta ) : ?>
						<span class='bb-ac-meta'>
							<?php if ( '' !== $metaIcon ) : ?>
								<i class='bb-ac-meta-icon <?php echo esc_attr( $metaIcon ); ?>' aria-hidden='true'></i>
							<?php endif; ?>
							<span class='bb-ac-meta-text'><?php echo esc_html( $meta ); ?></span>
						</span>
					<?php endif; ?>

					<?php if ( $linkTarget ) : ?>
						<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</div>
			</a>
		<?php else : ?>
			<?php
			echo $imageMarkup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- internally escaped above.
			?>
			<div class='bb-ac-body'>
				<?php if ( $hasBadge ) : ?>
					<span class='bb-ac-badge'><?php echo esc_html( $badge ); ?></span>
				<?php endif; ?>

				<?php if ( $hasHeading ) : ?>
					<<?php echo esc_attr( $headingTag ); ?> class='bb-ac-heading'><?php echo wp_kses_post( $heading ); ?></<?php echo esc_attr( $headingTag ); ?>>
				<?php endif; ?>

				<?php if ( $hasExcerpt ) : ?>
					<p class='bb-ac-excerpt'><?php echo wp_kses_post( $excerpt ); ?></p>
				<?php endif; ?>

				<?php if ( $hasMeta ) : ?>
					<span class='bb-ac-meta'>
						<?php if ( '' !== $metaIcon ) : ?>
							<i class='bb-ac-meta-icon <?php echo esc_attr( $metaIcon ); ?>' aria-hidden='true'></i>
						<?php endif; ?>
						<span class='bb-ac-meta-text'><?php echo esc_html( $meta ); ?></span>
					</span>
				<?php endif; ?>

				<?php if ( $hasCta ) : ?>
					<a
						class='bb-ac-cta'
						href='<?php echo esc_url( $linkUrl ); ?>'
						<?php if ( $linkTarget ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
					>
						<span class='bb-ac-cta-label'><?php echo esc_html( $ctaLabel ); ?></span>
						<?php if ( 'link' === $ctaStyle ) : ?>
							<svg class='bb-ac-cta-arrow' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
								<path d='M5 12h14M13 6l6 6-6 6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
							</svg>
						<?php endif; ?>
						<?php if ( $linkTarget ) : ?>
							<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
						<?php endif; ?>
					</a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</article>
</div>
