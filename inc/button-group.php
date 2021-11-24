<?php
class BBlocksButtonGroup extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'button-group', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $width = $width ?? '0px';
        $btnAlign = $btnAlign ?? 'center';
        $btnType = $btnType ?? 'fill';
        $btnTypo = $btnTypo ?? [ 'fontSize' => 16 ];
        $btnPadding = $btnPadding ?? [ 'vertical' => '12px', 'horizontal' => '30px' ];
        $btnOne = $btnOne ?? 'First Button';
        $btnOneLink = $btnOneLink ?? '#';
        $btnOneBorder = $btnOneBorder ?? [ 'radius' => '50px' ];
        $btnOneColors = $btnOneColors ?? [ 'color' => '#fff', 'bg' => '#4527a4' ];
        $btnOneHovColors = $btnOneHovColors ?? [ 'color' => '#fff', 'bg' => '#8344c5' ];
        $btnTwo = $btnTwo ?? 'Second Button';
        $btnTwoLink = $btnTwoLink ?? '#';
        $btnTwoBorder = $btnTwoBorder ?? [ 'radius' => '50px' ];
        $btnTwoColors = $btnTwoColors ?? [ 'color' => '#fff', 'bg' => '#8344c5' ];
        $btnTwoHovColors = $btnTwoHovColors ?? [ 'color' => '#fff', 'bg' => '#4527a4' ];
        $isSep = $isSep ?? true;
        $sepType = $sepType ?? 'icon';
        $sepText = $sepText ?? 'or';
        $sepTextTypo = $sepTextTypo ?? [ 'fontSize' => 15 ];
        $sepTextColor = $sepTextColor ?? '#333';
        $sepIcon = $sepIcon ?? [ 'class' => 'fa fa fa-arrows-alt-h', 'fontSize' => 20, 'color' => '#333' ];
        $sepBGColor = $sepBGColor ?? '#fff';

        // Generate Styles
        $btnBorderRadiusCSS = $btnBorder['radius'] ?? '50px';

        $buttonGroupStyle = new BBlocksStyleGenerator();
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId", [
            'text-align' => $btnAlign,
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup", [
            'width' => '0px' !== $width && '0%' !== $width && '0em' !== $width ? $width : 'auto'
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .bBlocksBtn", [
            'min-width' => '0px' !== $width && '0%' !== $width && '0em' !== $width ? '50%' : 'auto'
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .bBlocksBtn a", [
            $btnTypo['styles'] ?? 'font-size: 16px;' => '',
            'padding' => $btnPadding['styles'] ?? '12px 30px',
        ] );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne", [
            $btnOneBorder['styles'] ?? 'border-radius: 50px;' => '',
            $btnOneColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            'border-radius' => "$btnBorderRadiusCSS 0 0 $btnBorderRadiusCSS"
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne:hover", [
            $btnOneHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
        ] );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo", [
            $btnTwoBorder['styles'] ?? 'border-radius: 50px;' => '',
            $btnTwoColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
            'border-radius' => "0 $btnBorderRadiusCSS $btnBorderRadiusCSS 0"
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo:hover", [
            $btnTwoHovColors['styles'] ?? 'color: #fff; background: #4527a4;' => ''
        ] );

        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator", [
            'width' => 'text' === $sepType ? $sepTextTypo['fontSize'] * 1.75 .'px' : $sepIcon['fontSize'] * 1.65 .'px',
            'height' => 'text' === $sepType ? $sepTextTypo['fontSize'] * 1.75 .'px' : $sepIcon['fontSize'] * 1.65 .'px',
            'background-color' => $sepBGColor
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator span", [
            $sepTextTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $sepTextColor
        ] );
        $buttonGroupStyle::addStyle( "#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator i", [
            $sepIcon['styles'] ?? 'font-size: 20px; color: #333;' => ''
        ] );

        // Components
        $sepIconEl = 'icon' === $sepType && $sepIcon['class'] ? "<i class='". $sepIcon['class'] ."'></i>" : '';
        $sepTextEl = 'text' === $sepType ? "<span>$sepText</span>" : '';
        $sepContainerEl = $isSep ? "<div class='btnSeparator'>$sepIconEl $sepTextEl</div>" : '';

        ob_start(); ?>
        <div class='wp-block-b-blocks-button-group <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksButtonGroup-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $sepTextTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $buttonGroupStyle::renderStyle(), [] ); ?>
            </style>

            <div class='bBlocksButtonGroup'>
                <div class='bBlocksBtn firstBtn'>
                    <?php echo $btnOne ? "<a class='btnOne btn-". esc_attr( $btnType ) ."' href='". esc_url( $btnOneLink ) ."'>". wp_kses_post( $btnOne ) ."</a>" : ''; ?>

                    <?php echo wp_kses( $sepContainerEl, [
                        'div' => [ 'class' => [] ],
                        'i' => [ 'class' => [] ],
                        'span' => []
                    ] ); ?>
                </div>

                <div class='bBlocksBtn secondBtn'>
                    <?php echo $btnTwo ? "<a class='btnTwo btn-". esc_attr( $btnType ) ."' href='". esc_url( $btnTwoLink ) ."'>". wp_kses_post( $btnTwo ) ."</a>" : ''; ?>
                </div>
            </div>
        </div>

        <?php $buttonGroupStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksButtonGroup();