<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$id = wp_unique_id( 'bBlocksMediaTextSection-' );
use BBlocks\Inc\Utils as Utils;
$planClass = Utils::isPro() ? 'pro' : 'free';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $planClass ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
>
  <div class="bBlocksMediaTextSectionInnerBlockContent">
     <?php echo $content; ?>
  </div>
</div>