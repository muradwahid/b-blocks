<?php
/**
 * Key Takeaways Block server-side render.
 *
 * Renders a titled summary card as a <section> landmark containing a
 * heading bar and a semantic list (<ul> for check/bullet, <ol> for
 * numbered) of takeaway items. Purely static — no frontend JavaScript.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as icon-list, contact-card, callout).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksKeyTakeaways';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named) -----
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
	// Allow CSS custom property references — fallback value restricted to safe chars only.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Sanitize a Font Awesome icon class string -------------------------
// Allow letters, digits, hyphens, spaces. Cap at 80 chars.
$sanitizeIconClass = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value || strlen( $value ) > 80 ) {
		return '';
	}
	if ( ! preg_match( '/^[a-zA-Z0-9\-\s]+$/', $value ) ) {
		return '';
	}
	return $value;
};

// --- Clamp helper ------------------------------------------------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	return max( $min, min( $max, (int) $value ) );
};

// --- Resolve and sanitize attributes -----------------------------------
$rawItems = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : [];

$headingText = isset( $attributes['headingText'] ) ? (string) $attributes['headingText'] : '';

$headingTag = isset( $attributes['headingTag'] ) ? strtolower( sanitize_key( (string) $attributes['headingTag'] ) ) : 'h3';
$headingTag = in_array( $headingTag, [ 'h2', 'h3', 'h4' ], true ) ? $headingTag : 'h3';

$listStyle = isset( $attributes['listStyle'] ) ? sanitize_key( (string) $attributes['listStyle'] ) : 'check';
$listStyle = in_array( $listStyle, [ 'check', 'numbered', 'bullet' ], true ) ? $listStyle : 'check';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment = in_array( $alignment, [ 'left', 'center' ], true ) ? $alignment : 'left';

$itemFontWeight = isset( $attributes['itemFontWeight'] ) ? (string) $attributes['itemFontWeight'] : '400';
$itemFontWeight = in_array( $itemFontWeight, [ '400', '500', '600', '700' ], true ) ? $itemFontWeight : '400';

$headingFontWeight = isset( $attributes['headingFontWeight'] ) ? (string) $attributes['headingFontWeight'] : '700';
$headingFontWeight = in_array( $headingFontWeight, [ '400', '500', '600', '700' ], true ) ? $headingFontWeight : '700';

$showIcon  = ! isset( $attributes['showIcon'] ) || (bool) $attributes['showIcon'];
$iconClass = isset( $attributes['iconClass'] ) ? $sanitizeIconClass( $attributes['iconClass'] ) : '';
if ( '' === $iconClass ) {
	$iconClass = 'fas fa-check-circle';
}

$iconColor    = $sanitizeColor( $attributes['iconColor'] ?? '', '#ffffff' );
$accentColor  = $sanitizeColor( $attributes['accentColor'] ?? '', '#0d6efd' );
$cardBg       = $sanitizeColor( $attributes['cardBg'] ?? '', '#f0f6ff' );
$textColor    = $sanitizeColor( $attributes['textColor'] ?? '', '#1e293b' );
$headingColor = $sanitizeColor( $attributes['headingColor'] ?? '', '#ffffff' );
$borderColor  = $sanitizeColor( $attributes['borderColor'] ?? '', '' );

$borderRadius      = $clampInt( $attributes['borderRadius'] ?? 8, 0, 48, 8 );
$borderWidth       = $clampInt( $attributes['borderWidth'] ?? 0, 0, 8, 0 );
$itemFontSize      = $clampInt( $attributes['itemFontSize'] ?? 16, 12, 28, 16 );
$headingFontSize   = $clampInt( $attributes['headingFontSize'] ?? 18, 12, 32, 18 );
$iconSize          = $clampInt( $attributes['iconSize'] ?? 18, 10, 32, 18 );
$paddingVertical   = $clampInt( $attributes['paddingVertical'] ?? 20, 0, 64, 20 );
$paddingHorizontal = $clampInt( $attributes['paddingHorizontal'] ?? 24, 0, 64, 24 );
$itemGap           = $clampInt( $attributes['itemGap'] ?? 10, 0, 40, 10 );
$maxWidth          = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1200, 0 );

// --- Build clean items list (skip empty rows) --------------------------
$cleanItems = [];
foreach ( $rawItems as $item ) {
	$text      = isset( $item['text'] ) ? (string) $item['text'] : '';
	$textStrip = trim( wp_strip_all_tags( $text ) );
	if ( '' === $textStrip ) {
		continue;
	}
	$cleanItems[] = $text;
}

$listTag = 'numbered' === $listStyle ? 'ol' : 'ul';

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-kt-accent:' . $accentColor,
	'--bb-kt-card-bg:' . $cardBg,
	'--bb-kt-text-color:' . $textColor,
	'--bb-kt-heading-color:' . $headingColor,
	'--bb-kt-icon-color:' . $iconColor,
	'--bb-kt-radius:' . $borderRadius . 'px',
	'--bb-kt-border-width:' . $borderWidth . 'px',
	'--bb-kt-border-color:' . ( '' === $borderColor ? 'transparent' : $borderColor ),
	'--bb-kt-item-size:' . $itemFontSize . 'px',
	'--bb-kt-item-weight:' . $itemFontWeight,
	'--bb-kt-heading-size:' . $headingFontSize . 'px',
	'--bb-kt-heading-weight:' . $headingFontWeight,
	'--bb-kt-icon-size:' . $iconSize . 'px',
	'--bb-kt-pad-v:' . $paddingVertical . 'px',
	'--bb-kt-pad-h:' . $paddingHorizontal . 'px',
	'--bb-kt-item-gap:' . $itemGap . 'px',
	'--bb-kt-max-width:' . ( $maxWidth > 0 ? $maxWidth . 'px' : 'none' ),
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-kt-block'
	. ' bb-kt-align--' . $alignment
	. ' bb-kt-style--' . $listStyle
	. ( $borderWidth > 0 ? ' has-border' : '' )
);

$headingId = $id . '-heading';
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	aria-labelledby='<?php echo esc_attr( $headingId ); ?>'
>
	<?php
	printf(
		'<%1$s id="%2$s" class="bb-kt-heading">%3$s</%1$s>',
		tag_escape( $headingTag ),
		esc_attr( $headingId ),
		'' !== trim( wp_strip_all_tags( $headingText ) ) ? wp_kses_post( $headingText ) : esc_html__( 'Key Takeaways', 'b-blocks' )
	);
	?>

	<div class='bb-kt-body'>
		<?php if ( empty( $cleanItems ) ) : ?>
			<p class='bb-kt-empty'><?php esc_html_e( 'No takeaways to display.', 'b-blocks' ); ?></p>
		<?php else : ?>
			<<?php echo tag_escape( $listTag ); ?> class='bb-kt-list' role='list'>
				<?php foreach ( $cleanItems as $itemText ) : ?>
					<li class='bb-kt-item'>
						<?php if ( $showIcon && 'check' === $listStyle ) : ?>
							<span class='bb-kt-icon' aria-hidden='true'>
								<i class='<?php echo esc_attr( $iconClass ); ?>'></i>
							</span>
						<?php elseif ( $showIcon && 'numbered' === $listStyle ) : ?>
							<span class='bb-kt-num' aria-hidden='true'></span>
						<?php elseif ( $showIcon && 'bullet' === $listStyle ) : ?>
							<span class='bb-kt-bullet' aria-hidden='true'></span>
						<?php endif; ?>
						<span class='bb-kt-text'><?php echo wp_kses_post( $itemText ); ?></span>
					</li>
				<?php endforeach; ?>
			</<?php echo tag_escape( $listTag ); ?>>
		<?php endif; ?>
	</div>
</section>
