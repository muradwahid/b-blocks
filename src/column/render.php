<?php
$prefix = 'bBlocksColumn';
$id = wp_unique_id( "$prefix-" );

use BBlocks\Inc\Utils as Utils;
$planClass = Utils::isPro() ? 'pro' : 'free';

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?> 
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
	data-columns='<?php echo esc_attr( $block->context['b-blocks/rowColumns'] ); ?>'
	data-column-gap='<?php echo esc_attr( $block->context['b-blocks/rowColumnGap'] ); ?>'
>

	<div class='<?php echo esc_attr( $prefix ); ?>'>
		<?php echo wp_kses( $content, Utils::allowedInnerHTML() ); ?>
	</div>
</div>