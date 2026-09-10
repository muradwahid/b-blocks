import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { captionStyles } from '../../../../utils/options';

const Caption = ({ attributes, updateObj }) => {
	const { elements = {}, caption = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Caption', 'b-blocks')} checked={elements.caption} onChange={(val) => updateObj('elements', val, 'caption')} />

		{elements.caption && <>
			<Label className='mb0 mt10'>{__('Placement', 'b-blocks')}</Label>

			<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={caption.style || 'overlay-center'} onChange={(val) => updateObj('caption', val, 'style')}>
				{captionStyles.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
			</ToggleGroupControl>

			<Label className='mt20'>{__('Caption Length', 'b-blocks')}</Label>

			<NumberControl value={elements.captionLength} onChange={(val) => updateObj('elements', parseInt(val, 10) || 0, 'captionLength')} min={0} />

			<small>{__('Zero shows the whole caption.', 'b-blocks')}</small>

			<ToggleControl className='mt20' label={__('Remove Hashtags', 'b-blocks')} checked={elements.stripHashtags} onChange={(val) => updateObj('elements', val, 'stripHashtags')} />

			{!elements.stripHashtags && <ToggleControl label={__('Link Hashtags', 'b-blocks')} checked={elements.linkHashtags} onChange={(val) => updateObj('elements', val, 'linkHashtags')} help={__('Each hashtag opens its Instagram tag page.', 'b-blocks')} />}
		</>}
	</PanelBody>;
};

export default Caption;
