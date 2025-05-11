<?php
extract($attributes);
    $id = wp_unique_id('bBlocksLoginForm-');
?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr($id); ?>'
	data-logged='<?php echo esc_attr( wp_json_encode( [ 'isLoggedIn' => is_user_logged_in(), 'logoutUrl' => esc_url( wp_logout_url( $additional['logoutRedirect'] ) ) ] ) ); ?>'
	data-attributes='<?php echo esc_attr(wp_json_encode($attributes)); ?>'
></div>