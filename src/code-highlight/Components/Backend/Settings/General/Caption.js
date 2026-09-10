import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { captionPositions } from '../../../../utils/options';

const Caption = ({ attributes, updateObj }) => {
	const { content = {}, options = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<TextControl label={__('Caption', 'b-blocks')} value={content.caption || ''} onChange={(val) => updateObj('content', val, 'caption')} help={__('A short line describing the snippet. Left empty, nothing is rendered.', 'b-blocks')} __nextHasNoMarginBottom />

		{content.caption && <Flex className='mt10'>
			<Label className='mb0 flex1'>{__('Position', 'b-blocks')}</Label>

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={options.captionPosition || 'bottom'} onChange={(val) => updateObj('options', val, 'captionPosition')}>
				{captionPositions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
			</ToggleGroupControl>
		</Flex>}
	</PanelBody>;
};

export default Caption;
