import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { ColorControl, Device } from '../../../../../../../bpl-tools/Components';

import { UNITS } from '../../../../utils/options';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.pagination.default;

const PaginationStyle = ( { attributes, updateObj, device } ) => {
	const { options = {}, pagination = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Pagination', 'b-blocks' ) } initialOpen={ false }>
		{ 'dots' === options.pagination ? <>
			<Flex className='mb5'><span className='bPlLabel'>{ __( 'Dot Size', 'b-blocks' ) }</span><Device /></Flex>
			<UnitControl __next40pxDefaultSize label={ __( 'Dot Size', 'b-blocks' ) } hideLabelFromVision units={ UNITS } value={ pagination[ device ]?.size || '' } onChange={ ( val ) => updateObj( 'pagination', val || '', device, 'size' ) } />
			<ColorControl className='mt20' label={ __( 'Dot Color:', 'b-blocks' ) } value={ pagination.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( 'pagination', val, 'color' ) } />
			<ColorControl className='mt20' label={ __( 'Active Dot Color:', 'b-blocks' ) } value={ pagination.activeColor } defaultColor={ defaults.activeColor } onChange={ ( val ) => updateObj( 'pagination', val, 'activeColor' ) } />
		</> : <>
			<ColorControl label={ __( 'Text Color:', 'b-blocks' ) } value={ pagination.textColor } defaultColor={ pagination.textColor ? '__clear__' : undefined } onChange={ ( val ) => updateObj( 'pagination', '__clear__' === val ? '' : val, 'textColor' ) } />
			<ColorControl className='mt20' label={ __( 'Background Color:', 'b-blocks' ) } value={ pagination.textBg } defaultColor={ pagination.textBg ? '__clear__' : undefined } onChange={ ( val ) => updateObj( 'pagination', '__clear__' === val ? '' : val, 'textBg' ) } />
		</> }
	</PanelBody>;
};

export default PaginationStyle;
