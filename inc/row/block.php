<?php
class BBlocksRow extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes, $content ){
		extract( $attributes );

		ob_start(); ?>
		<div class='wp-block-b-blocks-row <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksRow-<?php echo esc_attr( $cId ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>
			<div class='bBlocksRowStyle'></div>

			<div class='bBlocksRow'>
				<?php echo wp_kses_post( $content ); ?>
			</div>
		</div>

		<?php return ob_get_clean();
	}
}
new BBlocksRow();