import { useEffect, useId, useRef, useState } from 'react';

import SearchForm from './SearchForm';
import ResultsBox from './ResultsBox';

/**
 * The search box and its live results, shared by the editor and the page: both search the site for real.
 * The search and home addresses come in `context` (render.php on the page, Edit.js in the editor). In the editor
 * (isBackend) results, View All and the form never leave the page.
 */
const AdvancedSearch = ( { attributes, context = {}, isBackend = false, labels = {} } ) => {
	const { search = {}, totalResults = {}, viewAll = {}, searchField = {} } = attributes;
	const { postType = 'all', postTypes = [], initialResult = 5, notFoundText = '', minChars = 2, delay = 300, orderBy = 'relevance', includeTerms = [], excludeTerms = [], excerptLength = 22, newTab = false, searchIn = 'all', excludePosts = [], showAuthor = false, showCategory = false, showTerms = false, termsLimit = 3, fallback = 'none', fallbackPosts = [], groupByType = false } = search;
	const { text: totalText = '', textOne: totalTextOne = '' } = totalResults;
	const { show: showViewAll = true, text: viewAllText = '', always: viewAllAlways = false } = viewAll;
	const { placeholder = '', shortcut = false, autofocus = false, placeholders = '' } = searchField;
	const { api = '', home = '/', cat = '', filter = null } = context;
	const limit = Math.min( 20, Math.max( 1, parseInt( initialResult, 10 ) || 5 ) );
	const minLength = Math.min( 5, Math.max( 2, parseInt( minChars, 10 ) || 2 ) );
	const wait = Number.isFinite( Number( delay ) ) && '' !== delay ? Math.min( 2000, Math.max( 0, Number( delay ) ) ) : 300;
	// 'all', one type, or the chosen several ('multiple'; none chosen searches all, as the page does).
	const searchTypes = 'multiple' === postType ? postTypes : ( 'all' === postType ? [] : [ postType ] );
	const typesParam = searchTypes.length ? searchTypes.join( ',' ) : 'all';
	const include = includeTerms.join( ',' );
	const exclude = excludeTerms.join( ',' );
	const hidePosts = excludePosts.join( ',' );
	const fallbackIds = fallbackPosts.join( ',' );
	const termsCount = showTerms ? Math.min( 10, Math.max( 1, parseInt( termsLimit, 10 ) || 3 ) ) : 0;
	// The Placeholder Text and the extra ones (one per line) take turns.
	const allPlaceholders = [ placeholder, ...String( placeholders ).split( '\n' ).map( ( line ) => line.trim() ) ].filter( Boolean );

	const uid = useId().replace( /:/g, '' );
	const listId = `b-blocks-advanced-search-list-${ uid }`;
	const rootRef = useRef( null );
	const inputRef = useRef( null );
	const requestRef = useRef( null );
	// The highlighted result was picked with the arrow keys (not the mouse): only then does Enter open it.
	const byKeyboardRef = useRef( false );
	// Answers already received during this visit, by address: going back to an earlier query shows it at once.
	const cacheRef = useRef( new Map() );

	const [ query, setQuery ] = useState( '' );
	const [ results, setResults ] = useState( [] );
	// Matching categories/tags, and the posts offered when nothing matched.
	const [ terms, setTerms ] = useState( [] );
	const [ fallbackItems, setFallbackItems ] = useState( [] );
	// Grouped by post type (Pro): each type's name and total, in order.
	const [ groups, setGroups ] = useState( [] );
	const [ tick, setTick ] = useState( 0 );
	const [ total, setTotal ] = useState( 0 );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ searched, setSearched ] = useState( '' );
	const [ active, setActive ] = useState( -1 );
	// The search could not be made (server error, no answer): said instead of "not found".
	const [ failed, setFailed ] = useState( false );
	// Text still being composed with an input method (Chinese, Japanese…) is not searched yet.
	const [ composing, setComposing ] = useState( false );
	// The term picked in the filter dropdown (its slug; '' = all), and its ID for the search.
	const [ filterTerm, setFilterTerm ] = useState( '' );
	const filterId = filter?.terms?.find( ( t ) => t.slug === filterTerm )?.id || 0;
	const term = query.trim();

	// The full results page, as WordPress builds it (with the chosen post types and categories).
	const searchUrl = ( term ) => {
		const url = new URL( home, window.location.href );
		url.searchParams.set( 's', term );
		searchTypes.forEach( ( type ) => url.searchParams.append( 1 < searchTypes.length ? 'post_type[]' : 'post_type', type ) );
		if ( cat ) {
			url.searchParams.set( 'cat', cat );
		}
		if ( filterTerm && filter?.name ) {
			url.searchParams.set( filter.name, filterTerm );
		}
		return url.href;
	};

	// Live search: `delay` ms after typing stops, from `minChars` characters. A newer search cancels the one in flight.
	useEffect( () => {
		// No search address yet (the editor is still loading the site address).
		if ( ! api || composing ) {
			return undefined;
		}
		requestRef.current?.abort();
		if ( minLength > term.length ) {
			setIsLoading( false );
			setIsOpen( false );
			setResults( [] );
			setTerms( [] );
			setFallbackItems( [] );
			setGroups( [] );
			setFailed( false );
			setSearched( '' );
			return undefined;
		}
		const controller = new AbortController();
		requestRef.current = controller;
		const url = new URL( api, window.location.href );
		url.searchParams.set( 'query', term );
		url.searchParams.set( 'post_type', typesParam );
		url.searchParams.set( 'per_page', limit );
		url.searchParams.set( 'orderby', orderBy );
		url.searchParams.set( 'excerpt_length', excerptLength );
		if ( include ) {
			url.searchParams.set( 'include', include );
		}
		if ( exclude ) {
			url.searchParams.set( 'exclude', exclude );
		}
		if ( 'title' === searchIn ) {
			url.searchParams.set( 'search_in', 'title' );
		}
		if ( hidePosts ) {
			url.searchParams.set( 'exclude_posts', hidePosts );
		}
		if ( showAuthor ) {
			url.searchParams.set( 'with_author', '1' );
		}
		if ( showCategory ) {
			url.searchParams.set( 'with_category', '1' );
		}
		if ( termsCount ) {
			url.searchParams.set( 'terms', termsCount );
		}
		if ( filterId ) {
			url.searchParams.set( 'filter', filterId );
		}
		if ( groupByType ) {
			url.searchParams.set( 'group', '1' );
		}
		if ( 'recent' === fallback || ( 'chosen' === fallback && fallbackIds ) ) {
			url.searchParams.set( 'fallback', fallback );
			if ( 'chosen' === fallback ) {
				url.searchParams.set( 'fallback_posts', fallbackIds );
			}
		}
		const cached = cacheRef.current.get( url.href );
		// A search that has not answered in 10 seconds is given up.
		let timedOut = false;
		let limit10 = null;
		const timer = setTimeout( () => {
			if ( ! cached ) {
				setIsLoading( true );
			}
			limit10 = setTimeout( () => {
				timedOut = true;
				controller.abort();
			}, 10000 );
			( cached ? Promise.resolve( cached ) : fetch( url.href, { signal: controller.signal, credentials: 'same-origin' } )
				.then( ( res ) => {
					if ( ! res.ok ) {
						throw new Error( `HTTP ${ res.status }` );
					}
					return res.json();
				} )
				.then( ( data ) => {
					// The 50 latest answers are kept; errors never are.
					cacheRef.current.set( url.href, data );
					if ( 50 < cacheRef.current.size ) {
						cacheRef.current.delete( cacheRef.current.keys().next().value );
					}
					return data;
				} ) )
				.then( ( data ) => {
					if ( controller.signal.aborted ) {
						return;
					}
					setResults( Array.isArray( data?.items ) ? data.items : [] );
					setTerms( Array.isArray( data?.terms ) ? data.terms : [] );
					setFallbackItems( Array.isArray( data?.fallback ) ? data.fallback : [] );
					setGroups( Array.isArray( data?.groups ) ? data.groups : [] );
					setTotal( Number( data?.total ) || 0 );
					setFailed( false );
					setSearched( term );
					setActive( -1 );
					setIsOpen( true );
				} )
				.catch( ( error ) => {
					// A newer search cancelled this one: nothing to show. A time-out or an error is said.
					if ( timedOut || 'AbortError' !== error?.name ) {
						setResults( [] );
						setTerms( [] );
						setFallbackItems( [] );
						setGroups( [] );
						setTotal( 0 );
						setFailed( true );
						setSearched( term );
						setIsOpen( true );
					}
				} )
				.finally( () => {
					clearTimeout( limit10 );
					if ( timedOut || ! controller.signal.aborted ) {
						setIsLoading( false );
					}
				} );
		}, cached ? 0 : wait );

		return () => {
			clearTimeout( timer );
			clearTimeout( limit10 );
			controller.abort();
		};
	}, [ term, composing, typesParam, limit, api, minLength, wait, orderBy, include, exclude, excerptLength, searchIn, hidePosts, showAuthor, showCategory, termsCount, fallback, fallbackIds, filterId, groupByType ] );

	// Several placeholders: the next one every 3 seconds; one only for visitors who prefer reduced motion.
	useEffect( () => {
		const view = rootRef.current?.ownerDocument?.defaultView || window;
		if ( 2 > allPlaceholders.length || view.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches ) {
			return undefined;
		}
		const timer = setInterval( () => setTick( ( current ) => current + 1 ), 3000 );
		return () => clearInterval( timer );
	}, [ allPlaceholders.length ] );

	// The result picked with the arrow keys stays in view when the list scrolls (Max Height).
	useEffect( () => {
		if ( 0 <= active && byKeyboardRef.current ) {
			rootRef.current?.querySelector( `#${ listId }-${ active }` )?.scrollIntoView( { block: 'nearest' } );
		}
	}, [ active, listId ] );

	// Page only: "/" anywhere outside a text field jumps to the search field; Autofocus focuses it on load (without
	// scrolling to it). The first block on the page that takes "/" wins.
	useEffect( () => {
		if ( isBackend ) {
			return undefined;
		}
		if ( autofocus ) {
			inputRef.current?.focus( { preventScroll: true } );
		}
		if ( ! shortcut ) {
			return undefined;
		}
		const onSlash = ( e ) => {
			const target = e.target;
			if ( '/' !== e.key || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || target?.isContentEditable || [ 'INPUT', 'TEXTAREA', 'SELECT' ].includes( target?.tagName ) ) {
				return;
			}
			e.preventDefault();
			inputRef.current?.focus();
		};
		document.addEventListener( 'keydown', onSlash );
		return () => document.removeEventListener( 'keydown', onSlash );
	}, [ isBackend, shortcut, autofocus ] );

	// Editor: its arrow navigation (a native listener above the block, so it runs before React) would move Up/Down
	// to the next block. It skips handled keys, so they are marked handled here; onKeyDown still gets them.
	useEffect( () => {
		const input = inputRef.current;
		if ( ! isBackend || ! input ) {
			return undefined;
		}
		const keep = ( e ) => ( 'ArrowDown' === e.key || 'ArrowUp' === e.key ) && e.preventDefault();
		input.addEventListener( 'keydown', keep );
		return () => input.removeEventListener( 'keydown', keep );
	}, [ isBackend ] );

	// A click outside closes the results.
	useEffect( () => {
		if ( ! isOpen ) {
			return undefined;
		}
		// The editor canvas is an iframe: listen on the document the block is in.
		const doc = rootRef.current?.ownerDocument || document;
		const onDown = ( e ) => ! rootRef.current?.contains( e.target ) && setIsOpen( false );
		doc.addEventListener( 'mousedown', onDown );
		return () => doc.removeEventListener( 'mousedown', onDown );
	}, [ isOpen ] );

	// The rows of the list: matching terms first, then the results. When nothing matched at all, the fallback posts.
	const nothing = 0 === total && ! terms.length;
	// Grouped results come limited per post type by the server, so they are not cut here.
	const rows = [ ...( termsCount ? terms.map( ( t ) => ( { ...t, isTerm: true } ) ) : [] ), ...( 0 < total ? ( groups.length ? results : results.slice( 0, limit ) ) : ( nothing ? fallbackItems : [] ) ) ];

	const onKeyDown = ( e ) => {
		if ( 'Escape' === e.key ) {
			// A search field empties itself on Escape: the first Escape only closes the results and keeps the text.
			if ( isOpen ) {
				e.preventDefault();
			}
			setIsOpen( false );
			setActive( -1 );
			return;
		}
		if ( ! isOpen || ! rows.length ) {
			return;
		}
		if ( 'ArrowDown' === e.key || 'ArrowUp' === e.key ) {
			e.preventDefault();
			// -1 is the field itself: Down past the last result returns to it, Up from it goes to the last result.
			const count = rows.length;
			byKeyboardRef.current = true;
			setActive( ( current ) => {
				const next = current + ( 'ArrowDown' === e.key ? 1 : -1 );
				if ( next >= count ) {
					return -1;
				}
				return -1 > next ? count - 1 : next;
			} );
		}
		// Enter on a highlighted result opens it; otherwise the form goes to the full results page.
		// A result under a resting mouse is highlighted too (the browser hovers it when the list opens): Enter then still
		// searches what was typed.
		if ( 'Enter' === e.key && 0 <= active && rows[ active ] && byKeyboardRef.current ) {
			e.preventDefault();
			if ( isBackend ) {
				return;
			}
			if ( newTab ) {
				window.open( rows[ active ].url, '_blank', 'noopener' );
			} else {
				window.location.assign( rows[ active ].url );
			}
		}
	};

	const onSubmit = ( e ) => {
		if ( isBackend ) {
			e.preventDefault();
			return;
		}
		if ( '' === query.trim() ) {
			e.preventDefault();
		}
	};

	const clear = () => {
		requestRef.current?.abort();
		setQuery( '' );
		setResults( [] );
		setTerms( [] );
		setFallbackItems( [] );
		setGroups( [] );
		setTotal( 0 );
		setFailed( false );
		// Without it, focusing the field below would reopen the old results for a moment.
		setSearched( '' );
		setIsOpen( false );
		setActive( -1 );
		inputRef.current?.focus();
	};

	const stay = ( e ) => isBackend && e.preventDefault();
	const emptyText = failed ? labels.error : notFoundText;
	// No results and no Not Found text: nothing to show, so the box stays closed (not an empty box).
	const showList = isOpen && '' !== searched && ( 0 < rows.length || '' !== emptyText );
	const totalLine = ( 1 === total && totalTextOne ? totalTextOne : totalText ).replace( /\[post_count\]/g, String( total ) );
	const announce = ! showList || isLoading ? '' : ( total ? ( labels.resultsFound?.[ 1 === total ? 'one' : 'other' ] || '' ).replace( '%d', total ) : emptyText );
	// An empty Button Text would leave an empty, nameless link.
	const showViewAllLink = showViewAll && '' !== viewAllText && ( viewAllAlways || total > limit );
	const linkTarget = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

	// Focus leaving the block (Tab to the next field, another search box) closes the results, as a click outside does.
	const onBlur = ( e ) => ! rootRef.current?.contains( e.relatedTarget ) && setIsOpen( false );
	// Back in the field after a search: its results open again.
	const onFocus = () => '' !== searched && setIsOpen( true );
	// A row under the mouse is highlighted, but Enter does not open it (only a row picked with the arrow keys).
	const onRowHover = ( i ) => {
		byKeyboardRef.current = false;
		setActive( i );
	};

	return <div ref={ rootRef } className={ `b-blocks-advanced-search${ isLoading ? ' is-loading' : '' }${ showList ? ' is-open' : '' }` } onBlur={ onBlur }>
		<SearchForm attributes={ attributes } labels={ labels } isBackend={ isBackend } home={ home } searchTypes={ searchTypes } cat={ cat } filter={ filter } filterTerm={ filterTerm } setFilterTerm={ setFilterTerm } inputRef={ inputRef } query={ query } setQuery={ setQuery } setComposing={ setComposing } placeholderText={ allPlaceholders[ tick % allPlaceholders.length ] || '' } isLoading={ isLoading } showList={ showList } listId={ listId } active={ active } onKeyDown={ onKeyDown } onSubmit={ onSubmit } onFocus={ onFocus } clear={ clear } />

		<ResultsBox attributes={ attributes } labels={ labels } isBackend={ isBackend } showList={ showList } nothing={ nothing } emptyText={ emptyText } rows={ rows } listId={ listId } active={ active } onRowHover={ onRowHover } searched={ searched } stay={ stay } linkTarget={ linkTarget } total={ total } totalLine={ totalLine } showViewAllLink={ showViewAllLink } searchUrl={ searchUrl } groups={ groups } />

		<span className='screen-reader-text' role='status' aria-live='polite'>{ announce }</span>
	</div>;
};
export default AdvancedSearch;