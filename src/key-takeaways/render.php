<?php
/**
 * Key Takeaways Block — server-side render.
 *
 * Emits only a wrapper carrying the block attributes as a JSON data-attribute.
 * view.js hydrates it on the frontend with React (Components/Frontend/KeyTakeaways)
 * and injects per-instance dynamic CSS (Components/Common/Style).
 *
 * @package bBlocks
 */

$id        = wp_unique_id( 'bBlocksKeyTakeaways-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
