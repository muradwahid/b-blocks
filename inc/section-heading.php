<?php
class BBlocksSectionHeading extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
    }

    function register(){
        $this::registerScripts( 'section-heading', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => '' ),
            'cId' => array( 'type' => 'string', 'default' => '' ),

            'textAlign' => array( 'type' => 'string', 'default' => 'left' ),

            'title' => array( 'type' => 'string', 'default' => 'Section Heading' ),
            'titleTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 25, 'fontWeight' => 600 ) ),
            'titleColor' => array( 'type' => 'string', 'default' => '#4527a4' ),
            'titleMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '10px' ) ),
            
            'isSep' => array( 'type' => 'boolean', 'default' => true ),
            'separator' => array( 'type' => 'object', 'default' => array( 'width' => '150px', 'height' => '3px', 'color' => '#8344c5' ) ),
            'sepMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '5px' ) ),
            
            'isDesc' => array( 'type' => 'boolean', 'default' => true ),
            'desc' => array( 'type' => 'string', 'default' => 'This content area describes section heading descriptions or details.' ),
            'descTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'descColor' => array( 'type' => 'string', 'default' => '#333' ),
            'descMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // Generate Styles
        $sectionHeadingStyle = new BBlocksStyleGenerator();
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading", array(
            'text-align' => $textAlign
        ) );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingTitle", array(
            $titleTypo['styles'] ?? 'font-size: 25px; font-weight: 600;' => '',
            'color' => $titleColor,
            'margin' => $titleMargin['styles'] ?? '0 0 10px 0'
        ) );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingSeparator", array(
            $separator['styles'] ?? 'width: 150px; border-top: 3px solid #8344c5;' => '',
            'margin' => $sepMargin['styles'] ?? '0 0 5px 0'
        ) );
        $sectionHeadingStyle::addStyle( "#bBlocksSectionHeading-$cId .bBlocksSectionHeading .sectionHeadingDescription", array(
            $descTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $descColor,
            'margin' => $descMargin['styles'] ?? '0 0 15px 0'
        ) );


        ob_start(); ?>
        <div class='wp-block-b-blocks-section-heading <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksSectionHeading-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $descTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $sectionHeadingStyle::renderStyle(), array() ); ?>
            </style>

            <div class='bBlocksSectionHeading'>
                <h2 class='sectionHeadingTitle'><?php echo wp_kses_post( $title ); ?></h2>
                <?php echo $isSep ? "<span class='sectionHeadingSeparator'></span>" : ''; ?>
                <?php echo $isDesc ? "<p class='sectionHeadingDescription'>". wp_kses_post( $desc ) ."</p>" : ''; ?>
            </div>
        </div>
        <?php $sectionHeadingStyle::$styles = array(); // Empty styles
        return ob_get_clean();
    }
}
new BBlocksSectionHeading();