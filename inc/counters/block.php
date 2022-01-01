<?php
class BBlocksCounters extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'onInit'] );
    }

    function onInit(){
        register_block_type( __DIR__, [
            'render_callback' => [$this, 'render']
        ] ); // Register Block
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $countersStyle = new BBlocksStyleGenerator();
        $countersStyle::addStyle( "#bBlocksCounters-$cId .bBlocksCounters", [
            'grid-gap' => "$rowGap $columnGap",
            $background['styles'] ?? 'background-color: #0000;' => '',
            'padding' => $padding['styles'] ?? '20px 0px'
        ] );
        $countersStyle::addStyle( "#bBlocksCounters-$cId .bBlocksCounters .bBlocksCounter", [
            'text-align' => $textAlign,
            'width' => '0px' === $counterWidth || '0%' === $counterWidth || '0em' === $counterWidth ? '250px' : $counterWidth,
            'height' => '0px' === $counterHeight || '0%' === $counterHeight || '0em' === $counterHeight ? '250px' : $counterHeight,
            'padding' => $counterPadding['styles'] ?? '20px 20px',
            $counterBorder['styles'] ?? 'border-radius: 50%;' => '',
            'box-shadow' => $counterShadow['styles'] ?? 'none'
        ] );
        $countersStyle::addStyle( "#bBlocksCounters-$cId .bBlocksCounters .bBlocksCounter .counterIcon i, #bBlocksCounters-$cId .bBlocksCounters .bBlocksCounter .counterIconLabel i", [
            'font-size' => $iconSize ? $iconSize."px" : '50px'
        ] );
        $countersStyle::addStyle( "#bBlocksCounters-$cId .bBlocksCounters .bBlocksCounter .counterNumber", [
            $numberTypo['styles'] ?? 'font-size: 48px;' => ''
        ] );
        $countersStyle::addStyle( "#bBlocksCounters-$cId .bBlocksCounters .bBlocksCounter .counterLabel", [
            $labelTypo['styles'] ?? 'font-size: 22px;' => ''
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-counters <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksCounters-<?php echo esc_attr( $cId ) ?>' data-duration='<?php echo wp_json_encode( $duration ?? 2000 ); ?>'>
            <style>
                @import url( <?php echo esc_url( $numberTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $labelTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $countersStyle::renderStyle(), [] ); ?>
                <?php foreach ( $counters as $index => $counter ){
                    extract( $counter );
                    $backgroundStyle = $background['styles'] ?? 'background-color: #4527a4;';
                    $iconStyle = $icon['styles'] ?? 'color: #fff;';
                    $counterStyles = "#bBlocksCounters-$cId #bBlocksCounter-$index .bBlocksCounter{ $backgroundStyle } #bBlocksCounters-$cId #bBlocksCounter-$index .counterIcon i, #bBlocksCounters-$cId #bBlocksCounter-$index .counterIconLabel i{ $iconStyle } #bBlocksCounters-$cId #bBlocksCounter-$index .counterNumber{color: ". $number['color'] .";} #bBlocksCounters-$cId #bBlocksCounter-$index .counterLabel{color: ". $label['color'] .";}";
                    echo wp_kses( $counterStyles, [] );
                } ?>
            </style>

            <div class='bBlocksCounters columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $counters as $index => $counter ) {
                    extract( $counter );
                    // Components
                    $iconEl = !empty( $icon['class'] ) ? "<i class='". $icon['class'] ."'></i>" : '';
                    $labelEl = $isLabel ? "<p class='counterLabel'>". $label['text'] ."</p>" : ''; ?>

                    <div id='bBlocksCounter-<?php echo esc_attr( $index ); ?>'>
                        <div class='bBlocksCounter'>
                            <?php echo $isIcon && 'top' === $iconPosition ? "<div class='counterIcon'>". wp_kses_post( $iconEl ) ."</div>" : ''; ?>
                            
                            <div class='counterNumber'>
                                <span class='prefix'><?php echo wp_kses_post( $number['prefix'] ) ?></span>
                                <span class='number' data-count-start='<?php echo esc_html( $number['start'] ) ?>' data-count-end=<?php echo esc_html( $number['end'] ) ?>><?php echo esc_html( $number['start'] ) ?></span>
                                <span class='suffix'><?php echo wp_kses_post( $number['suffix'] ) ?></span>
                            </div>

                            <?php echo 'label' === $iconPosition ? "<div class='counterIconLabel'>". wp_kses_post( $iconEl . $labelEl ) ."</div>" : wp_kses_post( $labelEl ); ?>
                        </div>
                    </div> <!-- bBlocks Counter -->
                <?php } ?>
            </div> <!-- bBlocks Counters -->
        </div>

        <?php $countersStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksCounters();