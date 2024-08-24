<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

require_once B_BLOCKS_DIR_PATH . '/inc/posts/helpers/functions.php';

class BBlocksPosts extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );

		add_filter( 'b_blocks_posts_excerpt_filter', function( $plainText, $htmlContent ){
			return $htmlContent;
		}, 10, 3 );
	}

	function query( $attributes ){
		extract( $attributes );

		$selectedCategories = $selectedCategories ?? [];
		$selectedTaxonomies = $selectedTaxonomies ?? [];

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
			'post__not_in'		=> $isExcludeCurrent ? array_merge( [ get_the_ID() ], $postsExclude ) : $postsExclude,
			'has_password'		=> false,
			'post_status'		=> 'publish'
		], $post__in, $defaultPostQuery );

		if( BBlocks\Inc\BBlocksUtils::isPro() ) {
			$query = apply_filters( 'b_blocks_posts_query', $query );
		}

		return $query;
	}

	function getPosts( $attributes, $pageNumber = 1 ){
		extract( $attributes );

		$attributes['isPostsPerPageAll'] = 'true' === $isPostsPerPageAll;
		$attributes['isExcludeCurrent'] = 'true' === $isExcludeCurrent;

		$newArgs = wp_parse_args( [ 'offset' => ( $postsPerPage * ( $pageNumber - 1 ) ) + $postsOffset ], $this->query( $attributes ) );
		$posts = BBlocks\Inc\Posts\Helpers\Functions::arrangedPosts(
			get_posts( $newArgs ),
			$postType,
			$fImgSize,
			$metaDateFormat,
			$excerptLength
		);

		return $posts;
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
		$planClass = BBlocks\Inc\BBlocksUtils::isPro() ? 'pro' : 'free';
		$blockClassName = "wp-block-b-blocks-posts bBlocksPosts $className $planClass align$align";

		$allPosts = get_posts( array_merge( $this->query( $attributes ), [ 'posts_per_page' => -1 ] ) );

		$skeletonAllowedTags = [
			'style'		=> [],
			'div'		=> [ 'class' => [], 'id' => [] ],
			'article'	=> [ 'class' => [] ],
			'span'		=> [ 'class' => [] ],
		];

		$id = wp_unique_id( 'bBlocksPosts-' );

		ob_start(); ?>
		<div
			class='<?php echo esc_attr( $blockClassName ); ?>'
			id='<?php echo esc_attr( $id ); ?>'
			data-nonce='<?php echo esc_attr( wp_json_encode( wp_create_nonce( 'wp_ajax' ) ) ); ?>'
			data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
			data-extra='<?php echo esc_attr( wp_json_encode( [ 'totalPosts' => count( $allPosts ) ] ) ); ?>'
		>
			<pre id='firstPosts' style='display: none;'>
				<?php echo esc_html( wp_json_encode( $this->getPosts( $attributes ) ) ) ?>
			</pre>

			<?php echo wp_kses( $this->loadingPlaceholder( $attributes ), $skeletonAllowedTags ); ?>
		</div>
		<?php return ob_get_clean();
	} // Render

	function skeletonArticle(){
		ob_start(); ?>
			<article class='bBlocksPost'>
				<span class='bBlocksLoadingItem bBlocksThumb'></span>
				
				<div class='bBlocksText'>
					<div class='bBlocksTitle'>
						<span class='bBlocksLoadingItem'></span>
						<span class='bBlocksLoadingItem'></span>
					</div>
					<div class='bBlocksMeta'>
						<span class='bBlocksLoadingItem'></span>
					</div>
					<div class='bBlocksExcerpt'>
						<span class='bBlocksLoadingItem'></span>
						<span class='bBlocksLoadingItem'></span>
						<span class='bBlocksLoadingItem'></span>
						<span class='bBlocksLoadingItem'></span>
					</div>
					<div class='bBlocksReadMore'>
						<span class='bBlocksLoadingItem'></span>
					</div>
				</div>
			</article>
		<?php return ob_get_clean();
	}

	function loadingPlaceholder( $attributes ){
		extract( $attributes );
		$posts = $this->getPosts( $attributes );

		$colD = $columns['desktop'];
		$colT = $columns['tablet'];
		$colM = $columns['mobile'];
		$gridClass = "bBlocksGridPosts columns-$colD columns-tablet-$colT columns-mobile-$colM";

		$placeholderId = wp_unique_id( 'bBlocksLoadingPlaceholder-' );

		$sliderStyles = "#$placeholderId .bBlocksSliderSkeleton article{
			min-height: $sliderHeight;
		}";

		ob_start(); ?>
			<div class='bBlocksLoadingPlaceholder' id='<?php echo esc_attr( $placeholderId ); ?>'>
				<?php switch ( $layout ) {
					case 'grid1': ?>
						<div class='bBlocksGrid1Posts'>
							<?php foreach ( range( 1, count( $posts ) ) as $item ) {
								echo $this->skeletonArticle();
							} ?>
						</div>
					<?php break;
					case 'slider': ?>
						<style>
							<?php echo esc_html( $sliderStyles ); ?>
						</style>
						<div class='bBlocksSliderSkeleton'>
							<div class='swiper-wrapper'>
								<?php foreach ( range( 1, 2 ) as $item ) {
									echo $this->skeletonArticle();
								} ?>
							</div>
							<?php echo $sliderIsPage ? "<div class='swiper-pagination'></div>" : ''; ?>
							<?php echo $sliderIsPrevNext ? "<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>" : ''; ?>
						</div>
					<?php break;
					case 'ticker': ?>
						<div class='bBlocksTickerPosts'>
							<?php foreach ( range( 1, $tickerVisible ) as $item ) {
								echo $this->skeletonArticle();
							} ?>
						</div>
					<?php break;
					default: ?>
						<div class='<?php echo esc_attr( $gridClass ); ?>'>
							<?php foreach ( range( 1, count( $posts ) ) as $item ) {
								echo $this->skeletonArticle();
							} ?>
						</div>
					<?php break;
				} ?>
			</div>
		<?php return ob_get_clean();
	}
}
new BBlocksPosts();

if( BBlocks\Inc\BBlocksUtils::isPro() ){
	require_once B_BLOCKS_DIR_PATH . '/inc/posts/Ajax.php';
}