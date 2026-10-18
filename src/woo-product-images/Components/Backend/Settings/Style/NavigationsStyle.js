import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Background, ColorControl, Device } from '../../../../../../../bpl-tools/Components';

import { UNITS } from '../../../../utils/options';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.nav.default;

const NavigationsStyle = ({ attributes, updateObj, device }) => {
	const { nav = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Navigations', 'b-blocks')} initialOpen={false}>

		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex>{__('Icon Size', 'b-blocks')}<Device /></Flex>} labelPosition='edge' units={UNITS} value={nav[device]?.iconSize || ''} onChange={(val) => updateObj('nav', val || '', device, 'iconSize')} />
		{ /* ColorControl resets only to a non-empty default: '__clear__' stands for empty. */}
		<ColorControl className='mt20' label={__('Arrow Color:', 'b-blocks')} value={nav.color} defaultColor={nav.color ? '__clear__' : undefined} onChange={(val) => updateObj('nav', '__clear__' === val ? '' : val, 'color')} />

		<ColorControl className='mt20' label={__('Arrow Hover Color:', 'b-blocks')} value={nav.hoverColor} defaultColor={nav.hoverColor ? '__clear__' : undefined} onChange={(val) => updateObj('nav', '__clear__' === val ? '' : val, 'hoverColor')} />

		<Background className='mt20' label={__('Arrow Background', 'b-blocks')} value={nav.bg} defaults={defaults.bg} isImage={false} onChange={(val) => updateObj('nav', val, 'bg')} />
		<p className='components-base-control__help'>{__('A colour fades toward the thumbnails; a gradient is used as it is.', 'b-blocks')}</p>

		<Background className='mt20' label={__('Arrow Hover Background', 'b-blocks')} value={nav.hoverBg} isImage={false} onChange={(val) => updateObj('nav', val, 'hoverBg')} />
	</PanelBody>;
};

export default NavigationsStyle;
