/**
 * Taxonomy Grid — frontend behavior.
 *
 * The block is 100% server-rendered: layout is CSS Grid / CSS columns, hover
 * effects are pure CSS, and every card is a real server-written `<a href>`.
 * The only runtime responsibility is honoring `prefers-reduced-motion`: each
 * grid carries `--bb-tg-transition`, and when the user prefers reduced motion
 * we zero it (and keep it in sync on a live OS toggle). Per-instance init is
 * guarded so a pattern that inserts the block twice never double-binds.
 */
import './style.scss';

( function () {
	const SELECTOR = '.bb-tg[data-bb-tg-prm="true"]';

	const applyReducedMotion = ( grids, reduce ) => {
		grids.forEach( ( grid ) => {
			if ( reduce ) {
				grid.style.setProperty( '--bb-tg-transition', '0ms' );
			} else {
				grid.style.removeProperty( '--bb-tg-transition' );
			}
		} );
	};

	const init = () => {
		const grids = Array.prototype.slice
			.call( document.querySelectorAll( SELECTOR ) )
			.filter( ( grid ) => grid.dataset.bbTgInit !== '1' );

		if ( ! grids.length ) {
			return;
		}

		grids.forEach( ( grid ) => {
			grid.dataset.bbTgInit = '1';
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
