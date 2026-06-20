/**
 * Shared helpers used by both the Edit and FrontEnd components of the
 * Timeline block.
 *
 * Keeping these pure and tiny avoids drift between the editor preview
 * and the rendered front-end.
 */

import { LAYOUT_VALUES, VARIANT_VALUES } from '../../utils/options';

/**
 * Build a single CSS class string for the chosen variant.
 *
 * @param {string} variant
 * @return {string}
 */
export const getVariantClass = ( variant ) => {
	const safe = VARIANT_VALUES.includes( variant ) ? variant : 'modern';
	return `timeline-variant-${ safe }`;
};

/**
 * Build a single CSS class string for the chosen layout.
 *
 * @param {string} layout
 * @return {string}
 */
export const getLayoutClass = ( layout ) => {
	const safe = LAYOUT_VALUES.includes( layout ) ? layout : 'alternating';
	return `timeline-layout-${ safe }`;
};

/**
 * Build the inline style object for a single timeline item.
 *
 * The accent color is applied via a CSS custom property so SCSS rules
 * can pick it up consistently. Falls back to the default brand blue.
 *
 * @param {{accentColor?: string}} item
 * @return {Object} Inline style object.
 */
export const buildItemStyle = ( item ) => {
	if ( ! item ) {
		return {};
	}
	return {
		'--bBlocks-timeline-accent': item.accentColor || '#0d6efd',
	};
};

/**
 * Immutably move an item in an array by `direction` (-1 up, +1 down).
 * Returns the original array if the move would be out of bounds.
 *
 * @param {Array}  items
 * @param {number} index
 * @param {number} direction
 * @return {Array}
 */
export const moveItem = ( items, index, direction ) => {
	if ( ! Array.isArray( items ) ) {
		return items;
	}
	const target = index + direction;
	if ( target < 0 || target >= items.length ) {
		return items;
	}
	const next = items.slice();
	const [ removed ] = next.splice( index, 1 );
	next.splice( target, 0, removed );
	return next;
};
