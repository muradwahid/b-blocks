<?php
/**
 * Image Accordion block server-side render.
 *
 * Renders an expanding horizontal strip (vertical-stacked on mobile) of image
 * panels. Each panel is a `role="button"` trigger area wrapping a separate
 * content region referenced via `aria-controls`. Background images are CSS
 * `background-image` (decorative); a visually-hidden span carries each panel's
 * alt text for screen readers. All interaction is CSS-transition driven; the
 * dependency-free `view.js` only toggles `is-active` / `is-collapsed` classes
 * and honors `prefers-reduced-motion`.
 *
 * Per-instance CSS is emitted inline, scoped under a `wp_unique_id()` wrapper
 * id, so multiple accordions on one page never collide. All `render.php`
 * helpers are inlined as static closures to avoid the "Cannot redeclare
 * function" fatal Gutenberg can trigger by including this file more than once.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksImageAccordion';
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
	// Hardened var() allowlist — comma-fallback restricted to safe chars only;
	// no {}, \, <, > which could break the CSS context.
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

// --- Sanitize a CSS background-position value (numbers, %, keywords only). ---
$sanitizePosition = static function ( $value, $fallback = '50% 50%' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^[a-zA-Z0-9%.\s\-]{1,40}$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Pixel-or-raw font size resolver (clamps a bare number to px). ---
$fontSize = static function ( $value, $min, $max, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^(\d{1,3})px$/', $value, $m ) ) {
		$n = (int) $m[1];
		$n = max( $min, min( $max, $n ) );
		return "{$n}px";
	}
	if ( preg_match( '/^\d{1,3}$/', $value ) ) {
		$n = max( $min, min( $max, (int) $value ) );
		return "{$n}px";
	}
	return $fallback;
};

// --- Resolve attributes. ---
$trigger         = $pickFrom( $attributes['trigger'] ?? 'hover', [ 'hover', 'click' ], 'hover' );
$orientation     = $pickFrom( $attributes['orientation'] ?? 'horizontal', [ 'horizontal', 'vertical' ], 'horizontal' );
$overlayPosition = $pickFrom( $attributes['overlayPosition'] ?? 'bottom', [ 'bottom', 'center', 'top' ], 'bottom' );
$titleTag        = $pickFrom( $attributes['titleTag'] ?? 'h3', [ 'h2', 'h3', 'h4' ], 'h3' );
$alignment       = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

$minHeight         = $clampInt( $attributes['minHeight'] ?? 480, 200, 900, 480 );
$collapsedWidth    = $clampInt( $attributes['collapsedWidth'] ?? 80, 40, 200, 80 );
$animationDuration = $clampInt( $attributes['animationDuration'] ?? 400, 0, 1000, 400 );
$gapBetweenPanels  = $clampInt( $attributes['gapBetweenPanels'] ?? 4, 0, 24, 4 );
$borderRadius      = $clampInt( $attributes['borderRadius'] ?? 8, 0, 32, 8 );
$mobileBreakpoint  = $clampInt( $attributes['mobileBreakpoint'] ?? 768, 480, 1024, 768 );
$maxWidth          = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );

$btnPaddingV = $clampInt( $attributes['btnPaddingV'] ?? 10, 4, 24, 10 );
$btnPaddingH = $clampInt( $attributes['btnPaddingH'] ?? 22, 8, 48, 22 );
$btnRadius   = $clampInt( $attributes['btnRadius'] ?? 4, 0, 32, 4 );
$btnFontSize = $clampInt( $attributes['btnFontSize'] ?? 14, 12, 24, 14 );

$showTitle       = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;
$showDescription = isset( $attributes['showDescription'] ) ? (bool) $attributes['showDescription'] : true;
$showButton      = isset( $attributes['showButton'] ) ? (bool) $attributes['showButton'] : true;

$overlayColor = $sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.45)' );
$titleColor   = $sanitizeColor( $attributes['titleColor'] ?? '', '#ffffff' );
$descColor    = $sanitizeColor( $attributes['descColor'] ?? '', 'rgba(255,255,255,0.85)' );
$btnBg        = $sanitizeColor( $attributes['btnBg'] ?? '', '#ffffff' );
$btnColor     = $sanitizeColor( $attributes['btnColor'] ?? '', '#111111' );
$btnBgHover   = $sanitizeColor( $attributes['btnBgHover'] ?? '', '#f0f0f0' );
$btnColorHover = $sanitizeColor( $attributes['btnColorHover'] ?? '', '#111111' );

$titleWeight = preg_replace( '/[^0-9]/', '', (string) ( $attributes['titleFontWeight'] ?? '700' ) );
$titleWeight = '' !== $titleWeight ? $titleWeight : '700';

$titleSizes = is_array( $attributes['titleFontSize'] ?? null ) ? $attributes['titleFontSize'] : [];
$titleSizeD = $fontSize( $titleSizes['desktop'] ?? '22px', 12, 48, '22px' );
$titleSizeT = $fontSize( $titleSizes['tablet'] ?? '18px', 12, 40, '18px' );
$titleSizeM = $fontSize( $titleSizes['mobile'] ?? '16px', 12, 32, '16px' );

$descSizes = is_array( $attributes['descFontSize'] ?? null ) ? $attributes['descFontSize'] : [];
$descSizeD = $fontSize( $descSizes['desktop'] ?? '15px', 10, 28, '15px' );
$descSizeT = $fontSize( $descSizes['tablet'] ?? '14px', 10, 24, '14px' );
$descSizeM = $fontSize( $descSizes['mobile'] ?? '14px', 10, 20, '14px' );

$globalBtnLabel = isset( $attributes['btnLabel'] ) ? trim( wp_strip_all_tags( (string) $attributes['btnLabel'] ) ) : '';

$panels = is_array( $attributes['panels'] ?? null ) ? $attributes['panels'] : [];
$panels = array_slice( $panels, 0, 8 );

$panelCount = 0;
foreach ( $panels as $p ) {
	if ( is_array( $p ) ) {
		$panelCount++;
	}
}

// Default active index, bounded to the available panels (-1 = none).
$activeIndex = isset( $attributes['activeIndex'] ) && is_numeric( $attributes['activeIndex'] )
	? (int) $attributes['activeIndex']
	: 0;
if ( $activeIndex < -1 || $activeIndex >= $panelCount ) {
	$activeIndex = $panelCount > 0 ? 0 : -1;
}

$alignFlex   = 'left' === $alignment ? 'flex-start' : ( 'right' === $alignment ? 'flex-end' : 'center' );
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-ia{";
$css .= "--bb-ia-min-height:{$minHeight}px;";
$css .= "--bb-ia-collapsed-w:{$collapsedWidth}px;";
$css .= "--bb-ia-duration:{$animationDuration}ms;";
$css .= "--bb-ia-overlay:$overlayColor;";
$css .= "--bb-ia-title-color:$titleColor;";
$css .= "--bb-ia-title-size-d:$titleSizeD;";
$css .= "--bb-ia-title-size-t:$titleSizeT;";
$css .= "--bb-ia-title-size-m:$titleSizeM;";
$css .= "--bb-ia-title-weight:$titleWeight;";
$css .= "--bb-ia-desc-color:$descColor;";
$css .= "--bb-ia-desc-size-d:$descSizeD;";
$css .= "--bb-ia-desc-size-t:$descSizeT;";
$css .= "--bb-ia-desc-size-m:$descSizeM;";
$css .= "--bb-ia-btn-bg:$btnBg;";
$css .= "--bb-ia-btn-color:$btnColor;";
$css .= "--bb-ia-btn-bg-hover:$btnBgHover;";
$css .= "--bb-ia-btn-color-hover:$btnColorHover;";
$css .= "--bb-ia-btn-pv:{$btnPaddingV}px;";
$css .= "--bb-ia-btn-ph:{$btnPaddingH}px;";
$css .= "--bb-ia-btn-radius:{$btnRadius}px;";
$css .= "--bb-ia-btn-size:{$btnFontSize}px;";
$css .= "--bb-ia-gap:{$gapBetweenPanels}px;";
$css .= "--bb-ia-radius:{$borderRadius}px;";
$css .= "--bb-ia-breakpoint:{$mobileBreakpoint}px;";
$css .= "--bb-ia-max-width:$maxWidthCss;";
$css .= "--bb-ia-align:$alignFlex;";
$css .= '}';

// Accessible group label — from the first panel title when present.
$firstTitle = '';
foreach ( $panels as $p ) {
	if ( is_array( $p ) && '' !== trim( wp_strip_all_tags( (string) ( $p['title'] ?? '' ) ) ) ) {
		$firstTitle = trim( wp_strip_all_tags( (string) $p['title'] ) );
		break;
	}
}
$groupLabel = '' !== $firstTitle
	/* translators: %s: title of the first panel */
	? sprintf( __( 'Image accordion: %s', 'b-blocks' ), $firstTitle )
	: __( 'Image accordion', 'b-blocks' );

