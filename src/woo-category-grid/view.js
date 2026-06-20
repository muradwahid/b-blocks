/**
 * Woo Category Grid — frontend behavior.
 *
 * The block is 100% server-rendered: layout is CSS Grid, hover effects are pure
 * CSS, and every card is a real server-written `<a href>`. The only runtime
 * responsibilities are:
 *   1. Applying the editor-configured hover duration as the
 *      `--bb-wcg-transition` custom property from `data-hover-duration`.
 *   2. Honoring `prefers-reduced-motion`: when matched, zero the transition and
 *      drop transform-based hover classes (kept in sync on a live OS toggle).
 * Per-instance init is guarded so a pattern that inserts the block twice never
 * double-binds.
 */
import './style.scss';

( function () {
	const SELECTOR = '.bb-wcg[data-bb-wcg="true"]';
	const HOVER_CLASSES = [
		'bb-wcg--hover-zoom',
		'bb-wcg--hover-lift',
		'bb-wcg--hover-darken'
	];

	const applyReducedMotion = ( grids, reduce ) => {
		grids.forEach( ( grid ) => {
			if ( reduce ) {
				grid.style.setProperty( '--bb-wcg-transition', '0ms' );
				HOVER_CLASSES.forEach( ( cls ) => grid.classList.remove( cls ) );
			} else {
				const dur = parseInt( grid.dataset.hoverDuration, 10 );
				grid.style.setProperty(
					'--bb-wcg-transition',
					( Number.isFinite( dur ) ? dur : 300 ) + 'ms'
				);
				const stored = grid.dataset.bbWcgHover;
				if ( stored ) {
					grid.classList.add( stored );
				}
			}
		} );
	};

	const init = () => {
		const grids = Array.prototype.slice
			.call( document.querySelectorAll( SELECTOR ) )
			.filter( ( grid ) => grid.dataset.bbWcgInit !== '1' );

		if ( ! grids.length ) {
			return;
		}

		grids.forEach( ( grid ) => {
			grid.dataset.bbWcgInit = '1';

			// Remember the active hover class so we can restore it if the OS
			// reduced-motion preference is toggled off mid-session.
			const active = HOVER_CLASSES.find( ( cls ) =>
				grid.classList.contains( cls )
			);
			if ( active ) {
				grid.dataset.bbWcgHover = active;
			}

			// Apply the configured hover duration.
			const dur = parseInt( grid.dataset.hoverDuration, 10 );
			grid.style.setProperty(
				'--bb-wcg-transition',
				( Number.isFinite( dur ) ? dur : 300 ) + 'ms'
			);
		} );

		if ( ! window.matchMedia ) {
			return;
		}

		const mq = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		applyReducedMotion( grids, mq.matches );

		const onChange = ( event ) => applyReducedMotion( grids, event.matches );

		if ( typeof mq.addEventListener === 'function' ) {
			mq.addEventListener( 'change', onChange );
		} else if ( typeof mq.addListener === 'function' ) {
			// Safari < 14 fallback.
			mq.addListener( onChange );
		}
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
