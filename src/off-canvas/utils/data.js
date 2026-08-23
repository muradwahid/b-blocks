import { __ } from '@wordpress/i18n';

export const prefix = 'b-blocks-off-canvas';

export const drawerSideOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const triggerAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const transitionTypeOptions = [
	{ label: __( 'Default', 'b-blocks' ), value: 'default' },
	{ label: __( 'Slide', 'b-blocks' ), value: 'slide' },
	{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
	{ label: __( 'Push', 'b-blocks' ), value: 'push' },
	{ label: __( 'Reveal', 'b-blocks' ), value: 'reveal' },
	{ label: __( 'Zoom', 'b-blocks' ), value: 'zoom' },
	{ label: __( 'Flip', 'b-blocks' ), value: 'flip' },
	{ label: __( 'Bounce', 'b-blocks' ), value: 'bounce' }
];

export const triggerEventOptions = [
	{ label: __( 'Click', 'b-blocks' ), value: 'click' },
	{ label: __( 'Hover', 'b-blocks' ), value: 'hover' },
	{ label: __( 'Page Load', 'b-blocks' ), value: 'load' }
];

export const easingOptions = [
	{ label: __( 'Ease', 'b-blocks' ), value: 'ease' },
	{ label: __( 'Ease In', 'b-blocks' ), value: 'ease-in' },
	{ label: __( 'Ease Out', 'b-blocks' ), value: 'ease-out' },
	{ label: __( 'Ease In Out', 'b-blocks' ), value: 'ease-in-out' },
	{ label: __( 'Linear', 'b-blocks' ), value: 'linear' }
];
