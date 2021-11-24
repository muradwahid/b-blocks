<?php
class BBlocksChart extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'chart', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $width = $width ?? '80%';
        $background = $background ?? [ 'color' => '#0000' ];
        $alignment = $alignment ?? 'center';

        $chartStyle = new BBlocksStyleGenerator(); // Generate Styles
        $chartStyle::addStyle( "#bBlocksChart-$cId", [
            'text-align' => $alignment
        ] );
        $chartStyle::addStyle( "#bBlocksChart-$cId .bBlocksChart", [
            'width' => $width
        ] );
        $chartStyle::addStyle( "#bBlocksChart-$cId .bBlocksChart canvas", [
            $background['styles'] ?? 'background-color: #0000;' => ''
        ] );

        $jsonData = wp_json_encode( [ 'data' => $data ?? '', 'type' => $type ?? 'line', 'textColor' => $textColor ?? '#666', 'gridLineColor' => $gridLineColor ?? '#0000001a', 'isTitle' => $isTitle ?? true, 'title' => $title ?? 'Chart Title', 'titleFontSize' => $titleFontSize ?? 22, 'titleColor' => $titleColor ?? '#fe6601', 'isSubtitle' => $isSubtitle ?? false, 'subtitle' => $subtitle ?? 'Chart Subtitle', 'subtitleFontSize' => $subtitleFontSize ?? 13, 'subtitleColor' => $subtitleColor ?? '#fbb040' ] );

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