<?php
class BBlocksPosts extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
		add_action( 'rest_api_init', [$this, 'customRestAPI'] );
		add_filter( 'excerpt_more', [$this, 'excerptMore'] );
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes ){
		extract( $attributes );

		// $taxonomies = get_object_taxonomies( $postType, 'array' );
		// foreach( $taxonomies as $tax ){
		// 	if( $tax->hierarchical ){
		// 		$terms = get_terms( $tax->name, [
		// 			'orderby'		=> 'term_id', 
		// 			'order'			=> 'ASC',
		// 			'hide_empty'	=> true, 
		// 		) );
		// 	}
		// }

		// Generate Styles
		$postsStyles = new BBlocksStyleGenerator();
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost", [
			'margin-bottom' => 'masonry' === $layout ? $rowGap.'px' : '0px',
			$border['styles'] ?? 'border-radius: 5px;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPostDefault, #bBlocksPosts-$cId .bBlocksPostSideImage", [
			'text-align' => $contentAlign,
			$contentBG['styles'] ?? 'background-color: #f4f2fc;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostText", [
			'padding' => $contentPadding['styles'] ?? '20px 25px'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPostOverlay .bBlocksPostText", [
			$contentBG['styles'] ?? 'background-color: #f4f2fc;' => '',
			'align-items' => 'left' === $contentAlign ? 'flex-start' : ( 'right' === $contentAlign ? 'flex-end' : ( 'center' === $contentAlign ? 'center' : 'stretch' ) )
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostTitle", [
			'text-align' => $contentAlign,
			$titleTypo['styles'] ?? 'font-size: 25px;' => '',
			'color' => $titleColor,
			'margin' => $titleMargin['styles'] ?? '0 0 15px 0'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostTitle a", [ 'color' => $titleColor ] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta", [
			'text-align' => $contentAlign,
			$metaTypo['styles'] ?? 'font-size: 13px; text-transform: uppercase;' => '',
			'color' => $metaTextColor,
			'margin' => $metaMargin['styles'] ?? '0 0 15px 0'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta a", [
			'color' => $metaLinkColor
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostMeta .dashicons", [
			'color' => $metaIconColor
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostFImgCats", [
			$metaTypo['styles'] ?? 'font-size: 13px; text-transform: uppercase;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostFImgCats a", [
			$metaColorsOnImage['styles'] ?? 'color: #fff; background: #4527a4;' => '',
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostExcerpt", [
			'text-align' => $excerptAlign,
			$excerptTypo['styles'] ?? 'font-size: 15px;' => '',
			'color' => $excerptColor,
			'margin' => $excerptMargin['styles'] ?? '0 0 10px 0'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore", [
			'text-align' => $readMoreAlign
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore a", [
			$readMoreTypo['styles'] ?? 'font-size: 14px; text-transform: uppercase; font-weight: 600;' => '',
			$readMoreColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
			'padding' => $readMorePadding['styles'] ?? '12px 35px',
			$readMoreBorder['styles'] ?? 'border-radius: 3px;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksPost .bBlocksPostReadMore a:hover", [
			$readMoreHovColors['styles'] ?? 'color: #fff; background: #4527a4;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksGridPosts", [
			'grid-gap' => $rowGap .'px '. $columnGap .'px',
			'align-items' => false === $isContentEqualHight ? 'start' : 'initial'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksMasonryPosts", [
			'gap' => $columnGap . 'px'
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts, #bBlocksPosts-$cId .bBlocksSliderPosts .swiper-slide", [
			'min-height' => $sliderHeight
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts .swiper-pagination .swiper-pagination-bullet", [
			'background' => $sliderPageColor,
			'width' => $sliderPageWidth,
			'height' => $sliderPageHeight,
			$sliderPageBorder['styles'] ?? 'border-radius: 50%;' => ''
		] );
		$postsStyles::addStyle( "#bBlocksPosts-$cId .bBlocksSliderPosts .swiper-button-prev, #bBlocksPosts-$cId .bBlocksSliderPosts .swiper-button-next", [
			'color' => $sliderPrevNextColor
		] );

		// All Posts
		$defaultPostFilter = 'post' === $postType ? [
			'category' => $selectedCategories
		] : [];

		$posts = get_posts( array_merge( [
			'post_type'			=> $postType,
			'posts_per_page'	=> $isPostsPerPageAll ? -1 : $postsPerPage,
			'orderby'			=> $postsOrderBy,
			'order'				=> $postsOrder
		], $defaultPostFilter ) );

		$sliderJsonData = wp_json_encode( [ 'layout' => $layout, 'columns' => $columns, 'columnGap' => $columnGap, 'sliderIsLoop' => $sliderIsLoop, 'sliderIsTouchMove' => $sliderIsTouchMove, 'sliderIsAutoplay' => $sliderIsAutoplay, 'sliderSpeed' => $sliderSpeed, 'sliderEffect' => $sliderEffect, 'sliderIsPageClickable' => $sliderIsPageClickable, 'sliderIsPageDynamic' => $sliderIsPageDynamic ] );

		ob_start(); ?>
		<div class='wp-block-b-blocks-posts bBlocksPosts <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocksPosts-<?php echo esc_attr( $cId ); ?>'>
			<style>
				@import url( <?php echo esc_url( $titleTypo['googleFontLink'] ?? 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' ); ?> );
				@import url( <?php echo esc_url( $metaTypo['googleFontLink'] ?? '' ); ?> );
				@import url( <?php echo esc_url( $excerptTypo['googleFontLink'] ?? '' ); ?> );
				@import url( <?php echo esc_url( $readMoreTypo['googleFontLink'] ?? '' ); ?> );
				<?php echo wp_kses( $postsStyles::renderStyle(), [] ); ?>

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
				<div class='bBlocksSliderPosts' data-slider='<?php echo esc_attr( $sliderJsonData ); ?>'>
					<div class='swiper-wrapper'>
						<?php $this->foreachPosts( $attributes, $posts ); ?>
					</div>

					<?php echo $sliderIsPage ? "<div class='swiper-pagination'></div>" : ''; ?>
					<?php echo $sliderIsPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : ''; ?>
				</div>
			<?php }else if ( 'ticker' === $layout ){ ?>
				<div class='bBlocksTickerPosts' data-ticker='<?php echo esc_attr( wp_json_encode( [ 'rowGap' => $rowGap ] ) ); ?>'>
					<div>
						<?php $this->foreachPosts( $attributes, $posts ); ?>
					</div>
				</div>
			<?php }else{ echo ''; } ?>
		</div>
		<?php $postsStyles::$styles = []; // Empty styles
		return ob_get_clean();
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
				<span class='dashicons dashicons-admin-users'></span>&nbsp;
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

		if ( $isMetaComment ) {
			ob_start(); ?>
			<span>
				<span class='dashicons dashicons-admin-comments'></span>&nbsp;
				<a href='<?php echo esc_url( get_permalink( $post ) ); ?>/#comments' target='_blank' rel='noreferrer'><?php echo wp_count_comments( $post->ID )->total_comments; ?></a>
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
			<div class='bBlocksPostExcerpt bBlocksInnerPostContent'><?php echo implode( ' ', array_slice( explode( ' ', get_the_excerpt( $post->ID ) ), 0, $excerptLength ) ); ?></div>
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