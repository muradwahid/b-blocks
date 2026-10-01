import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, Background, ColorControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { contentAlignOptions, UNITS } from '../../../../utils/options';
import { at } from '../../../../utils/functions';

const GridCard = ({ attributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, card = {} } = attributes;

	const [cardState, setCardState] = useState('normal');

	return <>
		<PanelBody className='bPlPanelBody' title={__('Grid', 'b-blocks')} initialOpen={true}>
			{'list' !== layout.type && <UnitControl
				__next40pxDefaultSize
				label={<Flex>{__('Column Gap', 'b-blocks')} <Device /></Flex>}
				labelPosition='edge'
				units={UNITS}
				isUnitSelectTabbable
				value={at(layout, device, 'columnGap')}
				onChange={(val) => updateObj('layout', val || '', device, 'columnGap')}
			/>}

			<UnitControl
				className={'list' !== layout.type ? 'mt10' : ''}
				__next40pxDefaultSize
				label={<Flex>{__('Row Gap', 'b-blocks')} <Device /></Flex>}
				labelPosition='edge'
				units={UNITS}
				isUnitSelectTabbable
				value={at(layout, device, 'rowGap')}
				onChange={(val) => updateObj('layout', val || '', device, 'rowGap')}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Card', 'b-blocks')} initialOpen={false}>
			<Label className='flex2'>{__('Content Alignment:', 'b-blocks')} <Device /></Label>
			<ToggleGroupControl className='flex1 mb20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={at(layout, device, 'contentAlign')} onChange={(val) => updateObj('layout', val || '', device, 'contentAlign')}>
				{contentAlignOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<Background
				label={__('Content Background:', 'b-blocks')}
				value={card.bodyBg}
				isImage={false}
				onChange={(val) => updateObj('card', val, 'bodyBg')}
			/>

			<BoxControl
				className='mt10 mb20'
				label={<Flex>{__('Content Margin', 'b-blocks')} <Device /></Flex>}
				values={at(card, device, 'bodyMargin')}
				onChange={(val) => updateObj('card', val, device, 'bodyMargin')}
			/>

			{'split' === layout.actionPosition && <ColorControl
				className='mb20'
				label={__('Footer Divider:', 'b-blocks')}
				value={card.divider}
				defaultColor='#f1f5f9'
				onChange={(val) => updateObj('card', val, 'divider')}
			/>}

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={cardState} onChange={(val) => setCardState(val || 'normal')}>
				<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
				<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			</ToggleGroupControl>

			<Background
				label={__('Background:', 'b-blocks')}
				value={card[cardState]?.bg}
				onChange={(val) => updateObj('card', val, cardState, 'bg')}
			/>

			<BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={__('Border', 'b-blocks')}
				value={card[cardState]?.border}
				onChange={(val) => updateObj('card', val, cardState, 'border')}
			/>

			<ShadowControl
				className='mt10'
				label={__('Box Shadow', 'b-blocks')}
				value={card[cardState]?.shadow}
				onChange={(val) => updateObj('card', val, cardState, 'shadow')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>}
				values={at(card[cardState], device, 'padding')}
				onChange={(val) => updateObj('card', val, cardState, device, 'padding')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
				values={at(card[cardState], device, 'radius')}
				onChange={(val) => updateObj('card', val, cardState, device, 'radius')}
			/>

			{'hover' === cardState && <RangeControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Transition (s)', 'b-blocks')}
				help={__('How long the change from normal to hover takes.', 'b-blocks')}
				value={card.transition}
				onChange={(val) => updateObj('card', val ?? 0, 'transition')}
				min={0}
				max={2}
				step={0.05}
				allowReset
				resetFallbackValue={0.25}
			/>}
		</PanelBody>
	</>;
};

export default GridCard;
