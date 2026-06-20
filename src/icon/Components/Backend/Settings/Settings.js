import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const SHAPE_OPTIONS = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Square', 'b-blocks'), value: 'square' },
	{ label: __('Rounded', 'b-blocks'), value: 'rounded' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const ROTATE_OPTIONS = [
	{ label: '0°', value: 0 },
	{ label: '45°', value: 45 },
	{ label: '90°', value: 90 },
	{ label: '135°', value: 135 },
	{ label: '180°', value: 180 },
];

const SHADOW_OPTIONS = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Small', 'b-blocks'), value: 'small' },
	{ label: __('Medium', 'b-blocks'), value: 'medium' },
	{ label: __('Large', 'b-blocks'), value: 'large' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		iconClass,
		iconSize,
		iconColor,
		iconBgColor,
		bgShape,
		bgSize,
		bgPadding,
		borderColor,
		borderWidth,
		borderRadius,
		linkUrl,
		linkNewTab,
		ariaLabel,
		alignment,
		maxWidth,
		hoverColor,
		hoverBgColor,
		rotate,
		shadow,
	} = attributes;

	const hasBg = ['circle', 'square', 'rounded'].includes(bgShape);
	const previewIcon = (iconClass || '').toString().trim() || 'fa-solid fa-star';
	const isLinked = !!(linkUrl || '').toString().trim();
	const linkNeedsLabel = isLinked && !(ariaLabel || '').toString().trim();

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'center' })}
				/>
			</BlockControls>

			<InspectorControls>
				<HelpPanel slug={pluginSlug} />

				<PanelBody
					className='bPlPanelBody'
					title={__('Icon', 'b-blocks')}
					initialOpen={true}
				>
					<TextControl
						label={__('Icon Class (Font Awesome)', 'b-blocks')}
						value={iconClass || ''}
						onChange={(val) => setAttributes({ iconClass: val })}
						placeholder='fa-solid fa-star'
						help={__('Example: fa-solid fa-rocket. Free Font Awesome 6 classes only.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<Label>{__('Preview', 'b-blocks')}</Label>
					<div className='bb-icon-picker-preview' aria-hidden='true'>
						<i className={previewIcon} />
					</div>

					<RangeControl
						label={__('Icon size (px)', 'b-blocks')}
						value={parseInt(iconSize, 10) >= 0 ? parseInt(iconSize, 10) : 48}
						onChange={(val) => setAttributes({ iconSize: val })}
						min={12}
						max={200}
						step={1}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Rotate', 'b-blocks')}
						value={rotate || 0}
						options={ROTATE_OPTIONS}
						onChange={(val) => setAttributes({ rotate: parseInt(val, 10) })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Link', 'b-blocks')}
					initialOpen={false}
				>
					<TextControl
						label={__('Link URL', 'b-blocks')}
						value={linkUrl || ''}
						onChange={(val) => setAttributes({ linkUrl: val })}
						placeholder='https://'
						help={__('Leave blank to render a non-linked decorative icon.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{isLinked && (
						<>
							<ToggleControl
								label={__('Open in new tab', 'b-blocks')}
								checked={!!linkNewTab}
								onChange={(val) => setAttributes({ linkNewTab: val })}
							/>

							<TextControl
								label={__('Screen reader label for link', 'b-blocks')}
								value={ariaLabel || ''}
								onChange={(val) => setAttributes({ ariaLabel: val })}
								help={__('Leave blank to mark icon as decorative (aria-hidden).', 'b-blocks')}
								__nextHasNoMarginBottom
							/>

							{linkNeedsLabel && (
								<Notice status='warning' isDismissible={false}>
									{__('Link has no accessible label — add a Screen reader label so assistive tech can announce it.', 'b-blocks')}
								</Notice>
							)}
						</>
					)}
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Style', 'b-blocks')}
					initialOpen={false}
				>
					<PanelRow>
						<Label className=''>{__('Icon color:', 'b-blocks')}</Label>
						<ColorControl
							value={iconColor || ''}
							onChange={(val) => setAttributes({ iconColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Hover icon color:', 'b-blocks')}</Label>
						<ColorControl
							value={hoverColor || ''}
							onChange={(val) => setAttributes({ hoverColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<SelectControl
						label={__('Background shape', 'b-blocks')}
						value={bgShape || 'none'}
						options={SHAPE_OPTIONS}
						onChange={(val) => setAttributes({ bgShape: val })}
						help={__('None keeps the icon inline; the others wrap it in a background badge.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{hasBg && (
						<>
							<RangeControl
								label={__('Background size (px)', 'b-blocks')}
								value={parseInt(bgSize, 10) >= 0 ? parseInt(bgSize, 10) : 80}
								onChange={(val) => setAttributes({ bgSize: val })}
								min={24}
								max={300}
								step={1}
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__('Inner padding (px)', 'b-blocks')}
								value={parseInt(bgPadding, 10) >= 0 ? parseInt(bgPadding, 10) : 16}
								onChange={(val) => setAttributes({ bgPadding: val })}
								min={0}
								max={80}
								step={1}
								__nextHasNoMarginBottom
							/>

							<PanelRow>
								<Label className=''>{__('Background color:', 'b-blocks')}</Label>
								<ColorControl
									value={iconBgColor || ''}
									onChange={(val) => setAttributes({ iconBgColor: val || '' })}
									defaultColor=''
								/>
							</PanelRow>

							<PanelRow>
								<Label className=''>{__('Hover background color:', 'b-blocks')}</Label>
								<ColorControl
									value={hoverBgColor || ''}
									onChange={(val) => setAttributes({ hoverBgColor: val || '' })}
									defaultColor=''
								/>
							</PanelRow>

							<PanelRow>
								<Label className=''>{__('Border color:', 'b-blocks')}</Label>
								<ColorControl
									value={borderColor || ''}
									onChange={(val) => setAttributes({ borderColor: val || '' })}
									defaultColor=''
								/>
							</PanelRow>

							<RangeControl
								label={__('Border width (px)', 'b-blocks')}
								value={parseInt(borderWidth, 10) >= 0 ? parseInt(borderWidth, 10) : 0}
								onChange={(val) => setAttributes({ borderWidth: val })}
								min={0}
								max={8}
								step={1}
								__nextHasNoMarginBottom
							/>

							{bgShape === 'rounded' && (
								<RangeControl
									label={__('Border radius (%)', 'b-blocks')}
									value={parseInt(borderRadius, 10) >= 0 ? parseInt(borderRadius, 10) : 50}
									onChange={(val) => setAttributes({ borderRadius: val })}
									min={0}
									max={50}
									step={1}
									__nextHasNoMarginBottom
								/>
							)}
						</>
					)}

					<SelectControl
						label={__('Shadow', 'b-blocks')}
						value={shadow || 'none'}
						options={SHADOW_OPTIONS}
						onChange={(val) => setAttributes({ shadow: val })}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Max width (px)', 'b-blocks')}
						value={parseInt(maxWidth, 10) >= 0 ? parseInt(maxWidth, 10) : 0}
						onChange={(val) => setAttributes({ maxWidth: val })}
						min={0}
						max={500}
						step={1}
						help={__('0 = full width.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Layout', 'b-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Alignment', 'b-blocks')}
						value={alignment || 'center'}
						options={ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ alignment: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
