<?php
// Store some data of block
class FlipBox{
    static $attributes = array();
}

// Flip Boxes Attributes
function flip_boxes_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1, ) ),

        'columnGap' => array( 'type' => 'string', 'default' => '40px' ),
        'rowGap' => array( 'type' => 'string', 'default' => '30px' )
    );
}

// Render Flip Boxes
function render_b_blocks_flip_boxes($attributes, $content){
    extract( $attributes );
    extract( FlipBox::$attributes );

    // Generate Styles
    $flipBoxesStyle = new StyleGenerator();
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBoxes", array(
        'grid-gap' => "$rowGap $columnGap"
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox", array(
        'height' => $boxHeight
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .box", array(
        'padding' => $padding['styles'] ?? '30px 25px'
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipIcon", array(
        'margin' => $iconMargin['styles'] ?? '0 0 20px 0'
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipTitle", array(
        $titleTypo['styles'] ?? 'font-size: 25px;' => '',
        'margin' => $titleMargin['styles'] ?? '0 0 20px 0'
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipDescription", array(
        $descTypo['styles'] ?? 'font-size: 16px;' => ''
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipBtn", array(
        $btnTypo['styles'] ?? 'font-size: 16px;' => '',
        'padding' => $btnPadding['styles'] ?? '15px 25px'
    ));

    $titleFontLink = $titleTypo['googleFontLink'] ?? '';
    $descFontLink = $descTypo['googleFontLink'] ?? '';
    $btnFontLink = $btnTypo['googleFontLink'] ?? '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-flip-boxes' id='bBlocksFlipBoxes-$cId'>
        <style>@import url($titleFontLink); @import url($descFontLink); @import url($btnFontLink);". $flipBoxesStyle::renderStyle() ."</style>

        <div class='bBlocksFlipBoxes columns-".$columns['desktop']." columns-tablet-".$columns['tablet']." columns-mobile-".$columns['mobile']."'>". $content ."</div>
    </div>";
    return ob_get_clean();
}


// Flip Box Attributes
function flip_box_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'boxHeight' => array( 'type' => 'string', 'default' => '400px' ),

        'contentAlign' => array( 'type' => 'string', 'default' => 'center' ),

        'frontBG' => array( 'type' => 'object', 'default' => array()),
        'backBG' => array( 'type' => 'object', 'default' => array()),

        'padding' => array( 'type' => 'object', 'default' => array('vertical' => '30px', 'horizontal' => '25px') ),
        'border' => array( 'type' => 'object', 'default' => array() ),
        'shadow' => array( 'type' => 'object', 'default' => array() ),

        'isIcon' => array( 'type' => 'boolean', 'default' => true ),
        'fIcon' => array( 'type' => 'object', 'default' => array('class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff') ),
        'bIcon' => array( 'type' => 'object', 'default' => array('class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff') ),
        'iconMargin' => array( 'type' => 'object', 'default' => array('bottom' => '20px') ),

        'fTitle' => array( 'type' => 'string', 'selector' => 'h3.flipFrontTitle', 'default' => 'Front Title' ),
        'bTitle' => array( 'type' => 'string', 'selector' => 'h3.flipBackTitle', 'default' => 'Back Title' ),
        'titleTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 25) ),
        'titleColor' => array( 'type' => 'string', 'default' => '#fff' ),
        'titleMargin' => array( 'type' => 'object', 'default' => array('bottom' => '20px') ),

        'isDesc' => array( 'type' => 'boolean', 'default' => true ),
        'desc' => array( 'type' => 'string', 'selector' => 'p.flipDescription', 'default' => 'Flip box description' ),
        'descTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 16) ),
        'descColor' => array( 'type' => 'string', 'default' => '#fff' ),

        'isBtn' => array( 'type' => 'boolean', 'default' => true ),
        'btn' => array( 'type' => 'string', 'selector' => 'a.flipBtn', 'default' => 'Click Me' ),
        'btnLink' => array( 'type' => 'string', 'source' => 'attribute', 'selector' => 'a.flipBtn', 'attribute' => 'href', 'default' => '#'),
        'btnTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 16) ),
        'btnColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#ff4500') ),
        'btnHovColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#ff7500') ),
        'btnPadding' => array( 'type' => 'object', 'default' => array('vertical' => '15px', 'horizontal' => '25px') ),
        'btnBorder' => array( 'type' => 'object', 'default' => array('radius' => '3px') )
    );
}

// Render Flip Box
function render_b_blocks_flip_box( $attributes ) {
    extract( $attributes );

    FlipBox::$attributes = $attributes; // Store attributes in FlipBox class

    // Generate Styles
    $flipBoxStyle = new StyleGenerator();
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .box", array(
        $border['styles'] ?? '' => '',
        'box-shadow' => $shadow['styles'] ?? ''
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .box.front", array(
        $frontBG['styles'] ?? 'background-color: #000000b3;' => '',
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .box.back", array(
        $backBG['styles'] ?? 'background-color: #000000b3;' => '',
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipIcon.frontIcon", array(
        $fIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipIcon.backIcon", array(
        $bIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipTitle", array(
        'color' => $titleColor
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipDescription", array(
        'color' => $descColor
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipBtn", array(
        $btnColors['styles'] ?? 'color: #fff; background: #ff4500;' => '',
        $btnBorder['styles'] ?? 'border-radius: 3px;' => ''
    ));
    $flipBoxStyle::addStyle("#bBlocksFlipBox-$cId .flipBtn:hover", array(
        $btnHovColors['styles'] ?? 'color: #fff; background: #ff7500;' => ''
    ));

    // Components
    $frontIcon =  $isIcon && $fIcon['class'] ? "<i class='flipIcon frontIcon ".$fIcon['class']."'></i>" : '';
    $backIcon =  $isIcon && $bIcon['class'] ? "<i class='flipIcon backIcon ".$bIcon['class']."'></i>" : '';
    $frontTitle =  $fTitle ? "<h3 class='flipTitle flipFrontTitle'>$fTitle</h3>" : '';
    $backTitle =  $bTitle ? "<h3 class='flipTitle flipBackTitle'>$bTitle</h3>" : '';
    $description =  $isDesc && $desc ? "<p class='flipDescription'>$desc</p>" : '';
    $button =  $isBtn && $btn ? "<a href='$btnLink' class='flipBtn' target='_blank' rel='noreferrer noopener'>$btn</a>" : '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-flip-box bBlocksFlipBox' id='bBlocksFlipBox-$cId'>
        <style>". $flipBoxStyle::renderStyle() ."</style>

        <div class='box front text-$contentAlign'>
            <div class='frontContent'>". $frontIcon . $frontTitle . $description ."</div>
        </div>

        <div class='box back text-$contentAlign'>
            <div class='backContent'>". $backIcon . $backTitle . $button ."</div>
        </div>
    </div>";

    $flipBoxStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}