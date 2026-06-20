import { __ } from '@wordpress/i18n';

export const pluginSlug = 'b-blocks';

export const MAX_PANELS = 8;

export const triggerOptions = [
	{ label: __( 'Hover / Focus', 'b-blocks' ), value: 'hover' },
	{ label: __( 'Click / Tap', 'b-blocks' ), value: 'click' }
];

export const orientationOptions = [
	{ label: __( 'Horizontal', 'b-blocks' ), value: 'horizontal' },
	{ label: __( 'Vertical', 'b-blocks' ), value: 'vertical' }
];

export const overlayPositionOptions = [
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Top', 'b-blocks' ), value: 'top' }
];

export const titleTagOptions = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' }
];

export const titleWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Semi-bold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra-bold (800)', 'b-blocks' ), value: '800' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const objectPositionOptions = [
	{ label: __( 'Center', 'b-blocks' ), value: '50% 50%' },
	{ label: __( 'Top', 'b-blocks' ), value: '50% 0%' },
	{ label: __( 'Bottom', 'b-blocks' ), value: '50% 100%' },
	{ label: __( 'Left', 'b-blocks' ), value: '0% 50%' },
	{ label: __( 'Right', 'b-blocks' ), value: '100% 50%' },
	{ label: __( 'Custom…', 'b-blocks' ), value: 'custom' }
];

export const newPanel = () => ( {
	id: `ia-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
	title: '',
	description: '',
	btnLabel: '',
	btnUrl: '',
	btnNewTab: false,
	overlayColor: '',
	objectPosition: '50% 50%'
} );
