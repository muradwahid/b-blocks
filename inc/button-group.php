<?php
// Button Group Attributes
function button_group_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'btnAlign' => array( 'type' => 'string', 'default' => 'center' ),
        'btnTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 16) ),
        'btnWidth' => array( 'type' => 'string', 'default' => '0px' ),
        'btnPadding' => array( 'type' => 'object', 'default' => array('vertical' => '12px', 'horizontal' => '30px') ),

        'btnOne' => array( 'type' => 'string', 'selector' => 'a.btnOne', 'default' => 'First Button' ),
        'btnOneType' => array( 'type' => 'string', 'default' => 'fill' ),
        'btnOneLink' => array( 'type' => 'string', 'default' => '#' ),
        'btnOneBorder' => array( 'type' => 'object', 'default' => array('radius' => '50px') ),
        'btnOneColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#4527a4') ),
        'btnOneHovColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#8344c5') ),
        
        'btnTwo' => array( 'type' => 'string', 'selector' => 'a.btnTwo', 'default' => 'Second Button' ),
        'btnTwoType' => array( 'type' => 'string', 'default' => 'fill' ),
        'btnTwoLink' => array( 'type' => 'string', 'default' => '#' ),
        'btnTwoBorder' => array( 'type' => 'object', 'default' => array('radius' => '50px') ),
        'btnTwoColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#8344c5') ),
        'btnTwoHovColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#4527a4') ),

        'isSep' => array( 'type' => 'boolean', 'default' => true ),
        'sepType' => array( 'type' => 'string', 'default' => 'icon' ),
        'sepText' => array( 'type' => 'string', 'default' => 'or' ),
        'sepTextTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 15) ),
        'sepTextColor' => array( 'type' => 'string', 'default' => '#333' ),
        'sepIcon' => array( 'type' => 'object', 'default' => array('class' => 'fa fa fa-arrows-alt-h', 'fontSize' => 20, 'color' => '#333') ),
        'sepWidth' => array( 'type' => 'string', 'default' => '0px' ),
        'sepSize' => array( 'type' => 'string', 'default' => '30px' ),
        'sepBGColor' => array( 'type' => 'string', 'default' => '#fff' )
    );
}

// Render Button Group
function render_b_blocks_button_group($attributes){
    extract( $attributes );

    // Generate Styles
    $btnWidthCSS = '0px' !== $btnWidth ? $btnWidth : 'auto';
    $btnBorderRadiusCSS = $btnBorder['radius'] ?? '50px';

    $buttonGroupStyle = new StyleGenerator();
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnG", array(
        $btnTypo['styles'] ?? 'font-size: 16px;' => '',
        'width' => $btnWidthCSS,
        'padding' => $btnPadding['styles'] ?? '12px 30px',
    ));
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .firstBtn", array(
        'margin-right' => "calc($sepWidth / 2)" ?? '',
        'padding-right' => "calc($sepWidth / 2)" ?? ''
    ));

    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne", array(
        $btnOneBorder['styles'] ?? 'border-radius: 50px;' => '',
        $btnOneColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
        'border-radius' => "$btnBorderRadiusCSS 0 0 $btnBorderRadiusCSS"
    ));
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnOne:hover", array(
        $btnOneHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => ''
    ));

    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo", array(
        $btnTwoBorder['styles'] ?? 'border-radius: 50px;' => '',
        $btnTwoColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
        'border-radius' => "0 $btnBorderRadiusCSS $btnBorderRadiusCSS 0"
    ));
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnTwo:hover", array(
        $btnTwoHovColors['styles'] ?? 'color: #fff; background: #4527a4;' => ''
    ));

    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator", array(
        'width' => $sepSize,
        'height' => $sepSize,
        'background-color' => $sepBGColor
    ));
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator span", array(
        $sepTextTypo['styles'] ?? 'font-size: 15px;' => '',
        'color' => $sepTextColor
    ));
    $buttonGroupStyle::addStyle("#bBlocksButtonGroup-$cId .bBlocksButtonGroup .btnSeparator i", array(
        $sepIcon['styles'] ?? 'font-size: 20px; color: #333;' => ''
    ));

    $btnFontLink = $btnTypo['googleFontLink'] ?? '';
    $sepTextFontLink = $sepTextTypo['googleFontLink'] ?? '';

    // Components
    $btnOneEl = $btnOne ? "<a class='btnG btnOne btn-$btnOneType' href='$btnOneLink'>$btnOne</a>" : '';
    $btnTwoEl = $btnTwo ? "<a class='btnG btnTwo btn-$btnTwoType' href='$btnTwoLink'>$btnTwo</a>" : '';

    $sepIconEl = 'icon' === $sepType && $sepIcon['class'] ? "<i class='". $sepIcon['class'] ."'></i>" : '';
    $sepTextEl = 'text' === $sepType ? "<span>$sepText</span>" : '';
    $sepContainerEl = $isSep ? "<div class='btnSeparator'>$sepIconEl $sepTextEl</div>" : '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-button-group text-$btnAlign' id='bBlocksButtonGroup-$cId'>
        <style>@import url($btnFontLink); @import url($sepTextFontLink);". $buttonGroupStyle::renderStyle() ."</style>

        <div class='bBlocksButtonGroup'>
            <div class='firstBtn'>
                $btnOneEl $sepContainerEl
            </div>

            $btnTwoEl
        </div>
    </div>";

    $buttonGroupStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}