import { __ } from '@wordpress/i18n';

export { MAX_QUANTITY, prefix } from './functions';

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];


export const previewTypeOptions = [
	{ label: __( 'Simple Product', 'b-blocks' ), value: 'simple' },
	{ label: __( 'Grouped Product', 'b-blocks' ), value: 'grouped' },
	{ label: __( 'External/Affiliate Product', 'b-blocks' ), value: 'external' },
	{ label: __( 'Variable Product', 'b-blocks' ), value: 'variable' }
];

export const iconPositionOptions = [
	{ label: __( 'Before Text', 'b-blocks' ), value: 'before' },
	{ label: __( 'After Text', 'b-blocks' ), value: 'after' }
];


export const quantityPositionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'inline' },
	{ label: __( 'Right', 'b-blocks' ), value: 'inline-reverse' },
	{ label: __( 'Top', 'b-blocks' ), value: 'stacked' },
	{ label: __( 'Bottom', 'b-blocks' ), value: 'stacked-reverse' }
];

export const quantityStyleOptions = [
	{ label: __( 'Stepper', 'b-blocks' ), value: 'stepper' },
	{ label: __( 'Input', 'b-blocks' ), value: 'input' }
];

export const UNITS = [
	{ value: 'px', label: 'px', default: 12 },
	{ value: 'em', label: 'em', default: 1 },
	{ value: 'rem', label: 'rem', default: 1 },
	{ value: '%', label: '%', default: 100 }
];
