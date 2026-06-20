<?php
$prefix = 'bBlocksCallToAction';
$id = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

use BBlocks\Inc\GetCSS as GetCSS;

if ( !function_exists( 'bBlocksCallToActionStyle' ) ) {
	function bBlocksCallToActionStyle( $attributes, $id, $prefix ) {
		$layout              = $attributes['layout'] ?? 'centered';
		$textAlign           = $attributes['textAlign'] ?? 'center';
		$background          = $attributes['background'] ?? [];
		$headingTypography   = $attributes['headingTypography'] ?? [];
		$subTypography       = $attributes['subTypography'] ?? [];
		$headingColor        = $attributes['headingColor'] ?? '#ffffff';
		$subColor            = $attributes['subColor'] ?? '#e8f0fe';
		$primaryBtnColors    = $attributes['primaryBtnColors'] ?? [];
		$secondaryBtnColors  = $attributes['secondaryBtnColors'] ?? [];
		$btnBorderRadius     = $attributes['btnBorderRadius'] ?? '6px';
		$padding             = $attributes['padding'] ?? [];
		$borderRadius        = $attributes['borderRadius'] ?? '12px';
		$shadow              = $attributes['shadow'] ?? [];

		$desktopPad = $padding['desktop'] ?? '60px 40px';
		$tabletPad  = $padding['tablet'] ?? $desktopPad;
		$mobilePad  = $padding['mobile'] ?? $tabletPad;

		$mainSl = "#$id";
		$ctaSl  = "$mainSl .$prefix";

		$primaryColor  = $primaryBtnColors['color'] ?? '#1a73e8';
		$primaryBg     = $primaryBtnColors['bg'] ?? '#ffffff';
		$primaryHovC   = $primaryBtnColors['hoverColor'] ?? '#ffffff';
		$primaryHovBg  = $primaryBtnColors['hoverBg'] ?? '#1557b0';

		$secColor   = $secondaryBtnColors['color'] ?? '#ffffff';
		$secBg      = $secondaryBtnColors['bg'] ?? 'transparent';
		$secHovC    = $secondaryBtnColors['hoverColor'] ?? '#ffffff';
		$secHovBg   = $secondaryBtnColors['hoverBg'] ?? 'rgba(255,255,255,0.15)';

		$style = new BBlocksStyleGenerator();
		$style::addStyle( "$ctaSl", [
			GetCSS::getBackgroundCSS( $background ) => '',
			'padding'       => $desktopPad,
			'border-radius' => $borderRadius,
			'box-shadow'    => GetCSS::getShadowCSS( $shadow ),
			'text-align'    => $textAlign,
		] );
		$style::addStyle( "$ctaSl .ctaHeading", [
			'color'  => $headingColor,
			'margin' => '0 0 12px 0',
		] );
		$style::addStyle( "$ctaSl .ctaSubText", [
			'color'  => $subColor,
			'margin' => '0 0 24px 0',
		] );
		$style::addStyle( "$ctaSl .ctaButton", [
			'border-radius' => $btnBorderRadius,
		] );
		$style::addStyle( "$ctaSl .ctaButtonPrimary", [
			'color'      => $primaryColor,
			'background' => $primaryBg,
		] );
		$style::addStyle( "$ctaSl .ctaButtonPrimary:hover", [
			'color'      => $primaryHovC,
			'background' => $primaryHovBg,
		] );
		$style::addStyle( "$ctaSl .ctaButtonPrimary:focus-visible", [
			'color'      => $primaryHovC,
			'background' => $primaryHovBg,
		] );
		$style::addStyle( "$ctaSl .ctaButtonSecondary", [
			'color'      => $secColor,
			'background' => $secBg,
			'border'     => "2px solid $secColor",
		] );
		$style::addStyle( "$ctaSl .ctaButtonSecondary:hover", [
			'color'      => $secHovC,
			'background' => $secHovBg,
		] );
		$style::addStyle( "$ctaSl .ctaButtonSecondary:focus-visible", [
			'color'      => $secHovC,
			'background' => $secHovBg,
		] );

		$tabBreakpoint    = '@media only screen and (max-width: 1024px)';
		$mobileBreakpoint = '@media only screen and (max-width: 640px)';

		$responsive = "$tabBreakpoint { $ctaSl { padding: $tabletPad; } } $mobileBreakpoint { $ctaSl { padding: $mobilePad; } }";

		return GetCSS::getTypoCSS( '', $headingTypography )['googleFontLink'] .
			GetCSS::getTypoCSS( '', $subTypography )['googleFontLink'] .
			GetCSS::getTypoCSS( "$ctaSl .ctaHeading", $headingTypography )['styles'] .
			GetCSS::getTypoCSS( "$ctaSl .ctaSubText", $subTypography )['styles'] .
			$style::renderStyle() .
			$responsive;
	}
}

