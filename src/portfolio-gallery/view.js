/**
 * Portfolio Gallery Block — frontend view script.
 *
 * Hydrates each .bb-pg-wrapper with two behaviors:
 *
 *   1. Filter bar  → clicking a category button toggles an `.is-hidden`
 *      class on items whose `data-bb-pg-category` doesn't match. Items
 *      with an empty category match every filter.
 *
 *   2. Lightbox    → clicking an item link prevents default, opens a
 *      native <dialog> via `.showModal()` (built-in focus trap + Escape
 *      to close), and wires Prev/Next/ArrowLeft/ArrowRight to step
 *      through the currently visible items.
 *
 * Per-instance init via a `data-bb-pg-init="0" → "1"` guard so multiple
 * galleries on a page never bind to each other and a pattern that
 * inserts the block twice never double-binds.
 *
 * `prefers-reduced-motion: reduce` collapses the filter fade and the
 * lightbox open animation to an instant snap.
 */
import './style.scss';

const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemMatchesFilter = (item, filter) => {
	if (filter === '*' || filter === 'all') return true;
	const cat = (item.getAttribute('data-bb-pg-category') || '').toLowerCase();
	// Items with no category appear in every filter view.
	if (!cat) return true;
	return cat === filter;
};

const initFilter = (wrapper, items, buttons) => {
	const bar = wrapper.querySelector('.bb-pg-bar');
	if (!bar) return null;

	const reducedMotion = prefersReducedMotion();
	const durationAttr = parseInt(wrapper.getAttribute('data-bb-pg-duration') || '0', 10);
	const duration = reducedMotion ? 0 : Math.max(0, Math.min(1200, durationAttr || 0));

	const applyFilter = (filter, animate = true) => {
		buttons.forEach((btn) => {
			const btnFilter = btn.getAttribute('data-bb-pg-filter') || '*';
			const isActive = btnFilter === filter || (filter === 'all' && btnFilter === '*');
			btn.classList.toggle('is-active', isActive);
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});

		if (!animate || duration === 0) {
			items.forEach((item) => {
				const show = itemMatchesFilter(item, filter);
				item.classList.remove('is-fading');
				item.classList.toggle('is-hidden', !show);
				if (show) {
					item.removeAttribute('aria-hidden');
				} else {
					item.setAttribute('aria-hidden', 'true');
				}
			});
			return;
		}

		const toShow = [];
		const toHide = [];
		items.forEach((item) => {
			const show = itemMatchesFilter(item, filter);
			if (show) {
				toShow.push(item);
			} else if (!item.classList.contains('is-hidden')) {
				toHide.push(item);
			}
		});

		toHide.forEach((item) => item.classList.add('is-fading'));

		window.setTimeout(() => {
			toHide.forEach((item) => {
				item.classList.add('is-hidden');
				item.classList.remove('is-fading');
				item.setAttribute('aria-hidden', 'true');
			});
			toShow.forEach((item) => {
				if (item.classList.contains('is-hidden')) {
					item.classList.add('is-fading');
					item.classList.remove('is-hidden');
					// Force reflow so the fade-in transition runs.
					// eslint-disable-next-line no-unused-expressions
					item.offsetWidth;
					item.classList.remove('is-fading');
				}
				item.removeAttribute('aria-hidden');
			});
		}, duration);
	};

	bar.addEventListener('click', (e) => {
		const btn = e.target.closest('.bb-pg-btn');
		if (!btn || !bar.contains(btn)) return;
		e.preventDefault();
		const filter = btn.getAttribute('data-bb-pg-filter') || '*';
		const normalized = filter === '*' ? 'all' : filter;
		applyFilter(normalized, true);
	});

	// Honor the server-set initial filter without animation.
	const defaultFilter = (wrapper.getAttribute('data-bb-pg-default') || 'all').toLowerCase();
	applyFilter(defaultFilter, false);

	return { applyFilter };
};

