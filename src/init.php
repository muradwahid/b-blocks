<?php

add_action( 'init', function () {
    // Custom Block Category
    function b_blocks_category( $categories ) {
        return array_merge( $categories, [
            array(
                'slug'  => 'bBlocks',
                'title' => 'B Blocks',
                'icon'  => 'wordpress-alt',
            ),
        ] );
    }
    add_filter( 'block_categories', 'b_blocks_category', 9 );

    // Register block styles for both frontend + backend.
    wp_register_style( 'b_blocks-style-css', plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), is_admin() ? array( 'wp-editor' ) : null, null );

    // Register block editor script for backend.
    wp_register_script( 'b_blocks-js', plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor', 'wp-api' ), null, true );

    // Register block editor styles for backend.
    wp_register_style( 'b_blocks-editor-css', plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), array( 'wp-edit-blocks' ), null );

    // WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
    wp_localize_script(
        'b_blocks-js',
        'cgbGlobal', // Array containing dynamic data for a JS Global.
        [
            'pluginDirPath' => plugin_dir_path( __DIR__ ),
            'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
            // Add more data here that you want to access from `cgbGlobal` object.
            'siteUrl'       => get_site_url(),
        ]
    );

    // Register Gutenberg block on server-side.
    register_block_type( 'wasek/b-blocks', array(
        'style'         => 'b_blocks-style-css',
        'editor_script' => 'b_blocks-js',
        'editor_style'  => 'b_blocks-editor-css',
    ) );

    // Posts callback
    register_block_type( 'b-blocks/posts', [
        'render_callback' => 'render_b_blocks_posts',
    ] );
} );

