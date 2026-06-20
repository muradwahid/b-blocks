/**
 * Marquee — frontend behavior.
 *
 * The infinite scroll itself is pure CSS (`@keyframes bb-mq-scroll`). This
 * script's only jobs are:
 *
 *  1. Honor `prefers-reduced-motion: reduce` — when set, no animation starts
 *     and no pause listeners attach; the track sits static.
 *  2. Compute a width-aware animation duration from the configured px/s speed
 *     and write it to `--bb-mq-duration` so scroll speed is consistent across
 *     viewport sizes. The track holds `duplicateCount` identical sets; the
 *     keyframe translates by exactly one set's width, so duration = one-set
 *     width / speed.
 *  3. Wire pause-on-hover and pause-on-focus (keyboard / screen-reader).
 *  4. Recompute duration on resize (debounced) via ResizeObserver.
 *
 * No `innerHTML` is used anywhere — only `textContent`, `style.setProperty`,
 * and `classList`. A per-instance init guard prevents double-binding when the
 * same block appears more than once (patterns / reusable blocks).
 */
import './style.scss';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const initMarquee = ( wrapper ) => {
	const track = wrapper.querySelector( '.bb-mq-track' );
	if ( ! track || track.getAttribute( 'data-bb-mq-init' ) === '1' ) {
		return;
	}
	track.setAttribute( 'data-bb-mq-init', '1' );

	let config = {};
	try {
		config = JSON.parse( track.getAttribute( 'data-bb-mq-config' ) || '{}' );
	} catch ( e ) {
		config = {};
	}
	track.removeAttribute( 'data-bb-mq-config' );

	const speed = Math.max( 20, Math.min( 200, parseInt( config.speed, 10 ) || 40 ) );
	const pauseOnHover = config.pauseOnHover !== false;

	const sets = track.querySelectorAll( '.bb-mq-set' );
	const setCount = sets.length || 1;

	// Reduced motion: leave the track static, mark the wrapper, bail out.
	if ( prefersReducedMotion() ) {
		wrapper.classList.add( 'bb-mq--no-motion' );
		return;
	}

	// One-set width = full scroll width divided by the number of duplicate sets.
	const computeDuration = () => {
		const total = track.scrollWidth;
		if ( ! total ) return;
		const oneSet = total / setCount;
		if ( oneSet <= 0 ) return;
		const duration = oneSet / speed;
		wrapper.style.setProperty( '--bb-mq-duration', `${ duration.toFixed( 2 ) }s` );
		// Expose the loop distance so the keyframe knows how far to travel.
		wrapper.style.setProperty( '--bb-mq-loop', `${ ( 100 / setCount ).toFixed( 4 ) }%` );
	};

	computeDuration();
	wrapper.classList.add( 'bb-mq--animate' );

	// Pause on hover / focus.
	if ( pauseOnHover ) {
		const pause = () => wrapper.classList.add( 'is-paused' );
		const resume = () => wrapper.classList.remove( 'is-paused' );
		wrapper.addEventListener( 'mouseenter', pause );
		wrapper.addEventListener( 'mouseleave', resume );
		wrapper.addEventListener( 'focusin', pause );
		wrapper.addEventListener( 'focusout', resume );
	}

	// Recompute on resize, debounced at 200ms.
	if ( typeof ResizeObserver !== 'undefined' ) {
		let timer = null;
		const ro = new ResizeObserver( () => {
			if ( timer ) {
				window.clearTimeout( timer );
			}
			timer = window.setTimeout( computeDuration, 200 );
		} );
		ro.observe( wrapper );
	} else {
		let timer = null;
		window.addEventListener( 'resize', () => {
			if ( timer ) {
				window.clearTimeout( timer );
			}
			timer = window.setTimeout( computeDuration, 200 );
		} );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	const marquees = document.querySelectorAll( '.bb-mq' );
	marquees.forEach( ( wrapper ) => initMarquee( wrapper ) );
} );
