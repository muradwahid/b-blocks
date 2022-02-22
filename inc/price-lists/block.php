<?php
class BBlocksPriceLists extends BBlocks{
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
		$priceListsStyle = new BBlocksStyleGenerator();
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists", [
			'grid-gap' => "$rowGap $columnGap"
		] );
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice", [
			'text-align' => $textAlign,
			'padding' => $padding['styles'] ?? '50px 20px'
		] );
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productImage", [
			'margin' => $imgMargin['styles'] ?? '0 0 20px 0'
		] );
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productName", [
			$nameTypo['styles'] ?? 'font-size: 18px; font-weight: 600;' => '',
			'margin' => $nameMargin['styles'] ?? '0 0 10px 0'
		] );
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productDescription", [
			$descTypo['styles'] ?? 'font-size: 15px; font-style: italic;' => '',
			'margin' => $descMargin['styles'] ?? '0 0 15px 0'
		] );
		$priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productPrice", [
			$priceTypo['styles'] ?? 'font-size: 24px; font-style: italic;' => ''
		] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-price-lists <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksPriceLists-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $nameTypo['googleFontLink'] ) ? "@import url(". esc_url( $nameTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $priceTypo['googleFontLink'] ) ? "@import url(". esc_url( $priceTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $priceListsStyle::renderStyle(), [] );
				foreach ( $products as $index => $product ) {
					extract( $product );
					$backgroundStyle = $background['styles'] ?? 'background-color: #0000;';
					$imgBorderStyle = $imgBorder['styles'] ?? '';
					$separatorStyle = $separator['styles'] ?? 'width: 40%; border-top: 1px solid #bbb;';

					$flipBoxStyles = "#bBlocksPriceLists-$cId #bBlocksPrice-$index{ $backgroundStyle  }
					#bBlocksPriceLists-$cId #bBlocksPrice-$index .productImage{ $imgBorderStyle }
					#bBlocksPriceLists-$cId #bBlocksPrice-$index .productName{ color: $nameColor; }
					#bBlocksPriceLists-$cId #bBlocksPrice-$index .productDescription{ color: $descColor; }
					#bBlocksPriceLists-$cId #bBlocksPrice-$index .productPrice{ color: $priceColor; }
					#bBlocksPriceLists-$cId #bBlocksPrice-$index .productSeparator{ $separatorStyle }";
					echo esc_html( $flipBoxStyles );
				} ?>
			</style>

			<div class='bBlocksPriceLists <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
				<?php foreach ( $products as $index => $product ) {
					extract( $product );
					// Classes
					$imgClass = isset( $img['id'] ) ? 'wp-image-'.$img['id'] : ''; ?>

					<div class='bBlocksPrice' id='bBlocksPrice-<?php echo esc_attr( $index ); ?>'>
						<?php echo $img['url'] ? "<img class='productImage ". esc_attr( $imgClass ) ."' src='". esc_url( $img['url'] ) ."' alt='". esc_attr( $img['alt'] ) ."' />" : ''; ?>

						<div class='productDetails'>
							<h4 class='productName'><?php echo wp_kses_post( $name ); ?></h4>

							<?php echo $isDesc ? "<p class='productDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>

							<span class='productPrice'><?php echo wp_kses_post( $price ); ?></span>
						</div>

						<?php echo $isSep ? "<span class='productSeparator'></span>" : ''; ?>
					</div>
				<?php } ?>
			</div>
		</div>

		<?php $priceListsStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksPriceLists();