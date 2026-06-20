/**
 * Post Masonry Grid — frontend behavior.
 *
 * The block is server-rendered. This dependency-free script hydrates two
 * independent features:
 *
 *   1. A client-side category filter that shows/hides already-rendered cards
 *      based on each card's `data-bb-pmg-cats` slug list. The masonry re-layout
 *      is pure CSS (`column-count`), so no JS layout call is needed.
 *   2. An AJAX Load More button that appends additional server-rendered cards
 *      from the hardened `bb_pmg_load_more` admin-ajax endpoint. The appended
 *      HTML is produced and pre-escaped server-side, so the only DOM injection
 *      here is a trusted, server-escaped fragment.
 *
 * A `data-bb-pmg-init` guard prevents double binding when the block appears more
 * than once on the page.
 */
import { __, sprintf } from '@wordpress/i18n';

import './style.scss';

const initGrid = ( wrapper ) => {
	if ( wrapper.dataset.bbPmgInit === '1' ) return;
	wrapper.dataset.bbPmgInit = '1';

	const grid = wrapper.querySelector( '.bb-pmg-grid' );
	if ( ! grid ) return;

	const status = wrapper.querySelector( '.bb-pmg-status' );
	const empty = wrapper.querySelector( '.bb-pmg-empty' );
	const filterBtns = Array.from( wrapper.querySelectorAll( '.bb-pmg-filter-btn' ) );
	const loadMoreWrap = wrapper.querySelector( '.bb-pmg-loadmore-wrap' );
	const loadMoreBtn = wrapper.querySelector( '.bb-pmg-load-more' );

	const ajaxUrl = wrapper.dataset.bbPmgAjax || '';
	const nonce = wrapper.dataset.bbPmgNonce || '';
	const loadMoreEnabled = wrapper.dataset.bbPmgLoadmore === '1';

	let attributes = {};
	try {
		attributes = JSON.parse( wrapper.dataset.bbPmgAttributes || '{}' );
	} catch ( e ) {
		attributes = {};
	}

	let currentFilter = 'all';
	let currentPage = parseInt( wrapper.dataset.bbPmgPage, 10 ) || 1;
	let busy = false;

	const announce = ( message ) => {
		if ( status ) status.textContent = message;
	};

	const cardCats = ( card ) => {
		try {
			const list = JSON.parse( card.dataset.bbPmgCats || '[]' );
			return Array.isArray( list ) ? list : [];
		} catch ( e ) {
			return [];
		}
	};

	// Apply the active filter to a set of card <li> elements.
	const applyFilter = ( cards ) => {
		let visible = 0;
		cards.forEach( ( card ) => {
			const match = currentFilter === 'all' || cardCats( card ).includes( currentFilter );
			card.classList.toggle( 'is-hidden', ! match );
			if ( match ) visible += 1;
		} );
		return visible;
	};

	const refreshEmptyState = () => {
		const cards = Array.from( grid.querySelectorAll( '.bb-pmg-card' ) );
		const visible = cards.filter( ( c ) => ! c.classList.contains( 'is-hidden' ) ).length;
		if ( empty ) empty.hidden = visible !== 0;
		return visible;
	};

	// --- Filter bar ---
	filterBtns.forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			const filter = btn.dataset.bbPmgFilter || 'all';
			if ( filter === currentFilter ) return;

			filterBtns.forEach( ( sibling ) => {
				const active = sibling === btn;
				sibling.classList.toggle( 'is-active', active );
				sibling.setAttribute( 'aria-pressed', active ? 'true' : 'false' );
			} );

			currentFilter = filter;
			applyFilter( Array.from( grid.querySelectorAll( '.bb-pmg-card' ) ) );
			const visible = refreshEmptyState();
			announce(
				sprintf(
					/* translators: %d: number of posts shown. */
					__( 'Showing %d posts.', 'b-blocks' ),
					visible
				)
			);
		} );
	} );

	// --- Load More (AJAX) ---
	const toggleLoadMore = ( hasMore ) => {
		if ( ! loadMoreWrap ) return;
		loadMoreWrap.style.display = ( loadMoreEnabled && hasMore ) ? '' : 'none';
	};

	if ( loadMoreBtn && ajaxUrl && nonce ) {
		loadMoreBtn.addEventListener( 'click', () => {
			if ( busy ) return;
			const nextPage = currentPage + 1;
			busy = true;
			loadMoreBtn.classList.add( 'is-loading' );
			loadMoreBtn.setAttribute( 'aria-busy', 'true' );
			grid.setAttribute( 'aria-busy', 'true' );
			announce( __( 'Loading more posts…', 'b-blocks' ) );

			const body = new URLSearchParams();
			body.append( 'action', 'bb_pmg_load_more' );
			body.append( 'nonce', nonce );
			body.append( 'paged', String( nextPage ) );
			body.append( 'attributes', JSON.stringify( attributes ) );

			fetch( ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString(),
			} )
				.then( ( res ) => res.json() )
				.then( ( json ) => {
					if ( json && json.success && json.data ) {
						currentPage = nextPage;
						const template = document.createElement( 'div' );
						template.innerHTML = json.data.html;
						const newCards = Array.from( template.querySelectorAll( '.bb-pmg-card' ) );
						applyFilter( newCards );
						newCards.forEach( ( card ) => grid.appendChild( card ) );
						toggleLoadMore( !! json.data.hasMore );
						announce(
							sprintf(
								/* translators: %d: number of posts added. */
								__( '%d more posts loaded.', 'b-blocks' ),
								json.data.count || 0
							)
						);
					} else {
						toggleLoadMore( false );
						announce( __( 'No more posts.', 'b-blocks' ) );
					}
				} )
				.catch( () => announce( __( 'Could not load more posts.', 'b-blocks' ) ) )
				.finally( () => {
					busy = false;
					loadMoreBtn.classList.remove( 'is-loading' );
					loadMoreBtn.setAttribute( 'aria-busy', 'false' );
					grid.setAttribute( 'aria-busy', 'false' );
				} );
		} );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-pmg[data-bb-pmg-ajax]' ).forEach( initGrid );
} );
