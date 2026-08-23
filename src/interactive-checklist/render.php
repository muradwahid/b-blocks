<?php
/**
 * Interactive Checklist Block — server-side render.
 *
 * Emits only a wrapper carrying the block attributes as a JSON data-attribute.
 * view.js hydrates it on the frontend with React (Components/Frontend/Checklist)
 * and injects per-instance dynamic CSS (Components/Common/Style). Checked state
 * persists per instance in localStorage.
 *
 * @package bBlocks
 */

$id        = wp_unique_id( 'bBlocksInteractiveChecklist-' );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
