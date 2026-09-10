import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { ColorControl, Label, Typography } from '../../../../../../../bpl-tools/Components';

import { alignments } from '../../../../utils/options';

const Caption = ({ attributes, updateObj }) => {
	const { caption = {}, content = {} } = attributes;

	if (!content.caption) return null;

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color', 'b-blocks')} value={caption.color} onChange={(val) => updateObj('caption', val, 'color')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={caption.typo} onChange={(val) => updateObj('caption', val, 'typo')} defaults={{ fontSize: { desktop: 13 } }} />

		<Flex className='mt10' gap={10}>
			<Label className='mb0 flex1'>{__('Alignment', 'b-blocks')}</Label>

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={caption.align || 'center'} onChange={(val) => updateObj('caption', val, 'align')}>
				{alignments.map(({ label, value }) => <ToggleGroupControlOption style={{ padding: '0px 10px' }} key={value} label={label} value={value} />)}
			</ToggleGroupControl>
		</Flex>
	</PanelBody>;
};

export default Caption;