<?php
class BBlocksPosts extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
        add_action( 'rest_api_init', [$this, 'customRestAPI'] );
    }

    function register(){
        $this::registerScripts( 'posts', array(
            'attributes'      => $this->attributes(),
            'render_callback' => [$this, 'render']
        ) );
    }

    function attributes(){
        return array(
            'align' => array( 'type' => 'string', 'default' => 'wide' ),
            'cId' => array( 'type' => 'string' ),

            'layout' => array( 'type' => 'string', 'default' => 'grid' ),
            'subLayout' => array( 'type' => 'string', 'default' => 'default' ),
            'columns' => array( 'type' => 'object', 'default' => array( 'desktop' => 3, 'tablet' => 2, 'mobile' => 1 ) ),
            'columnGap' => array( 'type' => 'number', 'default' => 15 ),
            'rowGap' => array( 'type' => 'number', 'default' => 15 ),
            'isContentEqualHight' => array( 'type' => 'boolean', 'default' => true ),

            'postType' => array( 'type' => 'string', 'default' => 'post' ),
            'selectedCategories' => array( 'type' => 'array', 'default' => array() ),
            'isPostsPerPageAll' => array( 'type' => 'boolean', 'default' => false ),
            'postsPerPage' => array( 'type' => 'number', 'default' => 12 ),
            'postsOrderBy' => array( 'type' => 'string', 'default' => 'date' ),
            'postsOrder' => array( 'type' => 'string', 'default' => 'desc' ),

            'contentAlign' => array( 'type' => 'string', 'default' => 'left' ),
            'contentBG' => array( 'type' => 'object', 'default' => array( 'color' => '#f4f2fc' ) ),
            'contentPadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '20px', 'horizontal' => '25px' ) ),
            'border' => array( 'type' => 'object', 'default' => array( 'radius' => '5px' ) ),

            'isFImg' => array( 'type' => 'boolean', 'default' => true ),
            'isFImgLink' => array( 'type' => 'boolean', 'default' => false ),

            'isTitle' => array( 'type' => 'boolean', 'default' => true ),
            'isTitleLink' => array( 'type' => 'boolean', 'default' => true ),
            'titleTypo' => array( 'type' => 'object', 'default' => array( 'fontFamily' => 'Roboto', 'fontSize' => 25, 'googleFontLink' => 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' ) ),
            'titleColor' => array( 'type' => 'string', 'default' => '#4527a4' ),
            'titleMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),

            'isMeta' => array( 'type' => 'boolean', 'default' => true ),
            'isMetaAuthor' => array( 'type' => 'boolean', 'default' => true ),
            'isMetaDate' => array( 'type' => 'boolean', 'default' => true ),
            'isMetaCategory' => array( 'type' => 'boolean', 'default' => true ),
            'metaCategoryIn' => array( 'type' => 'string', 'default' => 'content' ),
            'isMetaComment' => array( 'type' => 'boolean', 'default' => false ),
            'metaTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 13, 'textTransform' => 'uppercase' ) ),
            'metaTextColor' => array( 'type' => 'string', 'default' => '#333' ),
            'metaLinkColor' => array( 'type' => 'string', 'default' => '#8344c5' ),
            'metaIconColor' => array( 'type' => 'string', 'default' => '#4527a4' ),
            'metaMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '15px' ) ),

            'isExcerpt' => array( 'type' => 'boolean', 'default' => true ),
            'excerptLength' => array( 'type' => 'number', 'default' => 25 ),
            'excerptAlign' => array( 'type' => 'string', 'default' => 'justify' ),
            'excerptTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 15 ) ),
            'excerptColor' => array( 'type' => 'string', 'default' => '#333' ),
            'excerptMargin' => array( 'type' => 'object', 'default' => array( 'bottom' => '10px' ) ),

            'isReadMore' => array( 'type' => 'boolean', 'default' => true ),
            'readMoreLabel' => array( 'type' => 'string', 'default' => 'Read More' ),
            'isLinkNewTab' => array( 'type' => 'boolean', 'default' => false ),
            'readMoreAlign' => array( 'type' => 'string', 'default' => 'left' ),
            'readMoreTypo' => array( 'type' => 'object', 'default' => array( 'fontSize' => 14, 'textTransform' => 'uppercase', 'fontWeight' => 600 ) ),
            'readMoreColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#8344c5' ) ),
            'readMoreHovColors' => array( 'type' => 'object', 'default' => array( 'color' => '#fff', 'bg' => '#4527a4' ) ),
            'readMorePadding' => array( 'type' => 'object', 'default' => array( 'vertical' => '12px', 'horizontal' => '35px' ) ),
            'readMoreBorder' => array( 'type' => 'object', 'default' => array( 'radius' => '3px' ) )
        );
    }

    function render( $attributes ){
        extract( $attributes );

        // $taxonomies = get_object_taxonomies( $postType, 'array' );
        // foreach( $taxonomies as $tax ){
        //     if( $tax->hierarchical ){
        //         $terms = get_terms( $tax->name, array(
        //             'orderby'       => 'term_id', 
        //             'order'         => 'ASC',
        //             'hide_empty'    => true, 
        //         ) );
        //     }
        // }

        // Generate Styles
        $postsStyles = new BBlocksStyleGenerator();
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost", array(
            'margin-bottom' => 'masonry' === $layout ? $rowGap.'px' : '0px',
            $border['styles'] ?? 'border-radius: 5px;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPostDefault, #bBlocksPosts-$cId .bBlocksPostSideImage", array(
            'text-align' => $contentAlign,
            $contentBG['styles'] ?? 'background-color: #f4f2fc;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostText", array(
            'padding' => $contentPadding['styles'] ?? '20px 25px'
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPostOverlay .bBlocksPostText", array(
            $contentBG['styles'] ?? 'background-color: #f4f2fc;' => '',
            'align-items' => 'left' === $contentAlign ? 'flex-start' : ( 'right' === $contentAlign ? 'flex-end' : ( 'center' === $contentAlign ? 'center' : 'stretch' ) )
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostTitle", array(
            'text-align' => $contentAlign,
            $titleTypo['styles'] ?? 'font-size: 25px;' => '',
            'color' => $titleColor,
            'margin' => $titleMargin['styles'] ?? '0 0 15px 0'
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostTitle a", array( 'color' => $titleColor ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta", array(
            'text-align' => $contentAlign,
            $metaTypo['styles'] ?? 'font-size: 13px; text-transform: uppercase;' => '',
            'color' => $metaTextColor,
            'margin' => $metaMargin['styles'] ?? '0 0 15px 0'
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta a", array(
            'color' => $metaLinkColor
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta .dashicons", array(
            'color' => $metaIconColor
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostFImgCats", array(
            $metaTypo['styles'] ?? 'font-size: 13px; text-transform: uppercase;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostExcerpt", array(
            'text-align' => $excerptAlign,
            $excerptTypo['styles'] ?? 'font-size: 15px;' => '',
            'color' => $excerptColor,
            'margin' => $excerptMargin['styles'] ?? '0 0 10px 0'
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore", array(
            'text-align' => $readMoreAlign
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore a", array(
            $readMoreTypo['styles'] ?? 'font-size: 14px; text-transform: uppercase; font-weight: 600;' => '',
            $readMoreColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
            'padding' => $readMorePadding['styles'] ?? '12px 35px',
            $readMoreBorder['styles'] ?? 'border-radius: 3px;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore a:hover", array(
            $readMoreHovColors['styles'] ?? 'color: #fff; background: #4527a4;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksGridPosts", array(
            'grid-gap' => $rowGap .'px '. $columnGap .'px',
            'align-items' => false === $isContentEqualHight ? 'start' : 'initial'
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksMasonryPosts", array(
            'gap' => $columnGap . 'px'
        ) );
    
        // All Posts
        $posts = get_posts( [
            'post_type'      => $postType,
            'category'       => $selectedCategories,
            'posts_per_page' => $isPostsPerPageAll ? -1 : $postsPerPage,
            'orderby'        => $postsOrderBy,
            'order'          => $postsOrder
        ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-posts bBlocksPosts <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksPosts-<?php echo esc_attr( $cId ); ?>'>
            <style>
                @import url(<?php echo esc_url( $titleTypo['googleFontLink'] ?? 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' ); ?>);
                @import url(<?php echo esc_url( $metaTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $excerptTypo['googleFontLink'] ?? '' ); ?>);
                @import url(<?php echo esc_url( $readMoreTypo['googleFontLink'] ?? '' ); ?>);
                <?php echo wp_kses( $postsStyles::renderStyle(), array() ); ?>

                <?php foreach ( $posts as $post ) {
                    $imgUrl = get_the_post_thumbnail_url( $post->ID );
                    $displayCSS = $imgUrl ? 'grid' : 'flex';
        
                    $sideImgCSS = "#bBlocksPosts-$cId .bBlocksPostSideImage.bBlocksPost-$post->ID{ display: $displayCSS; }";
                    $fImgCSS = $isFImg && $imgUrl ? "#bBlocksPosts-$cId .bBlocksPostOverlay.bBlocksPost-$post->ID, #bBlocksPosts-$cId .bBlocksPost .bBlocksPostFImg-$post->ID{ background-image: url( $imgUrl ); }" : '';

                    echo esc_html( $sideImgCSS . $fImgCSS );
                } ?>
            </style>


            <?php if( 'grid' === $layout ){ ?>
                <div class='bBlocksGridPosts columns-<?php echo esc_attr( $columns['desktop'] ); ?> columns-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> columns-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                    <?php echo $this->foreachPosts( $attributes, $posts ); ?>
                </div>
            <?php }else if( 'masonry' === $layout ){ ?>
                <div class='bBlocksMasonryPosts cols-<?php echo esc_attr( $columns['desktop'] ); ?> cols-tablet-<?php echo esc_attr( $columns['tablet'] ); ?> cols-mobile-<?php echo esc_attr( $columns['mobile'] ); ?>'>
                    <?php $this->foreachPosts( $attributes, $posts ); ?>
                </div>
            <?php }else{ echo ''; } ?>
        </div>
        <?php $postsStyles::$styles = array(); // Empty styles
        return ob_get_clean();
    } // Render

    // ForEach Posts
    function foreachPosts( $attributes, $posts ){
        extract( $attributes );
        $subLayout = $subLayout ?? 'default';

        foreach ( $posts as $post ) {
            if ( 'default' === $subLayout || 'title-meta' === $subLayout ) {
                echo $this->defaultLayout( $attributes, $post );
            } else if ( 'left-image' === $subLayout || 'right-image' === $subLayout ) {
                echo $this->sideImgLayout( $attributes, $post );
            } else if ( 'overlay-content' === $subLayout || 'overlay-content-hover' === $subLayout || 'overlay-box' === $subLayout ) {
                echo $this->overlayLayout( $attributes, $post );
            } else { ?><p><?php _e( 'Please, select a sub layout', 'b-blocks' ); ?></p><?php }
        }
    }

    // layout Components
    function defaultLayout( $attributes, $post ) {
        extract( $attributes );
        $layout = $layout ?? 'grid';
        $subLayout = $subLayout ?? 'default';

        $titleMetaFilter = 'title-meta' !== $subLayout ? $this->postExcerpt( $attributes, $post ) . $this->postReadMore( $attributes, $post ) : '';

        ob_start(); ?>
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostDefault'>
            <?php echo $this->postFeatureImg( $attributes, $post ); ?>

            <div class='bBlocksPostText'>
                <?php echo $this->postTitle( $attributes, $post ) . $this->postMetaData( $attributes, $post ) . $titleMetaFilter; ?>
            </div>
        </article>
        <?php return ob_get_clean();
    } // Default

    function sideImgLayout( $attributes, $post ) {
        extract( $attributes );
        $layout = $layout ?? 'grid';
        $subLayout = $subLayout ?? 'default';

        ob_start(); ?>
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostSideImage <?php echo 'left-image' === $subLayout ? 'leftImage' : ( 'right-image' === $subLayout ? 'rightImage' : '' ); ?>'>
            <?php echo 'left-image' === $subLayout ? $this->postFeatureImg( $attributes, $post ) : ''; ?>

            <div class='bBlocksPostText'>
                <?php echo $this->postTitle( $attributes, $post ) . $this->postMetaData( $attributes, $post ) . $this->postExcerpt( $attributes, $post ) . $this->postReadMore( $attributes, $post ); ?>
            </div>

            <?php echo 'right-image' === $subLayout ? $this->postFeatureImg( $attributes, $post ) : ''; ?>
        </article>
        <?php return ob_get_clean();
    } // Side Image

    function overlayLayout( $attributes, $post ) {
        extract( $attributes );

        $imgUrl = get_the_post_thumbnail_url( $post->ID );

        ob_start(); ?>
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostOverlay <?php echo 'overlay-content-hover' === $subLayout && $imgUrl ? 'bBlocksPostOverlayHover' : ''; ?> <?php echo 'overlay-box' === $subLayout ? 'bBlocksPostOverlayBox' : ''; ?>'>
            <div class='bBlocksPostText'>
                <?php echo $this->postTitle( $attributes, $post ) . $this->postMetaData( $attributes, $post ); ?>

                <?php echo 'overlay-box' !== $subLayout ? $this->postExcerpt( $attributes, $post ) . $this->postReadMore( $attributes, $post ) : ''; ?>
            </div>
        </article>
        <?php return ob_get_clean();
    } // Overlay

    // Single Components
    function postFeatureImg( $attributes, $post ) {
        extract( $attributes );

        $imgUrl = get_the_post_thumbnail_url( $post->ID );
        $tab = $isLinkNewTab ? '_blank' : '_self';

        if( $isFImg && $imgUrl ){
            ob_start(); ?>
            <figure class='bBlocksPostFImg bBlocksPostFImg-<?php echo esc_attr( $post->ID ); ?>'>
                <?php echo $isFImgLink ? "<a href=". esc_url( get_post_permalink( $post->ID ) ) ." target='$tab' rel='noreferrer'></a>" : ''; ?>

                <?php echo $isMeta && $isMetaCategory && 'image' === $metaCategoryIn ? "<div class='bBlocksPostFImgCats'>". get_the_category_list( ' ', '', $post->ID ) ."</div>" : ''; ?>
            </figure>
        <?php return ob_get_clean();
        }else{
            return '';
        }
    } // Feature Image

    function postTitle( $attributes, $post ) {
        extract( $attributes );

        $tab = $isLinkNewTab ? '_blank' : '_self';

        if ( $isTitle ) {
            ob_start(); ?>
            <h2 class='bBlocksPostTitle'>
                <?php echo $isTitleLink ? "<a href=". esc_url( get_post_permalink( $post->ID ) ) ." target='$tab' rel='noreferrer'>$post->post_title</a>" : $post->post_title; ?>
            </h2>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Title

    function postMetaData( $attributes, $post ) {
        extract( $attributes );

        if ( $isMeta ) {
            ob_start(); ?>
            <div class='bBlocksPostMeta'>
                <?php echo $this->metaAuthor( $attributes, $post ) . $this->metaDate( $attributes, $post ) . $this->metaCategories( $attributes, $post ) . $this->metaComment( $attributes, $post ); ?>
            </div>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Meta Data

    function metaAuthor( $attributes, $post ) {
        extract( $attributes );

        if ( $isMetaAuthor ) {
            ob_start(); ?>
            <span>
                <span class='dashicons dashicons-admin-users'></span>&nbsp;
                <span><?php echo get_the_author_posts_link( $post->ID ); ?></span>
            </span>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Meta Author
    function metaDate( $attributes, $post ) {
        extract( $attributes );

        if ( $isMetaDate ) {
            ob_start(); ?>
            <span>
                <span class='dashicons dashicons-calendar'></span>&nbsp;
                <span><?php echo get_the_date( 'M j, Y', $post->ID ); ?></span>
            </span>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Meta Date
    function metaCategories( $attributes, $post ) {
        extract( $attributes );

        if ( $isMetaCategory && 'content' === $metaCategoryIn ) {
            ob_start(); ?>
            <span>
                <span class='dashicons dashicons-category'></span>&nbsp;
                <span><?php echo get_the_category_list( esc_html__( ', ' ), '', $post->ID ); ?></span>
            </span>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Meta Categories
    function metaComment( $attributes, $post ) {
        extract( $attributes );

        if ( $isMetaComment ) {
            ob_start(); ?>
            <span>
                <span class='dashicons dashicons-admin-comments'></span>&nbsp;
                <a href='<?php echo esc_url( get_post_permalink( $post->ID ) ); ?>/#comments' target='_blank' rel='noreferrer'><?php echo wp_count_comments( $post->ID )->total_comments; ?></a>
            </span>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Meta Comment

    function postExcerpt( $attributes, $post ) {
        extract( $attributes );

        if ( $isExcerpt ) {
            ob_start(); ?>
            <div class='bBlocksPostExcerpt bBlocksInnerPostContent'><?php echo implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $excerptLength ) ); ?></div>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Excerpt

    function postReadMore( $attributes, $post ) {
        extract( $attributes );

        $tab = $isLinkNewTab ? '_blank' : '_self';

        if ( $isReadMore ) {
            ob_start(); ?>
            <div class='bBlocksPostReadMore'>
                <a href='<?php echo esc_url( get_post_permalink( $post->ID ) ); ?>' target='<?php echo esc_attr( $tab ); ?>' rel='noreferrer'><?php echo esc_html( $readMoreLabel ); ?></a>
            </div>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Read More

    // Post Types
    function post_types() {
        $post_types = get_post_types( array(
            'public'       => true,
            'show_in_rest' => true,
        ), 'objects' );
    
        $options = array();
        foreach ( $post_types as $post_type ) {
            if ( 'product' === $post_type->name ) { continue; }
            if ( 'attachment' === $post_type->name ) { continue; }
            if ( 'page' === $post_type->name ) { continue; }
    
            $options[] = array(
                'value' => $post_type->name,
                'label' => $post_type->label
            );
        }
        return $options;
    } // Post Types

    function customRestAPI() {
        $post_type = $this->post_types();
        foreach ( $post_type as $key => $value ) {
            register_rest_field( $value['value'], 'wbAuthor', array(
                'get_callback'    => function ( $obj ) {
                    $author['name'] = get_the_author_meta( 'display_name', isset( $obj['author'] ) ? $obj['author'] : '' );
                    $author['link'] = get_author_posts_url( isset( $obj['author'] ) ? $obj['author'] : '' );
                    return $author;
                },
                'schema'          => array(
                    'description' => __( 'Author name and link', 'b-blocks' ),
                    'type'        => 'string',
                )
            ) );
    
            register_rest_field( $value['value'], 'wbDate', array(
                'get_callback'    => function ( $obj ) {
                    return get_the_date( 'M j, Y', $obj['id'] );
                },
                'schema'          => array(
                    'description' => __( 'Author name and link', 'b-blocks' ),
                    'type'        => 'string',
                )
            ) );
    
            register_rest_field( $value['value'], 'wbCategories', array(
                'get_callback'    => function ( $obj ) {
                    $catsLink['space'] = get_the_category_list( esc_html__( ' ' ), '', $obj['id'] );
                    $catsLink['coma'] = get_the_category_list( esc_html__( ', ' ), '', $obj['id'] );
                    return $catsLink;
                },
                'schema'          => array(
                    'description' => __( 'Category link lists', 'b-blocks' ),
                    'type'        => 'string',
                )
            ) );
    
            register_rest_field( $value['value'], 'wbComment', array(
                'get_callback'    => function ( $obj ) {
                    return wp_count_comments( $obj['id'] )->total_comments;
                },
                'schema'          => array(
                    'description' => __( 'Comment', 'b-blocks' ),
                    'type'        => 'number',
                )
            ) );
        }
    } // Custom Rest API
}
new BBlocksPosts();