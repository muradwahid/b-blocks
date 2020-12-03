<?php
function b_blocks_posts_init() {
    // Posts callback
    register_block_type( 'b-blocks/posts', [
        'render_callback' => 'render_b_blocks_posts',
    ] );
}
add_action( 'init', 'b_blocks_posts_init' );

function render_b_blocks_posts( $attributes ) {
    extract( $attributes );

    $align ? $align : $align = 'full';

    $selectedCategories ? $selectedCategories : $selectedCategories = [];
    $postsPerPageAll ? $postsPerPageAll : $postsPerPageAll = 'true';
    $postsPerPage || 0 === $postsPerPage ? $postsPerPage : $postsPerPage = 9;
    $postsOrderBy ? $postsOrderBy : $postsOrderBy = 'date';
    $postsOrder ? $postsOrder : $postsOrder = 'desc';

    $layout ? $layout : $layout = 'grid';
    $columns || 0 === $columns ? $columns : $columns = 3;
    $columnGap || 0 === $columnGap ? $columnGap : $columnGap = 10;
    $rowGap || 0 === $rowGap ? $rowGap : $rowGap = 10;
    $contentEqualHight ? $contentEqualHight : $contentEqualHight = 'true';

    $contentAlign ? $contentAlign : $contentAlign = 'left';
    $contentBGColor ? $contentBGColor : $contentBGColor = '#fff';
    $postTextPTB || 0 === $postTextPTB ? $postTextPTB : $postTextPTB = 15;
    $postTextPLR || 0 === $postTextPLR ? $postTextPLR : $postTextPLR = 25;
    $shadow ? $shadow : $shadow = 'shadow';

    $featureImgShow ? $featureImgShow : $featureImgShow = 'true';

    $titleShow ? $titleShow : $titleShow = 'true';
    $titleColor ? $titleColor : $titleColor = '#4527a4';
    $titleMB || 0 === $titleMB ? $titleMB : $titleMB = 15;

    $metaShow ? $metaShow : $metaShow = 'true';
    $metaAuthorShow ? $metaAuthorShow : $metaAuthorShow = 'true';
    $metaDateShow ? $metaDateShow : $metaDateShow = 'true';
    $metaCategoryShow ? $metaCategoryShow : $metaCategoryShow = 'true';
    $metaCommentShow ? $metaCommentShow : $metaCommentShow = 'false';
    $metaFontSize ? $metaFontSize : $metaFontSize = 13;
    $metaTransform ? $metaTransform : $metaTransform = 'uppercase';
    $metaTextColor ? $metaTextColor : $metaTextColor = '#333';
    $metaLinkColor ? $metaLinkColor : $metaLinkColor = '#8344c5';
    $metaIconColor ? $metaIconColor : $metaIconColor = '#4527a4';
    $metaMB || 0 === $metaMB ? $metaMB : $metaMB = 15;

    $excerptShow ? $excerptShow : $excerptShow = 'true';
    $excerptLength || 0 === $excerptLength ? $excerptLength : $excerptLength = 45;
    $excerptAlign ? $excerptAlign : $excerptAlign = 'justify';
    $excerptColor ? $excerptColor : $excerptColor = '#333';
    $excerptMB || 0 === $excerptMB ? $excerptMB : $excerptMB = 15;

    $readMoreShow ? $readMoreShow : $readMoreShow = 'true';
    $readMoreLabel || '' === $readMoreLabel ? $readMoreLabel : $readMoreLabel = 'Read More';
    $readMoreAlign ? $readMoreAlign : $readMoreAlign = 'left';
    $readMoreFontSize ? $readMoreFontSize : $readMoreFontSize = 14;
    $readMoreTransform ? $readMoreTransform : $readMoreTransform = 'capitalize';
    $readMoreFontWeight ? $readMoreFontWeight : $readMoreFontWeight = '600';
    $readMoreColor ? $readMoreColor : $readMoreColor = '#4527a4';
    $readMoreHovColor ? $readMoreHovColor : $readMoreHovColor = '#8344c5';

    // All Posts
    $posts = get_posts( [
        'category'       => $selectedCategories,
        'posts_per_page' => 'true' == $postsPerPageAll ? -1 : $postsPerPage,
        'orderby'        => $postsOrderBy,
        'order'          => $postsOrder,
    ] );

    $alignClass = '' == $align ? '' : 'align' . $align;

    ob_start();
    echo '<div class="b_blocks_posts ' . $alignClass . '">';

    if ( 'grid' == $layout ) {
        echo '<div id="bBlocksGridPosts-' . $cId . '" class="b_blocks_grid_posts" style="display: grid; grid-template-columns: repeat(' . $columns . ', 1fr); grid-gap: ' . $rowGap . 'px ' . $columnGap . 'px;">';
        foreach ( $posts as $post ) {
            $contentHeight = 'true' == $contentEqualHight ? "100%" : "auto";

            echo '<article class="b_blocks_article">
                <div class="post_content ' . $shadow . ' rounded" style="text-align: ' . $contentAlign . '; height: ' . $contentHeight . '; background-color: ' . $contentBGColor . ';">
                    ' . bBlocksPostFeatureImg( $featureImgShow, $post ) . '

                    <div class="post_text" style="padding: ' . $postTextPTB . 'px ' . $postTextPLR . 'px;">
                        ' . bBlocksPostTitle( $titleShow, $post, $contentAlign, $titleFontSize, $titleColor, $titleMB ) . bBlocksPostMetaData( $metaShow, $post, $metaAuthorShow, $metaDateShow, $metaCategoryShow, $metaCommentShow, $contentAlign, $metaFontSize, $metaTransform, $metaTextColor, $metaLinkColor, $metaIconColor, $metaMB ) . bBlocksPostExcerpt( $excerptShow, $post, $excerptAlign, $excerptFontSize, $excerptColor, $excerptMB, $excerptLength ) . bBlocksPostReadMore( $readMoreShow, $post, $readMoreAlign, $readMoreFontSize, $readMoreTransform, $readMoreFontWeight, $readMoreColor, $readMoreHovColor, $readMoreLabel ) . '
                    </div>
                </div>
            </article>';
        }
        echo '</div>';

    } else if ( 'masonry' == $layout ) {
        echo '<div id="bBlocksMasonryPosts-' . $cId . '" class="b_blocks_masonry_posts" style="columns: ' . $columns . '; gap: ' . $columnGap . 'px;">';
        foreach ( $posts as $post ) {
            echo '<article class="b_blocks_article" style="break-inside: avoid; margin-bottom: ' . $rowGap . 'px;">
                <div class="post_content ' . $shadow . ' rounded" style="text-align: ' . $contentAlign . '; background-color: ' . $contentBGColor . ';">
                    ' . bBlocksPostFeatureImg( $featureImgShow, $post ) . '

                    <div class="post_text" style="padding: ' . $postTextPTB . 'px ' . $postTextPLR . 'px;">
                        ' . bBlocksPostTitle( $titleShow, $post, $contentAlign, $titleFontSize, $titleColor, $titleMB ) . bBlocksPostMetaData( $metaShow, $post, $metaAuthorShow, $metaDateShow, $metaCategoryShow, $metaCommentShow, $contentAlign, $metaFontSize, $metaTransform, $metaTextColor, $metaLinkColor, $metaIconColor, $metaMB ) . bBlocksPostExcerpt( $excerptShow, $post, $excerptAlign, $excerptFontSize, $excerptColor, $excerptMB, $excerptLength ) . bBlocksPostReadMore( $readMoreShow, $post, $readMoreAlign, $readMoreFontSize, $readMoreTransform, $readMoreFontWeight, $readMoreColor, $readMoreHovColor, $readMoreLabel ) . '
                    </div>
                </div>
            </article>';
        }
        echo '</div>';
    } else {
        echo '';
    }

    echo '</div>';
    return ob_get_clean();
}

