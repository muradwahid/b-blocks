import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPopupOptin';

export const triggerTypeOptions = [
	{ label: __( 'Time Delay', 'b-blocks' ), value: 'time' },
	{ label: __( 'Scroll Depth', 'b-blocks' ), value: 'scroll' },
	{ label: __( 'Exit Intent', 'b-blocks' ), value: 'exit' }
];

export const headlineTagOptions = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' }
];

export const headlineWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra-bold (800)', 'b-blocks' ), value: '800' }
];

export const animationOptions = [
	{ label: __( 'Fade + Scale', 'b-blocks' ), value: 'fade-scale' },
	{ label: __( 'Slide Up', 'b-blocks' ), value: 'slide-up' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];
