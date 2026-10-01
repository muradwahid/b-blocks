import { __ } from '@wordpress/i18n';

import { titleTags } from './data';
import { alignCenterIcon, alignLeftIcon, alignRightIcon } from './icons';

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' }
];

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const layoutOptions = [
	{ label: __( 'Grid', 'b-blocks' ), value: 'grid' },
	{ label: __( 'List', 'b-blocks' ), value: 'list' }
];

export const ratingStyleOptions = [
	{ label: __( 'Star', 'b-blocks' ), value: 'star' },
	{ label: __( 'Star with Count', 'b-blocks' ), value: 'star-count' },
	{ label: __( 'Number', 'b-blocks' ), value: 'number' }
];

export const titleTagOptions = titleTags.map( ( tag ) => ( {
	label: tag.toUpperCase(),
	value: tag
} ) );

export const imageSizeOptions = [
	{ label: __( 'Default', 'b-blocks' ), value: 'default' },
	{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'b-blocks' ), value: 'large' },
	{ label: __( 'Full Size', 'b-blocks' ), value: 'full' }
];

export const queryTypeOptions = [
	{ label: __( 'Custom Query', 'b-blocks' ), value: 'custom' },
	{ label: __( 'Related Products', 'b-blocks' ), value: 'related' }
];

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Price', 'b-blocks' ), value: 'price' },
	{ label: __( 'Popularity', 'b-blocks' ), value: 'popularity' },
	{ label: __( 'Rating', 'b-blocks' ), value: 'rating' },
	{ label: __( 'Menu Order', 'b-blocks' ), value: 'menu_order' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'ID', 'b-blocks' ), value: 'id' }
];

export const orderOptions = [
	{ label: __( 'Descending', 'b-blocks' ), value: 'desc' },
	{ label: __( 'Ascending', 'b-blocks' ), value: 'asc' }
];

export const taxModeOptions = [
	{ label: __( 'Include', 'b-blocks' ), value: 'include' },
	{ label: __( 'Exclude', 'b-blocks' ), value: 'exclude' }
];

export const badgeAlignOptions = [
	{ label: __( 'Top', 'b-blocks' ), value: 'top' },
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const badgeContentOptions = [
	{ label: __( 'Sale Text', 'b-blocks' ), value: 'text' },
	{ label: __( 'Amount Saved', 'b-blocks' ), value: 'amount' },
	{ label: __( 'Percent Off', 'b-blocks' ), value: 'percent' }
];

export const morePostsTypeOptions = [
	{ label: __( 'Button', 'b-blocks' ), value: 'button' },
	{ label: __( 'Pagination', 'b-blocks' ), value: 'pagination' },
	{ label: __( 'Prev-Next', 'b-blocks' ), value: 'prev-next' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left', icon: alignLeftIcon },
	{ label: __( 'Center', 'b-blocks' ), value: 'center', icon: alignCenterIcon },
	{ label: __( 'Right', 'b-blocks' ), value: 'right', icon: alignRightIcon }
];

export const contentAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const aspectRatioOptions = [
	{ label: '3:4', value: '3/4' },
	{ label: '1:1', value: '1/1' },
	{ label: '4:3', value: '4/3' },
	{ label: '16:9', value: '16/9' }
];

export const imageFitOptions = [
	{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
	{ label: __( 'Contain', 'b-blocks' ), value: 'contain' }
];

export const columnFallback = { desktop: 4, tablet: 2, mobile: 1 };

export const actionPositionOptions = [
	{ label: __( 'On Image', 'b-blocks' ), value: 'overlay' },
	{ label: __( 'Below', 'b-blocks' ), value: 'below' },
	{ label: __( 'Split', 'b-blocks' ), value: 'split' }
];

export const actionAlignOptions = [
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' },
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' }
];

export const actionOrderOptions = [
	{ label: __( 'Cart', 'b-blocks' ), value: 'cart' },
	{ label: __( 'View', 'b-blocks' ), value: 'view' }
];

export const iconPositionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
