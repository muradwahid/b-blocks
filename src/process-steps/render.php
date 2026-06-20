<?php
/**
 * Process Steps Block server-side render.
 *
 * Renders an ordered list of process steps with auto-incremented number
 * badges (or per-step Font Awesome icons), an optional connector line,
 * and configurable horizontal or vertical layout.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as faq-block, howto-schema, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksProcessSteps';
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

// --- Sanitize a CSS length value (px-only digit string or empty) -------
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
// Only allow letters, digits, hyphens, spaces. Cap at 80 chars to prevent
// any pathological input from polluting the markup.
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
$rawSteps      = ( isset( $attributes['steps'] ) && is_array( $attributes['steps'] ) ) ? $attributes['steps'] : [];
$showConnector = ! empty( $attributes['showConnector'] );

$layout = isset( $attributes['layout'] ) ? sanitize_key( (string) $attributes['layout'] ) : 'horizontal';
$layout = in_array( $layout, [ 'horizontal', 'vertical' ], true ) ? $layout : 'horizontal';

$theme = isset( $attributes['theme'] ) ? sanitize_key( (string) $attributes['theme'] ) : 'classic';
$theme = in_array( $theme, [ 'classic', 'modern', 'minimal', 'bold' ], true ) ? $theme : 'classic';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$badgeType = isset( $attributes['badgeType'] ) ? sanitize_key( (string) $attributes['badgeType'] ) : 'number';
$badgeType = in_array( $badgeType, [ 'number', 'icon' ], true ) ? $badgeType : 'number';

$connectorStyle = isset( $attributes['connectorStyle'] ) ? sanitize_key( (string) $attributes['connectorStyle'] ) : 'solid';
$connectorStyle = in_array( $connectorStyle, [ 'solid', 'dashed', 'dotted' ], true ) ? $connectorStyle : 'solid';

$titleTag = isset( $attributes['titleTag'] ) ? sanitize_key( (string) $attributes['titleTag'] ) : 'h3';
$titleTag = in_array( $titleTag, [ 'h2', 'h3', 'h4', 'p' ], true ) ? $titleTag : 'h3';

$badgeSize         = isset( $attributes['badgeSize'] ) ? max( 32, min( 120, (int) $attributes['badgeSize'] ) ) : 56;
$badgeFontSize     = isset( $attributes['badgeFontSize'] ) ? max( 12, min( 48, (int) $attributes['badgeFontSize'] ) ) : 20;
$badgeBorderRadius = isset( $attributes['badgeBorderRadius'] ) ? max( 0, min( 50, (int) $attributes['badgeBorderRadius'] ) ) : 50;
$connectorWidth    = isset( $attributes['connectorWidth'] ) ? max( 1, min( 8, (int) $attributes['connectorWidth'] ) ) : 2;
$cardBorderRadius  = isset( $attributes['cardBorderRadius'] ) ? max( 0, min( 48, (int) $attributes['cardBorderRadius'] ) ) : 8;

$badgeBg        = $sanitizeColor( $attributes['badgeBg'] ?? '', '#2563EB' );
$badgeColor     = $sanitizeColor( $attributes['badgeColor'] ?? '', '#FFFFFF' );
$connectorColor = $sanitizeColor( $attributes['connectorColor'] ?? '', '#CBD5E1' );
$titleColor     = $sanitizeColor( $attributes['titleColor'] ?? '', '' );
$descColor      = $sanitizeColor( $attributes['descColor'] ?? '', '' );
$cardBg         = $sanitizeColor( $attributes['cardBg'] ?? '', '' );

// --- Responsive font sizes --------------------------------------------
$titleFontAttr = isset( $attributes['titleFontSize'] ) && is_array( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : [];
$titleFont     = [
	'desktop' => $sanitizeLength( $titleFontAttr['desktop'] ?? '', '18px' ),
	'tablet'  => $sanitizeLength( $titleFontAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $titleFontAttr['mobile'] ?? '', '' ),
];

$descFontAttr = isset( $attributes['descFontSize'] ) && is_array( $attributes['descFontSize'] ) ? $attributes['descFontSize'] : [];
$descFont     = [
	'desktop' => $sanitizeLength( $descFontAttr['desktop'] ?? '', '15px' ),
	'tablet'  => $sanitizeLength( $descFontAttr['tablet'] ?? '', '' ),
	'mobile'  => $sanitizeLength( $descFontAttr['mobile'] ?? '', '' ),
];

// --- Responsive gap ---------------------------------------------------
$gapAttr = isset( $attributes['gap'] ) && is_array( $attributes['gap'] ) ? $attributes['gap'] : [];
$gap     = [
	'desktop' => $sanitizeLength( $gapAttr['desktop'] ?? '', '32px' ),
	'tablet'  => $sanitizeLength( $gapAttr['tablet'] ?? '', '24px' ),
	'mobile'  => $sanitizeLength( $gapAttr['mobile'] ?? '', '16px' ),
];

// --- Card padding -----------------------------------------------------
$padAttr = isset( $attributes['cardPadding'] ) && is_array( $attributes['cardPadding'] ) ? $attributes['cardPadding'] : [];
$pad     = [
	'top'    => $sanitizeLength( $padAttr['top'] ?? '', '16px' ),
	'right'  => $sanitizeLength( $padAttr['right'] ?? '', '16px' ),
	'bottom' => $sanitizeLength( $padAttr['bottom'] ?? '', '16px' ),
	'left'   => $sanitizeLength( $padAttr['left'] ?? '', '16px' ),
];

// --- Responsive column count (horizontal layout only) -----------------
$colAttr = isset( $attributes['columnCount'] ) && is_array( $attributes['columnCount'] ) ? $attributes['columnCount'] : [];
$cols    = [
	'desktop' => isset( $colAttr['desktop'] ) ? max( 1, min( 6, (int) $colAttr['desktop'] ) ) : 3,
	'tablet'  => isset( $colAttr['tablet'] ) ? max( 1, min( 6, (int) $colAttr['tablet'] ) ) : 2,
	'mobile'  => isset( $colAttr['mobile'] ) ? max( 1, min( 6, (int) $colAttr['mobile'] ) ) : 1,
];

// --- Build clean step list (skip rows that are entirely empty) ---------
$cleanSteps = [];
foreach ( $rawSteps as $step ) {
	$title = isset( $step['title'] ) ? trim( (string) $step['title'] ) : '';
	$desc  = isset( $step['description'] ) ? (string) $step['description'] : '';
	$icon  = isset( $step['icon'] ) ? $sanitizeIconClass( $step['icon'] ) : '';

	$descStripped = trim( wp_strip_all_tags( $desc ) );
	if ( '' === $title && '' === $descStripped ) {
		continue;
	}

	$cleanSteps[] = [
		'title'       => $title,
		'description' => $desc,
		'icon'        => $icon,
	];
}

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-ps-badge-size:' . $badgeSize . 'px',
	'--bb-ps-badge-bg:' . $badgeBg,
	'--bb-ps-badge-color:' . $badgeColor,
	'--bb-ps-badge-font-size:' . $badgeFontSize . 'px',
	'--bb-ps-badge-radius:' . $badgeBorderRadius . '%',
	'--bb-ps-connector-color:' . $connectorColor,
	'--bb-ps-connector-width:' . $connectorWidth . 'px',
	'--bb-ps-connector-style:' . $connectorStyle,
	'--bb-ps-title-color:' . ( '' === $titleColor ? 'inherit' : $titleColor ),
	'--bb-ps-title-font-size:' . ( '' === $titleFont['desktop'] ? '18px' : $titleFont['desktop'] ),
	'--bb-ps-title-font-size-tablet:' . ( '' === $titleFont['tablet'] ? ( '' === $titleFont['desktop'] ? '18px' : $titleFont['desktop'] ) : $titleFont['tablet'] ),
	'--bb-ps-title-font-size-mobile:' . ( '' === $titleFont['mobile'] ? ( '' === $titleFont['tablet'] ? ( '' === $titleFont['desktop'] ? '18px' : $titleFont['desktop'] ) : $titleFont['tablet'] ) : $titleFont['mobile'] ),
	'--bb-ps-desc-color:' . ( '' === $descColor ? 'inherit' : $descColor ),
	'--bb-ps-desc-font-size:' . ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ),
	'--bb-ps-desc-font-size-tablet:' . ( '' === $descFont['tablet'] ? ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ) : $descFont['tablet'] ),
	'--bb-ps-desc-font-size-mobile:' . ( '' === $descFont['mobile'] ? ( '' === $descFont['tablet'] ? ( '' === $descFont['desktop'] ? '15px' : $descFont['desktop'] ) : $descFont['tablet'] ) : $descFont['mobile'] ),
	'--bb-ps-card-bg:' . ( '' === $cardBg ? 'transparent' : $cardBg ),
	'--bb-ps-card-radius:' . $cardBorderRadius . 'px',
	'--bb-ps-card-padding:' . $pad['top'] . ' ' . $pad['right'] . ' ' . $pad['bottom'] . ' ' . $pad['left'],
	'--bb-ps-gap:' . $gap['desktop'],
	'--bb-ps-gap-tablet:' . ( '' === $gap['tablet'] ? $gap['desktop'] : $gap['tablet'] ),
	'--bb-ps-gap-mobile:' . ( '' === $gap['mobile'] ? ( '' === $gap['tablet'] ? $gap['desktop'] : $gap['tablet'] ) : $gap['mobile'] ),
	'--bb-ps-cols:' . $cols['desktop'],
	'--bb-ps-cols-tablet:' . $cols['tablet'],
	'--bb-ps-cols-mobile:' . $cols['mobile'],
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-ps-block'
	. ' bb-ps-layout--' . $layout
	. ' bb-ps-theme--' . $theme
	. ' bb-ps-align--' . $alignment
	. ' bb-ps-badge--' . $badgeType
	. ( $showConnector ? ' has-connector' : ' no-connector' )
);

$listAriaLabel = __( 'Process steps', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( empty( $cleanSteps ) ) : ?>
		<p class='bb-ps-empty'><?php esc_html_e( 'No steps to display.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<ol class='bb-ps-list' aria-label='<?php echo esc_attr( $listAriaLabel ); ?>'>
			<?php foreach ( $cleanSteps as $idx => $step ) :
				$stepNumber = $idx + 1;
				$stepTitle  = $step['title'];
				$stepDesc   = $step['description'];
				$stepIcon   = $step['icon'];
				?>
				<li class='bb-ps-step'>
					<div class='bb-ps-step__badge' aria-hidden='true'>
						<?php if ( 'icon' === $badgeType && '' !== $stepIcon ) : ?>
							<i class='<?php echo esc_attr( $stepIcon ); ?>' aria-hidden='true'></i>
						<?php else : ?>
							<span class='bb-ps-step__number'><?php echo esc_html( (string) $stepNumber ); ?></span>
						<?php endif; ?>
					</div>

					<div class='bb-ps-step__body'>
						<?php if ( '' !== $stepTitle ) : ?>
							<<?php echo tag_escape( $titleTag ); ?> class='bb-ps-step__title'>
								<?php echo esc_html( $stepTitle ); ?>
							</<?php echo tag_escape( $titleTag ); ?>>
						<?php endif; ?>

						<?php if ( '' !== trim( wp_strip_all_tags( $stepDesc ) ) ) : ?>
							<div class='bb-ps-step__description'>
								<?php echo wp_kses_post( $stepDesc ); ?>
							</div>
						<?php endif; ?>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
	<?php endif; ?>
</div>
