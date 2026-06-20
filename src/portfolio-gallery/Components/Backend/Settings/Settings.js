import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import ItemsRepeater from '../ItemsRepeater';
import CategoriesRepeater from '../CategoriesRepeater';

const LAYOUT_OPTIONS = [
	{ label: __('Grid (equal cells)', 'b-blocks'), value: 'grid' },
	{ label: __('Masonry (natural heights)', 'b-blocks'), value: 'masonry' },
];

const ASPECT_OPTIONS = [
	{ label: __('Auto (natural)', 'b-blocks'), value: 'auto' },
	{ label: __('1:1 (square)', 'b-blocks'), value: '1-1' },
	{ label: __('4:3 (landscape)', 'b-blocks'), value: '4-3' },
	{ label: __('16:9 (widescreen)', 'b-blocks'), value: '16-9' },
	{ label: __('3:4 (portrait)', 'b-blocks'), value: '3-4' },
];

const HOVER_OPTIONS = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Zoom (scale 1.05)', 'b-blocks'), value: 'zoom' },
	{ label: __('Darken overlay', 'b-blocks'), value: 'darken' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const CAPTION_POSITION_OPTIONS = [
	{ label: __('Below image', 'b-blocks'), value: 'below' },
	{ label: __('Overlay (on hover)', 'b-blocks'), value: 'overlay' },
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __('Normal (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
];

const Settings = ({ attributes, setAttributes, categoryList = [] }) => {
	const {
		items,
		categories = [],
		layout,
		columns = {},
		columnGap,
		rowGap,
		imageRadius,
		aspectRatio,
		showCaptions,
		captionPosition,
		captionColor,
		captionFontSize,
		showFilter,
		filterAllLabel,
		showAllButton,
		defaultFilter,
		filterAlign,
		filterBarGap,
		btnActiveBg,
		btnActiveColor,
		btnInactiveBg,
		btnInactiveColor,
		btnFontSize,
		btnFontWeight,
		btnPaddingV,
		btnPaddingH,
		btnBorderRadius,
		btnGap,
		hoverEffect,
		hoverDuration,
		lightbox,
		lightboxOverlayColor,
		lightboxShowCaption,
		filterTransitionDuration,
	} = attributes;

	const updateColumns = (breakpoint, value) => {
		const next = { ...(columns || {}) };
		next[breakpoint] = parseInt(value, 10) || 1;
		setAttributes({ columns: next });
	};

	const defaultFilterOptions = [
		{ label: __('All', 'b-blocks'), value: 'all' },
		...categoryList.map((cat) => ({ label: cat.label, value: cat.slug })),
	];

	const isMasonry = layout === 'masonry';

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Images', 'b-blocks')}
				initialOpen={true}
			>
				<Label>{__('Gallery images', 'b-blocks')}</Label>
				<ItemsRepeater
					value={items || []}
					onChange={(val) => setAttributes({ items: val })}
					categoryList={categoryList}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Categories', 'b-blocks')}
				initialOpen={false}
			>
				<Label>{__('Filter categories', 'b-blocks')}</Label>
				<CategoriesRepeater
					value={categories || []}
					onChange={(val) => setAttributes({ categories: val })}
				/>

				<ToggleControl
					label={__('Show filter bar', 'b-blocks')}
					checked={!!showFilter}
					onChange={(val) => setAttributes({ showFilter: !!val })}
				/>

				{showFilter && (
					<>
						<ToggleControl
							label={__('Show "All" button', 'b-blocks')}
							checked={!!showAllButton}
							onChange={(val) => setAttributes({ showAllButton: !!val })}
						/>

						<TextControl
							label={__('"All" button label', 'b-blocks')}
							value={filterAllLabel || ''}
							onChange={(val) => setAttributes({ filterAllLabel: val })}
							placeholder={__('All', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__('Default active filter', 'b-blocks')}
							value={defaultFilter || 'all'}
							options={defaultFilterOptions}
							onChange={(val) => setAttributes({ defaultFilter: val })}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__('Filter bar alignment', 'b-blocks')}
							value={filterAlign || 'center'}
							options={ALIGN_OPTIONS}
							onChange={(val) => setAttributes({ filterAlign: val })}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__('Filter bar bottom gap (px)', 'b-blocks')}
							value={parseInt(filterBarGap, 10) >= 0 ? parseInt(filterBarGap, 10) : 24}
							onChange={(val) => setAttributes({ filterBarGap: val })}
							min={0}
							max={80}
							step={4}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Layout', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Layout', 'b-blocks')}
					value={layout || 'grid'}
					options={LAYOUT_OPTIONS}
					onChange={(val) => setAttributes({ layout: val })}
					__nextHasNoMarginBottom
				/>

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
					value={parseInt(columnGap, 10) >= 0 ? parseInt(columnGap, 10) : 16}
					onChange={(val) => setAttributes({ columnGap: val })}
					min={0}
					max={80}
					step={4}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Row gap (px)', 'b-blocks')}
					value={parseInt(rowGap, 10) >= 0 ? parseInt(rowGap, 10) : 16}
					onChange={(val) => setAttributes({ rowGap: val })}
					min={0}
					max={80}
					step={4}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Image aspect ratio', 'b-blocks')}
					value={aspectRatio || 'auto'}
					options={ASPECT_OPTIONS}
					onChange={(val) => setAttributes({ aspectRatio: val })}
					help={isMasonry
						? __('Aspect ratio is ignored in masonry layout (each image keeps its natural proportions).', 'b-blocks')
						: ''
					}
					disabled={isMasonry}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Image Style', 'b-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Image border radius (px)', 'b-blocks')}
					value={parseInt(imageRadius, 10) >= 0 ? parseInt(imageRadius, 10) : 0}
					onChange={(val) => setAttributes({ imageRadius: val })}
					min={0}
					max={64}
					step={1}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Hover effect', 'b-blocks')}
					value={hoverEffect || 'zoom'}
					options={HOVER_OPTIONS}
					onChange={(val) => setAttributes({ hoverEffect: val })}
					__nextHasNoMarginBottom
				/>

				{hoverEffect !== 'none' && (
					<RangeControl
						label={__('Hover transition duration (ms)', 'b-blocks')}
						value={parseInt(hoverDuration, 10) >= 0 ? parseInt(hoverDuration, 10) : 300}
						onChange={(val) => setAttributes({ hoverDuration: val })}
						min={0}
						max={800}
						step={50}
						help={__('Reduced-motion visitors always get an instant snap.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<ToggleControl
					label={__('Show captions', 'b-blocks')}
					checked={!!showCaptions}
					onChange={(val) => setAttributes({ showCaptions: !!val })}
				/>

				{showCaptions && (
					<>
						<SelectControl
							label={__('Caption position', 'b-blocks')}
							value={captionPosition || 'below'}
							options={CAPTION_POSITION_OPTIONS}
							onChange={(val) => setAttributes({ captionPosition: val })}
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{__('Caption color:', 'b-blocks')}</Label>
							<ColorControl
								value={captionColor || ''}
								onChange={(val) => setAttributes({ captionColor: val || '' })}
								defaultColor=''
							/>
						</PanelRow>

						<RangeControl
							label={__('Caption font size (px)', 'b-blocks')}
							value={parseInt(captionFontSize, 10) >= 10 ? parseInt(captionFontSize, 10) : 14}
							onChange={(val) => setAttributes({ captionFontSize: val })}
							min={10}
							max={24}
							step={1}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Filter Button Style', 'b-blocks')}
				initialOpen={false}
			>
				<PanelRow>
					<Label className=''>{__('Active background:', 'b-blocks')}</Label>
					<ColorControl
						value={btnActiveBg || '#0d6efd'}
						onChange={(val) => setAttributes({ btnActiveBg: val || '#0d6efd' })}
						defaultColor='#0d6efd'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Active text:', 'b-blocks')}</Label>
					<ColorControl
						value={btnActiveColor || '#ffffff'}
						onChange={(val) => setAttributes({ btnActiveColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Inactive background:', 'b-blocks')}</Label>
					<ColorControl
						value={btnInactiveBg || '#f0f0f0'}
						onChange={(val) => setAttributes({ btnInactiveBg: val || '#f0f0f0' })}
						defaultColor='#f0f0f0'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Inactive text:', 'b-blocks')}</Label>
					<ColorControl
						value={btnInactiveColor || '#333333'}
						onChange={(val) => setAttributes({ btnInactiveColor: val || '#333333' })}
						defaultColor='#333333'
					/>
				</PanelRow>

				<RangeControl
					label={__('Font size (px)', 'b-blocks')}
					value={parseInt(btnFontSize, 10) >= 10 ? parseInt(btnFontSize, 10) : 14}
					onChange={(val) => setAttributes({ btnFontSize: val })}
					min={10}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Font weight', 'b-blocks')}
					value={btnFontWeight || '500'}
					options={FONT_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ btnFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Vertical padding (px)', 'b-blocks')}
					value={parseInt(btnPaddingV, 10) >= 0 ? parseInt(btnPaddingV, 10) : 8}
					onChange={(val) => setAttributes({ btnPaddingV: val })}
					min={0}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Horizontal padding (px)', 'b-blocks')}
					value={parseInt(btnPaddingH, 10) >= 0 ? parseInt(btnPaddingH, 10) : 20}
					onChange={(val) => setAttributes({ btnPaddingH: val })}
					min={0}
					max={64}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Border radius (px)', 'b-blocks')}
					value={parseInt(btnBorderRadius, 10) >= 0 ? parseInt(btnBorderRadius, 10) : 4}
					onChange={(val) => setAttributes({ btnBorderRadius: val })}
					min={0}
					max={50}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Gap between buttons (px)', 'b-blocks')}
					value={parseInt(btnGap, 10) >= 0 ? parseInt(btnGap, 10) : 8}
					onChange={(val) => setAttributes({ btnGap: val })}
					min={0}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Lightbox', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Open images in a lightbox', 'b-blocks')}
					checked={!!lightbox}
					onChange={(val) => setAttributes({ lightbox: !!val })}
				/>

				{lightbox && (
					<>
						<PanelRow>
							<Label className=''>{__('Overlay color:', 'b-blocks')}</Label>
							<ColorControl
								value={lightboxOverlayColor || 'rgba(0,0,0,0.9)'}
								onChange={(val) => setAttributes({ lightboxOverlayColor: val || 'rgba(0,0,0,0.9)' })}
								defaultColor='rgba(0,0,0,0.9)'
							/>
						</PanelRow>

						<ToggleControl
							label={__('Show caption in lightbox', 'b-blocks')}
							checked={!!lightboxShowCaption}
							onChange={(val) => setAttributes({ lightboxShowCaption: !!val })}
						/>
					</>
				)}
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Animation', 'b-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Filter transition duration (ms)', 'b-blocks')}
					value={parseInt(filterTransitionDuration, 10) >= 0 ? parseInt(filterTransitionDuration, 10) : 400}
					onChange={(val) => setAttributes({ filterTransitionDuration: val })}
					min={0}
					max={1200}
					step={100}
					help={__('Set to 0 to disable the animation. Reduced-motion visitors always get an instant snap.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
