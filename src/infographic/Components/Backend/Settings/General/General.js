import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { alignOptions, triggerOptions } from '../../../../utils/options';

const General = ({ attributes, updateObj, device = 'desktop' }) => {
	const { general = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('General', 'b-blocks')} initialOpen={true}>

		<Label className='mb0 flex1'>{__('Alignment', 'b-blocks')} <Device /></Label>

		<ToggleGroupControl className='flex1 small mt5' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={general?.[device]?.alignment || ''} size='small' onChange={(val) => updateObj('general', val, device, 'alignment')} isDeselectable style={{ padding: '2px' }}>
			{alignOptions.map(({ label, value, icon }) => <ToggleGroupControlOptionIcon key={value} label={label} value={value} icon={icon} />)}
		</ToggleGroupControl>


		<Flex className='mt10'>
			<Label className='mb0 flex1'>{__('Item Trigger Type', 'b-blocks')}</Label>

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={general.itemTriggerType} onChange={(val) => updateObj('general', val, 'itemTriggerType')}>
				{triggerOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
			</ToggleGroupControl>
		</Flex>

	</PanelBody>;
};

export default General;
