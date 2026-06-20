/**
 * Post Timeline — frontend behavior.
 *
 * The block is server-rendered; this script only handles the entrance
 * animation. Each `.bb-pt-item` gets `is-visible` toggled when it scrolls into
 * view (via IntersectionObserver), which triggers a CSS transition. When the
 * visitor prefers reduced motion — or the browser lacks IntersectionObserver —
 * every item is shown immediately. A `data-bb-pt-init` guard on the wrapper
 * prevents double-binding when a pattern embeds the block more than once.
 */
import './style.scss';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const initTimeline = ( wrapper ) => {
	if ( wrapper.dataset.bbPtBound === '1' ) return;
	wrapper.dataset.bbPtBound = '1';

	const items = wrapper.querySelectorAll( '.bb-pt-item' );
	if ( ! items.length ) return;

	const showAll = () => {
		items.forEach( ( item ) => item.classList.add( 'is-visible' ) );
	};

	if ( prefersReducedMotion() || typeof window.IntersectionObserver === 'undefined' ) {
		wrapper.classList.add( 'bb-pt--no-motion' );
		showAll();
		return;
	}

	const observer = new window.IntersectionObserver(
		( entries, obs ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
					obs.unobserve( entry.target );
				}
			} );
		},
		{ rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
	);

	items.forEach( ( item ) => observer.observe( item ) );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-pt[data-bb-pt-init]' ).forEach( initTimeline );
} );
