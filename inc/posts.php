<?php
function render_b_blocks_posts( $attributes ) {
    extract( $attributes );

    $align = isset( $align ) ? $align : 'wide';
    $cId = isset( $cId ) ? $cId : '';

    $layout = isset( $layout ) ? $layout : 'grid';
    $columns = isset( $columns ) ? $columns : array(
        'desktop' => 3,
        'tablet'  => 2,
        'mobile'  => 1,
    );
    $columnGap = isset( $columnGap ) ? $columnGap : 15;
    $rowGap = isset( $rowGap ) ? $rowGap : 15;
    $isContentEqualHight = isset( $isContentEqualHight ) ? $isContentEqualHight : 'true';

    $selectedCategories = isset( $selectedCategories ) ? $selectedCategories : [];
    $isPostsPerPageAll = isset( $isPostsPerPageAll ) ? $isPostsPerPageAll : 'false';
    $postsPerPage = isset( $postsPerPage ) ? $postsPerPage : 12;
    $postsOrderBy = isset( $postsOrderBy ) ? $postsOrderBy : 'date';
    $postsOrder = isset( $postsOrder ) ? $postsOrder : 'desc';

    // $contentAlign = isset( $contentAlign ) ? $contentAlign : 'left';
    // $contentBGColor = isset( $contentBGColor ) ? $contentBGColor : '#f4f2fc';
    // $postTextPTB = isset( $postTextPTB ) ? $postTextPTB : 20;
    // $postTextPLR = isset( $postTextPLR ) ? $postTextPLR : 20;
    // $borderColor = isset( $borderColor ) ? $borderColor : '#4427a500';

    // $isFImg = isset( $isFImg ) ? $isFImg : 'true';
    // $isFImgLink = isset( $isFImgLink ) ? $isFImgLink : 'false';

    // $isTitle = isset( $isTitle ) ? $isTitle : 'true';
    // $isTitleLink = isset( $isTitleLink ) ? $isTitleLink : 'true';
    // $titleFontSize = isset( $titleFontSize ) ? $titleFontSize : 25;
    // $titleColor = isset( $titleColor ) ? $titleColor : '#4527a4';
    // $titleMB = isset( $titleMB ) ? $titleMB : 15;

    // $isMeta = isset( $isMeta ) ? $isMeta : 'true';
    // $isMetaAuthor = isset( $isMetaAuthor ) ? $isMetaAuthor : 'true';
    // $isMetaDate = isset( $isMetaDate ) ? $isMetaDate : 'true';
    // $isMetaCategory = isset( $isMetaCategory ) ? $isMetaCategory : 'true';
    // $metaCategoryIn = isset( $metaCategoryIn ) ? $metaCategoryIn : 'content';
    // $isMetaComment = isset( $isMetaComment ) ? $isMetaComment : 'false';
    // $metaFontSize = isset( $metaFontSize ) ? $metaFontSize : 13;
    // $metaTransform = isset( $metaTransform ) ? $metaTransform : 'uppercase';
    // $metaTextColor = isset( $metaTextColor ) ? $metaTextColor : '#333';
    // $metaLinkColor = isset( $metaLinkColor ) ? $metaLinkColor : '#8344c5';
    // $metaIconColor = isset( $metaIconColor ) ? $metaIconColor : '#4527a4';
    // $metaMB = isset( $metaMB ) ? $metaMB : 15;

    // $isExcerpt = isset( $isExcerpt ) ? $isExcerpt : 'true';
    // $excerptLength = isset( $excerptLength ) ? $excerptLength : 25;
    // $excerptAlign = isset( $excerptAlign ) ? $excerptAlign : 'justify';
    // $excerptFontSize = isset( $excerptFontSize ) ? $excerptFontSize : 15;
    // $excerptColor = isset( $excerptColor ) ? $excerptColor : '#333';
    // $excerptMB = isset( $excerptMB ) ? $excerptMB : 10;

    // $isReadMore = isset( $isReadMore ) ? $isReadMore : 'true';
    // $readMoreLabel = isset( $readMoreLabel ) ? $readMoreLabel : 'Read More';
    // $isLinkNewTab = isset( $isLinkNewTab ) ? $isLinkNewTab : 'false';
    // $readMoreAlign = isset( $readMoreAlign ) ? $readMoreAlign : 'left';
    // $readMoreFontSize = isset( $readMoreFontSize ) ? $readMoreFontSize : 14;
    // $readMoreTransform = isset( $readMoreTransform ) ? $readMoreTransform : 'uppercase';
    // $readMoreColor = isset( $readMoreColor ) ? $readMoreColor : '#4527a4';
    // $readMoreHovColor = isset( $readMoreHovColor ) ? $readMoreHovColor : '#8344c5';

    // All Posts
    $posts = get_posts( [
        'post_type'      => 'post',
        'category'       => $selectedCategories,
        'posts_per_page' => 'true' == $isPostsPerPageAll ? -1 : $postsPerPage,
        'orderby'        => $postsOrderBy,
        'order'          => $postsOrder,
    ] );

    $alignClass = '' == $align ? '' : 'align' . $align;

    ob_start();
    echo '<div class="bBlocksPosts ' . $alignClass . '">';

    if ( 'grid' == $layout ) {
        $alignItems = 'false' == $isContentEqualHight ? 'start' : 'initial';

        $gridClasses = 'bBlocksGridPosts columns-' . $columns['desktop'] . ' columns-tablet-' . $columns['tablet'] . ' columns-mobile-' . $columns['mobile'] . ' cGap-' . $columnGap . ' rGap-' . $rowGap . ' alignItems-' . $alignItems;

        echo '<div class="' . $gridClasses . '" id="bBlocksGridPosts-' . $cId . '">';
        foreach ( $posts as $post ) {echo bBlocksLDefault( $attributes, $post );}
        echo '</div>';

    } else if ( 'masonry' == $layout ) {
        $masonryClasses = 'bBlocksMasonryPosts cols-' . $columns['desktop'] . ' cols-tablet-' . $columns['tablet'] . ' cols-mobile-' . $columns['mobile'] . ' gap-' . $columnGap;

        echo '<div class="' . $masonryClasses . '" id="bBlocksMasonryPosts-' . $cId . '">';
        foreach ( $posts as $post ) {echo bBlocksLDefault( $attributes, $post );}
        echo '</div>';
    } else {
        echo '';
    }

    echo '</div>';
    return ob_get_clean();
}

