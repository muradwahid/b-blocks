/**
 * Notification Bar — frontend behavior.
 *
 * - Reads dismissal state from localStorage (also handled by an inline
 *   pre-paint script in render.php to prevent a flash of the bar).
 * - Hides the bar on dismiss-button click and persists the dismissal.
 * - Adds compensating body padding (`padding-top` or `padding-bottom`) so
 *   sticky bars don't obscure page content. Tracks height with ResizeObserver.
 * - Honors `prefers-reduced-motion` — skips the fade animation.
 * - No globals leaked, listeners cleaned up after dismissal.
 */
import './style.scss';

const STORAGE_PREFIX = 'bb-notification-bar-dismissed-';

const reducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const readStorage = ( key ) => {
	try {
		return window.localStorage.getItem( key );
	} catch ( e ) {
		return null;
	}
};

const writeStorage = ( key, value ) => {
	try {
		window.localStorage.setItem( key, value );
	} catch ( e ) {
		// Storage unavailable (private mode, quota, etc.) — fail silently.
	}
};

/**
 * Body-offset manager. Multiple bars (one top, one bottom) can coexist; we
 * track the latest measured height per position and write the largest to
 * the body's padding. CSS custom property is also set so themes can opt in.
 */
const bodyOffset = {
	top: new Map(),    // wrapperEl -> height
	bottom: new Map(), // wrapperEl -> height
	apply() {
		const maxTop = Array.from( this.top.values() ).reduce( ( a, b ) => Math.max( a, b ), 0 );
		const maxBottom = Array.from( this.bottom.values() ).reduce( ( a, b ) => Math.max( a, b ), 0 );

		if ( maxTop > 0 ) {
			document.body.style.paddingTop = `${ maxTop }px`;
			document.body.style.setProperty( '--bb-nb-offset-top', `${ maxTop }px` );
		} else {
			document.body.style.paddingTop = '';
			document.body.style.removeProperty( '--bb-nb-offset-top' );
		}

		if ( maxBottom > 0 ) {
			document.body.style.paddingBottom = `${ maxBottom }px`;
			document.body.style.setProperty( '--bb-nb-offset-bottom', `${ maxBottom }px` );
		} else {
			document.body.style.paddingBottom = '';
			document.body.style.removeProperty( '--bb-nb-offset-bottom' );
		}
	},
	set( wrapper, position, height ) {
		if ( position === 'top' ) {
			this.top.set( wrapper, height );
		} else if ( position === 'bottom' ) {
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

const dismissBar = ( state ) => {
	const { wrapper, config } = state;
	if ( ! wrapper ) return;

	writeStorage( config.dismissKey, '1' );
	wrapper.setAttribute( 'data-bb-nb-dismissed', '1' );

	const finalize = () => {
		wrapper.style.display = 'none';
		bodyOffset.clear( wrapper );

		if ( state._resizeObserver ) {
			try { state._resizeObserver.disconnect(); } catch ( e ) { /* noop */ }
			state._resizeObserver = null;
		}
		if ( state._winResizeHandler ) {
			window.removeEventListener( 'resize', state._winResizeHandler );
			state._winResizeHandler = null;
		}
	};

	if ( reducedMotion() ) {
		finalize();
		return;
	}

	wrapper.classList.add( 'bb-nb-hide' );
	setTimeout( finalize, 220 );
};

const initBar = ( wrapper ) => {
	let config = {};
	try {
		config = JSON.parse( wrapper.dataset.bbConfig || '{}' );
	} catch ( e ) {
		config = {};
	}

	const dismissKey = typeof config.dismissKey === 'string' && config.dismissKey
		? config.dismissKey
		: `${ STORAGE_PREFIX }${ wrapper.id }`;

	const state = {
		wrapper,
		config: {
			dismissKey,
			position: config.position === 'bottom' ? 'bottom' : 'top',
			isSticky: config.isSticky !== false,
			isDismissible: config.isDismissible !== false
		},
		_resizeObserver: null,
		_winResizeHandler: null
	};

	// Authoritative dismissed check (in case the inline pre-paint script was
	// blocked by CSP or executed after first paint).
	if ( '1' === readStorage( dismissKey ) ) {
		wrapper.style.display = 'none';
		wrapper.setAttribute( 'data-bb-nb-dismissed', '1' );
		return;
	}

	// Wire the dismiss button.
	if ( state.config.isDismissible ) {
		const closeBtn = wrapper.querySelector( '[data-bb-nb-close]' );
		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				dismissBar( state );
			} );
		}
	}

	// Body offset — only when the bar is sticky.
	if ( state.config.isSticky ) {
		const measure = () => {
			if ( wrapper.getAttribute( 'data-bb-nb-dismissed' ) === '1' ) return;
			const h = wrapper.offsetHeight || 0;
			bodyOffset.set( wrapper, state.config.position, h );
		};

		// Initial measure + tracker.
		measure();

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
	}

	// Strip the config attribute after init.
	wrapper.removeAttribute( 'data-bb-config' );
};

document.addEventListener( 'DOMContentLoaded', () => {
	const bars = document.querySelectorAll( '[data-bb-notification-bar]' );
	bars.forEach( ( bar ) => initBar( bar ) );
} );
