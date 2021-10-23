<?php
class BBlocksPosts extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );
        add_action( 'rest_api_init', [$this, 'customRestAPI'] );
        add_filter( 'excerpt_length', [$this, 'excerptLength'], 999 );
        add_filter( 'excerpt_more', [$this, 'excerptMore'] );
    }

    function register(){
        $this::registerScripts( 'posts', array(
            'render_callback' => [$this, 'render']
        ) );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? 'wide';
        $cId = $cId ?? '';
        $layout = $layout ?? 'grid';
        $subLayout = $subLayout ?? 'default';
        $columns = $columns ?? array( 'desktop' => 3, 'tablet' => 2, 'mobile' => 1 );
        $columnGap = $columnGap ?? 15;
        $rowGap = $rowGap ?? 15;
        $isContentEqualHight = $isContentEqualHight ?? true;
        $sliderHeight = $sliderHeight ?? '350px';
        $postType = $postType ?? 'post';
        $selectedCategories = $selectedCategories ?? array();
        $isPostsPerPageAll = $isPostsPerPageAll ?? false;
        $postsPerPage = $postsPerPage ?? 12;
        $postsOrderBy = $postsOrderBy ?? 'date';
        $postsOrder = $postsOrder ?? 'desc';
        $contentAlign = $contentAlign ?? 'left';
        $contentBG = $contentBG ?? array( 'color' => '#f4f2fc' );
        $contentPadding = $contentPadding ?? array( 'vertical' => '20px', 'horizontal' => '25px' );
        $border = $border ?? array( 'radius' => '5px' );
        $sliderIsLoop = $sliderIsLoop ?? true;
        $sliderIsTouchMove = $sliderIsTouchMove ?? false;
        $sliderIsAutoplay = $sliderIsAutoplay ?? true;
        $sliderSpeed = $sliderSpeed ?? 1.5;
        $sliderEffect = $sliderEffect ?? 'slide';
        $sliderIsPage = $sliderIsPage ?? true;
        $sliderIsPageClickable = $sliderIsPageClickable ?? true;
        $sliderIsPageDynamic = $sliderIsPageDynamic ?? true;
        $sliderPageColor = $sliderPageColor ?? '#4527a4';
        $sliderPageWidth = $sliderPageWidth ?? '15px';
        $sliderPageHeight = $sliderPageHeight ?? '15px';
        $sliderPageBorder = $sliderPageBorder ?? array( 'radius' => '50%' );
        $sliderIsPrevNext = $sliderIsPrevNext ?? true;
        $sliderPrevNextColor = $sliderPrevNextColor ?? '#4527a4';
        $isFImg = $isFImg ?? true;
        $titleTypo = $titleTypo ?? array( 'fontFamily' => 'Roboto', 'fontSize' => 25, 'googleFontLink' => 'https =>//fonts.googleapis.com/css2?family=Roboto&display=swap' );
        $titleColor = $titleColor ?? '#4527a4';
        $titleMargin = $titleMargin ?? array( 'bottom' => '15px' );
        $metaTypo = $metaTypo ?? array( 'fontSize' => 13, 'textTransform' => 'uppercase' );
        $metaTextColor = $metaTextColor ?? '#333';
        $metaLinkColor = $metaLinkColor ?? '#8344c5';
        $metaIconColor = $metaIconColor ?? '#4527a4';
        $metaMargin = $metaMargin ?? array( 'bottom' => '15px' );
        $excerptAlign = $excerptAlign ?? 'justify';
        $excerptTypo = $excerptTypo ?? array( 'fontSize' => 15 );
        $excerptColor = $excerptColor ?? '#333';
        $excerptMargin = $excerptMargin ?? array( 'bottom' => '10px' );
        $readMoreAlign = $readMoreAlign ?? 'left';
        $readMoreTypo = $readMoreTypo ?? array( 'fontSize' => 14, 'textTransform' => 'uppercase', 'fontWeight' => 600 );
        $readMoreColors = $readMoreColors ?? array( 'color' => '#fff', 'bg' => '#8344c5' );
        $readMoreHovColors = $readMoreHovColors ?? array( 'color' => '#fff', 'bg' => '#4527a4' );
        $readMorePadding = $readMorePadding ?? array( 'vertical' => '12px', 'horizontal' => '35px' );
        $readMoreBorder = $readMoreBorder ?? array( 'radius' => '3px' );
        
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
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts, #bBlocksPosts-$cId .bBlocksSliderPosts .swiper-slide", array(
            'min-height' => $sliderHeight
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts .swiper-pagination .swiper-pagination-bullet", array(
            'background' => $sliderPageColor,
            'width' => $sliderPageWidth,
            'height' => $sliderPageHeight,
            $sliderPageBorder['styles'] ?? 'border-radius: 50%;' => ''
        ) );
        $postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts .swiper-button-prev, #bBlocksPosts-$cId .bBlocksSliderPosts .swiper-button-next", array(
            'color' => $sliderPrevNextColor
        ) );

        // All Posts
        $posts = get_posts( [
            'post_type'      => $postType,
            'category'       => $selectedCategories,
            'posts_per_page' => $isPostsPerPageAll ? -1 : $postsPerPage,
            'orderby'        => $postsOrderBy,
            'order'          => $postsOrder
        ] );

        $jsonData = json_encode( array( 'layout' => $layout, 'columns' => $columns, 'columnGap' => $columnGap, 'sliderIsLoop' => $sliderIsLoop ?? true, 'sliderIsTouchMove' => $sliderIsTouchMove ?? false, 'sliderIsAutoplay' => $sliderIsAutoplay ?? true, 'sliderSpeed' => $sliderSpeed ?? 1.5, 'sliderEffect' => $sliderEffect ?? 'slide', 'sliderIsPageClickable' => $sliderIsPageClickable ?? true, 'sliderIsPageDynamic' => $sliderIsPageDynamic ?? true ) );

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
            <?php }else if ( 'slider' === $layout ){ ?>
                <div class='bBlocksSliderPosts' data-slider='<?php echo esc_attr( $jsonData ); ?>'>
                    <div class='swiper-wrapper'>
                        <?php $this->foreachPosts( $attributes, $posts ); ?>
                    </div>

                    <?php echo $sliderIsPage ? "<div class='swiper-pagination'></div>" : ''; ?>
                    <?php echo $sliderIsPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : ''; ?>
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
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostDefault <?php echo 'slider' === $layout ? 'swiper-slide' : ''; ?>'>
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
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostSideImage <?php echo 'left-image' === $subLayout ? 'leftImage' : ( 'right-image' === $subLayout ? 'rightImage' : '' ); ?> <?php echo 'slider' === $layout ? 'swiper-slide' : ''; ?>'>
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
        $layout = $layout ?? 'grid';
        $subLayout = $subLayout ?? 'default';

        $imgUrl = get_the_post_thumbnail_url( $post->ID );

        ob_start(); ?>
        <article class='bBlocksPost bBlocksPost-<?php echo esc_attr( $post->ID ); ?> bBlocksPostOverlay <?php echo 'overlay-content-hover' === $subLayout && $imgUrl ? 'bBlocksPostOverlayHover' : ''; ?> <?php echo 'overlay-box' === $subLayout ? 'bBlocksPostOverlayBox' : ''; ?> <?php echo 'slider' === $layout ? 'swiper-slide' : ''; ?>'>
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
        $isFImg = $isFImg ?? true;
        $isFImgLink = $isFImgLink ?? false;
        $isMeta = $isMeta ?? true;
        $isMetaCategory = $isMetaCategory ?? true;
        $metaCategoryIn = $metaCategoryIn ?? 'content';
        $isLinkNewTab = $isLinkNewTab ?? false;

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
        $isTitle = $isTitle ?? true;
        $isTitleLink = $isTitleLink ?? true;
        $isLinkNewTab = $isLinkNewTab ?? false;

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
        $isMeta = $isMeta ?? true;

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
        $isMetaAuthor = $isMetaAuthor ?? true;

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
        $isMetaDate = $isMetaDate ?? true;

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
        $isMetaCategory = $isMetaCategory ?? true;
        $metaCategoryIn = $metaCategoryIn ?? 'content';

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
        $isMetaComment = $isMetaComment ?? false;

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
        $isExcerpt = $isExcerpt ?? true;
        $excerptLength = $excerptLength ?? 25;

        if ( $isExcerpt ) {
            ob_start(); ?>
            <div class='bBlocksPostExcerpt bBlocksInnerPostContent'><?php echo implode( ' ', array_slice( explode( ' ', get_the_excerpt( $post->ID ) ), 0, $excerptLength ) ); ?></div>
            <?php return ob_get_clean();
        } else {
            return '';
        }
    } // Excerpt

    function postReadMore( $attributes, $post ) {
        extract( $attributes );
        $isReadMore = $isReadMore ?? true;
        $readMoreLabel = $readMoreLabel ?? 'Read More';
        $isLinkNewTab = $isLinkNewTab ?? false;

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

    function excerptLength( $length ) {
        return 100;
    } // Excerpt Length
    
    function excerptMore( $more ) {
        return "<p class='read-more'><a href=". esc_url( get_permalink( get_the_ID() ) ) .">". __( 'Read More &raquo;', 'b-blocks' ) ."</a></p>";
    } // Excerpt More
}
new BBlocksPosts();