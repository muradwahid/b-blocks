<?php
class BBlocksSlider{
    public function __construct(){
        add_action('init', [$this, 'register']);
    }

    function register(){
        BBlocksRegisterScript::register('slider', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ));
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),
    
            'slides' => array( 'type' => 'array', 'default' => array(
                array(
                    'background' => array( 'color' => '#00000080' ),
                    'position' => 'center center',
                    'title' => 'Slide Title 1',
                    'description' => 'Description of slide 1',
                    'btnText' => 'Button 1', 'btnLink' => '#'
                ),
                array(
                    'background' => array( 'color' => '#00000080' ),
                    'position' => 'center center',
                    'title' => 'Slide Title 2',
                    'description' => 'Description of slide 2',
                    'btnText' => 'Button 2', 'btnLink' => '#'
                ),
                array(
                    'background' => array( 'color' => '#00000080' ),
                    'position' => 'center center',
                    'title' => 'Slide Title 3',
                    'description' => 'Description of slide 3',
                    'btnText' => 'Button 3', 'btnLink' => '#'
                )
            ) ),
    
            'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 1, 'tablet' => 1, 'mobile' => 1, ) ),
            'columnGap' => array( 'type' => 'string', 'default' => 15 ),
            'sliderWidth' => array( 'type' => 'string', 'default' => '100%' ),
            'sliderHeight' => array( 'type' => 'string', 'default' => '400px' ),
            'sliderAlign' => array( 'type' => 'string', 'default' => 'center' ),
    
            'isLoop' => array( 'type' => 'boolean', 'default' => true ),
            'isTouchMove' => array( 'type' => 'boolean', 'default' => false ),
            'isAutoplay' => array( 'type' => 'boolean', 'default' => true ),
            'speed' => array( 'type' => 'number', 'default' => 1.5 ),
            'effect' => array( 'type' => 'string', 'default' => 'slide' ),
            'isPage' => array( 'type' => 'boolean', 'default' => true ),
            'isPageClickable' => array( 'type' => 'boolean', 'default' => true ),
            'isPageDynamic' => array( 'type' => 'boolean', 'default' => true ),
            'pageColor' => array( 'type' => 'string', 'default' => '#fff' ),
            'pageWidth' => array( 'type' => 'string', 'default' => '15px' ),
            'pageHeight' => array( 'type' => 'string', 'default' => '15px' ),
            'pageBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '50%' ) ),
            'isPrevNext' => array( 'type' => 'boolean', 'default' => true ),
            'prevNextColor' => array( 'type' => 'string', 'default' => '#fff' ),
    
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
            'btnColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
            'btnHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '12px', 'horizontal' => '35px' ) ),
            'btnBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '3px' ) )
        );
    }

    function render($attributes){
        extract( $attributes );

        // Generate Styles
        $sliderStyle = new BBlocksStyleGenerator();
        $sliderStyle::addStyle("#bBlocksSlider-$cId", array( 'text-align' => $sliderAlign ));
        $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider", array(
            'width' => $sliderWidth,
            'height' => $sliderHeight
        ));
        $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide", array( 'height' => $sliderHeight ));
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
            $btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
            $btnTypo['styles'] ?? 'font-size: 16px;' => '',
            'padding' => $btnPadding['styles'] ?? '12px 35px',
            $btnBorder['styles'] ?? 'border-radius: 3px;' => ''
        ));
        $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .slide .sliderBtn:hover", array( $btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => '' ));

        $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .swiper-pagination .swiper-pagination-bullet", array(
            'background' => $pageColor,
            'width' => $pageWidth,
            'height' => $pageHeight,
            $pageBorder['styles'] ?? 'border-radius: 50%;' => ''
        ));
        $sliderStyle::addStyle("#bBlocksSlider-$cId .bBlocksSlider .swiper-button-prev, #bBlocksSlider-$cId .bBlocksSlider .swiper-button-next", array( 'color' => $prevNextColor ));

        $jsonData = json_encode( array( 'columns' => $columns ?? array( 'desktop' => 1, 'tablet' => 1, 'mobile' => 1 ), 'columnGap' => $columnGap ?? 15, 'isLoop' => $isLoop ?? true, 'isTouchMove' => $isTouchMove ?? false, 'isAutoplay' => $isAutoplay ?? true, 'speed' => $speed ?? 1.5, 'effect' => $effect ?? 'slide', 'isPageClickable' => $isPageClickable ?? true, 'isPageDynamic' => $isPageDynamic ?? true ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-slider <?php echo isset($align) ? 'align' . esc_attr($align) : ''; ?>' id='bBlocksSlider-<?php echo esc_attr($cId); ?>' data-swiper='<?php echo esc_attr($jsonData); ?>'>
            <style>
                @import url(<?php echo esc_url($titleTypo['googleFontLink'] ?? ''); ?>);
                @import url(<?php echo esc_url($descTypo['googleFontLink'] ?? ''); ?>);
                @import url(<?php echo esc_url($btnTypo['googleFontLink'] ?? ''); ?>);
                <?php echo wp_kses($sliderStyle::renderStyle(), array()); ?>
            </style>

            <div class='bBlocksSlider'>
                <div class='swiper-wrapper'>
                    <?php foreach ($slides as $index => $slide) {
                        $slideBGStyle = $slide['background']['styles'] ?? 'background-color: #00000080;';
                        $slidePosition = $slide['position'] ?? 'center center';
                        $slideTitle = $slide['title'] ?? '';
                        $slideDesc = $slide['description'] ?? '';
                        $slideBtnText = $slide['btnText'] ?? '';
                        $slideBtnLink = $slide['btnLink'] ?? ''; ?>

                        <div class='slide slide-<?php echo esc_attr($index) ?> swiper-slide'>
                            <style><?php echo "#bBlocksSlider-".esc_attr($cId)." .bBlocksSlider .slide-$index{".wp_kses($slideBGStyle, array())."}" ?></style>

                            <div class='sliderContent <?php echo esc_attr(str_replace(' ', '-', $slidePosition)); ?>'>
                                <?php echo $isTitle && $slideTitle ? "<h2 class='sliderTitle'>". esc_html($slideTitle) ."</h2>" : ''; ?>
                                <?php echo $isDesc && $slideDesc ? "<p class='sliderDescription'>". esc_html($slideDesc) ."</p>" : ''; ?>
                                <?php echo $isBtn && $slideBtnText ? "<a href='$slideBtnLink' class='sliderBtn' target='_blank' rel='noreferrer'>". esc_html($slideBtnText) ."</a>" : ''; ?>
                            </div>
                        </div>
                    <?php } ?>
                </div>

                <?php echo $isPage ? "<div class='swiper-pagination'></div>" : ''; ?>
                <?php echo $isPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : ''; ?>
            </div>
        </div>

        <?php $sliderStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksSlider();