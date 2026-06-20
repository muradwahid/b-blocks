<?php
/**
 * Icon List Block server-side render.
 *
 * Renders a typed feature checklist as a semantic <ul> with Font Awesome
 * icons, optional secondary description per item, optional per-item link,
 * and a responsive CSS grid for multi-column layout.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as contact-card, divider, callout, process-steps).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksIconList';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Icon preset → Font Awesome class map -----------------------------
$presetMap = [
	'check'         => 'fa-solid fa-check',
	'circle-check'  => 'fa-solid fa-circle-check',
	'cross'         => 'fa-solid fa-xmark',
	'circle-cross'  => 'fa-solid fa-circle-xmark',
	'arrow'         => 'fa-solid fa-arrow-right',
	'star'          => 'fa-solid fa-star',
	'dot'           => 'fa-solid fa-circle',
];

$allowedPresets = array_merge( array_keys( $presetMap ), [ 'custom' ] );

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

// --- Sanitize a CSS length value (px / em / rem / % or empty) ----------
$sanitizeLength = static function ( $value, $fallback = '' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(?:\.\d+)?(?:px|em|rem|%)$/', $value ) ) {
		return $value;
	}
	if ( is_numeric( $value ) ) {
		return ( (float) $value ) . 'px';
	}
	return $fallback;
};

// --- Sanitize a Font Awesome icon class string -------------------------
// Allow letters, digits, hyphens, spaces. Cap at 80 chars.
$sanitizeIconClass = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	if ( strlen( $value ) > 80 ) {
		return '';
	}
	if ( ! preg_match( '/^[a-zA-Z0-9\-\s]+$/', $value ) ) {
		return '';
	}
	return $value;
};

// --- Resolve and sanitize attributes -----------------------------------
$rawItems = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : [];

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left';

$iconAlign = isset( $attributes['iconAlign'] ) ? (string) $attributes['iconAlign'] : 'flex-start';
$iconAlign = in_array( $iconAlign, [ 'flex-start', 'center', 'flex-end' ], true ) ? $iconAlign : 'flex-start';

$textWeight = isset( $attributes['textWeight'] ) ? (string) $attributes['textWeight'] : '400';
$textWeight = in_array( $textWeight, [ '400', '500', '600', '700' ], true ) ? $textWeight : '400';

$blockIconPreset = isset( $attributes['iconPreset'] ) ? sanitize_key( (string) $attributes['iconPreset'] ) : 'check';
$blockIconPreset = in_array( $blockIconPreset, $allowedPresets, true ) ? $blockIconPreset : 'check';

$blockIconClass = isset( $attributes['iconClass'] ) ? $sanitizeIconClass( $attributes['iconClass'] ) : '';

// Resolve block-level icon class from preset (preset wins unless "custom").
$blockResolvedIconClass = 'custom' === $blockIconPreset
	? ( '' !== $blockIconClass ? $blockIconClass : 'fa-solid fa-check' )
	: ( $presetMap[ $blockIconPreset ] ?? 'fa-solid fa-check' );

$showDescription = ! empty( $attributes['showDescription'] );

$ariaLabel = isset( $attributes['ariaLabel'] ) ? trim( (string) $attributes['ariaLabel'] ) : '';
if ( '' === $ariaLabel ) {
	$ariaLabel = __( 'Feature list', 'b-blocks' );
}

$iconColor        = $sanitizeColor( $attributes['iconColor'] ?? '', '#22c55e' );
$iconBg           = $sanitizeColor( $attributes['iconBg'] ?? '', '' );
$textColor        = $sanitizeColor( $attributes['textColor'] ?? '', '' );
$descriptionColor = $sanitizeColor( $attributes['descriptionColor'] ?? '', '' );

$iconRadius  = isset( $attributes['iconRadius'] ) ? max( 0, min( 50, (int) $attributes['iconRadius'] ) ) : 50;
$iconPadding = isset( $attributes['iconPadding'] ) ? max( 0, min( 24, (int) $attributes['iconPadding'] ) ) : 4;
$iconGap     = isset( $attributes['iconGap'] ) ? max( 0, min( 64, (int) $attributes['iconGap'] ) ) : 10;

// --- Responsive icon size ---------------------------------------------
$iconSizeAttr = isset( $attributes['iconSize'] ) && is_array( $attributes['iconSize'] ) ? $attributes['iconSize'] : [];
$iconSize     = [
	'desktop' => $sanitizeLength( $iconSizeAttr['desktop'] ?? '', '18px' ),
	'tablet'  => $sanitizeLength( $iconSizeAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $iconSizeAttr['mobile'] ?? '', '' ),
];

// --- Responsive text size ---------------------------------------------
$textSizeAttr = isset( $attributes['textSize'] ) && is_array( $attributes['textSize'] ) ? $attributes['textSize'] : [];
$textSize     = [
	'desktop' => $sanitizeLength( $textSizeAttr['desktop'] ?? '', '16px' ),
	'tablet'  => $sanitizeLength( $textSizeAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $textSizeAttr['mobile'] ?? '', '' ),
];

// --- Responsive description size --------------------------------------
$descSizeAttr = isset( $attributes['descriptionSize'] ) && is_array( $attributes['descriptionSize'] ) ? $attributes['descriptionSize'] : [];
$descSize     = [
	'desktop' => $sanitizeLength( $descSizeAttr['desktop'] ?? '', '13px' ),
	'tablet'  => $sanitizeLength( $descSizeAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $descSizeAttr['mobile'] ?? '', '' ),
];

// --- Responsive column gap --------------------------------------------
$colGapAttr = isset( $attributes['columnGap'] ) && is_array( $attributes['columnGap'] ) ? $attributes['columnGap'] : [];
$colGap     = [
	'desktop' => $sanitizeLength( $colGapAttr['desktop'] ?? '', '24px' ),
	'tablet'  => $sanitizeLength( $colGapAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $colGapAttr['mobile'] ?? '', '' ),
];

// --- Responsive row gap -----------------------------------------------
$rowGapAttr = isset( $attributes['rowGap'] ) && is_array( $attributes['rowGap'] ) ? $attributes['rowGap'] : [];
$rowGap     = [
	'desktop' => $sanitizeLength( $rowGapAttr['desktop'] ?? '', '12px' ),
	'tablet'  => $sanitizeLength( $rowGapAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $rowGapAttr['mobile'] ?? '', '' ),
];

// --- Responsive column count ------------------------------------------
$colsAttr = isset( $attributes['columns'] ) && is_array( $attributes['columns'] ) ? $attributes['columns'] : [];
$cols     = [
	'desktop' => isset( $colsAttr['desktop'] ) ? max( 1, min( 6, (int) $colsAttr['desktop'] ) ) : 1,
	'tablet'  => isset( $colsAttr['tablet'] ) ? max( 1, min( 6, (int) $colsAttr['tablet'] ) ) : 1,
	'mobile'  => isset( $colsAttr['mobile'] ) ? max( 1, min( 6, (int) $colsAttr['mobile'] ) ) : 1,
];

// --- Build clean items list (skip rows entirely empty) -----------------
$cleanItems = [];
foreach ( $rawItems as $item ) {
	$text     = isset( $item['text'] ) ? (string) $item['text'] : '';
	$descRaw  = isset( $item['description'] ) ? (string) $item['description'] : '';
	$textStrip = trim( wp_strip_all_tags( $text ) );
	$descStrip = trim( wp_strip_all_tags( $descRaw ) );

	if ( '' === $textStrip && '' === $descStrip ) {
		continue;
	}

	$itemPreset = isset( $item['iconPreset'] ) ? sanitize_key( (string) $item['iconPreset'] ) : '';
	if ( '' !== $itemPreset && ! in_array( $itemPreset, $allowedPresets, true ) ) {
		$itemPreset = '';
	}

	$itemIconClassRaw = isset( $item['iconClass'] ) ? $sanitizeIconClass( $item['iconClass'] ) : '';

	if ( '' === $itemPreset ) {
		// Inherit block-level
		$itemResolvedIcon = $blockResolvedIconClass;
	} elseif ( 'custom' === $itemPreset ) {
		$itemResolvedIcon = '' !== $itemIconClassRaw ? $itemIconClassRaw : 'fa-solid fa-check';
	} else {
		$itemResolvedIcon = $presetMap[ $itemPreset ] ?? 'fa-solid fa-check';
	}

	$cleanItems[] = [
		'text'        => $text,
		'description' => $descRaw,
		'iconClass'   => $itemResolvedIcon,
		'iconColor'   => $sanitizeColor( $item['iconColor'] ?? '', '' ),
		'iconBg'      => $sanitizeColor( $item['iconBg'] ?? '', '' ),
		'showIcon'    => isset( $item['showIcon'] ) ? (bool) $item['showIcon'] : true,
		'link'        => isset( $item['link'] ) ? esc_url_raw( (string) $item['link'] ) : '',
		'linkNewTab'  => ! empty( $item['linkNewTab'] ),
	];
}

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-il-cols:' . $cols['desktop'],
	'--bb-il-cols-tablet:' . $cols['tablet'],
	'--bb-il-cols-mobile:' . $cols['mobile'],
	'--bb-il-col-gap:' . ( '' === $colGap['desktop'] ? '24px' : $colGap['desktop'] ),
	'--bb-il-col-gap-tablet:' . ( '' === $colGap['tablet'] ? ( '' === $colGap['desktop'] ? '24px' : $colGap['desktop'] ) : $colGap['tablet'] ),
	'--bb-il-col-gap-mobile:' . ( '' === $colGap['mobile'] ? ( '' === $colGap['tablet'] ? ( '' === $colGap['desktop'] ? '24px' : $colGap['desktop'] ) : $colGap['tablet'] ) : $colGap['mobile'] ),
	'--bb-il-row-gap:' . ( '' === $rowGap['desktop'] ? '12px' : $rowGap['desktop'] ),
	'--bb-il-row-gap-tablet:' . ( '' === $rowGap['tablet'] ? ( '' === $rowGap['desktop'] ? '12px' : $rowGap['desktop'] ) : $rowGap['tablet'] ),
	'--bb-il-row-gap-mobile:' . ( '' === $rowGap['mobile'] ? ( '' === $rowGap['tablet'] ? ( '' === $rowGap['desktop'] ? '12px' : $rowGap['desktop'] ) : $rowGap['tablet'] ) : $rowGap['mobile'] ),
	'--bb-il-icon-size:' . ( '' === $iconSize['desktop'] ? '18px' : $iconSize['desktop'] ),
	'--bb-il-icon-size-tablet:' . ( '' === $iconSize['tablet'] ? ( '' === $iconSize['desktop'] ? '18px' : $iconSize['desktop'] ) : $iconSize['tablet'] ),
	'--bb-il-icon-size-mobile:' . ( '' === $iconSize['mobile'] ? ( '' === $iconSize['tablet'] ? ( '' === $iconSize['desktop'] ? '18px' : $iconSize['desktop'] ) : $iconSize['tablet'] ) : $iconSize['mobile'] ),
	'--bb-il-icon-color:' . ( '' === $iconColor ? '#22c55e' : $iconColor ),
	'--bb-il-icon-bg:' . ( '' === $iconBg ? 'transparent' : $iconBg ),
	'--bb-il-icon-radius:' . $iconRadius . '%',
	'--bb-il-icon-padding:' . $iconPadding . 'px',
	'--bb-il-icon-gap:' . $iconGap . 'px',
	'--bb-il-icon-align:' . $iconAlign,
	'--bb-il-text-size:' . ( '' === $textSize['desktop'] ? '16px' : $textSize['desktop'] ),
	'--bb-il-text-size-tablet:' . ( '' === $textSize['tablet'] ? ( '' === $textSize['desktop'] ? '16px' : $textSize['desktop'] ) : $textSize['tablet'] ),
	'--bb-il-text-size-mobile:' . ( '' === $textSize['mobile'] ? ( '' === $textSize['tablet'] ? ( '' === $textSize['desktop'] ? '16px' : $textSize['desktop'] ) : $textSize['tablet'] ) : $textSize['mobile'] ),
	'--bb-il-text-color:' . ( '' === $textColor ? 'inherit' : $textColor ),
	'--bb-il-text-weight:' . $textWeight,
	'--bb-il-desc-size:' . ( '' === $descSize['desktop'] ? '13px' : $descSize['desktop'] ),
	'--bb-il-desc-size-tablet:' . ( '' === $descSize['tablet'] ? ( '' === $descSize['desktop'] ? '13px' : $descSize['desktop'] ) : $descSize['tablet'] ),
	'--bb-il-desc-size-mobile:' . ( '' === $descSize['mobile'] ? ( '' === $descSize['tablet'] ? ( '' === $descSize['desktop'] ? '13px' : $descSize['desktop'] ) : $descSize['tablet'] ) : $descSize['mobile'] ),
	'--bb-il-desc-color:' . ( '' === $descriptionColor ? 'inherit' : $descriptionColor ),
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-il-block'
	. ' bb-il-align--' . $alignment
	. ( '' !== $iconBg ? ' has-icon-bg' : '' )
);

$srOnly = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( empty( $cleanItems ) ) : ?>
		<p class='bb-il-empty'><?php esc_html_e( 'No list items to display.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<ul class='bb-il' aria-label='<?php echo esc_attr( $ariaLabel ); ?>'>
			<?php foreach ( $cleanItems as $item ) :
				$itemText     = $item['text'];
				$itemDesc     = $item['description'];
				$itemIcon     = $item['iconClass'];
				$itemShowIcon = $item['showIcon'];
				$itemLink     = $item['link'];
				$itemNewTab   = $item['linkNewTab'];

				// Per-item inline style overrides (only when set).
				$itemStyleParts = [];
				if ( '' !== $item['iconColor'] ) {
					$itemStyleParts[] = '--bb-il-icon-color:' . $item['iconColor'];
				}
				if ( '' !== $item['iconBg'] ) {
					$itemStyleParts[] = '--bb-il-icon-bg:' . $item['iconBg'];
				}
				$itemStyle = ! empty( $itemStyleParts ) ? implode( ';', $itemStyleParts ) . ';' : '';

				$itemClasses = 'bb-il-item';
				if ( '' !== $item['iconBg'] ) {
					$itemClasses .= ' has-icon-bg';
				}

				$openLink  = '';
				$closeLink = '';
				if ( '' !== $itemLink ) {
					$openLink  = '<a class="bb-il-link" href="' . esc_url( $itemLink ) . '"';
					if ( $itemNewTab ) {
						$openLink .= ' target="_blank" rel="noopener noreferrer"';
					}
					$openLink .= '>';
					$closeLink = '</a>';
				}
				?>
				<li class='<?php echo esc_attr( $itemClasses ); ?>'<?php echo '' !== $itemStyle ? ' style="' . esc_attr( $itemStyle ) . '"' : ''; ?>>
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-built link tag with escaped URL; wraps both icon and body per spec
					echo $openLink;
					?>
					<?php if ( $itemShowIcon && '' !== $itemIcon ) : ?>
						<span class='bb-il-icon' aria-hidden='true'>
							<i class='<?php echo esc_attr( $itemIcon ); ?>'></i>
						</span>
					<?php else : ?>
						<span class='bb-il-icon bb-il-icon--hidden' aria-hidden='true'></span>
					<?php endif; ?>

					<div class='bb-il-body'>
						<?php if ( '' !== trim( wp_strip_all_tags( $itemText ) ) ) : ?>
							<span class='bb-il-text'>
								<?php echo wp_kses_post( $itemText ); ?>
								<?php if ( '' !== $itemLink && $itemNewTab ) : ?>
									<span class='bb-il-sr-only' style='<?php echo esc_attr( $srOnly ); ?>'>
										<?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?>
									</span>
								<?php endif; ?>
							</span>
						<?php endif; ?>

						<?php if ( $showDescription && '' !== trim( wp_strip_all_tags( $itemDesc ) ) ) : ?>
							<span class='bb-il-desc'>
								<?php echo wp_kses_post( $itemDesc ); ?>
							</span>
						<?php endif; ?>
					</div>
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-built closing tag
					echo $closeLink;
					?>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>
