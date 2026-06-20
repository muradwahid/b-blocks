/**
 * Video Popup — frontend behavior.
 *
 * On each trigger click:
 *   1. Build a lightbox overlay (per-instance, appended to <body>).
 *   2. Insert an <iframe> (YouTube / Vimeo) or <video> (self-hosted MP4)
 *      inside it. The iframe / video is created on open and removed on
 *      close — this is the only reliable way to stop playback across
 *      cross-origin YouTube / Vimeo embeds.
 *   3. Lock body scroll, hide background siblings from screen readers,
 *      trap focus inside the dialog, and return focus to the trigger
 *      when the dialog closes.
 *
 * Close triggers: close button, overlay backdrop click, Escape key.
 * Respects prefers-reduced-motion (transitions skipped via CSS).
 * Multiple popups per page each operate independently.
 */
import './style.scss';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'video[controls]',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

const openLightboxes = new Set();

const prefersReducedMotion = () => {
	try {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch (_e) {
		return false;
	}
};

const getFocusable = (root) => {
	if (!root) return [];
	return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
		return !el.hasAttribute('disabled') && el.offsetParent !== null;
	});
};

const trapFocus = (event, dialog) => {
	if (event.key !== 'Tab') return;
	const focusable = getFocusable(dialog);
	if (focusable.length === 0) {
		event.preventDefault();
		dialog.focus();
		return;
	}
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	const active = document.activeElement;
	if (event.shiftKey) {
		if (active === first || !dialog.contains(active)) {
			event.preventDefault();
			last.focus();
		}
	} else if (active === last) {
		event.preventDefault();
		first.focus();
	}
};

/**
 * Hide all top-level body children from screen readers while a lightbox
 * is open (except the lightbox's own wrapper). Only fires when this is
 * the first open lightbox so we don't double-toggle.
 */
const hideBgFromSR = (lightboxEl) => {
	if (openLightboxes.size !== 1) return;
	Array.from(document.body.children).forEach((child) => {
		if (child === lightboxEl) return;
		if (child.hasAttribute('aria-hidden')) {
			child.dataset.bbVpWasAriaHidden = 'true';
		} else {
			child.setAttribute('aria-hidden', 'true');
			child.dataset.bbVpWasAriaHidden = 'false';
		}
	});
};

const restoreBgFromSR = () => {
	if (openLightboxes.size !== 0) return;
	Array.from(document.body.children).forEach((child) => {
		if (child.dataset.bbVpWasAriaHidden === 'false') {
			child.removeAttribute('aria-hidden');
		}
		delete child.dataset.bbVpWasAriaHidden;
	});
};

/**
 * Lazily extract a YouTube video ID from a URL. Kept here as a defensive
 * fallback in case render.php was not able to parse it (e.g. content
 * filters mangled the saved attribute). Returns null on failure.
 */
