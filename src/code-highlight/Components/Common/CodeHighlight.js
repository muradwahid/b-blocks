import { useEffect, useRef, useState } from 'react';

import { codeLines, getHighlightMarks, getWrapperClasses, languages, safeLanguage } from '../../utils/options';
import { tokenise } from '../../utils/prism';

/**
 * The one source of the markup and the behaviour: Edit renders it in the editor
 * and view.js mounts the very same component on the frontend, so the preview and
 * the published output can never drift apart.
 */
const CodeHighlight = ({ attributes }) => {
	const { content = {}, options = {}, buttonIcon = {} } = attributes;
	const { code = '', filename = '', caption = '' } = content;
	const language = safeLanguage(content.language);
	const lines = codeLines(code);
	const start = parseInt(options.startLine, 10) || 1;
	const marks = getHighlightMarks(attributes);
	const inHeader = options.copyButton && 'header' === (options.copyPosition || 'header');
	const badge = languages.find(({ value }) => value === language)?.label;
	const capped = 0 < (parseInt(options.maxLines, 10) || 0);

	const codeRef = useRef(null);
	const [copied, setCopied] = useState(false);
	const [expanded, setExpanded] = useState(false);

	// Prism rewrites the element's children, so it runs after React has put the
	// text there and again whenever the text or the grammar changes.
	useEffect(() => {
		codeRef.current && tokenise(codeRef.current, language);
	}, [code, language]);

	useEffect(() => {
		if (!copied) return undefined;

		const timer = setTimeout(() => setCopied(false), 2000);

		return () => clearTimeout(timer);
	}, [copied]);

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
		} catch (error) {
			// Clipboard access needs a secure context, so fall back rather than
			// leaving the button dead on plain http.
			const area = document.createElement('textarea');

			area.value = code;
			area.setAttribute('readonly', '');
			area.style.position = 'fixed';
			area.style.opacity = '0';
			document.body.appendChild(area);
			area.select();
			document.execCommand('copy');
			document.body.removeChild(area);
		}

		setCopied(true);
	};

	const showIcon = buttonIcon.enable && buttonIcon.icon;

	const copyButton = (floating) => <button
		type='button'
		className={[
			'b-blocks-code-highlight-copy',
			floating ? 'b-blocks-code-highlight-copy-floating' : '',
			showIcon ? `b-blocks-code-highlight-has-icon b-blocks-code-highlight-icon-${'right' === buttonIcon.position ? 'right' : 'left'}` : '',
			copied ? 'is-copied' : ''
		].filter(Boolean).join(' ')}
		onClick={onCopy}
	>
		{/* IconLibrary stores the icon as markup, so it goes in as markup. */}
		{showIcon && <span className='b-blocks-code-highlight-btn-icon' aria-hidden='true' dangerouslySetInnerHTML={{ __html: buttonIcon.icon }} />}

		<span className='b-blocks-code-highlight-copy-text'>{copied ? (options.copiedLabel || 'Copied!') : (options.copyLabel || 'Copy')}</span>
	</button>;

	const captionEl = caption ? <figcaption className='b-blocks-code-highlight-caption'>{caption}</figcaption> : null;

	// The plain div is what the Advanced tab styles: bpl-tools scopes those rules
	// to `#id > div`, so the block's own root has to sit inside one. The figure
	// stays because the caption is a figcaption.
	return <div>
		<figure className={`${getWrapperClasses(attributes)}${expanded ? ' is-expanded' : ''}`}>
			{'top' === options.captionPosition && captionEl}

			{options.header && <div className='b-blocks-code-highlight-header'>
				{options.windowDots && <span className='b-blocks-code-highlight-dots' aria-hidden='true'>
					<i /><i /><i />
				</span>}

				<span className='b-blocks-code-highlight-filename'>{filename}</span>

				{options.showLanguage && 'none' !== language && <span className='b-blocks-code-highlight-badge'>{badge}</span>}

				{inHeader && copyButton(false)}
			</div>}

			<div className='b-blocks-code-highlight-body'>
				<pre className='b-blocks-code-highlight-pre' tabIndex={0}>
					{/* A layer behind the text rather than wrappers around it: Prism
					    rewrites the code element wholesale and would drop them. */}
					{0 < marks.length && <span className='b-blocks-code-highlight-marks' aria-hidden='true'>
						{marks.map((offset) => <span key={offset} style={{ '--bbChMark': offset }} />)}
					</span>}

					{/* The gutter is its own element per line, so Prism can retokenise
					    the text without touching it. */}
					{options.lineNumbers && <span className='b-blocks-code-highlight-gutter' aria-hidden='true'>
						{lines.map((one, index) => <span key={index}>{start + index}</span>)}
					</span>}

					<code ref={codeRef} className={`b-blocks-code-highlight-code language-${language}`}>{code}</code>
				</pre>

				{options.copyButton && !inHeader && copyButton(true)}
			</div>

			{capped && options.collapsible && <button
				type='button'
				className='b-blocks-code-highlight-toggle'
				onClick={() => setExpanded((was) => !was)}
				aria-expanded={expanded}
			>{expanded ? (options.collapseLabel || 'Show less') : (options.expandLabel || 'Show all')}</button>}

				{'top' !== options.captionPosition && captionEl}
			</figure>
	</div>;
};

export default CodeHighlight;
