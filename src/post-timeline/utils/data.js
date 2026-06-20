import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPostTimeline';

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Modified Date', 'b-blocks' ), value: 'modified' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' }
];

export const orderOptions = [
	{ label: __( 'Newest First (DESC)', 'b-blocks' ), value: 'DESC' },
	{ label: __( 'Oldest First (ASC)', 'b-blocks' ), value: 'ASC' }
];

export const imageSizeOptions = [
	{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full', 'b-blocks' ), value: 'full' }
];

export const aspectRatioOptions = [
	{ label: '16:9', value: '16/9' },
	{ label: '4:3', value: '4/3' },
	{ label: '1:1', value: '1/1' },
	{ label: '3:4', value: '3/4' }
];

export const layoutOptions = [
	{ label: __( 'Alternating (left/right)', 'b-blocks' ), value: 'alternating' },
	{ label: __( 'Left-aligned (cards on right)', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right-aligned (cards on left)', 'b-blocks' ), value: 'right' }
];

export const dateFormatOptions = [
	{ label: __( 'Jan 1, 2024', 'b-blocks' ), value: 'M j, Y' },
	{ label: __( 'January 1, 2024', 'b-blocks' ), value: 'F j, Y' },
	{ label: __( '01/01/2024', 'b-blocks' ), value: 'm/d/Y' },
	{ label: __( '2024-01-01', 'b-blocks' ), value: 'Y-m-d' }
];

export const titleWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];
