<?php

$id = wp_unique_id('bBlocksToggleContent-');

$inner_blocks = $block->parsed_block['innerBlocks'] ?? [];

$label_left  = $attributes['label']['left']  ?? '';
$label_right = $attributes['label']['right'] ?? '';
$switch_type = $attributes['toggle']['switchType'] ?? 'rounded';

$panel_a_html = isset($inner_blocks[0]) ? render_block($inner_blocks[0]) : '';
$panel_b_html = isset($inner_blocks[1]) ? render_block($inner_blocks[1]) : '';

?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
	id="<?php echo esc_attr($id); ?>"
	data-attributes="<?php echo esc_attr(wp_json_encode($attributes)); ?>"
>
	<div class="b-blocks-toggle-content__wrapper is-a">
		<div class="b-blocks-toggle-content__head">
			<div class="b-blocks-toggle-content-switch__wrapper">
				<span
					class="b-blocks-toggle-content__label b-blocks-toggle-content__label--left"
					data-toggle-target="a"
				>
					<?php echo wp_kses_post($label_left); ?>
				</span>

				<div
					class="b-blocks-toggle-content__switch b-blocks-toggle-content-switch-<?php echo esc_attr($switch_type); ?>"
					aria-label="<?php echo esc_attr__('Toggle content', 'b-blocks'); ?>"
					data-toggle-switch
				>
					<div class="b-blocks-toggle-content__knob"></div>
				</div>

				<span
					class="b-blocks-toggle-content__label b-blocks-toggle-content__label--right "
					data-toggle-target="b"
				>
					<?php echo wp_kses_post($label_right); ?>
				</span>
			</div>
		</div>

		<div class="b-blocks-toggle-content__content">
				<?php echo $panel_a_html; ?>
				<?php echo $panel_b_html; ?>
		</div>
	</div>
</div>
