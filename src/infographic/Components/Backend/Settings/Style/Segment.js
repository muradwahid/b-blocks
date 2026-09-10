import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { maxSegmentSize, msUnit, resolveDevice, sUnit, segmentShapes, stateLabel, stateTabs } from '../../../../utils/options';

const Segment = ({ attributes, updateObj, device = 'desktop' }) => {
	const { segment = {}, wheel = {} } = attributes;

	// A wedge is sized to the ring and clipped, so size, shape and radius have
	// nothing to act on.
	const isWedge = !!wheel.enableSegmentsType;
	const circle = parseFloat(resolveDevice(attributes.outerDisc, device, 'size', 560)) || 560;

	return <PanelBody className='bPlPanelBody' title={__('Segment', 'b-blocks')} initialOpen={false}>

		{!isWedge && <SelectControl className='mt10' label={__('Shape', 'b-blocks')} labelPosition='edge' value={segment.shape || 'circle'} options={segmentShapes} onChange={(val) => updateObj('segment', val, 'shape')} __nextHasNoMarginBottom />}

		{!isWedge && <BoxControl label={__('Border Radius', 'b-blocks')} values={segment.radius || {}} onChange={(val) => updateObj('segment', val, 'radius')} />}

		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={segment?.[device]?.padding || {}} onChange={(val) => updateObj('segment', val, device, 'padding')} />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Content Gap', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={segment.spacing || ''} onChange={(val) => updateObj('segment', val, 'spacing')} units={[pxUnit(), emUnit()]} />
		</Flex>

		<small>{__('Space between the icon and the label inside a segment.', 'b-blocks')}</small>

		<BoxControl label={__('Content Margin', 'b-blocks')} values={segment.margin || {}} onChange={(val) => updateObj('segment', val, 'margin')} />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Transition', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={segment.transition || ''} onChange={(val) => updateObj('segment', val, 'transition')} units={[msUnit(), sUnit()]} />
		</Flex>

		{!isWedge && <>
			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Size', 'b-blocks')} <Device /></Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={segment?.[device]?.size || ''} onChange={(val) => updateObj('segment', val, device, 'size')} units={[pxUnit()]} max={maxSegmentSize(circle)} />
			</Flex>

		</>}

		<Typography className='mt10' label={__('Label Typography', 'b-blocks')} value={segment.labelTypo} onChange={(val) => updateObj('segment', val, 'labelTypo')} defaults={{ fontSize: { desktop: 13, tablet: 12, mobile: 11 } }} />

		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={stateTabs}>
			{(state) => <>
				<Background label={stateLabel(state.name, __('Background', 'b-blocks'))} value={segment?.[state.name]?.background} onChange={(val) => updateObj('segment', val, state.name, 'background')} />

				<ColorControl className='mt10' label={stateLabel(state.name, __('Text Color', 'b-blocks'))} value={segment?.[state.name]?.color} onChange={(val) => updateObj('segment', val, state.name, 'color')} defaultColor='#FFFFFF' />

				<BorderBoxControl label={stateLabel(state.name, __('Border', 'b-blocks'))} value={segment?.[state.name]?.border} onChange={(val) => updateObj('segment', val, state.name, 'border')} />

				<ShadowControl label={stateLabel(state.name, __('Box Shadow', 'b-blocks'))} value={segment?.[state.name]?.shadow} onChange={(val) => updateObj('segment', val, state.name, 'shadow')} />
			</>}
		</TabPanel>

	</PanelBody>;
};

export default Segment;
