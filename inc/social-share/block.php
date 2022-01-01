<?php
class BBlocksSocialShare extends BBlocks{
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
        $socialShareStyle = new BBlocksStyleGenerator();
        $socialShareStyle::addStyle( "#bBlocksSocialShare-$cId", [
            'text-align' => $alignment
        ] );
        $socialShareStyle::addStyle( "#bBlocksSocialShare-$cId ul.bBlocksSocialShare li.icon", [
            $background['styles'] ?? 'background-color: #0000;' => '',
            'width' => "calc( $size + $padding + $padding )",
            'height' => "calc( $size + $padding + $padding )",
            'margin' => "0 calc( $margin / 2 )",
            $border['styles'] ?? 'border-radius: 50%;' => '',
            'box-shadow' => $shadow['styles'] ?? 'none'
        ] );
        $socialShareStyle::addStyle( "#bBlocksSocialShare-$cId ul.bBlocksSocialShare li.icon i", [
            'font-size' => $size
        ] );
        $socialShareStyle::addStyle( "#bBlocksSocialShare-$cId ul.bBlocksSocialShare li.icon img", [
            'width' => $size
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-social-share <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksSocialShare-<?php echo esc_attr( $cId ) ?>'>
            <style><?php
                echo wp_kses( $socialShareStyle::renderStyle(), [] );
                foreach ( $socials as $index => $social ) {
                    $iconStyle = $social['icon']['styles'] ?? 'color: #4527a4;';
                    $socialStyles = "#bBlocksSocialShare-$cId ul.bBlocksSocialShare li.icon-$index i{ $iconStyle }";
                    echo wp_kses( $socialStyles, [] );
                }
            ?></style>

            <ul class='bBlocksSocialShare'>
                <?php foreach ( $socials as $index => $social ) {
                    extract( $social );
                    // Classes
                    $upIconClass = isset( $upIcon['id'] ) ? 'wp-image-'.$upIcon['id'] : '';
                    $upIconEl = !empty( $upIcon['url'] ) ? "<img class='$upIconClass' src='". $upIcon['url'] ."' alt='". $upIcon['alt'] ."' />" : '';
                    $iconEl = !empty( $icon['class'] ) ? "<i class='". $icon['class'] ."'></i>" : '';
                    $filterIconEl = $isUpIcon ? $upIconEl : $iconEl; ?>

                    <li class='icon icon-<?php echo esc_attr( $index ); ?>' data-social='<?php echo esc_attr( $network ); ?>'>
                        <?php echo wp_kses_post( $filterIconEl ); ?>
                    </il>
                <?php } ?>
            </ul>
        </div>

        <?php $socialShareStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksSocialShare();