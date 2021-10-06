<?php
class BBlocksFlipBoxes extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'flip-boxes', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string', 'default' => '' ),

            'boxes' => array( 'type' => 'array', 'default' => array(
                array(
                    'frontBG' => array(),
                    'backBG' => array(),
                    'border' => array(),
                    'shadow' => array(),

                    'frontIcon' => array( 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ),
                    'backIcon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ),

                    'frontTitle' => 'Front Title 1',
                    'backTitle' => 'Back Title 1',
                    'titleColor' => '#fff',

                    'desc' => 'This content area describes flip box 1 descriptions/details.',
                    'descColor' => '#fff',

                    'btn' => 'Button 1',
                    'btnLink' => '#',
                    'btnBorder' => array( 'radius' => '3px' ),
                    'btnColors' => array( 'color' => '#fff', 'bg' => '#ff4500' ),
                    'btnHovColors' => array( 'color' => '#fff', 'bg' => '#ff7500' )
                ),
                array(
                    'frontBG' => array(),
                    'backBG' => array(),
                    'border' => array(),
                    'shadow' => array(),

                    'frontIcon' => array( 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ),
                    'backIcon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ),

                    'frontTitle' => 'Front Title 2',
                    'backTitle' => 'Back Title 2',
                    'titleColor' => '#fff',

                    'desc' => 'This content area describes flip box 2 descriptions/details.',
                    'descColor' => '#fff',

                    'btn' => 'Button 2',
                    'btnLink' => '#',
                    'btnBorder' => array( 'radius' => '3px' ),
                    'btnColors' => array( 'color' => '#fff', 'bg' => '#ff4500' ),
                    'btnHovColors' => array( 'color' => '#fff', 'bg' => '#ff7500' )
                ),
                array(
                    'frontBG' => array(),
                    'backBG' => array(),
                    'border' => array(),
                    'shadow' => array(),

                    'frontIcon' => array( 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ),
                    'backIcon' => array( 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ),

                    'frontTitle' => 'Front Title 3',
                    'backTitle' => 'Back Title 3',
                    'titleColor' => '#fff',

                    'desc' => 'This content area describes flip box 3 descriptions/details.',
                    'descColor' => '#fff',

                    'btn' => 'Button 3',
                    'btnLink' => '#',
                    'btnBorder' => array( 'radius' => '3px' ),
                    'btnColors' => array( 'color' => '#fff', 'bg' => '#ff4500' ),
                    'btnHovColors' => array( 'color' => '#fff', 'bg' => '#ff7500' )
                ),
            ) ),

            'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ) ),

            'columnGap' => array( 'type' => 'string', 'default' => '40px' ),
            'rowGap' => array( 'type' => 'string', 'default' => '30px' ),

            'boxHeight' => array( 'type' => 'string', 'default' => '400px' ),
            'textAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'boxPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '30px', 'horizontal' => '25px' ) ),

            'isIcon' => array( 'type' => 'boolean', 'default' => true ),
            'iconMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '20px' ) ),
            'titleTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 25 ) ),
            'titleMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '20px' ) ),
            'isDesc' => array( 'type' => 'boolean', 'default' => true ),
            'descTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 16 ) ),
            'isBtn' => array( 'type' => 'boolean', 'default' => true ),
            'btnTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 16 ) ),
            'btnPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '15px', 'horizontal' => '25px' ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $flipBoxesStyle = new BBlocksStyleGenerator();
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBoxes", array(
            'grid-gap' => "$rowGap $columnGap"
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox", array(
            'height' => $boxHeight
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .box", array(
            'text-align' => $textAlign,
            'padding' => $boxPadding['styles'] ?? '30px 25px'
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipIcon", array(
            'margin' => $iconMargin['styles'] ?? '0 0 20px 0'
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipTitle", array(
            $titleTypo['styles'] ?? 'font-size: 25px;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 20px 0'
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipDescription", array(
            $descTypo['styles'] ?? 'font-size: 16px;' => ''
        ) );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipBtn", array(
            $btnTypo['styles'] ?? 'font-size: 16px;' => '',
            'padding' => $btnPadding['styles'] ?? '15px 25px'
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-flip-boxes <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksFlipBoxes-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $flipBoxesStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksFlipBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $boxes as $index => $box ) {
                    extract( $box );

                    $flipBoxStyle = new BBlocksStyleGenerator();
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box", array(
                        $border['styles'] ?? '' => '',
                        'box-shadow' => $shadow['styles'] ?? 'none'
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.front", array(
                        $frontBG['styles'] ?? 'background-color: #000000b3;' => ''
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.back", array(
                        $backBG['styles'] ?? 'background-color: #000000b3;' => ''
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.frontIcon", array(
                        $frontIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.backIcon", array(
                        $backIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipTitle", array(
                        'color' => $titleColor
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipDescription", array(
                        'color' => $descColor
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn", array(
                        $btnColors['styles'] ?? 'color: #fff; background: #ff4500;' => '',
                        $btnBorder['styles'] ?? 'border-radius: 3px;' => ''
                    ) );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn:hover", array(
                        $btnHovColors['styles'] ?? 'color: #fff; background: #ff7500;' => ''
                    ) ); ?>

                    <div class='bBlocksFlipBox' id='bBlocksFlipBox-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $flipBoxStyle::renderStyle(), array() ); ?></style>

                        <div class='box front'>
                            <div class='frontContent'>
                                <?php echo $isIcon && $frontIcon['class'] ? "<i class='flipIcon frontIcon ". esc_html( $frontIcon['class'] ) ."'></i>" : ''; ?>

                                <?php echo $frontTitle ? "<h3 class='flipTitle flipFrontTitle'>". wp_kses_post( $frontTitle ) ."</h3>" : ''; ?>

                                <?php echo $isDesc && $desc ? "<p class='flipDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                            </div>
                        </div>

                        <div class='box back'>
                            <div class='backContent'>
                                <?php echo $isIcon && $backIcon['class'] ? "<i class='flipIcon backIcon ". esc_html( $backIcon['class'] ) ."'></i>" : ''; ?>

                                <?php echo $backTitle ? "<h3 class='flipTitle flipBackTitle'>". wp_kses_post( $backTitle ) ."</h3>" : ''; ?>

                                <?php echo $isBtn && $btn ? "<a href='". esc_attr( $btnLink ) ."' class='flipBtn' target='_blank' rel='noreferrer noopener'>". wp_kses_post( $btn ) ."</a>" : ''; ?>
                            </div>
                        </div>
                    </div>
                <?php $flipBoxStyle::$styles = array(); } ?>
            </div>
        </div>

        <?php $flipBoxesStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksFlipBoxes();