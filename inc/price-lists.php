<?php
class BBlocksPriceLists extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'price-lists', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $products = $products ?? [
            [
                'background' => [ 'color' => '#0000' ],
                'img' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'imgBorder' => [],
                'name' => 'Product 1 Name',
                'nameColor' => '#333',
                'desc' => 'This content area describes product 1 descriptions or details.',
                'descColor' => '#333',
                'price' => '$99.99',
                'priceColor' => '#4527a4',
                'separator' => [ 'width' => '40%', 'height' => '1px', 'color' => '#bbb' ]
            ],
            [
                'background' => [ 'color' => '#0000' ],
                'img' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'imgBorder' => [],
                'name' => 'Product 2 Name',
                'nameColor' => '#333',
                'desc' => 'This content area describes product 2 descriptions or details.',
                'descColor' => '#333',
                'price' => '$99.99',
                'priceColor' => '#4527a4',
                'separator' => [ 'width' => '40%', 'height' => '1px', 'color' => '#bbb' ]
            ],
            [
                'background' => [ 'color' => '#0000' ],
                'img' => [ 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ],
                'imgBorder' => [],
                'name' => 'Product 3 Name',
                'nameColor' => '#333',
                'desc' => 'This content area describes product 3 descriptions or details.',
                'descColor' => '#333',
                'price' => '$99.99',
                'priceColor' => '#4527a4',
                'separator' => [ 'width' => '40%', 'height' => '1px', 'color' => '#bbb' ]
            ]
        ];
        $columns = $columns ?? [ 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ];
        $columnGap = $columnGap ?? '40px';
        $rowGap = $rowGap ?? '30px';
        $layout = $layout ?? 'vertical';
        $textAlign = $textAlign ?? 'center';
        $padding = $padding ?? [ 'vertical' => '50px', 'horizontal' => '20px' ];
        $imgMargin = $imgMargin ?? [ 'bottom' => '20px' ];
        $nameTypo = $nameTypo ?? [ 'fontSize' => 18, 'fontWeight' => 600 ];
        $nameMargin = $nameMargin ?? [ 'bottom' => '10px' ];
        $isDesc = $isDesc ?? true;
        $descTypo = $descTypo ?? [ 'fontSize' => 15, 'fontStyle' => 'italic' ];
        $descMargin = $descMargin ?? [ 'bottom' => '15px' ];
        $priceTypo = $priceTypo ?? [ 'fontSize' => 24, 'fontStyle' => 'italic' ];
        $isSep = $isSep ?? true;

        // Generate Styles
        $priceListsStyle = new BBlocksStyleGenerator();
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists", [
            'grid-gap' => "$rowGap $columnGap"
        ] );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice", [
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ] );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productImage", [
            'margin' => $imgMargin['styles'] ?? '0 0 20px 0'
        ] );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productName", [
            $nameTypo['styles'] ?? 'font-size: 18px; font-weight: 600;' => '',
            'margin' => $nameMargin['styles'] ?? '0 0 10px 0'
        ] );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productDescription", [
            $descTypo['styles'] ?? 'font-size: 15px; font-style: italic;' => '',
            'margin' => $descMargin['styles'] ?? '0 0 15px 0'
        ] );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productPrice", [
            $priceTypo['styles'] ?? 'font-size: 24px; font-style: italic;' => ''
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-price-lists <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksPriceLists-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $nameTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $priceTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $priceListsStyle::renderStyle(), [] ); ?>
            </style>

            <div class='bBlocksPriceLists <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $products as $index => $product ) {
                    extract( $product );

                    $productStyle = new BBlocksStyleGenerator();
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index", [
                        $background['styles'] ?? 'background-color: #0000;' => ''
                    ] );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productImage", [
                        $imgBorder['styles'] ?? '' => ''
                    ] );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productName", [
                        'color' => $nameColor
                    ] );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productDescription", [
                        'color' => $descColor
                    ] );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productPrice", [
                        'color' => $priceColor
                    ] );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productSeparator", [
                        $separator['styles'] ?? 'width: 40%; border-top: 1px solid #bbb;' => ''
                    ] );

                    // Classes
                    $imgClass = isset( $img['id'] ) ? 'wp-image-'.$img['id'] : '';
                    ?>

                    <div class='bBlocksPrice' id='bBlocksPrice-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $productStyle::renderStyle(), [] ); ?></style>

                        <?php echo $img['url'] ? "<img class='productImage ". esc_attr( $imgClass ) ."' src='". esc_url( $img['url'] ) ."' alt='". esc_attr( $img['alt'] ) ."' />" : ''; ?>

                        <div class='productDetails'>
                            <h4 class='productName'><?php echo wp_kses_post( $name ); ?></h4>

                            <?php echo $isDesc ? "<p class='productDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                            
                            <span class='productPrice'><?php echo wp_kses_post( $price ); ?></span>
                        </div>

                        <?php echo $isSep ? "<span class='productSeparator'></span>" : ''; ?>
                    </div>
                <?php $productStyle::$styles = []; } ?>
            </div>
        </div>

        <?php $priceListsStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksPriceLists();