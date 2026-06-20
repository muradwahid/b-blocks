import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPostCarousel';

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'Comment Count', 'b-blocks' ), value: 'comment_count' }
];

export const orderOptions = [
	{ label: __( 'Newest First', 'b-blocks' ), value: 'desc' },
	{ label: __( 'Oldest First', 'b-blocks' ), value: 'asc' }
];

export const aspectRatioOptions = [
	{ label: '16:9', value: '16/9' },
	{ label: '4:3', value: '4/3' },
	{ label: '1:1', value: '1/1' },
	{ label: '3:2', value: '3/2' }
];

export const titleTagOptions = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' }
];