// Components
// Feature Image
function bBlocksPostFeatureImg( $show, $post ) {
    if ( 'true' == $show ) {
        return '<div class="feature_img">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank">' . get_the_post_thumbnail( $post->ID ) . '</a>
        </div>';
    } else {
        return '';
    }
}

// Title
function bBlocksPostTitle( $show, $post, $align, $fontSize, $color, $mb ) {
    if ( 'true' == $show ) {
        return '<h3 class="title" style="text-align:' . $align . '; font-size:' . $fontSize . 'px; color: ' . $color . '; margin: 0 0 ' . $mb . 'px 0">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank" style="color: ' . $color . ';">' . $post->post_title . '</a>
        </h3>';
    } else {
        return '';
    }
}

// Meta Data
function bBlocksPostMetaData( $show, $post, $authorShow, $dateShow, $categoryShow, $commentShow, $align, $fontSize, $transform, $textColor, $linkColor, $iconColor, $mb ) {
    if ( 'true' == $show ) {
        return '<p class="meta" style="text-align:' . $align . '; font-size:' . $fontSize . 'px; text-transform: ' . $transform . '; color: ' . $textColor . '; margin: 0 0 ' . $mb . 'px 0">
            ' . bBlocksPostMetaAuthor( $authorShow, $post, $iconColor, $linkColor ) . bBlocksPostMetaDate( $dateShow, $post, $iconColor, $textColor ) . bBlocksPostMetaCategory( $categoryShow, $post, $iconColor, $linkColor ) . bBlocksPostMetaComment( $commentShow, $post, $iconColor, $linkColor ) . '
        </p>';
    } else {
        return '';
    }
}

