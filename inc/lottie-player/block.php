<?php
class BBlocksLottiePlayer extends BBlocks{
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
		$lottiePlayerStyle = new BBlocksStyleGenerator();
		$lottiePlayerStyle::addStyle( "#bBlocksLottiePlayer-$cId .bBlocksLottiePlayer", [
			'text-align' => $playerAlign
		] );
		$lottiePlayerStyle::addStyle( "#bBlocksLottiePlayer-$cId .bBlocksLottiePlayer lottie-player", [
			'width' => $width,
			'--lottie-player-toolbar-height' => $controlsHeight,
			'--lottie-player-toolbar-background-color' => $controlsBG,
			'--lottie-player-toolbar-icon-color' => $controlsIconColor,
			'--lottie-player-toolbar-icon-hover-color' => $controlsIconHoverColor,
			'--lottie-player-toolbar-icon-active-color' => $controlsIconActiveColor,
			'--lottie-player-seeker-track-color' => $controlsTrackColor,
			'--lottie-player-seeker-thumb-color' => $controlsThumbColor
		] );

		$jsonData = wp_json_encode( [ 'isControls' => $isControls, 'isAutoplay' => $isAutoplay, 'isLoop' => $isLoop, 'isHover' => $isHover ] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-lottie-player <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksLottiePlayer-<?php echo esc_attr( $cId ); ?>' data-controls='<?php echo esc_attr( $jsonData ); ?>'>
			<style><?php echo wp_kses( $lottiePlayerStyle::renderStyle(), [] ); ?></style>

			<div class='bBlocksLottiePlayer'>
				<lottie-player
					controls
					autoplay
					loop
					mode='<?php echo esc_attr( $mode ); ?>'
					background='<?php echo esc_attr( $background ); ?>'
					count='<?php echo esc_attr( $count ); ?>'
					speed='<?php echo esc_attr( $speed ); ?>'
					direction='1'
					intermission='<?php echo esc_attr( $intermission * 1000 ); ?>'
					src='<?php echo esc_attr( $file ); ?>'
				>
				</lottie-player>
			</div>
		</div>
		<?php $lottiePlayerStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksLottiePlayer();