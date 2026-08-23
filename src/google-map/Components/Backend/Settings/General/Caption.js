import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { alignmentOptions } from '../../../../utils/data';

const Caption = ({ caption = {}, updateObj }) => <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
	<TextControl label={__('Caption Text', 'b-blocks')} value={caption.text || ''} onChange={(val) => updateObj('caption', val, 'text')} placeholder={__('e.g. 123 Main St, Anytown', 'b-blocks')} help={__('Optional. Shown below the map and used as the map’s accessible name.', 'b-blocks')} __nextHasNoMarginBottom />

	<Label className='mt10'>{__('Caption Alignment', 'b-blocks')}</Label>
	<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={caption.align || 'center'} onChange={(val) => updateObj('caption', val || 'center', 'align')}>
		{alignmentOptions.map((option) => <ToggleGroupControlOption key={option.value} label={option.label} value={option.value} />)}
	</ToggleGroupControl>
</PanelBody>;
export default Caption;
