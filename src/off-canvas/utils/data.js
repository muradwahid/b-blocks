import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksOffCanvas';

export const drawerSideOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const triggerIconOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Hamburger', 'b-blocks' ), value: 'menu' },
	{ label: __( 'Arrow Right', 'b-blocks' ), value: 'arrow-right' },
	{ label: __( 'Arrow Left', 'b-blocks' ), value: 'arrow-left' }
];

export const triggerAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
