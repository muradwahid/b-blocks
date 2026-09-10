import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, TabPanel, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { normalHoverTabs } from '../../../../../utils/options';
import { alignOptions, msUnit, ringStyles, sUnit, stateLabel } from '../../../../utils/options';

// The centre panel showing the active item. Its border is the inner ring.
const InnerDisc = ({ attributes, updateObj, device = 'desktop' }) => {
	const { innerDisc = {}, outerDisc = {} } = attributes;

	const outerSize = parseFloat(outerDisc?.[device]?.size) || 560;

	return <PanelBody className='bPlPanelBody' title={__('Inner Disc', 'b-blocks')} initialOpen={false}>
		<Flex>
			<Label className='mb0 flex2'>{__('Size', 'b-blocks')} <Device /></Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={innerDisc?.[device]?.size || ''} onChange={(val) => updateObj('innerDisc', val, device, 'size')} units={[pxUnit()]} max={outerSize} />
		</Flex>

		<Background className='mt10' label={__('Background', 'b-blocks')} value={innerDisc.background} onChange={(val) => updateObj('innerDisc', val, 'background')} defaults={{ color: '#F2F0E4' }} />

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={innerDisc?.[device]?.padding || {}} onChange={(val) => updateObj('innerDisc', val, device, 'padding')} />

		<ColorControl className='mt10' label={__('Border Color', 'b-blocks')} value={innerDisc.borderColor} onChange={(val) => updateObj('innerDisc', val, 'borderColor')} defaultColor='#3F8F4B' />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Border Width', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={innerDisc.borderWidth || ''} onChange={(val) => updateObj('innerDisc', val, 'borderWidth')} units={[pxUnit()]} max={20} />
		</Flex>

		<SelectControl className='mt10' label={__('Border Style', 'b-blocks')} labelPosition='edge' value={innerDisc.borderStyle || 'solid'} options={ringStyles} onChange={(val) => updateObj('innerDisc', val, 'borderStyle')} __nextHasNoMarginBottom />

		<small>{__('This border is the inner ring.', 'b-blocks')}</small>

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Content Width', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={innerDisc.contentWidth || ''} onChange={(val) => updateObj('innerDisc', val, 'contentWidth')} />
		</Flex>

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Content Gap', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={innerDisc.contentGap || ''} onChange={(val) => updateObj('innerDisc', val, 'contentGap')} />
		</Flex>

		<Flex className='mt10'>
			<Label className='mb0 flex1'>{__('Content Alignment', 'b-blocks')}</Label>

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={innerDisc.contentAlign || 'center'} onChange={(val) => updateObj('innerDisc', val, 'contentAlign')}>
				{alignOptions.map(({ label, value, icon }) => <ToggleGroupControlOptionIcon key={value} label={label} value={value} icon={icon} />)}
			</ToggleGroupControl>
		</Flex>

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Transition', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={innerDisc.transition || ''} onChange={(val) => updateObj('innerDisc', val, 'transition')} units={[msUnit(), sUnit()]} />
		</Flex>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <ShadowControl label={stateLabel(tab.name, __('Box Shadow', 'b-blocks'))} value={innerDisc.shadow?.[tab.name]} onChange={(val) => updateObj('innerDisc', val, 'shadow', tab.name)} />}
		</TabPanel>
	</PanelBody>;
};

export default InnerDisc;
