import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Notice, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX } from '../../../../utils/options';

/** Styling for the feature-name tooltip bubble (General → Feature Rows → Tooltip). */
const TooltipStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { rows = [], tooltip = {} } = attributes;

	const hasTooltip = rows.some((row) => row?.tooltip);

	return <PanelBody className='bPlPanelBody' title={__('Tooltip', 'b-blocks')} initialOpen={false}>
		{!hasTooltip && <Notice status='info' isIcon={true}>
			{__('No row has a tooltip yet — add one under General → Feature Rows to see these styles.', 'b-blocks')}
		</Notice>}

		<Background className='mt10' label={__('Background', 'b-blocks')} value={tooltip.bg || {}} onChange={(val) => updateObj('tooltip', val, 'bg')} />

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={tooltip.color} onChange={(val) => updateObj('tooltip', val, 'color')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={tooltip.typo || {}} onChange={(val) => updateObj('tooltip', val, 'typo')} />

		<Flex className='mt10'>
			<Label className='flex2 mb0'><Flex justify='flex-start' gap={0}>{__('Max Width', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={tooltip?.[device]?.width} onChange={(val) => updateObj('tooltip', val, device, 'width')} __next40pxDefaultSize />
		</Flex>

		<BoxControl label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} units={undefined} values={tooltip?.[device]?.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('tooltip', val, device, 'padding')} />

		<BoxControl label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={tooltip?.[device]?.radius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('tooltip', val, device, 'radius')} />

		<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={tooltip.shadow || []} onChange={(val) => updateObj('tooltip', val, 'shadow')} />

		<ToggleControl
			className='mt10'
			label={__('Show arrow', 'b-blocks')}
			checked={false !== tooltip.arrow}
			onChange={(val) => updateObj('tooltip', !!val, 'arrow')}
			__nextHasNoMarginBottom
		/>

		<ToggleControl
			className='mt10'
			label={__('Underline the label', 'b-blocks')}
			checked={false !== tooltip.underline}
			onChange={(val) => updateObj('tooltip', !!val, 'underline')}
			help={__('The dotted underline is the only cue that a tooltip exists.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};
export default TooltipStyle;
