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
					$list[] = [ 'value' => $term->term_id, 'label' => $taxonomy->labels->singular_name . ': ' . html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' ), 'taxonomy' => $taxonomy->name, 'slug' => $term->slug ];
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

			if ( 2 > mb_strlen( $query ) || ! $types ) {
				return rest_ensure_response( [ 'items' => [], 'total' => 0 ] );
			}

			$args = [
				's'                      => $query,
				'post_type'              => $types,
				'post_status'            => 'publish',
				'has_password'           => false,
				'posts_per_page'         => $perPage,
				'ignore_sticky_posts'    => true,
				'update_post_term_cache' => false,
			];

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
			$include = [];
			foreach ( self::termIds( $request['include'] ) as $id ) {
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
			foreach ( self::termIds( $request['exclude'] ) as $id ) {
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

			$result = new WP_Query( $args );
			// One query for every result's thumbnail instead of one per result.
			update_post_thumbnail_cache( $result );

			$items = [];
			foreach ( $result->posts as $post ) {
				$imageId = (int) get_post_thumbnail_id( $post );
				// A written excerpt can hold shortcodes too: removed from both.
				$text    = strip_shortcodes( '' !== trim( $post->post_excerpt ) ? $post->post_excerpt : $post->post_content );

				$items[] = [
					'id'      => $post->ID,
					// Plain text: the page shows it as text and adds the highlight itself.
					'title'   => html_entity_decode( wp_strip_all_tags( get_the_title( $post ) ), ENT_QUOTES, 'UTF-8' ),
					'url'     => get_permalink( $post ),
					'excerpt' => html_entity_decode( wp_trim_words( wp_strip_all_tags( excerpt_remove_blocks( $text ) ), $words, '…' ), ENT_QUOTES, 'UTF-8' ),
					'date'    => get_the_date( '', $post ),
					'type'    => (string) ( get_post_type_object( $post->post_type )->labels->singular_name ?? '' ),
					'image'   => $imageId ? (string) wp_get_attachment_image_url( $imageId, 'thumbnail' ) : '',
					'srcset'  => $imageId ? (string) wp_get_attachment_image_srcset( $imageId, 'thumbnail' ) : '',
					'alt'     => $imageId ? (string) get_post_meta( $imageId, '_wp_attachment_image_alt', true ) : '',
				];
			}

			return rest_ensure_response( [ 'items' => $items, 'total' => (int) $result->found_posts ] );
		}
	}

	new BBlocksAdvancedSearch();
}
