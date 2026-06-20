import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const VIEW_STYLE_OPTIONS = [
	{ label: __('Default — accent border card', 'b-blocks'), value: 'default' },
	{ label: __('Minimal — borderless with divider', 'b-blocks'), value: 'minimal' },
	{ label: __('Card — soft shadow, rounded', 'b-blocks'), value: 'card' },
	{ label: __('Highlight — solid accent background', 'b-blocks'), value: 'highlight' },
	{ label: __('Quote Marks — big decorative quotes, centered', 'b-blocks'), value: 'quote-marks' },
	{ label: __('Tweet — social-card look', 'b-blocks'), value: 'tweet' }
];

const LAYOUT_OPTIONS = [
	{ label: __('Card (full box with accent border)', 'b-blocks'), value: 'card' },
	{ label: __('Inline (compact, no accent border)', 'b-blocks'), value: 'inline' }
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

const BUTTON_STYLE_OPTIONS = [
	{ label: __('Filled', 'b-blocks'), value: 'filled' },
	{ label: __('Outline', 'b-blocks'), value: 'outline' }
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __('400 — Normal', 'b-blocks'), value: '400' },
	{ label: __('500 — Medium', 'b-blocks'), value: '500' },
	{ label: __('600 — Semi-bold', 'b-blocks'), value: '600' },
	{ label: __('700 — Bold', 'b-blocks'), value: '700' }
];

const parsePx = (value, fallback) => {
	const m = (value || '').toString().match(/^(\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

const clampPx = (value, min, max, fallback) => {
	const num = parseInt(value, 10);
	if (Number.isNaN(num)) {
		return `${fallback}px`;
	}
	return `${Math.max(min, Math.min(max, num))}px`;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		viewStyle,
		shareText,
		citeText,
		platforms = {},
		xHandle,
		emailSubject,
		layout,
		alignment,
		showQuoteIcon,
		showButtonLabels,
		copyButtonLabel,
		copiedLabel,
		colors = {},
		buttonStyle,
		border = {},
		buttonBorderRadius,
		padding = {},
		fontSize,
		fontWeight
	} = attributes;

	const setPlatform = (key, val) => {
		setAttributes({ platforms: { ...platforms, [key]: !!val } });
	};
	const setColor = (key, val) => {
		setAttributes({ colors: { ...colors, [key]: val || '' } });
	};
	const setBorder = (key, val) => {
		setAttributes({ border: { ...border, [key]: val } });
	};
	const setPadding = (key, val) => {
		setAttributes({ padding: { ...padding, [key]: val } });
	};

	const borderWidthPx = parsePx(border.width || '4px', 4);
	const borderRadiusPx = parsePx(border.radius || '6px', 6);
	const buttonRadiusPx = parsePx(buttonBorderRadius || '4px', 4);
	const fontSizePx = parsePx(fontSize || '18px', 18);

	const showCardOnlyBorder = layout !== 'inline';
	const isFilled = buttonStyle !== 'outline';

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Style', 'b-blocks')}
				initialOpen={true}
			>
				<PanelRow>
					<Label className=''>{__('View:', 'b-blocks')}</Label>
					<SelectControl
						value={viewStyle || 'default'}
						options={VIEW_STYLE_OPTIONS}
						onChange={(val) => setAttributes({ viewStyle: val })}
					/>
				</PanelRow>
				<p style={{ margin: '8px 0 0', fontSize: 12, color: '#666' }}>
					{__('Each view has its own look and feel. Color and border controls below apply on top of the chosen style.', 'b-blocks')}
				</p>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Content', 'b-blocks')}
				initialOpen={true}
			>
				<TextareaControl
					label={__('Share Text Override', 'b-blocks')}
					value={shareText || ''}
					onChange={(val) => setAttributes({ shareText: val })}
					placeholder={__('Leave blank to use the quote text above', 'b-blocks')}
					help={__('Sent to the social network. X intent truncates around 240 characters.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Citation / Author (optional)', 'b-blocks')}
					value={citeText || ''}
					onChange={(val) => setAttributes({ citeText: val })}
					placeholder={__('— Jane Doe', 'b-blocks')}
					help={__('Shown beneath the quote inside a <cite> tag.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Share Platforms', 'b-blocks')}
				initialOpen={true}
			>
				<ToggleControl
					label={__('Share on X (Twitter)', 'b-blocks')}
					checked={!!platforms.twitter}
					onChange={(val) => setPlatform('twitter', val)}
				/>
				{platforms.twitter && (
					<TextControl
						label={__('X @username (optional)', 'b-blocks')}
						value={xHandle || ''}
						onChange={(val) => setAttributes({ xHandle: val })}
						placeholder={__('yourbrand', 'b-blocks')}
						help={__('Appended as the "via" parameter on the X share URL.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<ToggleControl
					label={__('Share on Facebook', 'b-blocks')}
					checked={!!platforms.facebook}
					onChange={(val) => setPlatform('facebook', val)}
				/>

				<ToggleControl
					label={__('Share on LinkedIn', 'b-blocks')}
					checked={!!platforms.linkedin}
					onChange={(val) => setPlatform('linkedin', val)}
				/>

				<ToggleControl
					label={__('Share on WhatsApp', 'b-blocks')}
					checked={!!platforms.whatsapp}
					onChange={(val) => setPlatform('whatsapp', val)}
				/>

				<ToggleControl
					label={__('Share by Email', 'b-blocks')}
					checked={!!platforms.email}
					onChange={(val) => setPlatform('email', val)}
				/>
				{platforms.email && (
					<TextControl
						label={__('Email Subject', 'b-blocks')}
						value={emailSubject || ''}
						onChange={(val) => setAttributes({ emailSubject: val })}
						placeholder={__("Thought you'd like this quote", 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<ToggleControl
					label={__('Copy Link button', 'b-blocks')}
					checked={!!platforms.copy}
					onChange={(val) => setPlatform('copy', val)}
					help={__('Copies the quote + page URL to the clipboard.', 'b-blocks')}
				/>
				{platforms.copy && (
					<>
						<TextControl
							label={__('Copy Button Label', 'b-blocks')}
							value={copyButtonLabel || ''}
							onChange={(val) => setAttributes({ copyButtonLabel: val })}
							placeholder={__('Copy Link', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={__('"Copied!" Label', 'b-blocks')}
							value={copiedLabel || ''}
							onChange={(val) => setAttributes({ copiedLabel: val })}
							placeholder={__('Copied!', 'b-blocks')}
							help={__('Shown for 2 seconds after a successful copy.', 'b-blocks')}
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
					value={layout || 'card'}
					options={LAYOUT_OPTIONS}
					onChange={(val) => setAttributes({ layout: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Alignment', 'b-blocks')}
					value={alignment || 'left'}
					options={ALIGN_OPTIONS}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Show Quotation-Mark Icon', 'b-blocks')}
					checked={!!showQuoteIcon}
					onChange={(val) => setAttributes({ showQuoteIcon: val })}
				/>

				<ToggleControl
					label={__('Show Button Labels', 'b-blocks')}
					checked={!!showButtonLabels}
					onChange={(val) => setAttributes({ showButtonLabels: val })}
					help={__('Off = icon-only buttons. On = icon + platform name.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Card Style', 'b-blocks')}
				initialOpen={false}
			>
				<PanelRow>
					<Label className=''>{__('Background:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.bg || '#f0f7ff'}
						onChange={(val) => setColor('bg', val)}
						defaultColor='#f0f7ff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Text:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.text || '#1a1a1a'}
						onChange={(val) => setColor('text', val)}
						defaultColor='#1a1a1a'
					/>
				</PanelRow>

				{showQuoteIcon && (
					<PanelRow>
						<Label className=''>{__('Quote Icon:', 'b-blocks')}</Label>
						<ColorControl
							value={colors.quoteIcon || '#0575e6'}
							onChange={(val) => setColor('quoteIcon', val)}
							defaultColor='#0575e6'
						/>
					</PanelRow>
				)}

				{showCardOnlyBorder && (
					<>
						<PanelRow>
							<Label className=''>{__('Accent Border:', 'b-blocks')}</Label>
							<ColorControl
								value={colors.border || '#0575e6'}
								onChange={(val) => setColor('border', val)}
								defaultColor='#0575e6'
							/>
						</PanelRow>

						<RangeControl
							label={__('Accent Border Width (px)', 'b-blocks')}
							value={borderWidthPx}
							onChange={(val) => setBorder('width', clampPx(val, 0, 12, 4))}
							min={0}
							max={12}
							step={1}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				<RangeControl
					label={__('Border Radius (px)', 'b-blocks')}
					value={borderRadiusPx}
					onChange={(val) => setBorder('radius', clampPx(val, 0, 32, 6))}
					min={0}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Font Size (px)', 'b-blocks')}
					value={fontSizePx}
					onChange={(val) => setAttributes({ fontSize: clampPx(val, 12, 32, 18) })}
					min={12}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Font Weight', 'b-blocks')}
					value={fontWeight || '600'}
					options={FONT_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ fontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Padding Top', 'b-blocks')}
					value={padding.top || '20px'}
					onChange={(val) => setPadding('top', val)}
					placeholder='20px'
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Padding Right', 'b-blocks')}
					value={padding.right || '24px'}
					onChange={(val) => setPadding('right', val)}
					placeholder='24px'
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Padding Bottom', 'b-blocks')}
					value={padding.bottom || '20px'}
					onChange={(val) => setPadding('bottom', val)}
					placeholder='20px'
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Padding Left', 'b-blocks')}
					value={padding.left || '24px'}
					onChange={(val) => setPadding('left', val)}
					placeholder='24px'
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Button Style', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Button Style', 'b-blocks')}
					value={buttonStyle || 'filled'}
					options={BUTTON_STYLE_OPTIONS}
					onChange={(val) => setAttributes({ buttonStyle: val })}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Button Color:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.buttonBg || '#0575e6'}
						onChange={(val) => setColor('buttonBg', val)}
						defaultColor='#0575e6'
					/>
				</PanelRow>

				{isFilled && (
					<PanelRow>
						<Label className=''>{__('Button Text Color:', 'b-blocks')}</Label>
						<ColorControl
							value={colors.buttonText || '#ffffff'}
							onChange={(val) => setColor('buttonText', val)}
							defaultColor='#ffffff'
						/>
					</PanelRow>
				)}

				<RangeControl
					label={__('Button Border Radius (px)', 'b-blocks')}
					value={buttonRadiusPx}
					onChange={(val) => setAttributes({ buttonBorderRadius: clampPx(val, 0, 24, 4) })}
					min={0}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
