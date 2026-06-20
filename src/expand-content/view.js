/**
 * Expand Content — frontend behavior.
 *
 * - The inner content area is clamped to `previewHeight` via CSS.
 * - On init we measure the natural scrollHeight. If the content is
 *   already shorter than the preview, we hide the toggle entirely.
 * - Clicking the toggle expands the area to its natural height. After the
 *   CSS transition completes we set `max-height: none` so dynamically
 *   loaded content (lazy images, embeds) is fully visible.
 * - When collapsed, the hidden subtree is marked with the `inert`
 *   attribute (with a `tabindex="-1"` + `aria-hidden` fallback for
 *   older engines) so keyboard users cannot tab into invisible content.
 * - `aria-expanded` on the toggle and `aria-controls` pointing at the
 *   content id give screen readers the open/close relationship.
 * - `prefers-reduced-motion` is honored via CSS — JS still toggles state
 *   instantly without animation.
 * - A `ResizeObserver` re-measures when inner content size changes so
 *   short content stays toggle-less and tall content keeps the toggle.
 * - `sessionStorage` persistence (per data-storage-key) restores the
 *   open/closed state across navigation when enabled.
 * - Each block scopes its own listeners; nothing leaks to the global
 *   namespace.
 */
import './style.scss';

const SUPPORTS_INERT = typeof document !== 'undefined' && 'inert' in document.createElement('div');

const setInert = (el, on) => {
	if (!el) return;
	if (SUPPORTS_INERT) {
		if (on) {
			el.setAttribute('inert', '');
		} else {
			el.removeAttribute('inert');
		}
	} else {
		// Fallback for browsers without `inert`: hide from a11y tree and
		// disable focus on every interactive descendant.
		if (on) {
			el.setAttribute('aria-hidden', 'true');
		} else {
			el.removeAttribute('aria-hidden');
		}
		const focusable = el.querySelectorAll(
			'a[href], area[href], button, input, select, textarea, iframe, [tabindex]'
		);
		focusable.forEach((node) => {
			if (on) {
				if (!node.hasAttribute('data-bb-ec-prev-tabindex')) {
					node.setAttribute(
						'data-bb-ec-prev-tabindex',
						node.getAttribute('tabindex') === null ? '__none__' : node.getAttribute('tabindex')
					);
				}
				node.setAttribute('tabindex', '-1');
			} else {
				const prev = node.getAttribute('data-bb-ec-prev-tabindex');
				if (prev !== null) {
					if (prev === '__none__') {
						node.removeAttribute('tabindex');
					} else {
						node.setAttribute('tabindex', prev);
					}
					node.removeAttribute('data-bb-ec-prev-tabindex');
				}
			}
		});
	}
};

