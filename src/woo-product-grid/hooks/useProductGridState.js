import { useEffect, useRef, useState } from 'react';

import useAjaxProducts from './useAjaxProducts';
import { queryAttributes } from '../utils/data';
import { formatLabel, mergeProducts } from '../utils/functions';

const useProductGridState = ( { ajaxUrl, nonce, attributes, seed = null } ) => {
	const [ items, setItems ] = useState( seed?.products || [] );
	const [ maxPages, setMaxPages ] = useState( seed?.maxPages || 0 );
	const [ status, setStatus ] = useState( '' );

	const [ request, setRequest ] = useState( { page: 1, term: 0, attempt: 0 } );
	const [ view, setView ] = useState( { page: 1, term: 0 } );

	const appendRef = useRef( false );

	const [ isDirty, setIsDirty ] = useState( ! seed );

	const signature = JSON.stringify( queryAttributes( attributes ) );
	const firstRun = useRef( true );

	useEffect( () => {
		if ( firstRun.current ) {
			firstRun.current = false;
			return;
		}

		appendRef.current = false;
		setRequest( ( prev ) => ( { page: 1, term: 0, attempt: prev.attempt + 1 } ) );
		setView( { page: 1, term: 0 } );
		setIsDirty( true );
	}, [ signature ] );

	const {
		products, terms, labels: ajaxLabels, maxPages: ajaxMaxPages, respPage, respTerm,
		hasWoo, installUrl, isLoading, isReady, hasError
	} = useAjaxProducts( ajaxUrl, nonce, attributes, request.page, request.term, ! isDirty, request.attempt );

	const labels = seed?.labels || ajaxLabels || {};

	const isCurrent = respPage === request.page && respTerm === request.term;

	useEffect( () => {
		if ( ! isDirty || ! isReady || isLoading || ! isCurrent ) return;

		const append = appendRef.current;

		setItems( ( prev ) => mergeProducts( prev, products, append ) );

		setMaxPages( ajaxMaxPages );

		setView({ page: request.page, term: request.term });

		if ( ! append ) {
			setStatus( products.length
				? formatLabel( labels.showing, products.length )
				: attributes.query?.noProductsMessage );
		}
	}, [ products, isReady, isLoading, isCurrent ] );

	useEffect( () => {
		if ( ! appendRef.current ) return;

		setStatus( formatLabel( labels.showing, items.length ) );
	}, [ items ] );

	useEffect( () => {
		if ( hasError && labels.error ) setStatus( labels.error );
	}, [ hasError ] );

	const busy = isDirty && isLoading;

	const onTerm = ( nextTerm ) => {
		if ( busy ) return;

		appendRef.current = false;
		setIsDirty( true );
		setRequest( ( prev ) => ( { page: 1, term: nextTerm, attempt: prev.attempt + 1 } ) );
	};

	const onPage = ( nextPage, { append = false } = {} ) => {
		if ( busy ) return;

		appendRef.current = append;
		setIsDirty( true );
		setRequest( ( prev ) => ( { ...prev, page: nextPage, attempt: prev.attempt + 1 } ) );
	};

	return {
		products: items,
		terms: seed?.terms?.length ? seed.terms : terms,
		maxPages,

		page: view.page,
		activeTerm: view.term,
		status,
		labels,
		isLoading: busy,
		isReady: isReady || !! seed,
		hasError,
		hasWoo,
		installUrl,
		onTerm,
		onPage
	};
};

export default useProductGridState;
