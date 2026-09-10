import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

import { degUnit, normalHoverTabs, stateLabel } from '../../../../utils/options';

const ButtonIcon = ({ attributes, updateObj, device = 'desktop' }) => {
	const { buttonIcon = {}, options = {} } = attributes;

	if (!options.copyButton || !buttonIcon.enable) return null;

	const size = (label, key, units) => <Flex className='mt10'>
		<Label className='mb0 flex2'>{label}</Label>

		<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={buttonIcon[key] || ''} onChange={(val) => updateObj('buttonIcon', val, key)} units={units} />
	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Button Icon', 'b-blocks')} initialOpen={false}>
		{size(__('Size', 'b-blocks'), 'size', [pxUnit(), emUnit(), remUnit()])}

		{size(__('Spacing', 'b-blocks'), 'spacing', [pxUnit(), emUnit()])}

		<small>{__('The gap between the icon and the label.', 'b-blocks')}</small>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <>
				<ColorControl label={stateLabel(tab.name, __('Color', 'b-blocks'))} value={buttonIcon?.[tab.name]?.color} onChange={(val) => updateObj('buttonIcon', val, tab.name, 'color')} />

				<Background className='mt10' label={stateLabel(tab.name, __('Background', 'b-blocks'))} value={buttonIcon?.[tab.name]?.background} onChange={(val) => updateObj('buttonIcon', val, tab.name, 'background')} />

				<BorderBoxControl className='mt10' label={stateLabel(tab.name, __('Border', 'b-blocks'))} value={buttonIcon?.[tab.name]?.border} onChange={(val) => updateObj('buttonIcon', val, tab.name, 'border')} />

				<Flex className='mt10'>
					<Label className='mb0 flex2'>{stateLabel(tab.name, __('Rotate', 'b-blocks'))}</Label>

					<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={buttonIcon?.[tab.name]?.rotate || ''} onChange={(val) => updateObj('buttonIcon', val, tab.name, 'rotate')} units={[degUnit()]} />
				</Flex>

				{'hover' === tab.name && <small>{__('A different angle here turns the icon when the pointer is over the button.', 'b-blocks')}</small>}
			</>}
		</TabPanel>

		<BoxControl label={<>{__('Border Radius', 'b-blocks')} <Device /></>} values={buttonIcon?.[device]?.radius || {}} onChange={(val) => updateObj('buttonIcon', val, device, 'radius')} />

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={buttonIcon?.[device]?.padding || {}} onChange={(val) => updateObj('buttonIcon', val, device, 'padding')} />

		<BoxControl label={<>{__('Margin', 'b-blocks')} <Device /></>} values={buttonIcon?.[device]?.margin || {}} onChange={(val) => updateObj('buttonIcon', val, device, 'margin')} />
	</PanelBody>;
};

export default ButtonIcon;
