/**
 * Cookie Consent Bar — frontend behavior.
 *
 * - Reads the named consent cookie on load. If a choice ("accepted"/"declined")
 *   already exists, the bar is removed from the DOM and never shown.
 * - Otherwise the bar slides in from its configured edge (top or bottom).
 * - Accept / Decline write the cookie via `document.cookie` (no backend), then
 *   slide the bar out and remove it. The decline value is stored so the bar
 *   does not reappear on later page loads.
 * - Compensates `document.body` padding (top or bottom) for the bar height via
 *   `ResizeObserver` so the bar never obscures page content; padding is cleared
 *   on dismissal.
 * - Moves focus to the Accept button on show (WCAG dialog pattern) and returns
 *   focus to the body on dismissal.
 * - Honors `prefers-reduced-motion` — animation duration is forced to 0.
 * - Per-instance init guard prevents double-binding across patterns / reuse.
 * - No `innerHTML` writes; cookie values are fixed safe strings.
 */
import './style.scss';

const reducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const readCookie = ( name ) => {
	try {
		const prefix = encodeURIComponent( name ) + '=';
		const parts = document.cookie ? document.cookie.split( ';' ) : [];
		for ( let i = 0; i < parts.length; i++ ) {
			const part = parts[ i ].trim();
			if ( part.indexOf( prefix ) === 0 ) {
				return decodeURIComponent( part.substring( prefix.length ) );
			}
		}
	} catch ( e ) {
		return null;
	}
	return null;
};

const writeCookie = ( name, value, days ) => {
	try {
		const maxAge = Math.max( 1, parseInt( days, 10 ) || 365 ) * 86400;
		document.cookie =
			encodeURIComponent( name ) +
			'=' +
			encodeURIComponent( value ) +
			'; max-age=' +
			maxAge +
			'; path=/; SameSite=Lax';
	} catch ( e ) {
		// Cookies unavailable — fail silently.
	}
};

const bodyOffset = {
	top: new Map(),
	bottom: new Map(),
	apply() {
		const maxTop = Array.from( this.top.values() ).reduce( ( a, b ) => Math.max( a, b ), 0 );
		const maxBottom = Array.from( this.bottom.values() ).reduce( ( a, b ) => Math.max( a, b ), 0 );

		if ( maxTop > 0 ) {
			document.body.style.paddingTop = `${ maxTop }px`;
		} else {
			document.body.style.paddingTop = '';
		}

		if ( maxBottom > 0 ) {
			document.body.style.paddingBottom = `${ maxBottom }px`;
		} else {
			document.body.style.paddingBottom = '';
		}
	},
	set( wrapper, position, height ) {
		if ( position === 'top' ) {
			this.top.set( wrapper, height );
		} else {
			this.bottom.set( wrapper, height );
		}
		this.apply();
	},
	clear( wrapper ) {
		this.top.delete( wrapper );
		this.bottom.delete( wrapper );
		this.apply();
	}
};

const dismiss = ( state, value ) => {
	const { wrapper, config } = state;
	if ( ! wrapper || state._dismissed ) return;
	state._dismissed = true;

	writeCookie( config.cookie, value, config.days );

	const finalize = () => {
		bodyOffset.clear( wrapper );

		if ( state._resizeObserver ) {
			try { state._resizeObserver.disconnect(); } catch ( e ) { /* noop */ }
			state._resizeObserver = null;
		}
		if ( state._winResizeHandler ) {
			window.removeEventListener( 'resize', state._winResizeHandler );
			state._winResizeHandler = null;
		}
		if ( state._mql && state._motionHandler ) {
			try {
				if ( typeof state._mql.removeEventListener === 'function' ) {
					state._mql.removeEventListener( 'change', state._motionHandler );
				}
			} catch ( e ) { /* noop */ }
			state._mql = null;
			state._motionHandler = null;
		}

		if ( wrapper.parentNode ) {
			wrapper.parentNode.removeChild( wrapper );
		}

		// Return focus to the document body after the action completes.
		try {
			document.body.setAttribute( 'tabindex', '-1' );
			document.body.focus();
			document.body.removeAttribute( 'tabindex' );
		} catch ( e ) { /* noop */ }
	};

	const duration = reducedMotion() ? 0 : Math.max( 0, parseInt( config.animation, 10 ) || 0 );

	if ( duration === 0 ) {
		finalize();
		return;
	}

	wrapper.classList.remove( 'bb-ccb--shown' );
	wrapper.classList.add( 'bb-ccb--hiding' );
	window.setTimeout( finalize, duration + 30 );
};