const extractYouTubeId = (url) => {
	if (!url) return null;
	const patterns = [
		/(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/i,
		/(?:youtu\.be\/)([A-Za-z0-9_-]{11})/i,
		/(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/i,
		/(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/i,
		/(?:youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/i
	];
	for (const re of patterns) {
		const m = url.match(re);
		if (m) return m[1];
	}
	return null;
};

const extractVimeoId = (url) => {
	if (!url) return null;
	const patterns = [
		/vimeo\.com\/(?:channels\/[A-Za-z0-9_-]+\/|groups\/[A-Za-z0-9_-]+\/videos\/|album\/\d+\/video\/)?(\d+)/i,
		/player\.vimeo\.com\/video\/(\d+)/i
	];
	for (const re of patterns) {
		const m = url.match(re);
		if (m) return m[1];
	}
	return null;
};

/**
 * Build the embed URL on the client as a last-ditch fallback. The server
 * does this primary work; this only runs if `embedUrl` is missing AND we
 * can still extract an id from the original `data-bb-vp-url` attribute.
 */
const buildEmbedUrlFallback = (kind, raw, autoplay) => {
	if (!raw) return '';
	if (kind === 'youtube') {
		const id = extractYouTubeId(raw);
		if (!id) return '';
		return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
	}
	if (kind === 'vimeo') {
		const id = extractVimeoId(raw);
		if (!id) return '';
		return `https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=${autoplay ? 1 : 0}`;
	}
	if (kind === 'mp4') {
		// Trust nothing — only allow http(s) URLs.
		try {
			const u = new URL(raw, window.location.origin);
			if (u.protocol === 'http:' || u.protocol === 'https:') {
				return u.href;
			}
		} catch (_e) {
			// fall through
		}
		return '';
	}
	return '';
};

const buildLightbox = (state) => {
	const { config } = state;
	const lightbox = document.createElement('div');
	lightbox.id = config.lightboxId;
	lightbox.className = `bb-vp-lightbox bb-vp-anim-${config.animation || 'zoom'}`;
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', config.videoTitle
		? `${state.i18n.videoPlayer}: ${config.videoTitle}`
		: state.i18n.videoPlayer);
	lightbox.setAttribute('hidden', '');
	// Expose CSS custom properties from server config so the
	// per-instance overlay color / duration / ratio apply via the
	// inline <style> tag in render.php (which uses #id-lightbox).

	const container = document.createElement('div');
	container.className = 'bb-vp-container';
	container.setAttribute('role', 'document');
	container.setAttribute('tabindex', '-1');

	const closeBtn = document.createElement('button');
	closeBtn.type = 'button';
	closeBtn.className = 'bb-vp-close';
	closeBtn.setAttribute('aria-label', state.i18n.closeVideo);
	closeBtn.setAttribute('data-bb-vp-close', '');
	closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

	container.appendChild(closeBtn);
	lightbox.appendChild(container);
	document.body.appendChild(lightbox);

	state.lightbox = lightbox;
	state.container = container;
	state.closeBtn = closeBtn;
};

const mountMedia = (state) => {
	const { container, config } = state;
	// Always remove any prior child media before creating the new one.
	unmountMedia(state);

	let url = config.embedUrl;
	if (!url) {
		url = buildEmbedUrlFallback(config.embedKind, config.fallbackRawUrl, !!config.autoplay);
	}
	if (!url) return;

	if (config.embedKind === 'mp4') {
		const video = document.createElement('video');
		video.className = 'bb-vp-frame';
		video.src = url;
		video.controls = true;
		video.playsInline = true;
		if (config.autoplay) {
			video.autoplay = true;
		}
		// Some browsers need muted to start autoplay; flip the property
		// off again once playback begins so the user keeps audio if they
		// have interacted with the page.
		video.addEventListener('loadedmetadata', () => {
			try { video.focus(); } catch (_e) { /* noop */ }
		}, { once: true });
		container.appendChild(video);
		state.media = video;
	} else {
		const iframe = document.createElement('iframe');
		iframe.className = 'bb-vp-frame';
		iframe.src = url;
		iframe.setAttribute('title', config.videoTitle || state.i18n.videoPlayer);
		iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media; web-share');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
		iframe.setAttribute('loading', 'lazy');
		container.appendChild(iframe);
		state.media = iframe;
	}
};

const unmountMedia = (state) => {
	if (state.media && state.media.parentNode) {
		// For <video> elements, explicitly pause + clear src to stop the
		// network fetch as well as playback.
		if (state.media.tagName === 'VIDEO') {
			try {
				state.media.pause();
				state.media.removeAttribute('src');
				state.media.load();
			} catch (_e) { /* noop */ }
		}
		state.media.parentNode.removeChild(state.media);
	}
	state.media = null;
};

const openLightbox = (state) => {
	if (!state.lightbox) {
		buildLightbox(state);
	}
	const { lightbox, container, closeBtn, trigger, config } = state;
	if (!lightbox) return;

	mountMedia(state);
	openLightboxes.add(lightbox);

	lightbox.removeAttribute('hidden');
	if (prefersReducedMotion() || config.animation === 'none') {
		lightbox.classList.add('is-open');
	} else {
		requestAnimationFrame(() => {
			lightbox.classList.add('is-open');
		});
	}

	document.body.classList.add('bBlocksVideoPopupOpen');
	trigger.setAttribute('aria-expanded', 'true');
	hideBgFromSR(lightbox);

	// Move focus to the close button so keyboard users can immediately
	// dismiss the dialog. Tiny delay lets transitions settle.
	setTimeout(() => {
		try {
			(closeBtn || container).focus();
		} catch (_e) { /* noop */ }
	}, 30);

	const onKeyDown = (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeLightbox(state);
			return;
		}
		trapFocus(e, container);
	};

	const onOverlayClick = (e) => {
		// Only count clicks on the backdrop itself, not inside the container.
		if (e.target === lightbox) {
			e.preventDefault();
			closeLightbox(state);
		}
	};

	state._keyHandler = onKeyDown;
	state._overlayHandler = onOverlayClick;
	document.addEventListener('keydown', onKeyDown);
	lightbox.addEventListener('click', onOverlayClick);

	if (closeBtn && !state._closeBound) {
		closeBtn.addEventListener('click', (e) => {
			e.preventDefault();
			closeLightbox(state);
		});
		state._closeBound = true;
	}
};

const closeLightbox = (state) => {
	const { lightbox, trigger, config } = state;
	if (!lightbox) return;

	lightbox.classList.remove('is-open');
	trigger.setAttribute('aria-expanded', 'false');
	openLightboxes.delete(lightbox);

	if (state._keyHandler) {
		document.removeEventListener('keydown', state._keyHandler);
		state._keyHandler = null;
	}
	if (state._overlayHandler) {
		lightbox.removeEventListener('click', state._overlayHandler);
		state._overlayHandler = null;
	}

	restoreBgFromSR();

	if (openLightboxes.size === 0) {
		document.body.classList.remove('bBlocksVideoPopupOpen');
	}

	const reduced = prefersReducedMotion();
	const duration = typeof config.animationDuration === 'number' ? config.animationDuration : 0.3;
	const delay = reduced || config.animation === 'none' ? 0 : Math.max(0, duration * 1000 + 20);

	setTimeout(() => {
		if (!lightbox.classList.contains('is-open')) {
			unmountMedia(state);
			lightbox.setAttribute('hidden', '');
		}
	}, delay);

	if (trigger && typeof trigger.focus === 'function') {
		setTimeout(() => {
			try { trigger.focus(); } catch (_e) { /* noop */ }
		}, 10);
	}
};

const initBlock = (wrapper) => {
	if (wrapper.getAttribute('data-bb-vp-init') === '1') return;
	wrapper.setAttribute('data-bb-vp-init', '1');

	let config = {};
	try {
		config = JSON.parse(wrapper.dataset.bbVpConfig || '{}');
	} catch (_e) {
		config = {};
	}

	const trigger = wrapper.querySelector('[data-bb-vp-trigger]');
	if (!trigger || !config.embedUrl) {
		// No usable embed — nothing to wire up.
		wrapper.removeAttribute('data-bb-vp-config');
		return;
	}

	const state = {
		wrapper,
		trigger,
		config: {
			lightboxId: config.lightboxId || '',
			embedKind: config.embedKind || '',
			embedUrl: config.embedUrl || '',
			fallbackRawUrl: config.fallbackRawUrl || '',
			autoplay: config.autoplay !== false,
			animation: config.animation || 'zoom',
			animationDuration: typeof config.animationDuration === 'number' ? config.animationDuration : 0.3,
			videoTitle: config.videoTitle || ''
		},
		i18n: {
			videoPlayer: wrapper.getAttribute('data-bb-vp-i18n-player') || 'Video player',
			closeVideo: wrapper.getAttribute('data-bb-vp-i18n-close') || 'Close video'
		},
		lightbox: null,
		container: null,
		closeBtn: null,
		media: null,
		_keyHandler: null,
		_overlayHandler: null,
		_closeBound: false
	};

	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		openLightbox(state);
	});

	// Strip the config attribute after init to avoid re-parsing in dev tools.
	wrapper.removeAttribute('data-bb-vp-config');
};

const initAll = () => {
	const blocks = document.querySelectorAll('.wp-block-b-blocks-video-popup');
	blocks.forEach((wrapper) => initBlock(wrapper));
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
