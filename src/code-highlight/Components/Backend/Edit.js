import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const LANGUAGE_LABELS = {
	javascript: 'JavaScript',
	typescript: 'TypeScript',
	jsx: 'JSX',
	tsx: 'TSX',
	php: 'PHP',
	css: 'CSS',
	markup: 'HTML',
	bash: 'Shell',
	python: 'Python',
	json: 'JSON',
	sql: 'SQL',
	yaml: 'YAML',
	markdown: 'Markdown',
	plaintext: 'Plain Text',
};

const sanitizeCssLength = (value, fallback) => {
	const v = (value || '').toString().trim();
	if (!v) return fallback;
	if (/^-?\d+(?:\.\d+)?(px|em|rem|%)?$/.test(v)) return v;
	return fallback;
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		code,
		language,
		theme,
		showLineNumbers,
		startingLineNumber,
		showCopyButton,
		copyButtonLabel,
		showHeader,
		filename,
		fontSize,
		borderRadius,
		tabSize,
	} = attributes;

	const safeLanguage = LANGUAGE_LABELS[language] ? language : 'javascript';
	const safeTheme = theme === 'light' ? 'light' : 'dark';
	const safeFontSize = sanitizeCssLength(fontSize, '14px');
	const safeRadius = sanitizeCssLength(borderRadius, '6px');
	const safeTabSize = Math.max(1, Math.min(12, parseInt(tabSize, 10) || 2));
	const safeStartLine = Math.max(1, parseInt(startingLineNumber, 10) || 1);

	const wrapperClasses = [
		'bb-code-highlight',
		`bb-ch-theme--${safeTheme}`,
		showLineNumbers ? 'has-line-numbers' : 'no-line-numbers',
		showHeader ? 'has-header' : 'no-header',
	].join(' ');

	const wrapperStyle = {
		'--bb-ch-font-size': safeFontSize,
		'--bb-ch-radius': safeRadius,
		'--bb-ch-tab-size': safeTabSize,
		'--bb-ch-start-line': safeStartLine,
	};

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const langLabel = LANGUAGE_LABELS[safeLanguage] || safeLanguage;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				{showHeader && (
					<div className='bb-ch-header'>
						<span className='bb-ch-lang-badge'>{langLabel}</span>
						{filename && (
							<span className='bb-ch-filename'>{filename}</span>
						)}
						{showCopyButton && (
							<button
								type='button'
								className='bb-ch-copy-btn'
								disabled
								tabIndex={-1}
								aria-hidden='true'
							>
								<span className='bb-ch-copy-text'>
									{copyButtonLabel || __('Copy', 'b-blocks')}
								</span>
							</button>
						)}
					</div>
				)}

				<div className='bb-ch-body'>
					<textarea
						className='bb-ch-editor-input'
						value={code || ''}
						spellCheck={false}
						autoCorrect='off'
						autoCapitalize='off'
						wrap='off'
						placeholder={__('Paste or type your code here…', 'b-blocks')}
						aria-label={__('Code', 'b-blocks')}
						onChange={(e) => setAttributes({ code: e.target.value })}
					/>
					{/*
						Hidden hint that mirrors what the Inspector "Copied!" label
						would do at runtime. Kept here only to remind authors what
						the frontend will say. Not a real live region.
					*/}
					{!code && (
						<div className='bb-ch-editor-placeholder' aria-hidden='true'>
							{__('Your code preview will syntax-highlight on the frontend.', 'b-blocks')}
						</div>
					)}
				</div>

				{/*
					Floating copy button preview when the header is hidden, to
					match the frontend layout in the editor canvas.
				*/}
				{!showHeader && showCopyButton && (
					<button
						type='button'
						className='bb-ch-copy-btn bb-ch-copy-btn--floating'
						disabled
						tabIndex={-1}
						aria-hidden='true'
					>
						<span className='bb-ch-copy-text'>
							{copyButtonLabel || __('Copy', 'b-blocks')}
						</span>
					</button>
				)}
			</div>
		</>
	);
};

export default Edit;
