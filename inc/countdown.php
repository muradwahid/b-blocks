<?php
class BBlocksCountdown extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'countdown', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $layout = $layout ?? 'default';
        $boxIsInline = $boxIsInline ?? false;
        $boxPosition = $boxPosition ?? 'center';
        $isLabels = $isLabels ?? true;
        $isDays = $isDays ?? true;
        $daysLabel = $daysLabel ?? 'Days';
        $isHours = $isHours ?? true;
        $hoursLabel = $hoursLabel ?? 'Hours';
        $isMinutes = $isMinutes ?? true;
        $minutesLabel = $minutesLabel ?? 'Minutes';
        $isSeconds = $isSeconds ?? true;
        $secondsLabel = $secondsLabel ?? 'Seconds';
        $width = $width ?? '0px';
        $background = $background ?? [ 'color' => '#0000' ];
        $padding = $padding ?? [ 'vertical' => '10px', 'horizontal' => '15px' ];
        $shadow = $shadow ?? [];
        $alignment = $alignment ?? 'center';
        $boxBG = $boxBG ?? [ 'type' => 'gradient', 'color' => '#4527a4', 'gradient' => 'linear-gradient(135deg, #4527a4, #8344c5)' ];
        $boxWidth = $boxWidth ?? '170px';
        $boxHeight = $boxHeight ?? '120px';
        $boxSpace = $boxSpace ?? '30px';
        $boxBorder = $boxBorder ?? [ 'radius' => '5%' ];
        $boxShadow = $boxShadow ?? [];
        $digitTypo = $digitTypo ?? [ 'fontSize' => 48 ];
        $digitColor = $digitColor ?? '#fff';
        $labelTypo = $labelTypo ?? [ 'fontSize' => 18 ];
        $labelColor = $labelColor ?? '#fff';
        $isSep = $isSep ?? false;
        $sepType = $sepType ?? ':';
        $sepSize = $sepSize ?? 52;
        $sepColor = $sepColor ?? '#4527a4';

        // Generate Styles
        $countdownStyle = new BBlocksStyleGenerator();
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId", [
            'align-items' => $alignment,
            'justify-content' => $alignment
        ] );
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId .countdownItems", [
            'width' => '0px' === $width || '0%' === $width || '0em' === $width ? 'auto' : $width,
            $background['styles'] ?? 'background-color: #0000;' => '',
            'padding' => $padding['styles'] ?? '10px 15px',
            'box-shadow' => $shadow['styles'] ?? 'none',
            'justify-content' => $boxPosition
        ] );
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId .countdownItems .countdownItem", [
            $boxBG['styles'] ?? 'background-image: linear-gradient(135deg, #4527a4, #8344c5);' => '',
            'width' => $boxWidth,
            'height' => $boxHeight,
            'margin-left' => "calc( $boxSpace / 2 )",
            'margin-right' => "calc( $boxSpace / 2 )",
            $boxBorder['styles'] ?? 'border-radius: 5%;' => '',
            'box-shadow' => $boxShadow['styles'] ?? '0 0 0 0 #0000'
        ] );
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId .countdownItems .separator::before", [
            'content' => "'$sepType'",
            'font-size' => $sepSize . 'px',
            'color' => $sepColor
        ] );
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId .countdownItems .countdownItem .digit", [
            'color' => $digitColor,
            $digitTypo['styles'] ?? 'font-size: 48px;' => ''
        ] );
        $countdownStyle::addStyle( "#bBlocksCountdown-$cId .countdownItems .countdownItem .label", [
            'color' => $labelColor,
            $labelTypo['styles'] ?? 'font-size: 18px;' => ''
        ] );

        $boxClass = $boxIsInline ? 'inline' : '';

        ob_start(); ?>
        <div class='wp-block-b-blocks-countdown <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksCountdown-<?php echo esc_attr( $cId ); ?>' data-date="<?php echo esc_attr( wp_json_encode( [ 'destDate' => $destDate ?? '' ] ) ); ?>">
            <style>
                @import url( <?php echo esc_url( $digitTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $labelTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $countdownStyle::renderStyle(), [] ); ?>
                @media screen and ( max-width: 575px ) { #bBlocksCountdown-<?php echo esc_html( $cId ); ?> .countdownItems .countdownItem{
                    margin-top: calc( <?php echo esc_html( $boxSpace ); ?> / 2 );
                    margin-bottom: calc( <?php echo esc_html( $boxSpace ); ?> / 2 );
                } }
            </style>

            <div class='countdownItems'>
                <?php $this->box( $isDays, "countdownDays $boxClass", $isLabels, $daysLabel ); ?>
                <?php echo $isSep && $isDays && ( $isHours || $isMinutes || $isSeconds ) ? "<span class='separator'></span>" : ''; ?>
                <?php $this->box( $isHours, "countdownHours $boxClass", $isLabels, $hoursLabel ); ?>
                <?php echo $isSep && $isHours && ( $isMinutes || $isSeconds ) ? "<span class='separator'></span>" : ''; ?>
                <?php $this->box( $isMinutes, "countdownMinutes $boxClass", $isLabels, $minutesLabel ); ?>
                <?php echo $isSep && $isMinutes && $isSeconds ? "<span class='separator'></span>" : ''; ?>
                <?php $this->box( $isSeconds, "countdownSeconds $boxClass", $isLabels, $secondsLabel ); ?>
            </div>
        </div>

        <?php $countdownStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }

    function box( $is, $boxClass, $isLabels, $label ){
        if( $is ){ ?><div class='countdownItem <?php echo esc_attr( $boxClass ); ?>'>
            <span class='digit'>00</span> 
            <?php echo $isLabels ? "<span class='label'>". wp_kses_post( $label ) ."</span>" : ''; ?>
        </div><?php }
    } // Box
}
new BBlocksCountdown();