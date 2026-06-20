/**
 * Woo Mini Cart — frontend behavior.
 *
 * The block is server-rendered. This dependency-light script hydrates each
 * `.bb-wmc` wrapper: it toggles the dropdown flyout, wires keyboard + outside
 * click handling, intercepts per-item remove links for an AJAX remove, and
 * keeps the cart state live by listening for WooCommerce's `wc_fragment_refresh`
 * and `added_to_cart` events (and the block-specific `bb_cart_updated` event the
 * bBlocks add-to-cart blocks dispatch). On update it refreshes via
 * `?wc-ajax=get_refreshed_fragments` and swaps the `.bb-wmc-inner` fragment.
 *
 * A `data-bb-mc-init` guard prevents double binding. No jQuery dependency.
 */
import { sprintf, _n } from '@wordpress/i18n';

import './style.scss';

/**
 * Move the dropdown body out of the fragment node into the flyout panel so the
 * panel content always reflects the latest swapped cart state.
 *
 * @param {HTMLElement} wrapper Block wrapper.
 */
const syncDropdownBody = ( wrapper ) => {
	const dropdown = wrapper.querySelector( '.bb-wmc-dropdown' );
	const body = wrapper.querySelector( '.bb-wmc-inner .bb-wmc-dropdown-body' );
	if ( ! dropdown || ! body ) {
		return;
	}
	const existing = dropdown.querySelector( '.bb-wmc-dropdown-body' );
	if ( existing ) {
		existing.remove();
	}
	dropdown.appendChild( body );
};

/**
 * Update the trigger's accessible label from the fragment's count.
 *
 * @param {HTMLElement} wrapper Block wrapper.
 */
const syncAriaLabel = ( wrapper ) => {
	const trigger = wrapper.querySelector( '.bb-wmc-trigger' );
	const inner = wrapper.querySelector( '.bb-wmc-inner' );
	if ( ! trigger || ! inner ) {
		return;
	}
	const count = parseInt( inner.dataset.count, 10 ) || 0;
	const label = sprintf(
		/* translators: %d: number of items in the cart. */
		_n( 'Shopping cart, %d item', 'Shopping cart, %d items', count, 'b-blocks' ),
		count
	);
	trigger.setAttribute( 'aria-label', label );
	wrapper.classList.toggle( 'bb-wmc--empty', count < 1 );
};

/**
 * Bind the remove-item links inside the dropdown to an AJAX remove.
 *
 * @param {HTMLElement} wrapper Block wrapper.
 * @param {Function}    refresh Refresh callback.
 */
const bindRemoveButtons = ( wrapper, refresh ) => {
	const ajaxUrl = wrapper.dataset.ajaxUrl || '';
	const nonce = wrapper.dataset.removeNonce || '';

	wrapper.querySelectorAll( '.bb-wmc-remove' ).forEach( ( link ) => {
		if ( link.dataset.bbWmcBound === '1' ) {
			return;
		}
		link.dataset.bbWmcBound = '1';

		link.addEventListener( 'click', ( event ) => {
			const key = link.dataset.key || '';
			if ( ! ajaxUrl || ! nonce || ! key ) {
				// Fall back to WooCommerce's native remove URL navigation.
				return;
			}
			event.preventDefault();

			const item = link.closest( '.bb-wmc-item' );
			if ( item ) {
				item.classList.add( 'bb-wmc-item--removing' );
			}
			wrapper.classList.add( 'bb-wmc--loading' );

			const body = new URLSearchParams();
			body.append( 'action', 'bb_wmc_remove_item' );
			body.append( 'nonce', nonce );
			body.append( 'cart_item_key', key );

			fetch( ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString(),
			} )
				.then( ( res ) => res.json() )
				.then( ( json ) => {
					if ( json && json.success ) {
						document.body.dispatchEvent( new CustomEvent( 'bb_cart_updated' ) );
						refresh();
					} else if ( item ) {
						item.classList.remove( 'bb-wmc-item--removing' );
					}
				} )
				.catch( () => {
					if ( item ) {
						item.classList.remove( 'bb-wmc-item--removing' );
					}
				} )
				.finally( () => {
					wrapper.classList.remove( 'bb-wmc--loading' );
				} );
		} );
	} );
};

