<?php
/**
 * Timeline Block server-side render.
 *
 * Only the wrapper and the entries are written here — no classes and no
 * styles. Both are applied on the client from the attributes forwarded in
 * `data-attributes`: the wrapper's classes by Components/Frontend/Timeline.js
 * and every style by Components/Common/Style.js, the same way the Data Table
 * block renders.
 *
 * That leaves the class list with a single source of truth in
 * utils/functions.js rather than a copy here that has to be kept in step.
 *
 * The entries are InnerBlocks, so they are rendered into a holder that
 * view.js adopts into the React tree rather than re-creating.
 *
 * @package bBlocks
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered inner blocks.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$id = wp_unique_id( 'timeline-' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
>
	<div class='b-blocks-timeline-innerBlocks-contents'>
		<div class='b-blocks-timeline-items'>
			<?php
			// $content is the rendered inner blocks — a series of Timeline
			// Items, each of which escaped its own output in its render.php.
			echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks render their own escaped markup
			?>
		</div>
	</div>
</div>
