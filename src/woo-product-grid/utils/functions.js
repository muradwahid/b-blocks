export const mergeProducts = ( previous, next, append ) => {
	const incoming = Array.isArray( next ) ? next : [];

	if ( ! append ) return incoming;

	const existing = Array.isArray( previous ) ? previous : [];
	const seen = new Set( existing.map( ( item ) => item?.id ) );

	return [ ...existing, ...incoming.filter( ( item ) => ! seen.has( item?.id ) ) ];
};

export const asText = ( value ) => ( 'string' === typeof value || 'number' === typeof value ? String( value ) : '' );

export const formatLabel = ( template, value ) =>
	String( template || '' ).replace( /%[ds]/, value );

export const devices = ( value ) => (
	value && 'object' === typeof value && ! Array.isArray( value )
		&& ( 'desktop' in value || 'tablet' in value || 'mobile' in value )
		? value
		: { desktop: value ?? '', tablet: '', mobile: '' }
);

export const at = ( container, device, prop ) => {
	const node = container && 'object' === typeof container ? container : {};
	const slot = node[ device ];

	if ( slot && 'object' === typeof slot && ! Array.isArray( slot ) && prop in slot ) {
		return slot[ prop ];
	}

	return devices( node[ prop ] )[ device ];
};


export const perDevice = ( container, prop ) => ( {
	desktop: at( container, 'desktop', prop ),
	tablet: at( container, 'tablet', prop ),
	mobile: at( container, 'mobile', prop )
} );


const isPlain = ( value ) => !! value && 'object' === typeof value && ! Array.isArray( value );

const OPAQUE = [ 'typo', 'advanced' ];

const fit = ( raw, def ) => {
	if ( null === raw || undefined === raw ) return undefined;
	if ( Array.isArray( def ) ) return Array.isArray( raw ) ? raw : undefined;
	// eslint-disable-next-line no-use-before-define
	if ( isPlain( def ) ) return isPlain( raw ) ? conform( raw, def ) : undefined;

	switch ( typeof def ) {
		case 'string':
			return 'string' === typeof raw ? raw : ( 'number' === typeof raw ? String( raw ) : undefined );
		case 'number': {
			const num = 'number' === typeof raw ? raw : ( 'string' === typeof raw && '' !== raw.trim() ? Number( raw ) : NaN );
			return Number.isFinite( num ) ? num : undefined;
		}
		case 'boolean':
			if ( 'boolean' === typeof raw ) return raw;
			if ( 'true' === raw || 1 === raw ) return true;
			return ( 'false' === raw || 0 === raw || '' === raw ) ? false : undefined;
		default:
			return raw;
	}
};

export const conform = ( value, shape ) => {
	if ( ! isPlain( value ) || ! isPlain( shape ) ) return value;

	const out = {};

	for ( const [ key, raw ] of Object.entries( value ) ) {
		if ( ! ( key in shape ) || OPAQUE.includes( key ) ) {
			out[ key ] = raw;
			continue;
		}

		const fixed = fit( raw, shape[ key ] );
		if ( undefined !== fixed ) out[ key ] = fixed;
	}

	return out;
};