const initMiniCart = ( wrapper ) => {
	if ( wrapper.dataset.bbMcInit === '1' ) {
		return;
	}
	wrapper.dataset.bbMcInit = '1';

	const triggerMode = wrapper.dataset.triggerMode || 'dropdown';
	const refreshUrl = wrapper.dataset.refreshUrl || '';
	const selector = wrapper.dataset.selector || '';
	const trigger = wrapper.querySelector( '.bb-wmc-trigger' );
	const dropdown = wrapper.querySelector( '.bb-wmc-dropdown' );

	const announce = ( busy ) => {
		if ( dropdown ) {
			dropdown.setAttribute( 'aria-busy', busy ? 'true' : 'false' );
		}
	};

	// Swap the inner fragment markup, then re-sync the panel + bindings.
	const applyFragmentHtml = ( html ) => {
		const oldInner = wrapper.querySelector( '.bb-wmc-inner' );
		if ( ! oldInner || ! html ) {
			return;
		}
		const parent = oldInner.parentNode;
		const template = document.createElement( 'template' );
		// Safe: html arrives from the same-origin WooCommerce fragments endpoint
		// (?wc-ajax=get_refreshed_fragments). All dynamic content inside is
		// server-escaped by WooMiniCart::renderInner() (esc_html/esc_attr/esc_url/
		// wp_kses_post). Assigning to a <template> element does NOT execute scripts.
		template.innerHTML = html.trim(); // phpcs:ignore -- intentional, see above.
		const newInner = template.content.firstElementChild;
		if ( newInner && parent ) {
			parent.replaceChild( newInner, oldInner );
		}
		syncDropdownBody( wrapper );
		syncAriaLabel( wrapper );
		bindRemoveButtons( wrapper, refreshCart );
	};

	// Refresh cart state from WooCommerce's fragments endpoint.
	function refreshCart() {
		if ( ! refreshUrl || ! selector ) {
			return;
		}
		wrapper.classList.add( 'bb-wmc--loading' );
		announce( true );

		fetch( refreshUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
		} )
			.then( ( res ) => res.json() )
			.then( ( json ) => {
				const fragments = json && json.fragments ? json.fragments : null;
				if ( fragments && typeof fragments[ selector ] === 'string' ) {
					applyFragmentHtml( fragments[ selector ] );
					try {
						if ( json.cart_hash ) {
							window.sessionStorage.setItem( `bbWmc_${ selector }`, json.cart_hash );
						}
					} catch ( e ) {
						// Storage unavailable — ignore.
					}
				}
			} )
			.catch( () => {} )
			.finally( () => {
				wrapper.classList.remove( 'bb-wmc--loading' );
				announce( false );
			} );
	}

	// Initial panel sync (move body into flyout, bind removes).
	syncDropdownBody( wrapper );
	bindRemoveButtons( wrapper, refreshCart );

	// Dropdown open / close behaviour.
	if ( triggerMode === 'dropdown' && trigger && dropdown ) {
		const closeDropdown = ( returnFocus ) => {
			if ( dropdown.hasAttribute( 'hidden' ) ) {
				return;
			}
			dropdown.setAttribute( 'hidden', '' );
			trigger.setAttribute( 'aria-expanded', 'false' );
			wrapper.classList.remove( 'bb-wmc--open' );
			if ( returnFocus ) {
				trigger.focus();
			}
		};

		const openDropdown = () => {
			dropdown.removeAttribute( 'hidden' );
			trigger.setAttribute( 'aria-expanded', 'true' );
			wrapper.classList.add( 'bb-wmc--open' );
		};

		trigger.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			if ( dropdown.hasAttribute( 'hidden' ) ) {
				openDropdown();
			} else {
				closeDropdown( false );
			}
		} );

		document.addEventListener( 'click', ( event ) => {
			if ( ! wrapper.contains( event.target ) ) {
				closeDropdown( false );
			}
		} );

		wrapper.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				closeDropdown( true );
			}
		} );
	}

	// Live cart sync. WooCommerce fires `wc_fragment_refresh` / `added_to_cart`
	// on document.body after add-to-cart; bBlocks blocks also fire
	// `bb_cart_updated` for jQuery-free forward compatibility.
	[ 'wc_fragment_refresh', 'added_to_cart', 'bb_cart_updated', 'removed_from_cart' ].forEach( ( name ) => {
		document.body.addEventListener( name, refreshCart );
	} );

	// On load, refresh if the cached cart hash differs (handles page caching).
	try {
		const cached = window.sessionStorage.getItem( `bbWmc_${ selector }` );
		const current = ( window.wc_cart_fragments_params && window.wc_cart_fragments_params.cart_hash_key )
			? window.localStorage.getItem( window.wc_cart_fragments_params.cart_hash_key )
			: null;
		if ( current && cached !== current ) {
			refreshCart();
		}
	} catch ( e ) {
		// Storage unavailable — skip the optimisation.
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-wmc[data-selector]' ).forEach( initMiniCart );
} );