$wrapperClasses = trim(
	$planClass
	. ' bb-ia'
	. ' bb-ia--' . $orientation
	. ' bb-ia--overlay-' . $overlayPosition
	. ' bb-ia--trigger-' . $trigger
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-trigger='<?php echo esc_attr( $trigger ); ?>'
	data-active='<?php echo esc_attr( (string) $activeIndex ); ?>'
	data-breakpoint='<?php echo esc_attr( (string) $mobileBreakpoint ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $panelCount > 0 ) : ?>
		<div class='bb-ia-strip' role='group' aria-label='<?php echo esc_attr( $groupLabel ); ?>'>
			<?php
			$renderIndex = -1;
			foreach ( $panels as $panel ) :
				if ( ! is_array( $panel ) ) {
					continue;
				}
				$renderIndex++;

				$panelId   = wp_unique_id( "$id-panel-" );
				$contentId = "$panelId-content";

				// Use esc_url_raw() for the CSS background-image url() context:
				// esc_url() HTML-encodes '&' to '&amp;', which combined with esc_attr() on the
				// surrounding style string would double-encode to '&amp;amp;' and break the URL.
				// esc_url_raw() validates + strips dangerous protocols without HTML-encoding,
				// and esc_attr() on $panelStyle then handles the HTML layer correctly.
				$imageUrl = isset( $panel['imageUrl'] ) ? esc_url_raw( (string) $panel['imageUrl'] ) : '';
				$imageId  = isset( $panel['imageId'] ) ? absint( $panel['imageId'] ) : 0;
				$imageAlt = isset( $panel['imageAlt'] ) ? trim( wp_strip_all_tags( (string) $panel['imageAlt'] ) ) : '';

				if ( '' === $imageAlt && $imageId > 0 ) {
					$metaAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
					if ( is_string( $metaAlt ) ) {
						$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
					}
				}

				$title = isset( $panel['title'] ) ? trim( wp_strip_all_tags( (string) $panel['title'] ) ) : '';
				$desc  = isset( $panel['description'] ) ? trim( wp_strip_all_tags( (string) $panel['description'] ) ) : '';

				$panelBtnLabel = isset( $panel['btnLabel'] ) ? trim( wp_strip_all_tags( (string) $panel['btnLabel'] ) ) : '';
				$resolvedLabel = '' !== $panelBtnLabel ? $panelBtnLabel : $globalBtnLabel;
				if ( '' === $resolvedLabel ) {
					$resolvedLabel = __( 'Learn More', 'b-blocks' );
				}

				// Sanitize only — esc_url() is called at output time (href='...') to avoid
				// double-encoding if the URL contains '&' query parameters.
				$btnUrl    = isset( $panel['btnUrl'] ) ? esc_url_raw( (string) $panel['btnUrl'] ) : '';
				$btnNewTab = isset( $panel['btnNewTab'] ) ? (bool) $panel['btnNewTab'] : false;

				$panelOverlay  = $sanitizeColor( $panel['overlayColor'] ?? '', '' );
				$objectPos     = $sanitizePosition( $panel['objectPosition'] ?? '50% 50%', '50% 50%' );

				$isActive    = ( $renderIndex === $activeIndex );
				$stateClass  = $isActive ? 'is-active' : 'is-collapsed';
				$ariaExpand  = $isActive ? 'true' : 'false';

				// Accessible trigger label: title, or a numbered fallback.
				$triggerLabel = '' !== $title
					? $title
					/* translators: %d: panel number */
					: sprintf( __( 'Panel %d', 'b-blocks' ), $renderIndex + 1 );

				$panelStyle = "background-image:url('{$imageUrl}');background-position:{$objectPos};";
				if ( '' !== $panelOverlay ) {
					$panelStyle .= "--bb-ia-overlay:{$panelOverlay};";
				}
				?>
				<div
					class='bb-ia-panel <?php echo esc_attr( $stateClass ); ?>'
					data-index='<?php echo esc_attr( (string) $renderIndex ); ?>'
				>
					<div
						class='bb-ia-panel-bg'
						style='<?php echo esc_attr( $panelStyle ); ?>'
						role='button'
						tabindex='0'
						aria-expanded='<?php echo esc_attr( $ariaExpand ); ?>'
						aria-controls='<?php echo esc_attr( $contentId ); ?>'
						aria-label='<?php echo esc_attr( $triggerLabel ); ?>'
					>
						<span class='bb-ia-overlay' aria-hidden='true'></span>
						<?php if ( '' !== $imageAlt ) : ?>
							<span class='screen-reader-text'><?php echo esc_html( $imageAlt ); ?></span>
						<?php endif; ?>
					</div>

					<div class='bb-ia-content' id='<?php echo esc_attr( $contentId ); ?>'>
						<?php if ( $showTitle && '' !== $title ) : ?>
							<<?php echo esc_attr( $titleTag ); ?> class='bb-ia-title'>
								<?php echo esc_html( $title ); ?>
							</<?php echo esc_attr( $titleTag ); ?>>
						<?php endif; ?>

						<?php if ( $showDescription && '' !== $desc ) : ?>
							<p class='bb-ia-desc'><?php echo esc_html( $desc ); ?></p>
						<?php endif; ?>

						<?php if ( $showButton && '' !== $btnUrl ) : ?>
							<a
								class='bb-ia-btn'
								href='<?php echo esc_url( $btnUrl ); ?>'
								<?php if ( $btnNewTab ) : ?>
									target='_blank'
									rel='noopener noreferrer'
								<?php endif; ?>
							>
								<?php echo esc_html( $resolvedLabel ); ?>
								<?php if ( $btnNewTab ) : ?>
									<span class='screen-reader-text'><?php echo esc_html__( '(opens in a new tab)', 'b-blocks' ); ?></span>
								<?php endif; ?>
							</a>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
