<?php
class BBlocksImageComparison extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'image-comparison', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $alignment = $alignment ?? 'center';
        $width = $width ?? '80%';
        $border = $border ?? array();
        $beforeImg = $beforeImg ?? array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' );
        $afterImg = $afterImg ?? array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' );
        $isSwap = $isSwap ?? false;
        $isLabel = $isLabel ?? true;
        $beforeLabel = $beforeLabel ?? '';
        $afterLabel = $afterLabel ?? '';
        $labelTypo = $labelTypo ?? array( 'fontSize' => 15 );
        $labelColors = $labelColors ?? array( 'color' => '#fff', 'bg' => '#00000080' );
        $labelPadding = $labelPadding ?? array( 'vertical' => '10px', 'horizontal' => '15px' );
        $isCap = $isCap ?? true;
        $cap = $cap ?? '';
        $capAlign = $capAlign ?? 'center';
        $capTypo = $capTypo ?? array( 'fontSize' => 14 );
        $capColors = $capColors ?? array( 'color' => '#333', 'bg' => '#f4f4f4' );
        $capPadding = $capPadding ?? array( 'vertical' => '10px', 'horizontal' => '15px' );

        // Generate Styles
        $imageComparisonStyle = new BBlocksStyleGenerator();
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId", array(
            'text-align' => $alignment
        ) );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison", array(
            'width' => $width,
            $border['styles'] ?? '' => ''
        ) );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison .overlay", array(
            $labelTypo['styles'] ?? 'font-size: 15px;' => '',
            $labelColors['styles'] ?? 'color: #fff; background: #00000080;' => '',
            'padding' => $labelPadding['styles'] ?? '10px 15px'
        ) );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison .caption", array(
            $capTypo['styles'] ?? 'font-size: 14px;' => '',
            $capColors['styles'] ?? 'color: #333; background: #f4f4f4;' => '',
            'padding' => $capPadding['styles'] ?? '10px 15px'
        ) );
    
        ob_start(); ?>
        <div class='wp-block-b-blocks-image-comparison <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksImageComparison-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $labelTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $capTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $imageComparisonStyle::renderStyle(), array() ); ?>
            </style>
    
            <div class='bBlocksImageComparison'>
                <div class='comparison-slider'>
                    <?php echo $isLabel && $afterLabel ? "<div class='overlay afterLabel'>". wp_kses_post( $afterLabel ) ."</div>" : ''; ?>

                    <?php echo $afterImg['url'] ? "<img class='afterImg' src='". esc_url( $afterImg['url'] ) ."' alt='". esc_attr( $afterImg['alt'] ) ."' />" : ''; ?>
     
                    <div class='resize'>
                        <?php echo $isLabel && $afterLabel ? "<div class='overlay beforeLabel'>". wp_kses_post( $beforeLabel ) ."</div>" : ''; ?>

                        <?php echo $beforeImg['url'] ? "<img class='beforeImg' src='". esc_url( $beforeImg['url'] ) ."' alt='". esc_attr( $beforeImg['alt'] ) ."' />" : ''; ?>
                    </div>
    
                    <div class='divider'></div>
                </div>
    
                <?php echo $isCap && $cap ? "<div class='caption'>". wp_kses_post( $cap ) ."</div>" : ''; ?>
            </div>
        </div>
    
        <?php $imageComparisonStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksImageComparison();