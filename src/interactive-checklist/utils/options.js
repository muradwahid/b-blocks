import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksInteractiveChecklist';
export const MAX_ITEMS = 30;

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
];

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) },
];

export const HEADING_TAG_OPTIONS = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' },
];

export const CHECKBOX_STYLE_OPTIONS = [
	{ label: __( 'Square', 'b-blocks' ), value: 'square' },
	{ label: __( 'Round', 'b-blocks' ), value: 'round' },
];

export const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' },
];

export const newId = () => `item-${ Date.now().toString( 36 ) }-${ Math.random().toString( 36 ).slice( 2, 6 ) }`;

export const newItem = () => ( { id: newId(), label: __( 'New item', 'b-blocks' ), checked: false } );
