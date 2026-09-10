import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { perUnit, pxUnit, vhUnit } from '../../../../../../../bpl-tools/utils/options';

import { alignments } from '../../../../utils/options';

// The frame around the snippet: its size on each breakpoint, and the surface it
// is drawn on.
const Box = ({ attributes, updateObj, device = 'desktop' }) => {
	const { box = {} } = attributes;

	const size = (label, key, units) => <Flex className='mt10'>
		<Label className='mb0 flex2'>{label} <Device /></Label>

		<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={box?.[device]?.[key] || ''} onChange={(val) => updateObj('box', val, device, key)} units={units} />
	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Box', 'b-blocks')} initialOpen={true}>

		{size(__('Width', 'b-blocks'), 'width', [pxUnit(), perUnit(), vhUnit()])}

		{size(__('Height', 'b-blocks'), 'height', [pxUnit(), perUnit(), vhUnit()])}

		<small>{__('Leave Height empty to let the snippet set it.', 'b-blocks')}</small>

		<Label className='mb0 mt10 flex1'>{__('Alignment', 'b-blocks')} <Device /></Label>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={box?.[device]?.align || ''} onChange={(val) => updateObj('box', val, device, 'align')}>
			{alignments.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={box?.[device]?.padding || {}} onChange={(val) => updateObj('box', val, device, 'padding')} />

		<BoxControl label={<>{__('Border Radius', 'b-blocks')} <Device /></>} values={box?.[device]?.radius || {}} onChange={(val) => updateObj('box', val, device, 'radius')} />

		<Background className='mt10' label={__('Background', 'b-blocks')} value={box.background} onChange={(val) => updateObj('box', val, 'background')} />

		<small>{__('Left empty, the theme paints the background.', 'b-blocks')}</small>

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={box.border} onChange={(val) => updateObj('box', val, 'border')} />

		<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={box.shadow} onChange={(val) => updateObj('box', val, 'shadow')} />

	</PanelBody>;
};

export default Box;