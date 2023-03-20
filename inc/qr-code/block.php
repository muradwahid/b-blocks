<?php
class BBlocksQRCode extends BBlocks{
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
		$blockClassName = 'wp-block-b-blocks-qr-code ' . $className . ' align' . $align;

		// Generate Styles
		$qrCodeStyle = new BBlocksStyleGenerator();
		$qrCodeStyle::addStyle( "#bBlocksQRCode-$cId .bBlocksQRCode", [
			'text-align' => $qrAlign
		] );

		$siteUrl = $url ? $url : 'http://bplugins.com';

		$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=". $dimension ."x". $dimension ."&color=". str_replace( '#', '', $color ) ."&bgcolor=". str_replace( '#', '', $bgColor ) ."&ecc=L&qzone=1&data=". $siteUrl;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksQRCode-<?php echo esc_attr( $cId ); ?>'>
			<style><?php echo wp_kses( $qrCodeStyle::renderStyle(), [] ); ?></style>

			<div class='bBlocksQRCode'>
				<img src='<?php echo esc_url( $qrUrl ); ?>' alt='<?php echo esc_url( $url ); ?>' />
			</div>
		</div>
		<?php $qrCodeStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksQRCode();