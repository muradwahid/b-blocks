<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$post_type = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';
$selected_posts = isset( $attributes['selectedPosts'] ) ? $attributes['selectedPosts'] : array();
$selected_categories = isset( $attributes['selectedCategories'] ) ? $attributes['selectedCategories'] : array();
$select_all_categories = isset( $attributes['selectAllCategories'] ) ? $attributes['selectAllCategories'] : false;
$speed = isset( $attributes['speed'] ) ? $attributes['speed'] : 50;
$enable_click = isset( $attributes['enableClick'] ) ? $attributes['enableClick'] : true;
$text_color = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '#ffffff';
$background_color = isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '#667eea';
$font_size = isset( $attributes['fontSize'] ) ? $attributes['fontSize'] : 15;
$font_weight = isset( $attributes['fontWeight'] ) ? $attributes['fontWeight'] : '400';
$font_family = isset( $attributes['fontFamily'] ) ? $attributes['fontFamily'] : '';
$heading_text = isset( $attributes['headingText'] ) ? $attributes['headingText'] : __( 'News:', 'news-ticker' );

if ( $select_all_categories && ! empty( $selected_categories ) ) {
	$taxonomies = get_object_taxonomies( $post_type, 'objects' );
	$tax_query = array();
	
	if ( ! empty( $taxonomies ) ) {
		foreach ( $taxonomies as $taxonomy ) {
			if ( $taxonomy->publicly_queryable ) {
				$tax_query[] = array(
					'taxonomy' => $taxonomy->name,
					'field' => 'term_id',
					'terms' => $selected_categories,
				);
				break;
			}
		}
	}
	
	$args = array(
		'post_type' => $post_type,
		'posts_per_page' => -1,
		'post_status' => 'publish',
		'orderby' => 'date',
		'order' => 'DESC',
	);
	
	if ( ! empty( $tax_query ) ) {
		$args['tax_query'] = $tax_query;
	}
} elseif ( ! empty( $selected_posts ) ) {
	$args = array(
		'post_type' => $post_type,
		'post__in' => $selected_posts,
		'posts_per_page' => -1,
		'post_status' => 'publish',
		'orderby' => 'post__in',
	);
} else {
	return;
}

$query = new WP_Query( $args );

if ( ! $query->have_posts() ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array(
	'data-speed' => esc_attr( $speed ),
	'data-enable-click' => esc_attr( $enable_click ? '1' : '0' ),
	'style' => sprintf(
		'background-color: %s; color: %s;',
		esc_attr( $background_color ),
		esc_attr( $text_color )
	),
) );

$item_style = sprintf(
	'color: %s; font-size: %spx; font-weight: %s;%s',
	esc_attr( $text_color ),
	esc_attr( $font_size ),
	esc_attr( $font_weight ),
	$font_family ? ' font-family: ' . esc_attr( $font_family ) . ';' : ''
);

$item_class = $enable_click ? 'news-ticker-item' : 'news-ticker-item no-click';
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>>

	<div class="news-ticker-wrapper">
		<div class="news-ticker-label" style="background-color: rgba(0, 0, 0, 0.2); color: <?php echo esc_attr( $text_color ); ?>;">
			<?php echo esc_html( $heading_text ); ?>
		</div>
		<div class="news-ticker-content">
			<div class="news-ticker-items" style="--ticker-speed: <?php echo esc_attr( $speed ); ?>s;">
				<?php
				while ( $query->have_posts() ) {
					$query->the_post();
					?>
					<span class="<?php echo esc_attr( $item_class ); ?>" style="<?php echo esc_attr( $item_style ); ?>">
						<?php if ( $enable_click ) : ?>
							<a href="<?php echo esc_url( get_permalink() ); ?>">
								<?php echo esc_html( get_the_title() ); ?>
							</a>
						<?php else : ?>
							<?php echo esc_html( get_the_title() ); ?>
						<?php endif; ?>
					</span>
					<?php
				}
				wp_reset_postdata();
				?>
			</div>
			</div>
	</div>
</div>
