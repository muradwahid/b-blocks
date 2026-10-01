/**
 * HTML block helpers.
 *
 * The block stores raw author markup in `htmlCode` and injects it into the
 * page. Publishing markup that executes is the capability WordPress gates
 * behind `unfiltered_html`, so the frontend copy is filtered server-side in
 * render.php against the post author's capability. These two helpers apply the
 * same rule inside the editor, where render.php never runs.
 */

/** Tags that fetch or execute something of their own. */
const EXECUTABLE_TAGS = ['script', 'object', 'embed', 'link', 'meta', 'base'];

/** Attributes a browser resolves as a URL, and will follow a scheme from. */
const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'data', 'poster', 'background'];

const DANGEROUS_SCHEME = /^(?:javascript:|vbscript:|data:text\/html)/i;

/**
 * Drop spaces and control characters so `java\tscript:` reads as `javascript:`.
 *
 * Written as a character filter rather than a regex because a control-character
 * range in a literal trips eslint's `no-control-regex`. Anything at or below
 * U+0020 is stripped, which is what browsers themselves ignore in a URL.
 */
const stripBlanks = (value) => [...String(value || '')].filter((char) => char.charCodeAt(0) > 32).join('');

/**
 * Whether the current user may author markup that executes.
 *
 * Localised from PHP in includes/EnqueueScripts.php. wp_localize_script() casts
 * scalars to strings, so the value arrives as '1' or '' - read for truthiness.
 */
export const canUnfilteredHtml = () => Boolean(window?.bBlocksGlobal?.canUnfilteredHtml);

/**
 * Editor-preview copy of the markup with the executing parts removed.
 *
 * This is not a general-purpose HTML sanitizer and is not a substitute for the
 * server-side wp_kses_post() pass - it exists so the editor can still show a
 * useful preview of someone else's saved block without running it. Layout
 * markup survives; scripts, event handlers and script-bearing URLs do not.
 */
export const sanitizePreview = (html) => {
	if ('string' !== typeof html || '' === html.trim()) {
		return '';
	}

	// DOMParser builds an inert document: nothing in here loads, fires or runs
	// while we walk it, unlike assigning to innerHTML.
	const doc = new DOMParser().parseFromString(html, 'text/html');

	Array.from(doc.body.querySelectorAll('*')).forEach((element) => {
		if (EXECUTABLE_TAGS.includes(element.localName.toLowerCase())) {
			element.remove();
			return;
		}

		Array.from(element.attributes).forEach(({ name, value }) => {
			const attribute = name.toLowerCase();

			// `srcdoc` is an entire nested document, so it carries everything
			// this pass just stripped from the outer one.
			if (attribute.startsWith('on') || 'srcdoc' === attribute) {
				element.removeAttribute(name);
				return;
			}

			if (URL_ATTRIBUTES.includes(attribute) && DANGEROUS_SCHEME.test(stripBlanks(value))) {
				element.removeAttribute(name);
			}
		});
	});

	return doc.body.innerHTML;
};
