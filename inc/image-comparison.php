<?php
class BBlocksImageComparison extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'image-comparison', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),
            'alignment' => array( 'type' => 'string', 'default' => 'center' ),
    
            'width' => array( 'type' => 'string', 'default' => '80%' ),
            'border' => array( 'type' => 'object', 'default' => array() ),
    
            'beforeImg' => array( 'type' => 'object', 'default' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ) ),
            'afterImg' => array( 'type' => 'object', 'default' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ) ),
            
            'isSwap' => array( 'type' => 'boolean', 'default' => false ),
            
            'isLabel' => array( 'type' => 'boolean', 'default' => true ),
            'beforeLabel' => array( 'type' => 'string', 'selector' => '.beforeLabel', 'default' => '' ),
            'afterLabel' => array( 'type' => 'string', 'selector' => '.afterLabel', 'default' => '' ),
            'labelTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'labelColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#00000080' ) ),
            'labelPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '10px', 'horizontal' => '15px' ) ),
    
            'isCap' => array( 'type' => 'boolean', 'default' => true ),
            'cap' => array( 'type' => 'string', 'selector' => '.caption', 'default' => '' ),
            'capAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'capTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 14 ) ),
            'capColors' => array( 'type' => 'object', 'default' => array( 'color' => '#333', 'bg' => '#f4f4f4' ) ),
            'capPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '10px', 'horizontal' => '15px' ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

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
                    <?php echo $isLabel && $afterLabel ? "<div class='overlay afterLabel'>". esc_html( $afterLabel ) ."</div>" : ''; ?>

                    <?php echo $afterImg['url'] ? "<img class='afterImg' src='". esc_url( $afterImg['url'] ) ."' alt='". esc_attr( $afterImg['alt'] ) ."' />" : ''; ?>
     
                    <div class='resize'>
                        <?php echo $isLabel && $afterLabel ? "<div class='overlay beforeLabel'>". esc_html( $beforeLabel ) ."</div>" : ''; ?>

                        <?php echo $beforeImg['url'] ? "<img class='beforeImg' src='". esc_url( $beforeImg['url'] ) ."' alt='". esc_attr( $beforeImg['alt'] ) ."' />" : ''; ?>
                    </div>
    
                    <div class='divider'></div>
                </div>
    
                <?php echo $isCap && $cap ? "<div class='caption'>". esc_html( $cap ) ."</div>" : ''; ?>
            </div>
        </div>
    
        <?php $imageComparisonStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksImageComparison();