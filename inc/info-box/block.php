<?php
class BBlocksInfoBox extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes ){
		extract( $attributes );

		$className = $className ?? '';
		$bBlocksInfoBoxClassName = 'wp-block-b-blocks-info-box ' . $className . ' align' . $align;

		// Generate Styles
		$infoBoxStyle = new BBlocksStyleGenerator();
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId", [
			'text-align' => $infoBoxAlign
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox", [
			'text-align' => $textAlign,
			'width' => '0px' === $width || '0%' === $width || '0em' === $width ? '100%' : $width,
			$background['styles'] ?? 'background-color: #f1f7ff;' => '',
			'padding' => $padding['styles'] ?? '50px 50px',
			$border['styles'] ?? 'border: 10px solid #fff; border-radius: 5px;' => '',
			'box-shadow' => $shadow['styles'] ?? 'none'
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon", [
			'margin' => $iconMargin['styles'] ?? '0px 0px 20px 0px'
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon i", [
			$icon['styles'] ?? 'font-size: 70px; color: #4527a4;' => ''
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxTitle", [
			$titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
			'color' => $titleColor,
			'margin' => $titleMargin['styles'] ?? '0px 0px 10px 0px'
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxDescription", [
			$descTypo['styles'] ?? 'font-size: 15px;' => '',
			'color' => $descColor,
			'margin' => $descMargin['styles'] ?? '0px 0px 15px 0px'
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton", [
			$btnTypo['styles'] ?? 'font-size: 15px;' => '',
			$btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
			'padding' => $btnPadding['styles'] ?? '8px 15px',
			$btnBorder['styles'] ?? 'border-radius: 5px;' => '',
		] );
		$infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton:hover", [
			$btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
		] );

		$btnTab = $isLinkNewTab ? '_blank' : '';

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksInfoBoxClassName ); ?>' id='bBlocksInfoBox-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $titleTypo['googleFontLink'] ) ? "@import url(". esc_url( $titleTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $btnTypo['googleFontLink'] ) ? "@import url(". esc_url( $btnTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $infoBoxStyle::renderStyle(), [] ); ?>
			</style>

			<div class='bBlocksInfoBox'>
				<?php echo $isIcon && $icon['class'] ? "<div class='infoBoxIcon'><i class='". esc_html( $icon['class'] ) ."'></i></div>" : ''; ?>
				<?php echo $title ? "<h3 class='infoBoxTitle'>". wp_kses_post( $title ) ."</h3>" : ''; ?>
				<?php echo $isDesc && $desc ? "<p class='infoBoxDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
				<?php echo $isBtn && $btn ? "<a href='". esc_url( $btnLink ) ."' class='infoBoxButton' target='". esc_attr( $btnTab ) ."' rel='noreferrer noopener'>". wp_kses_post( $btn ) ."</a>" : ''; ?>
			</div>
		</div>
		<?php $infoBoxStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksInfoBox();