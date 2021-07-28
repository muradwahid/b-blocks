<?php
// Slider Attributes
function b_blocks_slider_attributes(){
    return array(
        'align' => array( 'type' => 'string', 'default' => ''),
        'cId' => array( 'type' => 'string'),

        'slides' => array( 'type' => 'array', 'default' => array(
            array('img' => '', 'title' => 'Slide Title', 'description' => 'Description of slide', 'btnText' => 'Click Me', 'btnLink' => '#')
        ) ),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 1, 'tablet'  => 1, 'mobile'  => 1, ) ),
        'columnGap' => array( 'type' => 'number', 'default' => 15 ),
        'sliderHeight' => array( 'type' => 'string', 'default' => '350px' ),
        'bgOverlay' => array( 'type' => 'string', 'default' => '#00000080' ),

        'isLoop' => array( 'type' => 'boolean', 'default' => true),
        'isAutoplay' => array( 'type' => 'boolean', 'default' => true ),
        'speed' => array( 'type' => 'number', 'default' => 1 ),
        'isFade' => array( 'type' => 'boolean', 'default' => false ),
        'isTouchMove' => array( 'type' => 'boolean', 'default' => false ),
        'isPage' => array( 'type' => 'boolean', 'default' => true ),
        'isPageClickable' => array( 'type' => 'boolean', 'default' => true ),
        'isPageDynamic' => array( 'type' => 'boolean', 'default' => true ),
        'pageColor' => array( 'type' => 'string', 'default' => '#fff' ),
        'pageWidth' => array( 'type' => 'string', 'default' => '15px' ),
        'pageHeight' => array( 'type' => 'string', 'default' => '15px' ),
        'pageBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '50%' ) ),
        'isPrevNext' => array( 'type' => 'boolean', 'default' => true ),
        'prevNextColor' => array( 'type' => 'string', 'default' => '#fff' ),

        'textAlign' => array( 'type' => 'string', 'default' => 'center' ),

        'isTitle' => array( 'type' => 'boolean', 'default' => true ),
        'titleTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 25 ) ),
        'titleColor' => array( 'type' => 'string', 'default' => '#fff' ),
        'titleMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),

        'isDesc' => array( 'type' => 'boolean', 'default' => true ),
        'descTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
        'descColor' => array( 'type' => 'string', 'default' => '#fff' ),
        'descMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),

        'isBtn' => array( 'type' => 'boolean', 'default' => true ),
        'btnTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 16 ) ),
        'btnColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#ff4500' ) ),
        'btnHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#ff7500' ) ),
        'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '12px', 'horizontal' => '35px' ) ),
        'btnBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '3px' ) )
    );
}

// Render Slider
function render_b_blocks_slider( $attributes ) {
    extract( $attributes );

    // Generate Styles
    $sliderStyle = new StyleGenerator();
    $sliderStyle::addStyle("#bBlocksSlider-$cId", array(
        'height' => $sliderHeight
    ));

    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide .sliderTitle", array(
        'color' => $titleColor,
        $titleTypo['styles'] ?? 'font-size: 25px;' => '',
        'margin' => $titleMargin['styles'] ?? '0 0 15px 0'
    ));
    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide .sliderDescription", array(
        'color' => $descColor,
        $descTypo['styles'] ?? 'font-size: 15px;' => '',
        'margin' => $descMargin['styles'] ?? '0 0 15px 0'
    ));
    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide .sliderBtn", array(
        $btnColors['styles'] ?? 'color: #fff; background: #ff4500;' => '',
        $btnTypo['styles'] ?? 'font-size: 16px;' => '',
        'padding' => $btnPadding['styles'] ?? '12px 35px',
        $btnBorder['styles'] ?? 'border-radius: 3px;' => ''
    ));
    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide .sliderBtn:hover", array(
        $btnHovColors['styles'] ?? 'color: #fff; background: #ff7500;' => ''
    ));

    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .swiper-pagination .swiper-pagination-bullet", array(
        'background' => $pageColor,
        'width' => $pageWidth,
        'height' => $pageHeight,
        $pageBorder['styles'] ?? 'border-radius: 50%;' => ''
    ));
    $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .swiper-button-prev, #bBlocksSlider-$cId .bBlocksSlider .swiper-button-next", array(
        'color' => $prevNextColor,
    ));

    $titleFontLink = $titleTypo['googleFontLink'] ?? '';
    $descFontLink = $descTypo['googleFontLink'] ?? '';
    $btnFontLink = $btnTypo['googleFontLink'] ?? '';

    // Components
    $pagination = $isPage ? "<div class='swiper-pagination'></div>" : '';
    $prevNext = $isPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : '';

    $jsonData = json_encode(array('columns' => $columns, 'columnGap' => $columnGap, 'isLoop' => $isLoop, 'isAutoplay' => $isAutoplay, 'speed' => $speed, 'isFade' => $isFade, 'isTouchMove' => $isTouchMove, 'isPageClickable' => $isPageClickable, 'isPageDynamic' => $isPageDynamic ));

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-slider' id='bBlocksSlider-$cId' data-swiper='$jsonData'>
        <style>@import url($titleFontLink); @import url($descFontLink); @import url($btnFontLink);". $sliderStyle::renderStyle() ."</style>

        <div class='bBlocksSlider'>
            <div class='swiper-wrapper'>";

                foreach ($slides as $index => $slide) {
                    $slideImg = $slide['img'] ?? '';
                    $slideTitle = $slide['title'] ?? '';
                    $slideDesc = $slide['description'] ?? '';
                    $slideBtnText = $slide['btnText'] ?? '';
                    $slideBtnLink = $slide['btnLink'] ?? '';

                    // Components
                    $sliderTitle = $isTitle && $slideTitle ? "<h2 class='sliderTitle'>$slideTitle</h2>" : '';
                    $sliderDescription = $isDesc && $slideDesc ? "<p class='sliderDescription'>$slideDesc</p>" : '';
                    $sliderBtn = $isBtn && $slideBtnText ? "<a href='$slideBtnLink' class='sliderBtn' target='_blank' rel='noreferrer noopener'>$slideBtnText</a>" : '';

                    echo "</pre><div class='slide slide-$index swiper-slide'>
                        <style>#bBlocksSlider-$cId .bBlocksSlider .slide-$index{
                            background: url($slideImg) center center / cover no-repeat $bgOverlay;
                        }</style>

                        <div class='sliderContent text-$textAlign'>
                            $sliderTitle $sliderDescription $sliderBtn
                        </div>
                    </div>";
                }

            echo "</div>

            $pagination $prevNext
        </div>
    </div>";

    $sliderStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}