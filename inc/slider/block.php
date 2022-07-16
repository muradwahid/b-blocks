<?php
class BBlocksSlider extends BBlocks{
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
		$bBlocksSliderClassName = 'wp-block-b-blocks-slider ' . $className . ' align' . $align;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksSliderClassName ); ?>' id='bBlocksSlider-<?php echo esc_attr( $cId ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>
			<div class='bBlocksSliderStyle'></div>

			<div class='bBlocksSliderWrapper'></div>
		</div>

		<?php return ob_get_clean();
	}
}
new BBlocksSlider();