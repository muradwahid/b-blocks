<?php
/**
 * Interactive Checklist Block server-side render.
 *
 * Renders a titled card containing a native, keyboard-operable checklist:
 * each item is a <label> wrapping an <input type="checkbox">. The list is
 * fully functional without JavaScript; view.js adds localStorage
 * persistence, a live progress indicator, and a reset button.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as key-takeaways, urgency-timer, icon-list).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksInteractiveChecklist';
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

$checkboxStyle = isset( $attributes['checkboxStyle'] ) ? sanitize_key( (string) $attributes['checkboxStyle'] ) : 'square';
$checkboxStyle = in_array( $checkboxStyle, [ 'square', 'round' ], true ) ? $checkboxStyle : 'square';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left';

$itemFontWeight = isset( $attributes['itemFontWeight'] ) ? (string) $attributes['itemFontWeight'] : '400';
$itemFontWeight = in_array( $itemFontWeight, [ '400', '500', '600', '700' ], true ) ? $itemFontWeight : '400';

$headingFontWeight = isset( $attributes['headingFontWeight'] ) ? (string) $attributes['headingFontWeight'] : '700';
$headingFontWeight = in_array( $headingFontWeight, [ '400', '500', '600', '700' ], true ) ? $headingFontWeight : '700';

$showProgress  = ! isset( $attributes['showProgress'] ) || (bool) $attributes['showProgress'];
$showReset     = ! isset( $attributes['showReset'] ) || (bool) $attributes['showReset'];
$strikeChecked = ! isset( $attributes['strikeChecked'] ) || (bool) $attributes['strikeChecked'];

$accentColor = $sanitizeColor( $attributes['accentColor'] ?? '', '#4f46e5' );
$cardBg      = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$textColor   = $sanitizeColor( $attributes['textColor'] ?? '', '#1a1a1a' );
$borderColor = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );

$headingFontSize   = $clampInt( $attributes['headingFontSize'] ?? 20, 14, 36, 20 );
$itemFontSize      = $clampInt( $attributes['itemFontSize'] ?? 16, 12, 28, 16 );
$progressFontSize  = $clampInt( $attributes['progressFontSize'] ?? 13, 11, 18, 13 );
$checkboxSize      = $clampInt( $attributes['checkboxSize'] ?? 20, 14, 32, 20 );
$itemGap           = $clampInt( $attributes['itemGap'] ?? 12, 4, 40, 12 );
$paddingVertical   = $clampInt( $attributes['paddingVertical'] ?? 24, 0, 80, 24 );
$paddingHorizontal = $clampInt( $attributes['paddingHorizontal'] ?? 28, 0, 80, 28 );
$borderRadius      = $clampInt( $attributes['borderRadius'] ?? 12, 0, 48, 12 );
$borderWidth       = $clampInt( $attributes['borderWidth'] ?? 1, 0, 8, 1 );
$maxWidth          = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1200, 0 );

// --- persistKey: stable per-instance localStorage key ------------------
// Restrict to a safe, predictable character set; blank => fall back to the
// per-instance wrapper id so each checklist is independent.
$persistKey = isset( $attributes['persistKey'] ) ? (string) $attributes['persistKey'] : '';
$persistKey = preg_replace( '/[^A-Za-z0-9_\-]/', '', $persistKey );
if ( '' === $persistKey ) {
	$persistKey = $id;
}

// --- Build clean items list (skip empty rows, dedupe ids) --------------
$cleanItems = [];
$usedIds    = [];
$autoIndex  = 0;
foreach ( $rawItems as $item ) {
	$label      = isset( $item['label'] ) ? (string) $item['label'] : '';
	$labelStrip = trim( wp_strip_all_tags( $label ) );
	if ( '' === $labelStrip ) {
		continue;
	}

	$itemId = isset( $item['id'] ) ? preg_replace( '/[^A-Za-z0-9_\-]/', '', (string) $item['id'] ) : '';
	if ( '' === $itemId || in_array( $itemId, $usedIds, true ) ) {
		$itemId = 'item-' . ( ++$autoIndex );
		while ( in_array( $itemId, $usedIds, true ) ) {
			$itemId = 'item-' . ( ++$autoIndex );
		}
	}
	$usedIds[]    = $itemId;
	$cleanItems[] = [
		'id'    => $itemId,
		'label' => $labelStrip,
	];
}

$total = count( $cleanItems );

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-cl-accent:' . $accentColor,
	'--bb-cl-card-bg:' . $cardBg,
	'--bb-cl-text-color:' . $textColor,
	'--bb-cl-border-width:' . $borderWidth . 'px',
	'--bb-cl-border-color:' . ( '' === $borderColor ? 'transparent' : $borderColor ),
	'--bb-cl-radius:' . $borderRadius . 'px',
	'--bb-cl-heading-size:' . $headingFontSize . 'px',
	'--bb-cl-heading-weight:' . $headingFontWeight,
	'--bb-cl-item-size:' . $itemFontSize . 'px',
	'--bb-cl-item-weight:' . $itemFontWeight,
	'--bb-cl-progress-size:' . $progressFontSize . 'px',
	'--bb-cl-checkbox-size:' . $checkboxSize . 'px',
	'--bb-cl-item-gap:' . $itemGap . 'px',
	'--bb-cl-pad-v:' . $paddingVertical . 'px',
	'--bb-cl-pad-h:' . $paddingHorizontal . 'px',
	'--bb-cl-max-width:' . ( $maxWidth > 0 ? $maxWidth . 'px' : 'none' ),
	'--bb-cl-progress-pct:0%',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-cl'
	. ' bb-cl-align--' . $alignment
	. ' bb-cl-checkbox--' . $checkboxStyle
	. ( $borderWidth > 0 ? ' has-border' : '' )
	. ( $strikeChecked ? ' has-strike' : '' )
);

$headingTextStripped = trim( wp_strip_all_tags( $headingText ) );
$showHeading         = '' !== $headingTextStripped;
$headingId           = $showHeading ? ( $id . '-heading' ) : '';

/* translators: 1: number of completed items, 2: total number of items. */
$progressTemplate = __( '%1$s of %2$s complete', 'b-blocks' );
$initialProgress  = sprintf( $progressTemplate, 0, $total );
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-key='<?php echo esc_attr( $persistKey ); ?>'
	data-strike='<?php echo esc_attr( $strikeChecked ? '1' : '0' ); ?>'
	<?php if ( $showHeading ) : ?>
	aria-labelledby='<?php echo esc_attr( $headingId ); ?>'
	<?php endif; ?>
