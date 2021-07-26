<?php
// Store some data of block
class Card{
    static $attributes = array();
}

// Cards Attributes
function cards_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1, ) ),

        'columnGap' => array( 'type' => 'string', 'default' => '20px' ),
        'rowGap' => array( 'type' => 'string', 'default' => '30px' )
    );
}

// Render Cards
function render_b_blocks_cards($attributes, $content){
    extract( $attributes );
    extract( Card::$attributes );

    // Generate Styles
    $cardsStyle = new StyleGenerator();
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards", array(
        'grid-gap' => "$rowGap $columnGap"
    ));

    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardImage img", array(
        'height' => $imgHeight
    ));
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails", array(
        'padding' => $padding['styles'] ?? '20px 10px'
    ));
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails .cardCategory", array(
        $catTypo['styles'] ?? 'font-size: 15px' => '',
        'margin' => $catMargin['styles'] ?? '0 0 10px 0'
    ));
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardTitle", array(
        $titleTypo['styles'] ?? 'font-size: 22px' => '',
        'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
    ));

    $catTypoFontLink = $catTypo['googleFontLink'] ?? '';
    $titleTypoFontLink = $titleTypo['googleFontLink'] ?? '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-cards' id='bBlocksCards-$cId'>
        <style>@import url($catTypoFontLink); @import url($titleTypoFontLink);". $cardsStyle::renderStyle() ."</style>

        <div class='bBlocksCards columns-".$columns['desktop']." columns-tablet-".$columns['tablet']." columns-mobile-".$columns['mobile']."'>". $content ."</div>
    </div>";

    $cardsStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}


// Card Attributes
function card_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'layout' => array( 'type' => 'string', 'default' => 'vertical' ),

        'textAlign' => array( 'type' => 'string', 'default' => 'left' ),
        'bgColor' => array( 'type' => 'string', 'default' => '#fff0' ),
        'padding' => array( 'type' => 'object', 'default' => array('vertical' => '20px', 'horizontal' => '10px') ),

        'img' => array( 'type' => 'object', 'default' => array('id' => NULL, 'url' => '', 'alt' => '', 'title' => '') ),
        'imgHeight' => array( 'type' => 'string', 'default' => '250px' ),
        'imgPos' => array( 'type' => 'string', 'default' => 'top' ),
        'imgBorder' => array( 'type' => 'object', 'default' => array('radius' => '5px') ),

        'isCat' => array( 'type' => 'boolean', 'default' => true ),
        'cat' => array( 'type' => 'string', 'selector' => 'h6.cardCategory', 'default' => 'Category' ),
        'catTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 15) ),
        'catColor' => array( 'type' => 'string', 'default' => '#0dcaf0' ),
        'catMargin' => array( 'type' => 'object', 'default' => array('bottom' => '10px') ),

        'isTitle' => array( 'type' => 'boolean', 'default' => true ),
        'title' => array( 'type' => 'string', 'selector' => 'h3.cardTitle', 'default' => 'Card Title' ),
        'titlePos' => array( 'type' => 'string', 'default' => 'image' ),
        'titleTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 22) ),
        'titleColor' => array( 'type' => 'string', 'default' => '#ff7500' ),
        'titleMargin' => array( 'type' => 'object', 'default' => array('bottom' => '10px') )
    );
}

// Render Card
function render_b_blocks_card( $attributes, $content ) {
    extract( $attributes );

    Card::$attributes = $attributes; // Store attributes in Card class

    // Generate Styles
    $cardStyle = new StyleGenerator();
    $cardStyle::addStyle("#bBlocksCard-$cId .bBlocksCard", array(
        'background-color' => $bgColor
    ));
    $cardStyle::addStyle("#bBlocksCard-$cId .bBlocksCard .cardImage", array(
        $imgBorder['styles'] ?? 'border-radius: 5px;' => ''
    ));
    $cardStyle::addStyle("#bBlocksCard-$cId .bBlocksCard .cardDetails .cardCategory", array(
        'color' => $catColor
    ));
    $cardStyle::addStyle("#bBlocksCard-$cId .bBlocksCard .cardTitle", array(
        'color' => $titleColor
    ));

    // Classes
    $layoutClass = 'horizontal' === $layout ? 'horizontal' : 'vertical';
    $imgPosClass = 'bottom' === $imgPos ? 'bottomImg' : 'topImg';
    $imgClass = $img['id'] ? 'wp-image-'.$img['id'] : '';

    // Components
    $cardTitle = $isTitle && $title ? "<h3 class='cardTitle'>$title</h3>" : '';
    $cardTitleInImage = 'image' === $titlePos ? $cardTitle : '';
    $cardTitleInContent = 'content' === $titlePos ? $cardTitle : '';

    $cardImage = $img['url'] ? "<figure class='cardImage'>
            <img class='$imgClass' src='".$img['url']."' alt='".$img['alt']."' /> $cardTitleInImage
        </figure>" : '';

    $cardImageInTop =  'top' === $imgPos ? $cardImage : '';
    $cardImageInBottom =  'bottom' === $imgPos ? $cardImage : '';

    $cardCategory =  $isCat && $cat ? "<h6 class='cardCategory'>$cat</h6>" : '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-card' id='bBlocksCard-$cId'>
        <style>". $cardStyle::renderStyle() ."</style>

        <div class='bBlocksCard $layoutClass $imgPosClass'>
            $cardImageInTop

            <div class='cardDetails text-$textAlign'>
                $cardCategory
                $cardTitleInContent
                $content
            </div>

            $cardImageInBottom
        </div>
    </div>";

    $cardStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}