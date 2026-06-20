<?php
/**
 * Logo Grid block server-side render.
 *
 * Renders a static, responsive grid of logo images as a `role="list"` with
 * each cell as `role="listitem"`. Logos with a link are wrapped in an `<a>`;
 * unlinked logos are a plain `<img>`. Per-instance CSS is emitted inline,
 * scoped under a `wp_unique_id()` wrapper id, so multiple grids on one page
 * never collide. All hover effects are CSS-driven; `view.js` only suppresses
 * motion when the visitor prefers reduced motion.
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

$prefix    = 'bBlocksLogoGrid';
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
$showLabel = isset( $attributes['showLabel'] ) ? (bool) $attributes['showLabel'] : false;
$label     = isset( $attributes['label'] ) ? wp_strip_all_tags( (string) $attributes['label'] ) : '';

$labelAlign  = $pickFrom( $attributes['labelAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );
$labelColor  = $sanitizeColor( $attributes['labelColor'] ?? '', 'inherit' );
$labelSize   = $clampInt( $attributes['labelSize'] ?? 14, 10, 32, 14 );
$labelWeight = preg_replace( '/[^0-9]/', '', (string) ( $attributes['labelWeight'] ?? '400' ) );
$labelWeight = '' !== $labelWeight ? $labelWeight : '400';
$labelGap    = $clampInt( $attributes['labelGap'] ?? 16, 0, 64, 16 );

$columns    = is_array( $attributes['columns'] ?? null ) ? $attributes['columns'] : [];
$colDesktop = $clampInt( $columns['desktop'] ?? 5, 1, 8, 5 );
$colTablet  = $clampInt( $columns['tablet'] ?? 3, 1, 6, 3 );
$colMobile  = $clampInt( $columns['mobile'] ?? 2, 1, 4, 2 );

$columnGap = $clampInt( $attributes['columnGap'] ?? 32, 0, 80, 32 );
$rowGap    = $clampInt( $attributes['rowGap'] ?? 24, 0, 80, 24 );

$logoMaxHeight = $clampInt( $attributes['logoMaxHeight'] ?? 60, 20, 200, 60 );
$logoMaxWidth  = $clampInt( $attributes['logoMaxWidth'] ?? 160, 40, 400, 160 );
$logoPadding   = $clampInt( $attributes['logoPadding'] ?? 12, 0, 48, 12 );

$cellAlign        = $pickFrom( $attributes['cellAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );
$cellBackground   = $sanitizeColor( $attributes['cellBackground'] ?? '', 'transparent' );
$cellBorderRadius = $clampInt( $attributes['cellBorderRadius'] ?? 0, 0, 48, 0 );
$cellBorderWidth  = $clampInt( $attributes['cellBorderWidth'] ?? 0, 0, 4, 0 );
$cellBorderColor  = $sanitizeColor( $attributes['cellBorderColor'] ?? '', 'transparent' );

$hoverEffect        = $pickFrom( $attributes['hoverEffect'] ?? 'color', [ 'none', 'color', 'opacity', 'lift' ], 'color' );
$transitionDuration = $clampInt( $attributes['transitionDuration'] ?? 300, 0, 800, 300 );
$filterDefault      = $pickFrom( $attributes['filterDefault'] ?? 'grayscale', [ 'none', 'grayscale' ], 'grayscale' );

$maxWidth           = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );
$blockPaddingTop    = $clampInt( $attributes['blockPaddingTop'] ?? 32, 0, 120, 32 );
$blockPaddingBottom = $clampInt( $attributes['blockPaddingBottom'] ?? 32, 0, 120, 32 );
$blockBackground    = $sanitizeColor( $attributes['blockBackground'] ?? '', 'transparent' );

$items = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [];

$justify = 'left' === $cellAlign ? 'flex-start' : ( 'right' === $cellAlign ? 'flex-end' : 'center' );

// --- Accessible list label. ---
$listLabel = '' !== trim( $label ) ? $label : __( 'Partner logos', 'b-blocks' );

// --- Build per-instance CSS variables. ---
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

$css  = "#$id.bb-lg{";
$css .= "--bb-lg-cols-desktop:$colDesktop;";
$css .= "--bb-lg-cols-tablet:$colTablet;";
$css .= "--bb-lg-cols-mobile:$colMobile;";
$css .= "--bb-lg-col-gap:{$columnGap}px;";
$css .= "--bb-lg-row-gap:{$rowGap}px;";
$css .= "--bb-lg-justify:$justify;";
$css .= "--bb-lg-logo-max-h:{$logoMaxHeight}px;";
$css .= "--bb-lg-logo-max-w:{$logoMaxWidth}px;";
$css .= "--bb-lg-cell-padding:{$logoPadding}px;";
$css .= "--bb-lg-cell-bg:$cellBackground;";
$css .= "--bb-lg-cell-radius:{$cellBorderRadius}px;";
$css .= "--bb-lg-cell-border-w:{$cellBorderWidth}px;";
$css .= "--bb-lg-cell-border-c:$cellBorderColor;";
$css .= "--bb-lg-transition:{$transitionDuration}ms;";
$css .= "--bb-lg-block-pt:{$blockPaddingTop}px;";
$css .= "--bb-lg-block-pb:{$blockPaddingBottom}px;";
$css .= "--bb-lg-block-bg:$blockBackground;";
$css .= "--bb-lg-max-width:$maxWidthCss;";
$css .= "--bb-lg-label-color:$labelColor;";
$css .= "--bb-lg-label-size:{$labelSize}px;";
$css .= "--bb-lg-label-weight:$labelWeight;";
$css .= "--bb-lg-label-align:$labelAlign;";
$css .= "--bb-lg-label-gap:{$labelGap}px;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-lg'
	. ' bb-lg--filter-' . $filterDefault
	. ' bb-lg--hover-' . $hoverEffect
	. ( $cellBorderWidth > 0 ? ' bb-lg--has-border' : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-lg-motion='auto'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $showLabel && '' !== trim( $label ) ) : ?>
		<p class='bb-lg-label'><?php echo esc_html( $label ); ?></p>
	<?php endif; ?>

	<?php if ( ! empty( $items ) ) : ?>
		<div class='bb-lg-grid' role='list' aria-label='<?php echo esc_attr( $listLabel ); ?>'>
			<?php
			foreach ( $items as $item ) :
				$imageUrl = isset( $item['imageUrl'] ) ? (string) $item['imageUrl'] : '';
				if ( '' === $imageUrl ) {
					continue;
				}

				$imageId  = isset( $item['imageId'] ) ? absint( $item['imageId'] ) : 0;
				$imageAlt = isset( $item['imageAlt'] ) ? trim( wp_strip_all_tags( (string) $item['imageAlt'] ) ) : '';

				// Alt fallback: per-item alt -> media library alt -> label text -> empty.
				if ( '' === $imageAlt && $imageId > 0 ) {
					$metaAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
					if ( is_string( $metaAlt ) ) {
						$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
					}
				}
				if ( '' === $imageAlt && '' !== trim( $label ) ) {
					$imageAlt = $label;
				}

				$linkUrl    = isset( $item['linkUrl'] ) ? esc_url( (string) $item['linkUrl'] ) : '';
				$linkNewTab = isset( $item['linkNewTab'] ) ? (bool) $item['linkNewTab'] : false;
				?>
				<div class='bb-lg-item' role='listitem'>
					<?php if ( '' !== $linkUrl ) : ?>
						<a
							class='bb-lg-link'
							href='<?php echo esc_url( $linkUrl ); ?>'
							<?php if ( $linkNewTab ) : ?>
								target='_blank'
								rel='noopener noreferrer'
							<?php endif; ?>
						>
							<img class='bb-lg-img' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
							<?php if ( $linkNewTab ) : ?>
								<span class='screen-reader-text'><?php echo esc_html__( '(opens in a new tab)', 'b-blocks' ); ?></span>
							<?php endif; ?>
						</a>
					<?php else : ?>
						<img class='bb-lg-img' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
