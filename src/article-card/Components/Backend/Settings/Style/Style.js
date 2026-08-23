import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, BorderControl, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { ColorControl, Background, BoxControl, Typography, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const [ctaState, setCtaState] = useState('normal');
	const { card = {}, colors = {}, cta = {}, link = {}, typography = {}, badge = {}, meta = {}, heading: headingBox = {}, excerpt: excerptBox = {} } = attributes;

	const { background = {}, padding = {}, border = {}, borderRadius = {}, shadow } = card;
	const { heading: headingColor, text: textColor } = colors;
	const {
		align: badgeAlign,
		bg: badgeBg = {},
		color: badgeColor,
		padding: badgePadding = {},
		margin: badgeMargin = {},
		border: badgeBorder = {},
		borderRadius: badgeRadius = {},
	} = badge;
	const { padding: ctaPadding = {}, margin: ctaMargin = {}, borderRadius: ctaRadius = {}, transition: ctaTransition } = cta;
	const ctaCurrent = cta[ctaState] || {};
	const { ctaStyle, cardLinkMode, ctaLabel } = link;
	const { heading: headingTypo = {}, excerpt: excerptTypo = {}, cta: ctaTypo = {}, badge: badgeTypo = {}, meta: metaTypo = {} } = typography;

	const isButton = ctaStyle === 'button';

	// Responsive BoxControl: edits obj[device], label carries the Device switcher.
	const rBox = (label, group, prop, obj, className) => (
		<BoxControl className={className} label={<Flex justify='flex-start'>{label} <Device /></Flex>} units={UNITS} values={obj?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, prop, device)} />
	);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Card Style', 'b-blocks')} initialOpen={true}>

			<Background label={__('Background', 'b-blocks')} value={background} onChange={(val) => updateObj('card', val, 'background')} />

			{rBox(__('Padding', 'b-blocks'), 'card', 'padding', padding, 'mt10')}

			<BorderControl
				label={__('Border', 'b-blocks')}
				value={border}
				onChange={(val) => updateObj('card', val || {}, 'border')}
				withSlider
				__next40pxDefaultSize
			/>

			{rBox(__('Border Radius', 'b-blocks'), 'card', 'borderRadius', borderRadius)}

			<ShadowControl className='mt10' label={__('Shadow', 'b-blocks')} value={shadow} onChange={(val) => updateObj('card', val, 'shadow')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Heading', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={headingColor || '#111827'} onChange={(val) => updateObj('colors', val, 'heading')} defaultColor='#111827' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={headingTypo} onChange={(val) => updateObj('typography', val, 'heading')} />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={headingBox.background} onChange={(val) => updateObj('heading', val, 'background')} />

			{rBox(__('Padding', 'b-blocks'), 'heading', 'padding', headingBox.padding)}

			{rBox(__('Margin', 'b-blocks'), 'heading', 'margin', headingBox.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={headingBox.border} onChange={(val) => updateObj('heading', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'heading', 'borderRadius', headingBox.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Excerpt', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={textColor || '#374151'} onChange={(val) => updateObj('colors', val, 'text')} defaultColor='#374151' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={excerptTypo} onChange={(val) => updateObj('typography', val, 'excerpt')} />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={excerptBox.background} onChange={(val) => updateObj('excerpt', val, 'background')} />

			{rBox(__('Padding', 'b-blocks'), 'excerpt', 'padding', excerptBox.padding)}

			{rBox(__('Margin', 'b-blocks'), 'excerpt', 'margin', excerptBox.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={excerptBox.border} onChange={(val) => updateObj('excerpt', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'excerpt', 'borderRadius', excerptBox.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Badge', 'b-blocks')} initialOpen={false}>
			<SelectControl
				label={__('Alignment', 'b-blocks')}
				labelPosition='edge'
				value={badgeAlign}
				options={[
					{ label: __('Left', 'b-blocks'), value: 'left' },
					{ label: __('Center', 'b-blocks'), value: 'center' },
					{ label: __('Right', 'b-blocks'), value: 'right' },
				]}
				onChange={(val) => updateObj('badge', val, 'align')}
				__nextHasNoMarginBottom
			/>

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={badgeBg} onChange={(val) => updateObj('badge', val, 'bg')} />

			<ColorControl label={__('Text Color:', 'b-blocks')} value={badgeColor || '#ffffff'} onChange={(val) => updateObj('badge', val, 'color')} defaultColor='#ffffff' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={badgeTypo} onChange={(val) => updateObj('typography', val, 'badge')} />

			{rBox(__('Padding', 'b-blocks'), 'badge', 'padding', badgePadding)}

			{rBox(__('Margin', 'b-blocks'), 'badge', 'margin', badgeMargin)}

			<BorderControl label={__('Border', 'b-blocks')} value={badgeBorder} onChange={(val) => updateObj('badge', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'badge', 'borderRadius', badgeRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Meta', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Text Color:', 'b-blocks')} value={meta.color || colors.meta || '#6b7280'} onChange={(val) => updateObj('meta', val, 'color')} defaultColor='#6b7280' />

			<ColorControl label={__('Icon Color:', 'b-blocks')} value={meta.iconColor || meta.color || colors.meta || '#6b7280'} onChange={(val) => updateObj('meta', val, 'iconColor')} defaultColor='#6b7280' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={metaTypo} onChange={(val) => updateObj('typography', val, 'meta')} />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={meta.bg} onChange={(val) => updateObj('meta', val, 'bg')} />

			{rBox(__('Padding', 'b-blocks'), 'meta', 'padding', meta.padding)}

			{rBox(__('Margin', 'b-blocks'), 'meta', 'margin', meta.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={meta.border} onChange={(val) => updateObj('meta', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'meta', 'borderRadius', meta.borderRadius)}
		</PanelBody>

		{!cardLinkMode && ctaLabel && (
			<PanelBody className='bPlPanelBody' title={__('CTA', 'b-blocks')} initialOpen={false}>
				<Typography label={__('Typography', 'b-blocks')} value={ctaTypo} onChange={(val) => updateObj('typography', val, 'cta')} />

				{isButton && <>
					<ToggleGroupControl className='mt10 flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ctaState} onChange={(val) => setCtaState(val)}>
						<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
						<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
					</ToggleGroupControl>

					<Background className='mt10' label={__('Background:', 'b-blocks')} value={ctaCurrent.bg} onChange={(val) => updateObj('cta', val, ctaState, 'bg')} />

					<ColorControl label={__('Text Color:', 'b-blocks')} value={ctaCurrent.color || '#ffffff'} onChange={(val) => updateObj('cta', val, ctaState, 'color')} defaultColor='#ffffff' />

					<BorderControl label={__('Border', 'b-blocks')} value={ctaCurrent.border} onChange={(val) => updateObj('cta', val || {}, ctaState, 'border')} withSlider __next40pxDefaultSize />

					<ShadowControl className='mt10' label={__('Shadow', 'b-blocks')} value={ctaCurrent.shadow} onChange={(val) => updateObj('cta', val, ctaState, 'shadow')} />

					{rBox(__('Padding', 'b-blocks'), 'cta', 'padding', ctaPadding)}

					{rBox(__('Margin', 'b-blocks'), 'cta', 'margin', ctaMargin)}

					{rBox(__('Border Radius', 'b-blocks'), 'cta', 'borderRadius', ctaRadius)}

					{ctaState === 'hover' && <RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} value={ctaTransition} onChange={(val) => updateObj('cta', val, 'transition')} min={0} max={5} step={0.01} />}
				</>
				}

				{!isButton && (
					<ColorControl
						label={__('Link Color:', 'b-blocks')}
						value={cta.normal?.bg?.color || '#2563eb'}
						onChange={(val) => updateObj('cta', { ...(cta.normal?.bg || {}), type: 'solid', color: val }, 'normal', 'bg')}
						defaultColor='#2563eb'
					/>
				)}
			</PanelBody>
		)}

	</>;
};
export default Style;
