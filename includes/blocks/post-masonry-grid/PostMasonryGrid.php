<?php
/**
 * Post Masonry Grid — shared server logic.
 *
 * Provides attribute sanitization, query building, card markup rendering, and a
 * hardened `admin-ajax.php` endpoint (`bb_pmg_load_more`) used by the frontend
 * `view.js` to append additional cards on Load More. The same card renderer is
 * used by `render.php` (initial server render) and by the AJAX handler so markup
 * is byte-identical and escaping lives in exactly one place.
 *
 * Security model for `bb_pmg_load_more`:
 *   - Nonce verified on every request via check_ajax_referer() (the same
 *     `wp_ajax` action localized to the frontend, so logged-out visitors get a
 *     valid nonce too).
 *   - All inputs sanitized: post_type (sanitize_key + post_type_exists),
 *     taxonomy/term IDs (sanitize_key / absint), paged (absint), orderby/order
 *     (strict allowlists).
 *   - All output escaped (esc_html / esc_url / esc_attr / wp_kses_post).
 *   - Responses use wp_send_json_success / wp_send_json_error; wp_reset_postdata().
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PostMasonryGrid {

	/**
	 * Allowed orderby values.
	 *
	 * @var string[]
	 */
	const ORDERBY = [ 'date', 'title', 'modified', 'rand', 'comment_count' ];

	/**
	 * Allowed order values (uppercased).
	 *
	 * @var string[]
	 */
	const ORDER = [ 'ASC', 'DESC' ];

	/**
	 * Allowed card styles.
	 *
	 * @var string[]
	 */
	const CARD_STYLES = [ 'image-top', 'image-overlay', 'text-only' ];

	/**
	 * Allowed image ratios.
	 *
	 * @var string[]
	 */
	const RATIOS = [ 'auto', '1-1', '4-3', '16-9', '3-2' ];

	/**
	 * Allowed image sizes.
	 *
	 * @var string[]
	 */
	const IMAGE_SIZES = [ 'thumbnail', 'medium', 'large', 'full' ];

	/**
	 * Allowed card shadows.
	 *
	 * @var string[]
	 */
	const SHADOWS = [ 'none', 'small', 'medium', 'large' ];

	/**
	 * Allowed title font weights.
	 *
	 * @var string[]
	 */
	const FONT_WEIGHTS = [ '400', '500', '600', '700' ];

	/**
	 * Allowed alignments.
	 *
	 * @var string[]
	 */
	const ALIGNMENTS = [ 'left', 'center', 'right' ];

	/**
	 * Hook the AJAX endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_pmg_load_more', [ $this, 'ajaxLoadMore' ] );
		add_action( 'wp_ajax_nopriv_bb_pmg_load_more', [ $this, 'ajaxLoadMore' ] );
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
	 * Sanitize a comma-separated list of positive integers to an array of ints.
	 *
	 * @param mixed $value Raw comma-separated string.
	 * @return int[]
	 */
	public static function parseIdList( $value ) {
		if ( is_array( $value ) ) {
			$parts = $value;
		} else {
			$parts = explode( ',', (string) $value );
		}
		$ids = array_map( 'absint', $parts );
		$ids = array_filter( $ids );
		return array_values( array_unique( $ids ) );
	}

	/**
	 * Map an aspect-ratio token to a CSS aspect-ratio value.
	 *
	 * @param string $ratio Ratio token.
	 * @return string
	 */
	public static function ratioToCss( $ratio ) {
		$map = [
			'auto' => 'auto',
			'1-1'  => '1 / 1',
			'4-3'  => '4 / 3',
			'16-9' => '16 / 9',
			'3-2'  => '3 / 2',
		];
		return $map[ $ratio ] ?? '16 / 9';
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

		$filterLabel   = isset( $attributes['filterLabel'] ) ? wp_strip_all_tags( (string) $attributes['filterLabel'] ) : '';
		$filterLabel   = '' !== trim( $filterLabel ) ? $filterLabel : __( 'All', 'b-blocks' );

		$loadMoreLabel = isset( $attributes['loadMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['loadMoreLabel'] ) : '';
		$loadMoreLabel = '' !== trim( $loadMoreLabel ) ? $loadMoreLabel : __( 'Load More', 'b-blocks' );

		$readMoreLabel = isset( $attributes['readMoreLabel'] ) ? wp_strip_all_tags( (string) $attributes['readMoreLabel'] ) : '';
		$readMoreLabel = '' !== trim( $readMoreLabel ) ? $readMoreLabel : __( 'Read More', 'b-blocks' );

		$noPostsText   = isset( $attributes['noPostsText'] ) ? wp_strip_all_tags( (string) $attributes['noPostsText'] ) : '';
		$noPostsText   = '' !== trim( $noPostsText ) ? $noPostsText : __( 'No posts found.', 'b-blocks' );

		return [
			'postType'         => $postType,
			'postsPerPage'     => self::clampInt( $attributes['postsPerPage'] ?? 9, 1, 48, 9 ),
			'orderBy'          => self::pickFrom( $attributes['orderBy'] ?? 'date', self::ORDERBY, 'date' ),
			'order'            => self::pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'DESC' ) ), self::ORDER, 'DESC' ),
			'categoryIds'      => self::parseIdList( $attributes['categoryIds'] ?? [] ),
			'tagIds'           => self::parseIdList( $attributes['tagIds'] ?? [] ),
			'excludeIds'       => self::parseIdList( $attributes['excludeIds'] ?? '' ),

			'filterEnabled'    => ! isset( $attributes['filterEnabled'] ) || (bool) $attributes['filterEnabled'],
			'filterLabel'      => $filterLabel,

			'loadMoreEnabled'  => ! isset( $attributes['loadMoreEnabled'] ) || (bool) $attributes['loadMoreEnabled'],
			'loadMoreLabel'    => $loadMoreLabel,
			'loadMoreStep'     => self::clampInt( $attributes['loadMoreStep'] ?? 6, 1, 24, 6 ),

			'cardStyle'        => self::pickFrom( $attributes['cardStyle'] ?? 'image-top', self::CARD_STYLES, 'image-top' ),
			'imageRatio'       => self::pickFrom( $attributes['imageRatio'] ?? '16-9', self::RATIOS, '16-9' ),
			'imageSize'        => self::pickFrom( $attributes['imageSize'] ?? 'large', self::IMAGE_SIZES, 'large' ),

			'showExcerpt'      => ! isset( $attributes['showExcerpt'] ) || (bool) $attributes['showExcerpt'],
			'excerptLength'    => self::clampInt( $attributes['excerptLength'] ?? 20, 5, 60, 20 ),
			'showDate'         => ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'],
			'showAuthor'       => ! empty( $attributes['showAuthor'] ),
			'showCategory'     => ! isset( $attributes['showCategory'] ) || (bool) $attributes['showCategory'],
			'showReadMore'     => ! isset( $attributes['showReadMore'] ) || (bool) $attributes['showReadMore'],
			'readMoreLabel'    => $readMoreLabel,

			'colsDesktop'      => self::clampInt( $attributes['colsDesktop'] ?? 3, 1, 5, 3 ),
			'colsTablet'       => self::clampInt( $attributes['colsTablet'] ?? 2, 1, 4, 2 ),
			'colsMobile'       => self::clampInt( $attributes['colsMobile'] ?? 1, 1, 2, 1 ),
			'gap'              => self::clampInt( $attributes['gap'] ?? 24, 0, 80, 24 ),
			'maxWidth'         => self::clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 ),
			'align'            => self::pickFrom( $attributes['align'] ?? 'center', self::ALIGNMENTS, 'center' ),

			'cardBg'           => self::sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' ),
			'cardRadius'       => self::clampInt( $attributes['cardRadius'] ?? 8, 0, 32, 8 ),
			'cardShadow'       => self::pickFrom( $attributes['cardShadow'] ?? 'small', self::SHADOWS, 'small' ),
			'accentColor'      => self::sanitizeColor( $attributes['accentColor'] ?? '', '#2563eb' ),
			'titleColor'       => self::sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' ),
			'metaColor'        => self::sanitizeColor( $attributes['metaColor'] ?? '', 'inherit' ),
			'excerptColor'     => self::sanitizeColor( $attributes['excerptColor'] ?? '', 'inherit' ),
			'titleFontSize'    => self::clampInt( $attributes['titleFontSize'] ?? 18, 12, 40, 18 ),
			'titleFontWeight'  => self::pickFrom( (string) ( $attributes['titleFontWeight'] ?? '600' ), self::FONT_WEIGHTS, '600' ),
			'metaFontSize'     => self::clampInt( $attributes['metaFontSize'] ?? 13, 10, 20, 13 ),
			'excerptFontSize'  => self::clampInt( $attributes['excerptFontSize'] ?? 14, 10, 22, 14 ),
			'overlayColor'     => self::sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.45)' ),

			'filterBarAlignment' => self::pickFrom( $attributes['filterBarAlignment'] ?? 'left', self::ALIGNMENTS, 'left' ),
			'filterBarGap'     => self::clampInt( $attributes['filterBarGap'] ?? 8, 0, 32, 8 ),
			'filterActiveBg'   => self::sanitizeColor( $attributes['filterActiveBg'] ?? '', '' ),
			'filterActiveText' => self::sanitizeColor( $attributes['filterActiveText'] ?? '', '#ffffff' ),
			'filterInactiveBg' => self::sanitizeColor( $attributes['filterInactiveBg'] ?? '', '#f3f4f6' ),
			'filterInactiveText' => self::sanitizeColor( $attributes['filterInactiveText'] ?? '', '#374151' ),
			'filterPillRadius' => self::clampInt( $attributes['filterPillRadius'] ?? 9999, 0, 9999, 9999 ),

			'loadMoreBg'       => self::sanitizeColor( $attributes['loadMoreBg'] ?? '', '' ),
			'loadMoreText'     => self::sanitizeColor( $attributes['loadMoreText'] ?? '', '#ffffff' ),
			'loadMoreRadius'   => self::clampInt( $attributes['loadMoreRadius'] ?? 6, 0, 50, 6 ),

			'noPostsText'      => $noPostsText,
		];
	}

	/* ----------------------------------------------------------------------
	 * Query
	 * ------------------------------------------------------------------- */

	/**
	 * Build sanitized WP_Query args.
	 *
	 * @param array $a     Resolved attributes.
	 * @param int   $paged Page number (1-based).
	 * @return array
	 */
	public static function buildQueryArgs( array $a, $paged ) {
		$paged = max( 1, absint( $paged ) );

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

		if ( ! empty( $a['excludeIds'] ) ) {
			$args['post__not_in'] = $a['excludeIds'];
		}

		$taxQuery = [];
		if ( ! empty( $a['categoryIds'] ) && taxonomy_exists( 'category' ) ) {
			$taxQuery[] = [
				'taxonomy' => 'category',
				'field'    => 'term_id',
				'terms'    => $a['categoryIds'],
			];
		}
		if ( ! empty( $a['tagIds'] ) && taxonomy_exists( 'post_tag' ) ) {
			$taxQuery[] = [
				'taxonomy' => 'post_tag',
				'field'    => 'term_id',
				'terms'    => $a['tagIds'],
			];
		}
		if ( ! empty( $taxQuery ) ) {
			if ( count( $taxQuery ) > 1 ) {
				$taxQuery['relation'] = 'AND';
			}
			$args['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}

		return $args;
	}

	/* ----------------------------------------------------------------------
	 * Card rendering
	 * ------------------------------------------------------------------- */

	/**
	 * Render the cards for a query as an escaped HTML fragment.
	 *
	 * Each card is an `<li>` so the container can be a `<ul role="list">`.
	 *
	 * @param \WP_Query $query The query.
	 * @param array     $a     Resolved attributes.
	 * @return string Escaped HTML.
	 */
	public static function renderCards( $query, array $a ) {
		$isOverlay  = ( 'image-overlay' === $a['cardStyle'] );
		$showImage  = ( 'text-only' !== $a['cardStyle'] );

		ob_start();

		while ( $query->have_posts() ) :
			$query->the_post();
			$postId    = get_the_ID();
			$permalink = get_permalink( $postId );
			$titleText = get_the_title( $postId );
			$titleId   = 'bb-pmg-title-' . $postId . '-' . wp_rand( 1000, 9999 );

			// Category slugs for the client-side filter data attribute.
			$catSlugs = [];
			$postCats = get_the_terms( $postId, 'category' );
			if ( ! empty( $postCats ) && ! is_wp_error( $postCats ) ) {
				foreach ( $postCats as $catTerm ) {
					$catSlugs[] = $catTerm->slug;
				}
			}

			// Featured image.
			$imageUrl = '';
			$imageAlt = '';
			if ( $showImage && has_post_thumbnail( $postId ) ) {
				$thumbUrl = get_the_post_thumbnail_url( $postId, $a['imageSize'] );
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

			// Primary category badge.
			$termName = '';
			$termLink = '';
			if ( $a['showCategory'] && ! empty( $postCats ) && ! is_wp_error( $postCats ) ) {
				$firstTerm = $postCats[0];
				$termName  = $firstTerm->name;
				$link      = get_term_link( $firstTerm );
				if ( ! is_wp_error( $link ) ) {
					$termLink = $link;
				}
			}

			// Excerpt.
			$excerptText = '';
			if ( $a['showExcerpt'] ) {
				$excerptText = wp_trim_words( get_the_excerpt( $postId ), $a['excerptLength'], '&hellip;' );
			}

			$cardClasses = 'bb-pmg-card bb-pmg-card--' . $a['cardStyle'];
			?>
			<li
				class='<?php echo esc_attr( $cardClasses ); ?>'
				data-bb-pmg-cats='<?php echo esc_attr( wp_json_encode( $catSlugs ) ); ?>'
			>
				<article class='bb-pmg-article' aria-labelledby='<?php echo esc_attr( $titleId ); ?>'>
					<?php if ( $isOverlay ) : ?>
						<a class='bb-pmg-overlay-link' href='<?php echo esc_url( $permalink ); ?>'>
							<?php if ( '' !== $imageUrl ) : ?>
								<img class='bb-pmg-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
							<?php endif; ?>
							<span class='bb-pmg-overlay-scrim' aria-hidden='true'></span>
							<span class='bb-pmg-card-body'>
								<?php if ( '' !== $termName ) : ?>
									<span class='bb-pmg-badge'><?php echo esc_html( $termName ); ?></span>
								<?php endif; ?>
								<span class='bb-pmg-title' id='<?php echo esc_attr( $titleId ); ?>'><?php echo esc_html( $titleText ); ?></span>
								<?php if ( $a['showDate'] || $a['showAuthor'] ) : ?>
									<span class='bb-pmg-meta'>
										<?php echo wp_kses_post( self::metaHtml( $postId, $a ) ); ?>
									</span>
								<?php endif; ?>
							</span>
						</a>
					<?php else : ?>
						<?php if ( '' !== $imageUrl ) : ?>
							<a class='bb-pmg-image-link' href='<?php echo esc_url( $permalink ); ?>' tabindex='-1' aria-hidden='true'>
								<img class='bb-pmg-image' src='<?php echo esc_url( $imageUrl ); ?>' alt='<?php echo esc_attr( $imageAlt ); ?>' loading='lazy' decoding='async' />
							</a>
						<?php endif; ?>

						<div class='bb-pmg-card-body'>
							<?php if ( '' !== $termName ) : ?>
								<?php if ( '' !== $termLink ) : ?>
									<a class='bb-pmg-badge' href='<?php echo esc_url( $termLink ); ?>'><?php echo esc_html( $termName ); ?></a>
								<?php else : ?>
									<span class='bb-pmg-badge'><?php echo esc_html( $termName ); ?></span>
								<?php endif; ?>
							<?php endif; ?>

							<h3 class='bb-pmg-title' id='<?php echo esc_attr( $titleId ); ?>'>
								<a class='bb-pmg-title-link' href='<?php echo esc_url( $permalink ); ?>'>
									<?php echo esc_html( $titleText ); ?>
								</a>
							</h3>

							<?php if ( $a['showDate'] || $a['showAuthor'] ) : ?>
								<div class='bb-pmg-meta'>
									<?php echo wp_kses_post( self::metaHtml( $postId, $a ) ); ?>
								</div>
							<?php endif; ?>

							<?php if ( $a['showExcerpt'] && '' !== $excerptText ) : ?>
								<p class='bb-pmg-excerpt'><?php echo wp_kses_post( $excerptText ); ?></p>
							<?php endif; ?>

							<?php if ( $a['showReadMore'] ) : ?>
								<a class='bb-pmg-readmore' href='<?php echo esc_url( $permalink ); ?>'>
									<?php echo esc_html( $a['readMoreLabel'] ); ?>
									<span class='screen-reader-text'> &mdash; <?php echo esc_html( $titleText ); ?></span>
								</a>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				</article>
			</li>
			<?php
		endwhile;

		return ob_get_clean();
	}

	/**
	 * Build the escaped meta row HTML (author + date).
	 *
	 * @param int   $postId Post ID.
	 * @param array $a      Resolved attributes.
	 * @return string Escaped HTML.
	 */
	protected static function metaHtml( $postId, array $a ) {
		ob_start();
		if ( $a['showAuthor'] ) :
			?>
			<span class='bb-pmg-meta-author'>
				<span class='screen-reader-text'><?php echo esc_html__( 'Author:', 'b-blocks' ); ?> </span>
				<?php echo esc_html( get_the_author_meta( 'display_name', (int) get_post_field( 'post_author', $postId ) ) ); ?>
			</span>
			<?php
		endif;
		if ( $a['showAuthor'] && $a['showDate'] ) :
			?>
			<span class='bb-pmg-meta-sep' aria-hidden='true'>&middot;</span>
			<?php
		endif;
		if ( $a['showDate'] ) :
			?>
			<time class='bb-pmg-meta-date' datetime='<?php echo esc_attr( get_the_date( 'c', $postId ) ); ?>'>
				<?php echo esc_html( get_the_date( '', $postId ) ); ?>
			</time>
			<?php
		endif;
		return ob_get_clean();
	}

	/* ----------------------------------------------------------------------
	 * AJAX endpoint
	 * ------------------------------------------------------------------- */

	/**
	 * Handle the `bb_pmg_load_more` AJAX request.
	 *
	 * Returns JSON: { html, page, hasMore, count }.
	 */
	public function ajaxLoadMore() {
		// Nonce — shared plugin action handle. Dies with 403 on failure.
		check_ajax_referer( 'wp_ajax', 'nonce' );

		$raw        = isset( $_POST['attributes'] ) ? wp_unslash( $_POST['attributes'] ) : ''; // phpcs:ignore WordPress.Security.ValidationSanitization.MissingUnslash, WordPress.Security.ValidationSanitization.InputNotSanitized -- JSON decoded then each field individually sanitized in resolveAttributes().
		$attributes = is_string( $raw ) ? json_decode( $raw, true ) : [];
		if ( ! is_array( $attributes ) ) {
			$attributes = [];
		}

		$a = self::resolveAttributes( $attributes );

		$paged = isset( $_POST['paged'] ) ? max( 1, absint( wp_unslash( $_POST['paged'] ) ) ) : 1;

		$args  = self::buildQueryArgs( $a, $paged );
		$query = new \WP_Query( $args );

		$html  = '';
		$count = 0;
		if ( $query->have_posts() ) {
			$html  = self::renderCards( $query, $a );
			$count = (int) $query->post_count;
		}
		wp_reset_postdata();

		$maxPages = (int) $query->max_num_pages;
		$hasMore  = $paged < $maxPages;

		if ( '' === $html ) {
			wp_send_json_error(
				[
					'message' => esc_html( $a['noPostsText'] ),
				]
			);
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

new PostMasonryGrid();