const initLightbox = (wrapper, items) => {
	const dialog = wrapper.querySelector('.bb-pg-lightbox');
	if (!dialog) return;
	if (typeof dialog.showModal !== 'function') {
		// Native <dialog> not supported (very old browser). Fall back to
		// the default link behavior — clicking an image opens the full
		// image in the same tab.
		return;
	}

	const img = dialog.querySelector('.bb-pg-lightbox-img');
	const caption = dialog.querySelector('.bb-pg-lightbox-caption');
	const closeBtn = dialog.querySelector('.bb-pg-close');
	const prevBtn = dialog.querySelector('.bb-pg-prev');
	const nextBtn = dialog.querySelector('.bb-pg-next');
	if (!img || !closeBtn || !prevBtn || !nextBtn) return;

	const showCaption = dialog.getAttribute('data-bb-pg-show-caption') === '1';

	const links = items
		.map((item) => item.querySelector('.bb-pg-link'))
		.filter(Boolean);
	if (!links.length) return;

	let currentIndex = 0;
	let triggerLink = null;

	const visibleLinks = () => links.filter((link) => {
		const li = link.closest('.bb-pg-item');
		return li && !li.classList.contains('is-hidden');
	});

	const setMedia = (link) => {
		const src = link.getAttribute('data-bb-pg-full') || link.getAttribute('href') || '';
		const alt = link.getAttribute('data-bb-pg-alt') || '';
		const cap = link.getAttribute('data-bb-pg-caption') || '';
		img.setAttribute('src', src);
		img.setAttribute('alt', alt);
		if (caption) {
			if (showCaption && cap) {
				caption.textContent = cap;
				caption.hidden = false;
			} else {
				caption.textContent = '';
				caption.hidden = true;
			}
		}
	};

	const updateSingleClass = () => {
		const visible = visibleLinks();
		dialog.classList.toggle('is-single', visible.length <= 1);
	};

	const openAt = (link) => {
		const visible = visibleLinks();
		const idx = visible.indexOf(link);
		currentIndex = idx >= 0 ? idx : 0;
		triggerLink = link;
		updateSingleClass();
		setMedia(visible[currentIndex] || link);
		try {
			dialog.showModal();
		} catch (e) {
			// showModal can throw if the dialog is already open; ignore.
		}
		// Move focus to the close button so screen readers announce it
		// first and Escape/Tab behave naturally.
		window.setTimeout(() => {
			if (closeBtn && typeof closeBtn.focus === 'function') {
				closeBtn.focus();
			}
		}, 0);
	};

	const step = (delta) => {
		const visible = visibleLinks();
		if (!visible.length) return;
		currentIndex = (currentIndex + delta + visible.length) % visible.length;
		setMedia(visible[currentIndex]);
	};

	wrapper.addEventListener('click', (e) => {
		const link = e.target.closest('.bb-pg-link');
		if (!link || !wrapper.contains(link)) return;
		// Only handle clicks on links that belong to THIS wrapper's grid.
		const grid = wrapper.querySelector('.bb-pg-grid');
		if (!grid || !grid.contains(link)) return;
		e.preventDefault();
		openAt(link);
	});

	closeBtn.addEventListener('click', (e) => {
		e.preventDefault();
		try { dialog.close(); } catch (_) { /* ignore */ }
	});

	prevBtn.addEventListener('click', (e) => {
		e.preventDefault();
		step(-1);
	});

	nextBtn.addEventListener('click', (e) => {
		e.preventDefault();
		step(1);
	});

	// Click on the backdrop (outside the figure) closes the dialog.
	dialog.addEventListener('click', (e) => {
		if (e.target === dialog) {
			try { dialog.close(); } catch (_) { /* ignore */ }
		}
	});

	dialog.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			step(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			step(1);
		}
		// Escape is handled natively by <dialog>.
	});

	// Restore focus to the trigger link when the dialog closes.
	dialog.addEventListener('close', () => {
		if (triggerLink && typeof triggerLink.focus === 'function') {
			triggerLink.focus();
		}
		triggerLink = null;
	});
};

const initWrapper = (wrapper) => {
	if (!wrapper || wrapper.getAttribute('data-bb-pg-init') === '1') return;
	wrapper.setAttribute('data-bb-pg-init', '1');

	const grid = wrapper.querySelector('.bb-pg-grid');
	if (!grid) return;

	const bar = wrapper.querySelector('.bb-pg-bar');
	const items = Array.from(grid.querySelectorAll('.bb-pg-item'));
	const buttons = bar ? Array.from(bar.querySelectorAll('.bb-pg-btn')) : [];

	if (bar && buttons.length) {
		initFilter(wrapper, items, buttons);
	}

	const lightboxEnabled = wrapper.getAttribute('data-bb-pg-lightbox') === '1';
	if (lightboxEnabled) {
		initLightbox(wrapper, items);
	}
};

const initAll = () => {
	const wrappers = document.querySelectorAll('.bb-pg-wrapper[data-bb-pg-init="0"]');
	wrappers.forEach(initWrapper);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
