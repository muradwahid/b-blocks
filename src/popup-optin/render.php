<?php
/**
 * Popup Optin block server-side render.
 *
 * Renders an accessible, auto-triggered lead-capture popup. The wrapper is
 * output hidden (display:none + aria-hidden) so that without JavaScript the
 * popup never appears (graceful degradation). view.js reveals it once the
 * configured trigger (time delay / scroll depth / exit intent) fires, then
 * traps focus, locks body scroll, and handles dismissal + suppression via
 * localStorage.
 *
 * Form submissions are POSTed to admin-ajax.php (action: bb_popup_optin_submit)
 * and emailed by includes/blocks/popup-optin/PopupOptinHandler.php. The mail
 * recipient is resolved entirely server-side from the saved block attributes
 * (per-block override, else site admin email) — the client never supplies the
 * recipient, so this is not an open mail relay.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix = 'bBlocksPopupOptin';
$id     = wp_unique_id( "$prefix-" );

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, named, or var()). ---
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
	// var(--token) with an optional comma fallback (hardened allowlist).
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
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

// --- Resolve and sanitize attributes. ---
$triggerType = isset( $attributes['triggerType'] ) ? sanitize_key( (string) $attributes['triggerType'] ) : 'time';
$triggerType = in_array( $triggerType, [ 'time', 'scroll', 'exit' ], true ) ? $triggerType : 'time';

$triggerDelay     = $clampInt( $attributes['triggerDelay'] ?? 5, 1, 60, 5 );
$triggerScrollPct = $clampInt( $attributes['triggerScrollPct'] ?? 50, 10, 100, 50 );
$suppressDays     = $clampInt( $attributes['suppressDays'] ?? 7, 0, 365, 7 );

$suppressKey = isset( $attributes['suppressKey'] ) ? (string) $attributes['suppressKey'] : 'bb-popup-optin';
$suppressKey = preg_replace( '/[^a-zA-Z0-9_\-]/', '', $suppressKey );
if ( '' === $suppressKey ) {
	$suppressKey = 'bb-popup-optin';
}
// Per-instance suppression key so multiple blocks suppress independently.
$instanceKey = 'bb-po-' . $id;

$headline = isset( $attributes['headline'] ) ? (string) $attributes['headline'] : '';
$subtext  = isset( $attributes['subtext'] ) ? (string) $attributes['subtext'] : '';

$headlineTag = isset( $attributes['headlineTag'] ) ? sanitize_key( (string) $attributes['headlineTag'] ) : 'h2';
$headlineTag = in_array( $headlineTag, [ 'h2', 'h3', 'h4' ], true ) ? $headlineTag : 'h2';

$showNameField   = isset( $attributes['showNameField'] ) ? (bool) $attributes['showNameField'] : false;
$namePlaceholder = isset( $attributes['namePlaceholder'] ) ? sanitize_text_field( (string) $attributes['namePlaceholder'] ) : __( 'Your name', 'b-blocks' );
$emailPlaceholder = isset( $attributes['emailPlaceholder'] ) ? sanitize_text_field( (string) $attributes['emailPlaceholder'] ) : __( 'Your email address', 'b-blocks' );

$ctaLabel = isset( $attributes['ctaLabel'] ) ? sanitize_text_field( (string) $attributes['ctaLabel'] ) : __( 'Subscribe', 'b-blocks' );
if ( '' === trim( $ctaLabel ) ) {
	$ctaLabel = __( 'Subscribe', 'b-blocks' );
}

$dismissLabel  = isset( $attributes['dismissLabel'] ) ? sanitize_text_field( (string) $attributes['dismissLabel'] ) : __( 'No thanks', 'b-blocks' );
$showDismiss   = '' !== trim( $dismissLabel );
$successMessage = isset( $attributes['successMessage'] ) ? sanitize_text_field( (string) $attributes['successMessage'] ) : __( "Thanks! You're on the list.", 'b-blocks' );

$showCloseButton    = isset( $attributes['showCloseButton'] ) ? (bool) $attributes['showCloseButton'] : true;
$overlayCloseOnClick = isset( $attributes['overlayCloseOnClick'] ) ? (bool) $attributes['overlayCloseOnClick'] : true;

$openAnimation = isset( $attributes['openAnimation'] ) ? sanitize_key( (string) $attributes['openAnimation'] ) : 'fade-scale';
$openAnimation = in_array( $openAnimation, [ 'fade-scale', 'slide-up', 'none' ], true ) ? $openAnimation : 'fade-scale';
$animationDuration = $clampInt( $attributes['animationDuration'] ?? 300, 100, 600, 300 );

$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 480, 320, 800, 480 );
$borderRadius = $clampInt( $attributes['borderRadius'] ?? 12, 0, 32, 12 );
$padding    = $clampInt( $attributes['padding'] ?? 32, 12, 80, 32 );
$headlineFontSize = $clampInt( $attributes['headlineFontSize'] ?? 24, 14, 48, 24 );
$subtextFontSize  = $clampInt( $attributes['subtextFontSize'] ?? 15, 12, 24, 15 );
$inputBorderRadius = $clampInt( $attributes['inputBorderRadius'] ?? 6, 0, 24, 6 );

$headlineFontWeight = isset( $attributes['headlineFontWeight'] ) ? preg_replace( '/[^0-9]/', '', (string) $attributes['headlineFontWeight'] ) : '700';
$headlineFontWeight = in_array( $headlineFontWeight, [ '400', '500', '600', '700', '800' ], true ) ? $headlineFontWeight : '700';

$overlayColor    = $sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.6)' );
$bgColor         = $sanitizeColor( $attributes['bgColor'] ?? '', '#ffffff' );
$textColor       = $sanitizeColor( $attributes['textColor'] ?? '', '#1a1a1a' );
$accentColor     = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );
$accentTextColor = $sanitizeColor( $attributes['accentTextColor'] ?? '', '#ffffff' );
$inputBorderColor = $sanitizeColor( $attributes['inputBorderColor'] ?? '', '#dddddd' );

// Unique element IDs for ARIA wiring.
$headlineId = $id . '-title';
$descId     = $id . '-desc';

// Per-instance CSS variables, scoped under the unique wrapper id.
$css  = "#$id.bb-po {";
$css .= "--bb-po-overlay: $overlayColor;";
$css .= "--bb-po-bg: $bgColor;";
$css .= "--bb-po-text: $textColor;";
$css .= "--bb-po-accent: $accentColor;";
$css .= "--bb-po-accent-text: $accentTextColor;";
$css .= "--bb-po-input-border: $inputBorderColor;";
$css .= "--bb-po-max-w: {$maxWidth}px;";
$css .= "--bb-po-radius: {$borderRadius}px;";
$css .= "--bb-po-pad: {$padding}px;";
$css .= "--bb-po-headline-size: {$headlineFontSize}px;";
$css .= "--bb-po-headline-weight: $headlineFontWeight;";
$css .= "--bb-po-subtext-size: {$subtextFontSize}px;";
$css .= "--bb-po-input-radius: {$inputBorderRadius}px;";
$css .= "--bb-po-anim: {$animationDuration}ms;";
$css .= "}";

// Config consumed by view.js. No recipient/email config is exposed here.
$config = wp_json_encode(
	[
		'id'                 => $id,
		'suppressKey'        => $instanceKey,
		'triggerType'        => $triggerType,
		'triggerDelay'       => $triggerDelay,
		'triggerScrollPct'   => $triggerScrollPct,
		'suppressDays'       => $suppressDays,
		'openAnimation'      => $openAnimation,
		'animationDuration'  => $animationDuration,
		'overlayCloseOnClick' => $overlayCloseOnClick,
	]
);

// The post the block lives on; used server-side to resolve the mail recipient.
$post_id = get_the_ID();
$post_id = $post_id ? (int) $post_id : 0;

$nonce   = wp_create_nonce( 'bb_popup_optin_submit' );
$ajaxUrl = admin_url( 'admin-ajax.php' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-po bb-po-anim-' . $openAnimation ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-po
	data-bb-po-ajax='<?php echo esc_url( $ajaxUrl ); ?>'
	data-bb-po-config='<?php echo esc_attr( $config ); ?>'
	aria-hidden='true'
	hidden
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-po-overlay' data-bb-po-overlay></div>

	<div
		class='bb-po-card'
		role='dialog'
		aria-modal='true'
		aria-labelledby='<?php echo esc_attr( $headlineId ); ?>'
		<?php echo '' !== trim( $subtext ) ? "aria-describedby='" . esc_attr( $descId ) . "'" : ''; ?>
	>
		<?php if ( $showCloseButton ) : ?>
			<button
				type='button'
				class='bb-po-close'
				data-bb-po-close
				aria-label='<?php echo esc_attr__( 'Close popup', 'b-blocks' ); ?>'
			>
				<span aria-hidden='true'>&times;</span>
			</button>
		<?php endif; ?>

		<?php if ( '' !== trim( $headline ) ) : ?>
			<<?php echo esc_attr( $headlineTag ); ?> id='<?php echo esc_attr( $headlineId ); ?>' class='bb-po-headline'>
				<?php echo wp_kses_post( $headline ); ?>
			</<?php echo esc_attr( $headlineTag ); ?>>
		<?php else : ?>
			<span id='<?php echo esc_attr( $headlineId ); ?>' class='screen-reader-text'>
				<?php echo esc_html__( 'Subscribe', 'b-blocks' ); ?>
			</span>
		<?php endif; ?>

		<?php if ( '' !== trim( $subtext ) ) : ?>
			<p id='<?php echo esc_attr( $descId ); ?>' class='bb-po-subtext'>
				<?php echo wp_kses_post( $subtext ); ?>
			</p>
		<?php endif; ?>

		<form class='bb-po-form' method='post' novalidate>
			<input type='hidden' name='action' value='bb_popup_optin_submit' />
			<input type='hidden' name='post_id' value='<?php echo esc_attr( (string) $post_id ); ?>' />
			<?php wp_nonce_field( 'bb_popup_optin_submit', '_wpnonce', false ); ?>

			<?php if ( $showNameField ) : ?>
				<label class='screen-reader-text' for='<?php echo esc_attr( $id ); ?>-name'>
					<?php echo esc_html__( 'Your name', 'b-blocks' ); ?>
				</label>
				<input
					type='text'
					id='<?php echo esc_attr( $id ); ?>-name'
					class='bb-po-input bb-po-input--name'
					name='bb_po_name'
					autocomplete='name'
					placeholder='<?php echo esc_attr( $namePlaceholder ); ?>'
				/>
			<?php endif; ?>

			<label class='screen-reader-text' for='<?php echo esc_attr( $id ); ?>-email'>
				<?php echo esc_html__( 'Your email address', 'b-blocks' ); ?>
			</label>
			<input
				type='email'
				id='<?php echo esc_attr( $id ); ?>-email'
				class='bb-po-input bb-po-input--email'
				name='bb_po_email'
				autocomplete='email'
				required
				placeholder='<?php echo esc_attr( $emailPlaceholder ); ?>'
			/>

			<button type='submit' class='bb-po-submit'>
				<?php echo esc_html( $ctaLabel ); ?>
			</button>

			<?php if ( $showDismiss ) : ?>
				<button type='button' class='bb-po-dismiss' data-bb-po-dismiss>
					<?php echo esc_html( $dismissLabel ); ?>
				</button>
			<?php endif; ?>
		</form>

		<p
			class='bb-po-status'
			data-bb-po-success='<?php echo esc_attr( $successMessage ); ?>'
			hidden
		></p>
	</div>
</div>
