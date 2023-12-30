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

		wp_enqueue_style( 'b-blocks-td-viewer-style' );
		wp_enqueue_script( 'b-blocks-td-viewer-script', B_BLOCKS_DIST . '3d-viewer.js', [ 'react', 'react-dom', 'modelViewer' ], B_BLOCKS_VERSION, true );
		wp_set_script_translations( 'b-blocks-td-viewer-script', 'b-blocks', B_BLOCKS_DIR_PATH . 'languages' );

		$className = $className ?? '';
		$planClass = BBlocks\Inc\BBlocksUtils::isPro() ? 'pro' : 'free';
		$blockClassName = "wp-block-b-blocks-td-viewer $className $planClass align$align";

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='bBlocks3DViewer-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
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