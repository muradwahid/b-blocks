<?php
if ( ! class_exists( 'BBlocksDocumentEmbedHandler' ) ) {
	return;
}

$id = wp_unique_id( 'document-embed-' );
// Texts are shown as text by the page script (React escapes them; overlay text goes in as textContent), so they are
// kept as written: run through the HTML filter, "Q&A <draft>" would show as "Q&amp;A " on the page but as typed in the
// editor. The two messages that are HTML (access.message, download.deniedMessage) stay filtered, and wp_kses_post below.
$attributes = BBlocksDocumentEmbedHandler::settings( BBlocks\Inc\Sanitize::attributes( $attributes, [ 'name', 'buttonText', 'label', 'filename', 'content', 'alt' ] ), $block->block_type );

if ( '' === $attributes['document']['url'] ) {
	return;
}

$postId   = (int) get_the_ID();
$docKey   = BBlocksDocumentEmbedHandler::docKey( $postId, $attributes['blockId'] );
$access   = $attributes['access'];
$download = $attributes['download'];
$visitor  = [
	'postId'         => $postId,
	// Inside a Query Loop the post above is the loop item; the page being viewed holds the block.
	'pageId'         => is_singular() ? (int) get_queried_object_id() : 0,
	'accessDenied'   => false,
	'downloadDenied' => false,
	'downloadCount'  => 0,
	'secure'         => false,
];

// View access: a visitor who may not see the document never gets its URL in the page.
if ( ! BBlocksDocumentEmbedHandler::allowed( $access['view'], $access['roles'] ) ) {
	$attributes['document'] = array_merge( $attributes['document'], [ 'id' => 0, 'url' => '', 'name' => '', 'mime' => '', 'size' => '' ] );
	$attributes['overlays'] = [];
	$visitor['accessDenied'] = true;
	$attributes['access']['message'] = wp_kses_post( $access['message'] );
} else {
	// Secure viewing: the viewer asks for an IP-bound link when it mounts; the file's own URL stays out of the page,
	// and so does its attachment id (?attachment_id= or the media REST route would lead straight to the file).
	if ( BBlocksDocumentEmbedHandler::isSecure( $attributes ) ) {
		$attributes['document']['url'] = '';
		$attributes['document']['id']  = 0;
		$visitor['secure'] = true;
	}

	if ( $attributes['toolbar']['showDownload'] ) {
		if ( ! BBlocksDocumentEmbedHandler::allowed( $download['access'], $download['roles'] ) ) {
			$visitor['downloadDenied'] = true;
			$attributes['download']['deniedMessage'] = wp_kses_post( $download['deniedMessage'] );
		}

		// The per-IP limit is not written into the page: a cached page would show one visitor's
		// "Limit Reached" to everyone. The server refuses on click, and the button updates then.
		$visitor['downloadCount'] = $download['showCount'] ? BBlocksDocumentEmbedHandler::downloadCount( $docKey ) : 0;
	}
}

$attributes['visitor'] = $visitor;

// The page script has no wp-i18n: its texts arrive translated with it.
BBlocksDocumentEmbedHandler::printLabels( 'b-blocks-document-embed-view-script' );

// dFlip only for the PDF flipbook / slider engines.
if ( ! $visitor['accessDenied'] && in_array( $attributes['viewer']['engine'], [ 'flipbook', 'slider' ], true ) ) {
	wp_enqueue_script( 'bBlocksDflip' );
	wp_enqueue_style( 'bBlocksDflip' );
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
></div>