<?php
class BBlocksPricingTable extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }
    
    function register(){
        register_block_type( __DIR__, [
            'render_callback' => [$this, 'render']
        ] ); // Register Block
    }

    function render( $attributes ){
        extract( $attributes );
        $className = $className ?? 'is-style-basic';

        $isBasic = false !== strpos($className, 'basic');
        $isStandard = false !== strpos($className, 'standard');
        $isUltimate = false !== strpos($className, 'ultimate');

        // Generate Styles
        $pricingTableStyle = new BBlocksStyleGenerator();
        $pricingTableStyle::addStyle( "#bBlocksPricingTables-$cId .bBlocksPricingTables", [
            'grid-gap' => "$rowGap $columnGap",
            'text-align' => $textAlign,
            'padding' => $isStandard ? '30px 0': '0'
        ] );
        $pricingTableStyle::addStyle( "#bBlocksPricingTables-$cId .bBlocksPricingTables .bBlocksPriceTable", [
            'padding' => $padding['styles'] ?? '35px 25px',
            'box-shadow' => $shadow['styles'] ?? '0px 0px 30px 0px #6e8faf4d'
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-pricing-table <?php echo esc_attr( $className ) . ' align' . esc_attr( $align ); ?>' id='bBlocksPricingTables-<?php echo esc_attr( $cId ) ?>'>
            <style>
                <?php echo wp_kses( $pricingTableStyle::renderStyle(), [] ) ?>

                <?php foreach ( $pricingTables as $index => $priceTable ) {
                    extract( $priceTable );
                    $defPricingTableSelect = "#bBlocksPricingTables-$cId .bBlocksPricingTables #bBlocksPriceTable-$index .bBlocksPriceTable";
                    $basicPricingTableSelect = "#bBlocksPricingTables-$cId.is-style-basic .bBlocksPricingTables #bBlocksPriceTable-$index .bBlocksPriceTable";
                    $standardPricingTableSelect = "#bBlocksPricingTables-$cId.is-style-standard .bBlocksPricingTables #bBlocksPriceTable-$index .bBlocksPriceTable";
                    $ultimatePricingTableSelect = "#bBlocksPricingTables-$cId.is-style-ultimate .bBlocksPricingTables #bBlocksPriceTable-$index .bBlocksPriceTable";

                    $priceTableStyles = "$defPricingTableSelect .priceName,
                    $basicPricingTableSelect .priceAmountWrap,
                    $standardPricingTableSelect .priceAmountWrap{ color: $color }
                    $defPricingTableSelect .priceLink,
                    $basicPricingTableSelect .priceName,
                    $standardPricingTableSelect::before,
                    $ultimatePricingTableSelect .priceAmountWrap{ color: #fff; background-color: $color }
                    $basicPricingTableSelect .priceName::before{ border-top-color: $color }";
                    echo wp_kses( $priceTableStyles, [] );
                } ?>
            </style>

            <div class='bBlocksPricingTables columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $pricingTables as $index => $priceTable ) {
                    extract( $priceTable );
                    // Components
                    $priceAmountEl = "<span class='priceAmount'>$priceCurrency$price</span>";
                    $priceAmountWrapEl = $isStandard || $isUltimate ? "<div class='priceAmountWrap'>$priceAmountEl / <span class='pricePeriod'>$period</span></div>" : ''; ?>

                    <div id='bBlocksPriceTable-<?php echo esc_attr( $index ); ?>'>
                        <div class='bBlocksPriceTable'>
                            <h3 class='priceName'><?php echo wp_kses_post( $name ); ?></h3>

                            <?php echo wp_kses_post( $priceAmountWrapEl ); ?>

                            <div class='priceFeatures'>
                                <?php foreach ( $features as $featureIndex => $feature ){
                                    extract( $feature );
                                    $isEnableEl = $isEnable ? "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='priceFeatureEnabled'><path fill='#01944e' d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'/></svg>" : "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512' class='priceFeatureDisabled'><path fill='#f00025' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'/></svg>"; ?>

                                    <div class='priceFeature'>
                                        <?php echo wp_kses( $isEnableEl,[
                                            'svg'   => [ 'xmlns' => true, 'width' => true, 'height' => true, 'viewbox' => true, 'class' => true ],
                                            'path'  => [ 'd' => true, 'fill' => true ]
                                        ] ); ?>
                                        <span class='priceFeatureLabel'><?php echo wp_kses_post( $label ); ?></span>
                                    </div>
                                <?php } ?>
                            </div>

                            <?php echo $isBasic ? "<div class='priceAmountWrap'>". wp_kses_post( $priceAmountEl ) ."</div>" : ''; ?>
                            <?php echo !$isBasic ? "<br />" : ''; ?>

                            <a href='<?php echo esc_url( $link )?>' class='priceLink'><?php echo wp_kses_post( $linkLabel )?></a>
                        </div>
                    </div> <!-- Price Table -->
                <?php } ?>
            </div> <!-- Pricing Tables -->
        </div>

        <?php $pricingTableStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksPricingTable();