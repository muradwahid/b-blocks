<?php
class BBlocks3DViewer extends BBlocks{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );

		add_filter( 'upload_mimes', [$this, 'uploadMimes'] );
		if ( version_compare( $GLOBALS['wp_version'], '5.1' ) >= 0 ) {
			add_filter( 'wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 5 );
		} else { add_filter( 'wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 4 ); }
	}

	function onInit(){
		register_block_type( __DIR__, [
			'render_callback' => [$this, 'render']
		] ); // Register Block
	}

	function render( $attributes ){
		extract( $attributes );

		$className = $className ?? '';
		$bBlocks3DViewerClassName = 'wp-block-b-blocks-td-viewer ' . $className . ' align' . $align;

		// Generate Styles
		$tDViewerStyle = new BBlocksStyleGenerator();
		$tDViewerStyle::addStyle( "#bBlocks3DViewer-$cId .bBlocks3DViewer", [
			'text-align' => $alignment
		] );
		$tDViewerStyle::addStyle( "#bBlocks3DViewer-$cId .bBlocks3DViewer .bBlocksModel", [
			'width' => '0px' === $width || '0%' === $width || '0em' === $width ? 'auto' : $width,
			'height' => '0px' === $height || '0%' === $height || '0em' === $height ? '350px' : $height,
		] );

		$jsonData = wp_json_encode( [ 'isTouchMove' => $isTouchMove, 'isZoom' => $isZoom ] );

		ob_start(); ?>
		<div class='<?php echo esc_attr( $bBlocks3DViewerClassName ); ?>' id='bBlocks3DViewer-<?php echo esc_attr( $cId ) ?>' data-model='<?php echo esc_attr( $jsonData ); ?>'>
			<style><?php echo wp_kses( $tDViewerStyle::renderStyle(), [] ) ?></style>

			<div class='bBlocks3DViewer'>
				<model-viewer
					class='bBlocksModel'
					src='<?php echo esc_url( 'upload' === $sourceType ? $model['url'] : $modelLink ); ?>'
					alt='<?php echo esc_attr( 'upload' === $sourceType ? $model['title'] : '' ); ?>'
					camera-controls
					loading='<?php echo esc_attr( $loadingType ); ?>'
					auto-rotate
				></model-viewer>
			</div> <!-- 3D Viewer Block -->
		</div>

		<?php $tDViewerStyle::$styles = []; // Empty styles
		return ob_get_clean();
	}

	//Allow some additional file types for upload
	function uploadMimes( $mimes ) {
		// New allowed mime types.
		$mimes['glb'] = 'model/gltf-binary';
		$mimes['gltf'] = 'model/gltf-binary';
		return $mimes;
	}
	function wpCheckFiletypeAndExt( $data, $file, $filename, $mimes, $real_mime=null ){
		// If file extension is 2 or more 
		$f_sp = explode( '.', $filename );
		$f_exp_count = count( $f_sp );

		if( $f_exp_count <= 1 ){
			return $data;
		}else{
			$f_name = $f_sp[0];
			$ext = $f_sp[$f_exp_count - 1];
		}

		if( $ext == 'glb' || $ext == 'gltf' ){
			$type = 'model/gltf-binary';
			$proper_filename = '';
			return compact('ext', 'type', 'proper_filename');
		}else {
			return $data;
		}
	}
}
new BBlocks3DViewer();