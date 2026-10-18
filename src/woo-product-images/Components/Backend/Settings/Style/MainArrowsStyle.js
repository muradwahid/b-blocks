import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device } from '../../../../../../../bpl-tools/Components';

import { UNITS } from '../../../../utils/options';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.mainNav.default;

const MainArrowsStyle = ({ attributes, updateObj, device }) => {
	const { mainNav = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Main Image Arrows', 'b-blocks')} initialOpen={false}>

		<UnitControl __next40pxDefaultSize label={<Flex className='mb5'>{__('Button Size', 'b-blocks')}<Device /></Flex>} labelPosition='edge' units={UNITS} value={mainNav[device]?.size || ''} onChange={(val) => updateObj('mainNav', val || '', device, 'size')} />

		<UnitControl className='mt20' __next40pxDefaultSize label={<Flex className='mb5'>{__('Icon Size', 'b-blocks')}<Device /></Flex>} labelPosition='edge' units={UNITS} value={mainNav[device]?.iconSize || ''} onChange={(val) => updateObj('mainNav', val || '', device, 'iconSize')} />

		<BoxControl className='mt20' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')}<Device /></Flex>} values={mainNav[device]?.radius} onChange={(val) => updateObj('mainNav', val, device, 'radius')} />

		<ColorControl className='mt20' label={__('Icon Color:', 'b-blocks')} value={mainNav.color} defaultColor={mainNav.color ? '__clear__' : undefined} onChange={(val) => updateObj('mainNav', '__clear__' === val ? '' : val, 'color')} />
		<ColorControl className='mt20' label={__('Icon Hover Color:', 'b-blocks')} value={mainNav.hoverColor} defaultColor={mainNav.hoverColor ? '__clear__' : undefined} onChange={(val) => updateObj('mainNav', '__clear__' === val ? '' : val, 'hoverColor')} />
		<Background className='mt20' label={__('Background', 'b-blocks')} value={mainNav.bg} defaults={defaults.bg} isImage={false} onChange={(val) => updateObj('mainNav', val, 'bg')} />
		<Background className='mt20' label={__('Hover Background', 'b-blocks')} value={mainNav.hoverBg} isImage={false} onChange={(val) => updateObj('mainNav', val, 'hoverBg')} />
	</PanelBody>;
};

export default MainArrowsStyle;
