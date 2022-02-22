<?php
class BBlocksGIF extends BBlocks{
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
		$gifStyle = new BBlocksStyleGenerator();
		$gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif", [
			'text-align' => $gifAlign
		] );
		$gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif figure", [
			'width' => '0px' === $gifWidth || '0%' === $gifWidth || '0em' === $gifWidth ? 'auto' : $gifWidth
		] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-gif <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksGif-<?php echo esc_attr( $cId ); ?>'>
			<style><?php echo wp_kses( $gifStyle::renderStyle(), [] ); ?></style>

			<div class='bBlocksGif'>
				<figure>
					<?php echo !empty( $gif ) ? "<img src='". esc_url( $gif['images']['original']['url'] ?? '' ) ."' alt='". esc_attr( $gif['title'] ?? '' ) ."' />" : ''; ?>
				</figure>
			</div>
		</div>
		<?php $gifStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksGIF();