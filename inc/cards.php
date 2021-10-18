<?php
class BBlocksCards extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'cards', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $cards = $cards ?? array(
            array(
                'background' => array( 'color' => '#0000' ),
                'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'imgBorder' => array( 'radius' => '5px' ),
                'cat' => 'Category 1',
                'catColor' => '#0dcaf0',
                'title' => 'Card Title 1',
                'titleColor' => '#ff7500',
                'desc' => 'This content area describes card 1 descriptions or details.',
                'descColor' => '#333'
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'imgBorder' => array( 'radius' => '5px' ),
                'cat' => 'Category 2',
                'catColor' => '#0dcaf0',
                'title' => 'Card Title 2',
                'titleColor' => '#ff7500',
                'desc' => 'This content area describes card 2 descriptions or details.',
                'descColor' => '#333'
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'imgBorder' => array( 'radius' => '5px' ),
                'cat' => 'Category 3',
                'catColor' => '#0dcaf0',
                'title' => 'Card Title 3',
                'titleColor' => '#ff7500',
                'desc' => 'This content area describes card 3 descriptions or details.',
                'descColor' => '#333'
            )
        );
        $columns = $columns ?? array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 );
        $columnGap = $columnGap ?? '20px';
        $rowGap = $rowGap ?? '30px';
        $layout = $layout ?? 'vertical';
        $textAlign = $textAlign ?? 'left';
        $padding = $padding ?? array( 'vertical' => '20px', 'horizontal' => '10px' );
        $imgPos = $imgPos ?? 'top';
        $imgHeight = $imgHeight ?? '250px';
        $isCat = $isCat ?? true;
        $catTypo = $catTypo ?? array( 'fontSize' => 15 );
        $catMargin = $catMargin ?? array( 'bottom' => '10px' );
        $isTitle = $isTitle ?? true;
        $titlePos = $titlePos ?? 'image';
        $titleTypo = $titleTypo ?? array( 'fontSize' => 22 );
        $titleMargin = $titleMargin ?? array( 'bottom' => '10px' );
        $isDesc = $isDesc ?? true;
        $descTypo = $descTypo ?? array( 'fontSize' => 15 );

        // Generate Styles
        $cardsStyle = new BBlocksStyleGenerator();
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards", array(
            'grid-gap' => "$rowGap $columnGap"
        ) );
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardImage img", array(
            'height' => $imgHeight
        ) );
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails", array(
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '20px 10px'
        ) );
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDetails .cardCategory", array(
            $catTypo['styles'] ?? 'font-size: 15px;' => '',
            'margin' => $catMargin['styles'] ?? '0 0 10px 0'
        ) );
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardTitle", array(
            $titleTypo['styles'] ?? 'font-size: 22px;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ) );
        $cardsStyle::addStyle( "#bBlocksCards-$cId .bBlocksCards .bBlocksCard .cardDescription", array(
            $catTypo['styles'] ?? 'font-size: 15px;' => ''
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-cards <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksCards-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $catTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $cardsStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksCards <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $cards as $index => $card ) {
                    extract( $card );

                    $cardStyle = new BBlocksStyleGenerator();
                    $cardStyle::addStyle( "#bBlocksCards-$cId #bBlocksCard-$index .bBlocksCard", array(
                        $background['styles'] ?? 'background-color: #0000;' => ''
                    ) );
                    $cardStyle::addStyle( "#bBlocksCards-$cId #bBlocksCard-$index .cardImage", array(
                        $imgBorder['styles'] ?? 'border-radius: 5px;' => ''
                    ) );
                    $cardStyle::addStyle( "#bBlocksCards-$cId #bBlocksCard-$index .cardDetails .cardCategory", array(
                        'color' => $catColor
                    ) );
                    $cardStyle::addStyle( "#bBlocksCards-$cId #bBlocksCard-$index .cardTitle", array(
                        'color' => $titleColor
                    ) );
                    $cardStyle::addStyle( "#bBlocksCards-$cId #bBlocksCard-$index .cardDescription", array(
                        'color' => $descColor
                    ) );

                    // Classes
                    $imgClass = isset( $img['id'] ) ? 'wp-image-'.$img['id'] : '';

                    // Components
                    $cardTitle = $isTitle && $title ? "<h3 class='cardTitle'>$title</h3>" : '';
                    $cardTitleInImage = 'image' === $titlePos ? $cardTitle : '';
                    $cardTitleInContent = 'content' === $titlePos ? $cardTitle : '';

                    $cardImage = $img['url'] ? "<figure class='cardImage'>
                        <img class='$imgClass' src='". $img['url'] ."' alt='". $img['alt'] ."' /> $cardTitleInImage
                    </figure>" : '';

                    $cardImageInTop =  'top' === $imgPos ? $cardImage : '';
                    $cardImageInBottom =  'bottom' === $imgPos ? $cardImage : '';
                    ?>

                    <div id='bBlocksCard-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $cardStyle::renderStyle(), array() ); ?></style>

                        <div class='bBlocksCard <?php echo 'bottom' === $imgPos ? 'bottomImg' : 'topImg'; ?>'>
                            <?php echo wp_kses( $cardImageInTop, array(
                                'figure' => array( 'class' => array() ),
                                'img' => array( 'class' => array(), 'src' => array(), 'alt' => array() ),
                                'h3' => array( 'class' => array() )
                            ) ); ?>

                            <div class='cardDetails'>
                                <?php echo $isCat && $cat ? "<h6 class='cardCategory'>". wp_kses_post( $cat ) ."</h6>" : ''; ?>

                                <?php echo wp_kses( $cardTitleInContent, array(
                                    'h3' => array( 'class' => array() )
                                ) ); ?>

                                <?php echo $isDesc && $desc ? "<p class='cardDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                            </div>

                            <?php echo wp_kses( $cardImageInBottom, array(
                                'figure' => array( 'class' => array() ),
                                'img' => array( 'class' => array(), 'src' => array(), 'alt' => array() ),
                                'h3' => array( 'class' => array() )
                            ) ); ?>
                        </div>
                    </div>
                <?php $cardStyle::$styles = array(); } ?>
            </div>
        </div>

        <?php $cardsStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksCards();