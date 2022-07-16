<?php
class BBlocksLottiePlayer extends BBlocks{
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
		$bBlocksLottieClassName = 'wp-block-b-blocks-lottie-player ' . $className . ' align' . $align;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksLottieClassName ); ?>' id='bBlocksLottiePlayer-<?php echo esc_attr( $cId ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
	}
}
new BBlocksLottiePlayer();