function render_b_blocks_posts( $attributes ) {
    extract( $attributes );

    $selectedCategories ? $selectedCategories : $selectedCategories = [];
    $postsPerPageAll ? $postsPerPageAll : $postsPerPageAll = true;
    $postsPerPage || 0 === $postsPerPage ? $postsPerPage : $postsPerPage = 9;
    $postsOrderBy ? $postsOrderBy : $postsOrderBy = 'date';
    $postsOrder ? $postsOrder : $postsOrder = 'desc';

    $columns || 0 === $columns ? $columns : $columns = 3;
    $columnGap || 0 === $columnGap ? $columnGap : $columnGap = 15;
    $rowGap || 0 === $rowGap ? $rowGap : $rowGap = 30;

    $contentAlign ? $contentAlign : $contentAlign = 'center';
    $contentEqualHight ? $contentEqualHight : $contentEqualHight = 'true';
    $contentBGColor ? $contentBGColor : $contentBGColor = '#f4f4f4';
    $postTextPTB || 0 === $postTextPTB ? $postTextPTB : $postTextPTB = 10;
    $postTextPLR || 0 === $postTextPLR ? $postTextPLR : $postTextPLR = 10;

    $featureImgShow ? $featureImgShow : $featureImgShow = 'true';

    $titleShow ? $titleShow : $titleShow = 'true';
    $titleColor ? $titleColor : $titleColor = '#006799';
    $titleMB || 0 === $titleMB ? $titleMB : $titleMB = 15;

    $metaShow ? $metaShow : $metaShow = 'true';
    $metaAuthorShow ? $metaAuthorShow : $metaAuthorShow = 'true';
    $metaDateShow ? $metaDateShow : $metaDateShow = 'true';
    $metaCategoryShow ? $metaCategoryShow : $metaCategoryShow = 'true';
    $metaCommentShow ? $metaCommentShow : $metaCommentShow = 'true';
    $metaTransform ? $metaTransform : $metaTransform = 'capitalize';
    $metaTextColor ? $metaTextColor : $metaTextColor = '#333';
    $metaLinkColor ? $metaLinkColor : $metaLinkColor = '#65a8d4';
    $metaIconColor ? $metaIconColor : $metaIconColor = '#777';
    $metaMB || 0 === $metaMB ? $metaMB : $metaMB = 15;

    $excerptShow ? $excerptShow : $excerptShow = 'true';
    $excerptLength || 0 === $excerptLength ? $excerptLength : $excerptLength = 45;
    $excerptAlign ? $excerptAlign : $excerptAlign = 'justify';
    $excerptColor ? $excerptColor : $excerptColor = '#333';
    $excerptMB || 0 === $excerptMB ? $excerptMB : $excerptMB = 15;

    $readMoreShow ? $readMoreShow : $readMoreShow = 'true';
    $readMoreLabel || '' === $readMoreLabel ? $readMoreLabel : $readMoreLabel = 'Read More';
    $readMoreAlign ? $readMoreAlign : $readMoreAlign = 'right';
    $readMoreTransform ? $readMoreTransform : $readMoreTransform = 'capitalize';
    $readMorePTB || 0 === $readMorePTB ? $readMorePTB : $readMorePTB = 10;
    $readMorePLR || 0 === $readMorePLR ? $readMorePLR : $readMorePLR = 20;
    $readMoreRadius || 0 === $readMoreRadius ? $readMoreRadius : $readMoreRadius = 3;
    $readMoreTextColor ? $readMoreTextColor : $readMoreTextColor = '#fff';
    $readMoreBGColor ? $readMoreBGColor : $readMoreBGColor = '#333';

    // All Posts
    $posts = get_posts( [
        'category'       => $selectedCategories,
        'posts_per_page' => $postsPerPageAll ? -1 : $postsPerPage,
        'orderby'        => $postsOrderBy,
        'order'          => $postsOrder,
    ] );

    ob_start();
    echo '<div class="b_blocks_posts" style="display: grid; grid-template-columns: repeat(' . $columns . ', 1fr); grid-gap: ' . $rowGap . 'px ' . $columnGap . 'px;">';

    foreach ( $posts as $post ) {
        // Content
        $contentHeight = 'true' == $contentEqualHight ? "100%" : "auto";

        // Feature Image
        $featureImg = 'true' == $featureImgShow ? '<div class="feature_img">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank">' . get_the_post_thumbnail( $post->ID ) . '</a>
        </div>' : '';

        // Title
        $title = 'true' == $titleShow ? '<h3 class="title" style="text-align:' . $contentAlign . '; font-size:' . $titleFontSize . 'px; color: ' . $titleColor . '; margin: 0 0 ' . $titleMB . 'px 0">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank" style="color: ' . $titleColor . ';">' . $post->post_title . '</a>
        </h3>' : '';

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

        // Excerpt
        $excerpt = 'true' == $excerptShow ? '<div class="excerpt" style="text-align:' . $excerptAlign . '; font-size:' . $excerptFontSize . 'px; color: ' . $excerptColor . '; margin: 0 0 ' . $excerptMB . 'px 0"">' . implode( ' ', array_slice( explode( ' ', get_post_field( 'post_content', $post->ID ) ), 0, $excerptLength ) ) . '</div>' : '';

        // Read More
        $readMore = 'true' == $readMoreShow ? '<div class="read_more" style="text-align: ' . $readMoreAlign . '; padding: 0 ' . $postTextPLR . 'px ' . $postTextPTB . 'px ' . $postTextPLR . 'px;">
            <a href="' . get_post_permalink( $post->ID ) . '" target="_blank" style="display: inline-block; font-size:' . $readMoreFontSize . 'px; text-transform: ' . $readMoreTransform . '; padding: ' . $readMorePTB . 'px ' . $readMorePLR . 'px; border-radius: ' . $readMoreRadius . 'px; color: ' . $readMoreTextColor . '; background-color: ' . $readMoreBGColor . ';"  :hover="background-color: yellow">' . $readMoreLabel . '</a>
        </div>' : '';

        echo '<article class="b_blocks_article">
            <div class="b_blocks_article_inner_wrap" style="display: flex; flex-direction: column; justify-content: space-between; text-align: ' . $contentAlign . '; height: ' . $contentHeight . '; background-color: ' . $contentBGColor . ';">
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