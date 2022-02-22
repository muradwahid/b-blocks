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
		<div class='wp-block-b-blocks-cards <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksCards-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $catTypo['googleFontLink'] ) ? "@import url(". esc_url( $catTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $titleTypo['googleFontLink'] ) ? "@import url(". esc_url( $titleTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $cardsStyle::renderStyle(), [] );
				foreach ( $cards as $index => $card ) {
					extract( $card );
					$backgroundStyle = $background['styles'] ?? 'background-color: #0000;';
					$imgBorderStyle = $imgBorder['styles'] ?? 'border-radius: 5px;';

					$cardStyles = "#bBlocksCards-$cId #bBlocksCard-$index .bBlocksCard{ $backgroundStyle }
					#bBlocksCards-$cId #bBlocksCard-$index .cardImage{ $imgBorderStyle }
					#bBlocksCards-$cId #bBlocksCard-$index .cardDetails .cardCategory{ color: $catColor; }
					#bBlocksCards-$cId #bBlocksCard-$index .cardTitle{ color: $titleColor; }
					#bBlocksCards-$cId #bBlocksCard-$index .cardDescription{ color: $descColor; }";
					echo esc_html( $cardStyles );
				} ?>
			</style>

			<div class='bBlocksCards <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
				<?php foreach ( $cards as $index => $card ) {
					extract( $card );
					// Classes
					$imgClass = isset( $img['id'] ) ? 'wp-image-'.$img['id'] : '';

					// Components
					$cardTitle = $isTitle && $title ? "<h3 class='cardTitle'>$title</h3>" : '';
					$cardTitleInImage = 'image' === $titlePos ? $cardTitle : '';
					$cardTitleInContent = 'content' === $titlePos ? $cardTitle : '';

					$cardImage = $img['url'] ? "<figure class='cardImage'>
						<img class='$imgClass' src='". $img['url'] ."' alt='". $img['alt'] ."' /> $cardTitleInImage
					</figure>" : '';

					$cardImageInTop =  'top' === $imgPos ? $cardImage : '';
					$cardImageInBottom =  'bottom' === $imgPos ? $cardImage : ''; ?>

					<div id='bBlocksCard-<?php echo esc_attr( $index ); ?>'>
						<div class='bBlocksCard <?php echo 'bottom' === $imgPos ? 'bottomImg' : 'topImg'; ?>'>
							<?php echo wp_kses_post( $cardImageInTop ); ?>

							<div class='cardDetails'>
								<?php echo $isCat && $cat ? "<h6 class='cardCategory'>". wp_kses_post( $cat ) ."</h6>" : ''; ?>

								<?php echo wp_kses_post( $cardTitleInContent ); ?>

								<?php echo $isDesc && $desc ? "<p class='cardDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
							</div>

							<?php echo wp_kses_post( $cardImageInBottom ); ?>
						</div>
					</div>
				<?php } ?>
			</div>
		</div>

		<?php $cardsStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksCards();