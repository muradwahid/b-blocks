<?php
class BBlocksFeatureBoxes extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'feature-boxes', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $features = $features ?? array(
            array(
                'background' => array( 'color' => '#0000' ),
                'isUpIcon' => false,
                'icon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 120 ),
                'upIcon' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'iconWidth' => '120px',
                'title' => 'Feature 1',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ),
                'desc' => 'This content area describes feature 1 descriptions or details.',
                'descColor' => '#333'
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'isUpIcon' => false,
                'icon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 120 ),
                'upIcon' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'iconWidth' => '120px',
                'title' => 'Feature 2',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ),
                'desc' => 'This content area describes feature 2 descriptions or details.',
                'descColor' => '#333'
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'isUpIcon' => false,
                'icon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 120 ),
                'upIcon' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'iconWidth' => '120px',
                'title' => 'Feature 3',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ),
                'desc' => 'This content area describes feature 3 descriptions or details.',
                'descColor' => '#333'
            )
        );
        $columns = $columns ?? array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 );
        $columnGap = $columnGap ?? '30px';
        $rowGap = $rowGap ?? '30px';
        $textAlign = $textAlign ?? 'center';
        $padding = $padding ?? array( 'vertical' => '50px', 'horizontal' => '20px' );
        $isIcon = $isIcon ?? true;
        $iconMargin = $iconMargin ?? array( 'bottom' => '20px' );
        $isTitle = $isTitle ?? true;
        $titleTypo = $titleTypo ?? array( 'fontSize' => 20, 'fontWeight' => 600 );
        $titleMargin = $titleMargin ?? array( 'bottom' => '10px' );
        $isSep = $isSep ?? true;
        $sepMargin = $sepMargin ?? array( 'bottom' => '10px' );
        $isDesc = $isDesc ?? true;
        $descTypo = $descTypo ?? array( 'fontSize' => 15 );

        // Generate Styles
        $featureBoxesStyle = new BBlocksStyleGenerator();
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes", array(
            'grid-gap' => "$rowGap $columnGap"
        ) );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature", array(
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ) );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureIcon", array(
            'margin' => $iconMargin['styles'] ?? '0 0 10px 0'
        ) );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureTitle", array(
            $titleTypo['styles'] ?? 'font-size: 20px; font-weight: 600;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ) );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureSeparator", array(
            'margin' => $sepMargin['styles'] ?? '0 0 10px 0'
        ) );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureDescription", array(
            $descTypo['styles'] ?? 'font-size: 15px;' => ''
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-feature-boxes <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksFeatureBoxes-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $featureBoxesStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksFeatureBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $features as $index => $feature ) {
                    extract( $feature );

                    $featureStyle = new BBlocksStyleGenerator();
                    $featureStyle::addStyle( "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index", array(
                        $background['styles'] ?? 'background-color: #0000;' => ''
                    ) );
                    $featureStyle::addStyle("#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon i", array(
                        $icon['styles'] ?? 'font-size: 120px;' => ''
                    ) );
                    $featureStyle::addStyle("#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon img", array(
                        'width' => $iconWidth
                    ) );
                    $featureStyle::addStyle( "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureTitle", array(
                        'color' => $titleColor
                    ) );
                    $featureStyle::addStyle( "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureSeparator", array(
                        $separator['styles'] ?? 'width: 20%; border-top: 1px solid #bbb;' => ''
                    ) );
                    $featureStyle::addStyle( "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureDescription", array(
                        'color' => $descColor
                    ) );

                    // Classes
                    $iconClass = isset( $upIcon['id'] ) ? 'wp-image-'.$upIcon['id'] : '';
                    ?>

                    <div class='bBlocksFeature' id='bBlocksFeature-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $featureStyle::renderStyle(), array() ); ?></style>

                        <div class='featureIcon'>
                            <?php echo $isUpIcon ?
                            ( $upIcon['url'] ? "<img class='". esc_attr( $iconClass ) ."' src='". esc_url( $upIcon['url'] ) ."' alt='". esc_attr( $upIcon['alt'] ) ."' />" : '' ) :
                            ( $icon['class'] ? "<i class='". esc_attr( $icon['class'] ) ."'></i>" : '' ); ?>
                        </div>

                        <div class='featureDetails'>
                            <?php echo $isTitle && $title ? "<h4 class='featureTitle'>". wp_kses_post( $title ) ."</h4>" : ''; ?>

                            <?php echo $isSep ? "<span class='featureSeparator'></span>" : ''; ?>
                            
                            <?php echo $isDesc && $desc ? "<p class='featureDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                        </div>
                    </div>
                <?php $featureStyle::$styles = array(); } ?>
            </div>
        </div>

        <?php $featureBoxesStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksFeatureBoxes();