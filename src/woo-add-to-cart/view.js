/**
 * Woo Add to Cart — frontend behavior.
 *
 * The block is server-rendered. This dependency-light script hydrates each
 * `.bb-atc` wrapper: it wires the quantity stepper and posts an AJAX
 * add-to-cart request for simple products. On success the button label briefly
 * swaps to the configured "Added" state and the outcome is announced through an
 * `aria-live` status region; optionally the visitor is redirected to the cart.
 * A `data-bb-atc-init` guard prevents double binding.
 */
import { __, sprintf } from '@wordpress/i18n';

import './style.scss';

const REVERT_MS = 2500;

const clampQty = ( value ) => {
	let n = parseInt( value, 10 );
	if ( Number.isNaN( n ) ) {
		n = 1;
	}
	if ( n < 1 ) {
		n = 1;
	}
	if ( n > 99 ) {
		n = 99;
	}
	return n;
};

const initAddToCart = ( wrapper ) => {
	if ( wrapper.dataset.bbAtcInit === '1' ) {
		return;
	}
	wrapper.dataset.bbAtcInit = '1';

	const btn = wrapper.querySelector( '.bb-atc-btn' );
	// Link fallbacks (non-simple products) are not intercepted.
	if ( ! btn || btn.tagName !== 'BUTTON' ) {
		return;
	}

	const status = wrapper.querySelector( '.bb-atc-status' );
	const labelEl = btn.querySelector( '.bb-atc-btn-label' );
	const qtyInput = wrapper.querySelector( '.bb-atc-qty-input' );
	const minusBtn = wrapper.querySelector( '.bb-atc-qty-minus' );
	const plusBtn = wrapper.querySelector( '.bb-atc-qty-plus' );

	const ajaxUrl = wrapper.dataset.ajaxUrl || '';
	const nonce = wrapper.dataset.nonce || '';
	const productId = parseInt( wrapper.dataset.productId, 10 ) || 0;
	const redirect = wrapper.dataset.redirect === '1';
	const cartUrl = wrapper.dataset.cartUrl || '';
	const addedLabel = wrapper.dataset.addedLabel || __( 'Added!', 'b-blocks' );
	const originalLabel = labelEl ? labelEl.textContent : '';

	const announce = ( message ) => {
		if ( status ) {
			status.textContent = message;
		}
	};

	// Quantity stepper.
	if ( qtyInput ) {
		const step = ( delta ) => {
			qtyInput.value = String( clampQty( ( parseInt( qtyInput.value, 10 ) || 1 ) + delta ) );
		};
		if ( minusBtn ) {
			minusBtn.addEventListener( 'click', () => step( -1 ) );
		}
		if ( plusBtn ) {
			plusBtn.addEventListener( 'click', () => step( 1 ) );
		}
		qtyInput.addEventListener( 'change', () => {
			qtyInput.value = String( clampQty( qtyInput.value ) );
		} );
	}

	if ( ! ajaxUrl || ! nonce || ! productId ) {
		// Not configured — leave the button disabled rather than failing silently.
		btn.setAttribute( 'disabled', 'disabled' );
		btn.setAttribute( 'aria-disabled', 'true' );
		/* eslint-disable-next-line no-console */
		console.warn( 'bBlocks Woo Add to Cart: missing product or AJAX configuration.' );
		return;
	}

	let revertTimer = null;

	const revert = () => {
		btn.classList.remove( 'is-added', 'is-error' );
		if ( labelEl ) {
			labelEl.textContent = originalLabel;
		}
	};

	btn.addEventListener( 'click', () => {
		if ( btn.classList.contains( 'is-loading' ) ) {
			return;
		}
		if ( revertTimer ) {
			clearTimeout( revertTimer );
			revertTimer = null;
			revert();
		}

		const quantity = qtyInput ? clampQty( qtyInput.value ) : 1;

		btn.classList.add( 'is-loading' );
		btn.setAttribute( 'aria-busy', 'true' );

		const body = new URLSearchParams();
		body.append( 'action', 'bb_atc_add_to_cart' );
		body.append( 'nonce', nonce );
		body.append( 'product_id', String( productId ) );
		body.append( 'quantity', String( quantity ) );

		fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		} )
			.then( ( res ) => res.json() )
			.then( ( json ) => {
				if ( json && json.success && json.data && json.data.added ) {
					if ( redirect ) {
						const target = ( json.data.cartUrl || cartUrl );
						if ( target ) {
							window.location.assign( target );
							return;
						}
					}

					btn.classList.add( 'is-added' );
					if ( labelEl ) {
						labelEl.textContent = addedLabel;
					}
					announce(
						sprintf(
							/* translators: %s: product name. */
							__( '%s added to cart.', 'b-blocks' ),
							json.data.productName || ''
						)
					);

					document.body.dispatchEvent( new CustomEvent( 'wc_fragment_refresh' ) );

					revertTimer = setTimeout( revert, REVERT_MS );
				} else {
					const message = ( json && json.data && json.data.message )
						? json.data.message
						: __( 'Could not add the product to the cart.', 'b-blocks' );
					btn.classList.add( 'is-error' );
					announce( message );
					revertTimer = setTimeout( revert, REVERT_MS );
				}
			} )
			.catch( () => {
				btn.classList.add( 'is-error' );
				announce( __( 'Could not add the product to the cart.', 'b-blocks' ) );
				revertTimer = setTimeout( revert, REVERT_MS );
			} )
			.finally( () => {
				btn.classList.remove( 'is-loading' );
				btn.setAttribute( 'aria-busy', 'false' );
			} );
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-atc[data-product-id]' ).forEach( initAddToCart );
} );
