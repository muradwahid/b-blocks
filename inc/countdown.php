<?php
class BBlocksCountdown{
    public function __construct(){
        add_action('init', [$this, 'register']);
    }

    function register(){
        BBlocksRegisterScript::register('countdown', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ));
    }

    function attributes(){
        return array(
            'cId' => array( 'type' => 'string' ),
            'destDate' => array( 'type' => 'string', 'default' => '' ),

            'layout' => array( 'type' => 'string', 'default' => 'default' ),
            'boxIsInline' => array( 'type' => 'boolean', 'default' => false ),
            'boxPosition' => array( 'type' => 'string', 'default' => 'center' ),
            'isLabels' => array( 'type' => 'boolean', 'default' => true ),

            'isDays' => array( 'type' => 'boolean', 'default' => true ),
            'daysLabel' => array( 'type' => 'string', 'default' => 'Days' ),

            'isHours' => array( 'type' => 'boolean', 'default' => true ),
            'hoursLabel' => array( 'type' => 'string', 'default' => 'Hours' ),

            'isMinutes' => array( 'type' => 'boolean', 'default' => true ),
            'minutesLabel' => array( 'type' => 'string', 'default' => 'Minutes' ),

            'isSeconds' => array( 'type' => 'boolean', 'default' => true ),
            'secondsLabel' => array( 'type' => 'string', 'default' => 'Seconds' ),

            'width' => array( 'type' => 'string', 'default' => '0px' ),
            'background' => array( 'type' => 'object', 'default' => array() ),
            'padding' => array( 'type' => 'object', 'default' => array( 'vertical' => '10px', 'horizontal' => '15px' ) ),
            'shadow' => array( 'type' => 'object', 'default' => array() ),
            'alignment' => array( 'type' => 'string', 'default' => 'center' ),

            'boxBG' => array( 'type' => 'object', 'default' => array( 'type' => 'gradient', 'color' => '#4527a4', 'gradient' => 'linear-gradient(135deg, #4527a4, #8344c5)' ) ),
            'boxWidth' => array( 'type' => 'string', 'default' => '170px' ),
            'boxHeight' => array( 'type' => 'string', 'default' => '120px' ),
            'boxSpace' => array( 'type' => 'string', 'default' => '30px' ),
            'boxBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '5%' ) ),
            'boxShadow' => array( 'type' => 'object', 'default' => array() ),

            'digitTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 48 ) ),
            'digitColor' => array( 'type' => 'string', 'default' => '#fff' ),

            'labelTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 18 ) ),
            'labelColor' => array( 'type' => 'string', 'default' => '#fff' ),

            'isSep' => array( 'type' => 'boolean', 'default' => false ),
            'sepType' => array( 'type' => 'string', 'default' => ':' ),
            'sepSize' => array( 'type' => 'number', 'default' => 52 ),
            'sepColor' => array( 'type' => 'string', 'default' => '#4527a4' )
        );
    }

    function render($attributes){
        extract( $attributes );

        // Generate Styles
        $countdownStyle = new BBlocksStyleGenerator();
        $countdownStyle::addStyle("#bBlocksCountdown-$cId", array(
            'align-items' => $alignment,
            'justify-content' => $alignment
        ));
        $countdownStyle::addStyle("#bBlocksCountdown-$cId .countdownItems", array(
            'width' => '0px' === $width || '0%' === $width || '0em' === $width ? 'auto' : $width,
            $background['styles'] ?? '' => '',
            'padding' => $padding['styles'] ?? '10px 15px',
            'box-shadow' => $shadow['styles'] ?? 'none',
            'justify-content' => $boxPosition
        ));
        $countdownStyle::addStyle("#bBlocksCountdown-$cId .countdownItems .countdownItem", array(
            $boxBG['styles'] ?? 'background-image: linear-gradient(135deg, #4527a4, #8344c5);' => '',
            'width' => $boxWidth,
            'height' => $boxHeight,
            'margin-left' => "calc($boxSpace / 2)",
            'margin-right' => "calc($boxSpace / 2)",
            $boxBorder['styles'] ?? 'border-radius: 5%;' => '',
            'box-shadow' => $boxShadow['styles'] ?? '0 0 0 0 #0000'
        ));
        $countdownStyle::addStyle("#bBlocksCountdown-$cId .countdownItems .countdownItem.separator::before", array(
            'content' => "'$sepType'",
            'font-size' => $sepSize . 'px',
            'color' => $sepColor,
            'left' => "calc(-$boxSpace / 2)"
        ));
        $countdownStyle::addStyle("#bBlocksCountdown-$cId .countdownItems .countdownItem .digit", array(
            'color' => $digitColor,
            $digitTypo['styles'] ?? 'font-size: 48px;' => ''
        ));
        $countdownStyle::addStyle("#bBlocksCountdown-$cId .countdownItems .countdownItem .label", array(
            'color' => $labelColor,
            $labelTypo['styles'] ?? 'font-size: 18px;' => ''
        ));

        $boxClass = $boxIsInline ? 'inline' : '';
        $sepClass = $isSep ? 'separator' : '';  

        ob_start(); ?>
        <div class='wp-block-b-blocks-countdown <?php echo isset($align) ? 'align' . esc_attr($align) : ''; ?>' id='bBlocksCountdown-<?php echo esc_attr($cId); ?>' data-date="<?php echo esc_attr(json_encode(array('destDate' => $destDate))) ?>">
            <style>
                @import url(<?php echo esc_url($digitTypo['googleFontLink'] ?? ''); ?>);
                @import url(<?php echo esc_url($labelTypo['googleFontLink'] ?? ''); ?>);
                <?php echo wp_kses($countdownStyle::renderStyle(), []) ?>
            </style>

            <div class='countdownItems'>
                <?php $this->box($isDays, "countdownDays $boxClass", $isLabels, $daysLabel)
                .$this->box($isHours, "countdownHours $boxClass $sepClass", $isLabels, $hoursLabel)
                .$this->box($isMinutes, "countdownMinutes $boxClass $sepClass", $isLabels, $minutesLabel)
                .$this->box($isSeconds, "countdownSeconds $boxClass $sepClass", $isLabels, $secondsLabel) ?>
            </div>

        <?php $countdownStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }

    function box($is, $boxClass, $isLabels, $label){
        if($is){ ?><div class='countdownItem <?php echo esc_attr($boxClass) ?>'>
            <span class='digit'>00</span> 
            <?php echo $isLabels ? "<span class='label'>". esc_html($label) ."</span>" : ''; ?>
        </div><?php }
    } // Box
}
new BBlocksCountdown();