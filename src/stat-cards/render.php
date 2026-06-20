<?php
/**
 * Stat Cards block server-side render.
 *
 * Renders a static, responsive grid of impact stat cards as a semantic
 * definition list (`<dl>`) with an `aria-label`. Each card is a
 * `<div class="bb-sc-item">` holding a `<dd>` for the big number (prefix +
 * number + suffix), a `<dt>` for the label, an optional decorative icon, an
 * optional trend badge, and an optional description. When a card has a link,
 * the number + label are rendered as `<span>` elements (not `<dd>`/`<dt>`) inside
 * an `<a>` so the HTML remains valid — `<dd>`/`<dt>` cannot be children of `<a>`.
 * The accessible name of the link is derived from "Label: prefixNumberSuffix";
 * the trend badge and description stay outside the `<a>` to preserve a clean
 * tab order.
 *
 * Per-instance CSS is emitted inline, scoped under a `wp_unique_id()` wrapper
 * id, so multiple grids on one page never collide. There is no JavaScript and
 * no animation — numbers appear immediately on page load.
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

$prefix    = 'bBlocksStatCards';
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
	if ( '' === $value ) {
		return $fallback;
	}
	if ( strlen( $value ) > 80 ) {
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

// --- Inline chevron / minus SVG for the trend badge. No external dependency. ---
$renderTrendIcon = static function ( $direction ) {
	if ( 'down' === $direction ) {
		$path = 'M6 9l6 6 6-6';
	} elseif ( 'neutral' === $direction ) {
		$path = 'M5 12h14';
	} else {
		$path = 'M18 15l-6-6-6 6';
	}
	return "<svg class='bb-sc-trend-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='" . esc_attr( $path ) . "' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' /></svg>";
};

// --- Resolve layout / behavior attributes. ---
$cardStyle = $pickFrom( $attributes['cardStyle'] ?? 'flat', [ 'flat', 'outlined', 'accent-top' ], 'flat' );
$alignment = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );
$blockAlign = $pickFrom( $attributes['blockAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

$colDesktop = $clampInt( $attributes['columnsDesktop'] ?? 3, 1, 6, 3 );
$colTablet  = $clampInt( $attributes['columnsTablet'] ?? 2, 1, 6, 2 );
$colMobile  = $clampInt( $attributes['columnsMobile'] ?? 1, 1, 6, 1 );
$colGap     = $clampInt( $attributes['columnGap'] ?? 24, 0, 80, 24 );
$rowGap     = $clampInt( $attributes['rowGap'] ?? 24, 0, 80, 24 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );

$showIcon        = isset( $attributes['showIcon'] ) ? (bool) $attributes['showIcon'] : true;
$showDescription = isset( $attributes['showDescription'] ) ? (bool) $attributes['showDescription'] : true;
$showTrend       = isset( $attributes['showTrend'] ) ? (bool) $attributes['showTrend'] : true;

$iconSize = $clampInt( $attributes['iconSize'] ?? 32, 12, 64, 32 );

$numberSizeDesktop = $clampInt( $attributes['numberSizeDesktop'] ?? 48, 16, 96, 48 );
$numberSizeTablet  = $clampInt( $attributes['numberSizeTablet'] ?? 40, 16, 96, 40 );
$numberSizeMobile  = $clampInt( $attributes['numberSizeMobile'] ?? 32, 16, 96, 32 );
$labelSize         = $clampInt( $attributes['labelSize'] ?? 16, 10, 28, 16 );
$descriptionSize   = $clampInt( $attributes['descriptionSize'] ?? 14, 10, 20, 14 );

$allowedNumberWeights = [ '400', '500', '600', '700', '800', '900' ];
$allowedLabelWeights  = [ '400', '500', '600', '700' ];
$numberWeightRaw = (string) ( $attributes['numberWeight'] ?? '700' );
$numberWeight    = in_array( $numberWeightRaw, $allowedNumberWeights, true ) ? $numberWeightRaw : '700';
$labelWeightRaw  = (string) ( $attributes['labelWeight'] ?? '400' );
$labelWeight     = in_array( $labelWeightRaw, $allowedLabelWeights, true ) ? $labelWeightRaw : '400';

$cardBackground = $sanitizeColor( $attributes['cardBackground'] ?? '', 'transparent' );
$cardBorder     = $sanitizeColor( $attributes['cardBorder'] ?? '', '#e2e8f0' );
$borderWidth    = $clampInt( $attributes['borderWidth'] ?? 1, 0, 8, 1 );
$accentColor    = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );
$accentWidth    = $clampInt( $attributes['accentWidth'] ?? 4, 2, 12, 4 );
$borderRadius   = $clampInt( $attributes['borderRadius'] ?? 12, 0, 48, 12 );
$cardPaddingV   = $clampInt( $attributes['cardPaddingV'] ?? 28, 8, 96, 28 );
$cardPaddingH   = $clampInt( $attributes['cardPaddingH'] ?? 24, 8, 96, 24 );
$shadowPreset   = $pickFrom( $attributes['shadowPreset'] ?? 'none', [ 'none', 'sm', 'md', 'lg' ], 'none' );

$numberColor      = $sanitizeColor( $attributes['numberColor'] ?? '', '#111827' );
$labelColor       = $sanitizeColor( $attributes['labelColor'] ?? '', '#374151' );
$descriptionColor = $sanitizeColor( $attributes['descriptionColor'] ?? '', '#6B7280' );
$iconColor        = $sanitizeColor( $attributes['iconColor'] ?? '', '#146EF5' );

$items = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [];

$textAlign  = $alignment;
$itemsAlign = 'left' === $alignment ? 'flex-start' : ( 'right' === $alignment ? 'flex-end' : 'center' );
$justify    = 'left' === $blockAlign ? 'flex-start' : ( 'right' === $blockAlign ? 'flex-end' : 'center' );
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-sc{";
$css .= "--bb-sc-cols-desktop:$colDesktop;";
$css .= "--bb-sc-cols-tablet:$colTablet;";
$css .= "--bb-sc-cols-mobile:$colMobile;";
$css .= "--bb-sc-col-gap:{$colGap}px;";
$css .= "--bb-sc-row-gap:{$rowGap}px;";
$css .= "--bb-sc-max-width:$maxWidthCss;";
$css .= "--bb-sc-justify:$justify;";
$css .= "--bb-sc-text-align:$textAlign;";
$css .= "--bb-sc-items-align:$itemsAlign;";
$css .= "--bb-sc-icon-size:{$iconSize}px;";
$css .= "--bb-sc-number-size-desktop:{$numberSizeDesktop}px;";
$css .= "--bb-sc-number-size-tablet:{$numberSizeTablet}px;";
$css .= "--bb-sc-number-size-mobile:{$numberSizeMobile}px;";
$css .= "--bb-sc-number-weight:$numberWeight;";
$css .= "--bb-sc-label-size:{$labelSize}px;";
$css .= "--bb-sc-label-weight:$labelWeight;";
$css .= "--bb-sc-desc-size:{$descriptionSize}px;";
$css .= "--bb-sc-card-bg:$cardBackground;";
$css .= "--bb-sc-card-border:$cardBorder;";
$css .= "--bb-sc-border-width:{$borderWidth}px;";
$css .= "--bb-sc-accent:$accentColor;";
$css .= "--bb-sc-accent-width:{$accentWidth}px;";
$css .= "--bb-sc-radius:{$borderRadius}px;";
$css .= "--bb-sc-pad-v:{$cardPaddingV}px;";
$css .= "--bb-sc-pad-h:{$cardPaddingH}px;";
$css .= '--bb-sc-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= "--bb-sc-number-color:$numberColor;";
$css .= "--bb-sc-label-color:$labelColor;";
$css .= "--bb-sc-desc-color:$descriptionColor;";
$css .= "--bb-sc-icon-color:$iconColor;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-sc'
	. ' bb-sc--' . $cardStyle
	. ' bb-sc--align-' . $alignment
	. ' bb-sc--block-' . $blockAlign
	. ( $borderWidth > 0 ? ' bb-sc--has-border' : '' )
);

$listLabel = __( 'Key statistics', 'b-blocks' );

// --- Keep only items that have something to display. ---
$renderable = [];
foreach ( $items as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$number = isset( $item['number'] ) ? trim( (string) $item['number'] ) : '';
	$label  = isset( $item['label'] ) ? trim( (string) $item['label'] ) : '';
	$pfx    = isset( $item['prefix'] ) ? trim( (string) $item['prefix'] ) : '';
	$sfx    = isset( $item['suffix'] ) ? trim( (string) $item['suffix'] ) : '';
	if ( '' === $number && '' === $label && '' === $pfx && '' === $sfx ) {
		continue;
	}
	$renderable[] = $item;
}

if ( empty( $renderable ) ) {
	return;
}

// --- Trend direction → default badge color + accessible word. ---
$trendWord = [
	'up'      => __( 'up', 'b-blocks' ),
	'down'    => __( 'down', 'b-blocks' ),
	'neutral' => __( 'no change', 'b-blocks' ),
];
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<dl class='bb-sc-grid' aria-label='<?php echo esc_attr( $listLabel ); ?>'>
		<?php
		foreach ( $renderable as $item ) :
			$icon        = $sanitizeIconClass( $item['icon'] ?? '', '' );
			$number      = isset( $item['number'] ) ? sanitize_text_field( (string) $item['number'] ) : '';
			$pfx         = isset( $item['prefix'] ) ? sanitize_text_field( (string) $item['prefix'] ) : '';
			$sfx         = isset( $item['suffix'] ) ? sanitize_text_field( (string) $item['suffix'] ) : '';
			$label       = isset( $item['label'] ) ? sanitize_text_field( (string) $item['label'] ) : '';
			$description = isset( $item['description'] ) ? sanitize_text_field( (string) $item['description'] ) : '';

			$trendValue     = isset( $item['trendValue'] ) ? sanitize_text_field( (string) $item['trendValue'] ) : '';
			$trendDirection = $pickFrom( $item['trendDirection'] ?? 'up', [ 'up', 'down', 'neutral' ], 'up' );
			$trendColor     = $sanitizeColor( $item['trendColor'] ?? '', '' );

			$linkUrl    = isset( $item['linkUrl'] ) ? esc_url_raw( (string) $item['linkUrl'] ) : '';
			$linkTarget = isset( $item['linkTarget'] ) ? (bool) $item['linkTarget'] : false;

			$valueText = $pfx . $number . $sfx;

			// Accessible name for a linked card.
			$linkLabel = '' !== $label
				/* translators: 1: stat label, 2: stat value (prefix + number + suffix) */
				? sprintf( __( '%1$s: %2$s', 'b-blocks' ), $label, $valueText )
				: $valueText;

			$hasTrend = $showTrend && '' !== $trendValue;
			$trendStyle = '' !== $trendColor ? ' style="background-color:' . esc_attr( $trendColor ) . ';color:#ffffff;"' : '';
			$trendAria  = sprintf(
				/* translators: 1: trend direction word (up/down/no change), 2: trend value */
				__( 'Trend: %1$s %2$s', 'b-blocks' ),
				$trendWord[ $trendDirection ] ?? $trendWord['up'],
				$trendValue
			);
			?>
			<div class='bb-sc-item'>
				<?php if ( $showIcon && '' !== $icon ) : ?>
					<span class='bb-sc-icon' aria-hidden='true'>
						<i class='<?php echo esc_attr( $icon ); ?>'></i>
					</span>
				<?php endif; ?>

				<?php if ( '' !== $linkUrl ) : ?>
					<a
						class='bb-sc-link'
						href='<?php echo esc_url( $linkUrl ); ?>'
						aria-label='<?php echo esc_attr( $linkLabel ); ?>'
						<?php if ( $linkTarget ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
					>
						<?php if ( '' !== $valueText ) : ?>
							<span class='bb-sc-number'>
								<?php if ( '' !== $pfx ) : ?>
									<span class='bb-sc-prefix'><?php echo esc_html( $pfx ); ?></span>
								<?php endif; ?>
								<span class='bb-sc-value'><?php echo esc_html( $number ); ?></span>
								<?php if ( '' !== $sfx ) : ?>
									<span class='bb-sc-suffix'><?php echo esc_html( $sfx ); ?></span>
								<?php endif; ?>
							</span>
						<?php endif; ?>

						<?php if ( '' !== $label ) : ?>
							<span class='bb-sc-label'><?php echo esc_html( $label ); ?></span>
						<?php endif; ?>

						<?php if ( $linkTarget ) : ?>
							<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
						<?php endif; ?>
					</a>
				<?php else : ?>
					<?php if ( '' !== $valueText ) : ?>
						<dd class='bb-sc-number'>
							<?php if ( '' !== $pfx ) : ?>
								<span class='bb-sc-prefix'><?php echo esc_html( $pfx ); ?></span>
							<?php endif; ?>
							<span class='bb-sc-value'><?php echo esc_html( $number ); ?></span>
							<?php if ( '' !== $sfx ) : ?>
								<span class='bb-sc-suffix'><?php echo esc_html( $sfx ); ?></span>
							<?php endif; ?>
						</dd>
					<?php endif; ?>

					<?php if ( '' !== $label ) : ?>
						<dt class='bb-sc-label'><?php echo esc_html( $label ); ?></dt>
					<?php endif; ?>
				<?php endif; ?>

				<?php if ( $hasTrend ) : ?>
					<span
						class='bb-sc-trend bb-sc-trend--<?php echo esc_attr( $trendDirection ); ?>'
						aria-label='<?php echo esc_attr( $trendAria ); ?>'
						<?php echo $trendStyle; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- value is esc_attr'd above. ?>
					>
						<?php echo $renderTrendIcon( $trendDirection ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderTrendIcon. ?>
						<span class='bb-sc-trend-text'><?php echo esc_html( $trendValue ); ?></span>
					</span>
				<?php endif; ?>

				<?php if ( $showDescription && '' !== $description ) : ?>
					<p class='bb-sc-desc'><?php echo esc_html( $description ); ?></p>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</dl>
</div>
