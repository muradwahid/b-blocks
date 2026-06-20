/**
 * Woo Product Reviews — frontend behavior.
 *
 * The block is entirely server-rendered static HTML (no AJAX, no nonce). This
 * dependency-free script only mirrors the fractional summary-star fill onto the
 * relevant element from a data attribute, so the value stays correct even if a
 * caching layer strips the inline per-instance CSS variable. There are no
 * animations, so `prefers-reduced-motion` is a no-op passthrough here.
 */

import './style.scss';

const initBlock = ( wrapper ) => {
	if ( wrapper.dataset.bbWprInit === '1' ) return;
	wrapper.dataset.bbWprInit = '1';

	const stars = wrapper.querySelector( '.bb-wpr-summary-stars[data-rating]' );
	if ( ! stars ) return;

	const rating = parseFloat( stars.dataset.rating );
	if ( Number.isNaN( rating ) ) return;

	const fill = Math.max( 0, Math.min( 100, ( rating / 5 ) * 100 ) );
	const fullStars = stars.querySelector( '.bb-wpr-summary-stars-full' );
	if ( fullStars ) {
		fullStars.style.width = `${ fill }%`;
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-wpr' ).forEach( initBlock );
} );
