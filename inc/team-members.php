<?php
class BBlocksTeamMembers extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'team-members', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $members = $members ?? array(
            array(
                'background' => array( 'color' => '#0000' ),
                'border' => array( 'radius' => '3px' ),
                'shadow' => array(),
                'photo' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'photoBorder' => array( 'radius' => '50%' ),
                'name' => 'Martin',
                'nameColor' => '#333',
                'title' => 'Founder',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '3px', 'color' => '#777' ),
                'bio' => 'I am a self-motivated and self-taught professional who likes to solve problems.',
                'bioColor' => '#333',
                'social' => array(
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-facebook' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-twitter' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-linkedin' ) )
                ),
                'socialIconColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) )
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'border' => array( 'radius' => '3px' ),
                'shadow' => array(),
                'photo' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'photoBorder' => array( 'radius' => '50%' ),
                'name' => 'Mary',
                'nameColor' => '#333',
                'title' => 'Co-Founder',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '3px', 'color' => '#777' ),
                'bio' => 'I am a self-motivated and self-taught professional who likes to solve problems.',
                'bioColor' => '#333',
                'social' => array(
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-facebook' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-twitter' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-linkedin' ) )
                ),
                'socialIconColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) )
            ),
            array(
                'background' => array( 'color' => '#0000' ),
                'border' => array( 'radius' => '3px' ),
                'shadow' => array(),
                'photo' => array( 'id' => NULL, 'url' => '', 'alt' => '', 'title' => '' ),
                'photoBorder' => array( 'radius' => '50%' ),
                'name' => 'John Doe',
                'nameColor' => '#333',
                'title' => 'CEO',
                'titleColor' => '#333',
                'separator' => array( 'width' => '20%', 'height' => '3px', 'color' => '#777' ),
                'bio' => 'I am a self-motivated and self-taught professional who likes to solve problems.',
                'bioColor' => '#333',
                'social' => array(
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-facebook' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-twitter' ) ),
                    array( 'link' => '#', 'icon' => array( 'class' => 'fa fa-linkedin' ) )
                ),
                'socialIconColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) )
            )
        );
        $columns = $columns ?? array( 'desktop' => 3, 'tablet'  => 2, 'mobile'  => 1 );
        $columnGap = $columnGap ?? '30px';
        $rowGap = $rowGap ?? '30px';
        $layout = $layout ?? 'vertical';
        $style = $style ?? 'default';
        $textAlign = $textAlign ?? 'center';
        $padding = $padding ?? array( 'vertical' => '50px', 'horizontal' => '20px' );
        $photoWidth = $photoWidth ?? '170px';
        $photoMargin = $photoMargin ?? array( 'bottom' => '20px' );
        $nameTypo = $nameTypo ?? array( 'fontSize' => 20, 'fontWeight' => 600 );
        $nameMargin = $nameMargin ?? array( 'bottom' => '10px' );
        $isTitle = $isTitle ?? true;
        $titleTypo = $titleTypo ?? array( 'fontSize' => 16 );
        $titleMargin = $titleMargin ?? array( 'bottom' => '10px' );
        $isSep = $isSep ?? true;
        $sepMargin = $sepMargin ?? array( 'bottom' => '15px' );
        $isBio = $isBio ?? true;
        $bioTypo = $bioTypo ?? array( 'fontSize' => 15 );
        $bioMargin = $bioMargin ?? array( 'bottom' => '15px' );
        $isSocial = $isSocial ?? true;
        $socialIconMargin = $socialIconMargin ?? array( 'side' => 2, 'vertical' => '10px', 'horizontal' => '10px' );

        // Generate Styles
        $teamMembersStyle = new BBlocksStyleGenerator();
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers", array(
            'grid-gap' => "$rowGap $columnGap"
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember", array(
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberPhoto", array(
            'width' => $photoWidth,
            'margin' => 'horizontal' === $layout ? '0 20px 0 0' : $photoMargin['styles'] ?? '0 0 20px 0'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberName", array(
            $nameTypo['styles'] ?? 'font-size: 20px; font-weight: 600;' => '',
            'margin' => $nameMargin['styles'] ?? '0 0 10px 0'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberTitle", array(
            $titleTypo['styles'] ?? 'font-size: 16px;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSeparator", array(
            'margin' => $sepMargin['styles'] ?? '0 0 15px 0'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberBio", array(
            $bioTypo['styles'] ?? 'font-size: 15px;' => '',
            'margin' => $bioMargin['styles'] ?? '0 0 15px 0'
        ) );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .icon", array(
            'margin' => $socialIconMargin['styles'] ?? '10px 10px'
        ) );

        ob_start(); ?>
        <div class='wp-block-b-blocks-team-members <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksTeamMembers-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $nameTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $bioTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $teamMembersStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksTeamMembers <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $members as $index => $member ) {
                    extract( $member );

                    $memberStyle = new BBlocksStyleGenerator();
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index", array(
                        $background['styles'] ?? 'background-color: #0000;' => '',
                        $border['styles'] ?? 'border-radius: 3px;' => '',
                        'box-shadow' => $shadow['styles'] ?? 'none'
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberPhoto", array(
                        $photoBorder['styles'] ?? 'border-radius: 50%;' => ''
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberName", array(
                        'color' => $nameColor
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberTitle", array(
                        'color' => $titleColor
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberSeparator", array(
                        $separator['styles'] ?? 'width: 20%; border-top: 3px solid #777;' => ''
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberBio", array(
                        'color' => $bioColor
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberSocial", array(
                        'justify-content' => 'center' === $textAlign ? 'center' : ( 'right' === $textAlign ? 'flex-end' : 'flex-start' )
                    ) );
                    $memberStyle::addStyle( "#bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberSocial .icon a", array(
                        $socialIconColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
                    ) );

                    // Classes
                    $photoClass = isset( $photo['id'] ) ? 'wp-image-'.$photo['id'] : '';
                    ?>

                    <div class='bBlocksMember' id='bBlocksMember-<?php echo esc_attr( $index ); ?>'>
                        <style><?php echo wp_kses( $memberStyle::renderStyle(), array() ); ?></style>

                        <?php echo $photo['url'] ? "<img class='memberPhoto ". esc_attr( $photoClass ) ."' src='". esc_url( $photo['url'] ) ."' alt='". esc_attr( $photo['alt'] ) ."' />" : ''; ?>

                        <div class='memberDetails'>
                            <?php echo $name ? "<h4 class='memberName'>". wp_kses_post( $name ) ."</h4>" : ''; ?>

                            <?php echo $isTitle && $title ? "<p class='memberTitle'>". wp_kses_post( $title ) ."</p>" : ''; ?>

                            <?php echo $isSep ? "<span class='memberSeparator'></span>" : ''; ?>
                            
                            <?php echo $isBio && $bio ? "<p class='memberBio'>". wp_kses_post( $bio ) ."</p>" : ''; ?>

                            <ul class='memberSocial'>
                            <?php foreach ( $social as $socialIndex => $socialItem ) {
                                extract( $socialItem ); ?>

                                <li class='icon icon-<?php echo esc_attr( $index ); ?>-<?php echo esc_attr( $socialIndex ); ?>'>
                                    <a href='<?php echo esc_url( $link ); ?>'>
                                        <i class='<?php echo esc_attr( $icon['class'] ); ?>'></i>
                                    </a>
                                </li>
                            <?php } ?>
                            </ul>
                        </div>
                    </div>
                <?php $memberStyle::$styles = array(); } ?>
            </div>
        </div>

        <?php $teamMembersStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksTeamMembers();