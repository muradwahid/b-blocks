import { useCallback, useEffect, useRef, useState } from 'react';

import { useWPOptionQuery } from '../../../../../../bpl-tools/hooks';
import { searchAction } from '../../../utils/data';

const DEBOUNCE_MS = 300;

const useWooSearch = () => {
	const { data: bBlocksUtils } = useWPOptionQuery( 'bBlocksUtils' );
	const nonce = bBlocksUtils?.nonce;

	const timerRef = useRef( null );

	useEffect( () => () => clearTimeout( timerRef.current ), [] );

	const request = useCallback( ( payload ) => {
		if ( ! nonce || ! window.wp?.ajax ) return Promise.resolve( [] );

		return window.wp.ajax
			.post( searchAction, { _wpnonce: nonce, ...payload } )
			.then( ( res ) => ( Array.isArray( res?.items ) ? res.items : [] ) )
			.catch( () => [] );
	}, [ nonce ] );

	const debouncedRequest = useCallback( ( payload ) => new Promise( ( resolve ) => {
		clearTimeout( timerRef.current );
		timerRef.current = setTimeout( () => request( payload ).then( resolve ), DEBOUNCE_MS );
	} ), [ request ] );

	return { request, debouncedRequest, isReady: !! nonce };
};

export default useWooSearch;

export const useProductTaxonomies = () => {
	const { request, isReady } = useWooSearch();
	const [ taxonomies, setTaxonomies ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		if ( ! isReady ) return;

		let cancelled = false;

		request( { type: 'taxonomies' } ).then( ( items ) => {
			if ( cancelled ) return;
			setTaxonomies( items.map( ( item ) => ( { label: item.label, value: String( item.id ) } ) ) );
			setIsLoading( false );
		} );

		return () => {
			cancelled = true;
		};
	}, [ isReady, request ] );

	return { taxonomies, isLoading };
};
