/**
 * Reading Progress Block — frontend behavior.
 *
 * Reads the `data-bb-rp-config` JSON from each marker `<div>` rendered by
 * `render.php`, creates a `position: fixed` bar pinned to the top or bottom
 * of the viewport, appends it to `document.body`, and updates its fill on
 * scroll / resize via `requestAnimationFrame`. The bar uses
 * `transform: scaleX(<0..1>)` so updates are GPU-cheap.
 *
 * - `prefers-reduced-motion: reduce` disables the CSS transition.
 * - Per-instance init guard (`data-bb-rp-init`) prevents double-binding.
 * - The marker keeps the per-instance `<style>` block whose CSS variables
 *   scope the bar's appearance to its own DOM id.
 */
import './style.scss';

const reducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

/**
 * Find the first matching content element for the "content" target.
 * Tries the user-supplied selector first, then falls back to common
 * post/article landmarks.
 */
const resolveContentElement = ( selectorList ) => {
	const candidates = [];
	if ( selectorList ) {
		candidates.push( selectorList );
	}
	candidates.push( 'article', '.entry-content', '.post-content', 'main' );

	for ( const sel of candidates ) {
		if ( ! sel ) continue;
		try {
			const el = document.querySelector( sel );
			if ( el ) return el;
		} catch ( e ) {
			// Invalid selector — ignore and try the next.
		}
	}
	return null;
};

/**
 * Compute progress as a 0..1 fraction.
 */
const computeProgress = ( state ) => {
	const { config, contentEl } = state;
	const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;

	if ( config.scrollTarget === 'content' && contentEl ) {
		const rect = contentEl.getBoundingClientRect();
		const total = rect.height;
		if ( total <= 0 ) return 0;
		const passed = -rect.top;
		const denom = total - viewportH;
		if ( denom <= 0 ) {
			// Content is shorter than viewport — show 100% once user scrolls
			// past the bottom of the element, otherwise 0%.
			return rect.bottom <= viewportH ? 1 : 0;
		}
		const frac = passed / denom;
		return Math.max( 0, Math.min( 1, frac ) );
	}

	// Default: full-page progress.
	const docEl = document.documentElement;
	const body = document.body;
	const scrollTop = window.pageYOffset || docEl.scrollTop || ( body ? body.scrollTop : 0 ) || 0;
	const documentHeight = Math.max(
		body ? body.scrollHeight : 0,
		docEl.scrollHeight,
		body ? body.offsetHeight : 0,
		docEl.offsetHeight,
		body ? body.clientHeight : 0,
		docEl.clientHeight
	);
	const denom = documentHeight - viewportH;
	if ( denom <= 0 ) return 0;
	const frac = scrollTop / denom;
	return Math.max( 0, Math.min( 1, frac ) );
};

const updateBar = ( state ) => {
	const { bar, fill } = state;
	if ( ! bar || ! fill ) return;
	const frac = computeProgress( state );
	const pct = Math.round( frac * 100 );

	fill.style.transform = `scaleX(${ frac })`;
	bar.setAttribute( 'aria-valuenow', String( pct ) );

	state.lastPct = pct;
};

const scheduleUpdate = ( state ) => {
	if ( state.pending ) return;
	state.pending = true;
	const raf = window.requestAnimationFrame || function ( cb ) { return window.setTimeout( cb, 16 ); };
	raf( () => {
		state.pending = false;
		updateBar( state );
	} );
};

const buildBar = ( marker, config ) => {
	const bar = document.createElement( 'div' );
	bar.className = 'bb-rp-bar bb-rp-pos--' + ( config.position === 'bottom' ? 'bottom' : 'top' );
	if ( config.hideOnMobile ) {
		bar.classList.add( 'bb-rp-hide-mobile' );
	}
	bar.setAttribute( 'role', 'progressbar' );
	bar.setAttribute( 'aria-label', config.ariaLabel || 'Reading progress' );
	bar.setAttribute( 'aria-valuemin', '0' );
	bar.setAttribute( 'aria-valuemax', '100' );
	bar.setAttribute( 'aria-valuenow', '0' );
	bar.setAttribute( 'tabindex', '-1' );
	bar.setAttribute( 'data-bb-rp-owner', marker.id );

	const fill = document.createElement( 'div' );
	fill.className = 'bb-rp-bar__fill';

	const duration = parseInt( config.animationDuration, 10 ) || 0;
	if ( duration > 0 && ! reducedMotion() ) {
		fill.style.transition = `transform ${ duration }ms linear`;
	}

	bar.appendChild( fill );
	return { bar, fill };
};

