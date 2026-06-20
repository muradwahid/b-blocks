/**
 * Woo Best Sellers — frontend behavior.
 *
 * The block is server-rendered. This dependency-light script hydrates the
 * AJAX add-to-cart buttons for simple products. Variable/grouped products are
 * rendered as plain links and are not intercepted. On success the button label
 * briefly switches to an "Added" state, then reverts, and the WooCommerce
 * mini-cart fragments are refreshed. A `data-bb-wbs-init` guard prevents double
 * binding when the block appears more than once on a page. The action/nonce
 * names are block-specific (bb_wbs_*) so this block never collides with the
 * Woo Product Grid block.
 */
import { __, sprintf } from '@wordpress/i18n';

import './style.scss';

const initBestSellers = ( wrapper ) => {
	if ( wrapper.dataset.bbWbsInit === '1' ) return;
	wrapper.dataset.bbWbsInit = '1';

	const ajaxUrl = wrapper.dataset.bbWbsAjax || '';
	const nonce = wrapper.dataset.bbWbsNonce || '';
	if ( ! ajaxUrl || ! nonce ) return;

	const status = wrapper.querySelector( '.bb-wbs-status' );
	const buttons = Array.from( wrapper.querySelectorAll( '.bb-wbs-atc-btn[data-product-id]' ) );

	const announce = ( message ) => {
		if ( status ) status.textContent = message;
	};

	buttons.forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			if ( btn.classList.contains( 'is-loading' ) || btn.classList.contains( 'is-added' ) ) return;

			const productId = parseInt( btn.dataset.productId, 10 ) || 0;
			if ( ! productId ) return;

			btn.classList.add( 'is-loading' );
			btn.setAttribute( 'aria-busy', 'true' );

			const body = new URLSearchParams();
			body.append( 'action', 'bb_wbs_add_to_cart' );
			body.append( 'nonce', nonce );
			body.append( 'product_id', String( productId ) );

			fetch( ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString(),
			} )
				.then( ( res ) => res.json() )
				.then( ( json ) => {
					if ( json && json.success && json.data && json.data.added ) {
						btn.classList.add( 'is-added' );
						announce(
							sprintf(
								/* translators: %s: product name. */
								__( '%s added to cart.', 'b-blocks' ),
								json.data.productName || ''
							)
						);

						// Refresh WooCommerce mini-cart fragments where available.
						if ( window.jQuery && window.jQuery.fn ) {
							window.jQuery( document.body ).trigger( 'wc_fragment_refresh' );
						} else {
							document.body.dispatchEvent( new CustomEvent( 'wc_fragment_refresh' ) );
							document.body.dispatchEvent( new CustomEvent( 'wc-cart-updated' ) );
						}

						setTimeout( () => {
							btn.classList.remove( 'is-added' );
						}, 1500 );
					} else {
						const message = ( json && json.data && json.data.message )
							? json.data.message
							: __( 'Could not add the product to the cart.', 'b-blocks' );
						announce( message );
					}
				} )
				.catch( () => announce( __( 'Could not add the product to the cart.', 'b-blocks' ) ) )
				.finally( () => {
					btn.classList.remove( 'is-loading' );
					btn.setAttribute( 'aria-busy', 'false' );
				} );
		} );
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-wbs[data-bb-wbs-ajax]' ).forEach( initBestSellers );
} );
