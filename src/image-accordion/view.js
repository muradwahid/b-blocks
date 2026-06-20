/**
 * Image Accordion — frontend view script.
 *
 * Dependency-free. Toggles the `is-active` / `is-collapsed` class pair on the
 * panels; CSS transitions (driven by the inline `--bb-ia-duration` custom
 * property) handle all width/height animation. No `innerHTML` is ever used —
 * only `classList` and `setAttribute`.
 *
 * Modes:
 *  - hover: pointer enter / focus-in activates a panel; leaving the strip resets
 *    to the default active panel (or collapses all when activeIndex === -1).
 *  - click: click / Enter / Space toggles a panel (clicking the open one closes it).
 *  - mobile (viewport <= breakpoint): always tap-to-toggle regardless of trigger.
 *
 * Also imports style.scss so the build emits view.css (referenced from
 * block.json as the front-end stylesheet).
 */
import './style.scss';

const reducedMotion =
	window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

const initAccordion = ( root ) => {
	if ( root.dataset.bbIaInit === '1' ) {
		return;
	}
	root.dataset.bbIaInit = '1';

	if ( reducedMotion ) {
		root.style.setProperty( '--bb-ia-duration', '0ms' );
	}

	const trigger = root.getAttribute( 'data-trigger' ) === 'click' ? 'click' : 'hover';
	const breakpoint = parseInt( root.getAttribute( 'data-breakpoint' ), 10 ) || 768;

	let defaultActive = parseInt( root.getAttribute( 'data-active' ), 10 );
	if ( Number.isNaN( defaultActive ) ) {
		defaultActive = 0;
	}

	const strip = root.querySelector( '.bb-ia-strip' );
	if ( ! strip ) {
		return;
	}

	const panels = Array.prototype.slice.call( strip.querySelectorAll( '.bb-ia-panel' ) );
	if ( ! panels.length ) {
		return;
	}

	const triggers = panels.map( ( panel ) => panel.querySelector( '.bb-ia-panel-bg' ) );

	const isMobile = () => window.innerWidth <= breakpoint;

	const setActive = ( activeIdx ) => {
		panels.forEach( ( panel, i ) => {
			const on = i === activeIdx;
			panel.classList.toggle( 'is-active', on );
			panel.classList.toggle( 'is-collapsed', ! on );
			if ( triggers[ i ] ) {
				triggers[ i ].setAttribute( 'aria-expanded', on ? 'true' : 'false' );
			}
		} );
		root.dataset.bbIaCurrent = String( activeIdx );
	};

	const collapseAll = () => {
		panels.forEach( ( panel, i ) => {
			panel.classList.remove( 'is-active' );
			panel.classList.add( 'is-collapsed' );
			if ( triggers[ i ] ) {
				triggers[ i ].setAttribute( 'aria-expanded', 'false' );
			}
		} );
		root.dataset.bbIaCurrent = '-1';
	};

	const current = () => parseInt( root.dataset.bbIaCurrent, 10 );

	const resetToDefault = () => {
		if ( defaultActive < 0 || defaultActive >= panels.length ) {
			collapseAll();
		} else {
			setActive( defaultActive );
		}
	};

	const toggle = ( index ) => {
		if ( current() === index ) {
			collapseAll();
		} else {
			setActive( index );
		}
	};

	panels.forEach( ( panel, index ) => {
		const triggerEl = triggers[ index ];
		if ( ! triggerEl ) {
			return;
		}

		// Pointer hover (desktop hover mode only).
		panel.addEventListener( 'mouseenter', () => {
			if ( isMobile() || trigger !== 'hover' ) {
				return;
			}
			setActive( index );
		} );

		// Keyboard focus activates in hover mode so Tab users get the reveal.
		triggerEl.addEventListener( 'focus', () => {
			if ( isMobile() || trigger !== 'hover' ) {
				return;
			}
			setActive( index );
		} );

		// Click / tap.
		triggerEl.addEventListener( 'click', () => {
			if ( isMobile() || trigger === 'click' ) {
				toggle( index );
			} else {
				setActive( index );
			}
		} );

		// Keyboard activation: Enter / Space.
		triggerEl.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar' ) {
				event.preventDefault();
				if ( isMobile() || trigger === 'click' ) {
					toggle( index );
				} else {
					setActive( index );
				}
			}
		} );
	} );

	// Hover mode: reset when the pointer leaves the whole strip.
	strip.addEventListener( 'mouseleave', () => {
		if ( isMobile() || trigger !== 'hover' ) {
			return;
		}
		resetToDefault();
	} );

	// Hover mode: reset when focus leaves the strip entirely.
	strip.addEventListener( 'focusout', ( event ) => {
		if ( isMobile() || trigger !== 'hover' ) {
			return;
		}
		if ( ! strip.contains( event.relatedTarget ) ) {
			resetToDefault();
		}
	} );

	// Initial state.
	resetToDefault();
};

const init = () => {
	document.querySelectorAll( '.bb-ia[data-trigger]' ).forEach( initAccordion );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
