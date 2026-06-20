import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksModalPopup';

export const triggerTypeOptions = [
	{ label: __( 'Button', 'b-blocks' ), value: 'button' },
	{ label: __( 'Image', 'b-blocks' ), value: 'image' },
	{ label: __( 'Text', 'b-blocks' ), value: 'text' },
	{ label: __( 'Icon', 'b-blocks' ), value: 'icon' }
];

export const triggerAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const modalSizeOptions = [
	{ label: __( 'Small (400px)', 'b-blocks' ), value: 'small' },
	{ label: __( 'Medium (600px)', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large (800px)', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full (100vw)', 'b-blocks' ), value: 'full' }
];

export const animationOptions = [
	{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
	{ label: __( 'Slide Down', 'b-blocks' ), value: 'slide-down' },
	{ label: __( 'Zoom', 'b-blocks' ), value: 'zoom' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

export const modalSizeMap = {
	small: '400px',
	medium: '600px',
	large: '800px',
	full: '100vw'
};
