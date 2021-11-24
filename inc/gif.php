<?php
class BBlocksGIF extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'gif', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $gif = $gif ?? NULL;
        $gifAlign = $gifAlign ?? 'center';
        $gifWidth = $gifWidth ?? '0px';

        // Generate Styles
        $gifStyle = new BBlocksStyleGenerator();
        $gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif", [
            'text-align' => $gifAlign
        ] );
        $gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif figure", [
            'width' => '0px' === $gifWidth || '0%' === $gifWidth || '0em' === $gifWidth ? 'auto' : $gifWidth
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-gif <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksGif-<?php echo esc_attr( $cId ); ?>'>
            <style><?php echo wp_kses( $gifStyle::renderStyle(), [] ); ?></style>

            <div class='bBlocksGif'>
                <figure>
                    <?php echo !empty( $gif ) ? "<img src='". esc_url( $gif['images']['original']['url'] ?? '' ) ."' alt='". esc_attr( $gif['title'] ?? '' ) ."' />" : ''; ?>
                </figure>
            </div>
        </div>
        <?php $gifStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksGIF();