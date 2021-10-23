<?php
class BBlocksLottiePlayer extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'lottie-player', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $playerAlign = $playerAlign ?? 'center';
        $file = $file ?? 'https://assets4.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json';
        $isControls = $isControls ?? true;
        $isAutoplay = $isAutoplay ?? true;
        $isLoop = $isLoop ?? true;
        $isHover = $isHover ?? false;
        $mode = $mode ?? 'normal';
        $count = $count ?? 0;
        $speed = $speed ?? 1;
        $intermission = $intermission ?? 0;
        $width = $width ?? '450px';
        $background = $background ?? '#0000';
        $controlsHeight = $controlsHeight ?? '35px';
        $controlsBG = $controlsBG ?? '#0000';
        $controlsIconColor = $controlsIconColor ?? '#4527a4';
        $controlsIconHoverColor = $controlsIconHoverColor ?? '#8344c5';
        $controlsIconActiveColor = $controlsIconActiveColor ?? '#8344c5';
        $controlsTrackColor = $controlsTrackColor ?? '#8344c5';
        $controlsThumbColor = $controlsThumbColor ?? '#4527a4';

        // Generate Styles
        $lottiePlayerStyle = new BBlocksStyleGenerator();
        $lottiePlayerStyle::addStyle( "#bBlocksLottiePlayer-$cId .bBlocksLottiePlayer", array(
            'text-align' => $playerAlign
        ) );
        $lottiePlayerStyle::addStyle( "#bBlocksLottiePlayer-$cId .bBlocksLottiePlayer lottie-player", array(
            'width' => $width,
            '--lottie-player-toolbar-height' => $controlsHeight,
            '--lottie-player-toolbar-background-color' => $controlsBG,
            '--lottie-player-toolbar-icon-color' => $controlsIconColor,
            '--lottie-player-toolbar-icon-hover-color' => $controlsIconHoverColor,
            '--lottie-player-toolbar-icon-active-color' => $controlsIconActiveColor,
            '--lottie-player-seeker-track-color' => $controlsTrackColor,
            '--lottie-player-seeker-thumb-color' => $controlsThumbColor
        ) );

        $jsonData = json_encode( array( 'isControls' => $isControls, 'isAutoplay' => $isAutoplay, 'isLoop' => $isLoop, 'isHover' => $isHover ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-lottie-player <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksLottiePlayer-<?php echo esc_attr( $cId ); ?>' data-controls='<?php echo esc_attr( $jsonData ); ?>'>
            <style><?php echo wp_kses( $lottiePlayerStyle::renderStyle(), array() ); ?></style>

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
        <?php $lottiePlayerStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksLottiePlayer();