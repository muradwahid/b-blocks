<?php
class BBlocksChart extends BBlocks{
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
        $chartStyle = new BBlocksStyleGenerator();
        $chartStyle::addStyle( "#bBlocksChart-$cId", [
            'text-align' => $alignment
        ] );
        $chartStyle::addStyle( "#bBlocksChart-$cId .bBlocksChart", [
            'width' => $width
        ] );
        $chartStyle::addStyle( "#bBlocksChart-$cId .bBlocksChart canvas", [
            $background['styles'] ?? 'background-color: #0000;' => ''
        ] );

        $jsonData = wp_json_encode( [ 'data' => $data, 'type' => $type, 'textColor' => $textColor, 'gridLineColor' => $gridLineColor, 'isTitle' => $isTitle, 'title' => $title, 'titleFontSize' => $titleFontSize, 'titleColor' => $titleColor, 'isSubtitle' => $isSubtitle, 'subtitle' => $subtitle, 'subtitleFontSize' => $subtitleFontSize, 'subtitleColor' => $subtitleColor ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-chart <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksChart-<?php echo esc_attr( $cId ) ?>' data-chart='<?php echo esc_attr( $jsonData ); ?>'>
            <style><?php echo wp_kses( $chartStyle::renderStyle(), [] ) ?></style>

            <div class='bBlocksChart'>
                <canvas>Your browser does not support the canvas element.</canvas>
            </div>
        </div>

        <?php $chartStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksChart();