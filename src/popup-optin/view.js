/**
 * Popup Optin — frontend behavior.
 *
 * - Reads a JSON config from the `data-bb-po-config` attribute on the wrapper.
 * - Checks localStorage suppression: if dismissed/submitted within the
 *   configured window, the popup is never shown.
 * - Arms one of three triggers: time delay, scroll depth, or exit intent
 *   (exit intent falls back to a 10s delay on touch / small screens).
 * - On open: reveals the dialog, runs the configured entrance animation,
 *   locks body scroll (with scrollbar-width compensation), hides background
 *   content from screen readers, moves focus into the card, and traps Tab.
 * - On close (× / dismiss link / Escape / backdrop click): restores scroll &
 *   focus, and stores the suppression timestamp when suppressDays > 0.
 * - Form submit POSTs to admin-ajax.php (action: bb_popup_optin_submit). The
 *   recipient is resolved server-side; the client never supplies it.
 * - Honors `prefers-reduced-motion` (animation duration forced to 0).
 * - Per-instance `data-bb-po-init` guard prevents double-binding.
 */
import { __ } from '@wordpress/i18n';

import './style.scss';

const DAY_MS = 86400000;

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join( ',' );

const reducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const isValidEmail = ( value ) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( ( value || '' ).trim() );

const getFocusable = ( root ) => {
	if ( ! root ) {
		return [];
	}
	return Array.from( root.querySelectorAll( FOCUSABLE_SELECTOR ) ).filter(
		( el ) => ! el.hasAttribute( 'disabled' ) && el.offsetParent !== null
	);
};

const readSuppress = ( key ) => {
	try {
		const raw = window.localStorage.getItem( key );
		return raw ? parseInt( raw, 10 ) : 0;
	} catch ( e ) {
		return 0;
	}
};

const writeSuppress = ( key, days ) => {
	if ( ! days || days <= 0 ) {
		return;
	}
	try {
		const until = Date.now() + days * DAY_MS;
		window.localStorage.setItem( key, String( until ) );
	} catch ( e ) {
		// localStorage unavailable — fail silently.
	}
};

const lockScroll = ( state ) => {
	const sbw = window.innerWidth - document.documentElement.clientWidth;
	state._prevOverflow = document.body.style.overflow;
	state._prevPadRight = document.body.style.paddingRight;
	document.body.style.overflow = 'hidden';
	if ( sbw > 0 ) {
		document.body.style.paddingRight = `${ sbw }px`;
	}
};

const unlockScroll = ( state ) => {
	document.body.style.overflow = state._prevOverflow || '';
	document.body.style.paddingRight = state._prevPadRight || '';
};

const hideBgFromSR = ( wrapper ) => {
	Array.from( document.body.children ).forEach( ( child ) => {
		if ( child === wrapper ) {
			return;
		}
		if ( child.hasAttribute( 'aria-hidden' ) ) {
			child.dataset.bbPoWasHidden = 'keep';
		} else {
			child.setAttribute( 'aria-hidden', 'true' );
			child.dataset.bbPoWasHidden = 'set';
		}
	} );
};

const restoreBgFromSR = () => {
	Array.from( document.body.children ).forEach( ( child ) => {
		if ( child.dataset.bbPoWasHidden === 'set' ) {
			child.removeAttribute( 'aria-hidden' );
		}
		delete child.dataset.bbPoWasHidden;
	} );
};

const openPopup = ( state ) => {
	const { wrapper, card } = state;
	if ( state._open || state._dismissed ) {
		return;
	}
	state._open = true;

	state._lastFocus = document.activeElement;

	wrapper.removeAttribute( 'hidden' );
	wrapper.setAttribute( 'aria-hidden', 'false' );

	lockScroll( state );
	hideBgFromSR( wrapper );

	const reveal = () => wrapper.classList.add( 'is-open' );
	if ( typeof window.requestAnimationFrame === 'function' ) {
		window.requestAnimationFrame( () => window.requestAnimationFrame( reveal ) );
	} else {
		reveal();
	}

	// Move focus to first focusable element inside the card.
	const focusable = getFocusable( card );
	const target = focusable[ 0 ] || card;
	window.setTimeout( () => {
		try {
			target.focus();
		} catch ( e ) {
			/* noop */
		}
	}, 20 );

	const onKeyDown = ( e ) => {
		if ( e.key === 'Escape' ) {
			e.preventDefault();
			closePopup( state );
			return;
		}
		if ( e.key !== 'Tab' ) {
			return;
		}
		const items = getFocusable( card );
		if ( items.length === 0 ) {
			e.preventDefault();
			card.focus();
			return;
		}
		const first = items[ 0 ];
		const last = items[ items.length - 1 ];
		const active = document.activeElement;
		if ( e.shiftKey ) {
			if ( active === first || ! card.contains( active ) ) {
				e.preventDefault();
				last.focus();
			}
		} else if ( active === last ) {
			e.preventDefault();
			first.focus();
		}
	};

	state._keyHandler = onKeyDown;
	document.addEventListener( 'keydown', onKeyDown );
};

