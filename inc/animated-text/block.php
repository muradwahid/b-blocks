<?php
class BBlocksAnimatedText extends BBlocks{
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
        $animatedTextStyle = new BBlocksStyleGenerator();
        $animatedTextStyle::addStyle( "#bBlocksAnimatedText-$cId .bBlocksAnimatedText", [
            'text-align' => $textAlign,
            $background['styles'] ?? 'background-color: #0000;' => '',
            'padding' => $padding['styles'] ?? '15px 15px',
            $border['styles'] ?? 'border-radius: 5px;' => ''
        ] );
        $animatedTextStyle::addStyle( "#bBlocksAnimatedText-$cId .bBlocksAnimatedText .content", [
            $typography['styles'] ?? 'font-size: 22px;' => '',
            'color' => $color
        ] );

        $jsonData = wp_json_encode( [ 'loop' => $loop ?? true, 'animateIn' => $animateIn ?? 'char', 'inEffect' => $inEffect ?? 'fadeInLeftBig', 'inSequence' => $inSequence ?? 'default', 'outEffect' => $outEffect ?? 'rollOut', 'outSequence' => $outSequence ?? 'shuffle' ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-animated-text <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksAnimatedText-<?php echo esc_attr( $cId ) ?>' data-animate='<?php echo esc_attr( $jsonData ); ?>'>
            <style>@import url( <?php echo esc_url( $typography['googleFontLink'] ?? '' ); ?> ); <?php echo wp_kses( $animatedTextStyle::renderStyle(), [] ) ?></style>

            <div class='bBlocksAnimatedText'>
                <p class='content'><?php echo wp_kses_post( $content ); ?></p>
            </div>
        </div>

        <?php $animatedTextStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksAnimatedText();