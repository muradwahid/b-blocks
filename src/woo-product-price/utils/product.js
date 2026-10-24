import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import { savingsOf, withBdi } from './data';


const products = new Map();

const loadProduct = ( id ) => {
	if ( ! products.has( id ) ) {
		products.set( id, apiFetch( { path: `/wc/store/v1/products/${ id }` } ).then( ( data ) => ( {
			priceHtml: withBdi( data?.price_html || '' ),
			onSale: !! data?.on_sale,
			savings: savingsOf( data?.prices || {} )
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
