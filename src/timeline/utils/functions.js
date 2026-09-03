/**
 * Class-list helpers shared by the editor and the server renderer.
 *
 * These classes drive the structural rules in style.scss — the direction, the
 * alternating sides per breakpoint, the connectors and whether the date
 * is shown — so they have to be correct in the server output before view.js
 * ever runs. The values they read are mirrored in render.php.
 */

import metadata from '../block.json';
import { arrowAlignValues, directionValues, lineExtentValues, lineStyleValues, sideValues } from './options';

/**
 * WordPress fills in a missing attribute from block.json, but it does not
 * merge *into* one that is present: if `connector` was saved before `arrow`
 * existed, the saved object is used whole and `arrow` is simply absent. Any
 * code that reaches into it then throws, taking the whole <style> with it and
 * leaving the block completely unstyled.
 *
 * Deep-merging the defaults underneath the saved values closes that off. Saved
 * values still win — this only fills gaps — so it is safe for old content and
 * removes the need to guard every nested read.
 */
const mergeDefaults = ( base, saved ) => {
	if ( undefined === saved || null === saved ) {
		return base;
	}

	// PHP encodes an empty object as [], so an empty array where the default
	// is an object means "nothing saved here", not "replace with empty".
	if ( Array.isArray( saved ) ) {
		const baseIsObject = base && 'object' === typeof base && ! Array.isArray( base );
		return ( 0 === saved.length && baseIsObject ) ? base : saved;
	}

	if ( 'object' !== typeof saved ) {
		return saved;
	}

	if ( ! base || 'object' !== typeof base || Array.isArray( base ) ) {
		return saved;
	}

	const merged = { ...base };
	Object.keys( saved ).forEach( ( key ) => {
		merged[ key ] = mergeDefaults( base[ key ], saved[ key ] );
	} );

	return merged;
};

const timelineDefaults = Object.fromEntries(
	Object.entries( metadata.attributes ).map( ( [ key, schema ] ) => [ key, schema.default ] )
);

export const withTimelineDefaults = ( attributes = {} ) => mergeDefaults( timelineDefaults, attributes );

export { mergeDefaults };

export const getTimelineClasses = ( attributes = {} ) => {
	const { layout = {}, connector = {}, date = {} } = attributes;
	const { line = {}, arrow = {} } = connector;

	// Direction and side are both per breakpoint, and an empty one inherits the
	// breakpoint above. Resolving that here rather than in CSS means each
	// breakpoint carries one plain class of each and the stylesheet needs no
	// inheritance rules of its own.
	const resolve = ( device, key, allowed, fallback ) => {
		const chain = 'desktop' === device
			? [ layout.desktop?.[ key ] ]
			: 'tablet' === device
				? [ layout.tablet?.[ key ], layout.desktop?.[ key ] ]
				: [ layout.mobile?.[ key ], layout.tablet?.[ key ], layout.desktop?.[ key ] ];

		return chain.find( ( value ) => allowed.includes( value ) ) || fallback;
	};

	const sideAt = ( device ) => resolve( device, 'side', sideValues, 'alternate' );
	const directionAt = ( device ) => resolve( device, 'direction', directionValues, 'vertical' );
	const extent = lineExtentValues.includes( line.extent ) ? line.extent : 'markers';
	const lineStyle = lineStyleValues.includes( line.style ) ? line.style : 'solid';
	const align = arrowAlignValues.includes( arrow.align ) ? arrow.align : 'center';

	return [
		'b-blocks-timeline',
		`b-blocks-timeline-desktop-${ directionAt( 'desktop' ) }`,
		`b-blocks-timeline-tablet-${ directionAt( 'tablet' ) }`,
		`b-blocks-timeline-mobile-${ directionAt( 'mobile' ) }`,
		`b-blocks-timeline-desktop-${ sideAt( 'desktop' ) }`,
		`b-blocks-timeline-tablet-${ sideAt( 'tablet' ) }`,
		`b-blocks-timeline-mobile-${ sideAt( 'mobile' ) }`,
		false === line.show ? 'b-blocks-timeline-no-line' : '',
		`b-blocks-timeline-line-${ lineStyle }`,
		line.progress ? 'b-blocks-timeline-progress' : '',
		line.progress && line.progressFade ? 'b-blocks-timeline-progress-fade' : '',
		'full' === extent ? 'b-blocks-timeline-line-full' : '',
		false === arrow.show ? 'b-blocks-timeline-no-arrow' : '',
		`b-blocks-timeline-arrow-${ align }`,
		false === date.show ? 'b-blocks-timeline-no-date' : ''
	].filter( Boolean ).join( ' ' );
};

/**
 * A Timeline Item may override the side it sits on and where its arrow sits
 * along the card edge. Both are empty by default, meaning "follow the parent
 * Timeline"; only an explicit choice emits a class, and those classes are
 * weighted in style.scss to outrank the parent's.
 *
 * @param {Object} item Timeline Item's `item` attribute.
 * @return {string} Class list.
 */
export const getTimelineItemClasses = ( item = {} ) => [
	'b-blocks-timeline-item',
	[ 'left', 'right' ].includes( item.side ) ? `b-blocks-timeline-side-${ item.side }` : '',
	arrowAlignValues.includes( item.arrowAlign ) ? `b-blocks-timeline-item-arrow-${ item.arrowAlign }` : ''
].filter( Boolean ).join( ' ' );
