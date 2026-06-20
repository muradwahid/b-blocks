<?php
/**
 * Modal Popup block server-side render.
 *
 * Renders:
 *  - An inline trigger element (button, image, text, or icon).
 *  - A hidden modal template containing the inner block content,
 *    which the view.js script appends to <body> on the frontend so
 *    it escapes stacking-context issues.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksModalPopup';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

if ( ! function_exists( 'bblocks_modal_sanitize_color' ) ) {
	function bblocks_modal_sanitize_color( $color, $fallback = '#000000' ) {
		$color = trim( (string) $color );
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
	}
}

if ( ! function_exists( 'bblocks_modal_sanitize_dimension' ) ) {
	function bblocks_modal_sanitize_dimension( $value, $fallback = '0px' ) {
		$value = trim( (string) $value );
		if ( preg_match( '/^-?[0-9]+(\.[0-9]+)?(px|rem|em|%|vw|vh|vmin|vmax|pt|cm|mm|ex|ch)$/', $value ) ) {
			return $value;
		}
		return $fallback;
	}
}

// Pull attributes safely.
$triggerType        = isset( $attributes['triggerType'] ) ? sanitize_key( $attributes['triggerType'] ) : 'button';
$triggerType        = in_array( $triggerType, [ 'button', 'image', 'text', 'icon' ], true ) ? $triggerType : 'button';
$triggerLabel       = isset( $attributes['triggerLabel'] ) ? (string) $attributes['triggerLabel'] : __( 'Open', 'b-blocks' );
$triggerIcon        = isset( $attributes['triggerIcon'] ) && is_array( $attributes['triggerIcon'] ) ? $attributes['triggerIcon'] : [];
$triggerIconClass   = isset( $triggerIcon['class'] ) ? (string) $triggerIcon['class'] : 'fa-solid fa-circle-info';
$triggerIconSize    = isset( $triggerIcon['fontSize'] ) ? (int) $triggerIcon['fontSize'] : 24;
$triggerIconColor   = bblocks_modal_sanitize_color( isset( $triggerIcon['color'] ) ? $triggerIcon['color'] : '#0073aa', '#0073aa' );
$triggerImageUrl    = isset( $attributes['triggerImageUrl'] ) ? (string) $attributes['triggerImageUrl'] : '';
$triggerImageAlt    = isset( $attributes['triggerImageAlt'] ) ? (string) $attributes['triggerImageAlt'] : '';
$triggerAlign       = isset( $attributes['triggerAlign'] ) ? sanitize_key( $attributes['triggerAlign'] ) : 'left';
$triggerAlign       = in_array( $triggerAlign, [ 'left', 'center', 'right' ], true ) ? $triggerAlign : 'left';

$btnColors          = isset( $attributes['triggerBtnColors'] ) && is_array( $attributes['triggerBtnColors'] ) ? $attributes['triggerBtnColors'] : [];
$btnBg              = bblocks_modal_sanitize_color( isset( $btnColors['bg'] ) ? $btnColors['bg'] : '#0073aa', '#0073aa' );
$btnColor           = bblocks_modal_sanitize_color( isset( $btnColors['color'] ) ? $btnColors['color'] : '#ffffff', '#ffffff' );
$btnHoverBg         = bblocks_modal_sanitize_color( isset( $btnColors['hoverBg'] ) ? $btnColors['hoverBg'] : '#005177', '#005177' );
$btnHoverColor      = bblocks_modal_sanitize_color( isset( $btnColors['hoverColor'] ) ? $btnColors['hoverColor'] : '#ffffff', '#ffffff' );

$btnPadding         = isset( $attributes['triggerBtnPadding'] ) && is_array( $attributes['triggerBtnPadding'] ) ? $attributes['triggerBtnPadding'] : [];
$btnPadV            = bblocks_modal_sanitize_dimension( isset( $btnPadding['vertical'] ) ? $btnPadding['vertical'] : '10px', '10px' );
$btnPadH            = bblocks_modal_sanitize_dimension( isset( $btnPadding['horizontal'] ) ? $btnPadding['horizontal'] : '20px', '20px' );

$btnRadius          = bblocks_modal_sanitize_dimension( isset( $attributes['triggerBtnBorderRadius'] ) ? $attributes['triggerBtnBorderRadius'] : '4px', '4px' );

$triggerTypo        = isset( $attributes['triggerTypography'] ) && is_array( $attributes['triggerTypography'] ) ? $attributes['triggerTypography'] : [];
$triggerFontDesktop = bblocks_modal_sanitize_dimension( isset( $triggerTypo['fontSize']['desktop'] ) ? $triggerTypo['fontSize']['desktop'] : '16px', '16px' );
$triggerFontTablet  = bblocks_modal_sanitize_dimension( isset( $triggerTypo['fontSize']['tablet'] ) ? $triggerTypo['fontSize']['tablet'] : '15px', '15px' );
$triggerFontMobile  = bblocks_modal_sanitize_dimension( isset( $triggerTypo['fontSize']['mobile'] ) ? $triggerTypo['fontSize']['mobile'] : '14px', '14px' );

$modalSize          = isset( $attributes['modalSize'] ) ? sanitize_key( $attributes['modalSize'] ) : 'medium';
$modalSize          = in_array( $modalSize, [ 'small', 'medium', 'large', 'full' ], true ) ? $modalSize : 'medium';

$sizeMap            = [
	'small'  => '400px',
	'medium' => '600px',
	'large'  => '800px',
	'full'   => '100vw',
];
$modalWidth         = $sizeMap[ $modalSize ];

$modalBg            = bblocks_modal_sanitize_color( isset( $attributes['modalBgColor'] ) ? $attributes['modalBgColor'] : '#ffffff', '#ffffff' );
$overlayColor       = bblocks_modal_sanitize_color( isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)' );

$modalPadding       = isset( $attributes['modalPadding'] ) && is_array( $attributes['modalPadding'] ) ? $attributes['modalPadding'] : [];
$modalPadV          = bblocks_modal_sanitize_dimension( isset( $modalPadding['vertical'] ) ? $modalPadding['vertical'] : '30px', '30px' );
$modalPadH          = bblocks_modal_sanitize_dimension( isset( $modalPadding['horizontal'] ) ? $modalPadding['horizontal'] : '30px', '30px' );

$modalRadius        = bblocks_modal_sanitize_dimension( isset( $attributes['modalBorderRadius'] ) ? $attributes['modalBorderRadius'] : '8px', '8px' );

$showCloseButton    = isset( $attributes['showCloseButton'] ) ? (bool) $attributes['showCloseButton'] : true;
$closeOnOverlay     = isset( $attributes['closeOnOverlayClick'] ) ? (bool) $attributes['closeOnOverlayClick'] : true;
$closeOnEscape      = isset( $attributes['closeOnEscape'] ) ? (bool) $attributes['closeOnEscape'] : true;

$animation          = isset( $attributes['animation'] ) ? sanitize_key( $attributes['animation'] ) : 'fade';
$animation          = in_array( $animation, [ 'fade', 'slide-down', 'zoom', 'none' ], true ) ? $animation : 'fade';

$modalTitle         = isset( $attributes['modalTitle'] ) ? (string) $attributes['modalTitle'] : '';
$modalTitleTypo     = isset( $attributes['modalTitleTypography'] ) && is_array( $attributes['modalTitleTypography'] ) ? $attributes['modalTitleTypography'] : [];
$modalTitleFontD    = bblocks_modal_sanitize_dimension( isset( $modalTitleTypo['fontSize']['desktop'] ) ? $modalTitleTypo['fontSize']['desktop'] : '22px', '22px' );
$modalTitleFontT    = bblocks_modal_sanitize_dimension( isset( $modalTitleTypo['fontSize']['tablet'] ) ? $modalTitleTypo['fontSize']['tablet'] : '20px', '20px' );
$modalTitleFontM    = bblocks_modal_sanitize_dimension( isset( $modalTitleTypo['fontSize']['mobile'] ) ? $modalTitleTypo['fontSize']['mobile'] : '18px', '18px' );
$modalTitleWeight   = isset( $modalTitleTypo['fontWeight'] ) ? (int) $modalTitleTypo['fontWeight'] : 600;
$modalTitleColor    = bblocks_modal_sanitize_color( isset( $attributes['modalTitleColor'] ) ? $attributes['modalTitleColor'] : '#111111', '#111111' );

$titleId            = $id . '-title';

// Build sanitized inline CSS for this instance.
$css  = "#$id .modalTrigger { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }";
$css .= "#$id { text-align: $triggerAlign; }";

if ( 'button' === $triggerType ) {
	$css .= "#$id .modalTriggerButton {";
	$css .= "background-color: $btnBg;";
	$css .= "color: $btnColor;";
	$css .= "padding: $btnPadV $btnPadH;";
	$css .= "border-radius: $btnRadius;";
	$css .= "font-size: $triggerFontDesktop;";
	$css .= "}";
	$css .= "#$id .modalTriggerButton:hover, #$id .modalTriggerButton:focus-visible {";
	$css .= "background-color: $btnHoverBg;";
	$css .= "color: $btnHoverColor;";
	$css .= "}";
	$css .= "@media (max-width: 1024px) { #$id .modalTriggerButton { font-size: $triggerFontTablet; } }";
	$css .= "@media (max-width: 640px) { #$id .modalTriggerButton { font-size: $triggerFontMobile; } }";
}

if ( 'text' === $triggerType ) {
	$css .= "#$id .modalTriggerText { font-size: $triggerFontDesktop; color: $btnColor; }";
	$css .= "#$id .modalTriggerText:hover, #$id .modalTriggerText:focus-visible { color: $btnHoverColor; }";
	$css .= "@media (max-width: 1024px) { #$id .modalTriggerText { font-size: $triggerFontTablet; } }";
	$css .= "@media (max-width: 640px) { #$id .modalTriggerText { font-size: $triggerFontMobile; } }";
}

if ( 'icon' === $triggerType ) {
	$css .= "#$id .modalTriggerIcon i { font-size: {$triggerIconSize}px; color: $triggerIconColor; }";
	$css .= "#$id .modalTriggerIcon:hover i, #$id .modalTriggerIcon:focus-visible i { color: $btnHoverBg; }";
}

if ( 'image' === $triggerType ) {
	$css .= "#$id .modalTriggerImage img { max-width: 100%; height: auto; display: block; }";
}

// Modal dialog styles (the modal lives in a hidden template inside the block,
// but view.js moves it to <body>, where it picks up its own id-scoped CSS).
$css .= "#$id-modal .modalDialog {";
$css .= "background-color: $modalBg;";
$css .= "padding: $modalPadV $modalPadH;";
$css .= "border-radius: $modalRadius;";
$css .= "max-width: min($modalWidth, calc(100vw - 32px));";
$css .= "width: 100%;";
$css .= "}";
$css .= "#$id-modal .modalOverlay { background-color: $overlayColor; }";
$css .= "#$id-modal .modalTitle {";
$css .= "color: $modalTitleColor;";
$css .= "font-size: $modalTitleFontD;";
$css .= "font-weight: $modalTitleWeight;";
$css .= "margin: 0 0 16px 0;";
$css .= "line-height: 1.3;";
$css .= "}";
$css .= "@media (max-width: 1024px) { #$id-modal .modalTitle { font-size: $modalTitleFontT; } }";
$css .= "@media (max-width: 640px) { #$id-modal .modalTitle { font-size: $modalTitleFontM; } }";

if ( 'full' === $modalSize ) {
	$css .= "#$id-modal .modalDialog { max-width: 100vw; width: 100vw; height: 100vh; border-radius: 0; }";
}

// Serialize attrs for view.js consumption.
$dataAttrs = [
	'modalId'             => $id . '-modal',
	'triggerType'         => $triggerType,
	'showCloseButton'     => $showCloseButton,
	'closeOnOverlayClick' => $closeOnOverlay,
	'closeOnEscape'       => $closeOnEscape,
	'animation'           => $animation,
	'modalSize'           => $modalSize,
	'hasTitle'            => '' !== trim( $modalTitle ),
	'titleId'             => $titleId,
];

$wrapperClasses = trim( $planClass . ' modalTriggerAlign-' . $triggerAlign );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-modal-config='<?php echo esc_attr( wp_json_encode( $dataAttrs ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, stripped of any HTML tags. ?>
	</style>

	<?php if ( 'button' === $triggerType ) : ?>
		<button
			type='button'
			class='modalTrigger modalTriggerButton'
			aria-haspopup='dialog'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $id . '-modal' ); ?>'
			data-modal-trigger='<?php echo esc_attr( $id ); ?>'
		>
			<?php if ( $triggerIconClass ) : ?>
				<i class='<?php echo esc_attr( $triggerIconClass ); ?>' aria-hidden='true'></i>
			<?php endif; ?>
			<span><?php echo esc_html( $triggerLabel ); ?></span>
		</button>
	<?php elseif ( 'text' === $triggerType ) : ?>
		<button
			type='button'
			class='modalTrigger modalTriggerText'
			aria-haspopup='dialog'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $id . '-modal' ); ?>'
			data-modal-trigger='<?php echo esc_attr( $id ); ?>'
		>
			<?php echo esc_html( $triggerLabel ); ?>
		</button>
	<?php elseif ( 'icon' === $triggerType ) : ?>
		<button
			type='button'
			class='modalTrigger modalTriggerIcon'
			aria-haspopup='dialog'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $id . '-modal' ); ?>'
			aria-label='<?php echo esc_attr( $triggerLabel ? $triggerLabel : __( 'Open modal', 'b-blocks' ) ); ?>'
			data-modal-trigger='<?php echo esc_attr( $id ); ?>'
		>
			<i class='<?php echo esc_attr( $triggerIconClass ); ?>' aria-hidden='true'></i>
		</button>
	<?php elseif ( 'image' === $triggerType && $triggerImageUrl ) : ?>
		<button
			type='button'
			class='modalTrigger modalTriggerImage'
			aria-haspopup='dialog'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $id . '-modal' ); ?>'
			aria-label='<?php echo esc_attr( $triggerImageAlt ? $triggerImageAlt : ( $triggerLabel ? $triggerLabel : __( 'Open modal', 'b-blocks' ) ) ); ?>'
			data-modal-trigger='<?php echo esc_attr( $id ); ?>'
		>
			<img src='<?php echo esc_url( $triggerImageUrl ); ?>' alt='<?php echo esc_attr( $triggerImageAlt ); ?>' />
		</button>
	<?php else : ?>
		<button
			type='button'
			class='modalTrigger modalTriggerButton'
			aria-haspopup='dialog'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $id . '-modal' ); ?>'
			data-modal-trigger='<?php echo esc_attr( $id ); ?>'
		>
			<?php echo esc_html( $triggerLabel ? $triggerLabel : __( 'Open', 'b-blocks' ) ); ?>
		</button>
	<?php endif; ?>

	<template class='modalTemplate' data-modal-template-for='<?php echo esc_attr( $id ); ?>'>
		<div
			id='<?php echo esc_attr( $id . '-modal' ); ?>'
			class='bBlocksModalPopupRoot bb-anim-<?php echo esc_attr( $animation ); ?> modalSize-<?php echo esc_attr( $modalSize ); ?>'
			data-source-block='<?php echo esc_attr( $id ); ?>'
			hidden
		>
			<div class='modalOverlay' data-modal-overlay></div>
			<div
				class='modalDialog'
				role='dialog'
				aria-modal='true'
				<?php if ( '' !== trim( $modalTitle ) ) : ?>
					aria-labelledby='<?php echo esc_attr( $titleId ); ?>'
				<?php else : ?>
					aria-label='<?php echo esc_attr__( 'Modal', 'b-blocks' ); ?>'
				<?php endif; ?>
				tabindex='-1'
			>
				<?php if ( $showCloseButton ) : ?>
					<button
						type='button'
						class='modalClose'
						aria-label='<?php echo esc_attr__( 'Close modal', 'b-blocks' ); ?>'
						data-modal-close
					>
						<span aria-hidden='true'>&times;</span>
					</button>
				<?php endif; ?>

				<?php if ( '' !== trim( $modalTitle ) ) : ?>
					<h2 id='<?php echo esc_attr( $titleId ); ?>' class='modalTitle'>
						<?php echo wp_kses_post( $modalTitle ); ?>
					</h2>
				<?php endif; ?>

				<div class='modalContent'>
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered InnerBlocks output already escaped by core.
					echo $content;
					?>
				</div>
			</div>
		</div>
	</template>
</div>
