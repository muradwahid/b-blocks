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

        $linkTarget = $linkTarget ?? ''; // added in v 3.0.2

		// Generate Styles
		$sliderStyle = new BBlocksStyleGenerator();
		$sliderStyle::addStyle( "#bBlocksSlider-$cId", [ 'text-align' => $sliderAlign ] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider", [
			'width' => $sliderWidth,
			'height' => $sliderHeight
		] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .slide", [ 'height' => $sliderHeight ] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .slide .sliderTitle", [
			$titleTypo['styles'] ?? 'font-size: 25px;' => '',
		] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .slide .sliderDescription", [
			$descTypo['styles'] ?? 'font-size: 15px;' => '',
		] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .slide .sliderBtn", [
			$btnTypo['styles'] ?? 'font-size: 16px;' => '',
			'padding' => $btnPadding['styles'] ?? '12px 35px',
			$btnBorder['styles'] ?? 'border-radius: 3px;' => ''
		] );

		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .swiper-pagination .swiper-pagination-bullet", [
			'background' => $pageColor,
			'width' => $pageWidth,
			'height' => $pageHeight,
			$pageBorder['styles'] ?? 'border-radius: 50%;' => ''
		] );
		$sliderStyle::addStyle( "#bBlocksSlider-$cId .bBlocksSlider .swiper-button-prev, #bBlocksSlider-$cId .bBlocksSlider .swiper-button-next", [ 'color' => $prevNextColor ] );

		$jsonData = wp_json_encode( [ 'slides' => $slides, 'columns' => $columns, 'columnGap' => $columnGap, 'isLoop' => $isLoop, 'isTouchMove' => $isTouchMove, 'isAutoplay' => $isAutoplay, 'speed' => $speed, 'effect' => $effect, 'isPageClickable' => $isPageClickable, 'isPageDynamic' => $isPageDynamic ] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-slider <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksSlider-<?php echo esc_attr( $cId ); ?>' data-slider='<?php echo esc_attr( $jsonData ); ?>'>
			<style>
				<?php echo !empty( $titleTypo['googleFontLink'] ) ? "@import url(". esc_url( $titleTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $btnTypo['googleFontLink'] ) ? "@import url(". esc_url( $btnTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $sliderStyle::renderStyle(), [] );
				foreach ( $slides as $index => $slide ) {
					extract( $slide );
					$backgroundStyle = $background['styles'] ?? 'background-color: #00000080;';
					$titleColor = $titleColor ?? '#fff';
					$descColor = $descColor ?? '#fff';
					$btnStyle = $btnColors['styles'] ?? 'color: #fff; background: #4527a4;';
					$btnHovStyle = $btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;';

					$slideStyles = "#bBlocksSlider-$cId .bBlocksSlider .slide-$index{ $backgroundStyle }
					#bBlocksSlider-$cId .bBlocksSlider .slide-$index .sliderTitle{ color: $titleColor }
					#bBlocksSlider-$cId .bBlocksSlider .slide-$index .sliderDescription{ color: $descColor }
					#bBlocksSlider-$cId .bBlocksSlider .slide-$index .sliderBtn{ $btnStyle }
					#bBlocksSlider-$cId .bBlocksSlider .slide-$index .sliderBtn:hover{ $btnHovStyle }";
					echo esc_html( $slideStyles );
				} ?>
			</style>
			<style class='bBlocksSliderStyle'></style>

			<div class='bBlocksSlider'>
				<div class='swiper-wrapper'>
					<?php foreach ( $slides as $index => $slide ) {
						extract( $slide );
						$btnLinkURL = $btnLink ?? ''; ?>

						<div class='slide slide-<?php echo esc_attr( $index ); ?> swiper-slide'>
							<div class='sliderContent <?php echo esc_attr( str_replace( ' ', '-', $position ?? 'center center' ) ); ?>'>
								
								<?php echo $isTitle && !empty( $title ) ? "<h2 class='sliderTitle'>". wp_kses_post( $title ) ."</h2>" : ''; ?>

								<?php echo $isDesc && !empty( $description ) ? "<p class='sliderDescription'>". wp_kses_post( $description ) ."</p>" : ''; ?>

								<?php echo $isBtn && !empty( $btnText ) ? "<a href='$btnLinkURL' class='sliderBtn' target='$linkTarget' rel='noreferrer'>". wp_kses_post( $btnText ) ."</a>" : ''; ?>
							</div>
						</div>
					<?php } ?>
				</div>

				<?php echo $isPage ? "<div class='swiper-pagination'></div>" : ''; ?>
				<?php echo $isPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : ''; ?>
			</div>
		</div>

		<?php $sliderStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksSlider();