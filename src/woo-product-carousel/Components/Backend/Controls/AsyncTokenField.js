import { useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

import useWooSearch from '../hooks/useWooSearch';

const tokenFor = ( item, seen ) => ( seen[ item.label ] && seen[ item.label ] !== item.id
	? `${ item.label } (#${ item.id })`
	: item.label );

const AsyncTokenField = ( { label, value = [], onChange, type, taxonomy = '', placeholder = '' } ) => {
	const { request, debouncedRequest, isReady } = useWooSearch();

	const [ known, setKnown ] = useState( {} );
	const [ suggestionIds, setSuggestionIds ] = useState( [] );
	const hydrated = useRef( false );

	const ids = useMemo(
		() => ( Array.isArray( value ) ? value.map( ( id ) => parseInt( id, 10 ) ).filter( Boolean ) : [] ),
		[ value ]
	);

	const merge = ( items ) => {
		if ( ! items.length ) return;
		setKnown( ( prev ) => {
			const next = { ...prev };
			items.forEach( ( item ) => {
				next[ item.id ] = item.label;
			} );
			return next;
		} );
	};

	useEffect( () => {
		if ( ! isReady || hydrated.current || ! ids.length ) return;
		hydrated.current = true;

		request( { type, taxonomy, include: ids } ).then( merge );
	}, [ isReady, ids, request, type, taxonomy ] );

	const seen = useMemo( () => {
		const byLabel = {};
		Object.entries( known ).forEach( ( [ id, name ] ) => {
			byLabel[ name ] = byLabel[ name ] ?? parseInt( id, 10 );
		} );
		return byLabel;
	}, [ known ] );

	const tokenToId = useMemo( () => {
		const map = {};
		Object.entries( known ).forEach( ( [ id, name ] ) => {
			map[ tokenFor( { id: parseInt( id, 10 ), label: name }, seen ) ] = parseInt( id, 10 );
		} );
		return map;
	}, [ known, seen ] );

	const selectedTokens = ids
		.filter( ( id ) => known[ id ] )
		.map((id) => tokenFor({ id, label: known[id] }, seen));

	const suggestions = suggestionIds
		.filter( ( id ) => known[ id ] && ! ids.includes( id ) )
		.map( ( id ) => tokenFor( { id, label: known[ id ] }, seen ) );

	const onInputChange = ( search ) => {
		if ( ! search || search.length < 2 ) {
			setSuggestionIds( [] );
			return;
		}

		debouncedRequest( { type, taxonomy, search } ).then( ( items ) => {
			merge( items );
			setSuggestionIds( items.map( ( item ) => item.id ) );
		} );
	};

	return <FormTokenField
		__next40pxDefaultSize
		__nextHasNoMarginBottom
		label={ label }
		value={ selectedTokens }
		suggestions={ suggestions }
		placeholder={ placeholder || __( 'Type to search…', 'b-blocks' ) }
		onInputChange={ onInputChange }
		onChange={ ( tokens ) => {
			const next = tokens
				.map( ( token ) => ( typeof token === 'string' ? tokenToId[ token ] : token?.value ) )
				.filter( ( id ) => Number.isInteger( id ) );

			onChange( [ ...new Set( next ) ] );
		} }
	/>;
};

export default AsyncTokenField;
