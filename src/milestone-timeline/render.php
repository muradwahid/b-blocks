<?php
/**
 * Milestone Timeline block server-side render.
 *
 * Renders a horizontal, left-to-right milestone strip as a semantic ordered
 * list (`<ol aria-label>`) so screen readers announce the count and sequence.
 * Each `<li>` is one milestone holding a decorative node (icon or number,
 * `aria-hidden`) and a card with a date label (`<span>` or `<time>`), a title
 * (allow-listed heading tag), and an optional description. The connector line
 * and node are presentational and marked `aria-hidden`.
 *
 * The outer track is a `role="region"` + `tabindex="0"` scroll container so
 * keyboard users can focus it and scroll horizontally with the arrow keys when
 * milestones overflow. On viewports below the configured breakpoint, a CSS
 * media query stacks items vertically with a left-edge line — no JavaScript is
 * required for the responsive switch. `view.js` only adds a scroll-in entrance
 * animation, which is skipped entirely under `prefers-reduced-motion`.
 *
 * Per-instance CSS is emitted inline, scoped under a `wp_unique_id()` wrapper
 * id, so multiple timelines on one page never collide. All `render.php` helpers
 * are inlined as static closures to avoid the "Cannot redeclare function" fatal
 * Gutenberg can trigger by including this file more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksMilestoneTimeline';
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
		case 'small':
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
		case 'medium':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'large':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'none':
		default:
			return 'none';
	}
};

// --- Resolve layout / behavior attributes. ---
$nodeShape     = $pickFrom( $attributes['nodeShape'] ?? 'circle', [ 'circle', 'square' ], 'circle' );
$labelPosition = $pickFrom( $attributes['labelPosition'] ?? 'alternating', [ 'above', 'below', 'alternating' ], 'alternating' );
$alignment     = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );
$stackOrder    = $pickFrom( $attributes['mobileStackOrder'] ?? 'asc', [ 'asc', 'desc' ], 'asc' );

$dateTag  = $pickFrom( $attributes['dateTag'] ?? 'span', [ 'span', 'time' ], 'span' );
$titleTag = $pickFrom( $attributes['titleTag'] ?? 'h3', [ 'h2', 'h3', 'h4', 'p' ], 'h3' );

$allowedTitleWeights = [ '400', '500', '600', '700' ];
$titleWeightRaw      = (string) ( $attributes['titleFontWeight'] ?? '600' );
$titleFontWeight     = in_array( $titleWeightRaw, $allowedTitleWeights, true ) ? $titleWeightRaw : '600';

$lineHeight       = $clampInt( $attributes['lineHeight'] ?? 3, 1, 8, 3 );
$nodeSize         = $clampInt( $attributes['nodeSize'] ?? 40, 24, 80, 40 );
$dateFontSize     = $clampInt( $attributes['dateFontSize'] ?? 13, 10, 24, 13 );
$titleFontSize    = $clampInt( $attributes['titleFontSize'] ?? 16, 12, 36, 16 );
$descFontSize     = $clampInt( $attributes['descFontSize'] ?? 14, 10, 24, 14 );
$cardBorderRadius = $clampInt( $attributes['cardBorderRadius'] ?? 8, 0, 32, 8 );
$cardPaddingV     = $clampInt( $attributes['cardPaddingV'] ?? 16, 4, 48, 16 );
$cardPaddingH     = $clampInt( $attributes['cardPaddingH'] ?? 16, 4, 48, 16 );
$cardMaxWidth     = $clampInt( $attributes['cardMaxWidth'] ?? 220, 120, 400, 220 );
$gap              = $clampInt( $attributes['gap'] ?? 40, 16, 120, 40 );
$mobileBreakpoint = $clampInt( $attributes['mobileBreakpoint'] ?? 640, 320, 768, 640 );

$lineColor     = $sanitizeColor( $attributes['lineColor'] ?? '', '#e2e8f0' );
$nodeColor     = $sanitizeColor( $attributes['nodeColor'] ?? '', '#3b82f6' );
$nodeIconColor = $sanitizeColor( $attributes['nodeIconColor'] ?? '', '#ffffff' );
$dateColor     = $sanitizeColor( $attributes['dateColor'] ?? '', '#6b7280' );
$titleColor    = $sanitizeColor( $attributes['titleColor'] ?? '', '#1e293b' );
$descColor     = $sanitizeColor( $attributes['descColor'] ?? '', '#475569' );
$cardBackground = $sanitizeColor( $attributes['cardBackground'] ?? '', '#ffffff' );
$cardShadow    = $pickFrom( $attributes['cardShadow'] ?? 'small', [ 'none', 'small', 'medium', 'large' ], 'small' );

$showNodeNumbers = isset( $attributes['showNodeNumbers'] ) ? (bool) $attributes['showNodeNumbers'] : false;

$ariaLabelRaw = isset( $attributes['ariaLabel'] ) ? sanitize_text_field( (string) $attributes['ariaLabel'] ) : '';
$ariaLabel    = '' !== $ariaLabelRaw ? $ariaLabelRaw : __( 'Milestones', 'b-blocks' );

$textAlign = $alignment;

$items = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [];

// --- Keep only items that have something to display. ---
$renderable = [];
foreach ( $items as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$date  = isset( $item['date'] ) ? trim( (string) $item['date'] ) : '';
	$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
	$desc  = isset( $item['description'] ) ? trim( (string) $item['description'] ) : '';
	if ( '' === $date && '' === $title && '' === $desc ) {
		continue;
	}
	$renderable[] = $item;
}

if ( empty( $renderable ) ) {
	return;
}

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-mt{";
$css .= "--bb-mt-line-color:$lineColor;";
$css .= "--bb-mt-line-height:{$lineHeight}px;";
$css .= "--bb-mt-node-size:{$nodeSize}px;";
$css .= "--bb-mt-node-color:$nodeColor;";
$css .= "--bb-mt-node-icon-color:$nodeIconColor;";
$css .= "--bb-mt-date-color:$dateColor;";
$css .= "--bb-mt-date-size:{$dateFontSize}px;";
$css .= "--bb-mt-title-color:$titleColor;";
$css .= "--bb-mt-title-size:{$titleFontSize}px;";
$css .= "--bb-mt-title-weight:$titleFontWeight;";
$css .= "--bb-mt-desc-color:$descColor;";
$css .= "--bb-mt-desc-size:{$descFontSize}px;";
$css .= "--bb-mt-card-bg:$cardBackground;";
$css .= "--bb-mt-card-radius:{$cardBorderRadius}px;";
$css .= "--bb-mt-card-pad-v:{$cardPaddingV}px;";
$css .= "--bb-mt-card-pad-h:{$cardPaddingH}px;";
$css .= '--bb-mt-card-shadow:' . $shadowFor( $cardShadow ) . ';';
$css .= "--bb-mt-card-max-width:{$cardMaxWidth}px;";
$css .= "--bb-mt-gap:{$gap}px;";
$css .= "--bb-mt-text-align:$textAlign;";
$css .= "--bb-mt-breakpoint:{$mobileBreakpoint}px;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-mt'
	. ' bb-mt--shape-' . $nodeShape
	. ' bb-mt--labels-' . $labelPosition
	. ' bb-mt--align-' . $alignment
	. ' bb-mt--stack-' . $stackOrder
);

$regionLabel = __( 'Milestone timeline, scroll horizontally to see all', 'b-blocks' );
$counter     = 0;

$viewConfig = wp_json_encode( [ 'mobileBreakpoint' => $mobileBreakpoint ] );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-mt-config='<?php echo esc_attr( $viewConfig ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div
		class='bb-mt-track'
		role='region'
		tabindex='0'
		aria-label='<?php echo esc_attr( $regionLabel ); ?>'
	>
		<ol class='bb-mt-list' aria-label='<?php echo esc_attr( $ariaLabel ); ?>'>
			<?php
			foreach ( $renderable as $item ) :
				++$counter;
				$date  = isset( $item['date'] ) ? sanitize_text_field( (string) $item['date'] ) : '';
				$title = isset( $item['title'] ) ? sanitize_text_field( (string) $item['title'] ) : '';
				$desc  = isset( $item['description'] ) ? sanitize_text_field( (string) $item['description'] ) : '';
				$icon  = $sanitizeIconClass( $item['icon'] ?? '', '' );
				$accent = $sanitizeColor( $item['accentColor'] ?? '', '' );

				$nodeStyle = '' !== $accent ? ' style="background-color:' . esc_attr( $accent ) . ';"' : '';
				?>
				<li class='bb-mt-item'>
					<span class='bb-mt-node' aria-hidden='true'<?php echo $nodeStyle; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- value is esc_attr'd above. ?>>
						<?php if ( $showNodeNumbers ) : ?>
							<span class='bb-mt-node-num'><?php echo esc_html( (string) $counter ); ?></span>
						<?php elseif ( '' !== $icon ) : ?>
							<i class='<?php echo esc_attr( $icon ); ?>'></i>
						<?php endif; ?>
					</span>

					<div class='bb-mt-card'>
						<?php if ( '' !== $date ) : ?>
							<?php if ( 'time' === $dateTag ) : ?>
								<time class='bb-mt-date' datetime='<?php echo esc_attr( $date ); ?>'><?php echo esc_html( $date ); ?></time>
							<?php else : ?>
								<span class='bb-mt-date'><?php echo esc_html( $date ); ?></span>
							<?php endif; ?>
						<?php endif; ?>

						<?php if ( '' !== $title ) : ?>
							<<?php echo esc_attr( $titleTag ); ?> class='bb-mt-title'><?php echo esc_html( $title ); ?></<?php echo esc_attr( $titleTag ); ?>>
						<?php endif; ?>

						<?php if ( '' !== $desc ) : ?>
							<p class='bb-mt-desc'><?php echo esc_html( $desc ); ?></p>
						<?php endif; ?>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
	</div>
</div>
