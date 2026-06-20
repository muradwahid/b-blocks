import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPostMasonryGrid';

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Modified', 'b-blocks' ), value: 'modified' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'Comment Count', 'b-blocks' ), value: 'comment_count' }
];

export const orderOptions = [
	{ label: __( 'Newest first', 'b-blocks' ), value: 'DESC' },
	{ label: __( 'Oldest first', 'b-blocks' ), value: 'ASC' }
];

export const cardStyleOptions = [
	{ label: __( 'Image Top', 'b-blocks' ), value: 'image-top' },
	{ label: __( 'Image Overlay', 'b-blocks' ), value: 'image-overlay' },
	{ label: __( 'Text Only', 'b-blocks' ), value: 'text-only' }
];

export const imageRatioOptions = [
	{ label: __( 'Auto', 'b-blocks' ), value: 'auto' },
	{ label: '1:1', value: '1-1' },
	{ label: '4:3', value: '4-3' },
	{ label: '16:9', value: '16-9' },
	{ label: '3:2', value: '3-2' }
];

export const imageSizeOptions = [
	{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full', 'b-blocks' ), value: 'full' }
];

export const cardShadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' }
];

export const fontWeightOptions = [
	{ label: '400', value: '400' },
	{ label: '500', value: '500' },
	{ label: '600', value: '600' },
	{ label: '700', value: '700' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
