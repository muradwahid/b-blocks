import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksCookieConsentBar';

export const positionOptions = [
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' },
	{ label: __( 'Top', 'b-blocks' ), value: 'top' }
];

export const layoutOptions = [
	{ label: __( 'Inline (message + buttons in a row)', 'b-blocks' ), value: 'inline' },
	{ label: __( 'Stacked (message above buttons)', 'b-blocks' ), value: 'stacked' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' }
];