const initInstance = ( marker ) => {
	if ( marker.getAttribute( 'data-bb-rp-init' ) === '1' ) return;
	marker.setAttribute( 'data-bb-rp-init', '1' );

	let config = {};
	try {
		config = JSON.parse( marker.getAttribute( 'data-bb-rp-config' ) || '{}' );
	} catch ( e ) {
		config = {};
	}

	const { bar, fill } = buildBar( marker, config );

	// Scope the per-instance CSS variables (the inline <style> in render.php
	// uses `#<id> .bb-rp-bar`) — make sure the bar is reachable by that
	// selector by giving it the owner id so theme CSS can target it too.
	// We do this by wrapping the bar in a container with the owner id.
	const scope = document.createElement( 'div' );
	scope.id = marker.id + '-bar';
	// Mirror the marker's id-based CSS by also setting it directly on the
	// scope wrapper so styles cascade in both directions.
	scope.setAttribute( 'data-bb-rp-scope', marker.id );
	scope.style.all = 'unset';
	scope.appendChild( bar );
	document.body.appendChild( scope );

	// Move (clone) the per-instance <style> block out of the marker so that
	// styles still apply even if the marker is removed by another script.
	const styleEl = marker.querySelector( 'style' );
	if ( styleEl && styleEl.parentNode ) {
		// Re-emit the rule scoped to the new wrapper so the bar inherits
		// the variables (the original rule is `#<id> .bb-rp-bar { ... }`).
		// The simplest way: also write a copy keyed off the scope wrapper.
		const css = styleEl.textContent || '';
		const extra = css.replace(
			new RegExp( '#' + marker.id.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) + '\\s+\\.bb-rp-bar', 'g' ),
			'#' + scope.id + ' .bb-rp-bar'
		);
		if ( extra && extra !== css ) {
			const extraStyle = document.createElement( 'style' );
			extraStyle.textContent = extra;
			scope.appendChild( extraStyle );
		}
	}

	const state = {
		marker,
		bar,
		fill,
		scope,
		config,
		contentEl: null,
		pending: false,
		lastPct: -1,
		_onScroll: null,
		_onResize: null
	};

	if ( config.scrollTarget === 'content' ) {
		state.contentEl = resolveContentElement( config.contentSelector || '' );
	}

	// Initial paint without animation.
	const initialFracTransition = fill.style.transition;
	fill.style.transition = 'none';
	updateBar( state );
	// Restore on next frame so future updates animate.
	const rafInit = window.requestAnimationFrame || function ( cb ) { return window.setTimeout( cb, 16 ); };
	rafInit( () => {
		fill.style.transition = initialFracTransition;
	} );

	state._onScroll = () => scheduleUpdate( state );
	state._onResize = () => {
		// Re-resolve content element on resize in case the theme swapped layouts.
		if ( config.scrollTarget === 'content' ) {
			state.contentEl = resolveContentElement( config.contentSelector || '' );
		}
		scheduleUpdate( state );
	};

	window.addEventListener( 'scroll', state._onScroll, { passive: true } );
	window.addEventListener( 'resize', state._onResize );

	// Strip the now-consumed config attribute to keep the DOM tidy.
	marker.removeAttribute( 'data-bb-rp-config' );
};

const initAll = () => {
	const markers = document.querySelectorAll( '.wp-block-b-blocks-reading-progress[data-bb-rp-config]' );
	markers.forEach( ( marker ) => initInstance( marker ) );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAll );
} else {
	initAll();
}
