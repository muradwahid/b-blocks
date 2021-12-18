<?php
class BBlocksCounters extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'counters', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $counters = $counters ?? [
            [
                'background' => [ 'color' => '#4527a4' ],
                'icon' => [ 'class' => 'fa fa-puzzle-piece', 'fontSize' => 50, 'color' => '#fff' ],
                'number' => [ 'start' => 0, 'end' => 30, 'prefix' => '', 'suffix' => '+', 'color' => '#fff' ],
                'label' => [ 'text' => 'Products', 'color' => '#fff' ]
            ],
            [
                'background' => [ 'color' => '#4527a4' ],
                'icon' => [ 'class' => 'fa fa-thumbs-up', 'fontSize' => 50, 'color' => '#fff' ],
                'number' => [ 'start' => 0, 'end' => 380, 'prefix' => '', 'suffix' => 'K+', 'color' => '#fff' ],
                'label' => [ 'text' => 'Customers', 'color' => '#fff' ]
            ],
            [
                'background' => [ 'color' => '#4527a4' ],
                'icon' => [ 'class' => 'fa fa-award', 'fontSize' => 50, 'color' => '#fff' ],
                'number' => [ 'start' => 0, 'end' => 90, 'prefix' => '', 'suffix' => '', 'color' => '#fff' ],
                'label' => [ 'text' => 'Awards', 'color' => '#fff' ]
            ]
        ];
        $columns = $columns ?? [ 'desktop' => 3, 'tablet' => 2, 'mobile' => 1 ];
        $columnGap = $columnGap ?? '20px';
        $rowGap = $rowGap ?? '30px';
        $background = $background ?? [ 'color' => '#000' ];
        $padding = $padding ?? [ 'vertical' => '20px', 'horizontal' => '0px' ];
        $textAlign = $textAlign ?? 'center';
        $counterWidth = $counterWidth ?? '250px';
        $counterHeight = $counterHeight ?? '250px';
        $isIcon = $isIcon ?? true;
        $iconSize = $iconSize ?? 50;
        $iconPosition = $iconPosition ?? 'top';
        $numberTypo = $numberTypo ?? [ 'fontSize' => 48 ];
        $isLabel = $isLabel ?? true;
        $labelTypo = $labelTypo ?? [ 'fontSize' => 22 ];
        $counterPadding = $counterPadding ?? [ 'vertical' => '20px', 'horizontal' => '20px' ];
        $counterBorder = $counterBorder ?? [ 'radius' => '50%' ];
        $counterShadow = $counterShadow ?? [];

        // Generate Styles
        $countersStyle = new BBlocksStyleGenerator(); // Generate Styles
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