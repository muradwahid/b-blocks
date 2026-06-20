/**
 * Woo Featured Product — frontend behavior.
 *
 * The block is server-rendered. This dependency-light script hydrates the
 * AJAX add-to-cart button for simple products. Variable/grouped products are
 * rendered as plain links and are not intercepted. On success the button label
 * briefly switches to an "Added!" state, then reverts, and a
 * `wc-blocks_added_to_cart` event is dispatched so mini-cart fragments refresh.
 * A `data-bb-wfp-init` guard prevents double binding when the block is hydrated
 * more than once. All DOM mutations use textContent only.
 */
import { __ } from '@wordpress/i18n';

import './style.scss';

const initBlock = ( wrapper ) => {
	if ( wrapper.dataset.bbWfpInit === '1' ) return;
	wrapper.dataset.bbWfpInit = '1';

	const ajaxUrl = wrapper.dataset.bbWfpAjax || '';
	const nonce = wrapper.dataset.bbWfpNonce || '';
	if ( ! ajaxUrl || ! nonce ) return;

	const btn = wrapper.querySelector(
		'.bb-wfp-atc-btn[data-product-id][data-product-type="simple"]'
	);
	if ( ! btn ) return;

	const labelEl = btn.querySelector( '.bb-wfp-atc-label' );
	const status = wrapper.querySelector( '.bb-wfp-status' );
	const errorRegion = wrapper.querySelector( '.bb-wfp-error' );
	if ( ! labelEl ) return;

	const originalLabel = labelEl.textContent;
	const addingLabel = btn.dataset.addingLabel || __( 'Adding…', 'b-blocks' );
	const addedLabel = btn.dataset.addedLabel || __( 'Added!', 'b-blocks' );

	const announce = ( message ) => {
		if ( status ) status.textContent = message;
	};

	const announceError = ( message ) => {
		if ( errorRegion ) errorRegion.textContent = message;
	};

	btn.addEventListener( 'click', () => {
		if ( btn.getAttribute( 'aria-busy' ) === 'true' ) return;

		const productId = parseInt( btn.dataset.productId, 10 ) || 0;
		if ( ! productId ) return;

		btn.setAttribute( 'aria-busy', 'true' );
		btn.setAttribute( 'aria-disabled', 'true' );
		labelEl.textContent = addingLabel;

		const body = new URLSearchParams();
		body.append( 'action', 'bb_wfp_add_to_cart' );
		body.append( 'nonce', nonce );
		body.append( 'product_id', String( productId ) );

		fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		} )
			.then( ( res ) => {
				if ( ! res.ok ) throw new Error( 'http' );
				return res.json();
			} )
			.then( ( json ) => {
				if ( json && json.success && json.data && json.data.added ) {
					labelEl.textContent = addedLabel;
					btn.classList.add( 'is-added' );
					announce( addedLabel );

					document.dispatchEvent(
						new CustomEvent( 'wc-blocks_added_to_cart' )
					);
					document.body.dispatchEvent(
						new CustomEvent( 'wc_fragment_refresh' )
					);

					setTimeout( () => {
						labelEl.textContent = originalLabel;
						btn.classList.remove( 'is-added' );
						btn.removeAttribute( 'aria-busy' );
						btn.removeAttribute( 'aria-disabled' );
					}, 2000 );
				} else {
					throw new Error( 'failed' );
				}
			} )
			.catch( () => {
				labelEl.textContent = originalLabel;
				btn.removeAttribute( 'aria-busy' );
				btn.removeAttribute( 'aria-disabled' );

				const message = __(
					'Could not add to cart. Please try again.',
					'b-blocks'
				);
				announceError( message );
			} );
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-wfp[data-bb-wfp-ajax]' ).forEach( initBlock );
} );
