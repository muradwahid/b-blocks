import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksVideoPopup';

export const videoSourceOptions = [
	{ label: __( 'YouTube', 'b-blocks' ), value: 'youtube' },
	{ label: __( 'Vimeo', 'b-blocks' ), value: 'vimeo' },
	{ label: __( 'Self-hosted MP4', 'b-blocks' ), value: 'self' }
];

export const videoRatioOptions = [
	{ label: __( '16:9 (Widescreen)', 'b-blocks' ), value: '16/9' },
	{ label: __( '4:3 (Standard)', 'b-blocks' ), value: '4/3' },
	{ label: __( '1:1 (Square)', 'b-blocks' ), value: '1/1' },
	{ label: __( '21:9 (Cinematic)', 'b-blocks' ), value: '21/9' },
	{ label: __( '9:16 (Vertical)', 'b-blocks' ), value: '9/16' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const animationOptions = [
	{ label: __( 'Zoom', 'b-blocks' ), value: 'zoom' },
	{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

export const bgShapeOptions = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Rounded Square', 'b-blocks' ), value: 'rounded' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

export const URL_PLACEHOLDERS = {
	youtube: 'https://www.youtube.com/watch?v=…',
	vimeo: 'https://vimeo.com/…',
	self: 'https://example.com/video.mp4'
};
