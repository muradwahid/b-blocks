import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';

import { alignments } from '../../../../utils/options';

const Caption = ({ attributes, updateObj, device = 'desktop' }) => {
	const { elements = {}, caption = {} } = attributes;

	if (!elements.caption) return null;

	const getPadding = () => {
		const pad = caption?.padding;
		if (pad?.[device] !== undefined) {
			return pad[device];
		}
		if ('desktop' === device && pad && (pad.top !== undefined || pad.right !== undefined)) {
			return pad;
		}
		return {};
	};

	const handlePaddingChange = (val) => {
		const cur = caption?.padding;
		if (cur && cur.desktop === undefined && (cur.top !== undefined || cur.right !== undefined)) {
			updateObj('caption', {
				desktop: 'desktop' === device ? val : cur,
				tablet: 'tablet' === device ? val : { top: '', right: '', bottom: '', left: '' },
				mobile: 'mobile' === device ? val : { top: '', right: '', bottom: '', left: '' }
			}, 'padding');
		} else {
			updateObj('caption', val, 'padding', device);
		}
	};

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color', 'b-blocks')} value={caption.color} onChange={(val) => updateObj('caption', val, 'color')} />

		<ColorControl label={__('Hashtag Color', 'b-blocks')} value={caption.linkColor} onChange={(val) => updateObj('caption', val, 'linkColor')} />

		<Background className='mt10' label={__('Background', 'b-blocks')} value={caption.background} onChange={(val) => updateObj('caption', val, 'background')} />

		<Label className='mb0 mt20'>{__('Alignment', 'b-blocks')}</Label>

		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={caption.align || ''} onChange={(val) => updateObj('caption', val, 'align')}>
			{alignments.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={getPadding()} onChange={handlePaddingChange} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={caption.typo} onChange={(val) => updateObj('caption', val, 'typo')} defaults={{ fontSize: { desktop: 15 } }} />
	</PanelBody>;
};

export default Caption;
