<?php
class BBlocksQRCode{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        BBlocksRegisterScript::register( 'qr-code', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),

            'qrAlign' => array( 'type' => 'string', 'default' => 'center' ),

            'url' => array( 'type' => 'string', 'default' => '' ),
            'dimension' => array( 'type' => 'number', 'default' => 180 ),

            'color' => array( 'type' => 'string', 'default' => '#000' ),
            'bgColor' => array( 'type' => 'string', 'default' => '#fff' )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $qrCodeStyle = new BBlocksStyleGenerator();
        $qrCodeStyle::addStyle( "#bBlocksQRCode-$cId .bBlocksQRCode", array(
            'text-align' => $qrAlign
        ) );

        $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=". $dimension ."x". $dimension ."&color=". str_replace('#', '', $color) ."&bgcolor=". str_replace('#', '', $bgColor) ."&ecc=L&qzone=1&data=". $url;

        ob_start(); ?>
        <div class='wp-block-b-blocks-qr-code <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksQRCode-<?php echo esc_attr( $cId ); ?>'>
            <style><?php echo wp_kses( $qrCodeStyle::renderStyle(), [] ) ?></style>

            <div class='bBlocksQRCode'>
                <img src='<?php echo esc_url( $qrUrl ); ?>' alt='<?php echo esc_url( $url ); ?>' />
            </div>
        </div>
        <?php $qrCodeStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksQRCode();