import { useEffect, useRef, useState } from 'react';

import { queryAction, queryAttributes } from '../utils/data';

const useAjaxProducts = ( ajaxUrl, nonce, attributes, pageNumber = 1, termId = 0, skip = false, attempt = 0 ) => {
	const queryAttr = queryAttributes( attributes );

	const signature = JSON.stringify( queryAttr );
	const signatureRef = useRef( signature );
	signatureRef.current = signature;

	const latest = useRef( 0 );

	const [ data, setData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( false );

	const [ hasError, setHasError ] = useState( false );

	const mounted = useRef( true );
	useEffect( () => () => {
		mounted.current = false;
	}, [] );

	useEffect( () => {

		if ( ! ajaxUrl || ! nonce || skip ) return;

		const ticket = ++latest.current;
		const isLatest = () => mounted.current && ticket === latest.current;

		setIsLoading( true );
		setHasError( false );

		const body = new URLSearchParams( {
			action: queryAction,
			_wpnonce: nonce,
			queryAttr: signatureRef.current,
			pageNumber: String( pageNumber ),
			termId: String( termId )
		} );

		fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString()
		} )
			.then( ( res ) => res.json() )
			.then( ( json ) => {
				if ( ! isLatest() ) return;

				if ( json?.success ) {
					setData( json.data );
					return;
				}

				setHasError( true );
			} )
			.catch( () => {
				if ( isLatest() ) setHasError( true );
			} )
			.finally( () => {
				if ( isLatest() ) setIsLoading( false );
			} );
	}, [ ajaxUrl, nonce, pageNumber, termId, skip, attempt ] );

	return {
		respPage: data?.page ?? 0,
		respTerm: data?.termId ?? 0,
		labels: data?.labels || {},
		products: data?.products || [],
		terms: data?.terms || [],
		maxPages: data?.maxPages || 0,
		total: data?.total || 0,
		hasWoo: false !== data?.woo,
		installUrl: data?.installUrl || '',
		hasError,
		isLoading: isLoading || ( ! data && !! nonce && ! skip && ! hasError ),
		isReady: !! data
	};
};

export default useAjaxProducts;
