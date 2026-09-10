import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Label, Typography } from '../../../../../../../bpl-tools/Components';

import { alignments } from '../../../../utils/options';

const Caption = ({ attributes, updateObj }) => {
	const { elements = {}, caption = {} } = attributes;

	if (!elements.caption) return null;

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color', 'b-blocks')} value={caption.color} onChange={(val) => updateObj('caption', val, 'color')} />

		<ColorControl label={__('Hashtag Color', 'b-blocks')} value={caption.linkColor} onChange={(val) => updateObj('caption', val, 'linkColor')} />

		<Background className='mt10' label={__('Background', 'b-blocks')} value={caption.background} onChange={(val) => updateObj('caption', val, 'background')} />

		<Label className='mb0 mt20'>{__('Alignment', 'b-blocks')}</Label>

		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={caption.align || ''} onChange={(val) => updateObj('caption', val, 'align')}>
			{alignments.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<BoxControl label={__('Padding', 'b-blocks')} values={caption.padding || {}} onChange={(val) => updateObj('caption', val, 'padding')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={caption.typo} onChange={(val) => updateObj('caption', val, 'typo')} defaults={{ fontSize: { desktop: 15 } }} />
	</PanelBody>;
};

export default Caption;