// layout Components
// Default
function bBlocksLDefault( $attributes, $post ) {
    extract( $attributes );
    $layout = isset( $layout ) ? $layout : 'grid';
    $rowGap = isset( $rowGap ) ? $rowGap : 15;
    $contentAlign = isset( $contentAlign ) ? $contentAlign : 'left';
    $contentBGColor = isset( $contentBGColor ) ? $contentBGColor : '#f4f2fc';
    $postTextPTB = isset( $postTextPTB ) ? $postTextPTB : 20;
    $postTextPLR = isset( $postTextPLR ) ? $postTextPLR : 20;
    $borderColor = isset( $borderColor ) ? $borderColor : '#4527a500';

    $articleMB = 'masonry' == $layout ? $rowGap : 0;

    return '<article class="bBlocksPostArticle text-' . $contentAlign . ' mb-' . $articleMB . '" style="background-color: ' . $contentBGColor . '; border: 1px solid ' . $borderColor . ';">
        ' . bBlocksSFeatureImg( $attributes, $post ) . '

        <div class="bBlocksPostText ptb-' . $postTextPTB . ' plr-' . $postTextPLR . '">
        ' . bBlocksSTitle( $attributes, $post ) . bBlocksSMetaData( $attributes, $post ) . bBlocksSExcerpt( $attributes, $post ) . bBlocksSReadMore( $attributes, $post ) . '
        </div>
    </article>';
}

// Single Components
// Feature Image
function bBlocksSFeatureImg( $attributes, $post ) {
    extract( $attributes );
    $isFImg = isset( $isFImg ) ? $isFImg : 'true';
    $isFImgLink = isset( $isFImgLink ) ? $isFImgLink : 'false';
    $isMeta = isset( $isMeta ) ? $isMeta : 'true';
    $isMetaCategory = isset( $isMetaCategory ) ? $isMetaCategory : 'true';
    $metaCategoryIn = isset( $metaCategoryIn ) ? $metaCategoryIn : 'content';
    $metaFontSize = isset( $metaFontSize ) ? $metaFontSize : 13;
    $metaTransform = isset( $metaTransform ) ? $metaTransform : 'uppercase';
    $isLinkNewTab = isset( $isLinkNewTab ) ? $isLinkNewTab : 'false';

    if ( 'true' == $isFImg ) {
        $imgUrl = get_the_post_thumbnail_url( $post->ID );

        $tab = 'true' == $isLinkNewTab ? '_blank' : '_self';

        $link = 'true' == $isFImgLink ? '<a href="' . get_post_permalink( $post->ID ) . '" target="' . $tab . '" rel="noreferrer noopener"></a>' : '';

        $catsInImg = 'true' === $isMeta && 'true' === $isMetaCategory && 'image' == $metaCategoryIn ? '<div class="bBlocksPostFImgCats fontSize-' . $metaFontSize . ' ttr-' . $metaTransform . '">' . get_the_category_list( esc_html__( ' ' ), '', $post->ID ) . '</div>' : '';

        return $imgUrl ? '<figure class="bBlocksPostFImg" style="background-image: url(' . $imgUrl . ');">' . $link . $catsInImg . '</figure>' : '';
    } else {
        return '';
    }
}

