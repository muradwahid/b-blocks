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
		$bBlocksHeadingClassName = 'wp-block-b-blocks-section-heading ' . $className . ' align' . $align;

		// Generate Styles
		$sectionHeadingStyle = new BBlocksStyleGenerator();
		$sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading", [
			'text-align' => $textAlign
		] );
		$sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingTitle", [
			$titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
			'color' => $titleColor,
			'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
		] );
		$sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingSeparator", [
			$separator['styles'] ?? 'width: 150px; border-top: 3px solid #8344c5;' => '',
			'margin' => $sepMargin['styles'] ?? '0 0 5px 0'
		] );
		$sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingDescription", [
			$descTypo['styles'] ?? 'font-size: 15px;' => '',
			'color' => $descColor,
			'margin' => $descMargin['styles'] ?? '0 0 15px 0'
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksHeadingClassName ); ?>' id='bBlocksSectionHeading-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $titleTypo['googleFontLink'] ) ? "@import url(". esc_url( $titleTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo !empty( $descTypo['googleFontLink'] ) ? "@import url(". esc_url( $descTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $sectionHeadingStyle::renderStyle(), [] ); ?>
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