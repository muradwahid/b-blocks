import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const products = new Map();

const loadProduct = ( id ) => {
	if ( ! products.has( id ) ) {
		products.set( id, Promise.all( [
			apiFetch( { path: `/wc/store/v1/products/${ id }` } ),
			apiFetch( { path: `/wc/store/v1/products/reviews?product_id=${ id }&per_page=5` } ).catch( () => [] ),
			window.wcSettings?.currentUserIsAdmin ? apiFetch( { path: `/wc/v3/products/${ id }?_fields=reviews_allowed,attributes` } ).catch( () => null ) : null
		] ).then( ( [ product, reviews, admin ] ) => ( {
			product,
			reviews: Array.isArray( reviews ) ? reviews : [],
			admin
		} ) ).catch( ( error ) => {
			products.delete( id );
			throw error;
		} ) );
	}
	return products.get( id );
};

export const useProduct = ( productId ) => {
	const [ real, setReal ] = useState( null );
	const [ failed, setFailed ] = useState( false );

	useEffect( () => {
		setReal( null );
		setFailed( false );
		if ( ! productId ) return undefined;

		let cancelled = false;
		loadProduct( productId )
			.then( ( data ) => ! cancelled && setReal( data ) )
			.catch( () => ! cancelled && setFailed( true ) );

		return () => {
			cancelled = true;
		};
	}, [ productId ] );

	return { real, failed, loading: !! productId && ! real && ! failed };
};