>
	<?php if ( $showHeading ) : ?>
		<?php
		printf(
			'<%1$s id="%2$s" class="bb-cl-heading">%3$s</%1$s>',
			tag_escape( $headingTag ),
			esc_attr( $headingId ),
			wp_kses_post( $headingText )
		);
		?>
	<?php endif; ?>

	<?php if ( $showProgress && $total > 0 ) : ?>
		<div class='bb-cl-progress'>
			<p
				class='bb-cl-progress-text'
				aria-live='polite'
				aria-atomic='true'
				data-template='<?php echo esc_attr( $progressTemplate ); ?>'
			><?php echo esc_html( $initialProgress ); ?></p>
			<div class='bb-cl-progress-track' aria-hidden='true'>
				<span class='bb-cl-progress-fill'></span>
			</div>
		</div>
	<?php endif; ?>

	<?php if ( empty( $cleanItems ) ) : ?>
		<p class='bb-cl-empty'><?php esc_html_e( 'No checklist items to display.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<ul class='bb-cl-list'>
			<?php foreach ( $cleanItems as $item ) : ?>
				<?php $inputId = $id . '-' . $item['id']; ?>
				<li class='bb-cl-item'>
					<label class='bb-cl-label' for='<?php echo esc_attr( $inputId ); ?>'>
						<input
							type='checkbox'
							class='bb-cl-checkbox'
							id='<?php echo esc_attr( $inputId ); ?>'
							data-item-id='<?php echo esc_attr( $item['id'] ); ?>'
						/>
						<span class='bb-cl-box' aria-hidden='true'></span>
						<span class='bb-cl-text'><?php echo esc_html( $item['label'] ); ?></span>
					</label>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( $showReset && $total > 0 ) : ?>
		<button
			type='button'
			class='bb-cl-reset'
			aria-label='<?php esc_attr_e( 'Reset checklist progress', 'b-blocks' ); ?>'
			data-confirm='<?php esc_attr_e( 'Reset your checklist progress?', 'b-blocks' ); ?>'
		><?php esc_html_e( 'Reset progress', 'b-blocks' ); ?></button>
	<?php endif; ?>
</section>
