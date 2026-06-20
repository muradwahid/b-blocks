<?php
/**
 * Post Filter Grid — shared server logic.
 *
 * Provides attribute sanitization, query building, card markup rendering, and a
 * hardened `admin-ajax.php` endpoint (`bb_pfg_query`) used by the frontend
 * `view.js` to swap cards on filter / Load More. The same card renderer is used
 * by `render.php` (initial server render) and by the AJAX handler so markup is
 * identical and escaping lives in exactly one place.
 *
 * Security model for `bb_pfg_query`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - All inputs sanitized: post_type (sanitize_key + post_type_exists),
 *     taxonomy (sanitize_key + taxonomy_exists), term IDs (absint),
 *     paged (absint), orderby/order (strict allowlists).
 *   - All output escaped (esc_html / esc_url / esc_attr / wp_kses_post).
 *   - Responses use wp_send_json_success / wp_send_json_error; wp_reset_postdata().
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PostFilterGrid {

	/**
	 * Allowed orderby values.
	 *
	 * @var string[]
	 */
	const ORDERBY = [ 'date', 'title', 'rand', 'menu_order' ];

	/**
	 * Allowed order values (uppercased).
	 *
	 * @var string[]
	 */
	const ORDER = [ 'ASC', 'DESC' ];

	/**
	 * Allowed aspect ratios.
	 *
	 * @var string[]
	 */
	const RATIOS = [ '16/9', '4/3', '1/1', '3/2' ];

	/**
	 * Allowed title tags.
	 *
	 * @var string[]
	 */
	const TITLE_TAGS = [ 'h2', 'h3', 'h4' ];

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_pfg_query', [ $this, 'ajaxQuery' ] );
		add_action( 'wp_ajax_nopriv_bb_pfg_query', [ $this, 'ajaxQuery' ] );
	}

	/* ----------------------------------------------------------------------
	 * Sanitizers
	 * ------------------------------------------------------------------- */

	/**
	 * Sanitize a CSS color value (hex, rgb/hsl, var(), or a CSS keyword).
	 *
	 * @param mixed  $color    Raw color.
	 * @param string $fallback Fallback when invalid.
	 * @return string
	 */
	public static function sanitizeColor( $color, $fallback = '' ) {
		$color = trim( (string) $color );
		if ( '' === $color ) {
			return $fallback;
		}
		if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
			return $color;
		}
		if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
			return $color;
		}
		return $fallback;
	}

	/**
	 * Clamp a value to an integer range.
	 *
	 * @param mixed $value    Raw value.
	 * @param int   $min      Minimum.
	 * @param int   $max      Maximum.
	 * @param int   $fallback Fallback when non-numeric.
	 * @return int
	 */
	public static function clampInt( $value, $min, $max, $fallback ) {
		if ( ! is_numeric( $value ) ) {
			return (int) $fallback;
		}
		$value = (int) $value;
		if ( $value < $min ) {
			return (int) $min;
		}
		if ( $value > $max ) {
			return (int) $max;
		}
		return $value;
	}

	/**
	 * Pick a value from an allowlist.
	 *
	 * @param mixed    $value    Raw value.
	 * @param string[] $allowed  Allowed values.
	 * @param string   $fallback Fallback.
	 * @return string
	 */
	public static function pickFrom( $value, array $allowed, $fallback ) {
		$value = is_string( $value ) ? trim( $value ) : '';
		return in_array( $value, $allowed, true ) ? $value : $fallback;
	}

	/**
	 * Normalize and sanitize the full attribute set into a safe, typed array.
	 *
	 * @param array $attributes Raw block attributes.
	 * @return array
	 */
	public static function resolveAttributes( array $attributes ) {
		$postTypeRaw = isset( $attributes['postType'] ) ? sanitize_key( (string) $attributes['postType'] ) : 'post';
		$postType    = post_type_exists( $postTypeRaw ) ? $postTypeRaw : 'post';

		$taxonomyRaw = isset( $attributes['filterTaxonomy'] ) ? sanitize_key( (string) $attributes['filterTaxonomy'] ) : 'category';
		$taxonomy    = taxonomy_exists( $taxonomyRaw ) ? $taxonomyRaw : 'category';

		$columns        = (array) ( $attributes['columns'] ?? [] );
		$titleFont      = (array) ( $attributes['titleFontSize'] ?? [] );

		$readMoreLabel  = isset( $attributes['readMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['readMoreLabel'] ) : '';
		$readMoreLabel  = '' !== trim( $readMoreLabel ) ? $readMoreLabel : __( 'Read More', 'b-blocks' );

		$loadMoreLabel  = isset( $attributes['loadMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['loadMoreLabel'] ) : '';
		$loadMoreLabel  = '' !== trim( $loadMoreLabel ) ? $loadMoreLabel : __( 'Load More', 'b-blocks' );

		$allButtonLabel = isset( $attributes['allButtonLabel'] ) ? wp_strip_all_tags( (string) $attributes['allButtonLabel'] ) : '';
		$allButtonLabel = '' !== trim( $allButtonLabel ) ? $allButtonLabel : __( 'All', 'b-blocks' );

		$noPostsMessage = isset( $attributes['noPostsMessage'] ) ? wp_strip_all_tags( (string) $attributes['noPostsMessage'] ) : '';
		$noPostsMessage = '' !== trim( $noPostsMessage ) ? $noPostsMessage : __( 'No posts found.', 'b-blocks' );

		return [
			'postType'           => $postType,
			'postsPerPage'       => self::clampInt( $attributes['postsPerPage'] ?? 6, 1, 24, 6 ),
			'defaultCategory'    => absint( $attributes['defaultCategory'] ?? 0 ),
			'orderBy'            => self::pickFrom( $attributes['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'              => self::pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'desc' ) ), self::ORDER, 'DESC' ),
			'excludeCurrentPost' => ! empty( $attributes['excludeCurrentPost'] ),
			'currentPostId'      => isset( $attributes['currentPostId'] ) ? absint( $attributes['currentPostId'] ) : 0,

			'showFilterBar'      => ! isset( $attributes['showFilterBar'] ) || (bool) $attributes['showFilterBar'],
			'filterTaxonomy'     => $taxonomy,
			'showAllButton'      => ! isset( $attributes['showAllButton'] ) || (bool) $attributes['showAllButton'],
			'allButtonLabel'     => $allButtonLabel,

			'layout'             => self::pickFrom( $attributes['layout'] ?? 'grid', [ 'grid', 'masonry' ], 'grid' ),
			'columnsDesktop'     => self::clampInt( $columns['desktop'] ?? 3, 1, 6, 3 ),
			'columnsTablet'      => self::clampInt( $columns['tablet'] ?? 2, 1, 4, 2 ),
			'columnsMobile'      => self::clampInt( $columns['mobile'] ?? 1, 1, 2, 1 ),
			'columnGap'          => self::clampInt( $attributes['columnGap'] ?? 24, 0, 80, 24 ),
			'rowGap'             => self::clampInt( $attributes['rowGap'] ?? 24, 0, 80, 24 ),

			'cardStyle'          => self::pickFrom( $attributes['cardStyle'] ?? 'boxed', [ 'boxed', 'flat' ], 'boxed' ),
			'cardRadius'         => self::clampInt( $attributes['cardRadius'] ?? 8, 0, 32, 8 ),
			'cardBackground'     => self::sanitizeColor( $attributes['cardBackground'] ?? '', '#ffffff' ),
			'cardBorderColor'    => self::sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e5e7eb' ),
			'cardShadow'         => self::pickFrom( $attributes['cardShadow'] ?? 'sm', [ 'none', 'sm', 'md', 'lg' ], 'sm' ),

			'showFeaturedImage'  => ! isset( $attributes['showFeaturedImage'] ) || (bool) $attributes['showFeaturedImage'],
			'imageRatio'         => self::pickFrom( $attributes['imageRatio'] ?? '16/9', self::RATIOS, '16/9' ),
			'imageRadius'        => self::clampInt( $attributes['imageRadius'] ?? 8, 0, 32, 8 ),

			'showCategory'       => ! isset( $attributes['showCategory'] ) || (bool) $attributes['showCategory'],
			'showTitle'          => ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'],
			'titleTag'           => self::pickFrom( $attributes['titleTag'] ?? 'h3', self::TITLE_TAGS, 'h3' ),
			'titleLines'         => self::clampInt( $attributes['titleLines'] ?? 0, 0, 4, 0 ),

			'showExcerpt'        => ! isset( $attributes['showExcerpt'] ) || (bool) $attributes['showExcerpt'],
			'excerptLength'      => self::clampInt( $attributes['excerptLength'] ?? 20, 5, 50, 20 ),
			'showMeta'           => ! isset( $attributes['showMeta'] ) || (bool) $attributes['showMeta'],
			'showAuthor'         => ! isset( $attributes['showAuthor'] ) || (bool) $attributes['showAuthor'],
			'showDate'           => ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'],
			'showReadMore'       => ! isset( $attributes['showReadMore'] ) || (bool) $attributes['showReadMore'],
			'readMoreLabel'      => $readMoreLabel,

			'showLoadMore'       => ! empty( $attributes['showLoadMore'] ),
			'loadMoreLabel'      => $loadMoreLabel,
			'noPostsMessage'     => $noPostsMessage,

			'accentColor'        => self::sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' ),
			'accentTextColor'    => self::sanitizeColor( $attributes['accentTextColor'] ?? '', '#ffffff' ),
			'titleColor'         => self::sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' ),
			'excerptColor'       => self::sanitizeColor( $attributes['excerptColor'] ?? '', 'inherit' ),
			'metaColor'          => self::sanitizeColor( $attributes['metaColor'] ?? '', 'inherit' ),

			'titleSizeDesktop'   => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['desktop'] ?? '18' ) ), 12, 48, 18 ),
			'titleSizeTablet'    => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['tablet'] ?? '17' ) ), 12, 40, 17 ),
			'titleSizeMobile'    => self::clampInt( preg_replace( '/[^0-9]/', '', (string) ( $titleFont['mobile'] ?? '16' ) ), 12, 36, 16 ),
		];
	}

	/* ----------------------------------------------------------------------
	 * Query
	 * ------------------------------------------------------------------- */

	/**
	 * Build sanitized WP_Query args.
	 *
	 * @param array $a      Resolved attributes.
	 * @param int   $termId Term ID to filter by (0 = none).
	 * @param int   $paged  Page number (1-based).
	 * @return array
	 */
	public static function buildQueryArgs( array $a, $termId, $paged ) {
		$termId = absint( $termId );
		$paged  = max( 1, absint( $paged ) );

		$args = [
			'post_type'           => $a['postType'],
			'posts_per_page'      => $a['postsPerPage'],
			'paged'               => $paged,
			'post_status'         => 'publish',
			'orderby'             => $a['orderBy'],
			'order'               => $a['order'],
			'has_password'        => false,
			'ignore_sticky_posts' => true,
		];

		if ( $a['excludeCurrentPost'] && $a['currentPostId'] > 0 ) {
			$args['post__not_in'] = [ $a['currentPostId'] ];
		}

		if ( $termId > 0 && taxonomy_exists( $a['filterTaxonomy'] ) ) {
			$args['tax_query'] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				[
					'taxonomy' => $a['filterTaxonomy'],
					'field'    => 'term_id',
					'terms'    => [ $termId ],
				],
			];
		}

		return $args;
	}

	/* ----------------------------------------------------------------------
	 * Card rendering
	 * ------------------------------------------------------------------- */

	/**
	 * Render the cards for a query as an escaped HTML fragment.
	 *
	 * @param \WP_Query $query The query.
	 * @param array     $a     Resolved attributes.
	 * @return string Escaped HTML.
	 */
	public static function renderCards( $query, array $a ) {
		ob_start();

		while ( $query->have_posts() ) :
			$query->the_post();
			$postId    = get_the_ID();
			$permalink = get_permalink( $postId );
			$titleText = get_the_title( $postId );

			// Featured image.
			$imageUrl = '';
			$imageAlt = '';
			if ( $a['showFeaturedImage'] && has_post_thumbnail( $postId ) ) {
				$thumbUrl = get_the_post_thumbnail_url( $postId, 'large' );
				if ( $thumbUrl ) {
					$imageUrl = $thumbUrl;
					$thumbId  = get_post_thumbnail_id( $postId );
					if ( $thumbId ) {
						$metaAlt = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
						if ( is_string( $metaAlt ) ) {
							$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
						}
					}
					if ( '' === $imageAlt ) {
						$imageAlt = $titleText;
					}
				}
			}

			// Primary term from the filter taxonomy.
			$termName = '';
			$termLink = '';
			if ( $a['showCategory'] ) {
				$terms = get_the_terms( $postId, $a['filterTaxonomy'] );
				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					$firstTerm = $terms[0];
					$termName  = $firstTerm->name;
					$link      = get_term_link( $firstTerm );
					if ( ! is_wp_error( $link ) ) {
						$termLink = $link;
					}
				}
			}

			// Excerpt.
			$excerptText = '';
			if ( $a['showExcerpt'] ) {
				$excerptText = wp_trim_words( get_the_excerpt( $postId ), $a['excerptLength'], '&hellip;' );
			}
			?>
			<article class='bb-pfg-card'>
				<?php if ( '' !== $imageUrl ) : ?>
					<a class='bb-pfg-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
						<img class='bb-pfg-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
					</a>
				<?php endif; ?>

				<div class='bb-pfg-card-body'>
					<?php if ( $a['showCategory'] && '' !== $termName ) : ?>
						<?php
						$badgeLabel = sprintf(
							/* translators: %s: term name. */
							__( 'Category: %s', 'b-blocks' ),
							$termName
						);
						if ( '' !== $termLink ) :
							?>
							<a class='bb-pfg-badge' href='<?php echo esc_url( $termLink ); ?>' aria-label='<?php echo esc_attr( $badgeLabel ); ?>'>
								<?php echo esc_html( $termName ); ?>
							</a>
						<?php else : ?>
							<span class='bb-pfg-badge' aria-label='<?php echo esc_attr( $badgeLabel ); ?>'>
								<?php echo esc_html( $termName ); ?>
							</span>
						<?php endif; ?>
					<?php endif; ?>

					<?php if ( $a['showTitle'] && '' !== $titleText ) : ?>
						<<?php echo esc_attr( $a['titleTag'] ); ?> class='bb-pfg-title'>
							<a class='bb-pfg-title-link' href='<?php echo esc_url( $permalink ); ?>'>
								<?php echo esc_html( $titleText ); ?>
							</a>
						</<?php echo esc_attr( $a['titleTag'] ); ?>>
					<?php endif; ?>

					<?php if ( $a['showMeta'] && ( $a['showAuthor'] || $a['showDate'] ) ) : ?>
						<div class='bb-pfg-meta'>
							<?php if ( $a['showAuthor'] ) : ?>
								<span class='bb-pfg-meta-author'>
									<span class='screen-reader-text'><?php echo esc_html__( 'Author:', 'b-blocks' ); ?> </span>
									<?php echo esc_html( get_the_author_meta( 'display_name', (int) get_post_field( 'post_author', $postId ) ) ); ?>
								</span>
							<?php endif; ?>
							<?php if ( $a['showAuthor'] && $a['showDate'] ) : ?>
								<span class='bb-pfg-meta-sep' aria-hidden='true'>&middot;</span>
							<?php endif; ?>
							<?php if ( $a['showDate'] ) : ?>
								<time class='bb-pfg-meta-date' datetime='<?php echo esc_attr( get_the_date( 'c', $postId ) ); ?>'>
									<?php echo esc_html( get_the_date( '', $postId ) ); ?>
								</time>
							<?php endif; ?>
						</div>
					<?php endif; ?>

					<?php if ( $a['showExcerpt'] && '' !== $excerptText ) : ?>
						<p class='bb-pfg-excerpt'><?php echo wp_kses_post( $excerptText ); ?></p>
					<?php endif; ?>

					<?php if ( $a['showReadMore'] ) : ?>
						<a class='bb-pfg-readmore' href='<?php echo esc_url( $permalink ); ?>'>
							<?php echo esc_html( $a['readMoreLabel'] ); ?>
							<span class='screen-reader-text'> &mdash; <?php echo esc_html( $titleText ); ?></span>
						</a>
					<?php endif; ?>
				</div>
			</article>
			<?php
		endwhile;

		return ob_get_clean();
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoint
	 * ------------------------------------------------------------------- */

	/**
	 * Handle the `bb_pfg_query` AJAX request (filter / Load More).
	 *
	 * Returns JSON: { html, page, hasMore, count }.
	 */
	public function ajaxQuery() {
		// Nonce — shared plugin action handle. Dies with 403 on failure.
		check_ajax_referer( 'wp_ajax', 'nonce' );

		$raw = isset( $_POST['attributes'] ) ? wp_unslash( $_POST['attributes'] ) : ''; // phpcs:ignore WordPress.Security.ValidationSanitization.MissingUnslash, WordPress.Security.ValidationSanitization.InputNotSanitized -- JSON decoded then each field individually sanitized in resolveAttributes().
		$attributes = is_string( $raw ) ? json_decode( $raw, true ) : [];
		if ( ! is_array( $attributes ) ) {
			$attributes = [];
		}

		$a = self::resolveAttributes( $attributes );

		$termId = isset( $_POST['termId'] ) ? absint( wp_unslash( $_POST['termId'] ) ) : 0;
		$paged  = isset( $_POST['paged'] ) ? max( 1, absint( wp_unslash( $_POST['paged'] ) ) ) : 1;

		$args  = self::buildQueryArgs( $a, $termId, $paged );
		$query = new \WP_Query( $args );

		$html  = '';
		$count = 0;
		if ( $query->have_posts() ) {
			$html  = self::renderCards( $query, $a );
			$count = (int) $query->post_count;
		}
		wp_reset_postdata();

		$maxPages = (int) $query->max_num_pages;
		$hasMore  = $a['showLoadMore'] && $paged < $maxPages;

		if ( '' === $html ) {
			$html = '<p class="bb-pfg-empty">' . esc_html( $a['noPostsMessage'] ) . '</p>';
		}

		wp_send_json_success(
			[
				'html'    => $html,
				'page'    => $paged,
				'hasMore' => $hasMore,
				'count'   => $count,
			]
		);
	}
}

new PostFilterGrid();
