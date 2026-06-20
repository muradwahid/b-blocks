import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPricingToggle';

export const defaultPeriodOptions = [
	{ label: __( 'Monthly', 'b-blocks' ), value: 'monthly' },
	{ label: __( 'Annually', 'b-blocks' ), value: 'annual' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];
