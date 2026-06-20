/**
 * PDF Embed — frontend behavior.
 *
 * The PDF viewer and the download link are rendered entirely server-side as
 * static HTML and are fully functional with JavaScript disabled. This script is
 * a progressive enhancement only: when the editor enabled "Prevent indexing"
 * (`data-bb-pe-noindex`), it attempts to inject a `noindex,nofollow` robots
 * meta into the embedded frame's document so search engines do not index the
 * confidential PDF directly. Cross-origin frames block `contentDocument`
 * access, so the attempt is wrapped in a guarded try/catch and silently skipped
 * when it is not permitted.
 *
 * No `innerHTML` writes are performed — only `appendChild` of a created
 * element. Initialization is deferred to `DOMContentLoaded` and guarded against
 * double-init with a `data-bb-pe-init` flag.
 */
import './style.scss';

const initPdfEmbed = (wrapper) => {
	if (wrapper.getAttribute('data-bb-pe-init') === '1') {
		return;
	}
	wrapper.setAttribute('data-bb-pe-init', '1');

	if (wrapper.getAttribute('data-bb-pe-noindex') !== '1') {
		return;
	}

	const frame = wrapper.querySelector('.bb-pe-frame');
	if (!frame) {
		return;
	}

	const applyNoindex = () => {
		try {
			const doc = frame.contentDocument;
			if (!doc || !doc.head) {
				return;
			}
			if (doc.head.querySelector('meta[name="robots"][data-bb-pe="1"]')) {
				return;
			}
			const meta = doc.createElement('meta');
			meta.setAttribute('name', 'robots');
			meta.setAttribute('content', 'noindex,nofollow');
			meta.setAttribute('data-bb-pe', '1');
			doc.head.appendChild(meta);
		} catch (e) {
			// Cross-origin frame — access denied. Nothing to do.
		}
	};

	frame.addEventListener('load', applyNoindex);
	applyNoindex();
};

const ready = () => {
	const wrappers = document.querySelectorAll('.bb-pe');
	wrappers.forEach(initPdfEmbed);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}
