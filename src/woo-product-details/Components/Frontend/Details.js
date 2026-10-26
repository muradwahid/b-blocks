import { useEffect, useMemo, useRef, useState } from 'react';

import { BOX, tabFromLocation } from '../../utils/functions';

const reducedMotion = () => !! window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

const Details = ( { attributes, isBackend = false } ) => {
	const { product = {}, i18n = {} } = attributes;
	const tabs = useMemo( () => product.tabs || [], [ product.tabs ] );

	const rootRef = useRef( null );
	const tablistRef = useRef( null );
	const tabRefs = useRef( {} );

	const [ active, setActive ] = useState( () => {
		const fromUrl = isBackend ? '' : tabFromLocation( window.location, tabs );
		return tabs.some( ( tab ) => tab.key === fromUrl ) ? fromUrl : tabs[ 0 ]?.key;
	} );
	const [ scrollTo, setScrollTo ] = useState( () => ( ! isBackend && tabFromLocation( window.location, tabs ) ? window.location.hash.slice( 1 ) : '' ) );

	const current = tabs.some( ( tab ) => tab.key === active ) ? active : tabs[ 0 ]?.key;

	useEffect( () => {
		if ( isBackend ) return undefined;

		const open = ( hash ) => {
			const key = tabFromLocation( { hash }, tabs );
			if ( ! tabs.some( ( tab ) => tab.key === key ) ) return;
			setActive( key );
			setScrollTo( hash.slice( 1 ) );
		};

		const onHashChange = () => open( window.location.hash );

		const onClick = ( event ) => {
			const link = event.target?.closest?.( 'a[href*="#"]' );
			if ( ! link || link.host !== window.location.host || link.pathname !== window.location.pathname ) return;
			if ( link.hash && link.hash === window.location.hash ) open( link.hash );
		};

		window.addEventListener( 'hashchange', onHashChange );
		document.addEventListener( 'click', onClick );

		return () => {
			window.removeEventListener( 'hashchange', onHashChange );
			document.removeEventListener( 'click', onClick );
		};
	}, [ isBackend, tabs ] );

	useEffect( () => {
		if ( ! scrollTo || ! rootRef.current ) return;
		setScrollTo( '' );

		const target = document.getElementById( scrollTo );
		const key = tabFromLocation( { hash: `#${ scrollTo }` } );
		const owner = target?.closest( `.${ BOX }` ) || document.querySelector( `.${ BOX } [data-tab-key="${ key }"]` )?.closest( `.${ BOX }` );
		if ( owner !== rootRef.current ) return;

		const inside = target && rootRef.current.contains( target ) && 'tabpanel' !== target.getAttribute( 'role' );
		( inside ? target : rootRef.current ).scrollIntoView( { behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' } );
	}, [ scrollTo, current ] );

	useEffect( () => {
		const $ = window.jQuery;
		const rating = rootRef.current?.querySelector( 'select#rating' );
		if ( isBackend || ! $ || ! rating || 'undefined' === typeof window.wc_single_product_params ) return;

		$( () => {
			if ( ! rating.previousElementSibling?.classList.contains( 'stars' ) ) {
				$( rating ).trigger( 'init' );
			}
		} );
	}, [ isBackend ] );

	if ( ! tabs.length ) return null;

	const onKeyDown = ( event, index ) => {
		const rtl = 'rtl' === window.getComputedStyle( tablistRef.current ).direction;
		const steps = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };

		let next;
		if ( event.key in steps ) {
			next = ( index + steps[ event.key ] + tabs.length ) % tabs.length;
		} else if ( 'Home' === event.key ) {
			next = 0;
		} else if ( 'End' === event.key ) {
			next = tabs.length - 1;
		} else {
			return;
		}

		event.preventDefault();
		tabRefs.current[ tabs[ next ].key ]?.focus();
	};

	return <div className={ BOX } ref={ rootRef }>
		<div className={ `${ BOX }-tablist` } role='tablist' aria-label={ i18n.tablist } ref={ tablistRef }>
			{ tabs.map( ( tab, index ) => {
				const selected = tab.key === current;

				return <button
					key={ tab.key }
					ref={ ( el ) => {
						tabRefs.current[ tab.key ] = el;
					} }
					type='button'
					role='tab'
					id={ tab.tabId }
					aria-selected={ selected }
					aria-controls={ tab.panelId }
					tabIndex={ selected ? 0 : -1 }
					data-tab-key={ tab.key }
					className={ `${ BOX }-tab ${ BOX }-tab--${ tab.key }${ selected ? ' is-active' : '' }` }
					onClick={ () => setActive( tab.key ) }
					onKeyDown={ ( event ) => onKeyDown( event, index ) }
				>
					{ tab.title }
				</button>;
			} ) }
		</div>

		<div className={ `${ BOX }-panels` }>
			{ tabs.map( ( tab ) => <div
				key={ tab.key }
				role='tabpanel'
				id={ tab.panelId }
				aria-labelledby={ tab.tabId }
				tabIndex={ 0 }
				hidden={ tab.key !== current }
				className={ `${ BOX }-panel ${ BOX }-panel--${ tab.key }` }
			>
				{ /* WooCommerce's own tab output (on the page) or the preview's, as HTML. */ }
				<div className={ `${ BOX }-panel-content` } dangerouslySetInnerHTML={ { __html: tab.html } } />
			</div> ) }
		</div>
	</div>;
};

export default Details;