// Title
function bBlocksSTitle( $attributes, $post ) {
    extract( $attributes );
    $contentAlign = isset( $contentAlign ) ? $contentAlign : 'left';
    $isTitle = isset( $isTitle ) ? $isTitle : 'true';
    $isTitleLink = isset( $isTitleLink ) ? $isTitleLink : 'true';
    $titleFontSize = isset( $titleFontSize ) ? $titleFontSize : 25;
    $titleColor = isset( $titleColor ) ? $titleColor : '#4527a4';
    $titleMB = isset( $titleMB ) ? $titleMB : 15;
    $isLinkNewTab = isset( $isLinkNewTab ) ? $isLinkNewTab : 'false';

    if ( 'true' == $isTitle ) {
        $tab = 'true' == $isLinkNewTab ? '_blank' : '_self';

        $title = 'true' == $isTitleLink ? '<a href="' . get_post_permalink( $post->ID ) . '" target="' . $tab . '" rel="noreferrer noopener" style="color: ' . $titleColor . ';">' . $post->post_title . '</a>' : $post->post_title;

        return '<h2 class="bBlocksPostTitle text-' . $contentAlign . ' fontSize-' . $titleFontSize . ' mb-' . $titleMB . '" style="color: ' . $titleColor . ';">' . $title . '</h2>';
    } else {
        return '';
    }
}

// Meta Data
function bBlocksSMetaData( $attributes, $post ) {
    extract( $attributes );
    $contentAlign = isset( $contentAlign ) ? $contentAlign : 'left';
    $isMeta = isset( $isMeta ) ? $isMeta : 'true';
    $metaFontSize = isset( $metaFontSize ) ? $metaFontSize : 13;
    $metaTransform = isset( $metaTransform ) ? $metaTransform : 'uppercase';
    $metaTextColor = isset( $metaTextColor ) ? $metaTextColor : '#333';
    $metaMB = isset( $metaMB ) ? $metaMB : 15;

    if ( 'true' == $isMeta ) {
        return '<div class="bBlocksPostMeta text-' . $contentAlign . ' fontSize-' . $metaFontSize . ' ttr-' . $metaTransform . ' mb-' . $metaMB . '" style="color: ' . $metaTextColor . ';">
            ' . bBlocksSMetaAuthor( $attributes, $post )
        . bBlocksSMetaDate( $attributes, $post )
        . bBlocksSMetaCategory( $attributes, $post )
        . bBlocksSMetaComment( $attributes, $post ) . '
        </div>';
    } else {
        return '';
    }
}