const closePopup = ( state ) => {
	const { wrapper, config } = state;
	if ( ! state._open ) {
		return;
	}
	state._open = false;
	state._dismissed = true;

	if ( state._keyHandler ) {
		document.removeEventListener( 'keydown', state._keyHandler );
		state._keyHandler = null;
	}

	restoreBgFromSR();
	unlockScroll( state );

	writeSuppress( config.suppressKey, config.suppressDays );

	const duration = reducedMotion() || config.openAnimation === 'none'
		? 0
		: Math.max( 0, parseInt( config.animationDuration, 10 ) || 0 );

	// Add is-closing so CSS transitions (opacity/transform) can play out.
	// Keep is-open (display:flex) during the animation so transitions render,
	// then hide the element once the animation is done.
	wrapper.classList.add( 'is-closing' );

	window.setTimeout( () => {
		if ( ! state._open ) {
			wrapper.classList.remove( 'is-open' );
			wrapper.classList.remove( 'is-closing' );
			wrapper.setAttribute( 'hidden', '' );
			wrapper.setAttribute( 'aria-hidden', 'true' );
		}
	}, duration + 30 );

	// Return focus to the element that was focused before opening.
	if ( state._lastFocus && typeof state._lastFocus.focus === 'function' ) {
		window.setTimeout( () => {
			try {
				state._lastFocus.focus();
			} catch ( e ) {
				/* noop */
			}
		}, 20 );
	}
};

const setStatus = ( statusEl, message, type ) => {
	if ( ! statusEl ) {
		return;
	}
	statusEl.textContent = message;
	statusEl.classList.remove( 'is-success', 'is-error' );
	statusEl.classList.add( type === 'success' ? 'is-success' : 'is-error' );
	statusEl.setAttribute( 'role', type === 'success' ? 'status' : 'alert' );
	statusEl.setAttribute( 'aria-live', type === 'success' ? 'polite' : 'assertive' );
	statusEl.hidden = false;
};

const bindForm = ( state ) => {
	const { card, config } = state;
	const form = card.querySelector( '.bb-po-form' );
	const statusEl = card.querySelector( '.bb-po-status' );
	const emailInput = card.querySelector( '.bb-po-input--email' );
	const submit = card.querySelector( '.bb-po-submit' );

	if ( ! form || ! emailInput ) {
		return;
	}

	const ajaxUrl = state.ajaxUrl || '/wp-admin/admin-ajax.php';
	const successText = statusEl ? statusEl.getAttribute( 'data-bb-po-success' ) || '' : '';

	form.addEventListener( 'submit', ( e ) => {
		e.preventDefault();

		const email = ( emailInput.value || '' ).trim();
		if ( ! isValidEmail( email ) ) {
			setStatus( statusEl, __( 'Please enter a valid email address.', 'b-blocks' ), 'error' );
			emailInput.focus();
			return;
		}

		if ( submit ) {
			submit.setAttribute( 'aria-disabled', 'true' );
			submit.disabled = true;
		}

		const body = new window.URLSearchParams( new window.FormData( form ) );

		window.fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString()
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res && res.success ) {
					form.hidden = true;
					const msg = successText || ( res.data && res.data.message )
						|| __( "Thanks! You're on the list.", 'b-blocks' );
					setStatus( statusEl, msg, 'success' );
					// Store suppression on successful submit.
					writeSuppress( config.suppressKey, config.suppressDays );
					if ( statusEl ) {
						statusEl.setAttribute( 'tabindex', '-1' );
						statusEl.focus();
					}
				} else {
					const errMsg = ( res && res.data && res.data.message )
						|| __( 'Subscription failed. Please try again.', 'b-blocks' );
					setStatus( statusEl, errMsg, 'error' );
					if ( submit ) {
						submit.removeAttribute( 'aria-disabled' );
						submit.disabled = false;
					}
					emailInput.focus();
				}
			} )
			.catch( () => {
				setStatus( statusEl, __( 'Network error. Please try again.', 'b-blocks' ), 'error' );
				if ( submit ) {
					submit.removeAttribute( 'aria-disabled' );
					submit.disabled = false;
				}
				emailInput.focus();
			} );
	} );
};

