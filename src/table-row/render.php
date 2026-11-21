<?php
// Attribute HTML is shown as HTML in the browser: unsafe markup out for authors without unfiltered_html.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
$id = wp_unique_id( 'bBlocksTableRow-' );

$normalBg = $attributes['styles']['normal']['bg'];
$hoverBg = $attributes['styles']['hover']['bg'];
if ( ! function_exists( 'b_blocks_table_cell_isValidCSS' ) ) {
	function b_blocks_table_cell_isValidCSS($property, $value) {
		if ( empty( $value ) && $value !== '0' && $value !== 0 ) {
			return '';
		}
		return "$property: $value;";
	}

	function b_blocks_table_cell_getBackgroundCSS( $bg, $isSolid = true, $isGradient = true, $isImage = true ) {
		if ( ! is_array( $bg ) ) {
			$bg = array();
		}
		extract( $bg );
		$type = $type ?? 'solid';
		$color = $color ?? '';
		$gradient = $gradient ?? 'linear-gradient(135deg, #0040E3, #18D4FD)';
		$image = $image ?? [];
		$position = $position ?? 'center center';
		$attachment = $attachment ?? '';
		$repeat = $repeat ?? '';
		$size = $size ?? '';
		$overlayColor = $overlayColor ?? '';

		if ( 'gradient' === $type && $isGradient ) {
			$styles = b_blocks_table_cell_isValidCSS('background', $gradient);
		} elseif ( 'image' === $type && $isImage ) {
			$imgUrl = $image['url'] ?? '';
			$styles = "background: url($imgUrl);"
				. b_blocks_table_cell_isValidCSS('background-color', $overlayColor)
				. b_blocks_table_cell_isValidCSS('background-position', $position)
				. b_blocks_table_cell_isValidCSS('background-size', $size)
				. b_blocks_table_cell_isValidCSS('background-repeat', $repeat)
				. b_blocks_table_cell_isValidCSS('background-attachment', $attachment)
				. b_blocks_table_cell_isValidCSS('background-repeat', $repeat)
				. "background-blend-mode: overlay;";
		} else {
			$styles = $isSolid ? b_blocks_table_cell_isValidCSS('background', $color) : '';
		}

		return $styles;
	}
}
?>

<style>
  #<?php echo esc_attr( $id ); ?> {
    <?php echo b_blocks_table_cell_getBackgroundCSS($normalBg); ?>
    transition: background <?php echo esc_attr( $hoverBg['transition'] ); ?>s ease-in-out;
  }
  #<?php echo esc_attr( $id ); ?>:hover {
    <?php echo b_blocks_table_cell_getBackgroundCSS($hoverBg); ?>
  }
</style>

<tr <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>
	<?php echo $content; ?>
</tr>