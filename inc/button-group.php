<?php
class BBlocksButtonGroup extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'button-group', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),
    
            'btnAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'btnType' => array( 'type' => 'string', 'default' => 'fill' ),
            'btnTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 16 ) ),
            'btnWidth' => array( 'type' => 'string', 'default' => '0px' ),
            'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '12px', 'horizontal' => '30px' ) ),
    
            'btnOne' => array( 'type' => 'string', 'selector' => 'a.btnOne', 'default' => 'First Button' ),
            'btnOneLink' => array( 'type' => 'string', 'default' => '#' ),
            'btnOneBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '50px' ) ),
            'btnOneColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
            'btnOneHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            
            'btnTwo' => array( 'type' => 'string', 'selector' => 'a.btnTwo', 'default' => 'Second Button' ),
            'btnTwoLink' => array( 'type' => 'string', 'default' => '#' ),
            'btnTwoBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '50px' ) ),
            'btnTwoColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            'btnTwoHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
    
            'isSep' => array( 'type' => 'boolean', 'default' => true ),
            'sepType' => array( 'type' => 'string', 'default' => 'icon' ),
            'sepText' => array( 'type' => 'string', 'default' => 'or' ),
            'sepTextTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'sepTextColor' => array( 'type' => 'string', 'default' => '#333' ),
            'sepIcon' => array( 'type' => 'object', 'default' => array( 'class' => 'fa fa fa-arrows-alt-h', 'fontSize' => 20, 'color' => '#333' ) ),
            'sepWidth' => array( 'type' => 'string', 'default' => '0px' ),
            'sepSize' => array( 'type' => 'string', 'default' => '30px' ),
            'sepBGColor' => array( 'type' => 'string', 'default' => '#fff' )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $btnBorderRadiusCSS = $btnBorder['radius'] ?? '50px';

        $buttonGroupStyle = new BBlocksStyleGenerator();
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId", array(
            'text-align' => $btnAlign,
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnG", array(
            $btnTypo['styles'] ?? 'font-size: 16px;' => '',
            'width' => '0px' !== $btnWidth && '0%' !== $btnWidth && '0em' !== $btnWidth ? $btnWidth : 'auto',
            'padding' => $btnPadding['styles'] ?? '12px 30px',
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .firstBtn", array(
            'margin-right' => "calc($sepWidth / 2)" ?? '',
            'padding-right' => "calc($sepWidth / 2)" ?? ''
        ) );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne", array(
            $btnOneBorder['styles'] ?? 'border-radius: 50px;' => '',
            $btnOneColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            'border-radius' => "$btnBorderRadiusCSS 0 0 $btnBorderRadiusCSS"
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne:hover", array(
            $btnOneHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
        ) );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo", array(
            $btnTwoBorder['styles'] ?? 'border-radius: 50px;' => '',
            $btnTwoColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
            'border-radius' => "0 $btnBorderRadiusCSS $btnBorderRadiusCSS 0"
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo:hover", array(
            $btnTwoHovColors['styles'] ?? 'color: #fff; background: #4527a4;' => ''
        ) );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator", array(
            'width' => $sepSize,
            'height' => $sepSize,
            'background-color' => $sepBGColor
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator span", array(
            $sepTextTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $sepTextColor
        ) );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator i", array(
            $sepIcon['styles'] ?? 'font-size: 20px; color: #333;' => ''
        ) );

        // Components
        $sepIconEl = 'icon' === $sepType && $sepIcon['class'] ? "<i class='". $sepIcon['class'] ."'></i>" : '';
        $sepTextEl = 'text' === $sepType ? "<span>$sepText</span>" : '';
        $sepContainerEl = $isSep ? "<div class='btnSeparator'>$sepIconEl $sepTextEl</div>" : '';

        ob_start(); ?>
        <div class='wp-block-b-blocks-button-group <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksButtonGroup-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $sepTextTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $buttonGroupStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksButtonGroup'>
                <div class='firstBtn'>
                    <?php echo $btnOne ? "<a class='btnG btnOne btn-". esc_attr( $btnType ) ."' href='". esc_url( $btnOneLink ) ."'>". esc_html( $btnOne ) ."</a>" : ''; ?>

                    <?php echo wp_kses( $sepContainerEl, array(
                        'div' => array( 'class' => array() ),
                        'i' => array( 'class' => array() ),
                        'span' => array()
                    ) ); ?>
                </div>

                <?php echo $btnTwo ? "<a class='btnG btnTwo btn-". esc_attr( $btnType ) ."' href='". esc_url( $btnTwoLink ) ."'>". esc_html( $btnTwo ) ."</a>" : ''; ?>
            </div>
        </div>

        <?php $buttonGroupStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksButtonGroup();