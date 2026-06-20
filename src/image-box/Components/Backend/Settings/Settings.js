import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import ItemsRepeater from '../ItemsRepeater';

const OVERLAY_MODE_OPTIONS = [
	{ label: __('Hover (fade in)', 'b-blocks'), value: 'hover' },
	{ label: __('Slide up on hover', 'b-blocks'), value: 'slide-up' },
	{ label: __('Always visible', 'b-blocks'), value: 'always' },
];

const ASPECT_OPTIONS = [
	{ label: __('1:1 (square)', 'b-blocks'), value: '1-1' },
	{ label: __('4:3 (landscape)', 'b-blocks'), value: '4-3' },
	{ label: __('16:9 (widescreen)', 'b-blocks'), value: '16-9' },
	{ label: __('3:2 (photo)', 'b-blocks'), value: '3-2' },
	{ label: __('3:4 (portrait)', 'b-blocks'), value: '3-4' },
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __('Normal (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
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
		columns = {},
		columnGap,
		rowGap,
		aspectRatio,
		borderRadius,
		overlayMode,
		overlayColor,
		overlayOpacity,
		titleColor,
		titleFontSize = {},
		titleFontWeight,
		descColor,
		descFontSize = {},
		showDesc,
		showArrow,
		zoomOnHover,
		zoomScale,
		animDuration,
	} = attributes;

	const updateResponsive = (attrKey, breakpoint, value, unit = 'px') => {
		const current = attributes[attrKey] || {};
		const next = { ...current };
		next[breakpoint] = value === '' || value == null ? '' : `${value}${unit}`;
		setAttributes({ [attrKey]: next });
	};

	const updateColumns = (breakpoint, value) => {
		const next = { ...(columns || {}) };
		next[breakpoint] = parseInt(value, 10) || 1;
		setAttributes({ columns: next });
	};

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Layout', 'b-blocks')}
				initialOpen={true}
			>
				<Label>{__('Columns (desktop)', 'b-blocks')}</Label>
				<RangeControl
					value={parseInt(columns?.desktop, 10) || 3}
					onChange={(val) => updateColumns('desktop', val)}
					min={1}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Columns (tablet)', 'b-blocks')}</Label>
				<RangeControl
					value={parseInt(columns?.tablet, 10) || 2}
					onChange={(val) => updateColumns('tablet', val)}
					min={1}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Columns (mobile)', 'b-blocks')}</Label>
				<RangeControl
					value={parseInt(columns?.mobile, 10) || 1}
					onChange={(val) => updateColumns('mobile', val)}
					min={1}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Column gap (px)', 'b-blocks')}
					value={parseInt(columnGap, 10) >= 0 ? parseInt(columnGap, 10) : 24}
					onChange={(val) => setAttributes({ columnGap: val })}
					min={0}
					max={80}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Row gap (px)', 'b-blocks')}
					value={parseInt(rowGap, 10) >= 0 ? parseInt(rowGap, 10) : 24}
					onChange={(val) => setAttributes({ rowGap: val })}
					min={0}
					max={80}
					step={1}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Image aspect ratio', 'b-blocks')}
					value={aspectRatio || '4-3'}
					options={ASPECT_OPTIONS}
					onChange={(val) => setAttributes({ aspectRatio: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Card border radius (px)', 'b-blocks')}
					value={parseInt(borderRadius, 10) >= 0 ? parseInt(borderRadius, 10) : 8}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={64}
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
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Overlay', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Reveal mode', 'b-blocks')}
					value={overlayMode || 'hover'}
					options={OVERLAY_MODE_OPTIONS}
					onChange={(val) => setAttributes({ overlayMode: val })}
					help={__('"Always visible" disables the hover reveal — handy for short pages where you want titles always readable.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Overlay color:', 'b-blocks')}</Label>
					<ColorControl
						value={overlayColor || '#000000'}
						onChange={(val) => setAttributes({ overlayColor: val || '#000000' })}
						defaultColor='#000000'
					/>
				</PanelRow>

				<RangeControl
					label={__('Overlay opacity (%)', 'b-blocks')}
					value={Math.round(((typeof overlayOpacity === 'number' ? overlayOpacity : 0.55)) * 100)}
					onChange={(val) => {
						const n = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
						setAttributes({ overlayOpacity: n / 100 });
					}}
					min={0}
					max={100}
					step={1}
					help={__('Tip: 50–70% gives the best WCAG AA contrast for white text on photography.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Animation duration (ms)', 'b-blocks')}
					value={parseInt(animDuration, 10) >= 0 ? parseInt(animDuration, 10) : 300}
					onChange={(val) => setAttributes({ animDuration: val })}
					min={0}
					max={800}
					step={50}
					help={__('Set to 0 for instant reveal. Reduced-motion users always get an instant reveal regardless.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Image', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Zoom image on hover', 'b-blocks')}
					checked={!!zoomOnHover}
					onChange={(val) => setAttributes({ zoomOnHover: !!val })}
				/>

				{zoomOnHover && (
					<RangeControl
						label={__('Zoom scale', 'b-blocks')}
						value={typeof zoomScale === 'number' ? zoomScale : 1.08}
						onChange={(val) => setAttributes({ zoomScale: val })}
						min={1.0}
						max={1.5}
						step={0.01}
						help={__('1.0 = no zoom. 1.05–1.15 is the natural-looking sweet spot.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Title & Description', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Show description', 'b-blocks')}
					checked={!!showDesc}
					onChange={(val) => setAttributes({ showDesc: !!val })}
				/>

				<ToggleControl
					label={__('Show arrow on linked titles', 'b-blocks')}
					checked={!!showArrow}
					onChange={(val) => setAttributes({ showArrow: !!val })}
					help={__('Adds an arrow next to the title on cards that link somewhere — a visual cue that they\'re clickable.', 'b-blocks')}
				/>

				<SelectControl
					label={__('Title font weight', 'b-blocks')}
					value={titleFontWeight || '600'}
					options={FONT_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ titleFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Title color:', 'b-blocks')}</Label>
					<ColorControl
						value={titleColor || '#ffffff'}
						onChange={(val) => setAttributes({ titleColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<Label>{__('Title font size, desktop (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(titleFontSize?.desktop, 20)}
					onChange={(val) => updateResponsive('titleFontSize', 'desktop', val)}
					min={12}
					max={48}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Title font size, tablet (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(titleFontSize?.tablet, parsePx(titleFontSize?.desktop, 20))}
					onChange={(val) => updateResponsive('titleFontSize', 'tablet', val)}
					min={12}
					max={48}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Title font size, mobile (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(titleFontSize?.mobile, parsePx(titleFontSize?.tablet, parsePx(titleFontSize?.desktop, 20)))}
					onChange={(val) => updateResponsive('titleFontSize', 'mobile', val)}
					min={12}
					max={48}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Description color:', 'b-blocks')}</Label>
					<ColorControl
						value={descColor || '#f1f5f9'}
						onChange={(val) => setAttributes({ descColor: val || '#f1f5f9' })}
						defaultColor='#f1f5f9'
					/>
				</PanelRow>

				<Label>{__('Description font size, desktop (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(descFontSize?.desktop, 15)}
					onChange={(val) => updateResponsive('descFontSize', 'desktop', val)}
					min={10}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Description font size, tablet (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(descFontSize?.tablet, parsePx(descFontSize?.desktop, 15))}
					onChange={(val) => updateResponsive('descFontSize', 'tablet', val)}
					min={10}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label>{__('Description font size, mobile (px)', 'b-blocks')}</Label>
				<RangeControl
					value={parsePx(descFontSize?.mobile, parsePx(descFontSize?.tablet, parsePx(descFontSize?.desktop, 15)))}
					onChange={(val) => updateResponsive('descFontSize', 'mobile', val)}
					min={10}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
