<?php
class BBlocksFeatureBoxes extends BBlocks{
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
		$featureBoxesStyle = new BBlocksStyleGenerator();
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes", [
			'grid-gap' => "$rowGap $columnGap"
		] );
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature", [
			'text-align' => $textAlign,
			'padding' => $padding['styles'] ?? '50px 20px'
		] );
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureIcon", [
			'margin' => $iconMargin['styles'] ?? '0 0 10px 0'
		] );
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureTitle", [
			$titleTypo['styles'] ?? 'font-size: 20px; font-weight: 600;' => '',
			'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
		] );
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureSeparator", [
			'margin' => $sepMargin['styles'] ?? '0 0 10px 0'
		] );
		$featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureDescription", [
			$descTypo['styles'] ?? 'font-size: 15px;' => ''
		] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-feature-boxes <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksFeatureBoxes-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $titleTypo['googleFontLink'] ) ? "@import url(". esc_url( $titleTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $featureBoxesStyle::renderStyle(), [] );
				foreach ( $features as $index => $feature ) {
					extract( $feature );
					$backgroundStyle = $background['styles'] ?? 'background-color: #0000;';
					$iconStyle = $icon['styles'] ?? 'font-size: 120px;';
					$separatorStyle = $separator['styles'] ?? 'width: 20%; border-top: 1px solid #bbb;';

					$featureStyles = "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index{ $backgroundStyle }
					#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon i{ $iconStyle }
					#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon img{ width: $iconWidth; }
					#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureTitle{ color: $titleColor; }
					#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureSeparator{ $separatorStyle }
					#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureDescription{ color: $descColor; }";
					echo esc_html( $featureStyles );
				} ?>
			</style>

			<div class='bBlocksFeatureBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
				<?php foreach ( $features as $index => $feature ) {
					extract( $feature );
					// Classes
					$iconClass = isset( $upIcon['id'] ) ? 'wp-image-'.$upIcon['id'] : ''; ?>

					<div class='bBlocksFeature' id='bBlocksFeature-<?php echo esc_attr( $index ); ?>'>
						<div class='featureIcon'>
							<?php echo $isUpIcon ?
							( $upIcon['url'] ? "<img class='". esc_attr( $iconClass ) ."' src='". esc_url( $upIcon['url'] ) ."' alt='". esc_attr( $upIcon['alt'] ) ."' />" : '' ) :
							( $icon['class'] ? "<i class='". esc_attr( $icon['class'] ) ."'></i>" : '' ); ?>
						</div>

						<div class='featureDetails'>
							<?php echo $isTitle && $title ? "<h4 class='featureTitle'>". wp_kses_post( $title ) ."</h4>" : ''; ?>

							<?php echo $isSep ? "<span class='featureSeparator'></span>" : ''; ?>

							<?php echo $isDesc && $desc ? "<p class='featureDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
						</div>
					</div>
				<?php } ?>
			</div>
		</div>

		<?php $featureBoxesStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksFeatureBoxes();