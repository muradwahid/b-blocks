import { useEffect, useRef, useState } from 'react';
import { labels } from '../../../utils/common';

import { sanitizeURL } from '../../../../../../bpl-tools/utils/common';

const overlayCSS = `
.b-blocks-document-embed-overlay{position:absolute;z-index:5;box-sizing:border-box;overflow:auto;font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.b-blocks-document-embed-overlay.is-note{padding:6px 8px;background:#fff8c5;border:1px solid rgba(0,0,0,.15);box-shadow:0 2px 6px rgba(0,0,0,.15);color:#1f2937;white-space:pre-wrap}
.b-blocks-document-embed-overlay.is-highlight{background:#ffeb3b;opacity:.35;pointer-events:none}
.b-blocks-document-embed-overlay.is-link{outline:2px dashed transparent;outline-offset:-2px}
.b-blocks-document-embed-overlay.is-link:hover,.b-blocks-document-embed-overlay.is-link:focus-visible{outline-color:#146ef5;background:rgba(20,110,245,.08)}
.b-blocks-document-embed-overlay.is-cta:focus-visible{outline:2px solid #146ef5;outline-offset:2px}
.b-blocks-document-embed-overlay.is-cta{display:flex;align-items:center;justify-content:center;padding:4px 8px;background:#0f766e;border-radius:6px;color:#fff;font-weight:600;text-align:center;text-decoration:none}
`;

/**
 * The bundled PDF.js viewer (assets/js/pdfjs), loaded by URL in an iframe from this site, so
 * the block can reach into it: overlays are drawn on each page as PDF.js renders it.
 */
