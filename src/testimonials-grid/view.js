/**
 * Testimonials Grid — frontend behavior.
 *
 * The grid is pure static HTML + CSS; layout and the card hover-lift effect are
 * CSS-only. The single runtime job here is to honor
 * `prefers-reduced-motion: reduce`: when detected on load, every card gets its
 * transition zeroed via the `--bb-tg-transition` custom property so no motion
 * occurs on hover. Checked once on DOMContentLoaded. No scroll triggers, no
 * animation loops, no third-party dependency.
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

	const cards = document.querySelectorAll( '.bb-tg .bb-tg-card' );
	cards.forEach( ( card ) => {
		card.style.setProperty( '--bb-tg-transition', '0ms' );
	} );
} );
