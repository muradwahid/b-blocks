import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, SelectControl, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { ALIGNMENT_OPTIONS, THEME_OPTIONS, applyThemePreset } from '../../../../utils/options';

const COL_FALLBACK = { desktop: 3, tablet: 2, mobile: 1 };

const Layout = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {} } = attributes;
	const { type, theme, alignment, columnCount = {}, gap = {} } = layout;

	return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={type} onChange={(val) => updateObj('layout', val, 'type')}>
			<ToggleGroupControlOption label='Horizontal' value='horizontal' />
			<ToggleGroupControlOption label='Vertical' value='vertical' />
		</ToggleGroupControl>


		<SelectControl className='mt10' label={__('Theme', 'b-blocks')} value={theme || 'classic'} options={THEME_OPTIONS} onChange={(val) => setAttributes(applyThemePreset(attributes, val))} help={__('Applies a preset color & feel to the badge, card, connector and text. You can still fine-tune each in the Style tab afterwards.', 'b-blocks')} __nextHasNoMarginBottom />

		<SelectControl className='mt10' label={__('Text alignment', 'b-blocks')} value={alignment || 'center'} options={ALIGNMENT_OPTIONS} labelPosition='edge' onChange={(val) => updateObj('layout', val, 'alignment')} __nextHasNoMarginBottom />

		{type !== 'vertical' && <>
			<Label><Flex>{__('Columns', 'b-blocks')} <Device /></Flex></Label>
			<RangeControl
				value={parseInt(columnCount?.[device], 10) || COL_FALLBACK[device]}
				onChange={(val) => updateObj('layout', parseInt(val, 10) || 1, 'columnCount', device)}
				min={1}
				max={6}
				step={1}
				__nextHasNoMarginBottom
			/>
		</>}

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Gap', 'b-blocks')} <Device /></Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={gap?.[device] || ''} onChange={(val) => updateObj('layout', val, 'gap', device)} />
		</Flex>
	</PanelBody>;
};

export default Layout;
