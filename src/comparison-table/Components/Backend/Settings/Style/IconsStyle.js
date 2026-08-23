import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';


/** Yes/No mark colours and size. Which icon shape is chosen lives in General. */
const IconsStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { icons = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Icons', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('“Yes” Color:', 'b-blocks')} value={icons.checkColor} onChange={(val) => updateObj('icons', val, 'checkColor')} />

		<ColorControl className='mt10' label={__('“No” Color:', 'b-blocks')} value={icons.crossColor} onChange={(val) => updateObj('icons', val, 'crossColor')} />

		{/* Desktop falls back to the flat legacy value so an existing table
		    shows its real size here rather than an empty field. */}
		<Flex className='mt10'>
			<Label className='flex2 mb0'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl
				className='flex1'
				value={icons?.[device]?.size}
				onChange={(val) => updateObj('icons', val, device, 'size')}
				__next40pxDefaultSize
			/>
		</Flex>

		<Flex className='mt10'>
			<Label className='flex2 mb0'><Flex justify='flex-start' gap={0}>{__('Header Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl
				className='flex1'
				value={icons?.[device]?.headerSize}
				onChange={(val) => updateObj('icons', val, device, 'headerSize')}
				__next40pxDefaultSize
			/>
		</Flex>
	</PanelBody>;
};
export default IconsStyle;
