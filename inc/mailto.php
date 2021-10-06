<?php
class BBlocksMailto extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'mailto', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string', 'default' => '' ),

            'mailtoAlign' => array( 'type' => 'string', 'default' => 'center' ),

            'receiverMail' => array( 'type' => 'string', 'default' => '' ),
            'style' => array( 'type' => 'string', 'default' => 'default' ),

            'btn' => array( 'type' => 'string', 'selector' => 'a.mailtoButton span', 'default' => 'Send E-mail' ),
            'btnTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 22, 'fontWeight' => 600 ) ),
            'btnColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
            'btnHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '18px', 'horizontal' => '45px' ) ),
            'btnBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '50px' ) ),

            'icon' => array( 'type' => 'object', 'default' => array( 'class' => 'fa fa-paper-plane' ) ),
            'iconPosition' => array( 'type' => 'string', 'default' => 'left' )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $mailtoStyle = new BBlocksStyleGenerator();
        $mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto", array(
            'text-align' => $mailtoAlign
        ) );
        $mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto a.mailtoButton", array(
            $btnTypo['styles'] ?? 'font-size: 22px; font-weight: 600;' => '',
            $btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            'padding' => $btnPadding['styles'] ?? '18px 45px',
            $btnBorder['styles'] ?? 'border-radius: 50px;' => '',
            'box-shadow' => '0px 5px 20px 0px '. $btnColors['bg']
            ) );
        $mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto a.mailtoButton:hover", array(
            $btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
            'box-shadow' => '0px 5px 20px 0px '. $btnHovColors['bg']
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-mailto <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksMailto-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $mailtoStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksMailto'>
                <a href='<?php echo 'mailto:' .sanitize_email( $receiverMail ); ?>' class='mailtoui mailtoButton'>
                    <?php echo 'left' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>

                    <span><?php echo wp_kses_post( $btn ); ?></span>

                    <?php echo 'right' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>
                </a>
            </div>
        </div>
        <?php $mailtoStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksMailto();