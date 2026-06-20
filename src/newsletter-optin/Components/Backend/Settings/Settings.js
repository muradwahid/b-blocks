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

const LAYOUT_OPTIONS = [
	{ label: __('Stacked (label above field)', 'b-blocks'), value: 'stacked' },
	{ label: __('Inline (fields in a row)', 'b-blocks'), value: 'inline' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const HEADLINE_WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
	{ label: __('Extrabold (800)', 'b-blocks'), value: '800' },
];

const BUTTON_WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		layout,
		alignment,
		showHeadline,
		showSubtext,
		showNameField,
		namePlaceholder,
		emailPlaceholder,
		buttonText,
		successMessage,
		adminEmail,
		headlineFontSize,
		headlineFontWeight,
		subtextFontSize,
		inputFontSize,
		buttonFontSize,
		buttonFontWeight,
		backgroundColor,
		headlineColor,
		subtextColor,
		inputBgColor,
		inputTextColor,
		inputBorderColor,
		buttonBgColor,
		buttonTextColor,
		buttonHoverBgColor,
		borderRadius,
		inputBorderRadius,
		paddingVertical,
		paddingHorizontal,
		fieldGap,
		maxWidth,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Layout', 'b-blocks')}
					value={layout || 'stacked'}
					options={LAYOUT_OPTIONS}
					onChange={(val) => setAttributes({ layout: val })}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Text Alignment', 'b-blocks')}
					value={alignment || 'center'}
					options={ALIGN_OPTIONS}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Max Width (px)', 'b-blocks')}
					value={maxWidth ?? 600}
					onChange={(val) => setAttributes({ maxWidth: val ?? 600 })}
					min={300}
					max={1200}
					step={10}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Padding Vertical (px)', 'b-blocks')}
					value={paddingVertical ?? 40}
					onChange={(val) => setAttributes({ paddingVertical: val ?? 40 })}
					min={0}
					max={120}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Padding Horizontal (px)', 'b-blocks')}
					value={paddingHorizontal ?? 40}
					onChange={(val) => setAttributes({ paddingHorizontal: val ?? 40 })}
					min={0}
					max={120}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Field Gap (px)', 'b-blocks')}
					value={fieldGap ?? 12}
					onChange={(val) => setAttributes({ fieldGap: val ?? 12 })}
					min={4}
					max={48}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
				<ToggleControl
					label={__('Show Headline', 'b-blocks')}
					checked={!!showHeadline}
					onChange={(val) => setAttributes({ showHeadline: val })}
					help={__('Edit the headline text directly on the block.', 'b-blocks')}
				/>
				<ToggleControl
					label={__('Show Subtext', 'b-blocks')}
					checked={!!showSubtext}
					onChange={(val) => setAttributes({ showSubtext: val })}
					help={__('Edit the subtext directly on the block.', 'b-blocks')}
				/>
				<ToggleControl
					label={__('Show Name Field', 'b-blocks')}
					checked={!!showNameField}
					onChange={(val) => setAttributes({ showNameField: val })}
				/>
				{showNameField && (
					<TextControl
						label={__('Name Field Placeholder', 'b-blocks')}
						value={namePlaceholder || ''}
						onChange={(val) => setAttributes({ namePlaceholder: val })}
						placeholder={__('Your name', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}
				<TextControl
					label={__('Email Field Placeholder', 'b-blocks')}
					value={emailPlaceholder || ''}
					onChange={(val) => setAttributes({ emailPlaceholder: val })}
					placeholder={__('Your email address', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Button Label', 'b-blocks')}
					value={buttonText || ''}
					onChange={(val) => setAttributes({ buttonText: val })}
					placeholder={__('Subscribe', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Success Message', 'b-blocks')}
					value={successMessage || ''}
					onChange={(val) => setAttributes({ successMessage: val })}
					placeholder={__('Thank you for subscribing!', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Admin Email Override', 'b-blocks')}
					type='email'
					value={adminEmail || ''}
					onChange={(val) => setAttributes({ adminEmail: val })}
					placeholder={__('Defaults to site admin email', 'b-blocks')}
					help={__('Subscriber details are emailed here. Leave blank to use the site admin email.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Typography', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Headline Font Size (px)', 'b-blocks')}
					value={headlineFontSize ?? 24}
					onChange={(val) => setAttributes({ headlineFontSize: val ?? 24 })}
					min={14}
					max={60}
					step={1}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Headline Font Weight', 'b-blocks')}
					value={headlineFontWeight || '700'}
					options={HEADLINE_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ headlineFontWeight: val })}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Subtext Font Size (px)', 'b-blocks')}
					value={subtextFontSize ?? 16}
					onChange={(val) => setAttributes({ subtextFontSize: val ?? 16 })}
					min={12}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Input Font Size (px)', 'b-blocks')}
					value={inputFontSize ?? 15}
					onChange={(val) => setAttributes({ inputFontSize: val ?? 15 })}
					min={12}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Button Font Size (px)', 'b-blocks')}
					value={buttonFontSize ?? 15}
					onChange={(val) => setAttributes({ buttonFontSize: val ?? 15 })}
					min={12}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Button Font Weight', 'b-blocks')}
					value={buttonFontWeight || '600'}
					options={BUTTON_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ buttonFontWeight: val })}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Block Background:', 'b-blocks')}</Label>
					<ColorControl
						value={backgroundColor || '#f8f9fa'}
						onChange={(val) => setAttributes({ backgroundColor: val || '#f8f9fa' })}
						defaultColor='#f8f9fa'
					/>
				</PanelRow>
				<RangeControl
					label={__('Block Border Radius (px)', 'b-blocks')}
					value={borderRadius ?? 8}
					onChange={(val) => setAttributes({ borderRadius: val ?? 8 })}
					min={0}
					max={50}
					step={1}
					__nextHasNoMarginBottom
				/>
				<PanelRow>
					<Label className=''>{__('Headline Color:', 'b-blocks')}</Label>
					<ColorControl
						value={headlineColor || '#1a1a1a'}
						onChange={(val) => setAttributes({ headlineColor: val || '#1a1a1a' })}
						defaultColor='#1a1a1a'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Subtext Color:', 'b-blocks')}</Label>
					<ColorControl
						value={subtextColor || '#555555'}
						onChange={(val) => setAttributes({ subtextColor: val || '#555555' })}
						defaultColor='#555555'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Input Background:', 'b-blocks')}</Label>
					<ColorControl
						value={inputBgColor || '#ffffff'}
						onChange={(val) => setAttributes({ inputBgColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Input Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={inputTextColor || '#333333'}
						onChange={(val) => setAttributes({ inputTextColor: val || '#333333' })}
						defaultColor='#333333'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Input Border Color:', 'b-blocks')}</Label>
					<ColorControl
						value={inputBorderColor || '#cccccc'}
						onChange={(val) => setAttributes({ inputBorderColor: val || '#cccccc' })}
						defaultColor='#cccccc'
					/>
				</PanelRow>
				<RangeControl
					label={__('Input Border Radius (px)', 'b-blocks')}
					value={inputBorderRadius ?? 6}
					onChange={(val) => setAttributes({ inputBorderRadius: val ?? 6 })}
					min={0}
					max={50}
					step={1}
					__nextHasNoMarginBottom
				/>
				<PanelRow>
					<Label className=''>{__('Button Background:', 'b-blocks')}</Label>
					<ColorControl
						value={buttonBgColor || '#0461c4'}
						onChange={(val) => setAttributes({ buttonBgColor: val || '#0461c4' })}
						defaultColor='#0461c4'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Button Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={buttonTextColor || '#ffffff'}
						onChange={(val) => setAttributes({ buttonTextColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Button Hover Background:', 'b-blocks')}</Label>
					<ColorControl
						value={buttonHoverBgColor || '#0461c4'}
						onChange={(val) => setAttributes({ buttonHoverBgColor: val || '#0461c4' })}
						defaultColor='#0461c4'
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
