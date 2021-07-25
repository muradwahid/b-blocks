<?php
// Image Gallery Attributes
function image_gallery_attributes(){
    return array(
        'cId' => array( 'type' => 'string'),

        'images' => array( 'type' => 'array', 'default' => array() ),

        'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1, ) ),

        'imgPadding' => array( 'type' => 'object', 'default' => array()),
        'imgBorder' => array( 'type' => 'object', 'default' => array()),
        'imgShadow' => array( 'type' => 'object', 'default' => array()),

        'isCap' => array( 'type' => 'boolean', 'default' => true ),
        'capTitleTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 18) ),
        'capDescTypo' => array( 'type' => 'object', 'default' => array('fontSize' => 15) ),
        'capColor' => array( 'type' => 'string', 'default' => '#333' ),
        'capAlign' => array( 'type' => 'string', 'default' => 'left' )
    );
}

// Render Image Gallery
function render_b_blocks_image_gallery( $attributes ) {
    extract( $attributes );

    // Generate Styles
    $imgShadow = $imgShadow['styles'] ?? '';
    $imgPaddingH = $imgPadding['horizontal'] ?? '0px';
    $imgPaddingV = $imgPadding['vertical'] ?? '0px';

    $imageGalleryStyle = new StyleGenerator();
    $imageGalleryStyle::addStyle("#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg", array(
        'padding' => $imgPadding['styles'] ?? '0 0',
        $imgBorder['styles'] ?? '' => '',
        'filter' => "drop-shadow($imgShadow)"
    ));
    $imageGalleryStyle::addStyle("#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption", array(
        'color' => $capColor,
        'margin' => $imgPadding['styles'] ?? '0 0',
        'width' => "calc((100% - 10px) - ($imgPaddingH * 2))",
        'height' => "calc((100% - 10px) - ($imgPaddingV * 2))"
    ));
    $imageGalleryStyle::addStyle("#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4", array(
        $capTitleTypo['styles'] ?? 'font-size: 18px;' => '',
    ));
    $imageGalleryStyle::addStyle("#bBlocksImageGallery-$cId .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p", array(
        $capDescTypo['styles'] ?? 'font-size: 15px;' => '',
    ));

    $capTitleFont = $capTitleTypo['googleFontLink'] ?? '';
    $capDescFont = $capDescTypo['googleFontLink'] ?? '';

    ob_start(); // Echo the content
    echo "<div class='wp-block-b-blocks-image-gallery' id='bBlocksImageGallery-$cId'>
        <style>@import url($capTitleFont); @import url($capDescFont);". $imageGalleryStyle::renderStyle() ."</style>

        <div class='imgGalleryWrapper columns-".$columns['desktop']." columns-tablet-".$columns['tablet']." columns-mobile-".$columns['mobile']."'>";

            foreach ($images as $image) {
                // Components
                $imgDesc = $image['description'] ?? '';
                $imgCap = $image['caption'] ?? '';
                $imgCaption =  $isCap && $image['caption'] ? "<div class=imgGalleryImgCaption text-$capAlign>
                        <div class='captionContent'>
                            <h4>$imgCap</h4>
                            <p>$imgDesc</p>
                        </div>
                    </div>" : '';
                
                echo "<a class='imgGalleryImgLink'>
                    <img src=".$image['url']." alt='' class='imgGalleryImg' />
                    $imgCaption
                </a>";
            }

    echo "</div>
    </div>";

    $imageGalleryStyle::$styles = array(); // Empty before blocks styles in after blocks
    return ob_get_clean();
}