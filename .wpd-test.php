<?php
// Temporary server-side test for b-blocks/woo-product-details. Creates its own data and deletes it.
$errors = [];
set_error_handler( function ( $no, $str, $file, $line ) use ( &$errors ) {
	$errors[] = "$str @ " . basename( $file ) . ":$line";
	return true;
} );

$check = function ( $label, $ok ) {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
};

$block = '<!-- wp:b-blocks/woo-product-details /-->';

$product = new WC_Product_Simple();
$product->set_name( 'WPD Test Product' );
$product->set_status( 'publish' );
$product->set_description( "<p>Hello <strong>description</strong> &amp; more.</p>\n[caption]x[/caption]" );
$product->set_weight( '2' );
$attr = new WC_Product_Attribute();
$attr->set_name( 'Material' );
$attr->set_options( [ 'Cotton', 'Wool' ] );
$attr->set_visible( true );
$product->set_attributes( [ $attr ] );
$product->set_reviews_allowed( true );
$id = $product->save();

$review = wp_insert_comment( [
	'comment_post_ID'  => $id,
	'comment_author'   => 'Tester',
	'comment_content'  => 'Lovely product',
	'comment_approved' => 1,
	'comment_type'     => 'review',
] );
update_comment_meta( $review, 'rating', 4 );
WC_Comments::clear_transients( $id );

$empty = new WC_Product_Simple();
$empty->set_name( 'WPD Empty Product' );
$empty->set_status( 'publish' );
$empty->set_reviews_allowed( false );
$emptyId = $empty->save();

