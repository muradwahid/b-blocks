import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
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

const TYPE_OPTIONS = [
	{ label: __('Coupon Code (click to copy)', 'b-blocks'), value: 'coupon' },
	{ label: __('Deal (link only, no code)', 'b-blocks'), value: 'deal' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const parsePx = (value, fallback) => {
	const m = (value || '').toString().match(/^(\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		couponCode,
		couponType,
		title,
		discountLabel,
		buttonLabel,
		copiedLabel,
		dealButtonLabel,
		affiliateUrl,
		openInNewTab,
		showNofollow,
		revealMode,
		revealButtonLabel,
		expiryText,
		alignment,
		colors = {},
		border = {},
		padding = {},
		codeFontSize,
	} = attributes;

	const isCoupon = couponType !== 'deal';

	const setColor = (key, val) => {
		setAttributes({ colors: { ...colors, [key]: val || '' } });
	};
	const setBorder = (key, val) => {
		setAttributes({ border: { ...border, [key]: val } });
	};
	const setPadding = (key, val) => {
		setAttributes({ padding: { ...padding, [key]: val } });
	};

	const borderWidthPx = parsePx(border.width || '1px', 1);
	const borderRadiusPx = parsePx(border.radius || '8px', 8);
	const codeFontSizePx = parsePx(codeFontSize || '20px', 20);

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Content', 'b-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Coupon Type', 'b-blocks')}
					value={isCoupon ? 'coupon' : 'deal'}
					options={TYPE_OPTIONS}
					onChange={(val) => setAttributes({ couponType: val })}
					help={__('Coupon shows a copyable code. Deal shows a CTA button only.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Title', 'b-blocks')}
					value={title || ''}
					onChange={(val) => setAttributes({ title: val })}
					placeholder={__('Special Offer', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Discount Label', 'b-blocks')}
					value={discountLabel || ''}
					onChange={(val) => setAttributes({ discountLabel: val })}
					placeholder={__('20% OFF', 'b-blocks')}
					help={__('Shown as a colored badge above the code.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				{isCoupon && (
					<>
						<TextControl
							label={__('Coupon Code', 'b-blocks')}
							value={couponCode || ''}
							onChange={(val) => setAttributes({ couponCode: val })}
							placeholder={__('SAVE20', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={__('Copy Button Label', 'b-blocks')}
							value={buttonLabel || ''}
							onChange={(val) => setAttributes({ buttonLabel: val })}
							placeholder={__('Copy Code', 'b-blocks')}
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

				{!isCoupon && (
					<TextControl
						label={__('Deal Button Label', 'b-blocks')}
						value={dealButtonLabel || ''}
						onChange={(val) => setAttributes({ dealButtonLabel: val })}
						placeholder={__('Get This Deal', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<TextControl
					label={__('Affiliate URL', 'b-blocks')}
					type='url'
					value={affiliateUrl || ''}
					onChange={(val) => setAttributes({ affiliateUrl: val })}
					placeholder='https://example.com/?ref=you'
					help={isCoupon
						? __('Opened in a new tab after the code is copied.', 'b-blocks')
						: __('The Deal CTA links here.', 'b-blocks')
					}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Open in New Tab', 'b-blocks')}
					checked={!!openInNewTab}
					onChange={(val) => setAttributes({ openInNewTab: val })}
				/>

				<ToggleControl
					label={__('Add Nofollow / Sponsored', 'b-blocks')}
					checked={!!showNofollow}
					onChange={(val) => setAttributes({ showNofollow: val })}
					help={__('Recommended for affiliate links per Google guidance.', 'b-blocks')}
				/>

				<TextControl
					label={__('Expiry Text', 'b-blocks')}
					value={expiryText || ''}
					onChange={(val) => setAttributes({ expiryText: val })}
					placeholder={__('Expires Dec 31', 'b-blocks')}
					help={__('Optional. Free-text reminder of when the offer ends.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				{isCoupon && (
					<>
						<ToggleControl
							label={__('Reveal Mode (blur code until clicked)', 'b-blocks')}
							checked={!!revealMode}
							onChange={(val) => setAttributes({ revealMode: val })}
							help={__('Hides the code behind a Reveal button to encourage clicks.', 'b-blocks')}
						/>

						{revealMode && (
							<TextControl
								label={__('Reveal Button Label', 'b-blocks')}
								value={revealButtonLabel || ''}
								onChange={(val) => setAttributes({ revealButtonLabel: val })}
								placeholder={__('Reveal Code', 'b-blocks')}
								__nextHasNoMarginBottom
							/>
						)}
					</>
				)}
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

			<PanelBody
				className='bPlPanelBody'
				title={__('Colors', 'b-blocks')}
				initialOpen={false}
			>
				<PanelRow>
					<Label className=''>{__('Card Background:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.bg || '#f9f9f9'}
						onChange={(val) => setColor('bg', val)}
						defaultColor='#f9f9f9'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Card Text:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.text || '#333333'}
						onChange={(val) => setColor('text', val)}
						defaultColor='#333333'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Discount Badge BG:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.discountBg || '#0073aa'}
						onChange={(val) => setColor('discountBg', val)}
						defaultColor='#0073aa'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Discount Badge Text:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.discountText || '#ffffff'}
						onChange={(val) => setColor('discountText', val)}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				{isCoupon && (
					<>
						<PanelRow>
							<Label className=''>{__('Code Box BG:', 'b-blocks')}</Label>
							<ColorControl
								value={colors.codeBg || '#ffffff'}
								onChange={(val) => setColor('codeBg', val)}
								defaultColor='#ffffff'
							/>
						</PanelRow>

						<PanelRow>
							<Label className=''>{__('Code Box Text:', 'b-blocks')}</Label>
							<ColorControl
								value={colors.codeText || '#333333'}
								onChange={(val) => setColor('codeText', val)}
								defaultColor='#333333'
							/>
						</PanelRow>
					</>
				)}

				<PanelRow>
					<Label className=''>{__('Button BG:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.buttonBg || '#0073aa'}
						onChange={(val) => setColor('buttonBg', val)}
						defaultColor='#0073aa'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Button Text:', 'b-blocks')}</Label>
					<ColorControl
						value={colors.buttonText || '#ffffff'}
						onChange={(val) => setColor('buttonText', val)}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Border Color:', 'b-blocks')}</Label>
					<ColorControl
						value={border.color || '#dddddd'}
						onChange={(val) => setBorder('color', val || '#dddddd')}
						defaultColor='#dddddd'
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Border & Spacing', 'b-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Border Width (px)', 'b-blocks')}
					value={borderWidthPx}
					onChange={(val) => setBorder('width', `${Math.max(0, Math.min(6, parseInt(val, 10) || 0))}px`)}
					min={0}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Border Radius (px)', 'b-blocks')}
					value={borderRadiusPx}
					onChange={(val) => setBorder('radius', `${Math.max(0, Math.min(32, parseInt(val, 10) || 0))}px`)}
					min={0}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				{isCoupon && (
					<RangeControl
						label={__('Code Font Size (px)', 'b-blocks')}
						value={codeFontSizePx}
						onChange={(val) => setAttributes({ codeFontSize: `${Math.max(12, Math.min(32, parseInt(val, 10) || 20))}px` })}
						min={12}
						max={32}
						step={1}
						__nextHasNoMarginBottom
					/>
				)}

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
		</InspectorControls>
	);
};

export default Settings;
