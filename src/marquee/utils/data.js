import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksMarquee';

export const MAX_ITEMS = 30;

export const directionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const weightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];

export const itemTypeOptions = [
	{ label: __( 'Logo', 'b-blocks' ), value: 'logo' },
	{ label: __( 'Text', 'b-blocks' ), value: 'text' }
];

export const newItem = ( type = 'logo' ) => ( {
	_key: `mq-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	type,
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
	text: __( 'Item', 'b-blocks' ),
	linkUrl: '',
	linkNewTab: false
} );
