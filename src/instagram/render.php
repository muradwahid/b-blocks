<?php
/**
 * Instagram block server-side render.
 *
 * Emits only an empty wrapper carrying the block attributes as JSON. The markup
 * is rendered on the client by view.js from the same shared component the editor
 * uses, matching the b-blocks convention (see image-hotspot / code-highlight).
 *
 * No credential is written here: the access token lives in a site option and the
 * feed is fetched through includes/Instagram.php.
 *
 * @package bBlocks
 */

$prefix = 'b-blocks-instagram';
$id = wp_unique_id( 'bBlocksInstagram-' );

$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes([ 'class' => $planClass ]); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
