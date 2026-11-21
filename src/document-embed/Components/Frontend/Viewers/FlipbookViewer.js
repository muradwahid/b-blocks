import { useEffect, useRef, useState } from 'react';
import { labels } from '../../../utils/common';

/**
 * PDF as a dFlip page-turning book ("flipbook") or a one-page-at-a-time slider ("slider").
 *
 * dFlip is a jQuery plugin. It is driven through the window that owns the container — in the
 * editor that is the canvas iframe — so its DOM, styles and events all live in one document.
 * render.php enqueues it on the frontend; anywhere it is missing (the editor) it is added to
 * that document on first use instead of on every editor load.
 */
const FlipbookViewer = ({ src, engine = 'flipbook', viewer = {}, flipbook = {}, assetsUrl = '', fallback = null, onLoad = () => { } }) => {
	const ref = useRef(null);
	const [failed, setFailed] = useState(false);
	// The book gave up: the message replaces it, so the block's loader stops too.
	useEffect(() => {
		failed && onLoad();
	}, [failed]);

	const { fullscreen = false, fullscreenNewTab = false, onDemandRendering = false, readerMode = false, thumbnails = false, sidebarOpen = false, initialPage = 1 } = viewer;
	const { mobileSoft = true, hardCover = false, sound = true, autoPlay = false, autoPlayDuration = 3000, speed = 800, edgeColor = '#ffffff' } = flipbook;
	// Values the server would not accept fall back the same way here (DocumentEmbedHandler::settings()).
	const style = ['3d', 'soft', 'flat'].includes(flipbook.style ?? '3d') ? (flipbook.style ?? '3d') : '';
	const pageMode = ['auto', 'single', 'double'].includes(flipbook.pageMode) ? flipbook.pageMode : 'auto';

	useEffect(() => {
		const el = ref.current;
		const doc = el?.ownerDocument;
		const win = doc?.defaultView;

		if (!el || !win || !src) {
			return undefined;
		}

		if ('function' !== typeof win.jQuery?.fn?.flipBook && assetsUrl && !doc.getElementById('b-blocks-dflip-css')) {
			// The stylesheet goes in first, at once: a second book on the page then waits for this load.
			const add = (tag, props) => doc.head.appendChild(Object.assign(doc.createElement(tag), props));
			const loadDflip = () => add('script', { id: 'b-blocks-dflip-js', src: `${assetsUrl}js/dflip/js/dflip.min.js` });

			win.dFlipLocation = `${assetsUrl}js/dflip/`;
			add('link', { id: 'b-blocks-dflip-css', rel: 'stylesheet', href: `${assetsUrl}js/dflip/css/dflip.min.css` });
			win.jQuery || !window.bBlocksGlobal?.jqueryUrl ? loadDflip() : (add('script', { id: 'b-blocks-dflip-jquery', src: window.bBlocksGlobal.jqueryUrl }).onload = loadDflip);
		}

		let book = null;
		let poll = null;
		let start = null;
		let tries = 0;
		setFailed(false);

		const init = () => {
			if ('function' !== typeof win.jQuery?.fn?.flipBook) {
				// dFlip loads in the footer, or is still loading. After 15 s it is not coming.
				100 > ++tries ? (poll = setTimeout(init, 150)) : setFailed(true);
				return;
			}

			const options = {
				viewerType: 'slider' === engine ? 'slider' : 'flipbook',
				showDownloadControl: false,
				// dFlip's own download link would skip the download limit and access rules.
				// The full screen button also carries "open in a new tab", so either setting shows it.
				hideControls: ['download', !thumbnails && 'thumbnail', !fullscreen && !fullscreenNewTab && 'fullScreen'].filter(Boolean).join(','),
				openPage: initialPage,
				backgroundColor: 'transparent',
				height: '100%',
				controlsPosition: readerMode ? 'hidden' : 'bottom',
				autoOpenThumbnail: thumbnails && sidebarOpen,
				instantTextureProcess: !onDemandRendering,
				// The same limits the server applies to the published page (DocumentEmbedHandler::settings()).
				duration: Math.min(3000, Math.max(200, Number(speed) || 800)),
				autoPlay,
				autoPlayStart: autoPlay,
				autoPlayDuration: Math.max(1000, Number(autoPlayDuration) || 3000)
			};

			if ('flipbook' === engine) {
				options.enableSound = sound;
				options.pageMode = pageMode;
				options.flipbookHardPages = hardCover ? 'cover' : 'none';
				if (edgeColor) {
					options.color3DSheets = edgeColor;
				}

				// Page-turn style. 3D needs WebGL; phones get soft when asked; reduced motion gets flat.
				// A book with no style keeps dFlip's own default.
				if ('' !== style) {
					const isMobile = true === win.DFLIP?.utils?.isMobile || win.matchMedia('(pointer: coarse) and (max-width: 767px)').matches;
					let turn = style;

					if ('3d' === turn && (false === win.DFLIP?.utils?.hasWebgl || (mobileSoft && isMobile))) {
						turn = 'soft';
					}
					if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
						turn = 'flat';
					}

					options.is3D = '3d' === turn;
					if ('flat' === turn) {
						options.flipbookHardPages = 'all';
					}
				}
			}

			if (fullscreenNewTab) {
				options.onCreateUI = (app) => {
					app.ui?.controls?.fullScreen?.off('click').on('click', (e) => {
						e.preventDefault();
						win.open(src, '_blank', 'noopener');
					});
				};
			}

			try {
				book = win.jQuery(el).flipBook(src, options);
				win.dispatchEvent(new win.Event('resize'));
				onLoad();
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Document Embed: dFlip could not start.', error);
				setFailed(true);
			}
		};

		// dFlip is heavy: start it once the book is near the screen (at once in a browser that cannot tell).
		// Settings changed in the editor restart the book: wait until they settle.
		const observer = win.IntersectionObserver && new win.IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect();
				start = setTimeout(init, 300);
			}
		}, { rootMargin: '200px' });
		observer ? observer.observe(el) : (start = setTimeout(init, 300));

		return () => {
			observer?.disconnect();
			clearTimeout(poll);
			clearTimeout(start);

			try {
				// dFlip leaves its WebGL context to garbage collection; the editor re-creates the
				// book on every setting change and would hit the browser's live-context limit.
				book?.viewer?.stage?.renderer?.forceContextLoss?.();
				book?.dispose?.();
			} catch (error) {
				// Already gone.
			}

			el.innerHTML = '';
		};
	}, [src, engine, fullscreen, fullscreenNewTab, onDemandRendering, readerMode, thumbnails, sidebarOpen, initialPage, style, mobileSoft, hardCover, sound, autoPlay, autoPlayDuration, pageMode, speed, edgeColor]);

	return <div className='b-blocks-document-embed-frame'>
		{failed && <div className='b-blocks-document-embed-unavailable' role='alert'>
			<p>{labels.flipbookFailed}</p>
			{fallback}
		</div>}

		<div ref={ref} className='b-blocks-document-embed-flipbook' hidden={failed} />
	</div>;
};
export default FlipbookViewer;
