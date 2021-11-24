<?php
class BBlocksInfoBox extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'info-box', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $infoBoxAlign = $infoBoxAlign ?? 'center';
        $textAlign = $textAlign ?? 'center';
        $width = $width ?? '80%';
        $background = $background ?? [ 'color' => '#f1f7ff' ];
        $padding = $padding ?? [ 'vertical' => '50px', 'horizontal' => '50px' ];
        $border = $border ?? [ 'width' => '10px', 'color' => '#fff', 'radius' => '5px' ];
        $shadow = $shadow ?? [ 'blur' => '15px' ];
        $isIcon = $isIcon ?? true;
        $icon = $icon ?? [ 'class' => 'fa fa-info-circle', 'fontSize' => 70, 'color' => '#4527a4' ];
        $title = $title ?? 'Info Box Title';
        $titleTypo = $titleTypo ?? [ 'fontSize' => 25, 'fontWeight' => 600 ];
        $titleColor = $titleColor ?? '#333';
        $titleMargin = $titleMargin ?? [ 'bottom' => '10px' ];
        $isDesc = $isDesc ?? true;
        $desc = $desc ?? 'This content area describes info box descriptions or details.';
        $descTypo = $descTypo ?? [ 'fontSize' => 15 ];
        $descColor = $descColor ?? '#333';
        $descMargin = $descMargin ?? [ 'bottom' => '15px' ];
        $isBtn = $isBtn ?? false;
        $btn = $btn ?? 'Click Me';
        $btnLink = $btnLink ?? '#';
        $isLinkNewTab = $isLinkNewTab ?? true;
        $btnTypo = $btnTypo ?? [ 'fontSize' => 15 ];
        $btnColors = $btnColors ?? [ 'color' => '#fff', 'bg' => '#4527a4' ];
        $btnHovColors = $btnHovColors ?? [ 'color' => '#fff', 'bg' => '#8344c5' ];
        $btnPadding = $btnPadding ?? [ 'vertical' => '8px', 'horizontal' => '15px' ];
        $btnBorder = $btnBorder ?? [ 'radius' => '5px' ];

        // Generate Styles
        $infoBoxStyle = new BBlocksStyleGenerator();
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId", [
            'text-align' => $infoBoxAlign
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox", [
            'text-align' => $textAlign,
            'width' => '0px' === $width || '0%' === $width || '0em' === $width ? '100%' : $width,
            $background['styles'] ?? 'background-color: #f1f7ff;' => '',
            'padding' => $padding['styles'] ?? '50px 50px',
            $border['styles'] ?? 'border: 10px solid #fff; border-radius: 5px;' => '',
            'box-shadow' => $shadow['styles'] ?? 'none'
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon", [
            'margin' => $iconMargin['styles'] ?? '0px 0px 20px 0px'
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxIcon i", [
            $icon['styles'] ?? 'font-size: 70px; color: #4527a4;' => ''
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxTitle", [
            $titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
            'color' => $titleColor,
            'margin' => $titleMargin['styles'] ?? '0px 0px 10px 0px'
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxDescription", [
            $descTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $descColor,
            'margin' => $descMargin['styles'] ?? '0px 0px 15px 0px'
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton", [
            $btnTypo['styles'] ?? 'font-size: 15px;' => '',
            $btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            'padding' => $btnPadding['styles'] ?? '8px 15px',
            $btnBorder['styles'] ?? 'border-radius: 5px;' => '',
        ] );
        $infoBoxStyle::addStyle( "#bBlocksInfoBox-$cId .bBlocksInfoBox .infoBoxButton:hover", [
            $btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
        ] );

        $btnTab = $isLinkNewTab ? '_blank' : '';

        ob_start(); ?>
        <div class='wp-block-b-blocks-info-box <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksInfoBox-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $infoBoxStyle::renderStyle(), [] ); ?>
            </style>

            <div class='bBlocksInfoBox'>
                <?php echo $isIcon && $icon['class'] ? "<div class='infoBoxIcon'><i class='". esc_html( $icon['class'] ) ."'></i></div>" : ''; ?>
                <?php echo $title ? "<h3 class='infoBoxTitle'>". wp_kses_post( $title ) ."</h3>" : ''; ?>
                <?php echo $isDesc && $desc ? "<p class='infoBoxDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                <?php echo $isBtn && $btn ? "<a href='". esc_url( $btnLink ) ."' class='infoBoxButton' target='". esc_attr( $btnTab ) ."' rel='noreferrer noopener'>". wp_kses_post( $btn ) ."</a>" : ''; ?>
            </div>
        </div>
        <?php $infoBoxStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksInfoBox();