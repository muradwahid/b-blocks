import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooMiniCart';

export const triggerModeOptions = [
	{ label: __( 'Dropdown Flyout', 'b-blocks' ), value: 'dropdown' },
	{ label: __( 'Link to Cart Page', 'b-blocks' ), value: 'link' }
];

export const dropdownPositionOptions = [
	{ label: __( 'Align Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Align Right', 'b-blocks' ), value: 'right' }
];

export const shadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: 400 },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: 500 },
	{ label: __( 'Semi Bold (600)', 'b-blocks' ), value: 600 },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: 700 }
];
