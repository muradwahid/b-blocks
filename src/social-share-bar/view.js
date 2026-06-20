import './style.scss';

/**
 * Frontend behavior for the Social Share Bar.
 *
 * - Reveals the bar once the reader scrolls past the configured threshold.
 * - Honors prefers-reduced-motion (skips transitions, both on load and live).
 * - Copy Link uses the async Clipboard API with an execCommand fallback and a
 *   polite live-region announcement. No innerHTML is ever written.
 */

const OPEN_FEATURES = 'noopener,noreferrer,width=600,height=600';

const setHidden = ( bar, hidden ) => {
	if ( hidden ) {
		bar.classList.remove( 'bb-ssb--visible' );
		bar.classList.add( 'bb-ssb--hidden' );
		bar.setAttribute( 'inert', '' );
		bar.setAttribute( 'aria-hidden', 'true' );
	} else {
		bar.classList.add( 'bb-ssb--visible' );
		bar.classList.remove( 'bb-ssb--hidden' );
		bar.removeAttribute( 'inert' );
		bar.removeAttribute( 'aria-hidden' );
	}
};

const announce = ( bar, message ) => {
	const live = bar.querySelector( '.bb-ssb-live' );
	if ( live ) {
		live.textContent = message;
	}
};

const copyToClipboard = ( text ) => {
	if ( navigator.clipboard && typeof navigator.clipboard.writeText === 'function' ) {
		return navigator.clipboard.writeText( text );
	}

	// Fallback for browsers without the async Clipboard API.
	return new Promise( ( resolve, reject ) => {
		try {
			const textarea = document.createElement( 'textarea' );
			textarea.value = text;
			textarea.setAttribute( 'readonly', '' );
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			document.body.appendChild( textarea );
			textarea.select();
			const ok = document.execCommand( 'copy' );
			document.body.removeChild( textarea );
			ok ? resolve() : reject( new Error( 'copy-failed' ) );
		} catch ( e ) {
			reject( e );
		}
	} );
};

const initBar = ( bar ) => {
	if ( bar.dataset.bbSsbInit === '1' ) {
		return;
	}
	bar.dataset.bbSsbInit = '1';

	let config = {};
	try {
		config = JSON.parse( bar.dataset.bbSsbConfig || '{}' );
	} catch ( e ) {
		config = {};
	}

	const threshold = parseInt( config.scrollThreshold, 10 ) || 0;
	const reduceQuery = window.matchMedia
		? window.matchMedia( '(prefers-reduced-motion: reduce)' )
		: null;

	const applyMotion = () => {
		const reduce = reduceQuery ? reduceQuery.matches : false;
		bar.style.setProperty( '--bb-ssb-anim-duration', reduce ? '0ms' : `${ parseInt( config.animationDuration, 10 ) || 300 }ms` );
		if ( reduce ) {
			bar.classList.add( 'bb-ssb-reduced-motion' );
		} else {
			bar.classList.remove( 'bb-ssb-reduced-motion' );
		}
	};
	applyMotion();
	if ( reduceQuery && typeof reduceQuery.addEventListener === 'function' ) {
		reduceQuery.addEventListener( 'change', applyMotion );
	}

	// Hydrate share anchors from the pre-built data attribute so a JS-disabled
	// visitor still has the server-written href as a working fallback.
	const buttons = bar.querySelectorAll( '.bb-ssb-btn' );
	buttons.forEach( ( btn ) => {
		const platform = btn.dataset.bbSsbPlatform;

		if ( platform === 'copy' ) {
			btn.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				const url = btn.dataset.bbSsbCopyUrl || window.location.href;
				const labelEl = btn.querySelector( '.bb-ssb-label' );
				const original = labelEl ? labelEl.textContent : '';
				const originalAriaLabel = btn.getAttribute( 'aria-label' ) || '';
				const copiedText = config.copiedLabel || '';
				const copyText = config.copyLabel || original;

				copyToClipboard( url ).then( () => {
					if ( labelEl ) {
						labelEl.textContent = copiedText;
					}
					btn.setAttribute( 'aria-label', copiedText );
					announce( bar, copiedText );
					window.setTimeout( () => {
						if ( labelEl ) {
							labelEl.textContent = copyText;
						}
						btn.setAttribute( 'aria-label', originalAriaLabel );
					}, 2000 );
				} ).catch( () => {
					announce( bar, config.copyFailedLabel || '' );
				} );
			} );
			return;
		}

		const href = btn.dataset.bbSsbHref;
		if ( href ) {
			btn.setAttribute( 'href', href );
		}

		// Open share dialogs in a sized popup window (mailto: stays default nav).
		if ( platform !== 'email' ) {
			btn.addEventListener( 'click', ( event ) => {
				const target = btn.getAttribute( 'href' );
				if ( ! target ) {
					return;
				}
				event.preventDefault();
				window.open( target, '_blank', OPEN_FEATURES );
			} );
		}
	} );

	// Scroll-reveal threshold.
	if ( threshold <= 0 ) {
		setHidden( bar, false );
		return;
	}

	let ticking = false;
	const evaluate = () => {
		ticking = false;
		const y = window.scrollY || window.pageYOffset || 0;
		setHidden( bar, y < threshold );
	};

	const onScroll = () => {
		if ( ! ticking ) {
			ticking = true;
			window.requestAnimationFrame( evaluate );
		}
	};

	setHidden( bar, true );
	window.addEventListener( 'scroll', onScroll, { passive: true } );
	evaluate();
};

document.addEventListener( 'DOMContentLoaded', () => {
	const bars = document.querySelectorAll( '.wp-block-b-blocks-social-share-bar' );
	bars.forEach( initBar );
} );
