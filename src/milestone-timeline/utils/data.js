import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksMilestoneTimeline';

export const MAX_ITEMS = 20;

export const nodeShapeOptions = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' }
];

export const labelPositionOptions = [
	{ label: __( 'Above the line', 'b-blocks' ), value: 'above' },
	{ label: __( 'Below the line', 'b-blocks' ), value: 'below' },
	{ label: __( 'Alternating', 'b-blocks' ), value: 'alternating' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const shadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' }
];

export const dateTagOptions = [
	{ label: __( 'Span', 'b-blocks' ), value: 'span' },
	{ label: __( 'Time', 'b-blocks' ), value: 'time' }
];

export const titleTagOptions = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' },
	{ label: __( 'Paragraph', 'b-blocks' ), value: 'p' }
];

export const titleWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];

export const mobileStackOrderOptions = [
	{ label: __( 'Ascending', 'b-blocks' ), value: 'asc' },
	{ label: __( 'Descending', 'b-blocks' ), value: 'desc' }
];

export const newItem = () => ( {
	_key: `mt-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	date: '',
	title: '',
	description: '',
	icon: 'fa-solid fa-circle-check',
	accentColor: ''
} );