const armTrigger = ( state ) => {
	const { config } = state;
	const fire = () => openPopup( state );

	if ( config.triggerType === 'scroll' ) {
		const onScroll = () => {
			const docH = document.documentElement.scrollHeight - window.innerHeight;
			const pct = docH > 0 ? ( window.scrollY / docH ) * 100 : 100;
			if ( pct >= config.triggerScrollPct ) {
				window.removeEventListener( 'scroll', onScroll );
				fire();
			}
		};
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		return;
	}

	if ( config.triggerType === 'exit' ) {
		const isTouch = ( 'ontouchstart' in window ) || window.innerWidth < 768;
		if ( isTouch ) {
			window.setTimeout( fire, 10000 );
			return;
		}
		const onLeave = ( e ) => {
			if ( e.clientY <= 0 ) {
				document.documentElement.removeEventListener( 'mouseleave', onLeave );
				fire();
			}
		};
		document.documentElement.addEventListener( 'mouseleave', onLeave );
		return;
	}

	// Default: time delay.
	window.setTimeout( fire, Math.max( 0, config.triggerDelay * 1000 ) );
};

const initBlock = ( wrapper ) => {
	if ( wrapper.getAttribute( 'data-bb-po-init' ) === '1' ) {
		return;
	}
	wrapper.setAttribute( 'data-bb-po-init', '1' );

	let raw = {};
	try {
		raw = JSON.parse( wrapper.dataset.bbPoConfig || '{}' );
	} catch ( e ) {
		raw = {};
	}
	wrapper.removeAttribute( 'data-bb-po-config' );

	const config = {
		suppressKey: typeof raw.suppressKey === 'string' && raw.suppressKey ? raw.suppressKey : 'bb-popup-optin',
		triggerType: [ 'time', 'scroll', 'exit' ].indexOf( raw.triggerType ) !== -1 ? raw.triggerType : 'time',
		triggerDelay: parseInt( raw.triggerDelay, 10 ) || 5,
		triggerScrollPct: parseInt( raw.triggerScrollPct, 10 ) || 50,
		suppressDays: parseInt( raw.suppressDays, 10 ) || 0,
		openAnimation: [ 'fade-scale', 'slide-up', 'none' ].indexOf( raw.openAnimation ) !== -1 ? raw.openAnimation : 'fade-scale',
		animationDuration: parseInt( raw.animationDuration, 10 ) || 300,
		overlayCloseOnClick: raw.overlayCloseOnClick !== false
	};

	const card = wrapper.querySelector( '.bb-po-card' );
	if ( ! card ) {
		return;
	}

	const ajaxUrl = wrapper.getAttribute( 'data-bb-po-ajax' ) || '';
	wrapper.removeAttribute( 'data-bb-po-ajax' );

	const state = {
		wrapper,
		card,
		config,
		ajaxUrl,
		_open: false,
		_dismissed: false,
		_keyHandler: null,
		_lastFocus: null,
		_prevOverflow: '',
		_prevPadRight: ''
	};

	// Suppression check — if still within window, never arm the popup.
	if ( config.suppressDays > 0 ) {
		const until = readSuppress( config.suppressKey );
		if ( until && Date.now() < until ) {
			return;
		}
	}

	// Wire close controls.
	const closeBtn = card.querySelector( '[data-bb-po-close]' );
	if ( closeBtn ) {
		closeBtn.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			closePopup( state );
		} );
	}

	const dismissBtn = card.querySelector( '[data-bb-po-dismiss]' );
	if ( dismissBtn ) {
		dismissBtn.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			closePopup( state );
		} );
	}

	if ( config.overlayCloseOnClick ) {
		const overlay = wrapper.querySelector( '[data-bb-po-overlay]' );
		if ( overlay ) {
			overlay.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				closePopup( state );
			} );
		}
	}

	bindForm( state );
	armTrigger( state );
};

const initAll = () => {
	document.querySelectorAll( '[data-bb-po]' ).forEach( initBlock );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAll );
} else {
	initAll();
}
