<?php
class BBlocksSocialShare extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes ){
		extract( $attributes );

		$className = $className ?? '';
		$bBlocksSocialShareClassName = 'wp-block-b-blocks-social-share ' . $className . ' align' . $align;

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocksSocialShareClassName ); ?>' id='bBlocksSocialShare-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'>
			<div class='socialShareStyle'></div>

			<ul class='bBlocksSocialShare'>
				<?php foreach ( $socials as $index => $social ) {
					extract( $social );
					// Classes
					$upIconClass = isset( $upIcon['id'] ) ? 'wp-image-'.$upIcon['id'] : '';
					$upIconEl = !empty( $upIcon['url'] ) ? "<img class='$upIconClass' src='". $upIcon['url'] ."' alt='". $upIcon['alt'] ."' />" : '';
					$iconEl = !empty( $icon['class'] ) ? "<i class='". $icon['class'] ."'></i>" : '';
					$filterIconEl = $isUpIcon ? $upIconEl : $iconEl; ?>

					<li class='icon icon-<?php echo esc_attr( $index ); ?>' data-social='<?php echo esc_attr( $network ); ?>'>
						<?php echo wp_kses_post( $filterIconEl ); ?>
					</il>
				<?php } ?>
			</ul>
		</div>

		<?php return ob_get_clean();
	}
}
new BBlocksSocialShare();