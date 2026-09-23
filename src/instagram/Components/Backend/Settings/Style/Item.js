import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, ColorControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

import { hoverEffects } from '../../../../utils/options';
import { Flex } from '@wordpress/components';

// One tile: its shape, what happens on hover, and the marker on video posts.
const Item = ({ attributes, updateObj, device = 'desktop' }) => {
	const { item = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Item', 'b-blocks')} initialOpen={true}>

		<SelectControl label={__('Hover Effect', 'b-blocks')} labelPosition='edge' value={item.hoverEffect || 'none'} options={hoverEffects} onChange={(val) => updateObj('item', val, 'hoverEffect')} />

		<BoxControl label={<>{__('Border Radius', 'b-blocks')} <Device /></>} values={item?.[device]?.radius || {}} onChange={(val) => updateObj('item', val, device, 'radius')} />

		<ColorControl label={__('Hover Overlay', 'b-blocks')} value={item.overlayColor} onChange={(val) => updateObj('item', val, 'overlayColor')} />

		<small>{__('A tint drawn over the photo while the pointer is on it.', 'b-blocks')}</small>

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={item.border} onChange={(val) => updateObj('item', val, 'border')} />

		<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={item.shadow} onChange={(val) => updateObj('item', val, 'shadow')} />

		<ColorControl className='mt10' label={__('Media Icon Color', 'b-blocks')} value={item.iconColor} onChange={(val) => updateObj('item', val, 'iconColor')} />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Media Icon Size', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				labelPosition='edge'
				isUnitSelectTabbable
				value={item?.[device]?.iconSize ?? ('desktop' === device ? (item.iconSize || '') : '')}
				onChange={(val) => updateObj('item', val, device, 'iconSize')}
				units={[pxUnit(), emUnit(), remUnit()]}
			/>
		</Flex>

	</PanelBody>;
};

export default Item;
