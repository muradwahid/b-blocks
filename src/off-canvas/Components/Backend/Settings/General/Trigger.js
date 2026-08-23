import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label, IconLibrary } from '../../../../../../../bpl-tools/Components';
import { triggerAlignOptions } from '../../../../utils/data';
import { Flex } from '@wordpress/components';

const Trigger = ({ trigger = {}, updateObj }) => (
	<PanelBody className='bPlPanelBody' title={__('Trigger Button', 'b-blocks')} initialOpen={false}>
		<TextControl label={__('Trigger Label', 'b-blocks')} value={trigger.label || ''} onChange={(val) => updateObj('trigger', val, 'label')} placeholder={__('Open Menu', 'b-blocks')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Trigger Icon', 'b-blocks')} checked={trigger.showIcon} onChange={(val) => updateObj('trigger', val, 'showIcon')} />

		{trigger.showIcon !== false && (
			<>
				<IconLibrary label={__('Icon', 'b-blocks')} value={trigger.icon} onChange={(val) => updateObj('trigger', val, 'icon')} />
				<Flex className="mt10">
					<Label className='flex2'>{__('Icon Position', 'b-blocks')}</Label>
					<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={trigger.iconPosition} onChange={(val) => updateObj('trigger', val, 'iconPosition')}>
						<ToggleGroupControlOption label={__('Left', 'b-blocks')} value='left' />
						<ToggleGroupControlOption label={__('Right', 'b-blocks')} value='right' />
					</ToggleGroupControl>
				</Flex>
			</>
		)}

		<Label className='mt10'>{__('Trigger Alignment', 'b-blocks')}</Label>
		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={trigger.align} onChange={(val) => updateObj('trigger', val, 'align')}>
			{triggerAlignOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>
	</PanelBody>
);
export default Trigger;
