<?php
/**
 * Coupon Code Block server-side render.
 *
 * Renders a styled coupon or deal card. The coupon variant exposes a real
 * <button> that copies the code to the clipboard on the frontend (view.js)
 * with an optional reveal/blur gate before the code is shown. The deal
 * variant renders a CTA anchor that links straight to the affiliate URL.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as code-highlight, howto-schema, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksCouponCode';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, or named) -----------
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

// --- Sanitize a CSS length token ("16px", "1rem", "0", etc.) -----------
$sanitizeCssLength = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(?:\.\d+)?(px|em|rem|%)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Allow-listed alignment values --------------------------------------
$allowedAlignments = [ 'left', 'center', 'right' ];

// --- Resolve and clamp attributes --------------------------------------
$couponCode      = isset( $attributes['couponCode'] ) ? trim( (string) $attributes['couponCode'] ) : '';
$couponTypeRaw   = isset( $attributes['couponType'] ) ? strtolower( trim( (string) $attributes['couponType'] ) ) : 'coupon';
$couponType      = ( 'deal' === $couponTypeRaw ) ? 'deal' : 'coupon';

$title           = isset( $attributes['title'] ) ? trim( (string) $attributes['title'] ) : '';
$description     = isset( $attributes['description'] ) ? (string) $attributes['description'] : '';
$discountLabel   = isset( $attributes['discountLabel'] ) ? trim( (string) $attributes['discountLabel'] ) : '';

$affiliateUrl    = isset( $attributes['affiliateUrl'] ) ? trim( (string) $attributes['affiliateUrl'] ) : '';
$affiliateUrl    = '' !== $affiliateUrl ? esc_url_raw( $affiliateUrl ) : '';

$buttonLabel     = isset( $attributes['buttonLabel'] ) ? trim( (string) $attributes['buttonLabel'] ) : '';
$buttonLabel     = '' !== $buttonLabel ? $buttonLabel : __( 'Copy Code', 'b-blocks' );

$copiedLabel     = isset( $attributes['copiedLabel'] ) ? trim( (string) $attributes['copiedLabel'] ) : '';
$copiedLabel     = '' !== $copiedLabel ? $copiedLabel : __( 'Copied!', 'b-blocks' );

$dealButtonLabel = isset( $attributes['dealButtonLabel'] ) ? trim( (string) $attributes['dealButtonLabel'] ) : '';
$dealButtonLabel = '' !== $dealButtonLabel ? $dealButtonLabel : __( 'Get This Deal', 'b-blocks' );

$revealMode      = ! empty( $attributes['revealMode'] ) && 'coupon' === $couponType;
$revealButtonLabel = isset( $attributes['revealButtonLabel'] ) ? trim( (string) $attributes['revealButtonLabel'] ) : '';
$revealButtonLabel = '' !== $revealButtonLabel ? $revealButtonLabel : __( 'Reveal Code', 'b-blocks' );

$expiryText      = isset( $attributes['expiryText'] ) ? trim( (string) $attributes['expiryText'] ) : '';

$alignmentRaw    = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'center';
$alignment       = in_array( $alignmentRaw, $allowedAlignments, true ) ? $alignmentRaw : 'center';

$openInNewTab    = isset( $attributes['openInNewTab'] ) ? (bool) $attributes['openInNewTab'] : true;
$showNofollow    = isset( $attributes['showNofollow'] ) ? (bool) $attributes['showNofollow'] : true;

// --- Color tokens (defaults match block.json) --------------------------
$colors = isset( $attributes['colors'] ) && is_array( $attributes['colors'] ) ? $attributes['colors'] : [];
$bgColor          = $sanitizeColor( $colors['bg']           ?? '#f9f9f9', '#f9f9f9' );
$textColor        = $sanitizeColor( $colors['text']         ?? '#333333', '#333333' );
$codeBgColor      = $sanitizeColor( $colors['codeBg']       ?? '#ffffff', '#ffffff' );
$codeTextColor    = $sanitizeColor( $colors['codeText']     ?? '#333333', '#333333' );
$buttonBgColor    = $sanitizeColor( $colors['buttonBg']     ?? '#0073aa', '#0073aa' );
$buttonTextColor  = $sanitizeColor( $colors['buttonText']   ?? '#ffffff', '#ffffff' );
$discountBgColor  = $sanitizeColor( $colors['discountBg']   ?? '#0073aa', '#0073aa' );
$discountTextColor = $sanitizeColor( $colors['discountText'] ?? '#ffffff', '#ffffff' );

// --- Border / padding / typography --------------------------------------
$border = isset( $attributes['border'] ) && is_array( $attributes['border'] ) ? $attributes['border'] : [];
$borderWidth  = $sanitizeCssLength( $border['width']  ?? '1px', '1px' );
$borderRadius = $sanitizeCssLength( $border['radius'] ?? '8px', '8px' );
$borderColor  = $sanitizeColor( $border['color'] ?? '#dddddd', '#dddddd' );

$padding = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop    = $sanitizeCssLength( $padding['top']    ?? '20px', '20px' );
$padRight  = $sanitizeCssLength( $padding['right']  ?? '24px', '24px' );
$padBottom = $sanitizeCssLength( $padding['bottom'] ?? '20px', '20px' );
$padLeft   = $sanitizeCssLength( $padding['left']   ?? '24px', '24px' );

$codeFontSize = $sanitizeCssLength( $attributes['codeFontSize'] ?? '20px', '20px' );

// --- Build wrapper classes / style --------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-coupon-code'
	. ' bb-cc-type--' . $couponType
	. ' bb-cc-align--' . $alignment
	. ( $revealMode ? ' bb-cc-has-reveal is-hidden' : '' )
);

$wrapperStyleParts = [
	'--bb-cc-bg:'             . $bgColor,
	'--bb-cc-text:'           . $textColor,
	'--bb-cc-code-bg:'        . $codeBgColor,
	'--bb-cc-code-text:'      . $codeTextColor,
	'--bb-cc-btn-bg:'         . $buttonBgColor,
	'--bb-cc-btn-text:'       . $buttonTextColor,
	'--bb-cc-discount-bg:'    . $discountBgColor,
	'--bb-cc-discount-text:'  . $discountTextColor,
	'--bb-cc-border-width:'   . $borderWidth,
	'--bb-cc-border-color:'   . $borderColor,
	'--bb-cc-radius:'         . $borderRadius,
	'--bb-cc-pad-top:'        . $padTop,
	'--bb-cc-pad-right:'      . $padRight,
	'--bb-cc-pad-bottom:'     . $padBottom,
	'--bb-cc-pad-left:'       . $padLeft,
	'--bb-cc-code-font-size:' . $codeFontSize,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

// --- rel attribute for affiliate links ----------------------------------
$relParts = [];
if ( $showNofollow ) {
	$relParts[] = 'nofollow';
	$relParts[] = 'sponsored';
}
if ( $openInNewTab ) {
	$relParts[] = 'noopener';
	$relParts[] = 'noreferrer';
}
$relAttr = implode( ' ', array_unique( $relParts ) );

$codeRegionId = $id . '-code';

// --- ARIA labels --------------------------------------------------------
$ariaCopyLabel = '' !== $couponCode
	/* translators: %s: the coupon code */
	? sprintf( __( 'Copy coupon code: %s', 'b-blocks' ), $couponCode )
	: __( 'Copy coupon code', 'b-blocks' );

