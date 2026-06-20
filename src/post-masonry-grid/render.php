<?php
/**
 * Post Masonry Grid block server-side render.
 *
 * Renders a sanitized `WP_Query` masonry post grid (pure CSS `column-count`, no
 * JS layout engine) with an optional client-side category filter pill bar and an
 * optional AJAX Load More button. Card markup is produced by the shared
 * `BBlocks\Inc\Blocks\PostMasonryGrid` renderer so the initial render and the
 * AJAX appended cards stay byte-identical. Per-instance CSS custom properties are
 * emitted inline, scoped under a `wp_unique_id()` wrapper id, so multiple grids
 * on one page never collide. All dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\PostMasonryGrid;

if ( ! class_exists( PostMasonryGrid::class ) ) {
	return;
}

$prefix = 'bBlocksPostMasonryGrid';
$id     = wp_unique_id( "$prefix-" );

$a = PostMasonryGrid::resolveAttributes( $attributes );

// Attributes sent to the AJAX endpoint (only what the query/cards need).
$ajaxAttributes = [
	'postType'      => $a['postType'],
	'postsPerPage'  => $a['loadMoreStep'],
	'orderBy'       => $a['orderBy'],
	'order'         => $a['order'],
	'categoryIds'   => $a['categoryIds'],
	'tagIds'        => $a['tagIds'],
	'excludeIds'    => $a['excludeIds'],
	'cardStyle'     => $a['cardStyle'],
	'imageRatio'    => $a['imageRatio'],
	'imageSize'     => $a['imageSize'],
	'showExcerpt'   => $a['showExcerpt'],
	'excerptLength' => $a['excerptLength'],
	'showDate'      => $a['showDate'],
	'showAuthor'    => $a['showAuthor'],
	'showCategory'  => $a['showCategory'],
	'showReadMore'  => $a['showReadMore'],
	'readMoreLabel' => $a['readMoreLabel'],
	'noPostsText'   => $a['noPostsText'],
];

// Initial query (page 1).
$args  = PostMasonryGrid::buildQueryArgs( $a, 1 );
$query = new WP_Query( $args );

$maxPages = (int) $query->max_num_pages;
$hasMore  = $a['loadMoreEnabled'] && 1 < $maxPages;

// Shadow presets.
$shadowMap   = [
	'none'   => 'none',
	'small'  => '0 1px 3px rgba(15, 23, 42, 0.08)',
	'medium' => '0 4px 12px rgba(15, 23, 42, 0.1)',
	'large'  => '0 8px 24px rgba(15, 23, 42, 0.14)',
];
$shadowValue = $shadowMap[ $a['cardShadow'] ] ?? $shadowMap['small'];

$aspectCss        = PostMasonryGrid::ratioToCss( $a['imageRatio'] );
$filterActiveBg   = '' !== $a['filterActiveBg'] ? $a['filterActiveBg'] : $a['accentColor'];
$loadMoreBg       = '' !== $a['loadMoreBg'] ? $a['loadMoreBg'] : $a['accentColor'];
$filterAlignMap   = [
	'left'   => 'flex-start',
	'center' => 'center',
	'right'  => 'flex-end',
];
$filterJustify    = $filterAlignMap[ $a['filterBarAlignment'] ] ?? 'flex-start';
$pillRadius       = $a['filterPillRadius'] >= 9999 ? '9999px' : ( $a['filterPillRadius'] . 'px' );

// Block margin for max-width alignment.
$blockMargin = 'initial';
if ( $a['maxWidth'] > 0 ) {
	if ( 'center' === $a['align'] ) {
		$blockMargin = '0 auto';
	} elseif ( 'right' === $a['align'] ) {
		$blockMargin = '0 0 0 auto';
	} else {
		$blockMargin = '0 auto 0 0';
	}
}

// Per-instance CSS variables.
$css  = "#$id.bb-pmg{";
$css .= '--bb-pmg-cols:' . $a['colsMobile'] . ';';
$css .= '--bb-pmg-gap:' . $a['gap'] . 'px;';
$css .= '--bb-pmg-card-bg:' . $a['cardBg'] . ';';
$css .= '--bb-pmg-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-pmg-card-shadow:' . $shadowValue . ';';
$css .= '--bb-pmg-aspect:' . $aspectCss . ';';
$css .= '--bb-pmg-accent:' . $a['accentColor'] . ';';
$css .= '--bb-pmg-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-pmg-title-size:' . $a['titleFontSize'] . 'px;';
$css .= '--bb-pmg-title-weight:' . $a['titleFontWeight'] . ';';
$css .= '--bb-pmg-meta-color:' . $a['metaColor'] . ';';
$css .= '--bb-pmg-meta-size:' . $a['metaFontSize'] . 'px;';
$css .= '--bb-pmg-excerpt-color:' . $a['excerptColor'] . ';';
$css .= '--bb-pmg-excerpt-size:' . $a['excerptFontSize'] . 'px;';
$css .= '--bb-pmg-overlay:' . $a['overlayColor'] . ';';
$css .= '--bb-pmg-filter-gap:' . $a['filterBarGap'] . 'px;';
$css .= '--bb-pmg-filter-justify:' . $filterJustify . ';';
$css .= '--bb-pmg-pill-radius:' . $pillRadius . ';';
$css .= '--bb-pmg-filter-active-bg:' . $filterActiveBg . ';';
$css .= '--bb-pmg-filter-active-text:' . $a['filterActiveText'] . ';';
$css .= '--bb-pmg-filter-inactive-bg:' . $a['filterInactiveBg'] . ';';
$css .= '--bb-pmg-filter-inactive-text:' . $a['filterInactiveText'] . ';';
$css .= '--bb-pmg-loadmore-bg:' . $loadMoreBg . ';';
$css .= '--bb-pmg-loadmore-text:' . $a['loadMoreText'] . ';';
$css .= '--bb-pmg-loadmore-radius:' . $a['loadMoreRadius'] . 'px;';
if ( $a['maxWidth'] > 0 ) {
	$css .= 'max-width:' . $a['maxWidth'] . 'px;';
	$css .= 'margin:' . $blockMargin . ';';
}
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-pmg{--bb-pmg-cols:" . $a['colsTablet'] . ';}}';
$css .= "@media (min-width:1024px){#$id.bb-pmg{--bb-pmg-cols:" . $a['colsDesktop'] . ';}}';

// Filter terms for the pill bar.
$filterTerms = [];
if ( $a['filterEnabled'] ) {
	$termArgs = [
		'taxonomy'   => 'category',
		'hide_empty' => true,
		'number'     => 50,
	];
	if ( ! empty( $a['categoryIds'] ) ) {
		$termArgs['include'] = $a['categoryIds'];
	}
	$terms = get_terms( $termArgs );
	if ( ! is_wp_error( $terms ) ) {
		$filterTerms = $terms;
	}
}

$wrapperClasses = trim( 'bb-pmg bb-pmg--' . $a['cardStyle'] );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-pmg-nonce='<?php echo esc_attr( wp_create_nonce( 'wp_ajax' ) ); ?>'
	data-bb-pmg-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
	data-bb-pmg-attributes='<?php echo esc_attr( wp_json_encode( $ajaxAttributes ) ); ?>'
	data-bb-pmg-page='1'
	data-bb-pmg-loadmore='<?php echo esc_attr( $a['loadMoreEnabled'] ? '1' : '0' ); ?>'
	data-bb-pmg-step='<?php echo esc_attr( (string) $a['loadMoreStep'] ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $a['filterEnabled'] && ! empty( $filterTerms ) ) : ?>
		<div class='bb-pmg-filter' role='toolbar' aria-label='<?php echo esc_attr__( 'Filter posts by category', 'b-blocks' ); ?>'>
			<button
				type='button'
				class='bb-pmg-filter-btn is-active'
				data-bb-pmg-filter='all'
				aria-pressed='true'
			>
				<?php echo esc_html( $a['filterLabel'] ); ?>
			</button>

			<?php
			foreach ( $filterTerms as $term ) :
				/* translators: %s: term name. */
				$btnLabel = sprintf( __( 'Filter by %s', 'b-blocks' ), $term->name );
				?>
				<button
					type='button'
					class='bb-pmg-filter-btn'
					data-bb-pmg-filter='<?php echo esc_attr( $term->slug ); ?>'
					aria-pressed='false'
					aria-label='<?php echo esc_attr( $btnLabel ); ?>'
				>
					<?php echo esc_html( $term->name ); ?>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class='bb-pmg-status' aria-live='polite' aria-atomic='true'></div>

	<?php $hasCards = $query->have_posts(); ?>
	<ul
		class='bb-pmg-grid'
		role='list'
		aria-label='<?php echo esc_attr__( 'Posts', 'b-blocks' ); ?>'
		aria-busy='false'
	>
		<?php
		if ( $hasCards ) {
			echo wp_kses_post( PostMasonryGrid::renderCards( $query, $a ) );
		}
		wp_reset_postdata();
		?>
	</ul>

	<p class='bb-pmg-empty'<?php echo $hasCards ? ' hidden' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- literal attribute, no user input. ?>>
		<?php echo esc_html( $a['noPostsText'] ); ?>
	</p>

	<?php if ( $a['loadMoreEnabled'] ) : ?>
		<div class='bb-pmg-loadmore-wrap'<?php echo $hasMore ? '' : ' style="display:none"'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hard-coded inline style literal, no user input. ?>>
			<button
				type='button'
				class='bb-pmg-load-more'
				aria-label='<?php echo esc_attr__( 'Load more posts', 'b-blocks' ); ?>'
			>
				<span class='bb-pmg-load-more-label'><?php echo esc_html( $a['loadMoreLabel'] ); ?></span>
				<span class='bb-pmg-spinner' aria-hidden='true'></span>
			</button>
		</div>
	<?php endif; ?>
</div>
