<?php
/**
 * Newsletter Optin Block server-side render.
 *
 * Renders a static, accessible email subscribe <form>. The form works as
 * markup with no JavaScript; view.js progressively enhances submission to an
 * AJAX POST against admin-ajax.php (action: bb_newsletter_optin). A per-block
 * nonce is generated here and embedded in a data attribute. The AJAX handler
 * lives in includes/blocks/newsletter/NewsletterHandler.php.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. Helpers are inlined as static
 * closures (same pattern as coupon-code, code-highlight, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksNewsletterOptin';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, or named) -----------
$sanitizeColor = static function ( $color, $fallback ) {
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

// --- Clamp a numeric attribute to a range -------------------------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		$value = $fallback;
	}
	$value = (int) round( (float) $value );
	return max( $min, min( $max, $value ) );
};

$allowedAlignments   = [ 'left', 'center', 'right' ];
$allowedLayouts      = [ 'stacked', 'inline' ];
$allowedFontWeights  = [ '400', '500', '600', '700', '800' ];

// --- Resolve attributes -------------------------------------------------
$layoutRaw    = isset( $attributes['layout'] ) ? strtolower( trim( (string) $attributes['layout'] ) ) : 'stacked';
$layout       = in_array( $layoutRaw, $allowedLayouts, true ) ? $layoutRaw : 'stacked';

$alignmentRaw = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'center';
$alignment    = in_array( $alignmentRaw, $allowedAlignments, true ) ? $alignmentRaw : 'center';

$showHeadline = isset( $attributes['showHeadline'] ) ? (bool) $attributes['showHeadline'] : true;
$showSubtext  = isset( $attributes['showSubtext'] ) ? (bool) $attributes['showSubtext'] : true;
$showNameField = ! empty( $attributes['showNameField'] );

$headline = isset( $attributes['headline'] ) ? (string) $attributes['headline'] : '';
$subtext  = isset( $attributes['subtext'] ) ? (string) $attributes['subtext'] : '';

$namePlaceholder  = isset( $attributes['namePlaceholder'] ) ? (string) $attributes['namePlaceholder'] : '';
$namePlaceholder  = '' !== trim( $namePlaceholder ) ? $namePlaceholder : __( 'Your name', 'b-blocks' );

$emailPlaceholder = isset( $attributes['emailPlaceholder'] ) ? (string) $attributes['emailPlaceholder'] : '';
$emailPlaceholder = '' !== trim( $emailPlaceholder ) ? $emailPlaceholder : __( 'Your email address', 'b-blocks' );

$buttonText = isset( $attributes['buttonText'] ) ? (string) $attributes['buttonText'] : '';
$buttonText = '' !== trim( $buttonText ) ? $buttonText : __( 'Subscribe', 'b-blocks' );

$successMessage = isset( $attributes['successMessage'] ) ? (string) $attributes['successMessage'] : '';
$successMessage = '' !== trim( $successMessage ) ? $successMessage : __( 'Thank you for subscribing!', 'b-blocks' );

// adminEmail is intentionally not exposed to the frontend. The AJAX handler
// resolves the recipient server-side from saved block attributes. Keeping the
// variable avoids a PHP notice if other code paths reference it, but it is
// never passed to the client.
$adminEmailRaw = isset( $attributes['adminEmail'] ) ? sanitize_email( (string) $attributes['adminEmail'] ) : '';

// The post the block lives on; passed to the server so it can look up the
// per-block adminEmail override without trusting the client for the address.
$post_id = get_the_ID();
$post_id = $post_id ? (int) $post_id : 0;

$fontWeightHeadline = isset( $attributes['headlineFontWeight'] ) ? (string) $attributes['headlineFontWeight'] : '700';
$fontWeightHeadline = in_array( $fontWeightHeadline, $allowedFontWeights, true ) ? $fontWeightHeadline : '700';

$fontWeightButton = isset( $attributes['buttonFontWeight'] ) ? (string) $attributes['buttonFontWeight'] : '600';
$fontWeightButton = in_array( $fontWeightButton, $allowedFontWeights, true ) ? $fontWeightButton : '600';

$headlineFontSize = $clampInt( $attributes['headlineFontSize'] ?? 24, 14, 60, 24 );
$subtextFontSize  = $clampInt( $attributes['subtextFontSize'] ?? 16, 12, 32, 16 );
$inputFontSize    = $clampInt( $attributes['inputFontSize'] ?? 15, 12, 24, 15 );
$buttonFontSize   = $clampInt( $attributes['buttonFontSize'] ?? 15, 12, 24, 15 );

$borderRadius      = $clampInt( $attributes['borderRadius'] ?? 8, 0, 50, 8 );
$inputBorderRadius = $clampInt( $attributes['inputBorderRadius'] ?? 6, 0, 50, 6 );
$paddingVertical   = $clampInt( $attributes['paddingVertical'] ?? 40, 0, 120, 40 );
$paddingHorizontal = $clampInt( $attributes['paddingHorizontal'] ?? 40, 0, 120, 40 );
$fieldGap          = $clampInt( $attributes['fieldGap'] ?? 12, 4, 48, 12 );
$maxWidth          = $clampInt( $attributes['maxWidth'] ?? 600, 300, 1200, 600 );

$backgroundColor   = $sanitizeColor( $attributes['backgroundColor']   ?? '#f8f9fa', '#f8f9fa' );
$headlineColor     = $sanitizeColor( $attributes['headlineColor']     ?? '#1a1a1a', '#1a1a1a' );
$subtextColor      = $sanitizeColor( $attributes['subtextColor']      ?? '#555555', '#555555' );
$inputBgColor      = $sanitizeColor( $attributes['inputBgColor']      ?? '#ffffff', '#ffffff' );
$inputTextColor    = $sanitizeColor( $attributes['inputTextColor']    ?? '#333333', '#333333' );
$inputBorderColor  = $sanitizeColor( $attributes['inputBorderColor']  ?? '#cccccc', '#cccccc' );
$buttonBgColor     = $sanitizeColor( $attributes['buttonBgColor']     ?? '#0461c4', '#0461c4' );
$buttonTextColor   = $sanitizeColor( $attributes['buttonTextColor']   ?? '#ffffff', '#ffffff' );
$buttonHoverBgColor = $sanitizeColor( $attributes['buttonHoverBgColor'] ?? '#0461c4', '#0461c4' );

// --- Derived ids / labels ----------------------------------------------
$nameFieldId  = $id . '-name';
$emailFieldId = $id . '-email';
$statusId     = $id . '-status';

$headlineText = trim( wp_strip_all_tags( $headline ) );
$ariaFormLabel = '' !== $headlineText ? $headlineText : __( 'Newsletter signup', 'b-blocks' );

$nonce   = wp_create_nonce( 'bb_newsletter_optin' );
$ajaxUrl = admin_url( 'admin-ajax.php' );

// --- Wrapper classes / inline style ------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-newsletter-optin'
	. ' bb-no-layout--' . $layout
	. ' bb-no-align--' . $alignment
);

$wrapperStyleParts = [
	'--bb-no-bg:'            . $backgroundColor,
	'--bb-no-headline:'     . $headlineColor,
	'--bb-no-subtext:'      . $subtextColor,
	'--bb-no-input-bg:'     . $inputBgColor,
	'--bb-no-input-text:'   . $inputTextColor,
	'--bb-no-input-border:' . $inputBorderColor,
	'--bb-no-btn-bg:'       . $buttonBgColor,
	'--bb-no-btn-text:'     . $buttonTextColor,
	'--bb-no-btn-hover:'    . $buttonHoverBgColor,
	'--bb-no-radius:'       . $borderRadius . 'px',
	'--bb-no-input-radius:' . $inputBorderRadius . 'px',
	'--bb-no-pad-v:'        . $paddingVertical . 'px',
	'--bb-no-pad-h:'        . $paddingHorizontal . 'px',
	'--bb-no-gap:'          . $fieldGap . 'px',
	'--bb-no-max-width:'    . $maxWidth . 'px',
	'--bb-no-headline-fs:'  . $headlineFontSize . 'px',
	'--bb-no-headline-fw:'  . $fontWeightHeadline,
	'--bb-no-subtext-fs:'   . $subtextFontSize . 'px',
	'--bb-no-input-fs:'     . $inputFontSize . 'px',
	'--bb-no-btn-fs:'       . $buttonFontSize . 'px',
	'--bb-no-btn-fw:'       . $fontWeightButton,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$isInline = ( 'inline' === $layout );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-bb-no-ajax='<?php echo esc_url( $ajaxUrl ); ?>'
	data-bb-no-nonce='<?php echo esc_attr( $nonce ); ?>'
	data-bb-no-post-id='<?php echo esc_attr( (string) $post_id ); ?>'
	data-bb-no-success='<?php echo esc_attr( $successMessage ); ?>'
	data-bb-no-init='1'
>
	<div class='bb-no-inner'>
		<?php if ( $showHeadline && '' !== $headlineText ) : ?>
			<div class='bb-no-headline'><?php echo wp_kses_post( $headline ); ?></div>
		<?php endif; ?>

		<?php if ( $showSubtext && '' !== trim( wp_strip_all_tags( $subtext ) ) ) : ?>
			<div class='bb-no-subtext'><?php echo wp_kses_post( $subtext ); ?></div>
		<?php endif; ?>

		<form
			class='bb-no-form'
			method='post'
			action='<?php echo esc_url( $ajaxUrl ); ?>'
			novalidate
			aria-label='<?php echo esc_attr( $ariaFormLabel ); ?>'
		>
			<input type='hidden' name='action' value='bb_newsletter_optin' />
			<input type='hidden' name='post_id' value='<?php echo esc_attr( (string) $post_id ); ?>' />
			<?php wp_nonce_field( 'bb_newsletter_optin', '_wpnonce', false ); ?>
			<div class='bb-no-fields'>
				<?php if ( $showNameField ) : ?>
					<div class='bb-no-field bb-no-field--name'>
						<label class='bb-no-label<?php echo esc_attr( $isInline ? ' screen-reader-text' : '' ); ?>' for='<?php echo esc_attr( $nameFieldId ); ?>'>
							<?php echo esc_html( $namePlaceholder ); ?>
						</label>
						<input
							type='text'
							class='bb-no-input bb-no-input--name'
							id='<?php echo esc_attr( $nameFieldId ); ?>'
							name='bb_no_name'
							autocomplete='given-name'
							placeholder='<?php echo esc_attr( $namePlaceholder ); ?>'
						/>
					</div>
				<?php endif; ?>

				<div class='bb-no-field bb-no-field--email'>
					<label class='bb-no-label<?php echo esc_attr( $isInline ? ' screen-reader-text' : '' ); ?>' for='<?php echo esc_attr( $emailFieldId ); ?>'>
						<?php echo esc_html( $emailPlaceholder ); ?>
					</label>
					<input
						type='email'
						class='bb-no-input bb-no-input--email'
						id='<?php echo esc_attr( $emailFieldId ); ?>'
						name='bb_no_email'
						autocomplete='email'
						inputmode='email'
						required
						aria-required='true'
						placeholder='<?php echo esc_attr( $emailPlaceholder ); ?>'
					/>
				</div>

				<div class='bb-no-field bb-no-field--submit'>
					<button type='submit' class='bb-no-button'>
						<span class='bb-no-button__label'><?php echo esc_html( $buttonText ); ?></span>
					</button>
				</div>
			</div>
		</form>

		<p
			class='bb-no-status'
			id='<?php echo esc_attr( $statusId ); ?>'
			role='status'
			aria-live='polite'
			tabindex='-1'
			hidden
		></p>
	</div>
</div>
