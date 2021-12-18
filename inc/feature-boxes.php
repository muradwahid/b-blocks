<?php
class BBlocksFeatureBoxes extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'feature-boxes', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $features = $features ?? [
            [
                'background' => [ 'color' => '#0000' ],
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 120 ],
                'upIcon' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'iconWidth' => '120px',
                'title' => 'Feature 1',
                'titleColor' => '#333',
                'separator' => [ 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ],
                'desc' => 'This content area describes feature 1 descriptions or details.',
                'descColor' => '#333'
            ],
            [
                'background' => [ 'color' => '#0000' ],
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 120 ],
                'upIcon' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'iconWidth' => '120px',
                'title' => 'Feature 2',
                'titleColor' => '#333',
                'separator' => [ 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ],
                'desc' => 'This content area describes feature 2 descriptions or details.',
                'descColor' => '#333'
            ],
            [
                'background' => [ 'color' => '#0000' ],
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 120 ],
                'upIcon' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'iconWidth' => '120px',
                'title' => 'Feature 3',
                'titleColor' => '#333',
                'separator' => [ 'width' => '20%', 'height' => '2px', 'style' => 'solid', 'color' => '#bbb' ],
                'desc' => 'This content area describes feature 3 descriptions or details.',
                'descColor' => '#333'
            ]
        ];
        $columns = $columns ?? [ 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ];
        $columnGap = $columnGap ?? '30px';
        $rowGap = $rowGap ?? '30px';
        $textAlign = $textAlign ?? 'center';
        $padding = $padding ?? [ 'vertical' => '50px', 'horizontal' => '20px' ];
        $isIcon = $isIcon ?? true;
        $iconMargin = $iconMargin ?? [ 'bottom' => '20px' ];
        $isTitle = $isTitle ?? true;
        $titleTypo = $titleTypo ?? [ 'fontSize' => 20, 'fontWeight' => 600 ];
        $titleMargin = $titleMargin ?? [ 'bottom' => '10px' ];
        $isSep = $isSep ?? true;
        $sepMargin = $sepMargin ?? [ 'bottom' => '10px' ];
        $isDesc = $isDesc ?? true;
        $descTypo = $descTypo ?? [ 'fontSize' => 15 ];

        // Generate Styles
        $featureBoxesStyle = new BBlocksStyleGenerator();
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes", [
            'grid-gap' => "$rowGap $columnGap"
        ] );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature", [
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ] );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureIcon", [
            'margin' => $iconMargin['styles'] ?? '0 0 10px 0'
        ] );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureTitle", [
            $titleTypo['styles'] ?? 'font-size: 20px; font-weight: 600;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ] );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureSeparator", [
            'margin' => $sepMargin['styles'] ?? '0 0 10px 0'
        ] );
        $featureBoxesStyle::addStyle( "#bBlocksFeatureBoxes-$cId .bBlocksFeatureBoxes .bBlocksFeature .featureDescription", [
            $descTypo['styles'] ?? 'font-size: 15px;' => ''
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-feature-boxes <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksFeatureBoxes-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $featureBoxesStyle::renderStyle(), [] );
                foreach ( $features as $index => $feature ) {
                    extract( $feature );
                    $backgroundStyle = $background['styles'] ?? 'background-color: #0000;';
                    $iconStyle = $icon['styles'] ?? 'font-size: 120px;';
                    $separatorStyle = $separator['styles'] ?? 'width: 20%; border-top: 1px solid #bbb;';

                    $featureStyles = "#bBlocksFeatureBoxes-$cId #bBlocksFeature-$index{ $backgroundStyle }
                    #bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon i{ $iconStyle }
                    #bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureIcon img{ width: $iconWidth; }
                    #bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureTitle{ color: $titleColor; }
                    #bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureSeparator{ $separatorStyle }
                    #bBlocksFeatureBoxes-$cId #bBlocksFeature-$index .featureDescription{ color: $descColor; }";
                    echo esc_html( $featureStyles );
                } ?>
            </style>

            <div class='bBlocksFeatureBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $features as $index => $feature ) {
                    extract( $feature );
                    // Classes
                    $iconClass = isset( $upIcon['id'] ) ? 'wp-image-'.$upIcon['id'] : ''; ?>

                    <div class='bBlocksFeature' id='bBlocksFeature-<?php echo esc_attr( $index ); ?>'>
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
                <?php } ?>
            </div>
        </div>

        <?php $featureBoxesStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksFeatureBoxes();