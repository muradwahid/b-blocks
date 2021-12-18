<?php
class BBlocksSectionHeading extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'section-heading', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $textAlign = $textAlign ?? 'left';
        $title = $title ?? 'Section Heading';
        $titleTypo = $titleTypo ?? [ 'fontSize' => 25, 'fontWeight' => 600 ];
        $titleColor = $titleColor ?? '#4527a4';
        $titleMargin = $titleMargin ?? [ 'bottom' => '10px' ];
        $isSep = $isSep ?? true;
        $separator = $separator ?? [ 'width' => '150px', 'height' => '3px', 'color' => '#8344c5' ];
        $sepMargin = $sepMargin ?? [ 'bottom' => '5px' ];
        $isDesc = $isDesc ?? true;
        $desc = $desc ?? 'This content area describes section heading descriptions or details.';
        $descTypo = $descTypo ?? [ 'fontSize' => 15 ];
        $descColor = $descColor ?? '#333';
        $descMargin = $descMargin ?? [ 'bottom' => '15px' ];

        // Generate Styles
        $sectionHeadingStyle = new BBlocksStyleGenerator();
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading", [
            'text-align' => $textAlign
        ] );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingTitle", [
            $titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
            'color' => $titleColor,
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ] );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingSeparator", [
            $separator['styles'] ?? 'width: 150px; border-top: 3px solid #8344c5;' => '',
            'margin' => $sepMargin['styles'] ?? '0 0 5px 0'
        ] );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingDescription", [
            $descTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $descColor,
            'margin' => $descMargin['styles'] ?? '0 0 15px 0'
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-section-heading <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksSectionHeading-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?> );
                @import url( <?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?> );
                <?php echo wp_kses( $sectionHeadingStyle::renderStyle(), [] ); ?>
            </style>

            <div class='bBlocksSectionHeading'>
                <h2 class='sectionHeadingTitle'><?php echo wp_kses_post( $title ); ?></h2>
                <?php echo $isSep ? "<span class='sectionHeadingSeparator'></span>" : ''; ?>
                <?php echo $isDesc ? "<p class='sectionHeadingDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
            </div>
        </div>
        <?php $sectionHeadingStyle::$styles = []; // Empty styles
        return ob_get_clean();
    }
}
new BBlocksSectionHeading();