$layout          = $attributes['layout'] ?? 'centered';
$layout          = in_array( $layout, [ 'centered', 'horizontal' ], true ) ? $layout : 'centered';
$headingTag      = $attributes['headingTag'] ?? 'h2';
$headingTag      = in_array( $headingTag, [ 'h2', 'h3', 'h4' ], true ) ? $headingTag : 'h2';
$heading         = $attributes['heading'] ?? '';
$subText         = $attributes['subText'] ?? '';
$primaryLabel    = $attributes['primaryLabel'] ?? '';
$primaryUrl      = $attributes['primaryUrl'] ?? '#';
$primaryTarget   = !empty( $attributes['primaryTarget'] );
$showSecondary   = !empty( $attributes['showSecondary'] );
$secondaryLabel  = $attributes['secondaryLabel'] ?? '';
$secondaryUrl    = $attributes['secondaryUrl'] ?? '#';
$secondaryTarget = !empty( $attributes['secondaryTarget'] );

// Strip tags from heading for aria-label (text-only)
$ariaLabel = trim( wp_strip_all_tags( $heading ) );
if ( '' === $ariaLabel ) {
	$ariaLabel = __( 'Call to action', 'b-blocks' );
}

$primaryTab     = $primaryTarget ? '_blank' : '';
$primaryRel     = $primaryTarget ? 'noopener noreferrer' : '';
$primaryNewTab  = $primaryTarget ? '<span class="screen-reader-text"> ' . esc_html__( '(opens in a new tab)', 'b-blocks' ) . '</span>' : '';

$secondaryTab    = $secondaryTarget ? '_blank' : '';
$secondaryRel    = $secondaryTarget ? 'noopener noreferrer' : '';
$secondaryNewTab = $secondaryTarget ? '<span class="screen-reader-text"> ' . esc_html__( '(opens in a new tab)', 'b-blocks' ) . '</span>' : '';

$wrapperClasses = $planClass . ' cta-layout-' . esc_attr( $layout );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( bBlocksCallToActionStyle( $attributes, $id, $prefix ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS output, no HTML tags possible after wp_strip_all_tags() ?>
	</style>

	<section
		class='<?php echo esc_attr( $prefix . ' ctaLayout-' . $layout ); ?>'
		role='region'
		aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
	>
		<div class='ctaContent'>
			<?php if ( $heading ) : ?>
				<<?php echo esc_attr( $headingTag ); ?> class='ctaHeading'><?php echo wp_kses_post( $heading ); ?></<?php echo esc_attr( $headingTag ); ?>>
			<?php endif; ?>

			<?php if ( $subText ) : ?>
				<p class='ctaSubText'><?php echo wp_kses_post( $subText ); ?></p>
			<?php endif; ?>
		</div>

		<div class='ctaActions'>
			<?php if ( $primaryLabel ) : ?>
				<a
					class='ctaButton ctaButtonPrimary'
					href='<?php echo esc_url( $primaryUrl ?: '#' ); ?>'
					<?php if ( $primaryTab ) : ?>target='<?php echo esc_attr( $primaryTab ); ?>'<?php endif; ?>
					<?php if ( $primaryRel ) : ?>rel='<?php echo esc_attr( $primaryRel ); ?>'<?php endif; ?>
				><?php echo esc_html( $primaryLabel ); echo wp_kses_post( $primaryNewTab ); ?></a>
			<?php endif; ?>

			<?php if ( $showSecondary && $secondaryLabel ) : ?>
				<a
					class='ctaButton ctaButtonSecondary'
					href='<?php echo esc_url( $secondaryUrl ?: '#' ); ?>'
					<?php if ( $secondaryTab ) : ?>target='<?php echo esc_attr( $secondaryTab ); ?>'<?php endif; ?>
					<?php if ( $secondaryRel ) : ?>rel='<?php echo esc_attr( $secondaryRel ); ?>'<?php endif; ?>
				><?php echo esc_html( $secondaryLabel ); echo wp_kses_post( $secondaryNewTab ); ?></a>
			<?php endif; ?>
		</div>
	</section>
</div>
