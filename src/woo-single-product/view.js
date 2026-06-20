/**
 * Woo Single Product — frontend behavior (thin).
 *
 * The purchase area is fully server-rendered through WooCommerce's own
 * single-product template hooks, and all interactivity (variation switching,
 * gallery zoom/lightbox, quantity stepper, the native AJAX add-to-cart form)
 * is handled by WooCommerce's own enqueued scripts: wc-single-product,
 * wc-add-to-cart-variation, wc-add-to-cart. There is NO custom add-to-cart
 * endpoint or nonce here.
 *
 * This script only wires the embedded block into WooCommerce's jQuery event
 * system so that, on a non-product-page template, the variation form and the
 * mini-cart/fragments stay in sync:
 *   - Initialise the native variation form (WooCommerce binds this on its own
 *     `wc_variation_form` trigger, which we re-fire for embedded forms).
 *   - On the native `added_to_cart` event, trigger a fragment refresh so any
 *     mini-cart in the page header updates without a reload.
 * A per-instance init guard prevents double binding.
 */

import './style.scss';

const initBlock = ( wrapper ) => {
	if ( wrapper.dataset.bbWspInit === '1' ) return;
	wrapper.dataset.bbWspInit = '1';

	// WooCommerce's frontend scripts are jQuery-based; without jQuery there is
	// nothing for this thin script to do (the markup still works for non-AJAX
	// add-to-cart, which is a full-page navigation).
	const jq = window.jQuery;
	if ( ! jq ) return;

	const $wrapper = jq( wrapper );

	// Re-initialise the native variation form for any variable product embedded
	// in this block (WooCommerce auto-inits on its own DOM-ready pass, but a
	// re-trigger is harmless and covers blocks injected after that pass).
	const $variationForm = $wrapper.find( '.variations_form' );
	if ( $variationForm.length && typeof jq.fn.wc_variation_form === 'function' ) {
		$variationForm.each( function () {
			const $form = jq( this );
			if ( ! $form.data( 'bb-wsp-variation-init' ) ) {
				$form.wc_variation_form();
				$form.data( 'bb-wsp-variation-init', true );
			}
		} );
	}

	// When a product is added to the cart from inside this block, ask
	// WooCommerce to refresh its cart fragments so the header mini-cart updates.
	$wrapper.on( 'added_to_cart', () => {
		jq( document.body ).trigger( 'wc_fragment_refresh' );
	} );
};

const initAll = () => {
	document
		.querySelectorAll( '.bb-wsp[data-bb-wsp-init]' )
		.forEach( initBlock );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAll );
} else {
	initAll();
}
