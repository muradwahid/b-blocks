/**
 * Post Filter Grid — frontend behavior.
 *
 * The block is server-rendered. This dependency-free script hydrates the filter
 * pill bar (AJAX-swaps the grid) and the optional Load More button (AJAX-appends
 * cards). All post markup is produced server-side and returned pre-escaped by the
 * `bb_pfg_query` endpoint, so the only DOM injection here is the trusted,
 * server-escaped HTML fragment. A `data-bb-pfg-init` guard prevents double
 * binding when the block appears more than once in a pattern.
 */
import { __, sprintf } from '@wordpress/i18n';

import './style.scss';

const initGrid = ( wrapper ) => {
	if ( wrapper.dataset.bbPfgInit === '1' ) return;
	wrapper.dataset.bbPfgInit = '1';

	const ajaxUrl = wrapper.dataset.bbPfgAjax || '';
	const nonce = wrapper.dataset.bbPfgNonce || '';
	if ( ! ajaxUrl || ! nonce ) return;

	let attributes = {};
	try {
		attributes = JSON.parse( wrapper.dataset.bbPfgAttributes || '{}' );
	} catch ( e ) {
		attributes = {};
	}

	const grid = wrapper.querySelector( '.bb-pfg-grid' );
	const status = wrapper.querySelector( '.bb-pfg-status' );
	const filterBtns = Array.from( wrapper.querySelectorAll( '.bb-pfg-filter-btn' ) );
	const loadMoreWrap = wrapper.querySelector( '.bb-pfg-loadmore-wrap' );
	const loadMoreBtn = wrapper.querySelector( '.bb-pfg-load-more' );
	if ( ! grid ) return;

	const loadMoreEnabled = wrapper.dataset.bbPfgLoadmore === '1';

	let currentTerm = parseInt( wrapper.dataset.bbPfgTerm, 10 ) || 0;
	let currentPage = parseInt( wrapper.dataset.bbPfgPage, 10 ) || 1;
	let busy = false;

	const announce = ( message ) => {
		if ( status ) status.textContent = message;
	};

	const setBusy = ( state ) => {
		busy = state;
		grid.setAttribute( 'aria-busy', state ? 'true' : 'false' );
		grid.classList.toggle( 'is-loading', state );
	};

	const request = ( termId, page ) => {
		const body = new URLSearchParams();
		body.append( 'action', 'bb_pfg_query' );
		body.append( 'nonce', nonce );
		body.append( 'termId', String( termId ) );
		body.append( 'paged', String( page ) );
		body.append( 'attributes', JSON.stringify( attributes ) );

		return fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		} ).then( ( res ) => res.json() );
	};

	const toggleLoadMore = ( hasMore ) => {
		if ( ! loadMoreWrap ) return;
		loadMoreWrap.style.display = ( loadMoreEnabled && hasMore ) ? '' : 'none';
	};

	const announceCount = ( count ) => {
		announce(
			sprintf(
				/* translators: %d: number of posts shown. */
				__( 'Showing %d posts.', 'b-blocks' ),
				count
			)
		);
	};

	// Filter bar.
	filterBtns.forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			if ( busy ) return;
			const termId = parseInt( btn.dataset.termId, 10 ) || 0;
			if ( termId === currentTerm ) return;

			filterBtns.forEach( ( sibling ) => {
				const active = sibling === btn;
				sibling.classList.toggle( 'is-active', active );
				sibling.setAttribute( 'aria-pressed', active ? 'true' : 'false' );
			} );

			currentTerm = termId;
			currentPage = 1;
			setBusy( true );

			request( termId, 1 )
				.then( ( json ) => {
					if ( json && json.success && json.data ) {
						grid.innerHTML = json.data.html;
						toggleLoadMore( !! json.data.hasMore );
						announceCount( json.data.count || 0 );
						const firstLink = grid.querySelector( '.bb-pfg-card a' );
						if ( firstLink ) firstLink.focus();
					} else {
						announce( __( 'Could not load posts.', 'b-blocks' ) );
					}
				} )
				.catch( () => announce( __( 'Could not load posts.', 'b-blocks' ) ) )
				.finally( () => setBusy( false ) );
		} );
	} );

	// Load More.
	if ( loadMoreBtn ) {
		loadMoreBtn.addEventListener( 'click', () => {
			if ( busy ) return;
			const nextPage = currentPage + 1;
			busy = true;
			loadMoreBtn.classList.add( 'is-loading' );
			loadMoreBtn.setAttribute( 'aria-busy', 'true' );

			request( currentTerm, nextPage )
				.then( ( json ) => {
					if ( json && json.success && json.data ) {
						currentPage = nextPage;
						grid.insertAdjacentHTML( 'beforeend', json.data.html );
						toggleLoadMore( !! json.data.hasMore );
						announce(
							sprintf(
								/* translators: %d: number of posts added. */
								__( 'Loaded %d more posts.', 'b-blocks' ),
								json.data.count || 0
							)
						);
					} else {
						announce( __( 'Could not load more posts.', 'b-blocks' ) );
					}
				} )
				.catch( () => announce( __( 'Could not load more posts.', 'b-blocks' ) ) )
				.finally( () => {
					busy = false;
					loadMoreBtn.classList.remove( 'is-loading' );
					loadMoreBtn.setAttribute( 'aria-busy', 'false' );
				} );
		} );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-pfg[data-bb-pfg-ajax]' ).forEach( initGrid );
} );
