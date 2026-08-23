<?php
/**
 * Comparison Table block server-side render.
 *
 * Emits an empty wrapper carrying the block attributes; view.js hydrates it
 * with React (Components/Common/Style.js + Components/Frontend/ComparisonTable.js),
 * which is the same component the editor renders. The table markup used to be
 * duplicated here in PHP and had to be kept in step with the editor by hand.
 *
 * @package bBlocks
 *
 * @var array $attributes Block attributes.
 */

$prefix    = 'bBlocksComparisonTable';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