const PdfJsViewer = ({ src, file, title = '', overlays = [], fallback = null, onLoad = () => { }, onRetry, rememberKey = '' }) => {
	const iframeRef = useRef(null);
	const overlaysRef = useRef(overlays);
	overlaysRef.current = overlays;

	const [error, setError] = useState('');
	// The error card replaces the viewer before it loads: the block's loader stops too.
	useEffect(() => {
		'' !== error && onLoad();
	}, [error]);
	const [attempt, setAttempt] = useState(0);
	// Settings typed in the editor change the URL on every keystroke: load the viewer once they settle.
	const [frameSrc, setFrameSrc] = useState(src);

	useEffect(() => {
		const timer = setTimeout(() => setFrameSrc(src), 500);

		return () => clearTimeout(timer);
	}, [src]);

	// Puts this page's overlays on a rendered PDF.js page (and clears the old ones).
	const paint = (pageDiv) => {
		const doc = pageDiv.ownerDocument;
		const page = Number(pageDiv.dataset.pageNumber);

		pageDiv.querySelectorAll('.b-blocks-document-embed-overlay').forEach((el) => el.remove());

		// Positions are for the upright page; on a rotated page they would point at the wrong spot.
		if (0 !== (doc.defaultView.PDFViewerApplication?.pdfViewer?.pagesRotation || 0) % 360) {
			return;
		}

		overlaysRef.current.filter((overlay) => Number(overlay.page) === page).forEach(({ type = 'note', x = 0, y = 0, w = 10, h = 10, url = '', content = '', color = '', bg = {} }) => {
			const href = 'link' === type || 'cta' === type ? sanitizeURL(url || '') : null;
			const el = doc.createElement(href ? 'a' : 'div');

			el.className = `b-blocks-document-embed-overlay is-${type}`;
			el.style.left = `${x}%`;
			el.style.top = `${y}%`;
			el.style.width = `${w}%`;
			el.style.height = `${h}%`;
			if ('link' === type && color) {
				el.style.outlineColor = color;
			}
			if ('link' !== type && ('gradient' === bg.type ? bg.gradient : bg.color)) {
				el.style.background = 'gradient' === bg.type ? bg.gradient : bg.color;
			}
			// Plain text only: overlay text never becomes markup.
			el.textContent = 'note' === type || 'cta' === type ? content : '';

			if (href) {
				el.href = href;
				el.target = '_blank';
				el.rel = 'noopener noreferrer';
				'link' === type && el.setAttribute('aria-label', content || href);
			}

			pageDiv.appendChild(el);
		});
	};

	// Inside the editor canvas the browser treats the viewer as another origin: overlays then
	// only show on the published page.
	const repaint = () => {
		try {
			iframeRef.current?.contentDocument?.querySelectorAll('.page[data-page-number]').forEach(paint);
		} catch (e) {
			// Viewer not reachable.
		}
	};

	// Overlays edited in the editor show up without reloading the viewer.
	useEffect(repaint, [JSON.stringify(overlays)]);

	useEffect(() => {
		setError('');
		// An answer for a file the viewer has since left is dropped.
		let live = true;

		// Checked before PDF.js tries it (only this site's files: another host would need CORS). PDF.js 4
		// does not report a failed load to this page, so this is also how an expired secure-viewing
		// link reaches the Retry screen; the stream route answers HEAD without spending the link.
		try {
			if (new URL(file, window.location.href).origin === window.location.origin) {
				fetch(file, { method: 'HEAD', cache: 'no-cache', credentials: 'same-origin' }).then((res) => {
					if (!live) {
						return;
					}
					if (!res.ok) {
						setError(labels.pdfNotFound);
					} else if ('0' === res.headers.get('Content-Length')) {
						setError(labels.pdfEmpty);
					}
				}).catch(() => { });
			}
		} catch (e) {
			// Not a valid URL; PDF.js reports it.
		}

		// The viewer reports its own load errors; only listen to this block's iframe.
		const onMessage = (event) => {
			if ('PDFP_ERROR' === event.data?.type && event.source === iframeRef.current?.contentWindow) {
				setError(event.data.message || labels.pdfError);
			}
		};
		window.addEventListener('message', onMessage);

		return () => {
			live = false;
			window.removeEventListener('message', onMessage);
		};
	}, [frameSrc, attempt]);

	const onFrameLoad = () => {
		onLoad();

		let doc = null;
		let app = null;
		try {
			doc = iframeRef.current?.contentDocument;
			app = iframeRef.current?.contentWindow?.PDFViewerApplication;
		} catch (e) {
			return; // Viewer not reachable (editor canvas).
		}

		if (!app || !doc || doc.getElementById('b-blocks-document-embed-overlay-css')) {
			return;
		}

		const style = doc.createElement('style');
		style.id = 'b-blocks-document-embed-overlay-css';
		style.textContent = overlayCSS;
		doc.head.appendChild(style);

		app.initializedPromise?.then(() => {
			app.eventBus.on('pagerendered', ({ source }) => source?.div && paint(source.div));
			repaint();

			// "Remember last page": back to the page this visitor last read, saved in their browser only.
			if (rememberKey) {
				app.eventBus.on('pagesinit', () => {
					try {
						const saved = parseInt(window.localStorage.getItem(rememberKey), 10);
						if (1 < saved && saved <= app.pagesCount) {
							app.page = saved;
						}
					} catch (e) {
						// Storage blocked: start at the first page.
					}
				});
				app.eventBus.on('pagechanging', ({ pageNumber }) => {
					try {
						window.localStorage.setItem(rememberKey, String(pageNumber));
					} catch (e) {
						// Storage blocked or full: nothing to remember.
					}
				});
			}
		});
	};

	if (error) {
		return <div className='b-blocks-document-embed-error' role='alert'>
			<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
				<circle cx='12' cy='12' r='10' />
				<line x1='12' y1='8' x2='12' y2='12' />
				<line x1='12' y1='16' x2='12.01' y2='16' />
			</svg>

			<p>{error}</p>

			<button type='button' onClick={() => {
				onRetry?.(); // Secure viewing: the old link may have expired.
				setAttempt(attempt + 1);
			}}>{labels.retry}</button>

			{fallback}
		</div>;
	}

	return <div className='b-blocks-document-embed-frame'>
		<iframe key={attempt} ref={iframeRef} src={frameSrc} title={title} onLoad={onFrameLoad} allow='fullscreen' allowFullScreen />
	</div>;
};
export default PdfJsViewer;
