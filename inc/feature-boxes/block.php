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

		$className = $className ?? '';
		$blockClassName = 'wp-block-b-blocks-feature-boxes ' . $className . ' align' . $align;

		// Generate Styles
		$mainSl = "#bBlocksFeatureBoxes-$cId";
		$featureBoxesSl = "$mainSl .bBlocksFeatureBoxes";
		$gFeatureSl = "$featureBoxesSl .bBlocksFeature";

		$featureBoxesStyle = new BBlocksStyleGenerator();
		$featureBoxesStyle::addStyle( "$featureBoxesSl", [
			'grid-gap' => "$rowGap $columnGap"
		] );
		$featureBoxesStyle::addStyle( "$gFeatureSl", [
			'text-align' => $textAlign,
			'padding' => GetCSS::getSpaceCSS( $padding )
		] );
		$featureBoxesStyle::addStyle( "$gFeatureSl .featureIcon", [
			'margin' => GetCSS::getSpaceCSS( $iconMargin )
		] );
		$featureBoxesStyle::addStyle( "$gFeatureSl .featureTitle", [
			'margin' => GetCSS::getSpaceCSS( $titleMargin )
		] );
		$featureBoxesStyle::addStyle( "$gFeatureSl .featureSeparator", [
			'margin' => GetCSS::getSpaceCSS( $sepMargin )
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksFeatureBoxes-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php
					echo GetCSS::getTypoCSS( "$gFeatureSl .featureTitle", $titleTypo );
					echo GetCSS::getTypoCSS( "$gFeatureSl .featureDescription", $descTypo );
					echo wp_kses( $featureBoxesStyle::renderStyle(), [] );
					
					foreach ( $features as $index => $feature ) {
						extract( $feature );

						$featureSl = "$mainSl #bBlocksFeature-$index";

						$backgroundStyle = GetCSS::getBackgroundCSS($background );
						$iconStyle = GetCSS::getIconCSS($icon );
						$separatorStyle = GetCSS::getSeparatorCSS($separator );

						$featureStyles = "$featureSl{ $backgroundStyle }
						$featureSl .featureIcon i{ $iconStyle }
						$featureSl .featureIcon img{ width: $iconWidth; }
						$featureSl .featureTitle{ color: $titleColor; }
						$featureSl .featureSeparator{ $separatorStyle }
						$featureSl .featureDescription{ color: $descColor; }";
						echo esc_html( $featureStyles );
					}
				?>
			</style>

			<div class='bBlocksFeatureBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
				<?php foreach ( $features as $index => $feature ) {
					extract( $feature ); ?>

					<div class='bBlocksFeature' id='bBlocksFeature-<?php echo esc_attr( $index ); ?>'>
						<div class='featureIcon'>
							<?php echo $isUpIcon ?
							( $upIcon['url'] ? "<img src='". esc_url( $upIcon['url'] ) ."' alt='". esc_attr( $upIcon['alt'] ) ."' />" : '' ) :
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