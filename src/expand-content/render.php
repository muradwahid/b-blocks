<?php
/**
 * Expand Content block server-side render.
 *
 * Follows the data-table convention: the wrapper only carries the block id and
 * a JSON snapshot of the attributes. view.js mounts a React root on the wrapper
 * and the Frontend component (ExpandContent.js) moves the InnerBlocks content
 * ($content) out of the template container into its own tree.
 *
 * @package bBlocks
 */

$id = wp_unique_id( 'bBlocksExpandContent-' );
?>

<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>

	<div class="b-blocks-expand-content-innerBlocks-contents">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered InnerBlocks output already escaped by core.
		echo $content;
		?>
	</div>
</div>
