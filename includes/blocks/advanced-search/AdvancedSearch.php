<?php
/**
 * Advanced Search block: the live results REST route and the editor's post type list.
 *
 * GET b-blocks/v1/search        public; published, public, unprotected content only.
 * GET b-blocks/v1/search/types  editors only; the post types the block can search.
 * GET b-blocks/v1/search/terms  editors only; the terms the Include/Exclude filters can use.
 *
 * @package bBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'BBlocksAdvancedSearch' ) ) {

	class BBlocksAdvancedSearch {

		const MAX_QUERY = 100;
		const MAX_PER_PAGE = 20;
		const MAX_TERMS = 50;

		public function __construct() {
			add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );
		}

		/**
		 * Public post types WordPress search covers (not marked exclude_from_search), without media.
		 *
		 * @return string[]
		 */
		public static function postTypes() {
			$types = get_post_types( [ 'public' => true, 'exclude_from_search' => false ], 'names' );
			unset( $types['attachment'] );

			return array_values( $types );
		}

		public function registerRoutes() {
			register_rest_route( 'b-blocks/v1', '/search', [
				'methods'             => 'GET',
				'callback'            => [ $this, 'search' ],
				// Public read: it returns only what the site's own search page shows.
				'permission_callback' => '__return_true',
				'args'                => [
					'query'     => [
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => function ( $value ) {
							// query[]=… arrives as an array: nothing to search (and no "Array to string" warning in the JSON).
							return is_scalar( $value ) ? mb_substr( sanitize_text_field( (string) $value ), 0, self::MAX_QUERY ) : '';
						},
					],
					// 'all', one post type, or several separated by commas.
					'post_type' => [
						'type'              => 'string',
						'default'           => 'all',
						'sanitize_callback' => function ( $value ) {
							// post_type[]=a&post_type[]=b is taken as a list too; anything that is not text is dropped.
							$types = is_array( $value ) ? array_filter( $value, 'is_scalar' ) : ( is_scalar( $value ) ? explode( ',', (string) $value ) : [] );
							return implode( ',', array_filter( array_map( 'sanitize_key', $types ) ) );
						},
					],
					'orderby'   => [
						'type'    => 'string',
						'default' => 'relevance',
						'enum'    => [ 'relevance', 'date', 'title' ],
					],
					// Term IDs, separated by commas: results must be in one of `include` and in none of `exclude`.
					'include'   => [
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => [ __CLASS__, 'termIds' ],
					],
					'exclude'   => [
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => [ __CLASS__, 'termIds' ],
					],
					'excerpt_length' => [
						'type'              => 'integer',
						'default'           => 22,
						'sanitize_callback' => 'absint',
					],
					'per_page'  => [
						'type'              => 'integer',
						'default'           => 5,
						'sanitize_callback' => 'absint',
					],
					// 'title': titles only (WordPress search otherwise looks in title, excerpt and content).
					'search_in' => [
						'type'    => 'string',
						'default' => 'all',
						'enum'    => [ 'all', 'title' ],
					],
					// Post IDs, separated by commas, never shown.
					'exclude_posts' => [
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => [ __CLASS__, 'postIds' ],
					],
					'with_author' => [
						'type'    => 'boolean',
						'default' => false,
					],
					'with_category' => [
						'type'    => 'boolean',
						'default' => false,
					],
					// Up to this many matching categories/tags (0: none).
					'terms' => [
						'type'              => 'integer',
						'default'           => 0,
						'sanitize_callback' => 'absint',
					],
					// Nothing matched: recent posts of the searched types, or the chosen posts.
					'fallback' => [
						'type'    => 'string',
						'default' => 'none',
						'enum'    => [ 'none', 'recent', 'chosen' ],
					],
					'fallback_posts' => [
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => [ __CLASS__, 'postIds' ],
					],
					// The term the visitor picked in the filter dropdown: results must be in it too.
					'filter' => [
						'type'              => 'integer',
						'default'           => 0,
						'sanitize_callback' => 'absint',
					],
					// Pro: results grouped by post type, each type with its own total.
					'group' => [
						'type'    => 'boolean',
						'default' => false,
					],
				],
			] );

			register_rest_route( 'b-blocks/v1', '/search/types', [
				'methods'             => 'GET',
				'callback'            => [ $this, 'types' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			] );

			register_rest_route( 'b-blocks/v1', '/search/terms', [
				'methods'             => 'GET',
				'callback'            => [ $this, 'terms' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			] );
		}

		/**
		 * Up to MAX_TERMS term IDs from a comma list (or an array), each an existing term of a public taxonomy.
		 *
		 * @param mixed $value Comma list or array.
		 * @return int[]
		 */
		public static function termIds( $value ) {
			// Capped before the look-ups: a visitor's long list costs at most MAX_TERMS term reads.
			$ids = array_slice( array_values( array_unique( array_filter( array_map( 'absint', is_array( $value ) ? $value : explode( ',', (string) $value ) ) ) ) ), 0, self::MAX_TERMS );

			return array_values( array_filter( $ids, function ( $id ) {
				$term = get_term( $id );
				return $term instanceof WP_Term && is_taxonomy_viewable( $term->taxonomy );
			} ) );
		}

		/**
		 * Up to MAX_TERMS post IDs from a comma list (or an array). Whether a post may be shown is decided by the query.
		 *
		 * @param mixed $value Comma list or array.
		 * @return int[]
		 */
		public static function postIds( $value ) {
			$list = is_array( $value ) ? array_filter( $value, 'is_scalar' ) : ( is_scalar( $value ) ? explode( ',', (string) $value ) : [] );

			return array_slice( array_values( array_unique( array_filter( array_map( 'absint', $list ) ) ) ), 0, self::MAX_TERMS );
		}

		/**
		 * The editor's Include/Exclude choices: terms of the public taxonomies the searchable post types use.
		 */
		public function terms() {
			$list = [];
			$taxonomies = [];
			foreach ( self::postTypes() as $type ) {
				foreach ( get_object_taxonomies( $type, 'objects' ) as $taxonomy ) {
					if ( is_taxonomy_viewable( $taxonomy ) ) {
						$taxonomies[ $taxonomy->name ] = $taxonomy;
					}
				}
			}
			foreach ( $taxonomies as $taxonomy ) {
				$terms = get_terms( [ 'taxonomy' => $taxonomy->name, 'hide_empty' => false, 'number' => 200 ] );
				foreach ( is_array( $terms ) ? $terms : [] as $term ) {
					$list[] = [ 'value' => $term->term_id, 'label' => $taxonomy->labels->singular_name . ': ' . html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' ), 'taxonomy' => $taxonomy->name, 'taxonomyLabel' => $taxonomy->labels->singular_name, 'slug' => $term->slug ];
				}
			}

			// The editor picks terms by label: two terms with one name (e.g. "News" under two parents) get their slug
			// added, or picking the second would save the first.
			$counts = array_count_values( array_column( $list, 'label' ) );
			foreach ( $list as &$entry ) {
				if ( 1 < $counts[ $entry['label'] ] ) {
					$entry['label'] .= ' (' . $entry['slug'] . ')';
				}
				unset( $entry['slug'] );
			}
			unset( $entry );

			return rest_ensure_response( $list );
		}

		/**
		 * The editor's "Search For Post Types" options.
		 */
		public function types() {
			$list = [];
			foreach ( self::postTypes() as $type ) {
				$object = get_post_type_object( $type );
				if ( $object ) {
					$list[] = [ 'label' => $object->labels->name, 'value' => $type ];
				}
			}

			return rest_ensure_response( $list );
		}

		/**
		 * Live results: up to per_page items and the total, for the query and post type.
		 *
		 * @param WP_REST_Request $request Request.
		 */
		public function search( WP_REST_Request $request ) {
			$query   = trim( (string) $request['query'] );
			$allowed = self::postTypes();
			$type    = (string) $request['post_type'];
			// Several types: only the public searchable ones are kept; none left means nothing to search.
			$types   = 'all' === $type || '' === $type ? $allowed : array_values( array_intersect( explode( ',', $type ), $allowed ) );
			$perPage = min( self::MAX_PER_PAGE, max( 1, (int) $request['per_page'] ) );
			$words   = min( 55, max( 5, (int) $request['excerpt_length'] ) );
			$withAuthor   = (bool) $request['with_author'];
			$withCategory = (bool) $request['with_category'];
			$termCount    = min( 10, (int) $request['terms'] );
			$excludePosts = (array) $request['exclude_posts'];
			$filterIds    = $request['filter'] ? self::termIds( [ $request['filter'] ] ) : [];
			$groupByType  = (bool) $request['group'];

			if ( 2 > mb_strlen( $query ) || ! $types ) {
				return rest_ensure_response( [ 'items' => [], 'total' => 0, 'terms' => [], 'fallback' => [] ] );
			}

			// The same question gets the same answer until a post or a term changes. Kept only in a persistent object
			// cache (Redis, Memcached…): without one it lasts for this request, and nothing is written to the database.
			$cacheKey = md5( wp_json_encode( [ $request->get_params(), $types, determine_locale(), $groupByType ] ) ) . ':' . wp_cache_get_last_changed( 'posts' ) . ':' . wp_cache_get_last_changed( 'terms' );
			$cached   = wp_cache_get( $cacheKey, 'b_blocks_search' );
			if ( is_array( $cached ) ) {
				return rest_ensure_response( $cached );
			}

			$args = [
				's'                      => $query,
				'post_type'              => $types,
				'post_status'            => 'publish',
				'has_password'           => false,
				'posts_per_page'         => $perPage,
				'ignore_sticky_posts'    => true,
				// The category of each result is read from the term cache, filled in one query.
				'update_post_term_cache' => $withCategory,
			];

			if ( 'title' === $request['search_in'] ) {
				$args['search_columns'] = [ 'post_title' ];
			}
			if ( $excludePosts ) {
				$args['post__not_in'] = $excludePosts;
			}

			// Relevance is WordPress's own order for a search.
			if ( 'date' === $request['orderby'] ) {
				$args['orderby'] = 'date';
				$args['order']   = 'DESC';
			} elseif ( 'title' === $request['orderby'] ) {
				$args['orderby'] = 'title';
				$args['order']   = 'ASC';
			}

			$taxQuery = [ 'relation' => 'AND' ];

			// Include: in any of the terms (grouped by taxonomy). Exclude: in none of them.
			$includeIds = self::termIds( $request['include'] );
			$excludeIds = self::termIds( $request['exclude'] );
			$include    = [];
			foreach ( $includeIds as $id ) {
				$include[ get_term( $id )->taxonomy ][] = $id;
			}
			if ( $include ) {
				$any = [ 'relation' => 'OR' ];
				foreach ( $include as $taxonomy => $ids ) {
					$any[] = [ 'taxonomy' => $taxonomy, 'field' => 'term_id', 'terms' => $ids ];
				}
				$taxQuery[] = $any;
			}
			$exclude = [];
			foreach ( $excludeIds as $id ) {
				$exclude[ get_term( $id )->taxonomy ][] = $id;
			}
			foreach ( $exclude as $taxonomy => $ids ) {
				$taxQuery[] = [ 'taxonomy' => $taxonomy, 'field' => 'term_id', 'terms' => $ids, 'operator' => 'NOT IN' ];
			}

			// WooCommerce: products hidden from search ("Catalog visibility: Shop only / Hidden") stay out.
			if ( in_array( 'product', $types, true ) && taxonomy_exists( 'product_visibility' ) ) {
				$taxQuery[] = [
					'taxonomy' => 'product_visibility',
					'field'    => 'name',
					'terms'    => [ 'exclude-from-search' ],
					'operator' => 'NOT IN',
				];
			}

			if ( 1 < count( $taxQuery ) ) {
				$args['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- term filters and catalog visibility.
			}
			// The visitor's filter applies to the results only (the fallback posts and the matching terms stay as set).
			$searchArgs = $args;
			if ( $filterIds ) {
				$searchArgs['tax_query'] = array_merge( $taxQuery, [ [ 'taxonomy' => get_term( $filterIds[0] )->taxonomy, 'field' => 'term_id', 'terms' => $filterIds ] ] ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- the visitor's filter.
			}

			// Grouped: one search per post type, each with up to per_page results and its own total.
			$groups = [];
			$found  = 0;
			$posts  = [ 'items' => [], 'fallback' => [] ];
			foreach ( $groupByType ? $types : [ $types ] as $groupType ) {
				$result = new WP_Query( [ 'post_type' => $groupType ] + $searchArgs );
				$found += (int) $result->found_posts;
				$posts['items'] = array_merge( $posts['items'], $result->posts );
				if ( $groupByType && $result->found_posts ) {
					$groups[] = [ 'type' => $groupType, 'label' => (string) get_post_type_object( $groupType )->labels->name, 'total' => (int) $result->found_posts ];
				}
			}

			// Nothing matched: the latest posts of the same types and terms, or the posts the owner chose (any
			// searchable type, in the chosen order).
			$fallbackIds = (array) $request['fallback_posts'];
			if ( ! $found && ( 'recent' === $request['fallback'] || ( 'chosen' === $request['fallback'] && $fallbackIds ) ) ) {
				$more = [
					'post_type'              => 'chosen' === $request['fallback'] ? $allowed : $types,
					'post_status'            => 'publish',
					'has_password'           => false,
					'posts_per_page'         => $perPage,
					'ignore_sticky_posts'    => true,
					'no_found_rows'          => true,
					'update_post_term_cache' => $withCategory,
				];
				if ( 'chosen' === $request['fallback'] ) {
					$more['post__in'] = $fallbackIds;
					$more['orderby']  = 'post__in';
				} else {
					$more['orderby'] = 'date';
					$more['order']   = 'DESC';
					if ( $excludePosts ) {
						$more['post__not_in'] = $excludePosts;
					}
					if ( 1 < count( $taxQuery ) ) {
						$more['tax_query'] = $taxQuery; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- same filters as the search.
					}
				}
				$posts['fallback'] = ( new WP_Query( $more ) )->posts;
			}

			// One query each for every result's thumbnail and author instead of one per result.
			$allPosts = array_merge( $posts['items'], $posts['fallback'] );
			if ( $allPosts ) {
				$thumbs = new WP_Query();
				$thumbs->posts = $allPosts;
				update_post_thumbnail_cache( $thumbs );
				if ( $withAuthor ) {
					update_post_author_caches( $allPosts );
				}
			}

			$out = [ 'items' => [], 'total' => $found, 'terms' => [], 'fallback' => [] ];
			if ( $groupByType ) {
				$out['groups'] = $groups;
			}
			foreach ( $posts as $key => $list ) {
				foreach ( $list as $post ) {
					$imageId = (int) get_post_thumbnail_id( $post );
					// A written excerpt can hold shortcodes too: removed from both.
					$text    = strip_shortcodes( '' !== trim( $post->post_excerpt ) ? $post->post_excerpt : $post->post_content );

					// The first term of the type's first public hierarchical taxonomy (Category, Product category…).
					$category = '';
					if ( $withCategory ) {
						foreach ( get_object_taxonomies( $post->post_type, 'objects' ) as $taxonomy ) {
							if ( $taxonomy->hierarchical && is_taxonomy_viewable( $taxonomy ) ) {
								$postTerms = get_the_terms( $post, $taxonomy->name );
								$category  = is_array( $postTerms ) && $postTerms ? html_entity_decode( $postTerms[0]->name, ENT_QUOTES, 'UTF-8' ) : '';
								break;
							}
						}
					}

					$out[ $key ][] = [
						'id'       => $post->ID,
						// Plain text: the page shows it as text and adds the highlight itself.
						'title'    => html_entity_decode( wp_strip_all_tags( get_the_title( $post ) ), ENT_QUOTES, 'UTF-8' ),
						'url'      => get_permalink( $post ),
						'excerpt'  => html_entity_decode( wp_trim_words( wp_strip_all_tags( excerpt_remove_blocks( $text ) ), $words, '…' ), ENT_QUOTES, 'UTF-8' ),
						'date'     => get_the_date( '', $post ),
						'type'     => (string) ( get_post_type_object( $post->post_type )->labels->singular_name ?? '' ),
						'author'   => $withAuthor ? html_entity_decode( (string) get_the_author_meta( 'display_name', $post->post_author ), ENT_QUOTES, 'UTF-8' ) : '',
						'category' => $category,
						'image'    => $imageId ? (string) wp_get_attachment_image_url( $imageId, 'thumbnail' ) : '',
						'srcset'   => $imageId ? (string) wp_get_attachment_image_srcset( $imageId, 'thumbnail' ) : '',
						'alt'      => $imageId ? (string) get_post_meta( $imageId, '_wp_attachment_image_alt', true ) : '',
					] + ( $groupByType && 'items' === $key ? [ 'group' => $post->post_type ] : [] );
				}
			}

			// Categories, tags… whose name matches, most used first. With Include terms, only those; never Exclude terms.
			if ( $termCount ) {
				$taxonomies = [];
				foreach ( $types as $postType ) {
					foreach ( get_object_taxonomies( $postType, 'objects' ) as $taxonomy ) {
						if ( 'post_format' !== $taxonomy->name && is_taxonomy_viewable( $taxonomy ) ) {
							$taxonomies[ $taxonomy->name ] = $taxonomy;
						}
					}
				}
				$found = $taxonomies ? get_terms( [
					'taxonomy'   => array_keys( $taxonomies ),
					'name__like' => $query,
					'number'     => $termCount,
					'hide_empty' => true,
					'orderby'    => 'count',
					'order'      => 'DESC',
					'include'    => $includeIds,
					'exclude'    => $includeIds ? [] : $excludeIds,
				] ) : [];
				foreach ( is_array( $found ) ? $found : [] as $term ) {
					$link = get_term_link( $term );
					if ( is_string( $link ) ) {
						$out['terms'][] = [
							'id'       => $term->term_id,
							'name'     => html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' ),
							'url'      => $link,
							'count'    => (int) $term->count,
							'taxonomy' => (string) $taxonomies[ $term->taxonomy ]->labels->singular_name,
						];
					}
				}
			}

			wp_cache_set( $cacheKey, $out, 'b_blocks_search', HOUR_IN_SECONDS );

			return rest_ensure_response( $out );
		}
	}

	new BBlocksAdvancedSearch();
}
