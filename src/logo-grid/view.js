/**
 * Logo Grid — frontend behavior.
 *
 * The block is pure CSS for all hover effects. The only runtime job here is to
 * honor `prefers-reduced-motion: reduce`: when detected at load, a
 * `bb-lg--no-motion` class is added to each grid wrapper so a CSS rule strips
 * transitions and transforms. Checked once on DOMContentLoaded. No scroll
 * triggers, no animation loops, no third-party dependency.
 */
import './style.scss';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	if ( ! prefersReducedMotion() ) return;

	const grids = document.querySelectorAll( '.bb-lg' );
	grids.forEach( ( grid ) => {
		grid.classList.add( 'bb-lg--no-motion' );
	} );
} );
