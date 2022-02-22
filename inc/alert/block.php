<?php
class BBlocksAlert extends BBlocks{
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

		// Generate Styles
		$alertStyle = new BBlocksStyleGenerator();
		$alertStyle::addStyle( "#bBlocksAlert-$cId .bBlocksAlert", [
			'text-align' => $alignment
		] );
		$alertStyle::addStyle( "#bBlocksAlert-$cId .bBlocksAlert .alert", [
			'text-align' => $textAlign,
			'width' => '0px' === $width || '0%' === $width || '0em' === $width ? 'auto' : $width,
			$typography['styles'] ?? 'font-size: 25px;' => '',
			$colors['styles'] ?? 'color: #333; background: #fff;' => '',
			'padding' => $padding['styles'] ?? '15px 30px',
			$border['styles'] ?? 'border: 2px solid #333; border-radius: 8px;' => '',
			'box-shadow' => $shadow['styles'] ?? 'none'
		] );
		$alertStyle::addStyle( "#bBlocksAlert-$cId .bBlocksAlert .alert .alertIcon", [
			'font-size' => $typography['fontSize'] ?? '25px',
			'color' => $colors['color'] ?? '#333'
		] );
		$alertStyle::addStyle( "#bBlocksAlert-$cId .bBlocksAlert .alert .alertClose", [
			'color' => $colors['color'] ?? '#333'
		] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-alert <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksAlert-<?php echo esc_attr( $cId ) ?>'>
			<style>
				<?php echo !empty( $typography['googleFontLink'] ) ? "@import url(". esc_url( $typography['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $alertStyle::renderStyle(), [] ) ?>
			</style>

			<div class='bBlocksAlert'>
				<div class='alert'>
					<?php echo $icon['class'] ? "<i class='". esc_attr( $icon['class'] ) ."'></i>" : ''; ?>

					<span class='alertMessage'><?php echo wp_kses_post( $message );?></span>

					<?php echo $isDismiss ? "<i class='alertClose fa fa-times-circle'></i>" : ''; ?>
				</div>
			</div>
		</div>

		<?php $alertStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksAlert();