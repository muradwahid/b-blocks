<?php
class BBlocksChart extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'chart', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $data = $data ?? array(
            'labels' => array( 'January', 'February', 'March', 'April', 'May', 'June' ),
            'datasets' => array(
                array(
                    'label' => 'T-Shirts Sell 2021',
                    'data' => array( 3, 9, 10, 16, 14, 16 ),
                    'backgroundColor' => array( '#ff638433', '#36a28733', '#ffce5633', '#4bc0c033', '#9966ff33', '#ff9f4033' ),
                    'borderColor' => array( '#ff6384', '#36a287', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40' ),
                    'tension' => 0.3,
                    'borderWidth' => 2,
                    'hoverBorderWidth' => 2,
                    'pointRadius' => 3,
                    'pointHoverRadius' => 4,
                    'pointStyle' => 'triangle'
                ),
                array(
                    'label' => 'Shoes Sell 2021',
                    'data' => array( 5, 7, 12, 14, 13, 17 ),
                    'backgroundColor' => array( '#ff638433', '#36a28733', '#ffce5633', '#4bc0c033', '#9966ff33', '#ff9f4033' ),
                    'borderColor' => array( '#ff6384', '#36a287', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40' ),
                    'tension' => 0.3,
                    'borderWidth' => 2,
                    'hoverBorderWidth' => 2,
                    'pointRadius' => 3,
                    'pointHoverRadius' => 4,
                    'pointStyle' => 'circle'
                )
            )
        );
        $width = $width ?? '80%';
        $background = $background ?? array( 'color' => '#0000' );
        $alignment = $alignment ?? 'center';

        $chartStyle = new BBlocksStyleGenerator(); // Generate Styles
        $chartStyle::addStyle("#bBlocksChart-$cId", array(
            'text-align' => $alignment
        ) );
        $chartStyle::addStyle("#bBlocksChart-$cId .bBlocksChart", array(
            'width' => $width
        ) );
        $chartStyle::addStyle("#bBlocksChart-$cId .bBlocksChart canvas", array(
            $background['styles'] ?? 'background-color: #0000;' => ''
        ) );

        $jsonData = json_encode( array( 'data' => $data, 'type' => $type ?? 'line', 'textColor' => $textColor ?? '#666', 'gridLineColor' => $gridLineColor ?? '#0000001a', 'isTitle' => $isTitle ?? true, 'title' => $title ?? 'Chart Title', 'titleFontSize' => $titleFontSize ?? 22, 'titleColor' => $titleColor ?? '#fe6601', 'isSubtitle' => $isSubtitle ?? false, 'subtitle' => $subtitle ?? 'Chart Subtitle', 'subtitleFontSize' => $subtitleFontSize ?? 13, 'subtitleColor' => $subtitleColor ?? '#fbb040' ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-chart <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksChart-<?php echo esc_attr( $cId ) ?>' data-chart='<?php echo esc_attr( $jsonData ); ?>'>
            <style><?php echo wp_kses( $chartStyle::renderStyle(), [] ) ?></style>

            <div class='bBlocksChart'>
                <canvas>Your browser does not support the canvas element.</canvas>
            </div>
        </div>

        <?php $chartStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksChart();