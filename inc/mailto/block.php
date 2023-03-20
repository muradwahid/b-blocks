<?php
class BBlocksMailto extends BBlocks{
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
		$blockClassName = 'wp-block-b-blocks-mailto ' . $className . ' align' . $align;

		// Generate Styles
		$mailtoStyle = new BBlocksStyleGenerator();
		$mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto", [
			'text-align' => $mailtoAlign
		] );
		$mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto a.mailtoButton", [
			$btnTypo['styles'] ?? 'font-size: 22px; font-weight: 600;' => '',
			$btnColors['styles'] ?? 'color: #fff; background: #4527a4;' => '',
			'padding' => $btnPadding['styles'] ?? '18px 45px',
			$btnBorder['styles'] ?? 'border-radius: 50px;' => '',
			'box-shadow' => '0px 5px 20px 0px '. $btnColors['bg']
		] );
		$mailtoStyle::addStyle( "#bBlocksMailto-$cId .bBlocksMailto a.mailtoButton:hover", [
			$btnHovColors['styles'] ?? 'color: #fff; background: #8344c5;' => '',
			'box-shadow' => '0px 5px 20px 0px '. $btnHovColors['bg']
		] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocksMailto-<?php echo esc_attr( $cId ); ?>'>
			<style>
				<?php echo !empty( $btnTypo['googleFontLink'] ) ? "@import url(". esc_url( $btnTypo['googleFontLink'] ) .");" : ''; ?>
				<?php echo wp_kses( $mailtoStyle::renderStyle(), [] ); ?>
			</style>

			<div class='bBlocksMailto'>
				<a href='<?php echo 'mailto:' .sanitize_email( $receiverMail ); ?>' class='mailtoui mailtoButton'>
					<?php echo 'left' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>

					<span><?php echo wp_kses_post( $btn ); ?></span>

					<?php echo 'right' === $iconPosition && $icon['class'] ? "<i class='". esc_html( $icon['class'] ) ."'></i>" : ''; ?>
				</a>
			</div>
		</div>
		<?php $mailtoStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}
}
new BBlocksMailto();