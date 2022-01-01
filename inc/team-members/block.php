<?php
class BBlocksTeamMembers extends BBlocks{
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
        $teamMembersStyle = new BBlocksStyleGenerator();
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers", [
            'grid-gap' => "$rowGap $columnGap"
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember", [
            'text-align' => $textAlign,
            'padding' => $padding['styles'] ?? '50px 20px'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberPhoto", [
            'width' => $photoWidth,
            'margin' => 'horizontal' === $layout ? '0 20px 0 0' : $photoMargin['styles'] ?? '0 0 20px 0'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberName", [
            $nameTypo['styles'] ?? 'font-size: 20px; font-weight: 600;' => '',
            'margin' => $nameMargin['styles'] ?? '0 0 10px 0'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberTitle", [
            $titleTypo['styles'] ?? 'font-size: 16px;' => '',
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSeparator", [
            'margin' => $sepMargin['styles'] ?? '0 0 15px 0'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberBio", [
            $bioTypo['styles'] ?? 'font-size: 15px;' => '',
            'margin' => $bioMargin['styles'] ?? '0 0 15px 0'
        ] );
        $teamMembersStyle::addStyle( "#bBlocksTeamMembers-$cId .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .icon", [
            'margin' => $socialIconMargin['styles'] ?? '10px 10px'
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-team-members <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksTeamMembers-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $nameTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $bioTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $teamMembersStyle::renderStyle(), [] );
                foreach ( $members as $index => $member ) {
                    extract( $member );
                    $backgroundStyle = $background['styles'] ?? 'background-color: #0000;';
                    $borderStyle = $border['styles'] ?? 'border-radius: 3px;';
                    $shadowStyle = $shadow['styles'] ?? 'none';
                    $photoBorderStyle = $photoBorder['styles'] ?? 'border-radius: 50%;';
                    $separatorStyle = $separator['styles'] ?? 'width: 20%; border-top: 3px solid #777;';
                    $textAlignStyle = 'center' === $textAlign ? 'center' : ( 'right' === $textAlign ? 'flex-end' : 'flex-start' );
                    $socialIconColorsStyle = $socialIconColors['styles'] ?? 'color: #fff; background: #4527a4;';

                    $memberStyles = "#bBlocksTeamMembers-$cId #bBlocksMember-$index{ $backgroundStyle $borderStyle box-shadow: $shadowStyle; }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberPhoto{ $photoBorderStyle }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberName{ color: $nameColor; }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberTitle{ color: $titleColor; }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberSeparator{ $separatorStyle }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberBio{ color: $bioColor; }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberSocial{ justify-content: $textAlignStyle; }
                    #bBlocksTeamMembers-$cId #bBlocksMember-$index .memberDetails .memberSocial .icon a{ $socialIconColorsStyle }";
                    echo esc_html( $memberStyles );
                } ?>
            </style>

            <div class='bBlocksTeamMembers <?php echo esc_attr( $layout ?? 'vertical' ); ?> columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                <?php foreach ( $members as $index => $member ) {
                    extract( $member );
                    // Classes
                    $photoClass = isset( $photo['id'] ) ? 'wp-image-'.$photo['id'] : ''; ?>

                    <div class='bBlocksMember' id='bBlocksMember-<?php echo esc_attr( $index ); ?>'>
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
                <?php } ?>
            </div>
        </div>

        <?php $teamMembersStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksTeamMembers();