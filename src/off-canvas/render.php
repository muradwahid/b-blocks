<?php

$id        = wp_unique_id( 'bBlocksOffCanvas-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
>
	<div class='b-blocks-off-canvas-innerBlocks-contents'>
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered InnerBlocks output already escaped by core.
		echo $content;
		?>
	</div>
</div>
