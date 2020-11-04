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

    $selectedCategories ? $selectedCategories : $selectedCategories = [];
    $postsPerPageAll ? $postsPerPageAll : $postsPerPageAll = 'true';
    $postsPerPage || 0 === $postsPerPage ? $postsPerPage : $postsPerPage = 9;
    $postsOrderBy ? $postsOrderBy : $postsOrderBy = 'date';
    $postsOrder ? $postsOrder : $postsOrder = 'desc';

    $layout ? $layout : $layout = 'grid';
    $columns || 0 === $columns ? $columns : $columns = 3;
    $columnGap || 0 === $columnGap ? $columnGap : $columnGap = 15;
    $rowGap || 0 === $rowGap ? $rowGap : $rowGap = 30;
    $shadow ? $shadow : $shadow = 'shadow-lg';

    $contentAlign ? $contentAlign : $contentAlign = 'left';
    $contentEqualHight ? $contentEqualHight : $contentEqualHight = 'true';
    $contentBGColor ? $contentBGColor : $contentBGColor = '#fff';
    $postTextPTB || 0 === $postTextPTB ? $postTextPTB : $postTextPTB = 15;
    $postTextPLR || 0 === $postTextPLR ? $postTextPLR : $postTextPLR = 25;

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
    $readMoreAlign ? $readMoreAlign : $readMoreAlign = 'right';
    $readMoreFontSize ? $readMoreFontSize : $readMoreFontSize = 14;
    $readMoreTransform ? $readMoreTransform : $readMoreTransform = 'capitalize';
    $readMoreFontWeight ? $readMoreFontWeight : $readMoreFontWeight = '600';
    $readMorePTB || 0 === $readMorePTB ? $readMorePTB : $readMorePTB = 8;
    $readMorePLR || 0 === $readMorePLR ? $readMorePLR : $readMorePLR = 25;
    $readMoreRadius || 0 === $readMoreRadius ? $readMoreRadius : $readMoreRadius = 0;
    $readMoreTextColor ? $readMoreTextColor : $readMoreTextColor = '#fff';
    $readMoreBGColor ? $readMoreBGColor : $readMoreBGColor = '#4527a4';
    $readMoreTextHovColor ? $readMoreTextHovColor : $readMoreTextHovColor = '#fff';
    $readMoreBGHovColor ? $readMoreBGHovColor : $readMoreBGHovColor = '#8344c5';

    // All Posts
    $posts = get_posts( [
        'category'       => $selectedCategories,
        'posts_per_page' => 'true' == $postsPerPageAll ? -1 : $postsPerPage,
        'orderby'        => $postsOrderBy,
        'order'          => $postsOrder,
    ] );

    $postsDisplayProps = 'masonry' === $layout ? 'block' : 'grid';

    // print_r( $layout );

    ob_start();
    echo '<div class="b_blocks_posts" style="display: ' . $postsDisplayProps . '; columns: ' . $columns . '; grid-template-columns: repeat(' . $columns . ', 1fr); grid-gap: ' . $rowGap . 'px ' . $columnGap . 'px;">';

    foreach ( $posts as $post ) {
        // Content
        $contentHeight = 'true' == $contentEqualHight ? "100%" : "auto";
        // --

        // Feature Image
        $featureImg = 'true' == $featureImgShow ? '<div class="feature_img">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank">' . get_the_post_thumbnail( $post->ID ) . '</a>
        </div>' : '';
        // --

        // Title
        $title = 'true' == $titleShow ? '<h3 class="title" style="text-align:' . $contentAlign . '; font-size:' . $titleFontSize . 'px; color: ' . $titleColor . '; margin: 0 0 ' . $titleMB . 'px 0">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank" style="color: ' . $titleColor . ';">' . $post->post_title . '</a>
        </h3>' : '';
        // --

        // Meta Comments
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

        // Meta Data
        $metaAuthor = 'true' == $metaAuthorShow ? '<span>
            <span class="dashicons dashicons-admin-users" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaLinkColor . ';">' . get_the_author_posts_link( $post->ID ) . '</span>
        </span>' : '';

        $metaDate = 'true' == $metaDateShow ? '<span>
            <span class="dashicons dashicons-calendar" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaTextColor . ';">' . get_the_date( 'M j, Y', $post->ID ) . '</span>
        </span>' : '';

        $metaCategory = 'true' == $metaCategoryShow ? '<span>
            <span class="dashicons dashicons-category" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <span style="color: ' . $metaLinkColor . ';">' . get_the_category_list( ',&nbsp;', '', $post->ID ) . '</span>
        </span>' : '';

        $metaComment = 'true' == $metaCommentShow ? '<span>
            <span class="dashicons dashicons-admin-comments" style="color: ' . $metaIconColor . ';"></span>&nbsp;
            <a href="' . get_post_permalink( $post->ID ) . '/#comments" target="_blank" style="color: ' . $metaLinkColor . ';">' . $view_comment . '</a>
        </span>' : '';

        $metaData = 'true' == $metaShow ? '<p class="meta" style="text-align:' . $contentAlign . '; font-size:' . $metaFontSize . 'px; text-transform: ' . $metaTransform . '; color: ' . $metaTextColor . '; margin: 0 0 ' . $metaMB . 'px 0">
            ' . $metaAuthor . $metaDate . $metaCategory . $metaComment . '
        </p>' : '';
        // --

        // Excerpt
        $excerpt = 'true' == $excerptShow ? '<div class="excerpt" style="text-align:' . $excerptAlign . '; font-size:' . $excerptFontSize . 'px; color: ' . $excerptColor . '; margin: 0 0 ' . $excerptMB . 'px 0"">' . implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $excerptLength ) ) . '</div>' : '';
        // --

        // Read More
        $readMore = 'true' == $readMoreShow ? '<div class="read_more" style="text-align: ' . $readMoreAlign . '; padding: 0 ' . $postTextPLR . 'px ' . $postTextPTB . 'px ' . $postTextPLR . 'px; margin-bottom: 10px;">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank"
            style="display: inline-block; font-size:' . $readMoreFontSize . 'px; text-transform: ' . $readMoreTransform . '; font-weight: ' . $readMoreFontWeight . '; padding: ' . $readMorePTB . 'px ' . $readMorePLR . 'px; border-radius: ' . $readMoreRadius . 'px; color: ' . $readMoreTextColor . '; background-color: ' . $readMoreBGColor . '; transition: all .3s ease;"

            onMouseOver="this.style.color=\'' . $readMoreTextHovColor . '\'; this.style.backgroundColor=\'' . $readMoreBGHovColor . '\';"
            onMouseOut="this.style.color=\'' . $readMoreTextColor . '\'; this.style.backgroundColor=\'' . $readMoreBGColor . '\';">' . $readMoreLabel . '</a>
        </div>' : '';
        // --

        $articleMB = 'masonry' == $layout ? $rowGap . 'px' : '';

        echo '<article class="b_blocks_article" style="break-inside: avoid; margin-bottom: ' . $articleMB . '">
            <div class="b_blocks_article_inner_wrap ' . $shadow . ' rounded" style="display: flex; flex-direction: column; justify-content: space-between; text-align: ' . $contentAlign . '; height: ' . $contentHeight . '; background-color: ' . $contentBGColor . ';">
                <div className="post_content">
                    ' . $featureImg . '

                    <div className="post_text" style="padding: ' . $postTextPTB . 'px ' . $postTextPLR . 'px 0 ' . $postTextPLR . 'px;">
                        ' . $title . $metaData . $excerpt . '
                    </div>
                </div>

                ' . $readMore . '
            </div>
        </article>';
    }

    echo '</div>';
    return ob_get_clean();
}