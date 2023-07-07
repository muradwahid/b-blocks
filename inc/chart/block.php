<?php
class BBlocksChart extends BBlocks{
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

		wp_enqueue_style( 'b-blocks-chart-style' );
		wp_enqueue_script( 'b-blocks-chart-script', B_BLOCKS_DIST . 'chart.js', [ 'react', 'react-dom', 'chart' ], B_BLOCKS_VERSION, true );

		$className = $className ?? '';
		$blockClassName = "wp-block-b-blocks-chart $className align$align";

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksChart-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
	}
}
new BBlocksChart();