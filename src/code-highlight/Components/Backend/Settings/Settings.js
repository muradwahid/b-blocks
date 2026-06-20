import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const LANGUAGE_OPTIONS = [
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'JSX', value: 'jsx' },
	{ label: 'TSX', value: 'tsx' },
	{ label: 'PHP', value: 'php' },
	{ label: 'CSS', value: 'css' },
	{ label: 'HTML', value: 'markup' },
	{ label: 'Shell / Bash', value: 'bash' },
	{ label: 'Python', value: 'python' },
	{ label: 'JSON', value: 'json' },
	{ label: 'SQL', value: 'sql' },
	{ label: 'YAML', value: 'yaml' },
	{ label: 'Markdown', value: 'markdown' },
	{ label: 'Plain Text', value: 'plaintext' },
];

const FONT_SIZE_OPTIONS = [
	{ label: '12px', value: '12px' },
	{ label: '13px', value: '13px' },
	{ label: '14px', value: '14px' },
	{ label: '15px', value: '15px' },
	{ label: '16px', value: '16px' },
];

const TAB_SIZE_OPTIONS = [
	{ label: __('2 spaces', 'b-blocks'), value: 2 },
	{ label: __('4 spaces', 'b-blocks'), value: 4 },
];

const THEME_OPTIONS = [
	{ label: __('Dark (One Dark)', 'b-blocks'), value: 'dark' },
	{ label: __('Light (GitHub Light)', 'b-blocks'), value: 'light' },
];

const parseRadiusToPx = (value) => {
	const m = (value || '').toString().match(/^(\d+)/);
	return m ? parseInt(m[1], 10) : 6;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		language,
		filename,
		theme,
		fontSize,
		borderRadius,
		tabSize,
		showHeader,
		showLineNumbers,
		startingLineNumber,
		showCopyButton,
		copyButtonLabel,
		copiedLabel,
		maxHeight,
	} = attributes;

	const radiusPx = parseRadiusToPx(borderRadius);
	const maxHeightNum = parseInt(maxHeight, 10) || 0;
	const startLineNum = parseInt(startingLineNumber, 10) || 1;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Language', 'b-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Language', 'b-blocks')}
					value={language || 'javascript'}
					options={LANGUAGE_OPTIONS}
					onChange={(val) => setAttributes({ language: val })}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Filename', 'b-blocks')}
					value={filename || ''}
					onChange={(val) => setAttributes({ filename: val })}
					placeholder={__('e.g. index.js', 'b-blocks')}
					help={__('Optional. Shown in the header bar when the header is visible.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Appearance', 'b-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Theme', 'b-blocks')}
					value={theme || 'dark'}
					options={THEME_OPTIONS}
					onChange={(val) => setAttributes({ theme: val })}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Font Size', 'b-blocks')}
					value={fontSize || '14px'}
					options={FONT_SIZE_OPTIONS}
					onChange={(val) => setAttributes({ fontSize: val })}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Border Radius (px)', 'b-blocks')}
					value={radiusPx}
					onChange={(val) => setAttributes({ borderRadius: `${parseInt(val, 10) || 0}px` })}
					min={0}
					max={20}
					step={1}
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={__('Tab Size', 'b-blocks')}
					value={parseInt(tabSize, 10) || 2}
					options={TAB_SIZE_OPTIONS}
					onChange={(val) => setAttributes({ tabSize: parseInt(val, 10) || 2 })}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Features', 'b-blocks')}
				initialOpen={true}
			>
				<ToggleControl
					label={__('Show header bar', 'b-blocks')}
					checked={!!showHeader}
					onChange={(val) => setAttributes({ showHeader: val })}
					help={__('Top bar with the language badge and optional filename.', 'b-blocks')}
				/>

				<ToggleControl
					label={__('Show line numbers', 'b-blocks')}
					checked={!!showLineNumbers}
					onChange={(val) => setAttributes({ showLineNumbers: val })}
				/>

				{showLineNumbers && (
					<TextControl
						label={__('Starting line number', 'b-blocks')}
						type='number'
						value={String(startLineNum)}
						onChange={(val) => {
							const next = Math.max(1, parseInt(val, 10) || 1);
							setAttributes({ startingLineNumber: next });
						}}
						min={1}
						max={99999}
						__nextHasNoMarginBottom
					/>
				)}

				<ToggleControl
					label={__('Show copy button', 'b-blocks')}
					checked={!!showCopyButton}
					onChange={(val) => setAttributes({ showCopyButton: val })}
				/>

				{showCopyButton && (
					<>
						<TextControl
							label={__('Copy button label', 'b-blocks')}
							value={copyButtonLabel || ''}
							onChange={(val) => setAttributes({ copyButtonLabel: val })}
							placeholder={__('Copy', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={__('Copied label', 'b-blocks')}
							value={copiedLabel || ''}
							onChange={(val) => setAttributes({ copiedLabel: val })}
							placeholder={__('Copied!', 'b-blocks')}
							help={__('Shown for 2 seconds after a successful copy.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				<TextControl
					label={__('Max height (px)', 'b-blocks')}
					type='number'
					value={String(maxHeightNum)}
					onChange={(val) => {
						const next = Math.max(0, Math.min(5000, parseInt(val, 10) || 0));
						setAttributes({ maxHeight: next });
					}}
					min={0}
					max={5000}
					help={__('0 = unlimited. When set, the block scrolls vertically.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
