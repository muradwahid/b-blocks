<?php

$prefix = 'b-blocks-one-page-navigation';
$id = wp_unique_id( 'bBlocksOnePageNavigation-' );
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$layout    = isset( $attributes['layout'] ) && is_array( $attributes['layout'] ) ? $attributes['layout'] : [];
$desktop   = isset( $layout['desktop'] ) && is_array( $layout['desktop'] ) ? $layout['desktop'] : [];
$posValue  = '' !== ( $desktop['position'] ?? '' ) ? $desktop['position'] : ( $layout['position'] ?? '' );
$vertValue = '' !== ( $desktop['verticalAlign'] ?? '' ) ? $desktop['verticalAlign'] : ( $layout['verticalAlign'] ?? '' );
$position  = in_array( $posValue, [ 'left', 'right' ], true ) ? $posValue : 'right';
$vertical  = in_array( $vertValue, [ 'top', 'center', 'bottom' ], true ) ? $vertValue : 'center';
$wrapClass = "$planClass $prefix-pos-$position $prefix-align-$vertical";

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes([ 'class' => $wrapClass ]); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>