const isReducedMotion = () =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initBlock = (wrapper) => {
	if (!wrapper || wrapper.dataset.bbEcInit === '1') return;
	wrapper.dataset.bbEcInit = '1';

	let config = {};
	try {
		config = JSON.parse(wrapper.dataset.expandContentConfig || '{}');
	} catch (e) {
		config = {};
	}

	const previewHeight = typeof config.previewHeight === 'number' ? config.previewHeight : 200;
	const showMoreText = typeof config.showMoreText === 'string' && config.showMoreText.length > 0
		? config.showMoreText
		: 'Show More';
	const showLessText = typeof config.showLessText === 'string' && config.showLessText.length > 0
		? config.showLessText
		: 'Show Less';
	const showToggle = config.showToggle !== false;
	const persistState = config.persistState === true;
	const animationMs = typeof config.animationMs === 'number' ? config.animationMs : 300;

	const content = wrapper.querySelector('[data-expand-content-area]');
	const toggle = wrapper.querySelector('[data-expand-content-toggle]');
	const inner = content ? content.querySelector('.bb-ec-content__inner') : null;
	const labelSpan = toggle ? toggle.querySelector('.bb-ec-toggle__label') : null;

	if (!content || !toggle || !inner) return;

	const storageKey = persistState ? `bbEc:${wrapper.id || 'expand'}` : null;

	let isExpanded = false;
	let isShort = false;
	let transitionTimer = 0;

	const measure = () => {
		// Temporarily uncap to read the natural height.
		const wasExpanded = content.classList.contains('is-expanded');
		const wasUncapped = content.classList.contains('is-uncapped');
		content.classList.add('is-measuring');
		const natural = inner.scrollHeight;
		content.classList.remove('is-measuring');
		if (wasExpanded) content.classList.add('is-expanded');
		if (wasUncapped) content.classList.add('is-uncapped');
		return natural;
	};

	const applyClampedInert = () => {
		// When collapsed, exclude the hidden portion from tab order.
		// We can't surgically mark only the clipped half, so for the simple
		// case we mark the whole inner subtree as inert when collapsed —
		// that prevents the keyboard trap. The visible portion is still
		// readable visually and by screen readers (aria-hidden is NOT set
		// when `inert` is the path; inert + aria-hidden together would
		// double-hide). For non-supporting browsers, the fallback path
		// uses aria-hidden + tabindex juggling.
		setInert(inner, true);
	};

	const releaseInert = () => {
		setInert(inner, false);
	};

	const updateForShortContent = () => {
		const natural = measure();
		// Add 1px tolerance for sub-pixel rounding.
		isShort = natural <= previewHeight + 1;

		if (isShort) {
			toggle.setAttribute('hidden', '');
			wrapper.classList.add('bb-ec-no-fade');
			content.classList.add('is-uncapped');
			releaseInert();
			return;
		}

		wrapper.classList.remove('bb-ec-no-fade');
		toggle.removeAttribute('hidden');
		if (!isExpanded) {
			content.classList.remove('is-uncapped');
		}
	};

	const setLabel = (text) => {
		if (labelSpan) {
			labelSpan.textContent = text;
		} else {
			toggle.textContent = text;
		}
	};

	const expand = () => {
		if (isExpanded || isShort) return;
		isExpanded = true;

		const natural = measure();
		// Set the CSS custom property so the transition target is exact.
		content.style.setProperty('--bb-ec-natural-height', `${natural}px`);
		wrapper.classList.add('is-expanded');
		content.classList.add('is-expanded');
		content.classList.remove('is-uncapped');

		toggle.setAttribute('aria-expanded', 'true');
		setLabel(showLessText);
		releaseInert();

		// If the spec disables the collapse toggle, hide the button
		// once we're expanded so users can't collapse back.
		if (!showToggle) {
			toggle.setAttribute('hidden', '');
		}

		// After the transition, uncap so late-loading content stays visible.
		clearTimeout(transitionTimer);
		const delay = isReducedMotion() ? 0 : animationMs + 20;
		transitionTimer = window.setTimeout(() => {
			if (isExpanded) {
				content.classList.add('is-uncapped');
			}
		}, delay);

		if (storageKey) {
			try {
				window.sessionStorage.setItem(storageKey, 'open');
			} catch (e) {
				// Storage may be unavailable (private mode / disabled).
			}
		}
	};

	const collapse = (skipAnim = false) => {
		if (!isExpanded || isShort) return;
		isExpanded = false;

		// Re-cap by removing uncap class and resetting max-height back to
		// the preview height via CSS variable (default).
		content.classList.remove('is-uncapped');
		// Briefly force a fixed max-height equal to current natural so the
		// transition collapses smoothly back to the preview height.
		const natural = measure();
		content.style.setProperty('--bb-ec-natural-height', `${natural}px`);

		// Trigger reflow then drop the .is-expanded class to animate down.
		// eslint-disable-next-line no-unused-expressions
		content.offsetHeight;
		wrapper.classList.remove('is-expanded');
		content.classList.remove('is-expanded');

		toggle.setAttribute('aria-expanded', 'false');
		setLabel(showMoreText);

		clearTimeout(transitionTimer);
		const delay = skipAnim || isReducedMotion() ? 0 : animationMs + 20;
		transitionTimer = window.setTimeout(() => {
			if (!isExpanded) {
				applyClampedInert();
			}
		}, delay);

		if (storageKey) {
			try {
				window.sessionStorage.removeItem(storageKey);
			} catch (e) {
				// Ignore.
			}
		}
	};

	// Restore persisted open state.
	let initialOpen = false;
	if (storageKey) {
		try {
			initialOpen = window.sessionStorage.getItem(storageKey) === 'open';
		} catch (e) {
			initialOpen = false;
		}
	}

	// Initial measurement after a frame so fonts/images can size first.
	requestAnimationFrame(() => {
		updateForShortContent();

		if (!isShort) {
			if (initialOpen) {
				// Open without animation on first paint.
				const natural = measure();
				content.style.setProperty('--bb-ec-natural-height', `${natural}px`);
				wrapper.classList.add('is-expanded');
				content.classList.add('is-expanded');
				content.classList.add('is-uncapped');
				isExpanded = true;
				toggle.setAttribute('aria-expanded', 'true');
				setLabel(showLessText);
				if (!showToggle) {
					toggle.setAttribute('hidden', '');
				}
				releaseInert();
			} else {
				applyClampedInert();
			}
		}
	});

	toggle.addEventListener('click', (e) => {
		e.preventDefault();
		if (isExpanded) {
			collapse();
		} else {
			expand();
		}
	});

	// Re-measure when content size changes (lazy images, dynamic edits).
	let ro = null;
	if (typeof window.ResizeObserver === 'function') {
		ro = new window.ResizeObserver(() => {
			// Only re-check the short/tall threshold; never auto-toggle.
			const wasShort = isShort;
			const natural = measure();
			isShort = natural <= previewHeight + 1;

			if (isShort && !wasShort) {
				toggle.setAttribute('hidden', '');
				wrapper.classList.add('bb-ec-no-fade');
				content.classList.add('is-uncapped');
				releaseInert();
			} else if (!isShort && wasShort) {
				wrapper.classList.remove('bb-ec-no-fade');
				if (!(isExpanded && !showToggle)) {
					toggle.removeAttribute('hidden');
				}
				if (!isExpanded) {
					content.classList.remove('is-uncapped');
					applyClampedInert();
				}
			}

			// Keep the expanded target in sync.
			if (isExpanded && !isShort) {
				content.style.setProperty('--bb-ec-natural-height', `${natural}px`);
			}
		});
		ro.observe(inner);
	}

	// Strip the config attribute after init to avoid re-parsing.
	wrapper.removeAttribute('data-expand-content-config');

	// Cleanup on element removal (best-effort).
	wrapper._bbEcCleanup = () => {
		if (ro) {
			try { ro.disconnect(); } catch (e) { /* noop */ }
			ro = null;
		}
		clearTimeout(transitionTimer);
	};
};

const initAll = () => {
	const wrappers = document.querySelectorAll('.wp-block-b-blocks-expand-content');
	wrappers.forEach((wrapper) => initBlock(wrapper));
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