$ariaCopiedLabel = __( 'Coupon code copied to clipboard', 'b-blocks' );

$ariaDealLabel = '' !== $discountLabel
	/* translators: 1: discount label, 2: deal CTA label */
	? sprintf( __( 'Get this deal: %1$s — %2$s', 'b-blocks' ), $discountLabel, $dealButtonLabel )
	: $dealButtonLabel;
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-bb-cc-type='<?php echo esc_attr( $couponType ); ?>'
	data-bb-cc-code='<?php echo esc_attr( $couponCode ); ?>'
	data-bb-cc-url='<?php echo esc_url( $affiliateUrl ); ?>'
	data-bb-cc-new-tab='<?php echo esc_attr( $openInNewTab ? '1' : '0' ); ?>'
	data-bb-cc-copy-label='<?php echo esc_attr( $buttonLabel ); ?>'
	data-bb-cc-copied-label='<?php echo esc_attr( $copiedLabel ); ?>'
	data-bb-cc-copied-aria='<?php echo esc_attr( $ariaCopiedLabel ); ?>'
	data-bb-cc-reveal='<?php echo esc_attr( $revealMode ? '1' : '0' ); ?>'
>
	<div class='bb-cc-card'>
		<?php if ( '' !== $discountLabel ) : ?>
			<div class='bb-cc-discount' aria-hidden='false'>
				<span class='bb-cc-discount__text'><?php echo esc_html( $discountLabel ); ?></span>
			</div>
		<?php endif; ?>

		<div class='bb-cc-body'>
			<?php if ( '' !== $title ) : ?>
				<h3 class='bb-cc-title'><?php echo esc_html( $title ); ?></h3>
			<?php endif; ?>

			<?php if ( '' !== trim( wp_strip_all_tags( $description ) ) ) : ?>
				<div class='bb-cc-description'>
					<?php echo wp_kses_post( $description ); ?>
				</div>
			<?php endif; ?>

			<?php if ( 'coupon' === $couponType ) : ?>
				<div class='bb-cc-code-row'>
					<?php if ( $revealMode ) : ?>
						<button
							type='button'
							class='bb-cc-reveal-btn'
							aria-expanded='false'
							aria-controls='<?php echo esc_attr( $codeRegionId ); ?>'
						>
							<span class='bb-cc-reveal-text'><?php echo esc_html( $revealButtonLabel ); ?></span>
						</button>
					<?php endif; ?>

					<button
						type='button'
						class='bb-cc-code-btn'
						id='<?php echo esc_attr( $codeRegionId ); ?>'
						aria-label='<?php echo esc_attr( $ariaCopyLabel ); ?>'
						data-default-aria='<?php echo esc_attr( $ariaCopyLabel ); ?>'
						<?php if ( $revealMode ) : ?>aria-hidden='true' tabindex='-1'<?php endif; ?>
					>
						<code class='bb-cc-code'><?php echo esc_html( '' !== $couponCode ? $couponCode : '—' ); ?></code>
						<span class='bb-cc-copy-label'><?php echo esc_html( $buttonLabel ); ?></span>
					</button>
				</div>
			<?php else : /* deal */ ?>
				<div class='bb-cc-code-row bb-cc-code-row--deal'>
					<?php if ( '' !== $affiliateUrl ) : ?>
						<a
							class='bb-cc-deal-btn'
							href='<?php echo esc_url( $affiliateUrl ); ?>'
							aria-label='<?php echo esc_attr( $ariaDealLabel ); ?>'
							<?php if ( '' !== $relAttr ) : ?>rel='<?php echo esc_attr( $relAttr ); ?>'<?php endif; ?>
							<?php if ( $openInNewTab ) : ?>target='_blank'<?php endif; ?>
						>
							<span class='bb-cc-deal-label'><?php echo esc_html( $dealButtonLabel ); ?></span>
							<?php if ( $openInNewTab ) : ?>
								<span class='screen-reader-text'> <?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
							<?php endif; ?>
						</a>
					<?php else : ?>
						<span class='bb-cc-deal-btn bb-cc-deal-btn--disabled' aria-disabled='true'>
							<?php echo esc_html( $dealButtonLabel ); ?>
						</span>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ( '' !== $expiryText ) : ?>
				<p class='bb-cc-expiry'>
					<span class='bb-cc-expiry__icon' aria-hidden='true'>
						<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'></circle><polyline points='12 6 12 12 16 14'></polyline></svg>
					</span>
					<time class='bb-cc-expiry__text'><?php echo esc_html( $expiryText ); ?></time>
				</p>
			<?php endif; ?>
		</div>
	</div>

	<span class='bb-cc-live' aria-live='polite' aria-atomic='true'></span>
</div>
