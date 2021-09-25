<?php
// Cards Attributes
function b_blocks_cards_attributes(){
    return array(
        'cId' => array( 'type' => 'string' ),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1, ) ),

        'columnGap' => array( 'type' => 'string', 'default' => '20px' ),
        'rowGap' => array( 'type' => 'string', 'default' => '30px' ),

        'layout' => array( 'type' => 'string', 'default' => 'vertical' ),

        'textAlign' => array( 'type' => 'string', 'default' => 'left' ),
        'padding' => array( 'type' => 'object', 'default' => array('vertical' => '20px', 'horizontal' => '10px') ),
        
        'imgHeight' => array( 'type' => 'string', 'default' => '250px' ),
        'catTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 15) ),
        'catMargin' => array( 'type' => 'object', 'default' => array('bottom' => '10px') ),
        'titleTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 22) ),
        'titleMargin' => array( 'type' => 'object', 'default' => array('bottom' => '10px') )
    );
}

// Render Cards
function render_b_blocks_cards($attributes, $content){
    extract( $attributes );

    // Generate Styles
    $cardsStyle = new BBlocksStyleGenerator();
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards", array(
        'grid-gap' => "$rowGap $columnGap"
    ));

    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardImage img", array(
        'height' => $imgHeight
    ));
    $cardsStyle::addStyle("#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails", array(
        'text-align' => $textAlign,
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

    $catFontLink = $catTypo['googleFontLink'] ?? '';
    $titleFontLink = $titleTypo['googleFontLink'] ?? '';

    $alignClass = isset($align) ? 'align' . $align : '';
    $layoutClass = 'horizontal' === $layout ? 'horizontal' : 'vertical';

    return "<div class='wp-block-b-blocks-cards ". esc_attr($alignClass) ."' id='bBlocksCards-$cId'>
        <style>@import url($catFontLink); @import url($titleFontLink);". $cardsStyle::renderStyle() ."</style>

        <div class='bBlocksCards $layoutClass columns-".$columns['desktop']." columns-tablet-".$columns['tablet']." columns-mobile-".$columns['mobile']."'> $content </div>
    </div>";

    $cardsStyle::$styles = array(); // Empty styles
}


// Card Attributes
function b_blocks_card_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'bgColor' => array( 'type' => 'string', 'default' => '#fff0' ),

        'img' => array( 'type' => 'object', 'default' => array('id' => NULL, 'url' => '', 'alt' => '', 'title' => '') ),
        'imgPos' => array( 'type' => 'string', 'default' => 'top' ),
        'imgBorder' => array( 'type' => 'object', 'default' => array('radius' => '5px') ),

        'isCat' => array( 'type' => 'boolean', 'default' => true ),
        'cat' => array( 'type' => 'string', 'selector' => 'h6.cardCategory', 'default' => 'Category' ),
        'catColor' => array( 'type' => 'string', 'default' => '#0dcaf0' ),

        'isTitle' => array( 'type' => 'boolean', 'default' => true ),
        'title' => array( 'type' => 'string', 'selector' => 'h3.cardTitle', 'default' => 'Card Title' ),
        'titlePos' => array( 'type' => 'string', 'default' => 'image' ),
        'titleColor' => array( 'type' => 'string', 'default' => '#ff7500' ),
    );
}

// Render Card
function render_b_blocks_card( $attributes, $content ) {
    extract( $attributes );

    // Generate Styles
    $cardStyle = new BBlocksStyleGenerator();
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

    return "<div class='wp-block-b-blocks-card' id='bBlocksCard-$cId'>
        <style>". $cardStyle::renderStyle() ."</style>

        <div class='bBlocksCard $imgPosClass'>
            $cardImageInTop

            <div class='cardDetails'>
                $cardCategory
                $cardTitleInContent
                $content
            </div>

            $cardImageInBottom
        </div>
    </div>";

    $cardStyle::$styles = array(); // Empty styles
}