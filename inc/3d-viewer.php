<?php
class BBlocks3DViewer extends BBlocks{
    public function __construct(){
        add_action( 'init', [$this, 'register'] );

        add_filter( 'upload_mimes', [$this, 'uploadMimes'] );
        if ( version_compare( $GLOBALS['wp_version'], '5.1' ) >= 0 ) {
            add_filter( 'wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 5 );
        } else { add_filter( 'wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 4 ); }
    }

    function register(){
        $this::registerScripts( 'td-viewer', [
            'render_callback' => [$this, 'render']
        ] );
    }

    function render( $attributes ){
        extract( $attributes );
        $align = $align ?? '';
        $cId = $cId ?? '';
        $alignment = $alignment ?? 'center';
        $sourceType = $sourceType ?? 'upload';
        $model = $model ?? [ 'id' => null, 'url' => '', 'title' => '' ];
        $modelLink = $modelLink ?? 'https://modelviewer.dev/shared-assets/models/shishkebab.glb';
        $width = $width ?? '100%';
        $height = $height ?? '350px';
        $isTouchMove = $isTouchMove ?? true;
        $isZoom = $isZoom ?? true;
        $loadingType = $loadingType ?? 'auto';

        // Generate Styles
        $tDViewerStyle = new BBlocksStyleGenerator(); // Generate Styles
        $tDViewerStyle::addStyle( "#bBlocks3DViewer-$cId .bBlocks3DViewer", [
            'text-align' => $alignment
        ] );
        $tDViewerStyle::addStyle( "#bBlocks3DViewer-$cId .bBlocks3DViewer .bBlocksModel", [
            'width' => '0px' === $width || '0%' === $width || '0em' === $width ? 'auto' : $width,
            'height' => '0px' === $height || '0%' === $height || '0em' === $height ? '350px' : $height,
        ] );

        $jsonData = wp_json_encode( [ 'isTouchMove' => $isTouchMove, 'isZoom' => $isZoom ] );

        ob_start(); ?>
        <div class='wp-block-b-blocks-td-viewer <?php echo 'align' . esc_attr( $align ); ?>' id='bBlocks3DViewer-<?php echo esc_attr( $cId ) ?>' data-model='<?php echo esc_attr( $jsonData ); ?>'>
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