try {
	// A single product request.
	$GLOBALS['wp_query']     = new WP_Query( [ 'p' => $id, 'post_type' => 'product' ] );
	$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
	$GLOBALS['wp_query']->the_post();
	$beforePost     = $GLOBALS['post']->ID;
	$beforeComments = $GLOBALS['wp_query']->comments;

	$out = do_blocks( $block );
	$check( 'renders on a single product', false !== strpos( $out, 'wp-block-b-blocks-woo-product-details' ) );
	$check( 'description panel id tab-description', false !== strpos( $out, 'id="tab-description"' ) );
	$check( 'additional info panel', false !== strpos( $out, 'id="tab-additional_information"' ) );
	$check( 'reviews panel', false !== strpos( $out, 'id="tab-reviews"' ) );
	$check( 'description content through the_content', false !== strpos( $out, '<strong>description</strong>' ) );
	$check( 'description heading suppressed', false === strpos( $out, '<h2>Description</h2>' ) );
	$check( 'additional-info heading suppressed', false === stripos( $out, '<h2>Additional information</h2>' ) );
	$check( 'attributes table with weight', false !== strpos( $out, 'shop_attributes' ) && false !== strpos( $out, 'Cotton' ) && false !== stripos( $out, 'Weight' ) );
	$check( 'review listed', false !== strpos( $out, 'Lovely product' ) );
	$check( 'review form with #rating', false !== strpos( $out, 'id="rating"' ) && false !== strpos( $out, 'id="commentform"' ) );
	// As in a block theme: the template renders before wp_head registers WooCommerce's scripts.
	do_action( 'wp_enqueue_scripts' );
	$check( 'wc-single-product enqueued', wp_script_is( 'wc-single-product', 'enqueued' ) );
	$check( 'global post restored', $GLOBALS['post']->ID === $beforePost );
	$check( 'query comments restored', $GLOBALS['wp_query']->comments === $beforeComments );
	$check( 'no woocommerce tab classes', false === strpos( $out, 'woocommerce-tabs' ) && false === strpos( $out, 'wc-tabs' ) );

	preg_match( "/data-attributes='([^']*)'/", $out, $m );
	$data = json_decode( html_entity_decode( $m[1] ?? '', ENT_QUOTES ), true );
	$check( 'data-attributes JSON decodes', is_array( $data ) );
	$titles = array_column( $data['product']['tabs'] ?? [], 'title', 'key' );
	echo '     tab titles: ' . wp_json_encode( $titles ) . "\n";
	$check( 'reviews title counts', 'Reviews (1)' === ( $titles['reviews'] ?? '' ) );
	$check( 'tab order description, additional, reviews', [ 'description', 'additional_information', 'reviews' ] === array_keys( $titles ) );
	$check( 'padding passes the whitelist', '12px' === ( $data['tabTitle']['padding']['desktop']['top'] ?? '' ) );

	// Second instance on the same page: own ids, no second review form.
	$out2 = do_blocks( $block );
	$check( 'second instance has suffixed ids', false !== strpos( $out2, 'id="tab-description-2"' ) );
	$check( 'second instance leaves Reviews out', false === strpos( $out2, 'tab-reviews' ) && false === strpos( $out2, 'id="rating"' ) );

	// Toggles.
	$out3 = do_blocks( '<!-- wp:b-blocks/woo-product-details {"options":{"showDescription":false,"showAdditional":true,"showReviews":false}} /-->' );
	$check( 'only Additional info when the others are off', false !== strpos( $out3, 'data-tab="additional_information"' ) && false === strpos( $out3, 'data-tab="description"' ) );
	$out4 = do_blocks( '<!-- wp:b-blocks/woo-product-details {"options":{"showDescription":false,"showAdditional":false,"showReviews":false}} /-->' );
	$check( 'all off renders nothing', '' === trim( $out4 ) );

	// Hostile settings are dropped.
	$out5 = do_blocks( '<!-- wp:b-blocks/woo-product-details {"tabTitle":{"normal":{"color":"red;}</style><script>alert(1)</script>","border":{"width":"1px","style":"evil","color":"#000"}},"padding":{"desktop":{"top":"expression(x)"}}}} /-->' );
	preg_match( "/data-attributes='([^']*)'/", $out5, $m5 );
	$data5 = json_decode( html_entity_decode( $m5[1] ?? '', ENT_QUOTES ), true );
	$check( 'bad colour dropped', '' === ( $data5['tabTitle']['normal']['color'] ?? 'x' ) );
	$check( 'bad border style dropped', ! isset( $data5['tabTitle']['normal']['border']['style'] ) );
	$check( 'bad length dropped', '' === ( $data5['tabTitle']['padding']['desktop']['top'] ?? 'x' ) );

	// Product with no description, attributes or open reviews: nothing.
	$GLOBALS['wp_query']     = new WP_Query( [ 'p' => $emptyId, 'post_type' => 'product' ] );
	$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
	$GLOBALS['wp_query']->the_post();
	unset( $GLOBALS['product'] );
	$GLOBALS['product'] = wc_get_product( $emptyId );
	$check( 'empty product renders nothing', '' === trim( do_blocks( $block ) ) );

	// Block context (a product loop on any page) instead of a product page.
	$GLOBALS['wp_query']     = new WP_Query( [ 'post_type' => 'page', 'posts_per_page' => 1 ] );
	$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
	unset( $GLOBALS['product'] );
	$GLOBALS['post'] = null;
	$check( 'no product in context renders nothing', '' === trim( do_blocks( $block ) ) );
	$parsed = parse_blocks( $block )[0];
	$ctx    = ( new WP_Block( $parsed, [ 'postId' => $id, 'postType' => 'page' ] ) )->render();
	$check( 'block context postId renders (description)', false !== strpos( $ctx, '<strong>description</strong>' ) );

	// Recursion: the block inside its own product's description.
	wp_update_post( [ 'ID' => $id, 'post_content' => "<p>Outer</p>\n$block" ] );
	$GLOBALS['wp_query']     = new WP_Query( [ 'p' => $id, 'post_type' => 'product' ] );
	$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
	$GLOBALS['wp_query']->the_post();
	$rec = do_blocks( $block );
	$check( 'block in its own description does not recurse', 1 === substr_count( $rec, 'data-attributes=' ) );
} finally {
	wp_delete_comment( $review, true );
	wp_delete_post( $id, true );
	wp_delete_post( $emptyId, true );
	restore_error_handler();
}

echo 'PHP notices/warnings: ' . count( $errors ) . "\n";
foreach ( array_unique( $errors ) as $e ) {
	echo "  $e\n";
}
echo 'cleanup: ' . ( get_post( $id ) || get_post( $emptyId ) ? 'LEFTOVER' : 'ok' ) . "\n";
