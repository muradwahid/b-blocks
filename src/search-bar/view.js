/**
 * Search Bar — frontend behavior.
 *
 * The block is server-rendered as a standard <form method="get"> so a no-JS
 * ?s= submit always works. This dependency-free script (apart from
 * @wordpress/i18n) hydrates the optional live-suggestion dropdown by querying
 * the public /wp-json/wp/v2/search REST endpoint with a debounced, abortable
 * fetch. It implements the ARIA combobox/listbox keyboard pattern.
 *
 * SECURITY: suggestion titles from the REST API are written with textContent
 * (never innerHTML) so a malicious post title cannot inject markup; each
 * suggestion URL is read from the REST `url` field and validated to be a safe
 * http(s) absolute URL before being assigned to the anchor href.
 *
 * A `data-bb-sb-init` guard prevents double binding when the block appears more
 * than once in a pattern.
 */
import { __, sprintf, _n } from '@wordpress/i18n';

import './style.scss';

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

const isSafeUrl = ( url ) => {
	if ( ! url || typeof url !== 'string' ) return false;
	try {
		const parsed = new URL( url );
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch ( e ) {
		return false;
	}
};

const initSearchBar = ( wrapper ) => {
	if ( wrapper.dataset.bbSbInit === '1' ) return;
	wrapper.dataset.bbSbInit = '1';

	const liveSearch = wrapper.dataset.liveSearch === '1';
	if ( ! liveSearch ) return;

	const restUrl = wrapper.dataset.restUrl || '';
	if ( ! restUrl ) return;

	const input = wrapper.querySelector( '.bb-search-input' );
	const listbox = wrapper.querySelector( '.bb-search-listbox' );
	const status = wrapper.querySelector( '.bb-search-status' );
	if ( ! input || ! listbox ) return;

	const postTypes = ( wrapper.dataset.postTypes || 'post' )
		.split( ',' )
		.map( ( t ) => t.trim() )
		.filter( Boolean );
	const perPage = Math.min(
		Math.max( parseInt( wrapper.dataset.maxSuggestions, 10 ) || 5, 1 ),
		10
	);
	const showPostType = wrapper.dataset.showPostType === '1';
	const noResultsText = wrapper.dataset.noResults || __( 'No results found.', 'b-blocks' );

	let debounceTimer = null;
	let controller = null;
	let activeIndex = -1;
	let options = [];

	const announce = ( message ) => {
		if ( status ) status.textContent = message;
	};

	const closeDropdown = () => {
		listbox.hidden = true;
		listbox.replaceChildren();
		options = [];
		activeIndex = -1;
		input.setAttribute( 'aria-expanded', 'false' );
		input.removeAttribute( 'aria-activedescendant' );
	};

	const setActive = ( index ) => {
		options.forEach( ( opt, i ) => {
			const isActive = i === index;
			opt.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
			opt.classList.toggle( 'is-active', isActive );
		} );
		activeIndex = index;
		if ( index >= 0 && options[ index ] ) {
			input.setAttribute( 'aria-activedescendant', options[ index ].id );
			options[ index ].scrollIntoView( { block: 'nearest' } );
		} else {
			input.removeAttribute( 'aria-activedescendant' );
		}
	};

	const renderSuggestions = ( results ) => {
		listbox.replaceChildren();
		options = [];
		activeIndex = -1;

		if ( ! results.length ) {
			const li = document.createElement( 'li' );
			li.className = 'bb-search-empty';
			li.setAttribute( 'role', 'option' );
			li.setAttribute( 'aria-disabled', 'true' );
			li.textContent = noResultsText;
			listbox.appendChild( li );
			listbox.hidden = false;
			input.setAttribute( 'aria-expanded', 'true' );
			announce( noResultsText );
			return;
		}

		results.forEach( ( item, index ) => {
			const url = typeof item.url === 'string' ? item.url : '';
			if ( ! isSafeUrl( url ) ) return;

			const li = document.createElement( 'li' );
			li.className = 'bb-search-option';
			li.id = `${ listbox.id }-option-${ index }`;
			li.setAttribute( 'role', 'option' );
			li.setAttribute( 'aria-selected', 'false' );

			const link = document.createElement( 'a' );
			link.className = 'bb-search-option-link';
			link.href = url;
			link.tabIndex = -1;

			const titleSpan = document.createElement( 'span' );
			titleSpan.className = 'bb-search-option-title';
			// SECURITY: textContent only — never innerHTML — to prevent XSS from titles.
			titleSpan.textContent = item.title || '';
			link.appendChild( titleSpan );

			if ( showPostType && item.subtype ) {
				const typeSpan = document.createElement( 'span' );
				typeSpan.className = 'bb-search-type';
				typeSpan.textContent = String( item.subtype );
				link.appendChild( typeSpan );
			}

			li.appendChild( link );
			listbox.appendChild( li );
			options.push( li );
		} );

		if ( ! options.length ) {
			closeDropdown();
			return;
		}

		listbox.hidden = false;
		input.setAttribute( 'aria-expanded', 'true' );
		announce(
			sprintf(
				/* translators: %d: number of search suggestions found. */
				_n( '%d result found.', '%d results found.', options.length, 'b-blocks' ),
				options.length
			)
		);
	};

	const fetchSuggestions = ( query ) => {
		if ( controller ) controller.abort();
		controller = new AbortController();

		const params = new URLSearchParams();
		params.set( 'search', query );
		params.set( 'type', 'post' );
		if ( postTypes.length ) params.set( 'subtype', postTypes.join( ',' ) );
		params.set( 'per_page', String( perPage ) );
		params.set( '_fields', 'id,title,url,subtype' );

		const sep = restUrl.indexOf( '?' ) === -1 ? '?' : '&';
		const requestUrl = `${ restUrl }${ sep }${ params.toString() }`;

		fetch( requestUrl, {
			signal: controller.signal,
			credentials: 'same-origin',
			headers: { Accept: 'application/json' },
		} )
			.then( ( res ) => ( res.ok ? res.json() : Promise.reject( res ) ) )
			.then( ( data ) => {
				if ( Array.isArray( data ) ) {
					renderSuggestions( data );
				} else {
					closeDropdown();
				}
			} )
			.catch( ( err ) => {
				// Aborted requests are expected; only hide on real failures.
				if ( err && err.name === 'AbortError' ) return;
				closeDropdown();
			} );
	};

	input.addEventListener( 'input', () => {
		const query = input.value.trim();
		window.clearTimeout( debounceTimer );

		if ( query.length < MIN_CHARS ) {
			if ( controller ) controller.abort();
			closeDropdown();
			return;
		}

		debounceTimer = window.setTimeout( () => fetchSuggestions( query ), DEBOUNCE_MS );
	} );

	input.addEventListener( 'keydown', ( event ) => {
		const isOpen = ! listbox.hidden && options.length > 0;

		switch ( event.key ) {
			case 'ArrowDown':
				if ( ! isOpen ) return;
				event.preventDefault();
				setActive( ( activeIndex + 1 ) % options.length );
				break;
			case 'ArrowUp':
				if ( ! isOpen ) return;
				event.preventDefault();
				setActive( activeIndex <= 0 ? options.length - 1 : activeIndex - 1 );
				break;
			case 'Enter':
				if ( isOpen && activeIndex >= 0 && options[ activeIndex ] ) {
					event.preventDefault();
					const link = options[ activeIndex ].querySelector( 'a' );
					if ( link ) window.location.assign( link.href );
				}
				break;
			case 'Escape':
				if ( isOpen ) {
					event.preventDefault();
					closeDropdown();
					input.focus();
				}
				break;
			default:
				break;
		}
	} );

	// Pointer support: highlight on hover, navigate on click.
	listbox.addEventListener( 'mousemove', ( event ) => {
		const li = event.target.closest( '.bb-search-option' );
		if ( ! li ) return;
		const index = options.indexOf( li );
		if ( index !== -1 && index !== activeIndex ) setActive( index );
	} );

	// Close when clicking outside the block.
	document.addEventListener( 'click', ( event ) => {
		if ( ! wrapper.contains( event.target ) ) closeDropdown();
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( '.bb-search[data-rest-url]' )
		.forEach( initSearchBar );
} );
