<?php
class BBlocksMailto extends BBlocks{
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

		// Enqueue assets where has block
		wp_enqueue_script( 'mailtoui', B_BLOCKS_ASSETS_DIR . 'js/mailtoui-min.js', [], '1.0.3', true );

		$className = $className ?? '';
		$blockClassName = 'wp-block-b-blocks-mailto ' . $className . ' align' . $align;

		// Generate Styles
		$mailtoStyle = new BBlocksStyleGenerator();

		$mailToSl = "#bBlocksMailto-$cId .bBlocksMailto";

		$mailtoStyle::addStyle( "$mailToSl", [
			'text-align' => $mailtoAlign
		] );
		$mailtoStyle::addStyle( "$mailToSl a.mailtoButton", [
			GetCSS::getColorsCSS( $btnColors ) => '',
			'padding' => GetCSS::getSpaceCSS( $btnPadding ),
			GetCSS::getBorderCSS( $btnBorder ) => '',
			'box-shadow' => '0px 5px 20px 0px '. $btnColors['bg']
		] );
		$mailtoStyle::addStyle( "$mailToSl a.mailtoButton:hover", [
			GetCSS::getColorsCSS( $btnHovColors ) => '',
			'box-shadow' => '0px 5px 20px 0px '. $btnHovColors['bg']
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksMailto-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php
					echo GetCSS::getTypoCSS( '', $btnTypo )['googleFontLink'];
					echo GetCSS::getTypoCSS( "$mailToSl a.mailtoButton", $btnTypo )['styles'];
					echo wp_kses( $mailtoStyle::renderStyle(), [] );
				?>
			</style>

			<div class='bBlocksMailto'>
				<a href='<?php echo 'mailto:' .sanitize_email( $receiverMail ); ?>' class='mailtoui mailtoButton'>
					<?php echo 'left' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>

					<span><?php echo wp_kses_post( $btn ); ?></span>

					<?php echo 'right' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>
				</a>
			</div>
		</div>
		<?php $mailtoStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksMailto();