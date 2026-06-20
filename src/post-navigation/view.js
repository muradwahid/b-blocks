/**
 * Post Navigation — frontend behavior.
 *
 * The block is fully server-rendered; navigation uses real <a> links that work
 * without JavaScript. This script's only job is to honor prefers-reduced-motion
 * by zeroing the hover transition custom property on the wrapper, so CSS hover
 * transitions are suppressed instantly without a media query on every rule. A
 * data-bb-pn-init guard prevents double-processing when a pattern embeds the
 * block more than once.
 */
import './style.scss';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const applyMotionPreference = ( wrapper ) => {
	if ( wrapper.dataset.bbPnBound === '1' ) return;
	wrapper.dataset.bbPnBound = '1';

	if ( prefersReducedMotion() ) {
		wrapper.style.setProperty( '--bb-pn-transition', '0ms' );
		wrapper.classList.add( 'bb-pn--no-motion' );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( '.bb-pn[data-bb-pn-init]' )
		.forEach( applyMotionPreference );
} );
