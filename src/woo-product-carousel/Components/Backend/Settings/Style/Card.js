import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { alignOptions, pxUnits, stateOptions } from '../../../../utils/options';
import { CONTENT_SPACE_PRESETS } from '../../../../utils/data';

const Card = ({ attributes, updateObj, device = 'desktop' }) => {
	const { card = {}, content = {} } = attributes;

	// Normal / Hover border, radius and shadow, one switch per panel.
	const [cardState, setCardState] = useState('normal');
	const [contentState, setContentState] = useState('normal');

	return <>
		<PanelBody className='bPlPanelBody' title={__('Products', 'b-blocks')} initialOpen={true}>
			<Background
				label={__('Background:', 'b-blocks')}
				value={card.normal?.color?.bg}
				onChange={(val) => updateObj('card', val, 'normal', 'color', 'bg')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>}
				values={card[device]?.padding}
				min={ 0 }
				onChange={(val) => updateObj('card', val, device, 'padding')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>}
				values={card[device]?.margin}
				onChange={(val) => updateObj('card', val, device, 'margin')}
			/>

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={cardState} onChange={(val) => setCardState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={__('Border', 'b-blocks')}
				value={card[cardState]?.border}
				onChange={(val) => updateObj('card', val, cardState, 'border')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
				values={card[cardState]?.[device]?.radius}
				min={ 0 }
				onChange={(val) => updateObj('card', val, cardState, device, 'radius')}
			/>

			<ShadowControl
				key={cardState}
				className='mt10'
				label={__('Box Shadow', 'b-blocks')}
				value={card[cardState]?.shadow}
				onChange={(val) => updateObj('card', val, cardState, 'shadow')}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
			<Label className='mb5'>{__('Content Alignment:', 'b-blocks')} <Device /></Label>
			<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={content[device]?.align} onChange={(val) => updateObj('content', val || '', device, 'align')}>
				{alignOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<Background
				className='mt20'
				label={__('Content Background:', 'b-blocks')}
				value={content.normal?.color?.bg}
				isImage={false}
				onChange={(val) => updateObj('content', val, 'normal', 'color', 'bg')}
			/>

			<BoxControl
				className='mt10'
				label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>}
				values={content[device]?.padding}
				min={ 0 }
				onChange={(val) => updateObj('content', val, device, 'padding')}
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Slides Gap', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={content[device]?.gap}
				units={pxUnits}
				min={0}
				max={200}
				onChange={(val) => updateObj('content', val || '', device, 'gap')}
			/>

			{/* The grey content box sits apart from the image in these presets. */}
			{CONTENT_SPACE_PRESETS.includes(attributes.preset) && <UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Content Space', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				help={__('Between the image and the content box.', 'b-blocks')}
				value={content[device]?.space}
				units={pxUnits}
				min={0}
				max={200}
				onChange={(val) => updateObj('content', val || '', device, 'space')}
			/>}

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={contentState} onChange={(val) => setContentState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={__('Border', 'b-blocks')}
				value={content[contentState]?.border}
				onChange={(val) => updateObj('content', val, contentState, 'border')}
			/>

			<BoxControl
				className='mt10'
				label={__('Border Radius', 'b-blocks')}
				values={content[contentState]?.radius}
				min={ 0 }
				onChange={(val) => updateObj('content', val, contentState, 'radius')}
			/>

			<ShadowControl
				key={contentState}
				className='mt10'
				label={__('Box Shadow', 'b-blocks')}
				value={content[contentState]?.shadow}
				onChange={(val) => updateObj('content', val, contentState, 'shadow')}
			/>
		</PanelBody>
	</>;
};

export default Card;