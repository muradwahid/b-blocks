<?php
class BBlocksPriceLists extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'price-lists', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string', 'default' => '' ),

            'products' => array( 'type' => 'array', 'default' => array(
                array(
                    'background' => array( 'color' => '#0000' ),
                    'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                    'imgBorder' => array(),
                    'name' => 'Product 1 Name',
                    'nameColor' => '#333',
                    'desc' => 'This content area describes product 1 descriptions or details.',
                    'descColor' => '#333',
                    'price' => '$99.99',
                    'priceColor' => '#4527a4',
                    'separator' => array( 'width' => '40%', 'height' => '1px', 'color' => '#bbb' )
                ),
                array(
                    'background' => array( 'color' => '#0000' ),
                    'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                    'imgBorder' => array(),
                    'name' => 'Product 2 Name',
                    'nameColor' => '#333',
                    'desc' => 'This content area describes product 2 descriptions or details.',
                    'descColor' => '#333',
                    'price' => '$99.99',
                    'priceColor' => '#4527a4',
                    'separator' => array( 'width' => '40%', 'height' => '1px', 'color' => '#bbb' )
                ),
                array(
                    'background' => array( 'color' => '#0000' ),
                    'img' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                    'imgBorder' => array(),
                    'name' => 'Product 3 Name',
                    'nameColor' => '#333',
                    'desc' => 'This content area describes product 3 descriptions or details.',
                    'descColor' => '#333',
                    'price' => '$99.99',
                    'priceColor' => '#4527a4',
                    'separator' => array( 'width' => '40%', 'height' => '1px', 'color' => '#bbb' )
                )
            ) ),

            'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 ) ),

            'columnGap' => array( 'type' => 'string', 'default' => '40px' ),
            'rowGap' => array( 'type' => 'string', 'default' => '30px' ),

            'layout' => array( 'type' => 'string', 'default' => 'vertical' ),

            'textAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'padding' => array( 'type' => 'object', 'default' => array( 'vertical' => '50px', 'horizontal' => '20px' ) ),

            'imgMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '20px' ) ),

            'nameTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 18, 'fontWeight' => 600 ) ),
            'nameMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '10px' ) ),

            'isDesc' => array( 'type' => 'boolean', 'default' => true ),
            'descTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15, 'fontStyle' => 'italic' ) ),
            'descMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),
            
            'priceTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 24, 'fontStyle' => 'italic' ) ),

            'isSep' => array( 'type' => 'boolean', 'default' => true )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $priceListsStyle = new BBlocksStyleGenerator();
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists", array(
            'grid-gap' => "$rowGap $columnGap"
        ) );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice", array(
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ) );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productImage", array(
            'margin' => $imgMargin['styles'] ?? '0 0 20px 0'
        ) );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productName", array(
            $nameTypo['styles'] ?? 'font-size: 18px; font-weight: 600;' => '',
            'margin' => $nameMargin['styles'] ?? '0 0 10px 0'
        ) );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productDescription", array(
            $descTypo['styles'] ?? 'font-size: 15px; font-style: italic;' => '',
            'margin' => $descMargin['styles'] ?? '0 0 15px 0'
        ) );
        $priceListsStyle::addStyle( "#bBlocksPriceLists-$cId .bBlocksPriceLists .bBlocksPrice .productPrice", array(
            $priceTypo['styles'] ?? 'font-size: 24px; font-style: italic;' => ''
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-price-lists <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksPriceLists-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $nameTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $priceTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $priceListsStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksPriceLists <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $products as $index => $product ) {
                    extract( $product );

                    $productStyle = new BBlocksStyleGenerator();
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index", array(
                        $background['styles'] ?? 'background-color: #0000;' => ''
                    ) );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productImage", array(
                        $imgBorder['styles'] ?? '' => ''
                    ) );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productName", array(
                        'color' => $nameColor
                    ) );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productDescription", array(
                        'color' => $descColor
                    ) );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productPrice", array(
                        'color' => $priceColor
                    ) );
                    $productStyle::addStyle( "#bBlocksPriceLists-$cId #bBlocksPrice-$index .productSeparator", array(
                        $separator['styles'] ?? 'width: 40%; border-top: 1px solid #bbb;' => ''
                    ) );

                    // Classes
                    $imgClass = isset( $img['id'] ) ? 'wp-image-'.$img['id'] : '';
                    ?>

                    <div class='bBlocksPrice' id='bBlocksPrice-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $productStyle::renderStyle(), array() ); ?></style>

                        <?php echo $img['url'] ? "<img class='productImage ". esc_attr($imgClass) ."' src='". esc_url($img['url']) ."' alt='". esc_attr($img['alt']) ."' />" : ''; ?>

                        <div class='productDetails'>
                            <h4 class='productName'><?php echo wp_kses_post( $name ); ?></h4>

                            <?php echo $isDesc ? "<p class='productDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
                            
                            <span class='productPrice'><?php echo wp_kses_post( $price ); ?></span>
                        </div>

                        <?php echo $isSep ? "<span class='productSeparator'></span>" : ''; ?>
                    </div>
                <?php $productStyle::$styles = array(); } ?>
            </div>
        </div>

        <?php $priceListsStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksPriceLists();