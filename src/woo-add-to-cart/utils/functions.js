export const BOX = 'b-blocks-woo-add-to-cart';

export const prefix = 'bBlocksWooAddToCart';

export const MAX_QUANTITY = 1000;

export const boxClasses = ( attributes, type, plan = '' ) => {
	const { alignment, fullWidth } = attributes?.layout || {};
	const { showQuantity } = attributes?.options || {};
	const align = [ 'left', 'center', 'right' ].includes( alignment ) ? alignment : 'left';

	const classes = [ BOX, `${ BOX }--align-${ align }` ];
	if ( [ 'pro', 'free' ].includes( plan ) ) classes.unshift( plan );
	if ( fullWidth ) classes.push( `${ BOX }--full` );

	if ( 'simple' === type ) {
		if ( showQuantity ) classes.push( `${ BOX }--has-qty` );
	} else if ( 'unavailable' === type ) {
		classes.push( `${ BOX }--unavailable` );
	} else {
		classes.push( `${ BOX }--native`, `${ BOX }--type-${ type }` );
		if ( ! showQuantity ) classes.push( `${ BOX }--no-qty` );
	}

	return classes.join( ' ' );
};

export const btnState = ( state ) => `${ BOX }-btn--${ state }`;

export const isSvg = ( markup ) => 'string' === typeof markup && /^\s*<svg[\s>]/i.test( markup );

const SVG_ELEMENTS = [ 'svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'rect', 'defs', 'symbol', 'use', 'title', 'desc', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern', 'text', 'tspan' ];
const cleaned = new Map();

export const cleanSvg = ( markup ) => {
	if ( ! isSvg( markup ) || 'undefined' === typeof window.DOMParser ) return '';
	if ( cleaned.has( markup ) ) return cleaned.get( markup );

	const doc = new window.DOMParser().parseFromString( markup, 'image/svg+xml' );
	const svg = doc.documentElement;
	let out = '';

	if ( svg && 'svg' === svg.localName && ! doc.getElementsByTagName( 'parsererror' ).length ) {
		[ ...svg.querySelectorAll( '*' ) ].forEach( ( el ) => {
			if ( el.isConnected && ! SVG_ELEMENTS.includes( el.localName.toLowerCase() ) ) el.remove();
		} );

		[ svg, ...svg.querySelectorAll( '*' ) ].forEach( ( el ) => [ ...el.attributes ].forEach( ( { name, value } ) => {
			const key = name.toLowerCase();
			const val = value.replace( /[\s\u0000-\u001f]+/g, '' ).toLowerCase(); // eslint-disable-line no-control-regex
			const isLink = 'href' === key || key.endsWith( ':href' );

			if ( key.startsWith( 'on' ) || ( isLink && ! val.startsWith( '#' ) ) || /javascript:|vbscript:|data:|expression\(|@import|url\((?!['"]?#)/.test( val ) ) {
				el.removeAttribute( name );
			}
		} ) );

		out = new window.XMLSerializer().serializeToString( svg );
	}

	cleaned.set( markup, out );
	return out;
};
