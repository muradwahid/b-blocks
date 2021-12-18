<?php
class BBlocksSocialShare extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'social-share', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $socials= $socials ?? [
            [
                'networkType' => 'socialNetworks',
                'network' => 'facebook',
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fab fa-facebook-f', 'color' => '#1877f2' ],
                'upIcon' => [ 'id' => null, 'url' => '', 'alt' => '', 'title' => '' ]
            ],
            [
                'networkType' => 'socialNetworks',
                'network' => 'twitter',
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fab fa-twitter', 'color' => '#1da1f2' ],
                'upIcon' => [ 'id' => null, 'url' => '', 'alt' => '', 'title' => '' ]
            ],
            [
                'networkType' => 'socialNetworks',
                'network' => 'linkedin',
                'isUpIcon' => false,
                'icon' => [ 'class' => 'fab fa-linkedin-in', 'color' => '#0a66c2' ],
                'upIcon' => [ 'id' => null, 'url' => '', 'alt' => '', 'title' => '' ]
            ]
        ];
        $alignment = $alignment ?? 'left';
        $background = $background ?? [ 'color' => '#0000' ];
        $size = $size ?? '28px';
        $padding = $padding ?? '10px';
        $margin = $margin ?? '10px';
        $border = $border ?? [ 'radius' => '50%' ];
        $shadow = $shadow ?? [];

        // Generate Styles
        $socialShareStyle = new BBlocksStyleGenerator(); // Generate Styles
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