<?php
if ( ! class_exists( 'BBlocksDocumentEmbedHandler' ) ) {
	return;
}

$id = wp_unique_id( 'document-library-' );
// Texts are shown as text by the page script (React escapes them), so they are kept as written: run through the
// HTML filter, "Report <final> & notes" would show as "Report  &amp; notes" on the page but as typed in the editor.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes, [ 'title', 'description', 'author', 'category', 'date', 'size', 'text' ] );

// Keys added to block.json after the block was saved.
$attributes = BBlocksDocumentEmbedHandler::withDefaults( $attributes, $block->block_type );

// New badge: Media Library documents uploaded within this many days (0 = off). Worked out when the page is built,
// so a cached page keeps its badges until the cache is refreshed.
$newDays = absint( $attributes['itemOptions']['newDays'] ?? 0 );

$uploadsUrl = trailingslashit( wp_get_upload_dir()['baseurl'] );

// Items saved with only an address of a file on this site are linked to their Media Library file, so size, date and
// author come from it (the editor does the same when the address is picked or pasted). Only addresses in this site's
// uploads can be Media Library files. Each lookup is a query, so the answers (a file found or not) are kept for a day:
// a list of 60 such links costs one query on later views instead of 60.
$linked   = [];
$toLookUp = [];
foreach ( (array) ( $attributes['items'] ?? [] ) as $item ) {
	if ( is_array( $item ) && empty( $item['hidden'] ) && 0 === absint( $item['id'] ?? 0 ) && 0 === strpos( (string) ( $item['url'] ?? '' ), $uploadsUrl ) ) {
		$toLookUp[ (string) $item['url'] ] = true;
	}
}
if ( $toLookUp ) {
	$cacheKey = 'bb_dl_ids_' . md5( implode( '|', array_keys( $toLookUp ) ) );
	$linked   = get_transient( $cacheKey );
	if ( ! is_array( $linked ) ) {
		$linked = [];
		foreach ( array_keys( $toLookUp ) as $url ) {
			$linked[ $url ] = (int) attachment_url_to_postid( $url );
		}
		set_transient( $cacheKey, $linked, DAY_IN_SECONDS );
	}
}

// One query for every Media Library item (saved or found by address) instead of one per item.
_prime_post_caches( array_filter( array_merge( array_map( 'absint', wp_list_pluck( array_filter( (array) ( $attributes['items'] ?? [] ), 'is_array' ), 'id' ) ), array_values( $linked ) ) ), false, true );

// Each item: the attachment wins over client-saved values, and a URL with a disallowed
// scheme (javascript:, data:, …) drops the item.
$items = [];
foreach ( is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [] as $item ) {
	// Hidden items stay in the block for later, but never reach the page.
	if ( ! is_array( $item ) || ! empty( $item['hidden'] ) ) {
		continue;
	}

	// An item saved with only an address: its Media Library file, found above.
	if ( 0 === absint( $item['id'] ?? 0 ) && isset( $linked[ (string) ( $item['url'] ?? '' ) ] ) ) {
		$item['id'] = $linked[ (string) $item['url'] ];
	}

	$document = BBlocksDocumentEmbedHandler::document( [
		'id'   => $item['id'] ?? 0,
		'url'  => $item['url'] ?? '',
		'name' => $item['title'] ?? '',
		'mime' => $item['mime'] ?? '',
		'size' => $item['size'] ?? '',
	] );

	$attachmentId = absint( $item['id'] ?? 0 );
	$isAttachment = $attachmentId > 0 && 'attachment' === get_post_type( $attachmentId );
	$path         = $isAttachment ? get_attached_file( $attachmentId ) : '';

	// A Media Library file deleted since the block was saved: its old URL is a dead link.
	if ( '' === $document['url'] || ( $attachmentId > 0 && ! $isAttachment ) ) {
		continue;
	}

	$image = is_array( $item['image'] ?? null ) ? $item['image'] : [];

	$items[] = [
		'id'          => $attachmentId,
		'url'         => $document['url'],
		// An emptied title shows the file name, as the editor does.
		'title'       => '' !== trim( (string) ( $item['title'] ?? '' ) ) ? (string) $item['title'] : rawurldecode( wp_basename( (string) preg_replace( '/[?#].*$/', '', $document['url'] ) ) ),
		'description' => (string) ( $item['description'] ?? '' ),
		'mime'        => (string) $document['mime'],
		'size'        => (string) $document['size'],
		// The date format the Media Library gives the editor (WordPress core string), so editor and page match.
		// phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- deliberately the core translation of the Media Library format.
		'date'        => $isAttachment ? mysql2date( __( 'F j, Y' ), get_post_field( 'post_date', $attachmentId ) ) : (string) ( $item['date'] ?? '' ),
		// Only when the author is shown: otherwise the uploader's name would sit in the page source.
		'author'      => empty( $attributes['itemOptions']['showAuthor'] ) ? '' : ( $isAttachment ? get_the_author_meta( 'display_name', get_post_field( 'post_author', $attachmentId ) ) : (string) ( $item['author'] ?? '' ) ),
		'category'    => sanitize_text_field( (string) ( $item['category'] ?? '' ) ),
		'featured'    => ! empty( $item['featured'] ),
		'viewAction'  => in_array( $item['viewAction'] ?? '', [ 'modal', 'newtab' ], true ) ? $item['viewAction'] : '',
		'image'       => [
			'id'  => absint( $image['id'] ?? 0 ),
			'url' => esc_url_raw( BBlocksDocumentEmbedHandler::safeUrl( (string) ( $image['url'] ?? '' ) ) ),
		],
		// Raw values for sorting; the display strings above are localized.
		'time'        => $isAttachment ? (int) get_post_time( 'U', true, $attachmentId ) : 0,
		'bytes'       => is_string( $path ) && '' !== $path && file_exists( $path ) ? (int) filesize( $path ) : 0,
		'isNew'       => $newDays > 0 && $isAttachment && (int) get_post_time( 'U', true, $attachmentId ) >= time() - $newDays * DAY_IN_SECONDS,
	];
}

$attributes['items']     = $items;
$attributes['assetsUrl'] = B_BLOCKS_ASSETS;

// The page script has no wp-i18n: its texts (and the popup viewer's) arrive translated with it.
BBlocksDocumentEmbedHandler::printLabels( 'b-blocks-document-library-view-script' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
></div>