function bBlocksSMetaAuthor( $attributes, $post ) {
    extract( $attributes );
    $isMetaAuthor = isset( $isMetaAuthor ) ? $isMetaAuthor : 'true';
    $metaLinkColor = isset( $metaLinkColor ) ? $metaLinkColor : '#8344c5';
    $metaIconColor = isset( $metaIconColor ) ? $metaIconColor : '#4527a4';

    if ( 'true' == $isMetaAuthor ) {
        return '<span>
            <span class="dashicons dashicons-admin-users" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaLinkColor . ';">' . get_the_author_posts_link( $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksSMetaDate( $attributes, $post ) {
    extract( $attributes );
    $isMetaDate = isset( $isMetaDate ) ? $isMetaDate : 'true';
    $metaTextColor = isset( $metaTextColor ) ? $metaTextColor : '#333';
    $metaIconColor = isset( $metaIconColor ) ? $metaIconColor : '#4527a4';

    if ( 'true' == $isMetaDate ) {
        return '<span>
            <span class="dashicons dashicons-calendar-alt" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaTextColor . ';">' . get_the_date( 'M j, Y', $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksSMetaCategory( $attributes, $post ) {
    extract( $attributes );
    $isMetaCategory = isset( $isMetaCategory ) ? $isMetaCategory : 'true';
    $metaCategoryIn = isset( $metaCategoryIn ) ? $metaCategoryIn : 'content';
    $metaLinkColor = isset( $metaLinkColor ) ? $metaLinkColor : '#8344c5';
    $metaIconColor = isset( $metaIconColor ) ? $metaIconColor : '#4527a4';

    if ( 'true' == $isMetaCategory && 'content' == $metaCategoryIn ) {
        return '<span>
            <span class="dashicons dashicons-category" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaLinkColor . ';">' . get_the_category_list( esc_html__( ', ' ), '', $post->ID ) . '</span>
        </span>';
    } else {
        return '';
    }
}
function bBlocksSMetaComment( $attributes, $post ) {
    extract( $attributes );
    $isMetaComment = isset( $isMetaComment ) ? $isMetaComment : 'false';
    $metaLinkColor = isset( $metaLinkColor ) ? $metaLinkColor : '#8344c5';
    $metaIconColor = isset( $metaIconColor ) ? $metaIconColor : '#4527a4';

    if ( 'true' == $isMetaComment ) {
        $comment_count = get_comments( array( 'post_id' => $post->ID, 'count' => true ) );
        return '<span>
            <span class="dashicons dashicons-admin-comments alignSelf-flex-end" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <a href="' . get_post_permalink( $post->ID ) . '/#comments" target="_blank" rel="noreferrer noopener" style="color: ' . $metaLinkColor . ';">' . wp_count_comments( $post->ID )->total_comments . '</a>
        </span>';
    } else {
        return '';
    }
}

// Excerpt
function bBlocksSExcerpt( $attributes, $post ) {
    extract( $attributes );
    $isExcerpt = isset( $isExcerpt ) ? $isExcerpt : 'true';
    $excerptLength = isset( $excerptLength ) ? $excerptLength : 25;
    $excerptAlign = isset( $excerptAlign ) ? $excerptAlign : 'justify';
    $excerptFontSize = isset( $excerptFontSize ) ? $excerptFontSize : 15;
    $excerptColor = isset( $excerptColor ) ? $excerptColor : '#333';
    $excerptMB = isset( $excerptMB ) ? $excerptMB : 10;

    if ( 'true' == $isExcerpt ) {
        return '<div class="bBlocksPostExcerpt b_blocks_inner_content text-' . $excerptAlign . ' fontSize-' . $excerptFontSize . ' mb-' . $excerptMB . '" style="color: ' . $excerptColor . ';">' . implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $excerptLength ) ) . '</div>';
    } else {
        return '';
    }
}

// Read More
function bBlocksSReadMore( $attributes, $post ) {
    extract( $attributes );
    $isReadMore = isset( $isReadMore ) ? $isReadMore : 'true';
    $readMoreLabel = isset( $readMoreLabel ) ? $readMoreLabel : 'Read More';
    $isLinkNewTab = isset( $isLinkNewTab ) ? $isLinkNewTab : 'false';
    $readMoreAlign = isset( $readMoreAlign ) ? $readMoreAlign : 'left';
    $readMoreFontSize = isset( $readMoreFontSize ) ? $readMoreFontSize : 14;
    $readMoreTransform = isset( $readMoreTransform ) ? $readMoreTransform : 'uppercase';
    $readMoreColor = isset( $readMoreColor ) ? $readMoreColor : '#4527a4';
    $readMoreHovColor = isset( $readMoreHovColor ) ? $readMoreHovColor : '#8344c5';

    if ( 'true' == $isReadMore ) {
        $tab = 'true' == $isLinkNewTab ? '_blank' : '_self';

        return '<div class="bBlocksPostReadMore text-' . $readMoreAlign . '">
            <a href="' . get_post_permalink( $post->ID ) . '" class="fontSize-' . $readMoreFontSize . ' ttr-' . $readMoreTransform . '" target="' . $tab . '" rel="noreferrer noopener" style="color: ' . $readMoreColor . ';"

            onMouseOver="this.style.color=\'' . $readMoreHovColor . '\';"
            onMouseOut="this.style.color=\'' . $readMoreColor . '\';">' . $readMoreLabel . '</a>
        </div>';
    } else {
        return '';
    }
}