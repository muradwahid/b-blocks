<?php
class BBlocksFlipBoxes extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'flip-boxes', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $boxes = $boxes ?? [
            [
                'frontBG' => [],
                'backBG' => [],
                'border' => [],
                'shadow' => [],
                'frontIcon' => [ 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ],
                'backIcon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ],
                'frontTitle' => 'Front Title 1',
                'frontTitleColor' => '#fff',
                'backTitle' => 'Back Title 1',
                'backTitleColor' => '#fff',
                'desc' => 'This content area describes flip box 1 descriptions/details.',
                'descColor' => '#fff',
                'btn' => 'Button 1',
                'btnLink' => '#',
                'btnBorder' => [ 'radius' => '3px' ],
                'btnColors' => [ 'color' => '#fff', 'bg' => '#ff4500' ],
                'btnHovColors' => [ 'color' => '#fff', 'bg' => '#ff7500' ]
            ],
            [
                'frontBG' => [],
                'backBG' => [],
                'border' => [],
                'shadow' => [],
                'frontIcon' => [ 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ],
                'backIcon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ],
                'frontTitle' => 'Front Title 2',
                'frontTitleColor' => '#fff',
                'backTitle' => 'Back Title 2',
                'backTitleColor' => '#fff',
                'desc' => 'This content area describes flip box 2 descriptions/details.',
                'descColor' => '#fff',
                'btn' => 'Button 2',
                'btnLink' => '#',
                'btnBorder' => [ 'radius' => '3px' ],
                'btnColors' => [ 'color' => '#fff', 'bg' => '#ff4500' ],
                'btnHovColors' => [ 'color' => '#fff', 'bg' => '#ff7500' ]
            ],
            [
                'frontBG' => [],
                'backBG' => [],
                'border' => [],
                'shadow' => [],
                'frontIcon' => [ 'class' => 'fa fa-sync-alt', 'fontSize' => 70, 'color' => '#fff' ],
                'backIcon' => [ 'class' => 'fa fa-wordpress', 'fontSize' => 70, 'color' => '#fff' ],
                'frontTitle' => 'Front Title 3',
                'frontTitleColor' => '#fff',
                'backTitle' => 'Back Title 3',
                'backTitleColor' => '#fff',
                'desc' => 'This content area describes flip box 3 descriptions/details.',
                'descColor' => '#fff',
                'btn' => 'Button 3',
                'btnLink' => '#',
                'btnBorder' => [ 'radius' => '3px' ],
                'btnColors' => [ 'color' => '#fff', 'bg' => '#ff4500' ],
                'btnHovColors' => [ 'color' => '#fff', 'bg' => '#ff7500' ]
            ]
        ];
        $columns = $columns ?? [ 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ];
        $columnGap = $columnGap ?? '40px';
        $rowGap = $rowGap ?? '30px';
        $boxHeight = $boxHeight ?? '400px';
        $textAlign = $textAlign ?? 'center';
        $boxPadding = $boxPadding ?? [ 'vertical' => '30px', 'horizontal' => '25px' ];
        $isIcon = $isIcon ?? true;
        $iconMargin = $iconMargin ?? [ 'bottom' => '20px' ];
        $titleTypo = $titleTypo ?? [ 'fontSize' => 25 ];
        $titleMargin = $titleMargin ?? [ 'bottom' => '20px' ];
        $isDesc = $isDesc ?? true;
        $descTypo = $descTypo ?? [ 'fontSize' => 16 ];
        $isBtn = $isBtn ?? true;
        $btnTypo = $btnTypo ?? [ 'fontSize' => 16 ];
        $btnPadding = $btnPadding ?? [ 'vertical' => '15px', 'horizontal' => '25px' ];

        // Generate Styles
        $flipBoxesStyle = new BBlocksStyleGenerator();
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBoxes", [
            'grid-gap' => "$rowGap $columnGap"
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox", [
            'height' => $boxHeight
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .box", [
            'text-align' => $textAlign,
            'padding' => $boxPadding['styles'] ?? '30px 25px'
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipIcon", [
            'margin' => $iconMargin['styles'] ?? '0 0 20px 0'
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipTitle", [
            $titleTypo['styles'] ?? 'font-size: 25px;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 20px 0'
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipDescription", [
            $descTypo['styles'] ?? 'font-size: 16px;' => ''
        ] );
        $flipBoxesStyle::addStyle( "#bBlocksFlipBoxes-$cId .bBlocksFlipBox .flipBtn", [
            $btnTypo['styles'] ?? 'font-size: 16px;' => '',
            'padding' => $btnPadding['styles'] ?? '15px 25px'
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-flip-boxes <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksFlipBoxes-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $btnTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $flipBoxesStyle::renderStyle(), [] ); ?>
            </style>

            <div class='bBlocksFlipBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $boxes as $index => $box ) {
                    extract( $box );

                    $flipBoxStyle = new BBlocksStyleGenerator();
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box", [
                        $border['styles'] ?? '' => '',
                        'box-shadow' => $shadow['styles'] ?? 'none'
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.front", [
                        $frontBG['styles'] ?? 'background-color: #000000b3;' => ''
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.back", [
                        $backBG['styles'] ?? 'background-color: #000000b3;' => ''
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.frontIcon", [
                        $frontIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.backIcon", [
                        $backIcon['styles'] ?? 'font-size: 70px; color: #fff;' => ''
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipTitle.flipFrontTitle", [
                        'color' => $frontTitleColor
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipTitle.flipBackTitle", [
                        'color' => $backTitleColor
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipDescription", [
                        'color' => $descColor
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn", [
                        $btnColors['styles'] ?? 'color: #fff; background: #ff4500;' => '',
                        $btnBorder['styles'] ?? 'border-radius: 3px;' => ''
                    ] );
                    $flipBoxStyle::addStyle( "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn:hover", [
                        $btnHovColors['styles'] ?? 'color: #fff; background: #ff7500;' => ''
                    ] ); ?>

                    <div class='bBlocksFlipBox' id='bBlocksFlipBox-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $flipBoxStyle::renderStyle(), [] ); ?></style>

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
                <?php $flipBoxStyle::$styles = []; } ?>
            </div>
        </div>

        <?php $flipBoxesStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksFlipBoxes();