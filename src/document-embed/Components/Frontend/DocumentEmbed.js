import { useEffect, useRef, useState } from 'react';
import { cloudLinks, isLocalUrl, labels, noToolbarLink } from '../../utils/common';

import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import IframeViewer from './Viewers/IframeViewer';
import PdfJsViewer from './Viewers/PdfJsViewer';
import FlipbookViewer from './Viewers/FlipbookViewer';
import DocToolbar from './DocToolbar';
import Lightbox from './Lightbox';

const officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'];

// A site the online viewers cannot reach: localhost, a private network address, or a
// development domain (.local, .test, .localhost). The host never changes, so this is worked out once.
const host = window.location.hostname;
const isPrivateSite = 'localhost' === host || '[::1]' === host || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || /\.(local|test|localhost|invalid|example)$/.test(host);

/**
 * The document viewer, shared by the editor, the frontend and the Document Library's "View" modal.
 *
 * Engines: "default" (Office Online for Office files, Google Docs Viewer for the rest), "custom"
 * (bundled PDF.js), "flipbook" and "slider" (dFlip). The last three are PDF only, and PDF.js only
 * opens files from this site. Google Drive and Box links always use their own previewer; Dropbox
 * links are turned into direct file links.
 */
const DocumentEmbed = ({ attributes, assetsUrl = '', isBackend = false }) => {
	const { blockId = '', document = {}, viewer = {}, flipbook = {}, toolbar = {}, download = {}, lightbox = {}, access = {}, security = {}, performance = {}, overlays = [], visitor = {} } = attributes;
	const { name = '', mime = '' } = document;
	// render.php checks the URL for the page; the editor shows saved content as is, so check here too.
	const url = (document.url && sanitizeURL(document.url)) || '';
	const { engine = 'default' } = viewer;
	const { showName = false, showDownload = false, showNewTab = false, showPrint = false, showCopyLink = false, downloadPosition = 'toolbar', theme = 'dark', bg = {}, color = '#ffffff' } = toolbar;
	const { label = 'Download', showIcon = false, iconPosition = 'left', behavior = 'download', filename = '', showCount = false, limitPerIp = 0, access: downloadAccess = 'everyone', deniedMessage = '' } = download;
	const { disablePopout = false, customLoader = false } = security;
	const { lazyLoad = false, gviewFallback = true } = performance;
	const { postId = 0, pageId = 0, accessDenied = false, downloadDenied = false, secure = false } = visitor;

	const rootRef = useRef(null);
	const previewRef = useRef(null);
	// In a lightbox the viewer mounts only when it opens, so lazy load has nothing to wait for (and the block's own
	// spot on the page may be far from a selector trigger).
	const [isVisible, setIsVisible] = useState(isBackend || !lazyLoad || !!lightbox.enabled);
	// Whether the viewer is on screen: always inline, only while open in a lightbox.
	const [isShown, setIsShown] = useState(!lightbox.enabled);
	const [isLoading, setIsLoading] = useState(true);
	const [gviewFailed, setGviewFailed] = useState(false);
	const [count, setCount] = useState(visitor.downloadCount || 0);
	// Learned when a download is refused: the page never carries it, as a cached page is shared.
	const [limitReached, setLimitReached] = useState(false);
	const [downloadError, setDownloadError] = useState('');
	// Secure viewing: why no viewing link came (shown in place of the viewer, not by the download button).
	const [streamError, setStreamError] = useState('');
	const [streamUrl, setStreamUrl] = useState('');
	// Fixed per page view: a new value on every render would reload the viewer each time.
	const [stamp] = useState(Date.now());
	// "Open at page N" links: #doc-<blockId>-page-5 in the address opens this viewer at page 5 and scrolls to it.
	const [linkedPage, setLinkedPage] = useState(0);
	const [linkCopied, setLinkCopied] = useState(false);

	// "Copied" shows for two seconds; the timer goes with the block.
	useEffect(() => {
		if (!linkCopied) {
			return undefined;
		}
		const timer = setTimeout(() => setLinkCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [linkCopied]);

	const { ajaxUrl = '', restUrl = '', trackNonce = '', restNonce = '' } = window.bBlocksDocumentEmbed || {};

	// Lazy load: mount the viewer once the block is near the screen.
	useEffect(() => {
		if (isVisible || !rootRef.current) {
			return undefined;
		}

		const win = rootRef.current.ownerDocument.defaultView || window;
		if (!win.IntersectionObserver) {
			setIsVisible(true);
			return undefined;
		}

		const observer = new win.IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect();
				setIsVisible(true);
			}
		}, { rootMargin: '200px' });
		observer.observe(rootRef.current);

		return () => observer.disconnect();
	}, [isVisible]);

	useEffect(() => {
		setIsLoading(true);
		setGviewFailed(false);
	}, [url, engine]);

	useEffect(() => {
		if (isBackend || '' === blockId) {
			return undefined;
		}
		const pattern = new RegExp(`^#doc-${blockId.replace(/[^\w-]/g, '')}-page-(\\d+)$`);
		const read = () => {
			const match = window.location.hash.match(pattern);
			if (match) {
				setLinkedPage(Math.max(1, parseInt(match[1], 10)));
				setIsVisible(true);
				rootRef.current?.scrollIntoView({ block: 'start' });
			}
		};
		read();
		window.addEventListener('hashchange', read);

		return () => window.removeEventListener('hashchange', read);
	}, [blockId, isBackend]);

	// Secure viewing: ask for a viewing link bound to this visitor once the viewer is needed.
	useEffect(() => {
		// Asked for once the viewer shows: a lightbox nobody opens costs no request.
		if (!secure || !isVisible || !isShown || '' !== streamUrl) {
			return;
		}

		const body = new FormData();
		body.append('action', 'bb_de_stream_token');
		body.append('nonce', trackNonce);
		body.append('postId', postId);
		body.append('blockId', blockId);
		body.append('pageId', pageId);

		let live = true;
		setStreamError('');
		fetch(ajaxUrl, { method: 'POST', body, credentials: 'same-origin' }).then((res) => res.json()).then((res) => {
			if (live) {
				res.success ? setStreamUrl(res.data.url) : setStreamError(res.data?.message || labels.documentLoadError);
			}
		}).catch(() => live && setStreamError(labels.documentLoadError));

		return () => {
			live = false;
		};
	}, [secure, isVisible, isShown, streamUrl]);

	const sourceUrl = secure ? streamUrl : url;
	const fileUrl = sourceUrl.includes('dropbox.com') ? sourceUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : sourceUrl;
	const path = fileUrl.split(/[?#]/)[0];
	const ext = secure ? 'pdf' : (path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : '');
	const box = url.match(/^https?:\/\/((?:[a-z0-9-]+\.)*box\.com)\/(?:embed\/|embed_widget\/)?s\/([a-z0-9]+)/i);
	const isDrive = cloudLinks.googleDrive.test(url);
	const isPdf = ('pdf' === ext || 'application/pdf' === mime) && !box && !isDrive;
	const isCloud = noToolbarLink(url);
	const title = name || labels.documentViewer;

	// PDF.js refuses a file from another site ("file origin does not match"), so those PDFs
	// keep the Google viewer.
	const isLocal = isLocalUrl(fileUrl);

	// Viewer controls belong to the engines whose panel shows them: Flipbook, Slider, and Custom PDF for a PDF
	// from this site (from elsewhere it falls back to the Google viewer). Anywhere else they stay saved but unused.
	const controls = isPdf && ('flipbook' === engine || 'slider' === engine || ('custom' === engine && isLocal)) ? viewer : {};
	const { fullscreen = false, fullscreenNewTab = false, onDemandRendering = false, readerMode = false, thumbnails = false, sidebarOpen = false, bypassCache = false, horizontalScroll = false, initialPage = 1, defaultZoom = '' } = controls;

	const freshUrl = bypassCache && !secure ? `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}v=${stamp}` : fileUrl;
	// Viewers that know their pages: the built-in PDF viewer (PDFs on this site) and the flipbook / slider.
	const pageable = '' !== blockId && isPdf && ('flipbook' === engine || 'slider' === engine || isLocal);
	const hasToolbar = !isCloud && (showName || showDownload || showNewTab || (showPrint && isPdf && 'custom' === engine && isLocal) || (showCopyLink && pageable));

	// The PDF.js viewer reads these query args (assets/js/pdfjs/web/custom.js).
	const pdfJsUrl = `${assetsUrl}js/pdfjs/web/viewer.html?file=${encodeURIComponent(freshUrl)}&toolbar_theme=${encodeURIComponent(theme)}`
		// The viewer uses the colours only with the Custom theme (a free site never has it).
		+ ('custom' === theme ? `&toolbar_bg_color=${encodeURIComponent(bg.color || '#343434')}&toolbar_text_color=${encodeURIComponent(color)}` : '')
		+ (fullscreen && !hasToolbar ? '&fullscreenBtn=1' : '')
		+ (onDemandRendering ? '&onDemandRender=1' : '')
		+ (fullscreenNewTab && !hasToolbar ? '&newTabBtn=1' : '')
		+ (readerMode ? '&raw=1' : '')
		+ (thumbnails ? '&side=true' : '')
		+ (thumbnails && sidebarOpen ? '&open=true' : '')
		+ (horizontalScroll ? '&hrscroll=vera' : '')
		+ ('' !== defaultZoom ? `&z=${encodeURIComponent(defaultZoom)}` : '')
		+ (1 < (linkedPage || initialPage) ? `#page=${linkedPage || initialPage}` : '');

	const loaded = () => setIsLoading(false);
	const popoutBlocker = disablePopout && <div className='b-blocks-document-embed-popout-blocker' />;
	const fallbackLink = '' !== fileUrl && !secure && <a href={fileUrl} target='_blank' rel='noopener noreferrer'>{labels.openDocument}</a>;

	let preview;
	// A message instead of a viewer: nothing is loading, so the loader stays hidden.
	let settled = false;
	if (secure && '' === streamUrl) {
		settled = '' !== streamError;
		preview = settled ? <div className='b-blocks-document-embed-unavailable' role='alert'><p>{streamError}</p></div> : null;
	} else if (gviewFailed) {
		settled = true;
		preview = <div className='b-blocks-document-embed-unavailable'>
			<p>{labels.previewUnavailable}</p>
			{fallbackLink}
		</div>;
	} else if (box) {
		preview = <IframeViewer src={`https://${box[1]}/embed/s/${box[2]}?showParentPath=false&showItemFeedActions=false`} title={title} onLoad={loaded}>{popoutBlocker}</IframeViewer>;
	} else if (isDrive) {
		// Drive files end in /view, Docs, Sheets and Slides in /edit (which Google will not frame): both become /preview.
		preview = <IframeViewer src={url.replace(/\/(view|edit)([?#].*)?$/, '/preview')} title={title} onLoad={loaded}>{popoutBlocker}</IframeViewer>;
	} else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
		preview = <img className='b-blocks-document-embed-image' src={fileUrl} alt={name} onLoad={loaded} />;
	} else if (['mp4', 'webm', 'ogg'].includes(ext)) {
		preview = <video className='b-blocks-document-embed-video' src={fileUrl} controls onLoadedData={loaded} />;
	} else if (isPdf && ('flipbook' === engine || 'slider' === engine)) {
		preview = <FlipbookViewer src={freshUrl} engine={engine} viewer={linkedPage ? { ...controls, initialPage: linkedPage } : controls} flipbook={flipbook} assetsUrl={assetsUrl} fallback={fallbackLink} onLoad={loaded} />;
	} else if (isPdf && isLocal && ('custom' === engine || 'default' === engine)) {
		// A PDF from this site: the built-in viewer draws it in the visitor's browser. Google's
		// viewer would have to fetch it from the internet, which fails on a local or private site.
		// "Remember last page" (Custom PDF): the page a visitor last read, kept in their browser. A page link wins.
		const rememberKey = 'custom' === engine && controls.rememberPage && !isBackend && !linkedPage && '' !== blockId ? `bb-de-page-${pageId || postId}-${blockId}` : '';
		preview = <PdfJsViewer src={pdfJsUrl} file={freshUrl} title={title} overlays={'custom' === engine ? overlays : []} fallback={fallbackLink} onLoad={loaded} onRetry={secure ? () => setStreamUrl('') : undefined} rememberKey={rememberKey} />;
	} else if (isLocal && isPrivateSite) {
		// Word, Excel, PowerPoint and the rest only render in Google's or Microsoft's viewer, which
		// cannot reach a site that is not on the public internet.
		settled = true;
		preview = <div className='b-blocks-document-embed-unavailable'>
			<p>{labels.privateSite}</p>
			{fallbackLink}
		</div>;
	} else {
		const frameUrl = officeExts.includes(ext) ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}` : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;

		preview = <IframeViewer src={frameUrl} title={title} onLoad={loaded} onError={gviewFallback ? () => setGviewFailed(true) : undefined}>{popoutBlocker}</IframeViewer>;
	}

	// Downloads go through the server when a rule needs it (limit, access, count, secure viewing).
	const isGated = 0 < limitPerIp || 'everyone' !== downloadAccess || secure;
	const isTracked = !isBackend && (isGated || showCount) && '' !== blockId;

	const onDownload = (e) => {
		if (isBackend) {
			e.preventDefault(); // Never navigate away from the editor.
			return;
		}
		if (!isTracked) {
			return;
		}

		const body = new FormData();
		body.append('action', 'bb_de_track_download');
		body.append('nonce', trackNonce);
		body.append('postId', postId);
		body.append('blockId', blockId);
		body.append('pageId', pageId);

		// Only counting: let the browser download the file and just record it.
		if (!isGated) {
			fetch(ajaxUrl, { method: 'POST', body, credentials: 'same-origin', keepalive: true }).then((res) => res.json()).then((res) => res.success && setCount(res.data.count)).catch(() => { });
			return;
		}

		e.preventDefault();
		setDownloadError('');

		// Opened now, inside the click, so the popup blocker allows it.
		const tab = 'newtab' === behavior ? window.open('about:blank', '_blank') : null;

		fetch(ajaxUrl, { method: 'POST', body, credentials: 'same-origin' }).then((res) => res.json()).then((res) => {
			if (res.success) {
				setCount(res.data.count);
				setLimitReached(!!res.data.limit_reached);

				const link = `${restUrl}document-download/${postId}/${blockId}?token=${encodeURIComponent(res.data.nonce)}&page=${pageId}${restNonce ? `&_wpnonce=${encodeURIComponent(restNonce)}` : ''}`;

				tab ? (tab.location.href = link) : (window.location.href = link);
				return;
			}

			tab?.close();

			if (res.data?.limit_reached) {
				setLimitReached(true);
				return;
			}

			setDownloadError(res.data?.message || labels.downloadFailed);
		}).catch(() => {
			tab?.close();
			setDownloadError(labels.downloadFailed);
		});
	};

	// A file on another site ignores the download attribute and would replace this page.
	const opensTab = 'newtab' === behavior || (!isLocal && !isGated);

	const downloadIcon = <svg className='b-blocks-document-embed-download-icon' xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
		<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
		<path d='m7 10 5 5 5-5M12 15V3' />
	</svg>;

	// The Download control: refused (limit, access), unavailable (a rule the server cannot check without the block
	// id: no download rather than an unchecked one), or the link with its count and error.
	let downloadEl = false;
	if (!showDownload) {
		// Turned off.
	} else if (limitReached) {
		downloadEl = <button type='button' className='b-blocks-document-embed-download is-limit' disabled title={labels.limitTitle}>{labels.limitReached}</button>;
	} else if (downloadDenied) {
		downloadEl = '' !== deniedMessage && <span className='b-blocks-document-embed-denied-msg' dangerouslySetInnerHTML={{ __html: deniedMessage }} />;
	} else if (isGated && '' === blockId && !isBackend) {
		downloadEl = <button type='button' className='b-blocks-document-embed-download' disabled>{labels.downloadUnavailable}</button>;
	} else {
		downloadEl = <>
			<a
				className='b-blocks-document-embed-download'
				href={secure ? '#' : fileUrl}
				download={opensTab ? undefined : (filename || true)}
				target={opensTab ? '_blank' : undefined}
				rel={opensTab ? 'noopener noreferrer' : undefined}
				onClick={onDownload}
			>
				{showIcon && 'right' !== iconPosition && downloadIcon}
				<span>{label}</span>
				{showIcon && 'right' === iconPosition && downloadIcon}
			</a>

			{showCount && <span className='b-blocks-document-embed-count'>{(labels.downloadCount?.[1 === count ? 'one' : 'other'] || '').replace('%d', count)}</span>}

			{'' !== downloadError && <span className='b-blocks-document-embed-download-error' role='alert'>{downloadError}</span>}
		</>;
	}

	const icon = (paths) => <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>{paths}</svg>;

	const newTabEl = showNewTab && '' !== fileUrl && <a
		className='b-blocks-document-embed-fullscreen'
		href={isBackend ? undefined : fileUrl}
		target='_blank'
		rel='noopener noreferrer'
		aria-label={labels.openNewTab}
		title={labels.openNewTab}
	>
		{icon(<><path d='M15 3h6v6' /><path d='M10 14 21 3' /><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' /></>)}
	</a>;

	// Printing reaches into the viewer, so only the built-in PDF viewer (same site) can do it.
	const printEl = showPrint && isPdf && 'custom' === engine && isLocal && <button
		type='button'
		className='b-blocks-document-embed-fullscreen'
		aria-label={labels.print}
		title={labels.print}
		onClick={() => {
			try {
				previewRef.current?.querySelector('iframe')?.contentWindow?.PDFViewerApplication?.triggerPrinting?.();
			} catch (e) {
				// Viewer not reachable (editor canvas).
			}
		}}
	>
		{icon(<><path d='M6 9V2h12v7' /><path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' /><path d='M6 14h12v8H6z' /></>)}
	</button>;

	// Copies a link that opens this document at the page being read (#doc-<blockId>-page-N, read on load).
	const copyLinkEl = showCopyLink && pageable && <button
		type='button'
		className='b-blocks-document-embed-fullscreen'
		aria-label={linkCopied ? labels.linkCopied : labels.copyPageLink}
		title={linkCopied ? labels.linkCopied : labels.copyPageLink}
		onClick={() => {
			if (isBackend) {
				return;
			}
			let current = 1;
			try {
				const frameWin = previewRef.current?.querySelector('iframe')?.contentWindow;
				const book = previewRef.current?.querySelector('.b-blocks-document-embed-flipbook');
				current = frameWin?.PDFViewerApplication?.page || (book && book.ownerDocument.defaultView.jQuery?.(book).data('df-app')?.currentPageNumber) || 1;
			} catch (e) {
				// Viewer not reachable: link to the first page.
			}
			const link = `${window.location.href.split('#')[0]}#doc-${blockId}-page-${current}`;
			// No clipboard on a page served over plain http: the visitor copies the link by hand.
			(window.navigator.clipboard ? window.navigator.clipboard.writeText(link) : Promise.reject()).then(() => setLinkCopied(true)).catch(() => window.prompt(labels.copyThisLink, link));
		}}
	>
		{linkCopied ? icon(<polyline points='20 6 9 17 4 12' />) : icon(<><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' /><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' /></>)}
		<span className='screen-reader-text' role='status'>{linkCopied ? labels.linkCopied : ''}</span>
	</button>;

	// One toolbar button: full screen in place, or the viewer in a new tab.
	const fullscreenEl = isPdf && 'custom' === engine && isLocal && (fullscreen || fullscreenNewTab) && <button
		type='button'
		className='b-blocks-document-embed-fullscreen'
		aria-label={fullscreenNewTab ? labels.openViewerNewTab : labels.fullScreen}
		title={fullscreenNewTab ? labels.openViewerNewTab : labels.fullScreen}
		onClick={() => {
			if (fullscreenNewTab) {
				window.open(pdfJsUrl, '_blank', 'noopener');
			} else if (previewRef.current?.ownerDocument.fullscreenElement) {
				previewRef.current.ownerDocument.exitFullscreen();
			} else {
				previewRef.current?.requestFullscreen?.();
			}
		}}
	>
		{icon(<><polyline points='15 3 21 3 21 9' /><polyline points='9 21 3 21 3 15' /><line x1='21' y1='3' x2='14' y2='10' /><line x1='3' y1='21' x2='10' y2='14' /></>)}
	</button>;

	const toolbarEl = hasToolbar && <DocToolbar name={name} showName={showName} theme={theme}>
		{downloadEl}
		{newTabEl}
		{printEl}
		{copyLinkEl}
		{fullscreenEl}
	</DocToolbar>;

	const frame = <div ref={previewRef} className='b-blocks-document-embed-preview'>
		{customLoader && isLoading && !settled && <div className='b-blocks-document-embed-loader' role='status' aria-label={labels.loadingDocument} />}

		{isVisible && preview}
	</div>;

	if (accessDenied) {
		return <div className='b-blocks-document-embed is-denied'>
			<div className='b-blocks-document-embed-denied' dangerouslySetInnerHTML={{ __html: access.message || '' }} />
		</div>;
	}

	return <div ref={rootRef} className={`b-blocks-document-embed${lightbox.enabled ? ' is-lightbox' : ''}`}>
		{lightbox.enabled ?
			<Lightbox lightbox={lightbox} name={name} isBackend={isBackend} onOpenChange={setIsShown}>
				{'below' !== downloadPosition && toolbarEl}
				{frame}
				{'below' === downloadPosition && toolbarEl}
			</Lightbox> :
			<>
				{'below' !== downloadPosition && toolbarEl}
				{frame}
				{'below' === downloadPosition && toolbarEl}
			</>}
	</div>;
};
export default DocumentEmbed;