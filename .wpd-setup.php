<?php
$product = new WC_Product_Simple();
$product->set_name( 'WPD E2E Product' );
$product->set_status( 'publish' );
$product->set_regular_price( '20' );
$product->set_description( '<p>E2E <strong>description</strong> body.</p>' );
$product->set_weight( '2' );
$attr = new WC_Product_Attribute();
$attr->set_name( 'Material' );
$attr->set_options( [ 'Cotton', 'Wool' ] );
$attr->set_visible( true );
$product->set_attributes( [ $attr ] );
$product->set_reviews_allowed( true );
$id = $product->save();
$c = wp_insert_comment( [ 'comment_post_ID' => $id, 'comment_author' => 'Tester', 'comment_author_email' => 't@example.com', 'comment_content' => 'Lovely product', 'comment_approved' => 1, 'comment_type' => 'review' ] );
update_comment_meta( $c, 'rating', 4 );
WC_Comments::clear_transients( $id );
$content = '<!-- wp:woocommerce/single-product {"productId":' . $id . '} --><div class="wp-block-woocommerce-single-product">'
	. '<!-- wp:b-blocks/woo-product-details {"tabTitle":{"typo":{"fontSize":{"desktop":"18px","tablet":"","mobile":""}},"normal":{"color":"#6b7280","bg":"","activeColor":"#ff0000","activeBg":"","border":{},"radius":{"desktop":{"top":"","right":"","bottom":"","left":""},"tablet":{"top":"","right":"","bottom":"","left":""},"mobile":{"top":"","right":"","bottom":"","left":""}},"shadow":[]},"hover":{"color":"#00aa00","bg":"","activeColor":"","activeBg":"","border":{},"radius":{"desktop":{"top":"","right":"","bottom":"","left":""},"tablet":{"top":"","right":"","bottom":"","left":""},"mobile":{"top":"","right":"","bottom":"","left":""}},"shadow":[]},"padding":{"desktop":{"top":"12px","right":"0px","bottom":"12px","left":"0px"},"tablet":{"top":"","right":"","bottom":"","left":""},"mobile":{"top":"8px","right":"","bottom":"8px","left":""}},"margin":{"desktop":{"top":"","right":"","bottom":"","left":""},"tablet":{"top":"","right":"","bottom":"","left":""},"mobile":{"top":"","right":"","bottom":"","left":""}},"divider":{"width":"1px","style":"solid","color":"#e5e7eb"}}} /-->'
	. '<!-- wp:b-blocks/woo-product-details {"options":{"showDescription":true,"showAdditional":true,"showReviews":true}} /-->'
	. '</div><!-- /wp:woocommerce/single-product -->';
$page = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'WPD E2E Page', 'post_content' => $content ] );
echo wp_json_encode( [ 'product' => $id, 'review' => $c, 'page' => $page, 'url' => get_permalink( $page ) ] );
