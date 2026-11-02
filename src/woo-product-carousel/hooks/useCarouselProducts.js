import { useEffect, useRef, useState } from 'react';

import { queryAction } from '../utils/data';

const DEBOUNCE_MS = 300;

/**
 * The editor's products, from the same query the page runs (WooProductCarousel::getProducts).
 * Settings changes are debounced; a request overtaken by a newer one is aborted, and the
 * previous products stay on screen (dimmed) until the new ones arrive.
 */
const useCarouselProducts = ( { nonce, query, imageSize, currentProductId = 0 } ) => {
	const [ state, setState ] = useState( { data: null, isLoading: true, hasError: false } );
	const loaded = useRef( false );

	const signature = JSON.stringify( [ query, imageSize, currentProductId ] );

	useEffect( () => {
		if ( ! nonce || ! window.ajaxurl ) return undefined;

		const controller = new AbortController();
		setState( ( prev ) => ( { ...prev, isLoading: true, hasError: false } ) );

		const timer = setTimeout( () => {
			const body = new URLSearchParams( {
				action: queryAction,
				_wpnonce: nonce,
				// A JSON string, not nested fields: those would turn false into the (truthy) string "false".
				query: JSON.stringify( query || {} ),
				imageSize: imageSize || 'full',
				currentProductId: String( currentProductId || 0 )
			} );

			fetch( window.ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString(),
				signal: controller.signal
			} )
				.then( ( res ) => res.json() )
				.then( ( json ) => {
					loaded.current = true;
					setState( json?.success
						? { data: json.data, isLoading: false, hasError: false }
						: ( prev ) => ( { ...prev, isLoading: false, hasError: true } ) );
				} )
				.catch( ( error ) => {
					if ( 'AbortError' === error?.name ) return;
					setState( ( prev ) => ( { ...prev, isLoading: false, hasError: true } ) );
				} );
		}, loaded.current ? DEBOUNCE_MS : 0 );

		return () => {
			clearTimeout( timer );
			controller.abort();
		};
	}, [ nonce, signature ] );

	const { data } = state;

	return {
		products: Array.isArray( data?.products ) ? data.products : [],
		labels: data?.labels || {},
		hasWoo: false !== data?.woo,
		hasBrands: !! data?.hasBrands,
		installUrl: data?.installUrl || '',
		isReady: !! data,
		isLoading: state.isLoading,
		hasError: state.hasError
	};
};

export default useCarouselProducts;