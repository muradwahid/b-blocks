<?php
class BBlocksImageGallery extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'image-gallery', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string', 'default' => '' ),
    
            'images' => array( 'type' => 'array', 'default' => array() ),
    
            'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ) ),
    
            'imgPadding' => array( 'type' => 'object', 'default' => array() ),
            'imgBorder' => array( 'type' => 'object', 'default' => array() ),
            'imgShadow' => array( 'type' => 'object', 'default' => array() ),
    
            'isCap' => array( 'type' => 'boolean', 'default' => true ),
            'capAlign' => array( 'type' => 'string', 'default' => 'left' ),
            'capColor' => array( 'type' => 'string', 'default' => '#333' ),
            'capTitleTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 18 ) ),
            'capDescTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $imgShadow = $imgShadow['styles'] ?? '';
        $imgPaddingH = $imgPadding['horizontal'] ?? '0px';
        $imgPaddingV = $imgPadding['vertical'] ?? '0px';

        $imageGalleryStyle = new BBlocksStyleGenerator();
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg", array(
            'padding' => $imgPadding['styles'] ?? '0 0',
            $imgBorder['styles'] ?? '' => '',
            'filter' => "drop-shadow($imgShadow)"
        ) );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption", array(
            'text-align' => $capAlign,
            'color' => $capColor,
            'margin' => $imgPadding['styles'] ?? '0 0',
            'width' => "calc((100% - 10px) - ($imgPaddingH * 2) )",
            'height' => "calc((100% - 10px) - ($imgPaddingV * 2) )",
            'border-radius' => $imgBorder['radius'] ?? '0px'
        ) );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4", array(
            $capTitleTypo['styles'] ?? 'font-size: 18px;' => ''
        ) );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p", array(
            $capDescTypo['styles'] ?? 'font-size: 15px;' => ''
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-image-gallery <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksImageGallery-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $capTitleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $capDescTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $imageGalleryStyle::renderStyle(), array() ); ?>
            </style>

            <div class='imgGalleryWrapper columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $images as $image ) {
                    // Components
                    $imgDesc = isset( $image['description'] ) && $image['description'] ? "<p>". $image['description'] ."</p>" : '';
                    $imgCaption = $isCap && isset( $image['caption'] ) && $image['caption'] ? "<div class=imgGalleryImgCaption>
                        <div class='captionContent'>
                            <h4>". $image['caption'] ."</h4>
                            $imgDesc
                        </div>
                    </div>" : ''; ?>
                    
                    <a class='imgGalleryImgLink'>
                        <img src='<?php echo esc_url( $image['url'] ); ?>' alt='' class='imgGalleryImg' />

                        <?php echo wp_kses( $imgCaption, array(
                            'div' => array(
                                'class' => array()
                            ),
                            'h4' => array(),
                            'p' => array()
                        ) ); ?>
                    </a>
                <?php } ?>
            </div>
        </div>

        <?php $imageGalleryStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksImageGallery();