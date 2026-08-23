<?php
$id = wp_unique_id( 'bBlocksCarouselSlide-' );
?>
<div <?php echo get_block_wrapper_attributes(['class' => 'swiper-slide']); ?> id='<?php echo esc_attr( $id ); ?>'>
  <?php echo $content; ?>
</div>