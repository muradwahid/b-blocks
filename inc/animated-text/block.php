<?php
class BBlocksAnimatedText extends BBlocks{
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

		// Enqueue assets where has block
		wp_enqueue_script( 'textillate' );
		wp_enqueue_style( 'animate' );

		$className = $className ?? '';
		$blockClassName = 'wp-block-b-blocks-animated-text ' . $className . ' align' . $align;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksAnimatedText-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
	}
}
new BBlocksAnimatedText();