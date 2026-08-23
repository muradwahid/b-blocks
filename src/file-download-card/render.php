<?php

$id = wp_unique_id( 'file-download-card-' );

$file = isset( $attributes['file'] ) && is_array( $attributes['file'] ) ? $attributes['file'] : [];

$fileId  = isset( $file['id'] ) ? absint( $file['id'] ) : 0;
$fileUrl = isset( $file['url'] ) ? esc_url_raw( (string) $file['url'] ) : '';
$fileName = isset( $file['name'] ) ? (string) $file['name'] : '';
$fileMime = isset( $file['type'] ) ? (string) $file['type'] : '';
$fileSize = isset( $file['size'] ) ? (string) $file['size'] : '';

if ( $fileId > 0 ) {
	// Trust the attachment id over client-saved values.
	$resolvedUrl = wp_get_attachment_url( $fileId );
	if ( is_string( $resolvedUrl ) && '' !== $resolvedUrl ) {
		$fileUrl = esc_url_raw( $resolvedUrl );
	}

	$resolvedMime = get_post_mime_type( $fileId );
	if ( is_string( $resolvedMime ) && '' !== $resolvedMime ) {
		$fileMime = $resolvedMime;
	}

	if ( '' === trim( $fileName ) ) {
		$attTitle = get_the_title( $fileId );
		if ( is_string( $attTitle ) && '' !== $attTitle ) {
			$fileName = $attTitle;
		}
	}

	// Resolve a real, human-readable size from the file on disk.
	$attPath = get_attached_file( $fileId );
	if ( is_string( $attPath ) && '' !== $attPath && file_exists( $attPath ) ) {
		$bytes = filesize( $attPath );
		if ( false !== $bytes && $bytes > 0 ) {
			$fileSize = size_format( $bytes, 1 );
		}
	}
}

// Nothing usable to download — render nothing.
if ( '' === $fileUrl ) {
	return;
}

// Merge the resolved file fields back into the attributes handed to React.
$attributes['file'] = array_merge(
	$file,
	[
		'url'  => $fileUrl,
		'name' => $fileName,
		'type' => $fileMime,
		'size' => $fileSize,
	]
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>
