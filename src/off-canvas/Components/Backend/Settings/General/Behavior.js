import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { triggerEventOptions } from '../../../../utils/data';

const Behavior = ({ options = {}, updateObj }) => (
	<PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>
		<Label>{__('Trigger Event', 'b-blocks')}</Label>
		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={options.triggerEvent || 'click'} onChange={(val) => updateObj('options', val || 'click', 'triggerEvent')}>
			{triggerEventOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>

		<TextControl className='mt10' label={__('Close Button Label', 'b-blocks')} help={__('Used as the close button’s screen-reader label.', 'b-blocks')} value={options.closeLabel || ''} onChange={(val) => updateObj('options', val, 'closeLabel')} placeholder={__('Close', 'b-blocks')} __nextHasNoMarginBottom />
	</PanelBody>
);
export default Behavior;
