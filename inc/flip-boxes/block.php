<?php
class BBlocksFlipBoxes extends BBlocks{
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
                <?php echo wp_kses( $flipBoxesStyle::renderStyle(), [] );
                foreach ( $boxes as $index => $box ) {
                    extract( $box );
                    $borderStyle = $border['styles'] ?? '';
                    $shadowStyle = $shadow['styles'] ?? 'none';
                    $frontBGStyle = $frontBG['styles'] ?? 'background-color: #000000b3;';
                    $backBGStyle = $backBG['styles'] ?? 'background-color: #000000b3;';
                    $frontIconStyle = $frontIcon['styles'] ?? 'font-size: 70px; color: #fff;';
                    $backIconStyle = $backIcon['styles'] ?? 'font-size: 70px; color: #fff;';
                    $btnColorsStyle = $btnColors['styles'] ?? 'color: #fff; background: #ff4500;';
                    $btnBorderStyle = $btnBorder['styles'] ?? 'border-radius: 3px;';
                    $btnHovColorsStyle = $btnHovColors['styles'] ?? 'color: #fff; background: #ff7500;';
                    

                    $flipBoxStyles = "#bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box{ $borderStyle box-shadow: $shadowStyle;  }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.front{ $frontBGStyle }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .box.back{ $backBGStyle }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.frontIcon{ $frontIconStyle }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipIcon.backIcon{ $backIconStyle }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipTitle.flipFrontTitle{ color: $frontTitleColor; }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipTitle.flipBackTitle{ color: $backTitleColor; }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipDescription{ color: $descColor; }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn{ $btnColorsStyle $btnBorderStyle }
                    #bBlocksFlipBoxes-$cId #bBlocksFlipBox-$index .flipBtn:hover{ $btnHovColorsStyle }";
                    echo esc_html( $flipBoxStyles );
                } ?>
            </style>

            <div class='bBlocksFlipBoxes columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $boxes as $index => $box ) {
                    extract( $box ); ?>

                    <div class='bBlocksFlipBox' id='bBlocksFlipBox-<?php echo esc_attr( $index ); ?>'>
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
                <?php } ?>
            </div>
        </div>

        <?php $flipBoxesStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksFlipBoxes();