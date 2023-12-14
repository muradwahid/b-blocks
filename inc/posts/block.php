<?php

require_once B_BLOCKS_DIR_PATH . '/inc/posts/helpers/functions.php';

class BBlocksPosts extends BBlocks{
	public function __construct(){
		add_action( 'wp_ajax_bBlocksPosts', [$this, 'bBlocksPosts'] );
		add_action( 'wp_ajax_nopriv_bBlocksPosts', [$this, 'bBlocksPosts'] );

		add_action( 'init', [$this, 'onInit'] );
		add_action( 'rest_api_init', [$this, 'customRestAPI'] );
	}

	function query( $attributes ){
		extract( $attributes );

		$termsQuery = ['relation' => 'AND'];
		foreach ( $selectedTaxonomies as $taxonomy => $terms ){
			if( count( $terms ) ){
				$termsQuery[] = [
					'taxonomy'	=> $taxonomy,
					'field'		=> 'term_id',
					'terms'		=> $terms,
				];
			}
		}

		$defaultPostQuery = 'post' === $postType ? [
			'category__in'	=> $selectedCategories,
			'tag__in'		=> $selectedTags ?? []
		] : [];

		$postsInclude = BBlocks\Inc\Posts\Helpers\Functions::filterNaN( $postsInclude ?? [] );
		$post__in = !empty( $postsInclude ) ? [ 'post__in' => $postsInclude ] : [];
		$postsExclude = BBlocks\Inc\Posts\Helpers\Functions::filterNaN( $postsExclude ?? [] );

		$query = array_merge( [
			'post_type'			=> $postType,
			'posts_per_page'	=> $isPostsPerPageAll ? -1 : $postsPerPage,
			'orderby'			=> $postsOrderBy,
			'order'				=> $postsOrder,
			'tax_query'			=> $termsQuery,
			'offset'			=> $isPostsPerPageAll ? 0 : $postsOffset,
			'post__not_in'		=> $isExcludeCurrent ? array_merge( [ get_the_ID() ], $postsExclude ) : $postsExclude
		], $post__in, $defaultPostQuery );

		if( BBlocks\Inc\BBlocksUtils::isPro() ) {
			$query = apply_filters( 'b_blocks_posts_query', $query );
		}

		return $query;
	}

	function bBlocksPosts(){
		$attributes = $_POST['queryAttr'];
		$pageNumber = (int)$_POST['pageNumber'];
		extract( $attributes );

		$attributes['isPostsPerPageAll'] = 'true' === $isPostsPerPageAll;
		$attributes['isExcludeCurrent'] = 'true' === $isExcludeCurrent;

		$newArgs = wp_parse_args( [ 'offset' => ( $postsPerPage * ( $pageNumber - 1 ) ) + $postsOffset ], $this->query( $attributes ) );
		$posts = BBlocks\Inc\Posts\Helpers\Functions::arrangedPosts(
			get_posts( $newArgs ),
			$postType,
			$fImgSize,
			$metaDateFormat
		);

		wp_send_json_success( $posts );
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes ){
		extract( $attributes );

		wp_enqueue_style( 'b-blocks-posts-style' );
		if( 'ticker' === $layout ){
			wp_enqueue_script( 'easyTicker' );
		}
		wp_enqueue_script( 'b-blocks-posts-script', B_BLOCKS_DIST . 'posts.js', [ 'wp-api', 'wp-util', 'react', 'react-dom' ], B_BLOCKS_VERSION, true );
		wp_set_script_translations( 'b-blocks-posts-script', 'b-blocks', B_BLOCKS_DIR_PATH . 'languages' );

		$className = $className ?? '';
		$blockClassName = "wp-block-b-blocks-posts bBlocksPosts $className align$align";

		$allPosts = get_posts( array_merge( $this->query( $attributes ), [ 'posts_per_page' => -1 ] ) );

		ob_start(); ?>
		<div
			class='<?php echo esc_attr( $blockClassName ); ?>'
			id='bBlocksPosts-<?php echo esc_attr( $cId ); ?>'
			data-nonce='<?php echo esc_attr( wp_json_encode( wp_create_nonce( 'wp_ajax' ) ) ); ?>'
			data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
			data-extra='<?php echo esc_attr( wp_json_encode( [ 'totalPosts' => count( $allPosts ) ] ) ); ?>'
		></div>
		<?php return ob_get_clean();
	} // Render

	// ForEach Posts
	function foreachPosts( $attributes, $posts ){
		extract( $attributes );

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

	// Layout Components
	function defaultLayout( $attributes, $post ) {
		extract( $attributes );

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

		$imgUrl = get_the_post_thumbnail_url( $post->ID );
		$tab = $isLinkNewTab ? '_blank' : '_self';

		if( $isFImg && $imgUrl ){
			ob_start(); ?>
			<figure class='bBlocksPostFImg bBlocksPostFImg-<?php echo esc_attr( $post->ID ); ?>'>
				<?php echo $isFImgLink ? "<a href=". esc_url( get_permalink( $post ) ) ." target='$tab' rel='noreferrer'></a>" : ''; ?>

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
				<?php echo $isTitleLink ? "<a href=". esc_url( get_permalink( $post ) ) ." target='$tab' rel='noreferrer'>$post->post_title</a>" : $post->post_title; ?>
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
				<span class='dashicon dashicons dashicons-admin-users'></span>&nbsp;
				<span><a href='<?php echo esc_url( get_author_posts_url( $post->post_author ) ); ?>' rel="author"><?php echo esc_html( get_the_author_meta( 'display_name', $post->post_author ) ); ?></a></span>
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
				<span class='dashicon dashicons dashicons-calendar'></span>&nbsp;
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
				<span class='dashicon dashicons dashicons-category'></span>&nbsp;
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
				<span class='dashicon dashicons dashicons-admin-comments'></span>&nbsp;
				<a href='<?php echo esc_url( get_permalink( $post ) ); ?>/#comments' target='_blank' rel='noreferrer'><?php echo wp_count_comments( $post->ID )->total_comments; ?></a>
			</span>
			<?php return ob_get_clean();
		} else {
			return '';
		}
	} // Meta Comment

	function postExcerpt( $attributes, $post ) {
		extract( $attributes );

		$excerptContent = get_the_excerpt( $post->ID );

		if ( $isExcerpt ) {
			ob_start(); ?>
			<div class='bBlocksPostExcerpt bBlocksInnerPostContent'>
				<?php echo implode( ' ', array_slice(
					explode( ' ', wp_kses( preg_replace('/(<([^>]+)>)/', '', $excerptContent), [] ) ),
				0, $excerptLength ) ); ?>

				<p class='read-more'>
					<a href='<?php echo esc_url( get_permalink( $post ) ); ?>'><?php echo __( 'Read More &raquo;', 'advanced-post-block' ); ?></a>
				</p>
			</div>
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
				<a href='<?php echo esc_url( get_permalink( $post ) ); ?>' target='<?php echo esc_attr( $tab ); ?>' rel='noreferrer'><?php echo esc_html( $readMoreLabel ); ?></a>
			</div>
			<?php return ob_get_clean();
		} else {
			return '';
		}
	} // Read More

	// Post Types
	function post_types() {
		$post_types = get_post_types( [
			'public'		=> true,
			'show_in_rest'	=> true,
		], 'objects' );

		$options = [];
		foreach ( $post_types as $post_type ) {
			if ( 'product' === $post_type->name ) { continue; }
			if ( 'attachment' === $post_type->name ) { continue; }
			if ( 'page' === $post_type->name ) { continue; }

			$options[] = [
				'value' => $post_type->name,
				'label' => $post_type->label
			];
		}
		return $options;
	} // Post Types

	function customRestAPI() {
		$post_type = $this->post_types();
		foreach ( $post_type as $key => $value ) {
			register_rest_field( $value['value'], 'wbAuthor', [
				'get_callback'	=> function ( $obj ) {
					$author['name'] = get_the_author_meta( 'display_name', isset( $obj['author'] ) ? $obj['author'] : '' );
					$author['link'] = get_author_posts_url( isset( $obj['author'] ) ? $obj['author'] : '' );
					return $author;
				},
				'schema'	=> [
					'description'	=> __( 'Author name and link', 'b-blocks' ),
					'type'			=> 'string',
				]
			] );

			register_rest_field( $value['value'], 'wbDate', [
				'get_callback'	=> function ( $obj ) {
					return get_the_date( 'M j, Y', $obj['id'] );
				},
				'schema'	=> [
					'description'	=> __( 'Author name and link', 'b-blocks' ),
					'type'			=> 'string',
				]
			] );

			register_rest_field( $value['value'], 'wbCategories', [
				'get_callback'	=> function ( $obj ) {
					$catsLink['space'] = get_the_category_list( esc_html__( ' ' ), '', $obj['id'] );
					$catsLink['coma'] = get_the_category_list( esc_html__( ', ' ), '', $obj['id'] );
					return $catsLink;
				},
				'schema'	=> [
					'description'	=> __( 'Category link lists', 'b-blocks' ),
					'type'			=> 'string',
				]
			] );

			register_rest_field( $value['value'], 'wbComment', [
				'get_callback'	=> function ( $obj ) {
					return wp_count_comments( $obj['id'] )->total_comments;
				},
				'schema'	=> [
					'description'	=> __( 'Comment', 'b-blocks' ),
					'type'			=> 'number',
				]
			] );
		}
	} // Custom Rest API

	function excerptMore( $more ) {
		return "<p class='read-more'><a href=". esc_url( get_permalink( get_the_ID() ) ) .">". __( 'Read More &raquo;', 'b-blocks' ) ."</a></p>";
	} // Excerpt More
}
new BBlocksPosts();