/**
 * Milestone Timeline — frontend view script.
 *
 * Dependency-free. Responsibilities:
 *  - Honor the configured `mobileBreakpoint` by toggling `.bb-mt--horizontal`
 *    via `window.matchMedia`. Also adds `.bb-mt--has-js` immediately so the
 *    static `@media (min-width: 640px)` CSS-only fallback (scoped to
 *    `:not(.bb-mt--has-js)`) is suppressed when JS is active — preventing it
 *    from conflicting when the configured breakpoint is > 640px.
 *  - Add a subtle node/card scroll-in entrance via IntersectionObserver, fully
 *    skipped under `prefers-reduced-motion: reduce`.
 *
 * Also imports style.scss so the build emits view.css (referenced from
 * block.json as the front-end stylesheet).
 */
import './style.scss';

const prefersReducedMotion = () =>
	!! ( window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches );

const initBlock = ( root ) => {
	if ( root.dataset.bbMtInit === '1' ) {
		return;
	}
	root.dataset.bbMtInit = '1';

	let config = { mobileBreakpoint: 640 };
	try {
		const raw = root.getAttribute( 'data-bb-mt-config' );
		if ( raw ) {
			config = { ...config, ...JSON.parse( raw ) };
		}
	} catch ( e ) {
		// Keep defaults on malformed config.
	}

	const bp = parseInt( config.mobileBreakpoint, 10 );
	const breakpoint = Number.isNaN( bp ) ? 640 : Math.max( 320, Math.min( 768, bp ) );

	// Mark JS as active so the static @media (min-width: 640px) no-JS fallback
	// in style.scss is suppressed (scoped to :not(.bb-mt--has-js)).
	root.classList.add( 'bb-mt--has-js' );

	// --- Responsive layout switch honoring the configured breakpoint. ---
	if ( window.matchMedia ) {
		const mql = window.matchMedia( `(min-width: ${ breakpoint }px)` );
		const apply = ( matches ) => {
			root.classList.toggle( 'bb-mt--horizontal', matches );
		};
		apply( mql.matches );
		const onChange = ( event ) => apply( event.matches );
		if ( typeof mql.addEventListener === 'function' ) {
			mql.addEventListener( 'change', onChange );
		} else if ( typeof mql.addListener === 'function' ) {
			mql.addListener( onChange );
		}
	}

	// --- Reduced-motion handling. ---
	const reduced = prefersReducedMotion();
	if ( reduced ) {
		root.classList.add( 'bb-mt--reduce-motion' );
		return;
	}

	// --- Scroll-in entrance animation. ---
	const items = Array.prototype.slice.call( root.querySelectorAll( '.bb-mt-item' ) );
	if ( ! items.length || typeof IntersectionObserver === 'undefined' ) {
		return;
	}

	root.classList.add( 'bb-mt-animate' );

	const observer = new IntersectionObserver(
		( entries, obs ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
					obs.unobserve( entry.target );
				}
			} );
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
	);

	items.forEach( ( item ) => observer.observe( item ) );
};

const init = () => {
	document.querySelectorAll( '.bb-mt[data-bb-mt-config]' ).forEach( initBlock );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
