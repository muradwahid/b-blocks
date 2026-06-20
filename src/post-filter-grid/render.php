<?php
/**
 * Post Filter Grid block server-side render.
 *
 * Renders a sanitized `WP_Query` post grid with an optional front-end filter
 * pill bar and an optional AJAX Load More button. Card markup is produced by the
 * shared `BBlocks\Inc\Blocks\PostFilterGrid` renderer so the initial render and
 * the AJAX swap stay byte-identical. Per-instance CSS custom properties are
 * emitted inline, scoped under a `wp_unique_id()` wrapper id, so multiple grids
 * on one page never collide. All dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\PostFilterGrid;

if ( ! class_exists( PostFilterGrid::class ) ) {
	return;
}

$prefix    = 'bBlocksPostFilterGrid';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// Bake the current post id so "exclude current" works on both render and AJAX.
$currentId = get_the_ID();
if ( $currentId ) {
	$attributes['currentPostId'] = (int) $currentId;
}

$a = PostFilterGrid::resolveAttributes( $attributes );

// Attributes sent to the AJAX endpoint (only what the query/cards need).
$ajaxAttributes = [
	'postType'           => $a['postType'],
	'postsPerPage'       => $a['postsPerPage'],
	'orderBy'            => $a['orderBy'],
	'order'              => $a['order'],
	'excludeCurrentPost' => $a['excludeCurrentPost'],
	'currentPostId'      => $a['currentPostId'],
	'filterTaxonomy'     => $a['filterTaxonomy'],
	'layout'             => $a['layout'],
	'cardStyle'          => $a['cardStyle'],
	'imageRatio'         => $a['imageRatio'],
	'showFeaturedImage'  => $a['showFeaturedImage'],
	'showCategory'       => $a['showCategory'],
	'showTitle'          => $a['showTitle'],
	'titleTag'           => $a['titleTag'],
	'titleLines'         => $a['titleLines'],
	'showExcerpt'        => $a['showExcerpt'],
	'excerptLength'      => $a['excerptLength'],
	'showMeta'           => $a['showMeta'],
	'showAuthor'         => $a['showAuthor'],
	'showDate'           => $a['showDate'],
	'showReadMore'       => $a['showReadMore'],
	'readMoreLabel'      => $a['readMoreLabel'],
	'showLoadMore'       => $a['showLoadMore'],
	'noPostsMessage'     => $a['noPostsMessage'],
];

// Initial query (page 1, default term).
$args  = PostFilterGrid::buildQueryArgs( $a, $a['defaultCategory'], 1 );
$query = new WP_Query( $args );

$maxPages    = (int) $query->max_num_pages;
$hasMore     = $a['showLoadMore'] && 1 < $maxPages;
$gridColumns = $a['layout']; // grid | masonry.

// Shadow presets.
$shadowMap = [
	'none' => 'none',
	'sm'   => '0 1px 3px rgba(15, 23, 42, 0.08)',
	'md'   => '0 4px 12px rgba(15, 23, 42, 0.1)',
	'lg'   => '0 8px 24px rgba(15, 23, 42, 0.14)',
];
$shadowValue = $shadowMap[ $a['cardShadow'] ] ?? $shadowMap['sm'];
$cardBorder  = ( 'boxed' === $a['cardStyle'] ) ? ( '1px solid ' . $a['cardBorderColor'] ) : 'none';
$titleClamp  = $a['titleLines'] > 0 ? (string) $a['titleLines'] : 'none';

// Per-instance CSS variables.
$css  = "#$id.bb-pfg{";
$css .= '--bb-pfg-cols:' . $a['columnsMobile'] . ';';
$css .= '--bb-pfg-col-gap:' . $a['columnGap'] . 'px;';
$css .= '--bb-pfg-row-gap:' . $a['rowGap'] . 'px;';
$css .= '--bb-pfg-card-bg:' . $a['cardBackground'] . ';';
$css .= '--bb-pfg-card-radius:' . $a['cardRadius'] . 'px;';
$css .= '--bb-pfg-card-border:' . $cardBorder . ';';
$css .= '--bb-pfg-card-shadow:' . $shadowValue . ';';
$css .= '--bb-pfg-img-radius:' . $a['imageRadius'] . 'px;';
$css .= '--bb-pfg-aspect:' . $a['imageRatio'] . ';';
$css .= '--bb-pfg-accent:' . $a['accentColor'] . ';';
$css .= '--bb-pfg-accent-text:' . $a['accentTextColor'] . ';';
$css .= '--bb-pfg-title-color:' . $a['titleColor'] . ';';
$css .= '--bb-pfg-title-size:' . $a['titleSizeMobile'] . 'px;';
$css .= '--bb-pfg-title-clamp:' . $titleClamp . ';';
$css .= '--bb-pfg-excerpt-color:' . $a['excerptColor'] . ';';
$css .= '--bb-pfg-meta-color:' . $a['metaColor'] . ';';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-pfg{--bb-pfg-cols:" . $a['columnsTablet'] . ';--bb-pfg-title-size:' . $a['titleSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-pfg{--bb-pfg-cols:" . $a['columnsDesktop'] . ';--bb-pfg-title-size:' . $a['titleSizeDesktop'] . 'px;}}';

// Filter terms for the pill bar.
$filterTerms = [];
if ( $a['showFilterBar'] ) {
	$terms = get_terms(
		[
			'taxonomy'   => $a['filterTaxonomy'],
			'hide_empty' => true,
			'number'     => 50,
		]
	);
	if ( ! is_wp_error( $terms ) ) {
		$filterTerms = $terms;
	}
}

$wrapperClasses = trim(
	$planClass
	. ' bb-pfg'
	. ' bb-pfg--' . $a['cardStyle']
	. ' bb-pfg--layout-' . $gridColumns
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-pfg-nonce='<?php echo esc_attr( wp_create_nonce( 'wp_ajax' ) ); ?>'
	data-bb-pfg-ajax='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
	data-bb-pfg-attributes='<?php echo esc_attr( wp_json_encode( $ajaxAttributes ) ); ?>'
	data-bb-pfg-page='1'
	data-bb-pfg-term='<?php echo esc_attr( (string) $a['defaultCategory'] ); ?>'
	data-bb-pfg-loadmore='<?php echo esc_attr( $a['showLoadMore'] ? '1' : '0' ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( $a['showFilterBar'] && ! empty( $filterTerms ) ) : ?>
		<div class='bb-pfg-filter' role='group' aria-label='<?php echo esc_attr__( 'Filter posts', 'b-blocks' ); ?>'>
			<?php if ( $a['showAllButton'] ) : ?>
				<button
					type='button'
					class='bb-pfg-filter-btn<?php echo esc_attr( ( 0 === $a['defaultCategory'] ) ? ' is-active' : '' ); ?>'
					data-term-id='0'
					aria-pressed='<?php echo esc_attr( ( 0 === $a['defaultCategory'] ) ? 'true' : 'false' ); ?>'
				>
					<?php echo esc_html( $a['allButtonLabel'] ); ?>
				</button>
			<?php endif; ?>

			<?php
			foreach ( $filterTerms as $term ) :
				$isActive = ( (int) $term->term_id === $a['defaultCategory'] );
				/* translators: %s: term name. */
				$btnLabel = sprintf( __( 'Filter by %s', 'b-blocks' ), $term->name );
				?>
				<button
					type='button'
					class='bb-pfg-filter-btn<?php echo esc_attr( $isActive ? ' is-active' : '' ); ?>'
					data-term-id='<?php echo esc_attr( (string) (int) $term->term_id ); ?>'
					aria-pressed='<?php echo esc_attr( $isActive ? 'true' : 'false' ); ?>'
					aria-label='<?php echo esc_attr( $btnLabel ); ?>'
				>
					<?php echo esc_html( $term->name ); ?>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class='bb-pfg-status' aria-live='polite' aria-atomic='true'></div>

	<div
		class='bb-pfg-grid'
		role='region'
		aria-label='<?php echo esc_attr__( 'Post grid', 'b-blocks' ); ?>'
		aria-busy='false'
	>
		<?php
		if ( $query->have_posts() ) {
			echo wp_kses_post( PostFilterGrid::renderCards( $query, $a ) );
		} else {
			echo '<p class="bb-pfg-empty">' . esc_html( $a['noPostsMessage'] ) . '</p>';
		}
		wp_reset_postdata();
		?>
	</div>

	<?php if ( $a['showLoadMore'] ) : ?>
		<div class='bb-pfg-loadmore-wrap'<?php echo $hasMore ? '' : ' style="display:none"'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hard-coded inline style literal, no user input. ?>>
			<button
				type='button'
				class='bb-pfg-load-more'
				aria-label='<?php echo esc_attr__( 'Load more posts', 'b-blocks' ); ?>'
			>
				<span class='bb-pfg-load-more-label'><?php echo esc_html( $a['loadMoreLabel'] ); ?></span>
				<span class='bb-pfg-spinner' aria-hidden='true'></span>
			</button>
		</div>
	<?php endif; ?>
</div>
