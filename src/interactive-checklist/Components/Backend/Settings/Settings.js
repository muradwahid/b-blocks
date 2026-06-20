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

const HEADING_TAG_OPTIONS = [
	{ label: __('H2', 'b-blocks'), value: 'h2' },
	{ label: __('H3', 'b-blocks'), value: 'h3' },
	{ label: __('H4', 'b-blocks'), value: 'h4' },
];

const CHECKBOX_STYLE_OPTIONS = [
	{ label: __('Square', 'b-blocks'), value: 'square' },
	{ label: __('Round', 'b-blocks'), value: 'round' },
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

const Settings = ({ attributes, setAttributes }) => {
	const {
		headingText,
		headingTag,
		items,
		showProgress,
		showReset,
		checkboxStyle,
		accentColor,
		cardBg,
		textColor,
		strikeChecked,
		headingFontSize,
		headingFontWeight,
		itemFontSize,
		itemFontWeight,
		progressFontSize,
		checkboxSize,
		itemGap,
		paddingVertical,
		paddingHorizontal,
		borderRadius,
		borderColor,
		borderWidth,
		maxWidth,
		alignment,
	} = attributes;

	const clampedMaxWidth = parseInt(maxWidth, 10) >= 0 ? parseInt(maxWidth, 10) : 0;

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: ['left', 'center', 'right'].includes(val) ? val : 'left' })}
					alignmentControls={[
						{ icon: 'editor-alignleft', title: __('Align left', 'b-blocks'), align: 'left' },
						{ icon: 'editor-aligncenter', title: __('Align center', 'b-blocks'), align: 'center' },
						{ icon: 'editor-alignright', title: __('Align right', 'b-blocks'), align: 'right' },
					]}
				/>
			</BlockControls>

			<InspectorControls>
				<HelpPanel slug={pluginSlug} />

				<PanelBody
					className='bPlPanelBody'
					title={__('Content', 'b-blocks')}
					initialOpen={true}
				>
					<TextControl
						label={__('Heading text', 'b-blocks')}
						value={headingText || ''}
						onChange={(val) => setAttributes({ headingText: val })}
						placeholder={__('Your Checklist', 'b-blocks')}
						help={__('Leave empty to hide the heading.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Heading tag', 'b-blocks')}
						value={headingTag || 'h3'}
						options={HEADING_TAG_OPTIONS}
						onChange={(val) => setAttributes({ headingTag: val })}
						help={__('Pick a level that fits the surrounding document outline.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show progress line', 'b-blocks')}
						checked={showProgress !== false}
						onChange={(val) => setAttributes({ showProgress: val })}
						help={__('Displays a live "N of M complete" indicator and a progress bar.', 'b-blocks')}
					/>

					<ToggleControl
						label={__('Show reset button', 'b-blocks')}
						checked={showReset !== false}
						onChange={(val) => setAttributes({ showReset: val })}
						help={__('Lets visitors clear their saved progress.', 'b-blocks')}
					/>

					<Label>{__('Checklist items', 'b-blocks')}</Label>
					<ItemsRepeater
						value={items || []}
						onChange={(val) => setAttributes({ items: val })}
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Style', 'b-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Checkbox style', 'b-blocks')}
						value={checkboxStyle || 'square'}
						options={CHECKBOX_STYLE_OPTIONS}
						onChange={(val) => setAttributes({ checkboxStyle: val })}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Checkbox size (px)', 'b-blocks')}
						value={parseInt(checkboxSize, 10) || 20}
						onChange={(val) => setAttributes({ checkboxSize: val })}
						min={14}
						max={32}
						step={1}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Accent color:', 'b-blocks')}</Label>
						<ColorControl
							value={accentColor || '#4f46e5'}
							onChange={(val) => setAttributes({ accentColor: val })}
							defaultColor='#4f46e5'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Card background:', 'b-blocks')}</Label>
						<ColorControl
							value={cardBg || '#ffffff'}
							onChange={(val) => setAttributes({ cardBg: val })}
							defaultColor='#ffffff'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Text color:', 'b-blocks')}</Label>
						<ColorControl
							value={textColor || '#1a1a1a'}
							onChange={(val) => setAttributes({ textColor: val })}
							defaultColor='#1a1a1a'
						/>
					</PanelRow>

					<ToggleControl
						label={__('Strike checked items', 'b-blocks')}
						checked={strikeChecked !== false}
						onChange={(val) => setAttributes({ strikeChecked: val })}
						help={__('Adds a line-through and dims items once checked.', 'b-blocks')}
					/>

					<RangeControl
						label={__('Gap between items (px)', 'b-blocks')}
						value={parseInt(itemGap, 10) >= 0 ? parseInt(itemGap, 10) : 12}
						onChange={(val) => setAttributes({ itemGap: val })}
						min={4}
						max={40}
						step={1}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Item font size (px)', 'b-blocks')}
						value={parseInt(itemFontSize, 10) || 16}
						onChange={(val) => setAttributes({ itemFontSize: val })}
						min={12}
						max={28}
						step={1}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Item weight', 'b-blocks')}
						value={itemFontWeight || '400'}
						options={WEIGHT_OPTIONS}
						onChange={(val) => setAttributes({ itemFontWeight: val })}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Heading font size (px)', 'b-blocks')}
						value={parseInt(headingFontSize, 10) || 20}
						onChange={(val) => setAttributes({ headingFontSize: val })}
						min={14}
						max={36}
						step={1}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Heading weight', 'b-blocks')}
						value={headingFontWeight || '700'}
						options={WEIGHT_OPTIONS}
						onChange={(val) => setAttributes({ headingFontWeight: val })}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Progress font size (px)', 'b-blocks')}
						value={parseInt(progressFontSize, 10) || 13}
						onChange={(val) => setAttributes({ progressFontSize: val })}
						min={11}
						max={18}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Card', 'b-blocks')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Padding vertical (px)', 'b-blocks')}
						value={parseInt(paddingVertical, 10) >= 0 ? parseInt(paddingVertical, 10) : 24}
						onChange={(val) => setAttributes({ paddingVertical: val })}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding horizontal (px)', 'b-blocks')}
						value={parseInt(paddingHorizontal, 10) >= 0 ? parseInt(paddingHorizontal, 10) : 28}
						onChange={(val) => setAttributes({ paddingHorizontal: val })}
						min={0}
						max={80}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Border radius (px)', 'b-blocks')}
						value={parseInt(borderRadius, 10) >= 0 ? parseInt(borderRadius, 10) : 12}
						onChange={(val) => setAttributes({ borderRadius: val })}
						min={0}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Border width (px)', 'b-blocks')}
						value={parseInt(borderWidth, 10) >= 0 ? parseInt(borderWidth, 10) : 1}
						onChange={(val) => setAttributes({ borderWidth: val })}
						min={0}
						max={8}
						step={1}
						help={__('0 = no border.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
					<PanelRow>
						<Label className=''>{__('Border color:', 'b-blocks')}</Label>
						<ColorControl
							value={borderColor || '#e5e7eb'}
							onChange={(val) => setAttributes({ borderColor: val || '' })}
							defaultColor='#e5e7eb'
						/>
					</PanelRow>
					<RangeControl
						label={__('Max width (px, 0 = full width)', 'b-blocks')}
						value={clampedMaxWidth}
						onChange={(val) => setAttributes({ maxWidth: val })}
						min={0}
						max={1200}
						step={10}
						help={clampedMaxWidth === 0 ? __('Full width', 'b-blocks') : undefined}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Alignment', 'b-blocks')}
						value={alignment || 'left'}
						options={ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ alignment: val })}
						help={__('Applies when a max width is set.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
