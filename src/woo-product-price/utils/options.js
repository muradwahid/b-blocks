import { __ } from '@wordpress/i18n';

import { pxUnit, emUnit, remUnit } from '../../../../bpl-tools/utils/options';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const salePositionOptions = [
	{ label: __( 'After Regular Price', 'b-blocks' ), value: 'after' },
	{ label: __( 'Before Regular Price', 'b-blocks' ), value: 'before' }
];

export const affixTypeOptions = [
	{ label: __( 'Icon', 'b-blocks' ), value: 'icon' },
	{ label: __( 'Text', 'b-blocks' ), value: 'text' }
];

export const verticalAlignOptions = [
	{ label: __( 'Baseline', 'b-blocks' ), value: 'baseline' },
	{ label: __( 'Top', 'b-blocks' ), value: 'top' },
	{ label: __( 'Middle', 'b-blocks' ), value: 'middle' },
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' },
	{ label: __( 'Super', 'b-blocks' ), value: 'super' },
	{ label: __( 'Sub', 'b-blocks' ), value: 'sub' }
];

export const priceTabs = [
	{ name: 'regular', title: __( 'Regular', 'b-blocks' ) },
	{ name: 'sale', title: __( 'Sale', 'b-blocks' ) }
];

export const UNITS = [ pxUnit( 10 ), emUnit( 1 ) ];

export const SIZE_UNITS = [ pxUnit( 25 ), emUnit( 1.5 ), remUnit( 1.5 ) ];
