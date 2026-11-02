import { __ } from '@wordpress/i18n';

import { emUnit, pxUnit, remUnit } from '../../../../bpl-tools/utils/options';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const starsTypeOptions = [
	{ label: __( 'Style 1 (Outline)', 'b-blocks' ), value: 'style-1' },
	{ label: __( 'Style 2 (Half)', 'b-blocks' ), value: 'style-2' },
	{ label: __( 'Style 3 (Half Stroke)', 'b-blocks' ), value: 'style-3' },
	{ label: __( 'Style 4 (Classic)', 'b-blocks' ), value: 'style-4' },
	{ label: __( 'Style 5 (Half Solid)', 'b-blocks' ), value: 'style-5' }
];

export const displayOptions = [
	{ label: __( 'Inline', 'b-blocks' ), value: 'inline' },
	{ label: __( 'Block', 'b-blocks' ), value: 'block' },
	{ label: __( 'Block Reverse', 'b-blocks' ), value: 'block-reverse' },
	{ label: __( 'Inline Reverse', 'b-blocks' ), value: 'inline-reverse' }
];

export const starsTabs = [
	{ name: 'all', title: __( 'All', 'b-blocks' ) },
	{ name: 'rated', title: __( 'Rated', 'b-blocks' ) }
];

export const UNITS = [ pxUnit( 18 ), emUnit( 1 ), remUnit( 1 ) ];
