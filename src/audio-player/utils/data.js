import { __ } from '@wordpress/i18n';

export const prefix = 'b-blocks-audio-player';

export const playerStyleOptions = [
	{ label: __( 'Bar (compact)', 'b-blocks' ), value: 'bar' },
	{ label: __( 'Card (album art top)', 'b-blocks' ), value: 'card' },
	{ label: __( 'Sound Bars', 'b-blocks' ), value: 'bars' },
	{ label: __( 'Vinyl (spinning record)', 'b-blocks' ), value: 'vinyl' },
	{ label: __( 'Coverflow (multi-track)', 'b-blocks' ), value: 'coverflow' },
	{ label: __( 'Playlist (multi-track)', 'b-blocks' ), value: 'playlist' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
