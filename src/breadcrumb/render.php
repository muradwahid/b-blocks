<?php
$id = wp_unique_id( 'bBlocksBreadcrumb-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
if ( ! function_exists( 'bBlocks_breadcrumb_build_crumbs' ) ) {

	function bBlocks_breadcrumb_build_crumbs( $show_home, $home_label ) {
		$crumbs = array();

		if ( $show_home ) {
			$crumbs[] = array(
				'label' => $home_label,
				'url'   => home_url( '/' ),
			);
		}

		if ( is_front_page() ) {
			if ( ! empty( $crumbs ) ) {
				$crumbs[ count( $crumbs ) - 1 ]['url'] = '';
			}
			return $crumbs;
		}

		if ( is_home() ) {
			$blog_page_id = get_option( 'page_for_posts' );
			if ( $blog_page_id ) {
				$crumbs[] = array(
					'label' => get_the_title( $blog_page_id ),
					'url'   => '',
				);
			} else {
				$crumbs[] = array(
					'label' => __( 'Blog', 'b-blocks' ),
					'url'   => '',
				);
			}
			return $crumbs;
		}

		if ( is_404() ) {
			$crumbs[] = array(
				'label' => __( '404 Not Found', 'b-blocks' ),
				'url'   => '',
			);
			return $crumbs;
		}

		if ( is_search() ) {
			$crumbs[] = array(
				'label' => sprintf( __( 'Search: %s', 'b-blocks' ), get_search_query() ),
				'url'   => '',
			);
			return $crumbs;
		}

		if ( is_author() ) {
			$crumbs[] = array(
				'label' => sprintf( __( 'Author: %s', 'b-blocks' ), get_the_author() ),
				'url'   => '',
			);
			return $crumbs;
		}

		if ( is_date() ) {
			if ( is_year() ) {
				$crumbs[] = array(
					'label' => get_the_date( 'Y' ),
					'url'   => '',
				);
			} elseif ( is_month() ) {
				$crumbs[] = array(
					'label' => get_the_date( 'Y' ),
					'url'   => get_year_link( get_the_date( 'Y' ) ),
				);
				$crumbs[] = array(
					'label' => get_the_date( 'F' ),
					'url'   => '',
				);
			} elseif ( is_day() ) {
				$crumbs[] = array(
					'label' => get_the_date( 'Y' ),
					'url'   => get_year_link( get_the_date( 'Y' ) ),
				);
				$crumbs[] = array(
					'label' => get_the_date( 'F' ),
					'url'   => get_month_link( get_the_date( 'Y' ), get_the_date( 'm' ) ),
				);
				$crumbs[] = array(
					'label' => get_the_date( 'j' ),
					'url'   => '',
				);
			}
			return $crumbs;
		}

		if ( is_category() || is_tag() || is_tax() ) {
			$term = get_queried_object();
			if ( $term && ! is_wp_error( $term ) ) {
				// Add parent terms.
				if ( $term->parent ) {
					$ancestors = get_ancestors( $term->term_id, $term->taxonomy );
					$ancestors = array_reverse( $ancestors );
					foreach ( $ancestors as $ancestor_id ) {
						$ancestor = get_term( $ancestor_id, $term->taxonomy );
						if ( $ancestor && ! is_wp_error( $ancestor ) ) {
							$crumbs[] = array(
								'label' => $ancestor->name,
								'url'   => get_term_link( $ancestor ),
							);
						}
					}
				}
				$crumbs[] = array(
					'label' => $term->name,
					'url'   => '',
				);
			}
			return $crumbs;
		}

		if ( is_post_type_archive() ) {
			$post_type_obj = get_queried_object();
			if ( $post_type_obj ) {
				$crumbs[] = array(
					'label' => $post_type_obj->label,
					'url'   => '',
				);
			}
			return $crumbs;
		}

		if ( is_singular() ) {
			$post = get_queried_object();

			if ( 'post' === $post->post_type ) {
				$categories = get_the_category( $post->ID );
				if ( ! empty( $categories ) ) {
					$category = $categories[0];
					// Add parent categories.
					if ( $category->parent ) {
						$ancestors = get_ancestors( $category->term_id, 'category' );
						$ancestors = array_reverse( $ancestors );
						foreach ( $ancestors as $ancestor_id ) {
							$ancestor = get_term( $ancestor_id, 'category' );
							if ( $ancestor && ! is_wp_error( $ancestor ) ) {
								$crumbs[] = array(
									'label' => $ancestor->name,
									'url'   => get_term_link( $ancestor ),
								);
							}
						}
					}
					$crumbs[] = array(
						'label' => $category->name,
						'url'   => get_term_link( $category ),
					);
				}
			} elseif ( 'page' !== $post->post_type ) {
				// Custom post type: add archive link.
				$post_type_obj = get_post_type_object( $post->post_type );
				if ( $post_type_obj && $post_type_obj->has_archive ) {
					$crumbs[] = array(
						'label' => $post_type_obj->labels->name,
						'url'   => get_post_type_archive_link( $post->post_type ),
					);
				}
			}

			// Page ancestors.
			if ( 'page' === $post->post_type && $post->post_parent ) {
				$ancestors = get_ancestors( $post->ID, 'page' );
				$ancestors = array_reverse( $ancestors );
				foreach ( $ancestors as $ancestor_id ) {
					$crumbs[] = array(
						'label' => get_the_title( $ancestor_id ),
						'url'   => get_permalink( $ancestor_id ),
					);
				}
			}

			$crumbs[] = array(
				'label' => get_the_title( $post->ID ),
				'url'   => '',
			);
			return $crumbs;
		}

		return $crumbs;
	}
}
$show_home         = $attributes['options']['isHomeShow'];
$home_label        = $attributes['home']['label'];

$crumbs = bBlocks_breadcrumb_build_crumbs( $show_home, $home_label );

$schema = null;
if ( ! empty( $attributes['options']['isSchema'] ) ) {
	$schema_items = array();
	$pos = 1;
	foreach ( $crumbs as $c ) {
		$item = array(
			'@type'    => 'ListItem',
			'position' => $pos++,
			'name'     => $c['label'],
		);
		if ( ! empty( $c['url'] ) ) {
			$item['item'] = $c['url'];
		}
		$schema_items[] = $item;
	}

	$schema = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => $schema_items,
	);
}

?>
<div <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>' data-crumbs='<?php echo esc_attr( wp_json_encode( $crumbs ) ); ?>' data-schema='<?php echo esc_attr( wp_json_encode( $schema ) ); ?>' ></div>

