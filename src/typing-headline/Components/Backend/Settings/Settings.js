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

import WordsRepeater from '../WordsRepeater';

const TAG_OPTIONS = [
	{ label: __('H1', 'b-blocks'), value: 'h1' },
	{ label: __('H2', 'b-blocks'), value: 'h2' },
	{ label: __('H3', 'b-blocks'), value: 'h3' },
	{ label: __('H4', 'b-blocks'), value: 'h4' },
	{ label: __('H5', 'b-blocks'), value: 'h5' },
	{ label: __('H6', 'b-blocks'), value: 'h6' },
	{ label: __('Paragraph', 'b-blocks'), value: 'p' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const WEIGHT_OPTIONS = [
	{ label: __('Light (300)', 'b-blocks'), value: '300' },
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
	{ label: __('Extra Bold (800)', 'b-blocks'), value: '800' },
	{ label: __('Black (900)', 'b-blocks'), value: '900' },
];

const parsePx = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	if (!v) return fallback;
	const m = v.match(/^(-?\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		prefix,
		suffix,
		words,
		headingTag,
		textAlign,
		typeSpeed,
		backSpeed,
		backDelay,
		startDelay,
		loop,
		showCursor,
		cursorChar,
		smartBackspace,
		fontSize = {},
		fontWeight,
		lineHeight,
		prefixColor,
		animatedColor,
		cursorColor,
		backgroundColor,
		padding = {},
	} = attributes;

	const updateResponsivePx = (attrKey, breakpoint, value) => {
		const current = attributes[attrKey] || {};
		const next = { ...current };
		next[breakpoint] = value === '' || value == null ? '' : `${value}px`;
		setAttributes({ [attrKey]: next });
	};

	const updatePadding = (side, value) => {
		const next = { ...(padding || {}) };
		next[side] = value === '' || value == null ? '0px' : `${value}px`;
		setAttributes({ padding: next });
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={textAlign}
					onChange={(val) => setAttributes({ textAlign: val || 'center' })}
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
						label={__('Prefix text', 'b-blocks')}
						value={prefix || ''}
						onChange={(val) => setAttributes({ prefix: val })}
						placeholder={__('We help you ', 'b-blocks')}
						help={__('Static text shown before the rotating word. Remember a trailing space.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Suffix text', 'b-blocks')}
						value={suffix || ''}
						onChange={(val) => setAttributes({ suffix: val })}
						placeholder={__('e.g. today.', 'b-blocks')}
						help={__('Static text shown after the rotating word. Leave blank if not needed.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<Label>{__('Rotating words', 'b-blocks')}</Label>
					<WordsRepeater
						value={words || []}
						onChange={(val) => setAttributes({ words: val })}
					/>

					<SelectControl
						label={__('Heading tag', 'b-blocks')}
						value={headingTag || 'h2'}
						options={TAG_OPTIONS}
						onChange={(val) => setAttributes({ headingTag: val })}
						help={__('Pick the heading level that matches your document outline (H1 for the page hero).', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Text alignment', 'b-blocks')}
						value={textAlign || 'center'}
						options={ALIGN_OPTIONS}
						onChange={(val) => setAttributes({ textAlign: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Typography', 'b-blocks')}
					initialOpen={false}
				>
					<Label>{__('Font size, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(fontSize?.desktop, 42)}
						onChange={(val) => updateResponsivePx('fontSize', 'desktop', val)}
						min={10}
						max={96}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Font size, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(fontSize?.tablet, 32)}
						onChange={(val) => updateResponsivePx('fontSize', 'tablet', val)}
						min={10}
						max={96}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Font size, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(fontSize?.mobile, 24)}
						onChange={(val) => updateResponsivePx('fontSize', 'mobile', val)}
						min={10}
						max={96}
						step={1}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Font weight', 'b-blocks')}
						value={fontWeight || '700'}
						options={WEIGHT_OPTIONS}
						onChange={(val) => setAttributes({ fontWeight: val })}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Line height', 'b-blocks')}
						value={lineHeight || ''}
						onChange={(val) => setAttributes({ lineHeight: val })}
						placeholder='1.2'
						help={__('Unitless number (e.g. 1.2) or any CSS length.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Colors', 'b-blocks')}
					initialOpen={false}
				>
					<PanelRow>
						<Label className=''>{__('Prefix / suffix color:', 'b-blocks')}</Label>
						<ColorControl
							value={prefixColor || ''}
							onChange={(val) => setAttributes({ prefixColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Animated word color:', 'b-blocks')}</Label>
						<ColorControl
							value={animatedColor || '#146EF5'}
							onChange={(val) => setAttributes({ animatedColor: val })}
							defaultColor='#146EF5'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Cursor color:', 'b-blocks')}</Label>
						<ColorControl
							value={cursorColor || '#146EF5'}
							onChange={(val) => setAttributes({ cursorColor: val })}
							defaultColor='#146EF5'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Background:', 'b-blocks')}</Label>
						<ColorControl
							value={backgroundColor || ''}
							onChange={(val) => setAttributes({ backgroundColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Animation', 'b-blocks')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Type speed (ms/char)', 'b-blocks')}
						value={parseInt(typeSpeed, 10) || 80}
						onChange={(val) => setAttributes({ typeSpeed: parseInt(val, 10) || 80 })}
						min={20}
						max={300}
						step={10}
						help={__('Lower = faster typing.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Backspace speed (ms/char)', 'b-blocks')}
						value={parseInt(backSpeed, 10) || 40}
						onChange={(val) => setAttributes({ backSpeed: parseInt(val, 10) || 40 })}
						min={10}
						max={200}
						step={10}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Pause after word (ms)', 'b-blocks')}
						value={parseInt(backDelay, 10) || 1500}
						onChange={(val) => setAttributes({ backDelay: parseInt(val, 10) || 1500 })}
						min={200}
						max={5000}
						step={100}
						help={__('How long to leave each word on screen before backspacing.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Start delay (ms)', 'b-blocks')}
						value={parseInt(startDelay, 10) || 0}
						onChange={(val) => setAttributes({ startDelay: parseInt(val, 10) || 0 })}
						min={0}
						max={3000}
						step={100}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Loop continuously', 'b-blocks')}
						checked={!!loop}
						onChange={(val) => setAttributes({ loop: val })}
						help={__('When off, the animation plays through the list once and stops on the last word.', 'b-blocks')}
					/>

					<ToggleControl
						label={__('Smart backspace', 'b-blocks')}
						checked={!!smartBackspace}
						onChange={(val) => setAttributes({ smartBackspace: val })}
						help={__('Only erase the part that differs between consecutive words.', 'b-blocks')}
					/>

					<ToggleControl
						label={__('Show blinking cursor', 'b-blocks')}
						checked={!!showCursor}
						onChange={(val) => setAttributes({ showCursor: val })}
					/>

					{showCursor && (
						<TextControl
							label={__('Cursor character', 'b-blocks')}
							value={cursorChar || '|'}
							onChange={(val) => setAttributes({ cursorChar: (val || '').toString().charAt(0) || '|' })}
							maxLength={1}
							help={__('Single character. Examples: |, _, ▌', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Spacing', 'b-blocks')}
					initialOpen={false}
				>
					<Label>{__('Padding top (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(padding?.top, 20)}
						onChange={(val) => updatePadding('top', val)}
						min={0}
						max={200}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding right (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(padding?.right, 0)}
						onChange={(val) => updatePadding('right', val)}
						min={0}
						max={200}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding bottom (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(padding?.bottom, 20)}
						onChange={(val) => updatePadding('bottom', val)}
						min={0}
						max={200}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding left (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(padding?.left, 0)}
						onChange={(val) => updatePadding('left', val)}
						min={0}
						max={200}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
