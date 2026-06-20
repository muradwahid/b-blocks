import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksAudioPlayer';

export const playerStyleOptions = [
	{ label: __( 'Bar (compact)', 'b-blocks' ), value: 'bar' },
	{ label: __( 'Card (with album art)', 'b-blocks' ), value: 'card' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
