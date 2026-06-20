import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import ItemsRepeater from '../ItemsRepeater';

const PRESET_OPTIONS = [
	{ label: __('Check', 'b-blocks'), value: 'check' },
	{ label: __('Check (circle)', 'b-blocks'), value: 'circle-check' },
	{ label: __('Cross', 'b-blocks'), value: 'cross' },
	{ label: __('Cross (circle)', 'b-blocks'), value: 'circle-cross' },
	{ label: __('Arrow right', 'b-blocks'), value: 'arrow' },
	{ label: __('Star', 'b-blocks'), value: 'star' },
	{ label: __('Filled dot', 'b-blocks'), value: 'dot' },
	{ label: __('Custom (Font Awesome class)', 'b-blocks'), value: 'custom' },
];

const WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const ICON_ALIGN_OPTIONS = [
	{ label: __('Top', 'b-blocks'), value: 'flex-start' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Bottom', 'b-blocks'), value: 'flex-end' },
];

const parsePx = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	if (!v) return fallback;
	const m = v.match(/^(-?\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		items,
		ariaLabel,
		columns = {},
		columnGap = {},
		rowGap = {},
		iconPreset,
		iconClass,
		iconSize = {},
		iconColor,
		iconBg,
		iconRadius,
		iconPadding,
		iconGap,
		iconAlign,
		textSize = {},
		textColor,
		textWeight,
		showDescription,
		descriptionSize = {},
		descriptionColor,
		alignment,
	} = attributes;

	const updateResponsive = (attrKey, breakpoint, value, unit = 'px') => {
		const current = attributes[attrKey] || {};
		const next = { ...current };
		next[breakpoint] = value === '' || value == null ? '' : `${value}${unit}`;
		setAttributes({ [attrKey]: next });
	};

	const updateColumnCount = (breakpoint, value) => {
		const next = { ...(columns || {}) };
		next[breakpoint] = parseInt(value, 10) || 1;
		setAttributes({ columns: next });
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'left' })}
				/>
			</BlockControls>

			<InspectorControls>
				<HelpPanel slug={pluginSlug} />

				<PanelBody
					className='bPlPanelBody'
					title={__('Layout', 'b-blocks')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Text alignment', 'b-blocks')}
						value={alignment || 'left'}
						options={ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ alignment: val })}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Accessible list label', 'b-blocks')}
						value={ariaLabel || ''}
						onChange={(val) => setAttributes({ ariaLabel: val })}
						placeholder={__('Feature list', 'b-blocks')}
						help={__('Used as the aria-label of the list so screen readers announce it descriptively.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<Label>{__('Columns (desktop)', 'b-blocks')}</Label>
					<RangeControl
						value={parseInt(columns?.desktop, 10) || 1}
						onChange={(val) => updateColumnCount('desktop', val)}
						min={1}
						max={6}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Columns (tablet)', 'b-blocks')}</Label>
					<RangeControl
						value={parseInt(columns?.tablet, 10) || 1}
						onChange={(val) => updateColumnCount('tablet', val)}
						min={1}
						max={6}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Columns (mobile)', 'b-blocks')}</Label>
					<RangeControl
						value={parseInt(columns?.mobile, 10) || 1}
						onChange={(val) => updateColumnCount('mobile', val)}
						min={1}
						max={6}
						step={1}
						__nextHasNoMarginBottom
					/>

					<Label>{__('Column gap, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(columnGap?.desktop, 24)}
						onChange={(val) => updateResponsive('columnGap', 'desktop', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Column gap, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(columnGap?.tablet, parsePx(columnGap?.desktop, 24))}
						onChange={(val) => updateResponsive('columnGap', 'tablet', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Column gap, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(columnGap?.mobile, parsePx(columnGap?.tablet, parsePx(columnGap?.desktop, 24)))}
						onChange={(val) => updateResponsive('columnGap', 'mobile', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>

					<Label>{__('Row gap, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(rowGap?.desktop, 12)}
						onChange={(val) => updateResponsive('rowGap', 'desktop', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Row gap, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(rowGap?.tablet, parsePx(rowGap?.desktop, 12))}
						onChange={(val) => updateResponsive('rowGap', 'tablet', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Row gap, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(rowGap?.mobile, parsePx(rowGap?.tablet, parsePx(rowGap?.desktop, 12)))}
						onChange={(val) => updateResponsive('rowGap', 'mobile', val)}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Items', 'b-blocks')}
					initialOpen={true}
				>
					<Label>{__('Items', 'b-blocks')}</Label>
					<ItemsRepeater
						value={items || []}
						onChange={(val) => setAttributes({ items: val })}
						showDescription={!!showDescription}
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Icon', 'b-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Default icon preset', 'b-blocks')}
						value={iconPreset || 'check'}
						options={PRESET_OPTIONS}
						onChange={(val) => setAttributes({ iconPreset: val })}
						help={__('Applied to every item that does not have its own per-item override.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{iconPreset === 'custom' && (
						<TextControl
							label={__('Default icon class (Font Awesome)', 'b-blocks')}
							value={iconClass || ''}
							onChange={(val) => setAttributes({ iconClass: val })}
							placeholder='fa-solid fa-check'
							help={__('Example: fa-solid fa-check', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<Label>{__('Icon size, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(iconSize?.desktop, 18)}
						onChange={(val) => updateResponsive('iconSize', 'desktop', val)}
						min={8}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Icon size, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(iconSize?.tablet, parsePx(iconSize?.desktop, 18))}
						onChange={(val) => updateResponsive('iconSize', 'tablet', val)}
						min={8}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Icon size, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(iconSize?.mobile, parsePx(iconSize?.tablet, parsePx(iconSize?.desktop, 18)))}
						onChange={(val) => updateResponsive('iconSize', 'mobile', val)}
						min={8}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Icon color:', 'b-blocks')}</Label>
						<ColorControl
							value={iconColor || '#22c55e'}
							onChange={(val) => setAttributes({ iconColor: val })}
							defaultColor='#22c55e'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Icon background:', 'b-blocks')}</Label>
						<ColorControl
							value={iconBg || ''}
							onChange={(val) => setAttributes({ iconBg: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<RangeControl
						label={__('Icon background radius (%)', 'b-blocks')}
						value={parseInt(iconRadius, 10) >= 0 ? parseInt(iconRadius, 10) : 50}
						onChange={(val) => setAttributes({ iconRadius: val })}
						min={0}
						max={50}
						step={1}
						help={__('0 = square, 50 = circle pill.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{!!iconBg && (
						<RangeControl
							label={__('Icon background padding (px)', 'b-blocks')}
							value={parseInt(iconPadding, 10) >= 0 ? parseInt(iconPadding, 10) : 4}
							onChange={(val) => setAttributes({ iconPadding: val })}
							min={0}
							max={24}
							step={1}
							__nextHasNoMarginBottom
						/>
					)}

					<RangeControl
						label={__('Icon-to-text gap (px)', 'b-blocks')}
						value={parseInt(iconGap, 10) >= 0 ? parseInt(iconGap, 10) : 10}
						onChange={(val) => setAttributes({ iconGap: val })}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Icon vertical alignment', 'b-blocks')}
						value={iconAlign || 'flex-start'}
						options={ICON_ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ iconAlign: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Text', 'b-blocks')}
					initialOpen={false}
				>
					<Label>{__('Text size, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(textSize?.desktop, 16)}
						onChange={(val) => updateResponsive('textSize', 'desktop', val)}
						min={10}
						max={32}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Text size, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(textSize?.tablet, parsePx(textSize?.desktop, 16))}
						onChange={(val) => updateResponsive('textSize', 'tablet', val)}
						min={10}
						max={32}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Text size, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(textSize?.mobile, parsePx(textSize?.tablet, parsePx(textSize?.desktop, 16)))}
						onChange={(val) => updateResponsive('textSize', 'mobile', val)}
						min={10}
						max={32}
						step={1}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Text color:', 'b-blocks')}</Label>
						<ColorControl
							value={textColor || ''}
							onChange={(val) => setAttributes({ textColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<SelectControl
						label={__('Text weight', 'b-blocks')}
						value={textWeight || '400'}
						options={WEIGHT_OPTIONS}
						onChange={(val) => setAttributes({ textWeight: val })}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show description sub-text', 'b-blocks')}
						checked={!!showDescription}
						onChange={(val) => setAttributes({ showDescription: val })}
						help={__('When enabled, each item can show an optional second line beneath the primary text.', 'b-blocks')}
					/>

					{showDescription && (
						<>
							<Label>{__('Description size, desktop (px)', 'b-blocks')}</Label>
							<RangeControl
								value={parsePx(descriptionSize?.desktop, 13)}
								onChange={(val) => updateResponsive('descriptionSize', 'desktop', val)}
								min={10}
								max={24}
								step={1}
								__nextHasNoMarginBottom
							/>
							<Label>{__('Description size, tablet (px)', 'b-blocks')}</Label>
							<RangeControl
								value={parsePx(descriptionSize?.tablet, parsePx(descriptionSize?.desktop, 13))}
								onChange={(val) => updateResponsive('descriptionSize', 'tablet', val)}
								min={10}
								max={24}
								step={1}
								__nextHasNoMarginBottom
							/>
							<Label>{__('Description size, mobile (px)', 'b-blocks')}</Label>
							<RangeControl
								value={parsePx(descriptionSize?.mobile, parsePx(descriptionSize?.tablet, parsePx(descriptionSize?.desktop, 13)))}
								onChange={(val) => updateResponsive('descriptionSize', 'mobile', val)}
								min={10}
								max={24}
								step={1}
								__nextHasNoMarginBottom
							/>

							<PanelRow>
								<Label className=''>{__('Description color:', 'b-blocks')}</Label>
								<ColorControl
									value={descriptionColor || ''}
									onChange={(val) => setAttributes({ descriptionColor: val || '' })}
									defaultColor=''
								/>
							</PanelRow>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
