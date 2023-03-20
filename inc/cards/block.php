<?php
class BBlocksCards extends BBlocks{
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
		$blockClassName = 'wp-block-b-blocks-cards ' . $className . ' align' . $align;

		// Generate Styles
		$cardsStyle = new BBlocksStyleGenerator();
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards", [
			'grid-gap' => "$rowGap $columnGap"
		] );
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardImage img", [
			'height' => $imgHeight
		] );
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails", [
			'text-align' => $textAlign,
			'padding' => $padding['styles'] ?? '20px 10px'
		] );
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails .cardCategory", [
			$catTypo['styles'] ?? 'font-size: 15px;' => '',
			'margin' => $catMargin['styles'] ?? '0 0 10px 0'
		] );
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardTitle", [
			$titleTypo['styles'] ?? 'font-size: 22px;' => '',
			'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
		] );
		$cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDescription", [
			$catTypo['styles'] ?? 'font-size: 15px;' => ''
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksCards-<?php echo esc_attr( $cId ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ) ?>'></div>

		<?php $cardsStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksCards();