import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderControl, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';

import { resolveBox, resolveDevice, toBackground, usesTooltip } from '../../../../utils/options';
import { Flex } from '@wordpress/components';

const LabelStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { label = {}, layout = {} } = attributes;

	const isTooltip = usesTooltip(layout.preset || 'glassBullseye');

	return <PanelBody className='bPlPanelBody' title={isTooltip ? __('Label / Tooltip', 'b-blocks') : __('Label', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={label.typo} onChange={(val) => updateObj('label', val, 'typo')} defaults={{ fontSize: { desktop: 13 } }} />

		<Label className='mb0 mt10'>{__('Padding', 'b-blocks')} <Device /></Label>

		<BoxControl values={resolveBox(label, device, 'padding')} onChange={(val) => updateObj('label', val, device, 'padding')} />

		{!isTooltip && <Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Gap', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				value={resolveDevice(label, device, 'gap', '')}
				onChange={(val) => updateObj('label', undefined === val ? '' : val, device, 'gap')}
				__next40pxDefaultSize
			/>
		</Flex>}

		{isTooltip && <>
			<Background className='mt10' label={__('Tooltip Background', 'b-blocks')} value={toBackground(label.tooltipBackground)} onChange={(val) => updateObj('label', val, 'tooltipBackground')} />

			<ColorControl label={__('Tooltip Text', 'b-blocks')} value={label.tooltipText} onChange={(val) => updateObj('label', val, 'tooltipText')} />

			<BorderControl
				className='mt10'
				label={__('Border', 'b-blocks')}
				value={label.border}
				onChange={(val) => updateObj('label', val, 'border')}
				__next40pxDefaultSize
			/>

			<Label className='mb0 mt10'>{__('Border Radius', 'b-blocks')} <Device /></Label>

			<BoxControl values={resolveBox(label, device, 'radius')} onChange={(val) => updateObj('label', val, device, 'radius')} />
		</>}
	</PanelBody>;
};

export default LabelStyle;
