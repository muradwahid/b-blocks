<?php
// Image Comparison Attributes
function b_blocks_image_comparison_attributes(){
    return array(
        'cId' => array( 'type' => 'string' ),
        'textAlign' => array( 'type' => 'string', 'default' => 'center' ),

        'width' => array( 'type' => 'string', 'default' => '80%' ),
        'border' => array( 'type' => 'object', 'default' => array()),

        'beforeImg' => array( 'type' => 'object', 'default' => array('id' => NULL, 'url' => '', 'alt' => '', 'title' => '') ),
        'afterImg' => array( 'type' => 'object', 'default' => array('id' => NULL, 'url' => '', 'alt' => '', 'title' => '') ),
        
        'isSwap' => array( 'type' => 'boolean', 'default' => false ),
        
        'isLabel' => array( 'type' => 'boolean', 'default' => true ),
        'beforeLabel' => array( 'type' => 'string', 'selector' => '.beforeLabel' ),
        'afterLabel' => array( 'type' => 'string', 'selector' => '.afterLabel' ),
        'labelTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 15) ),
        'labelColors' => array( 'type' => 'object', 'default' => array('color' => '#fff', 'bg' => '#00000080') ),
        'labelPadding' => array( 'type' => 'object', 'default' => array('vertical' => '10px', 'horizontal' => '15px')),

        'isCap' => array( 'type' => 'boolean', 'default' => true ),
        'cap' => array( 'type' => 'string', 'selector' => '.caption' ),
        'capAlign' => array( 'type' => 'string', 'default' => 'center' ),
        'capTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 14) ),
        'capColors' => array( 'type' => 'object', 'default' => array('color' => '#333', 'bg' => '#f4f4f4') ),
        'capPadding' => array( 'type' => 'object', 'default' => array('vertical' => '10px', 'horizontal' => '15px'))
    );
}

// Render Image Comparison
function render_b_blocks_image_comparison( $attributes ) {
    extract( $attributes );

    // Generate Styles
    $imageComparisonStyle = new StyleGenerator();
    $imageComparisonStyle::addStyle("#bBlocksImageComparison-$cId .bBlocksImageComparison", array(
        'width' => $width,
        $border['styles'] ?? '' => ''
    ));
    $imageComparisonStyle::addStyle("#bBlocksImageComparison-$cId .bBlocksImageComparison .overlay", array(
        $labelTypo['styles'] ?? 'font-size: 15px;' => '',
        $labelColors['styles'] ?? 'color: #fff; background: #00000080;' => '',
        'padding' => $labelPadding['styles'] ?? '10px 15px'
    ));
    $imageComparisonStyle::addStyle("#bBlocksImageComparison-$cId .bBlocksImageComparison .caption", array(
        $capTypo['styles'] ?? 'font-size: 14px;' => '',
        $capColors['styles'] ?? 'color: #333; background: #f4f4f4;' => '',
        'padding' => $capPadding['styles'] ?? '10px 15px'
    ));

    $labelFontLink = $labelTypo['googleFontLink'] ?? '';
    $capFontLink = $capTypo['googleFontLink'] ?? '';

    // Components
    $beforeLabelContent = $isLabel ? "<div class='overlay beforeLabel'>$beforeLabel</div>" : '';
    $afterLabelContent = $isLabel ? "<div class='overlay afterLabel'>$afterLabel</div>" : '';

    $caption = $isCap ? "<div class='caption'>$cap</div>" : '';

    $beforeImgUrl = $beforeImg['url'] ?? '';
    $beforeImgAlt = $beforeImg['alt'] ?? '';
    $beforeImage = "<img class='beforeImg' src='$beforeImgUrl' alt='$beforeImgAlt' />";
    $afterImgUrl = $afterImg['url'] ?? '';
    $afterImgAlt = $afterImg['alt'] ?? '';
    $afterImage = "<img class='afterImg' src='$afterImgUrl' alt='$afterImgAlt' />";

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-image-comparison text-$textAlign' id='bBlocksImageComparison-$cId'>
        <style>@import url($labelFontLink); @import url($capFontLink);". $imageComparisonStyle::renderStyle() ."</style>

        <div class='bBlocksImageComparison'>
            <div class='comparison-slider'>
                $afterLabelContent $afterImage
 
                <div class='resize'>
                    $beforeLabelContent $beforeImage
                </div>

                <div class='divider'></div>
            </div>

            $caption
        </div>
    </div>";

    $imageComparisonStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}