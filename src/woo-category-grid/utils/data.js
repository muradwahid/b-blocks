import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooCategoryGrid';

export const orderByOptions = [
	{ label: __( 'Name', 'b-blocks' ), value: 'name' },
	{ label: __( 'Product Count', 'b-blocks' ), value: 'count' },
	{ label: __( 'Term ID', 'b-blocks' ), value: 'term_id' },
	{ label: __( 'Slug', 'b-blocks' ), value: 'slug' }
];

export const orderOptions = [
	{ label: __( 'Ascending', 'b-blocks' ), value: 'ASC' },
	{ label: __( 'Descending', 'b-blocks' ), value: 'DESC' }
];

export const cardStyleOptions = [
	{ label: __( 'Overlay', 'b-blocks' ), value: 'overlay' },
	{ label: __( 'Image + Text Below', 'b-blocks' ), value: 'below' },
	{ label: __( 'Plain (no image)', 'b-blocks' ), value: 'plain' }
];

export const imageRatioOptions = [
	{ label: '1:1', value: '1/1' },
	{ label: '4:3', value: '4/3' },
	{ label: '3:2', value: '3/2' },
	{ label: '16:9', value: '16/9' },
	{ label: '3:4', value: '3/4' }
];

export const imageSizeOptions = [
	{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full', 'b-blocks' ), value: 'full' }
];

export const hoverEffectOptions = [
	{ label: __( 'Zoom', 'b-blocks' ), value: 'zoom' },
	{ label: __( 'Lift', 'b-blocks' ), value: 'lift' },
	{ label: __( 'Darken', 'b-blocks' ), value: 'darken' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

export const shadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const nameWeightOptions = [
	{ label: __( 'Regular (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi Bold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra Bold (800)', 'b-blocks' ), value: '800' }
];
