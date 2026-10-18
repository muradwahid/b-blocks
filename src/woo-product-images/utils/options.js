import { __ } from '@wordpress/i18n';

import { emUnit, perUnit, pxUnit } from '../../../../bpl-tools/utils/options';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const positionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Top', 'b-blocks' ), value: 'top' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' },
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' }
];

export const fitOptions = [
	{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
	{ label: __( 'Contain', 'b-blocks' ), value: 'contain' },
	{ label: __( 'Fill', 'b-blocks' ), value: 'fill' },
	{ label: __( 'Scale Down', 'b-blocks' ), value: 'scale-down' },
	{ label: __( 'None', 'b-blocks' ), value: 'none' }
];

export const UNITS = [ pxUnit( 10 ), emUnit( 1 ), perUnit( 10 ) ];

export const thumbViewOptions = [
	{ label: __( 'Slider', 'b-blocks' ), value: 'slider' },
	{ label: __( 'Grid', 'b-blocks' ), value: 'grid' }
];

export const ratioOptions = [
	{ label: __( 'Square (1:1)', 'b-blocks' ), value: '1/1' },
	{ label: __( 'Landscape (4:3)', 'b-blocks' ), value: '4/3' },
	{ label: __( 'Landscape (3:2)', 'b-blocks' ), value: '3/2' },
	{ label: __( 'Wide (16:9)', 'b-blocks' ), value: '16/9' },
	{ label: __( 'Portrait (3:4)', 'b-blocks' ), value: '3/4' },
	{ label: __( 'Portrait (2:3)', 'b-blocks' ), value: '2/3' }
];

export const thumbFitOptions = [
	{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
	{ label: __( 'Contain', 'b-blocks' ), value: 'contain' }
];

export const changeOnOptions = [
	{ label: __( 'Click', 'b-blocks' ), value: 'click' },
	{ label: __( 'Hover', 'b-blocks' ), value: 'hover' }
];

export const SIZE_UNITS = [ pxUnit( 90 ), emUnit( 5 ) ];

export const effectOptions = [
	{ label: __( 'Slide', 'b-blocks' ), value: 'slide' },
	{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
	{ label: __( 'Flip', 'b-blocks' ), value: 'flip' },
	{ label: __( 'Cube', 'b-blocks' ), value: 'cube' },
	{ label: __( 'Cards', 'b-blocks' ), value: 'cards' },
	{ label: __( 'Zoom', 'b-blocks' ), value: 'zoom' },
	{ label: __( 'Parallax', 'b-blocks' ), value: 'parallax' }
];

export const paginationOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Dots', 'b-blocks' ), value: 'dots' },
	{ label: __( 'Fraction', 'b-blocks' ), value: 'fraction' }
];

export const badgePositionOptions = [
	{ label: __( 'Top Start', 'b-blocks' ), value: 'top-left' },
	{ label: __( 'Top End', 'b-blocks' ), value: 'top-right' }
];

export const deviceOptions = [
	{ label: __( 'Desktop', 'b-blocks' ), value: 'desktop' },
	{ label: __( 'Tablet', 'b-blocks' ), value: 'tablet' },
	{ label: __( 'Mobile', 'b-blocks' ), value: 'mobile' }
];
export const easingOptions = [
	{ label: __( 'Ease', 'b-blocks' ), value: 'ease' },
	{ label: __( 'Linear', 'b-blocks' ), value: 'linear' },
	{ label: __( 'Ease In', 'b-blocks' ), value: 'ease-in' },
	{ label: __( 'Ease Out', 'b-blocks' ), value: 'ease-out' },
	{ label: __( 'Ease In Out', 'b-blocks' ), value: 'ease-in-out' }
];
