<?php
if (is_user_logged_in()){
  $button = $attributes['button'];
  $signout = $button['signout'];
  ?>
			<div><h3><?php echo esc_html($signout['text']['first']); ?> <a class="lgfr-logoutBtn" href="<?php echo esc_url(wp_logout_url(home_url())); ?>"><?php echo esc_html($signout['text']['second']); ?></a></h3></div>
		<?php
}else {
  $id = wp_unique_id( 'bBlocksBForm-' );
 ?>
 <div <?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>

 <div id='bFormPhpGetContent'>
   <?php echo $content; ?>
 </div>
</div>
<?php
}