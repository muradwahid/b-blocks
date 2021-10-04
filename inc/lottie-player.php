<?php
class BBlocksLottiePlayer extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'lottie-player', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),

            'playerAlign' => array( 'type' => 'string', 'default' => 'center' ),

            'file' => array( 'type' => 'string', 'default' => 'https://assets4.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json' ),
            'isControls' => array( 'type' => 'boolean', 'default' => true ),
            'isAutoplay' => array( 'type' => 'boolean', 'default' => true ),
            'isLoop' => array( 'type' => 'boolean', 'default' => true ),
            'isHover' => array( 'type' => 'boolean', 'default' => false ),
            'mode' => array( 'type' => 'string', 'default' => 'normal' ),
            'count' => array( 'type' => 'number', 'default' => 0 ),
            'speed' => array( 'type' => 'number', 'default' => 1 ),
            'intermission' => array( 'type' => 'number', 'default' => 0 ),

            'width' => array( 'type' => 'string', 'default' => '450px' ),
            'background' => array( 'type' => 'string', 'default' => '#0000' ),

            'controlsHeight' => array( 'type' => 'string', 'default' => '35px' ),
            'controlsBG' => array( 'type' => 'string', 'default' => '#0000' ),
            'controlsIconColor' => array( 'type' => 'string', 'default' => '#4527a4' ),
            'controlsIconHoverColor' => array( 'type' => 'string', 'default' => '#8344c5' ),
            'controlsIconActiveColor' => array( 'type' => 'string', 'default' => '#8344c5' ),
            'controlsTrackColor' => array( 'type' => 'string', 'default' => '#8344c5' ),
            'controlsThumbColor' => array( 'type' => 'string', 'default' => '#4527a4' )
        );
    }

    function render( $attributes ){
        extract( $attributes );

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