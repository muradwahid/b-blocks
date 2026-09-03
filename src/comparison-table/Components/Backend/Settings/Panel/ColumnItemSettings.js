import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, RangeControl, TextControl, ToggleControl, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, IconLibrary, Label, Typography } from '../../../../../../../bpl-tools/Components';

import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icons';

const ColumnItemSettings = ({ value = [], onChange, index, featuredLabel = '', device = 'desktop' }) => {
	const [ctaState, setCtaState] = useState('normal');

	const item = value[index];
	if (!item) return null;

	const updateCtaState = (state, key, next) => onChange(value.map((column, i) => (i === index
		? {
			...(column || {}),
			cta: { ...(column?.cta || {}), [state]: { ...(column?.cta?.[state] || {}), [key]: next } }
		}
		: column)));

	const updateCta = (key, next) => onChange(value.map((column, i) => (i === index
		? { ...(column || {}), cta: { ...(column?.cta || {}), [key]: next } }
		: column)));

	const update = (key, next) => {
		let items = value.map((column, i) => (i === index ? { ...(column || {}), [key]: next } : column));

		if ('isFeatured' === key && true === next) {
			items = items.map((column, i) => (i === index ? column : { ...(column || {}), isFeatured: false }));
		}

		onChange(items);
	};

	return <>
		<TextControl label={__('Column label', 'b-blocks')} value={item.label || ''} onChange={(val) => update('label', val)} placeholder={__('e.g. Pro', 'b-blocks')} __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('Subtitle (optional)', 'b-blocks')} value={item.subtitle || ''} onChange={(val) => update('subtitle', val)} placeholder={__('e.g. $19/mo', 'b-blocks')} __nextHasNoMarginBottom />

		<IconLibrary
			className='mt10'
			label={__('Header Icon', 'b-blocks')}
			value={item.icon}
			onChange={(val) => update('icon', val)}
		/>

		{item.icon ? <ColorControl
			className='mt10'
			label={__('Icon Color:', 'b-blocks')}
			value={item.iconColor}
			onChange={(val) => update('iconColor', val)}
		/> : null}

		{item.icon ? <Flex className='mt10'>
			<Label className='flex2 mb0'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl
				className='flex1'
				value={item.iconSize?.[device]}
				onChange={(val) => update('iconSize', { ...(item.iconSize || {}), [device]: val })}
				__next40pxDefaultSize
			/>
		</Flex> : null}

		<TextControl className='mt10' label={__('CTA URL (optional)', 'b-blocks')} value={item.ctaUrl || ''} onChange={(val) => update('ctaUrl', val)} placeholder='https://' type='url' __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('CTA button label', 'b-blocks')} value={item.ctaLabel || ''} onChange={(val) => update('ctaLabel', val)} placeholder={__('e.g. Choose Plan', 'b-blocks')} __nextHasNoMarginBottom />

		<ToggleControl
			className='mt10'
			label={__('Featured column (highlight)', 'b-blocks')}
			checked={!!item.isFeatured}
			onChange={(val) => update('isFeatured', val)}
			help={__('Only one column can be featured at a time.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		{!!item.isFeatured && <TextControl
			className='mt10'
			label={__('Badge text', 'b-blocks')}
			value={item.badge || ''}
			onChange={(val) => update('badge', val)}
			placeholder={featuredLabel || __('Most Popular', 'b-blocks')}
			help={__('Leave empty to use the Featured Label from the Content panel.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>}

		{item.ctaLabel ? <>
			<hr />

			<Label>{__('CTA overrides for this column', 'b-blocks')}</Label>
			<small style={{ display: 'block', opacity: 0.7, marginBottom: 8 }}>
				{__('Anything left empty inherits Style → CTA Button.', 'b-blocks')}
			</small>

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ctaState} onChange={setCtaState}>
				<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
				<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			</ToggleGroupControl>

			<Background className='mt10' label={__('Background', 'b-blocks')} value={item.cta?.[ctaState]?.bg || {}} onChange={(val) => updateCtaState(ctaState, 'bg', val)} />

			<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={item.cta?.[ctaState]?.color} onChange={(val) => updateCtaState(ctaState, 'color', val)} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={item.cta?.typo || {}} onChange={(val) => updateCta('typo', val)} />

			<Label className='mt10 mb5'><Flex justify='flex-start' gap={0}>{__('Alignment', 'b-blocks')} <Device /></Flex></Label>
			<ToggleGroupControl
				className='flex1'
				size='small'
				style={{ padding: '2px' }}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				isDeselectable
				value={item.cta?.alignment?.[device]}
				onChange={(val) => updateCta('alignment', { ...(item.cta?.alignment || {}), [device]: val })}
			>
				<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon={<AlignStartIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon={<AlignCenterIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon={<AlignEndIcon style={{ rotate: '-90deg' }} />} />
			</ToggleGroupControl>

			<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={item.cta?.border || {}} onChange={(val) => updateCta('border', val)} />

			<BoxControl label={__('Padding', 'b-blocks')} values={item.cta?.padding} onChange={(val) => updateCta('padding', val)} />

			<BoxControl label={__('Border Radius', 'b-blocks')} values={item.cta?.radius} onChange={(val) => updateCta('radius', val)} />

			{'hover' === ctaState && <RangeControl
				className='mt10'
				label={__('Transition', 'b-blocks')}
				value={'' === item.cta?.transition || undefined === item.cta?.transition ? '' : item.cta.transition}
				min={0}
				max={2}
				step={0.05}
				allowReset
				onChange={(val) => updateCta('transition', undefined === val ? '' : val)}
				help={__('Leave unset to inherit Style → CTA Button.', 'b-blocks')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>}
		</> : null}
	</>;
};
export default ColumnItemSettings;
