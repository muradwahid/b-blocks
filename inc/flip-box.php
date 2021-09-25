<?php
// Store some data of block
class FlipBox{
    static $attributes = array();
}

$newFlipBox = new FlipBox();

// Flip Boxes Attributes
function flip_boxes_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1, ) ),

        'columnGap' => array( 'type' => 'string', 'default' => '40px' ),
        'rowGap' => array( 'type' => 'string', 'default' => '30px' ),

        'boxHeight' => array( 'type' => 'string', 'default' => '400px' ),
        'textAlign' => array( 'type' => 'string', 'default' => 'center' ),
        'boxPadding' => array( 'type' => 'object', 'default' => array('vertical' => '30px', 'horizontal' => '25px') ),

        'isIcon' => array( 'type' => 'boolean', 'default' => true ),
        'iconMargin' => array( 'type' => 'object', 'default' => array('bottom' => '20px') ),
        'titleTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 25) ),
        'titleMargin' => array( 'type' => 'object', 'default' => array('bottom' => '20px') ),
        'isDesc' => array( 'type' => 'boolean', 'default' => true ),
        'descTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 16) ),
        'isBtn' => array( 'type' => 'boolean', 'default' => true ),
        'btnTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 16) ),
        'btnPadding' => array( 'type' => 'object', 'default' => array('vertical' => '15px', 'horizontal' => '25px') ),
    );
}

// Render Flip Boxes
function render_b_blocks_flip_boxes($attributes, $content){
    extract( $attributes );
    $newFlipBox::$attributes = $attributes; // Store attributes

    // Generate Styles
    $flipBoxesStyle = new BBlocksStyleGenerator();
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBoxes", array(
        'grid-gap' => "$rowGap $columnGap"
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox", array(
        'height' => $boxHeight
    ));
    $flipBoxesStyle::addStyle("#bBlocksFlipBoxes-$cId .bBlocksFlipBox .box", array(
        'text-align' => $textAlign,
        'padding' => $boxPadding['styles'] ?? '30px 25px'
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

    $alignClass = isset($align) ? 'align' . esc_attr($align) : '';

    return "<div class='wp-block-b-blocks-flip-boxes $alignClass' id='bBlocksFlipBoxes-$cId'>
        <style>@import url($titleFontLink); @import url($descFontLink); @import url($btnFontLink);". $flipBoxesStyle::renderStyle() ."</style>

        <div class='bBlocksFlipBoxes columns-".$columns['desktop']." columns-tablet-".$columns['tablet']." columns-mobile-".$columns['mobile']."'>$content</div>
    </div>";
    $flipBoxesStyle::$styles = array(); // Empty styles
}


// Flip Box Attributes
function flip_box_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'frontBG' => array( 'type' => 'object', 'default' => array()),
        'backBG' => array( 'type' => 'object', 'default' => array()),
        'border' => array( 'type' => 'object', 'default' => array() ),
        'shadow' => array( 'type' => 'object', 'default' => array() ),

        'fIcon' => array( 'type' => 'object', 'default' => array('class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff') ),
        'bIcon' => array( 'type' => 'object', 'default' => array('class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff') ),

        'fTitle' => array( 'type' => 'string', 'selector' => 'h3.flipFrontTitle', 'default' => 'Front Title' ),
        'bTitle' => array( 'type' => 'string', 'selector' => 'h3.flipBackTitle', 'default' => 'Back Title' ),
        'titleColor' => array( 'type' => 'string', 'default' => '#fff' ),

        'desc' => array( 'type' => 'string', 'selector' => 'p.flipDescription', 'default' => 'Flip box description' ),
        'descColor' => array( 'type' => 'string', 'default' => '#fff' ),

        'btn' => array( 'type' => 'string', 'selector' => 'a.flipBtn', 'default' => 'Click Me' ),
        'btnLink' => array( 'type' => 'string', 'source' => 'attribute', 'selector' => 'a.flipBtn', 'attribute' => 'href', 'default' => '#'),
        'btnColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#ff4500') ),
        'btnHovColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#ff7500') ),
        'btnBorder' => array( 'type' => 'object', 'default' => array('radius' => '3px') )
    );
}

// Render Flip Box
function render_b_blocks_flip_box( $attributes ) {
    extract( $attributes );
    extract( $newFlipBox::$attributes );
    echo '<pre>';
    print_r($newFlipBox::$attributes);
    echo '</pre>';

    // Generate Styles
    $flipBoxStyle = new BBlocksStyleGenerator();
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

        <div class='box front'>
            <div class='frontContent'>". $frontIcon . $frontTitle . $description ."</div>
        </div>

        <div class='box back'>
            <div class='backContent'>". $backIcon . $backTitle . $button ."</div>
        </div>
    </div>";

    $flipBoxStyle::$styles = array(); // Empty styles
    return ob_get_clean();
}