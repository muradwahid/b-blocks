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

const LIST_STYLE_OPTIONS = [
	{ label: __('Checkmark icons', 'b-blocks'), value: 'check' },
	{ label: __('Numbered (1 2 3 …)', 'b-blocks'), value: 'numbered' },
	{ label: __('Plain bullet', 'b-blocks'), value: 'bullet' },
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
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		headingText,
		headingTag,
		listStyle,
		items,
		iconClass,
		iconColor,
		accentColor,
		cardBg,
		textColor,
		headingColor,
		borderRadius,
		borderColor,
		borderWidth,
		itemFontSize,
		itemFontWeight,
		headingFontSize,
		headingFontWeight,
		iconSize,
		paddingVertical,
		paddingHorizontal,
		itemGap,
		alignment,
		maxWidth,
		showIcon,
	} = attributes;

	const clampedMaxWidth = parseInt(maxWidth, 10) >= 0 ? parseInt(maxWidth, 10) : 0;

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val === 'center' ? 'center' : 'left' })}
					alignmentControls={[
						{ icon: 'editor-alignleft', title: __('Align left', 'b-blocks'), align: 'left' },
						{ icon: 'editor-aligncenter', title: __('Align center', 'b-blocks'), align: 'center' },
					]}
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
						label={__('Item alignment', 'b-blocks')}
						value={alignment || 'left'}
						options={ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ alignment: val })}
						__nextHasNoMarginBottom
					/>

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
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Content', 'b-blocks')}
					initialOpen={true}
				>
					<TextControl
						label={__('Heading text', 'b-blocks')}
						value={headingText || ''}
						onChange={(val) => setAttributes({ headingText: val })}
						placeholder={__('Key Takeaways', 'b-blocks')}
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

					<SelectControl
						label={__('List style', 'b-blocks')}
						value={listStyle || 'check'}
						options={LIST_STYLE_OPTIONS}
						onChange={(val) => setAttributes({ listStyle: val })}
						help={__('Checkmark and bullet render a <ul>; numbered renders a semantic <ol>.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show icon / number prefix', 'b-blocks')}
						checked={showIcon !== false}
						onChange={(val) => setAttributes({ showIcon: val })}
					/>

					{showIcon !== false && (listStyle || 'check') === 'check' && (
						<TextControl
							label={__('Check icon class (Font Awesome)', 'b-blocks')}
							value={iconClass || ''}
							onChange={(val) => setAttributes({ iconClass: val })}
							placeholder='fas fa-check-circle'
							help={__('Example: fas fa-check-circle', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<Label>{__('Takeaway items', 'b-blocks')}</Label>
					<ItemsRepeater
						value={items || []}
						onChange={(val) => setAttributes({ items: val })}
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Colors', 'b-blocks')}
					initialOpen={false}
				>
					<PanelRow>
						<Label className=''>{__('Accent (heading bar):', 'b-blocks')}</Label>
						<ColorControl
							value={accentColor || '#0d6efd'}
							onChange={(val) => setAttributes({ accentColor: val })}
							defaultColor='#0d6efd'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Heading text color:', 'b-blocks')}</Label>
						<ColorControl
							value={headingColor || '#ffffff'}
							onChange={(val) => setAttributes({ headingColor: val })}
							defaultColor='#ffffff'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Card background:', 'b-blocks')}</Label>
						<ColorControl
							value={cardBg || '#f0f6ff'}
							onChange={(val) => setAttributes({ cardBg: val })}
							defaultColor='#f0f6ff'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Item text color:', 'b-blocks')}</Label>
						<ColorControl
							value={textColor || '#1e293b'}
							onChange={(val) => setAttributes({ textColor: val })}
							defaultColor='#1e293b'
						/>
					</PanelRow>

					{showIcon !== false && (
						<PanelRow>
							<Label className=''>{__('Icon / number color:', 'b-blocks')}</Label>
							<ColorControl
								value={iconColor || '#ffffff'}
								onChange={(val) => setAttributes({ iconColor: val })}
								defaultColor='#ffffff'
							/>
						</PanelRow>
					)}

					<PanelRow>
						<Label className=''>{__('Border color:', 'b-blocks')}</Label>
						<ColorControl
							value={borderColor || ''}
							onChange={(val) => setAttributes({ borderColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Typography', 'b-blocks')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Heading font size (px)', 'b-blocks')}
						value={parseInt(headingFontSize, 10) || 18}
						onChange={(val) => setAttributes({ headingFontSize: val })}
						min={12}
						max={32}
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
					{showIcon !== false && (
						<RangeControl
							label={__('Icon / number size (px)', 'b-blocks')}
							value={parseInt(iconSize, 10) || 18}
							onChange={(val) => setAttributes({ iconSize: val })}
							min={10}
							max={32}
							step={1}
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Spacing & Border', 'b-blocks')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Border radius (px)', 'b-blocks')}
						value={parseInt(borderRadius, 10) >= 0 ? parseInt(borderRadius, 10) : 8}
						onChange={(val) => setAttributes({ borderRadius: val })}
						min={0}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Border width (px)', 'b-blocks')}
						value={parseInt(borderWidth, 10) >= 0 ? parseInt(borderWidth, 10) : 0}
						onChange={(val) => setAttributes({ borderWidth: val })}
						min={0}
						max={8}
						step={1}
						help={__('0 = no border. Set a border color above to make it visible.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding vertical (px)', 'b-blocks')}
						value={parseInt(paddingVertical, 10) >= 0 ? parseInt(paddingVertical, 10) : 20}
						onChange={(val) => setAttributes({ paddingVertical: val })}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding horizontal (px)', 'b-blocks')}
						value={parseInt(paddingHorizontal, 10) >= 0 ? parseInt(paddingHorizontal, 10) : 24}
						onChange={(val) => setAttributes({ paddingHorizontal: val })}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Gap between items (px)', 'b-blocks')}
						value={parseInt(itemGap, 10) >= 0 ? parseInt(itemGap, 10) : 10}
						onChange={(val) => setAttributes({ itemGap: val })}
						min={0}
						max={40}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
