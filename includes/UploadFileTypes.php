<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class UploadFileTypes
{
	function __construct() {
		add_filter( 'upload_mimes', [$this, 'uploadMimes'] );
		add_filter( 'wp_check_filetype_and_ext', [$this, 'wpCheckFiletypeAndExt'], 10, 5 );
		add_action( 'wp_ajax_b-blocks-enable-svg-mime-type', [$this, 'enableSvgMimeType'] );
		add_filter( 'wp_handle_upload_prefilter', [$this, 'sanitizeSvgUpload'] );
	}

	private function svgTransientKey() {
		return 'b_blocks_svg_' . get_current_user_id();
	}
	//Allow some additional file types for upload
	function uploadMimes($mimes) {
		$mimes['glb'] = 'model/gltf-binary'; // 3D Viewer
		$mimes['gltf'] = 'model/gltf-binary'; // 3D Viewer
		$mimes['json'] = 'application/json'; // Lottie Player
		$mimes['lottie'] = 'application/json'; // Lottie Player
		if (current_user_can('manage_options') && get_transient($this->svgTransientKey()) === 'true') {
			$mimes['svg'] = 'image/svg+xml';
		}
		return $mimes;
	}

	function wpCheckFiletypeAndExt($data, $file, $filename, $mimes, $real_mime = null) {

		$f_sp = explode('.', $filename);
		$f_exp_count = count($f_sp);

		if ($f_exp_count <= 1) {
			return $data;
		} else {
			$f_name = $f_sp[0];
			$ext = $f_sp[$f_exp_count - 1];
		}

		if ( 'glb' === $ext || 'gltf' === $ext ) { // 3D Viewer
			$type = 'model/gltf-binary';
			$proper_filename = '';
			return compact('ext', 'type', 'proper_filename');
		} elseif ( 'json' === $ext || 'lottie' === $ext ) { // Lottie Player
			$type = 'application/json';
			$proper_filename = '';
			return compact('ext', 'type', 'proper_filename');
		} else {
			return $data;
		}
	}

	public function sanitizeSvgUpload( $file ) {

		if ( ! empty( $file['error'] ) ) {
			return $file;
		}

		$name = isset( $file['name'] ) && is_string( $file['name'] ) ? $file['name'] : '';
		$type = isset( $file['type'] ) && is_string( $file['type'] ) ? $file['type'] : '';

		$ext = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
		if ( 'svg' !== $ext && 'svgz' !== $ext && 'image/svg+xml' !== $type ) {
			return $file;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			$file['error'] = __( 'You are not allowed to upload SVG files.', 'b-blocks' );
			return $file;
		}

		$tmp = $file['tmp_name'] ?? '';
		if ( ! is_string( $tmp ) || '' === $tmp || ! is_file( $tmp ) || ! $this->isSafeTempPath( $tmp ) ) {
			$file['error'] = __( 'The uploaded SVG could not be read.', 'b-blocks' );
			return $file;
		}

		$maxBytes = (int) apply_filters( 'b_blocks_svg_max_bytes', 2 * 1024 * 1024 );
		if ( $maxBytes > 0 && (int) filesize( $tmp ) > $maxBytes ) {
			$file['error'] = sprintf( __( 'SVG files must be smaller than %s.', 'b-blocks' ), size_format( $maxBytes ) );
			return $file;
		}

		$dirty = file_get_contents( $tmp );
		if ( false === $dirty || '' === trim( $dirty ) ) {
			$file['error'] = __( 'This SVG file is empty or could not be read.', 'b-blocks' );
			return $file;
		}

		if ( 0 === strncmp( $dirty, "\x1f\x8b", 2 ) ) {
			$file['error'] = __( 'Compressed SVG (.svgz) files cannot be sanitized. Please upload an uncompressed .svg file.', 'b-blocks' );
			return $file;
		}

		$sanitizer = Sanitize::sanitizer();
		if ( ! $sanitizer ) {
			$file['error'] = __( 'SVG uploads are unavailable because the sanitizer is missing.', 'b-blocks' );
			return $file;
		}

		try {
			$clean = $sanitizer->sanitize( $dirty );
		} catch ( \Throwable $e ) {
			$clean = false;
		}

		if ( ! is_string( $clean ) || '' === trim( $clean ) ) {
			$file['error'] = __( 'This SVG file could not be sanitized.', 'b-blocks' );
			return $file;
		}

		if ( ! Sanitize::isSafe( $clean ) ) {
			$file['error'] = __( 'This SVG file could not be sanitized.', 'b-blocks' );
			return $file;
		}

		if ( false === file_put_contents( $tmp, $clean ) ) {
			$file['error'] = __( 'The sanitized SVG could not be saved.', 'b-blocks' );
			return $file;
		}

		do_action( 'b_blocks_svg_sanitized', $sanitizer->getXmlIssues(), $file );

		return $file;
	}

	private function isSafeTempPath( $tmp ) {
		if ( is_uploaded_file( $tmp ) ) {
			return true;
		}

		$real = realpath( $tmp );
		$temp = realpath( get_temp_dir() );

		return $real && $temp && 0 === strpos( $real, rtrim( $temp, '/\\' ) . DIRECTORY_SEPARATOR );
	}

	public function enableSvgMimeType() {
		if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'] ?? null)), 'wp_ajax')) {
			wp_send_json_error();
		}

		if (!current_user_can('manage_options')) {
			wp_send_json_error(null, 403);
		}

		set_transient( $this->svgTransientKey(), 'true', 80 );
		wp_send_json_success();
	}
}

new UploadFileTypes();