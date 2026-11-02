import { __ } from '@wordpress/i18n';

import { titleTags } from './data';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const stateOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: 'normal' },
	{ label: __( 'Hover', 'b-blocks' ), value: 'hover' }
];

export const presetOptions = [
	{ label: __( 'Preset 1 — Details on hover', 'b-blocks' ), value: 'preset-1' },
	{ label: __( 'Preset 2 — Centred, oval images', 'b-blocks' ), value: 'preset-2' },
	{ label: __( 'Preset 3 — Classic card', 'b-blocks' ), value: 'preset-3' },
	{ label: __( 'Preset 4 — Featured product + carousel', 'b-blocks' ), value: 'preset-4' }
];

export const dotPresetOptions = [
	{ label: __( 'Style 1 — Round dots', 'b-blocks' ), value: 'style-1' },
	{ label: __( 'Style 2 — Active dot stretches', 'b-blocks' ), value: 'style-2' },
	{ label: __( 'Style 3 — Lines', 'b-blocks' ), value: 'style-3' }
];

// The four WordPress always has; the editor adds any others the theme registers.
export const imageSizeOptions = [
	{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full Size', 'b-blocks' ), value: 'full' }
];

export const titleTagOptions = titleTags.map( ( tag ) => ( { label: tag.toUpperCase(), value: tag } ) );

export const queryTypeOptions = [
	{ label: __( 'Custom Query', 'b-blocks' ), value: 'custom' },
	{ label: __( 'Related Products', 'b-blocks' ), value: 'related' }
];

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Price', 'b-blocks' ), value: 'price' },
	{ label: __( 'Popularity (Sales)', 'b-blocks' ), value: 'popularity' },
	{ label: __( 'Rating', 'b-blocks' ), value: 'rating' },
	{ label: __( 'Menu Order', 'b-blocks' ), value: 'menu_order' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'ID', 'b-blocks' ), value: 'id' }
];

export const orderOptions = [
	{ label: __( 'Descending', 'b-blocks' ), value: 'desc' },
	{ label: __( 'Ascending', 'b-blocks' ), value: 'asc' }
];

export const taxModeOptions = [
	{ label: __( 'Include', 'b-blocks' ), value: 'include' },
	{ label: __( 'Exclude', 'b-blocks' ), value: 'exclude' }
];

export const sideOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const objectFitOptions = [
	{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
	{ label: __( 'Contain', 'b-blocks' ), value: 'contain' },
	{ label: __( 'Fill', 'b-blocks' ), value: 'fill' },
	{ label: __( 'Scale Down', 'b-blocks' ), value: 'scale-down' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

// Autoplay / Animation Speed, saved with the unit ('3000ms').
export const msUnits = [ { label: 'ms', value: 'ms' } ];

export const pctUnits = [ { label: '%', value: '%', default: 72 } ];
export const pxUnits = [ { label: 'px', value: 'px', default: 15 } ];
export const pxEmUnits = [
	{ label: 'px', value: 'px', default: 20 },
	{ label: 'em', value: 'em', default: 1 }
];
export const pxEmPctUnits = [
	{ label: 'px', value: 'px', default: 300 },
	{ label: 'em', value: 'em', default: 10 },
	{ label: '%', value: '%', default: 100 }
];