<?php
class BBlocksPricingTable extends BBlocks{
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

		$className = $className ?? 'is-style-basic';

		$isStandard = false !== strpos($className, 'standard');
		$isUltimate = false !== strpos($className, 'ultimate');

		$basicClass = !$isStandard && !$isUltimate ? ' is-style-basic': '';
		$bBlocksPTableClassName = 'wp-block-b-blocks-pricing-table ' . $className . $basicClass . ' align' . $align;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksPTableClassName ); ?>' id='bBlocksPricingTables-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
	}
}
new BBlocksPricingTable();