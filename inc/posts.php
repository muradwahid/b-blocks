<?php
function render_b_blocks_posts( $attributes ) {
    extract( $attributes );

    $align ?? $align = 'full';

    $selectedCategories ?? $selectedCategories = [];
    $postsPerPageAll ?? $postsPerPageAll = 'false';
    $postsPerPage ?? $postsPerPage = 12;
    $postsOrderBy ?? $postsOrderBy = 'date';
    $postsOrder ?? $postsOrder = 'desc';

    $layout ?? $layout = 'grid';
    $columns ?? $columns = 3;
    $columnGap ?? $columnGap = 10;
    $rowGap ?? $rowGap = 10;
    $contentEqualHight ?? $contentEqualHight = 'true';

    $contentAlign ?? $contentAlign = 'left';
    $contentBGColor ?? $contentBGColor = '#fff';
    $postTextPTB ?? $postTextPTB = 15;
    $postTextPLR ?? $postTextPLR = 15;
    $shadow ?? $shadow = 'shadow';

    $featureImgShow ?? $featureImgShow = 'true';

    $titleShow ?? $titleShow = 'true';
    $titleFontSize ?? $titleFontSize = 20;
    $titleColor ?? $titleColor = '#4527a4';
    $titleMB ?? $titleMB = 15;

    $metaShow ?? $metaShow = 'true';
    $metaAuthorShow ?? $metaAuthorShow = 'true';
    $metaDateShow ?? $metaDateShow = 'true';
    $metaCategoryShow ?? $metaCategoryShow = 'true';
    $metaCommentShow ?? $metaCommentShow = 'false';
    $metaFontSize ?? $metaFontSize = 13;
    $metaTransform ?? $metaTransform = 'uppercase';
    $metaTextColor ?? $metaTextColor = '#333';
    $metaLinkColor ?? $metaLinkColor = '#8344c5';
    $metaIconColor ?? $metaIconColor = '#4527a4';
    $metaMB ?? $metaMB = 15;

    $excerptShow ?? $excerptShow = 'true';
    $excerptLength ?? $excerptLength = 45;
    $excerptAlign ?? $excerptAlign = 'justify';
    $excerptFontSize ?? $excerptFontSize = 15;
    $excerptColor ?? $excerptColor = '#333';
    $excerptMB ?? $excerptMB = 15;

    $readMoreShow ?? $readMoreShow = 'true';
    $readMoreLabel ?? $readMoreLabel = 'Read More';
    $readMoreAlign ?? $readMoreAlign = 'left';
    $readMoreFontSize ?? $readMoreFontSize = 14;
    $readMoreTransform ?? $readMoreTransform = 'uppercase';
    $readMoreFontWeight ?? $readMoreFontWeight = '600';
    $readMoreColor ?? $readMoreColor = '#4527a4';
    $readMoreHovColor ?? $readMoreHovColor = '#8344c5';

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
            <span class="dashicons dashicons-calendar" style="color: ' . $iconColor . ';"></span>&nbsp;
            <span style="color: ' . $textColor . ';">' . get_the_date( 'M j, Y', $post->ID ) . '</span>
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
            $view_comment = esc_html__( 'No Comments', 'b-blocks' );
            break;
        case "1":
            $view_comment = esc_html__( '1 Comment', 'b-blocks' );
            break;
        default:
            $view_comment = esc_html__( "$comment_count Comments", 'b-blocks' );
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
        return '<div class="excerpt b_blocks_inner_content" style="text-align:' . $align . '; font-size:' . $fontSize . 'px; color: ' . $color . '; margin: 0 0 ' . $mb . 'px 0"">' . implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $length ) ) . '</div>';
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