import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const products = new Map();

// The Store API gives the same numbers the page uses: get_average_rating() and get_review_count().
const loadRating = ( id ) => {
	if ( ! products.has( id ) ) {
		products.set( id, apiFetch( { path: `/wc/store/v1/products/${ id }` } ).then( ( data ) => ( {
			rating: Math.round( ( parseFloat( data?.average_rating ) || 0 ) * 100 ) / 100,
			reviewCount: parseInt( data?.review_count, 10 ) || 0
		} ) ).catch( ( error ) => {
			products.delete( id );
			throw error;
		} ) );
	}
	return products.get( id );
};

export const useRating = ( productId ) => {
	const [ real, setReal ] = useState( null );
	const [ failed, setFailed ] = useState( false );

	useEffect( () => {
		setReal( null );
		setFailed( false );
		if ( ! productId ) return undefined;

		let cancelled = false;
		loadRating( productId )
			.then( ( data ) => ! cancelled && setReal( data ) )
			.catch( () => ! cancelled && setFailed( true ) );

		return () => {
			cancelled = true;
		};
	}, [ productId ] );

	return { real, failed, loading: !! productId && ! real && ! failed };
};