function bBlocksPostMetaAuthor( $show, $post, $iconColor, $linkColor ) {
    if ( 'true' == $show ) {
        return '<span>
            <span class="dashicons dashicons-admin-users" style="color: ' . $iconColor . ';"></span>&nbsp;
            <span style="color: ' . $linkColor . ';">' . get_the_author_posts_link( $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksPostMetaDate( $show, $post, $iconColor, $textColor ) {
    if ( 'true' == $show ) {
        return '<span>
            <span class="dashicons dashicons-calendar" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaTextColor . ';">' . get_the_date( 'M j, Y', $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksPostMetaCategory( $show, $post, $iconColor, $linkColor ) {
    if ( 'true' == $show ) {
        return '<span>
            <span class="dashicons dashicons-category" style="color: ' . $iconColor . ';"></span>&nbsp;
            <span style="color: ' . $linkColor . ';">' . get_the_category_list( ',&nbsp;', '', $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksPostMetaComment( $show, $post, $iconColor, $linkColor ) {
    if ( 'true' == $show ) {
        $comment_count = get_comments( array( 'post_id' => $post->ID, 'count' => true ) );
        $view_comment = '';
        switch ( $comment_count ) {
        case "0":
            $view_comment = "No Comments";
            break;
        case "1":
            $view_comment = "1 Comment";
            break;
        default:
            $view_comment = "$comment_count Comments";
        }

        return '<span>
            <span class="dashicons dashicons-admin-comments" style="color: ' . $iconColor . ';"></span>&nbsp;
            <a href="' . get_post_permalink( $post->ID ) . '/#comments" target="_blank" style="color: ' . $linkColor . ';">' . $view_comment . '</a>
        </span>';
    } else {
        return '';
    }
}

// Excerpt
function bBlocksPostExcerpt( $show, $post, $align, $fontSize, $color, $mb, $length ) {
    if ( 'true' == $show ) {
        return '<div class="excerpt" style="text-align:' . $align . '; font-size:' . $fontSize . 'px; color: ' . $color . '; margin: 0 0 ' . $mb . 'px 0"">' . implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $length ) ) . '</div>';
    } else {
        return '';
    }
}

// Read More
function bBlocksPostReadMore( $show, $post, $align, $fontSize, $transform, $fontWeight, $color, $hovColor, $label ) {
    if ( 'true' == $show ) {
        return '<div class="read_more" style="text-align: ' . $align . ';">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank"
            style="display: inline-block; font-size:' . $fontSize . 'px; text-transform: ' . $transform . '; font-weight: ' . $fontWeight . '; color: ' . $color . '; transition: all .3s ease;"

            onMouseOver="this.style.color=\'' . $hovColor . '\';"
            onMouseOut="this.style.color=\'' . $color . '\';">' . $label . '</a>
        </div>';
    } else {
        return '';
    }
}