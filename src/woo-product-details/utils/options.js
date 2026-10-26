import { __ } from '@wordpress/i18n';

import { emUnit, perUnit, pxUnit } from '../../../../bpl-tools/utils/options';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export const UNITS = [ pxUnit( 10 ), emUnit( 1 ), perUnit( 10 ) ];
