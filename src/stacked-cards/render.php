<?php
$id = wp_unique_id( 'bBlocksStackedCards-' );
?>
<div <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>
  <div class="b-blocks-stacked-cards-innerBlocks">
     <?php echo $content; ?>
  </div>
</div>