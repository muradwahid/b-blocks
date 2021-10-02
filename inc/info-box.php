<?php
class BBlocksInfoBox{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        BBlocksRegisterScript::register( 'info-box', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),

            'infoBoxAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'textAlign' => array( 'type' => 'string', 'default' => 'center' ),

            'width' => array( 'type' => 'string', 'default' => '80%' ),
            'background' => array( 'type' => 'object', 'default' => array( 'color' => '#f1f7ff' ) ),
            'padding' => array( 'type' => 'object', 'default' => array( 'vertical' => '50px', 'horizontal' => '50px' ) ),
            'border' => array( 'type' => 'object', 'default' => array( 'width' => '10px', 'color' => '#fff', 'radius' => '5px' ) ),
            'shadow' => array( 'type' => 'object', 'default' => array( 'blur' => '15px' ) ),

            'isIcon' => array( 'type' => 'boolean', 'default' => true ),
            'icon' => array( 'type' => 'object', 'default' => array( 'class' => 'fa fa-info-circle', 'fontSize' => 70, 'color' => '#4527a4' ) ),
            'iconMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '20px' ) ),

            'title' => array( 'type' => 'string', 'selector' => 'h3.infoBoxTitle', 'default' => 'Info Box Title' ),
            'titleTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 25, 'fontWeight' => 600 ) ),
            'titleColor' => array( 'type' => 'string', 'default' => '#333' ),
            'titleMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '10px' ) ),

            'isDesc' => array( 'type' => 'boolean', 'default' => true ),
            'desc' => array( 'type' => 'string', 'selector' => 'p.infoBoxDescription', 'default' => 'This content area describes info box descriptions or details.' ),
            'descTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'descColor' => array( 'type' => 'string', 'default' => '#333' ),
            'descMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),

            'isBtn' => array( 'type' => 'boolean', 'default' => false ),
            'btn' => array( 'type' => 'string', 'selector' => 'a.infoBoxButton', 'default' => 'Click Me' ),
            'btnLink' => array( 'type' => 'string', 'default' => '#' ),
            'isLinkNewTab' => array( 'type' => 'boolean', 'default' => true ),
            'btnTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'btnColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
            'btnHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '8px', 'horizontal' => '15px' ) ),
            'btnBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '5px' ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $infoBoxStyle = new BBlocksStyleGenerator();
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId", array(
            'text-align' => $infoBoxAlign
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox", array(
            'text-align' => $textAlign,
            'width' => '0px' === $width || '0%' === $width || '0em' === $width ? '100%' : $width,
            $background['styles'] ?? 'background-color: #f1f7ff;' => '',
            'padding' => $padding['styles'] ?? '50px 50px',
            $border['styles'] ?? 'border: 10px solid #fff; border-radius: 5px;' => '',
            'box-shadow' => $shadow['styles'] ?? 'none'
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon", array(
            'margin' => $iconMargin['styles'] ?? '0px 0px 20px 0px'
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon i", array(
            $icon['styles'] ?? 'font-size: 70px; color: #4527a4;' => ''
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxTitle", array(
            $titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
            'color' => $titleColor,
            'margin' => $titleMargin['styles'] ?? '0px 0px 10px 0px'
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxDescription", array(
            $descTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $descColor,
            'margin' => $descMargin['styles'] ?? '0px 0px 15px 0px'
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton", array(
            $btnTypo['styles'] ?? 'font-size: 15px;' => '',
            $btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            'padding' => $btnPadding['styles'] ?? '8px 15px',
            $btnBorder['styles'] ?? 'border-radius: 5px;' => '',
        ) );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton:hover", array(
            $btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
        ) );

        $btnTab = $isLinkNewTab ? '_blank' : '';

        ob_start(); ?>
        <div class='wp-block-b-blocks-info-box <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksInfoBox-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $infoBoxStyle::renderStyle(), [] ) ?>
            </style>

            <div class='bBlocksInfoBox'>
                <?php echo $isIcon && $icon['class'] ? "<div class='infoBoxIcon'><i class='". esc_html( $icon['class'] ) ."'></i></div>" : ''; ?>
                <?php echo $title ? "<h3 class='infoBoxTitle'>". esc_html( $title ) ."</h3>" : ''; ?>
                <?php echo $isDesc && $desc ? "<p class='infoBoxDescription'>". esc_html( $desc ) ."</p>" : ''; ?>
                <?php echo $isBtn && $btn ? "<a href='". esc_url( $btnLink ) ."' class='infoBoxButton' target='". esc_attr( $btnTab ) ."' rel='noreferrer noopener'>". esc_html( $btn ) ."</a>" : ''; ?>
            </div>
        </div>
        <?php $infoBoxStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksInfoBox();