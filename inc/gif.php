<?php
class BBlocksGIF extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'gif', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string' ),

            'gif' => array( 'type' => 'object', 'default' => NULL ),
            'gifAlign' => array( 'type' => 'string', 'default' => 'center' ),
            'gifWidth' => array( 'type' => 'string', 'default' => '0px' )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $gifStyle = new BBlocksStyleGenerator();
        $gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif", array(
            'text-align' => $gifAlign
        ) );
        $gifStyle::addStyle( "#bBlocksGif-$cId .bBlocksGif figure", array(
            'width' => '0px' === $gifWidth || '0%' === $gifWidth || '0em' === $gifWidth ? 'auto' : $gifWidth
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-gif <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksGif-<?php echo esc_attr( $cId ); ?>'>
            <style><?php echo wp_kses( $gifStyle::renderStyle(), array() ); ?></style>

            <div class='bBlocksGif'>
                <figure>
                    <?php echo $gif ? "<img src='". esc_url( $gif['images']['original']['url'] ?? '' ) ."' alt='". esc_attr( $gif['title'] ?? '' ) ."' />" : ''; ?>
                </figure>
            </div>
        </div>
        <?php $gifStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksGIF();