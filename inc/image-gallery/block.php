<?php
class BBlocksImageGallery extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'onInit'] );
    }

    function onInit(){
        register_block_type( __DIR__, [
            'render_callback' => [$this, 'render']
        ] ); // Register Block
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $imgShadow = $imgShadow['styles'] ?? '';
        $imgPaddingH = $imgPadding['horizontal'] ?? '0px';
        $imgPaddingV = $imgPadding['vertical'] ?? '0px';

        $imageGalleryStyle = new BBlocksStyleGenerator();
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg", [
            'padding' => $imgPadding['styles'] ?? '0 0',
            $imgBorder['styles'] ?? '' => '',
            'filter' => "drop-shadow( $imgShadow )"
        ] );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption", [
            'text-align' => $capAlign,
            'color' => $capColor,
            'margin' => $imgPadding['styles'] ?? '0 0',
            'width' => "calc( ( 100% - 10px ) - ( $imgPaddingH * 2 ) )",
            'height' => "calc( ( 100% - 10px ) - ( $imgPaddingV * 2 ) )",
            'border-radius' => $imgBorder['radius'] ?? '0px'
        ] );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4", [
            $capTitleTypo['styles'] ?? 'font-size: 18px;' => ''
        ] );
        $imageGalleryStyle::addStyle( "#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p", [
            $capDescTypo['styles'] ?? 'font-size: 15px;' => ''
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-image-gallery <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksImageGallery-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $capTitleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $capDescTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $imageGalleryStyle::renderStyle(), [] ); ?>
            </style>

            <div class='imgGalleryWrapper columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $images as $image ) {
                    $imgUrl = $image['url'];
                    $imgUrlLarge = !empty( $image['sizes']['large']['url'] ) ? $image['sizes']['large']['url'] : $imgUrl;
                    $imgAlt = $image['alt'] ? $image['alt'] : $image['title'];
                    $imgCap = $image['caption'];
                    $imgDesc = $image['description']; ?>
                    
                    <a class='imgGalleryImgLink' 
                        <?php if( $isCap ){}else{ ?>
                            href='#'
                            data-fancybox='imgGalleryPreviewBtn'
                            data-src='<?php echo esc_url( $imgUrl ); ?>'
                            data-srcset='<?php echo esc_url( $imgUrlLarge ); ?> 576w, <?php echo esc_url( $imgUrl ); ?> 992w'
                            data-sizes='( max-width: 576px ) 576px, 992px'
                            data-caption='<?php echo wp_kses_post( $imgCap ); ?>'
                        <?php } ?>>

                        <img src='<?php echo esc_url( $imgUrl ); ?>' alt='<?php echo esc_html( $imgAlt ); ?>' class='imgGalleryImg' />

                        <?php if( $isCap && ( !empty( $imgAlt ) || $isPreview ) ){ ?>
                            <div class='imgGalleryImgCaption'>
                                <div class='captionContent'>
                                    <?php echo !empty( $imgAlt ) ? "<h4>". wp_kses_post( $imgCap ) ."</h4>" : '' ; ?>
                                    <?php echo !empty( $imgDesc ) ? "<p>". wp_kses_post( $imgDesc ) ."</p>" : '' ; ?>

                                    <?php if( $isPreview ){ ?>
                                        <button class='imgGalleryPreviewBtn'
                                            data-fancybox='imgGalleryPreviewBtn'
                                            data-src='<?php echo esc_url( $imgUrl ); ?>'
                                            data-srcset='<?php echo esc_url( $imgUrlLarge ); ?> 576w, <?php echo esc_url( $imgUrl ); ?> 992w'
                                            data-sizes='( max-width: 576px ) 576px, 992px'
                                            data-caption='<?php echo wp_kses_post( $imgCap ); ?>'>
                                            <i class='fa fa-eye'></i><?php echo __( 'Preview', 'b-blocks' ); ?>
                                        </button>
                                    <?php } ?>
                                </div>
                            </div>
                        <?php } ?> <!-- Image Gallery Caption -->
                    </a> <!-- Image Gallery Link -->
                <?php } ?> <!-- Image Gallery Loop -->
            </div> <!-- Image Gallery Wrapper -->
        </div>

        <?php $imageGalleryStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksImageGallery();