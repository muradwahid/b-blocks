import { useEffect, useId, useRef, useState } from 'react';

import { sanitizeHtml } from '../../../utils/sanitizeHtml';
import { closeIcon, searchIcon } from '../../utils/icons';

// The words of the query, each escaped for a regular expression (".*+?" and the like are plain text here).
const wordsOf = ( query ) => String( query ).trim().split( /\s+/ ).filter( Boolean ).map( ( word ) => word.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) );

// Text with every word of the query wrapped in <mark>. Built from text nodes: nothing from the server or the visitor
// ever becomes markup. Case-insensitive and Unicode-aware (Bangla, Arabic…).
const Highlight = ( { text = '', query = '' } ) => {
	const words = wordsOf( query );
	if ( ! words.length || ! text ) {
		return text;
	}
	const pattern = new RegExp( `(${ words.join( '|' ) })`, 'giu' );
	return String( text ).split( pattern ).map( ( part, i ) => ( 1 === i % 2 ? <mark key={ i }>{ part }</mark> : part ) );
};

/**
 * The search box and its live results, shared by the editor and the page: both search the site for real.
 * The search and home addresses come in `context` (render.php on the page, Edit.js in the editor). In the editor
 * (isBackend) results, View All and the form never leave the page.
 */
const AdvancedSearch = ( { attributes, context = {}, isBackend = false, labels = {} } ) => {
	const { search = {}, totalResults = {}, viewAll = {}, searchField = {}, button = {}, thumb = {} } = attributes;
	const { postType = 'all', postTypes = [], initialResult = 5, showImage = true, notFoundText = '', minChars = 2, delay = 300, orderBy = 'relevance', includeTerms = [], excludeTerms = [], showExcerpt = true, excerptLength = 22, highlight = true, newTab = false, showDate = false, showType = false } = search;
	const { show: showTotal = true, text: totalText = '', textOne: totalTextOne = '' } = totalResults;
	const { show: showViewAll = true, text: viewAllText = '', always: viewAllAlways = false } = viewAll;
	const { placeholder = '', showIcon: showSearchIcon = true, shortcut = false, autofocus = false } = searchField;
	const { show: showButton = true, position: buttonPosition = 'separate', type: buttonType = 'text', text: buttonText = '', icon: buttonIcon = '' } = button;
	const isSeparate = 'separate' === buttonPosition;
	const { api = '', home = '/', cat = '' } = context;
	const limit = Math.min( 20, Math.max( 1, parseInt( initialResult, 10 ) || 5 ) );
	const minLength = Math.min( 5, Math.max( 2, parseInt( minChars, 10 ) || 2 ) );
	const wait = Number.isFinite( Number( delay ) ) && '' !== delay ? Math.min( 2000, Math.max( 0, Number( delay ) ) ) : 300;
	// 'all', one type, or the chosen several ('multiple'; none chosen searches all, as the page does).
	const searchTypes = 'multiple' === postType ? postTypes : ( 'all' === postType ? [] : [ postType ] );
	const typesParam = searchTypes.length ? searchTypes.join( ',' ) : 'all';
	const include = includeTerms.join( ',' );
	const exclude = excludeTerms.join( ',' );

	const uid = useId().replace( /:/g, '' );
	const listId = `b-blocks-advanced-search-list-${ uid }`;
	const rootRef = useRef( null );
	const inputRef = useRef( null );
	const requestRef = useRef( null );
	// The highlighted result was picked with the arrow keys (not the mouse): only then does Enter open it.
	const byKeyboardRef = useRef( false );

	const [ query, setQuery ] = useState( '' );
	const [ results, setResults ] = useState( [] );
	const [ total, setTotal ] = useState( 0 );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ searched, setSearched ] = useState( '' );
	const [ active, setActive ] = useState( -1 );
	// The search could not be made (server error, no answer): said instead of "not found".
	const [ failed, setFailed ] = useState( false );
	// Text still being composed with an input method (Chinese, Japanese…) is not searched yet.
	const [ composing, setComposing ] = useState( false );
	const term = query.trim();

	// The full results page, as WordPress builds it (with the chosen post types and categories).
	const searchUrl = ( term ) => {
		const url = new URL( home, window.location.href );
		url.searchParams.set( 's', term );
		searchTypes.forEach( ( type ) => url.searchParams.append( 1 < searchTypes.length ? 'post_type[]' : 'post_type', type ) );
		if ( cat ) {
			url.searchParams.set( 'cat', cat );
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
			setFailed( false );
			setSearched( '' );
			return undefined;
		}
		const controller = new AbortController();
		requestRef.current = controller;
		// A search that has not answered in 10 seconds is given up.
		let timedOut = false;
		let limit10 = null;
		const timer = setTimeout( () => {
			setIsLoading( true );
			limit10 = setTimeout( () => {
				timedOut = true;
				controller.abort();
			}, 10000 );
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
			fetch( url.href, { signal: controller.signal, credentials: 'same-origin' } )
				.then( ( res ) => {
					if ( ! res.ok ) {
						throw new Error( `HTTP ${ res.status }` );
					}
					return res.json();
				} )
				.then( ( data ) => {
					setResults( Array.isArray( data?.items ) ? data.items : [] );
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
		}, wait );

		return () => {
			clearTimeout( timer );
			clearTimeout( limit10 );
			controller.abort();
		};
	}, [ term, composing, typesParam, limit, api, minLength, wait, orderBy, include, exclude, excerptLength ] );

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
		if ( ! isOpen || ! results.length ) {
			return;
		}
		if ( 'ArrowDown' === e.key || 'ArrowUp' === e.key ) {
			e.preventDefault();
			// -1 is the field itself: Down past the last result returns to it, Up from it goes to the last result.
			const count = Math.min( results.length, limit );
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
		if ( 'Enter' === e.key && 0 <= active && results[ active ] && byKeyboardRef.current ) {
			e.preventDefault();
			if ( isBackend ) {
				return;
			}
			if ( newTab ) {
				window.open( results[ active ].url, '_blank', 'noopener' );
			} else {
				window.location.assign( results[ active ].url );
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
		setTotal( 0 );
		setFailed( false );
		// Without it, focusing the field below would reopen the old results for a moment.
		setSearched( '' );
		setIsOpen( false );
		setActive( -1 );
		inputRef.current?.focus();
	};

	const stay = ( e ) => isBackend && e.preventDefault();
	const hasText = '' !== query;
	const emptyText = failed ? labels.error : notFoundText;
	// No results and no Not Found text: nothing to show, so the box stays closed (not an empty box).
	const showList = isOpen && '' !== searched && ( 0 < total || '' !== emptyText );
	const totalLine = ( 1 === total && totalTextOne ? totalTextOne : totalText ).replace( /\[post_count\]/g, String( total ) );
	const announce = ! showList || isLoading ? '' : ( total ? ( labels.resultsFound?.[ 1 === total ? 'one' : 'other' ] || '' ).replace( '%d', total ) : emptyText );
	const iconHtml = buttonIcon ? sanitizeHtml( buttonIcon ) : '';
	// An empty Button Text would leave an empty, nameless link.
	const showViewAllLink = showViewAll && '' !== viewAllText && ( viewAllAlways || total > limit );
	// An empty button text reads "Search", as the page's form without JavaScript does.
	const buttonLabel = buttonText || labels.search;
	const linkTarget = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

	// Focus leaving the block (Tab to the next field, another search box) closes the results, as a click outside does.
	const onBlur = ( e ) => ! rootRef.current?.contains( e.relatedTarget ) && setIsOpen( false );

	const buttonJSX = showButton ? (
		<button type='submit' className={ `b-blocks-advanced-search-button is-${ buttonType }` } aria-label={ 'icon' === buttonType ? buttonLabel : undefined }>
			{ 'text' !== buttonType && ( iconHtml ? <span className='b-blocks-advanced-search-button-icon is-custom' aria-hidden='true' dangerouslySetInnerHTML={ { __html: iconHtml } } /> : <span className='b-blocks-advanced-search-button-icon' aria-hidden='true'>{ searchIcon }</span> ) }
			{ 'icon' !== buttonType && <span>{ buttonLabel }</span> }
		</button>
	) : null;

	return <div ref={ rootRef } className={ `b-blocks-advanced-search${ isLoading ? ' is-loading' : '' }${ showList ? ' is-open' : '' }` } onBlur={ onBlur }>
		<form className={ `b-blocks-advanced-search-form ${ isSeparate ? 'is-separate' : 'is-nested' }` } role='search' action={ home } method='get' onSubmit={ onSubmit }>
			<div className='b-blocks-advanced-search-field'>
				{ showSearchIcon && <span className='b-blocks-advanced-search-icon' aria-hidden='true'>{ searchIcon }</span> }

				<input
					ref={ inputRef }
					className='b-blocks-advanced-search-input'
					type='search'
					name='s'
					value={ query }
					placeholder={ placeholder }
					autoComplete='off'
					role='combobox'
					aria-label={ placeholder || labels.search }
					aria-expanded={ showList }
					aria-controls={ listId }
					aria-autocomplete='list'
					aria-activedescendant={ showList && 0 <= active ? `${ listId }-${ active }` : undefined }
					maxLength={ 100 }
					onChange={ ( e ) => setQuery( e.target.value ) }
					onCompositionStart={ () => setComposing( true ) }
					onCompositionEnd={ ( e ) => {
						setComposing( false );
						setQuery( e.target.value );
					} }
					onKeyDown={ onKeyDown }
					onFocus={ () => '' !== searched && setIsOpen( true ) }
				/>

				{ isLoading && <span className='b-blocks-advanced-search-loader' role='status' aria-label={ labels.loading } /> }

				{ hasText && ! isLoading && <button type='button' className='b-blocks-advanced-search-clear' aria-label={ labels.clear } onClick={ clear }>{ closeIcon }</button> }

				{ ! isSeparate && buttonJSX }
			</div>

			{ searchTypes.map( ( type ) => <input key={ type } type='hidden' name={ 1 < searchTypes.length ? 'post_type[]' : 'post_type' } value={ type } /> ) }

			{ cat && <input type='hidden' name='cat' value={ cat } /> }

			{ isSeparate && buttonJSX }
		</form>

		<div className='b-blocks-advanced-search-results' hidden={ ! showList }>
			<ul id={ listId } className='b-blocks-advanced-search-list' role='listbox' aria-label={ labels.results }>
				{ results.slice( 0, limit ).map( ( item, i ) => <li
					key={ item.id || i }
					id={ `${ listId }-${ i }` }
					className={ `b-blocks-advanced-search-item${ i === active ? ' is-active' : '' }` }
					role='option'
					aria-selected={ i === active }
					onMouseEnter={ () => {
						byKeyboardRef.current = false;
						setActive( i );
					} }
				>
					<a href={ item.url } onClick={ stay } tabIndex={ -1 } { ...linkTarget }>
						{ showImage && item.image && <img className='b-blocks-advanced-search-thumb' src={ item.image } srcSet={ item.srcset || undefined } sizes={ item.srcset ? ( /^\d+(\.\d+)?px$/.test( thumb.desktop?.size || '' ) ? thumb.desktop.size : '64px' ) : undefined } alt={ item.alt || '' } loading='lazy' /> }

						<span className='b-blocks-advanced-search-text'>
							<span className='b-blocks-advanced-search-title'>{ highlight ? <Highlight text={ item.title } query={ searched } /> : item.title }</span>
							{ ( ( showDate && item.date ) || ( showType && item.type ) ) && <span className='b-blocks-advanced-search-meta'>{ [ showDate && item.date, showType && item.type ].filter( Boolean ).join( ' · ' ) }</span> }
							{ showExcerpt && item.excerpt && <span className='b-blocks-advanced-search-excerpt'>{ highlight ? <Highlight text={ item.excerpt } query={ searched } /> : item.excerpt }</span> }
						</span>
					</a>
				</li> ) }
			</ul>

			{ 0 === total && <p className='b-blocks-advanced-search-not-found'>{ emptyText }</p> }

			{ 0 < total && ( showTotal || showViewAllLink ) && <div className='b-blocks-advanced-search-footer'>
				{ showTotal && <p className='b-blocks-advanced-search-total'>{ totalLine }</p> }

				{ showViewAllLink && <a className='b-blocks-advanced-search-view-all' href={ isBackend ? '#' : searchUrl( searched ) } onClick={ stay } { ...linkTarget }>{ viewAllText }</a> }
			</div> }
		</div>

		<span className='screen-reader-text' role='status' aria-live='polite'>{ announce }</span>
	</div>;
};
export default AdvancedSearch;