const show = ( state ) => {
	const { wrapper, config } = state;

	wrapper.removeAttribute( 'hidden' );

	const measure = () => {
		if ( state._dismissed ) return;
		const h = wrapper.offsetHeight || 0;
		bodyOffset.set( wrapper, config.position, h );
	};

	// Trigger the slide-in on the next frame so the transition runs.
	const reveal = () => {
		wrapper.classList.add( 'bb-ccb--shown' );
		measure();

		// Move focus to the Accept button (WCAG dialog pattern).
		const accept = wrapper.querySelector( '.bb-ccb-accept' );
		if ( accept ) {
			try { accept.focus(); } catch ( e ) { /* noop */ }
		}
	};

	if ( typeof window.requestAnimationFrame === 'function' ) {
		window.requestAnimationFrame( () => window.requestAnimationFrame( reveal ) );
	} else {
		reveal();
	}

	if ( typeof window.ResizeObserver === 'function' ) {
		try {
			state._resizeObserver = new window.ResizeObserver( measure );
			state._resizeObserver.observe( wrapper );
		} catch ( e ) {
			state._resizeObserver = null;
		}
	}

	state._winResizeHandler = measure;
	window.addEventListener( 'resize', state._winResizeHandler );

	// Live listener for mid-session prefers-reduced-motion OS toggle.
	// The CSS media query handles the visual transition instantly; this listener
	// also zeroes the JS-side animation variable so dismiss() skips the timeout.
	try {
		const mql = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		const onMotionChange = () => {
			if ( state._dismissed ) return;
			if ( mql.matches ) {
				wrapper.style.setProperty( '--bb-ccb-anim', '0ms' );
			} else {
				wrapper.style.removeProperty( '--bb-ccb-anim' );
			}
		};
		if ( typeof mql.addEventListener === 'function' ) {
			mql.addEventListener( 'change', onMotionChange );
			// Store for cleanup on dismiss — reuse the state object.
			state._mql = mql;
			state._motionHandler = onMotionChange;
		}
	} catch ( e ) { /* noop — matchMedia unavailable */ }
};

const initBar = ( wrapper ) => {
	if ( wrapper.getAttribute( 'data-bb-ccb-init' ) === '1' ) {
		return;
	}
	wrapper.setAttribute( 'data-bb-ccb-init', '1' );

	let config = {};
	try {
		config = JSON.parse( wrapper.dataset.bbConfig || '{}' );
	} catch ( e ) {
		config = {};
	}

	const resolved = {
		cookie: typeof config.cookie === 'string' && config.cookie ? config.cookie : 'bb_cookie_consent',
		days: parseInt( config.days, 10 ) || 365,
		position: config.position === 'top' ? 'top' : 'bottom',
		animation: parseInt( config.animation, 10 ) || 0
	};

	wrapper.removeAttribute( 'data-bb-config' );

	// If a choice already exists, remove the bar without showing it.
	const existing = readCookie( resolved.cookie );
	if ( existing === 'accepted' || existing === 'declined' ) {
		if ( wrapper.parentNode ) {
			wrapper.parentNode.removeChild( wrapper );
		}
		return;
	}

	const state = {
		wrapper,
		config: resolved,
		_resizeObserver: null,
		_winResizeHandler: null,
		_mql: null,
		_motionHandler: null,
		_dismissed: false
	};

	wrapper.querySelectorAll( '[data-bb-ccb-action]' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			const action = btn.getAttribute( 'data-bb-ccb-action' );
			dismiss( state, action === 'decline' ? 'declined' : 'accepted' );
		} );
	} );

	show( state );
};

document.addEventListener( 'DOMContentLoaded', () => {
	const bars = document.querySelectorAll( '[data-bb-ccb]' );
	bars.forEach( ( bar ) => initBar( bar ) );
} );
