/**
 * Code Highlight Block — frontend entry point.
 *
 * Responsibilities:
 *   1. Bundle Prism.js core + a curated language set (no CDN at runtime).
 *   2. Tokenize each `.bb-code-highlight` block in the page on DOMContentLoaded.
 *   3. Wire up the copy-to-clipboard button with success feedback.
 *   4. Apply `max-height` at runtime to avoid a flash of clipped content
 *      before the JS loads.
 *
 * Per-instance scoping is enforced with a `data-bb-ch-init` guard so that
 * a second invocation of this file (e.g. Gutenberg block previews) does
 * not double-bind handlers.
 */

import './style.scss';

// Pull in Prism core ONLY — components register themselves onto the
// global `Prism` exposed by this module. We intentionally import the
// non-minified `prism-core` here to ensure side-effects fire when bundled.
import Prism from 'prismjs/components/prism-core';

// Curated language set. Each import side-effect registers a language
// onto the `Prism` instance imported above. Order matters: dependent
// languages (e.g. typescript depends on javascript) must come AFTER
// their base language.
import 'prismjs/components/prism-markup';      // HTML / XML / SVG
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

// Disable Prism's automatic full-document scan. We do our own targeted
// highlighting on the specific code elements rendered by this block.
if (typeof window !== 'undefined') {
	window.Prism = window.Prism || Prism;
	window.Prism.manual = true;
}

const COPY_RESET_MS = 2000;

const highlightBlock = (root) => {
	const codeEl = root.querySelector('.bb-ch-code');
	if (!codeEl) {
		return;
	}

	const language = (root.getAttribute('data-bb-ch-language') || '').toLowerCase();

	// `plaintext` is intentionally a no-op for Prism. Skip tokenization but
	// still let the rest of the wiring (copy, max-height) run.
	if (language && language !== 'plaintext') {
		const grammar = Prism.languages[language];
		if (grammar) {
			// Tokenize each line's inner `.bb-ch-text` (not the whole
			// `.bb-ch-line`) so the gutter number span survives Prism's
			// innerHTML rewrite.
			const textNodes = codeEl.querySelectorAll('.bb-ch-line > .bb-ch-text');
			if (textNodes.length > 0) {
				textNodes.forEach((textEl) => {
					const raw = textEl.textContent;
					// Skip the zero-width-space placeholder rendered for empty lines.
					if (raw === '​') {
						return;
					}
					try {
						textEl.innerHTML = Prism.highlight(raw, grammar, language);
					} catch (_e) {
						// Leave plain text in place if Prism throws.
					}
				});
			} else {
				try {
					Prism.highlightElement(codeEl);
				} catch (_e) {
					// noop — fall back to unhighlighted text.
				}
			}
		}
	}
};

const applyMaxHeight = (root) => {
	const maxHeight = parseInt(root.getAttribute('data-bb-ch-max-height'), 10);
	if (!Number.isFinite(maxHeight) || maxHeight <= 0) {
		return;
	}
	const preEl = root.querySelector('.bb-ch-pre');
	if (!preEl) {
		return;
	}
	preEl.style.maxHeight = `${maxHeight}px`;
	preEl.style.overflowY = 'auto';
};

const fallbackCopy = (text) => {
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'absolute';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(ta);
		return ok;
	} catch (_e) {
		return false;
	}
};

const wireCopyButton = (root) => {
	const buttons = root.querySelectorAll('.bb-ch-copy-btn');
	if (!buttons.length) {
		return;
	}
	const codeEl = root.querySelector('.bb-ch-code');
	const liveEl = root.querySelector('.bb-ch-live');
	if (!codeEl) {
		return;
	}

	buttons.forEach((btn) => {
		const defaultLabel = btn.getAttribute('data-default-label') || 'Copy';
		const copiedLabel = btn.getAttribute('data-copied-label') || 'Copied!';
		const defaultAria = btn.getAttribute('aria-label') || 'Copy code to clipboard';
		// Use a dedicated descriptive aria-label for the "copied" state so
		// screen readers announce a meaningful message regardless of the
		// user-configured button label text (spec: "Code copied to clipboard").
		const copiedAria = 'Code copied to clipboard';
		let resetTimer = 0;

		btn.addEventListener('click', () => {
			const text = codeEl.textContent || '';
			const onSuccess = () => {
				const labelSpan = btn.querySelector('.bb-ch-copy-text');
				if (labelSpan) {
					labelSpan.textContent = copiedLabel;
				}
				btn.classList.add('is-copied');
				btn.setAttribute('aria-label', copiedAria);
				if (liveEl) {
					liveEl.textContent = copiedLabel;
				}

				if (resetTimer) {
					clearTimeout(resetTimer);
				}
				resetTimer = setTimeout(() => {
					if (labelSpan) {
						labelSpan.textContent = defaultLabel;
					}
					btn.classList.remove('is-copied');
					btn.setAttribute('aria-label', defaultAria);
					if (liveEl) {
						liveEl.textContent = '';
					}
					resetTimer = 0;
				}, COPY_RESET_MS);
			};

			if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
				navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
					if (fallbackCopy(text)) {
						onSuccess();
					}
				});
			} else if (fallbackCopy(text)) {
				onSuccess();
			}
		});
	});
};

const initBlock = (root) => {
	if (!root || root.getAttribute('data-bb-ch-init') === '1') {
		return;
	}
	root.setAttribute('data-bb-ch-init', '1');

	applyMaxHeight(root);
	highlightBlock(root);
	wireCopyButton(root);
};

const initAll = () => {
	const roots = document.querySelectorAll('.wp-block-b-blocks-code-highlight');
	roots.forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
