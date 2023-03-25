<?php
class BBlocksSectionHeading extends BBlocks{
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
		$blockClassName = 'wp-block-b-blocks-section-heading ' . $className . ' align' . $align;

		// Generate Styles
		$sectionHeadingStyle = new BBlocksStyleGenerator();

		$sectionHeadingSl = "#bBlocksSectionHeading-$cId .bBlocksSectionHeading";

		$sectionHeadingStyle::addStyle( "$sectionHeadingSl", [
			'text-align' => $textAlign
		] );
		$sectionHeadingStyle::addStyle( "$sectionHeadingSl .sectionHeadingTitle", [
			'color' => $titleColor,
			'margin' => GetCSS::getSpaceCSS( $titleMargin )
		] );
		$sectionHeadingStyle::addStyle( "$sectionHeadingSl .sectionHeadingSeparator", [
			GetCSS::getSeparatorCSS( $separator ) => '',
			'margin' => GetCSS::getSpaceCSS( $sepMargin )
		] );
		$sectionHeadingStyle::addStyle( "$sectionHeadingSl .sectionHeadingDescription", [
			'color' => $descColor,
			'margin' => GetCSS::getSpaceCSS( $descMargin )
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksSectionHeading-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php
					echo GetCSS::getTypoCSS( "$sectionHeadingSl .sectionHeadingTitle", $titleTypo );
					echo GetCSS::getTypoCSS( "$sectionHeadingSl .sectionHeadingDescription", $descTypo );
					echo wp_kses( $sectionHeadingStyle->renderStyle(), [] );
				?>
			</style>

			<div class='bBlocksSectionHeading'>
				<h2 class='sectionHeadingTitle'><?php echo wp_kses_post( $title ); ?></h2>
				<?php echo $isSep ? "<span class='sectionHeadingSeparator'></span>" : ''; ?>
				<?php echo $isDesc ? "<p class='sectionHeadingDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
			</div>
		</div>
		<?php $sectionHeadingStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksSectionHeading();