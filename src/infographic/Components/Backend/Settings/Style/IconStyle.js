import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { normalHoverTabs } from '../../../../../utils/options';
import { msUnit, sUnit, stateLabel } from '../../../../utils/options';

const IconStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { icon = {} } = attributes;
	const { color, background = {}, border = {} } = icon;

	return <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color', 'b-blocks')} value={color} onChange={(val) => updateObj('icon', val, 'color')} />

		<Background className='mt10' label={__('Background Color', 'b-blocks')} value={background} onChange={(val) => updateObj('icon', val, 'background')} />

		<ColorControl className='mt10' label={__('Stacked Plate Color', 'b-blocks')} value={icon.plateColor} onChange={(val) => updateObj('icon', val, 'plateColor')} help={__('Backdrop behind the icon when View is set to Stacked.', 'b-blocks')} />

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={icon?.[device]?.padding || {}} onChange={(val) => updateObj('icon', val, device, 'padding')} />

		<BoxControl label={<>{__('Border Radius', 'b-blocks')} <Device /></>} values={icon?.[device]?.radius || {}} onChange={(val) => updateObj('icon', val, device, 'radius')} />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Transition', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={icon.transition || ''} onChange={(val) => updateObj('icon', val, 'transition')} units={[msUnit(), sUnit()]} />
		</Flex>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <BorderBoxControl className='mt10' label={stateLabel(tab.name, __('Border', 'b-blocks'))} value={border?.[tab.name]} onChange={(val) => updateObj('icon', val, 'border', tab.name)} />}
		</TabPanel>
	</PanelBody>;
};

export default IconStyle;
