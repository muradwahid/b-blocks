import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	CheckboxControl,
} from '@wordpress/components';

import { Label, ColorControl } from '../../../../../../bpl-tools/Components';

const BUTTON_STYLE_OPTIONS = [
	{ label: __('Text only', 'b-blocks'), value: 'text' },
	{ label: __('Icon only', 'b-blocks'), value: 'icon' },
	{ label: __('Text + Icon', 'b-blocks'), value: 'both' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const POST_TYPE_OPTIONS = [
	{ label: __('Posts', 'b-blocks'), value: 'post' },
	{ label: __('Pages', 'b-blocks'), value: 'page' },
];

const PAD_KEYS = ['top', 'right', 'bottom', 'left'];

const Settings = ({ attributes, setAttributes }) => {
	const {
		placeholder,
		buttonLabel,
		buttonStyle,
		searchPostTypes,
		liveSearch,
		maxSuggestions,
		showPostType,
		width,
		alignment,
		inputBgColor,
		inputTextColor,
		borderColor,
		borderWidth,
		borderRadius,
		buttonBgColor,
		buttonTextColor,
		buttonBorderRadius,
		inputPadding,
		fontSize,
		dropdownBgColor,
		dropdownTextColor,
		dropdownHoverBgColor,
		noResultsText,
	} = attributes;

	const selectedTypes = Array.isArray(searchPostTypes) ? searchPostTypes : ['post', 'page'];
	const showButtonLabel = buttonStyle === 'text' || buttonStyle === 'both';

	const togglePostType = (value, checked) => {
		let next = selectedTypes.filter((t) => t !== value);
		if (checked) next = [...next, value];
		if (next.length === 0) next = [value];
		setAttributes({ searchPostTypes: next });
	};

	const updatePadding = (side, value) => {
		setAttributes({
			inputPadding: { ...(inputPadding || {}), [side]: value },
		});
	};

	const fontSizeNumber = parseInt(String(fontSize || '16px'), 10) || 16;

	return (
		<InspectorControls>
			<PanelBody className='bPlPanelBody' title={__('Search Behavior', 'b-blocks')} initialOpen={true}>
				<TextControl
					label={__('Placeholder text', 'b-blocks')}
					value={placeholder || ''}
					onChange={(val) => setAttributes({ placeholder: val })}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={__('Enable live search', 'b-blocks')}
					help={__('Show instant suggestions from the WordPress REST API as the visitor types.', 'b-blocks')}
					checked={!!liveSearch}
					onChange={(val) => setAttributes({ liveSearch: val })}
					__nextHasNoMarginBottom
				/>
				{liveSearch && (
					<>
						<Label className=''>{__('Post types to search:', 'b-blocks')}</Label>
						{POST_TYPE_OPTIONS.map((opt) => (
							<CheckboxControl
								key={opt.value}
								label={opt.label}
								checked={selectedTypes.includes(opt.value)}
								onChange={(checked) => togglePostType(opt.value, checked)}
								__nextHasNoMarginBottom
							/>
						))}
						<RangeControl
							label={__('Max suggestions', 'b-blocks')}
							value={maxSuggestions ?? 5}
							onChange={(val) => setAttributes({ maxSuggestions: val ?? 5 })}
							min={1}
							max={10}
							step={1}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Show post-type label in suggestions', 'b-blocks')}
							checked={!!showPostType}
							onChange={(val) => setAttributes({ showPostType: val })}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
				<SelectControl
					label={__('Button style', 'b-blocks')}
					value={buttonStyle || 'text'}
					options={BUTTON_STYLE_OPTIONS}
					onChange={(val) => setAttributes({ buttonStyle: val })}
					__nextHasNoMarginBottom
				/>
				{showButtonLabel && (
					<TextControl
						label={__('Button label', 'b-blocks')}
						value={buttonLabel || ''}
						onChange={(val) => setAttributes({ buttonLabel: val })}
						__nextHasNoMarginBottom
					/>
				)}
				{!showButtonLabel && (
					<TextControl
						label={__('Button accessible label', 'b-blocks')}
						help={__('Used as the icon button aria-label for screen readers.', 'b-blocks')}
						value={buttonLabel || ''}
						onChange={(val) => setAttributes({ buttonLabel: val })}
						__nextHasNoMarginBottom
					/>
				)}
				<PanelRow>
					<Label className=''>{__('Button Background:', 'b-blocks')}</Label>
					<ColorControl
						value={buttonBgColor || '#0073aa'}
						onChange={(val) => setAttributes({ buttonBgColor: val || '#0073aa' })}
						defaultColor='#0073aa'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Button Text / Icon:', 'b-blocks')}</Label>
					<ColorControl
						value={buttonTextColor || '#ffffff'}
						onChange={(val) => setAttributes({ buttonTextColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<RangeControl
					label={__('Button border radius (px)', 'b-blocks')}
					value={buttonBorderRadius ?? 4}
					onChange={(val) => setAttributes({ buttonBorderRadius: val ?? 4 })}
					min={0}
					max={50}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Input Style', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Width (CSS value, e.g. 100%, 400px)', 'b-blocks')}
					value={width || ''}
					onChange={(val) => setAttributes({ width: val })}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Alignment', 'b-blocks')}
					value={alignment || 'left'}
					options={ALIGN_OPTIONS}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>
				<PanelRow>
					<Label className=''>{__('Input Background:', 'b-blocks')}</Label>
					<ColorControl
						value={inputBgColor || '#ffffff'}
						onChange={(val) => setAttributes({ inputBgColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Input Text:', 'b-blocks')}</Label>
					<ColorControl
						value={inputTextColor || '#333333'}
						onChange={(val) => setAttributes({ inputTextColor: val || '#333333' })}
						defaultColor='#333333'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Border Color:', 'b-blocks')}</Label>
					<ColorControl
						value={borderColor || '#cccccc'}
						onChange={(val) => setAttributes({ borderColor: val || '#cccccc' })}
						defaultColor='#cccccc'
					/>
				</PanelRow>
				<RangeControl
					label={__('Border width (px)', 'b-blocks')}
					value={borderWidth ?? 1}
					onChange={(val) => setAttributes({ borderWidth: val ?? 1 })}
					min={0}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Border radius (px)', 'b-blocks')}
					value={borderRadius ?? 4}
					onChange={(val) => setAttributes({ borderRadius: val ?? 4 })}
					min={0}
					max={50}
					step={1}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Font size (px)', 'b-blocks')}
					value={fontSizeNumber}
					onChange={(val) => setAttributes({ fontSize: `${val ?? 16}px` })}
					min={12}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
				<Label className=''>{__('Input padding (CSS values):', 'b-blocks')}</Label>
				{PAD_KEYS.map((side) => (
					<TextControl
						key={side}
						label={side.charAt(0).toUpperCase() + side.slice(1)}
						value={(inputPadding && inputPadding[side]) || ''}
						onChange={(val) => updatePadding(side, val)}
						__nextHasNoMarginBottom
					/>
				))}
			</PanelBody>

			{liveSearch && (
				<PanelBody className='bPlPanelBody' title={__('Dropdown Style', 'b-blocks')} initialOpen={false}>
					<PanelRow>
						<Label className=''>{__('Dropdown Background:', 'b-blocks')}</Label>
						<ColorControl
							value={dropdownBgColor || '#ffffff'}
							onChange={(val) => setAttributes({ dropdownBgColor: val || '#ffffff' })}
							defaultColor='#ffffff'
						/>
					</PanelRow>
					<PanelRow>
						<Label className=''>{__('Suggestion Text:', 'b-blocks')}</Label>
						<ColorControl
							value={dropdownTextColor || '#333333'}
							onChange={(val) => setAttributes({ dropdownTextColor: val || '#333333' })}
							defaultColor='#333333'
						/>
					</PanelRow>
					<PanelRow>
						<Label className=''>{__('Suggestion Hover Background:', 'b-blocks')}</Label>
						<ColorControl
							value={dropdownHoverBgColor || '#f0f0f0'}
							onChange={(val) => setAttributes({ dropdownHoverBgColor: val || '#f0f0f0' })}
							defaultColor='#f0f0f0'
						/>
					</PanelRow>
					<TextControl
						label={__('No-results text', 'b-blocks')}
						value={noResultsText || ''}
						onChange={(val) => setAttributes({ noResultsText: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			)}
		</InspectorControls>
	);
};

export default Settings;
