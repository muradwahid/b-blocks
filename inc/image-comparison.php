<?php
class BBlocksImageComparison extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'image-comparison', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $alignment = $alignment ?? 'center';
        $width = $width ?? '80%';
        $border = $border ?? [];
        $beforeImg = $beforeImg ?? [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ];
        $afterImg = $afterImg ?? [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ];
        $isSwap = $isSwap ?? false;
        $isLabel = $isLabel ?? true;
        $beforeLabel = $beforeLabel ?? '';
        $afterLabel = $afterLabel ?? '';
        $labelTypo = $labelTypo ?? [ 'fontSize' => 15 ];
        $labelColors = $labelColors ?? [ 'color' => '#fff', 'bg' => '#00000080' ];
        $labelPadding = $labelPadding ?? [ 'vertical' => '10px', 'horizontal' => '15px' ];
        $isCap = $isCap ?? true;
        $cap = $cap ?? '';
        $capAlign = $capAlign ?? 'center';
        $capTypo = $capTypo ?? [ 'fontSize' => 14 ];
        $capColors = $capColors ?? [ 'color' => '#333', 'bg' => '#f4f4f4' ];
        $capPadding = $capPadding ?? [ 'vertical' => '10px', 'horizontal' => '15px' ];

        // Generate Styles
        $imageComparisonStyle = new BBlocksStyleGenerator();
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId", [
            'text-align' => $alignment
        ] );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison", [
            'width' => $width,
            $border['styles'] ?? '' => ''
        ] );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison .overlay", [
            $labelTypo['styles'] ?? 'font-size: 15px;' => '',
            $labelColors['styles'] ?? 'color: #fff; background: #00000080;' => '',
            'padding' => $labelPadding['styles'] ?? '10px 15px'
        ] );
        $imageComparisonStyle::addStyle( "#bBlocksImageComparison-$cId .bBlocksImageComparison .caption", [
            $capTypo['styles'] ?? 'font-size: 14px;' => '',
            $capColors['styles'] ?? 'color: #333; background: #f4f4f4;' => '',
            'padding' => $capPadding['styles'] ?? '10px 15px'
        ] );
    
        ob_start(); ?>
        <div class='wp-block-b-blocks-image-comparison <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksImageComparison-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $labelTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $capTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $imageComparisonStyle::renderStyle(), [] ); ?>
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
    
        <?php $imageComparisonStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksImageComparison();