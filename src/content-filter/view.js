/**
 * Content Filter Block — frontend view script.
 *
 * Hydrates each .bb-cf-wrapper with click-to-filter behavior. Items are
 * shown / hidden by toggling an .is-hidden CSS class; the visible items'
 * .is-fading class drives a short opacity transition that respects
 * prefers-reduced-motion.
 *
 * Per-instance init guard via data-bb-cf-init="0" → "1" so multiple
 * filters on the same page never bind to each other.
 */
import './style.scss';

const initFilter = (wrapper) => {
	if (!wrapper || wrapper.getAttribute('data-bb-cf-init') === '1') return;
	wrapper.setAttribute('data-bb-cf-init', '1');

	const bar = wrapper.querySelector('.bb-cf-bar');
	const grid = wrapper.querySelector('.bb-cf-grid');
	if (!bar || !grid) return;

	const buttons = Array.from(bar.querySelectorAll('.bb-cf-btn'));
	const items = Array.from(grid.querySelectorAll('.bb-cf-item'));

	const durationAttr = parseInt(wrapper.getAttribute('data-bb-cf-duration') || '0', 10);
	const prefersReducedMotion =
		typeof window !== 'undefined' &&
		typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const duration = prefersReducedMotion ? 0 : Math.max(0, Math.min(1200, durationAttr || 0));

	const matches = (item, filter) => {
		if (filter === '*' || filter === 'all') return true;
		const cat = (item.getAttribute('data-bb-cf-category') || '').toLowerCase();
		// Items with no category (empty string) appear in all filter views.
		if (!cat) return true;
		return cat === filter;
	};

	const applyFilter = (filter, animate = true) => {
		// Update button states.
		buttons.forEach((btn) => {
			const btnFilter = btn.getAttribute('data-bb-cf-filter') || '*';
			const isActive = btnFilter === filter || (filter === 'all' && btnFilter === '*');
			btn.classList.toggle('is-active', isActive);
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});

		if (!animate || duration === 0) {
			// Snap show/hide — no animation.
			items.forEach((item) => {
				const show = matches(item, filter);
				item.classList.remove('is-fading');
				item.classList.toggle('is-hidden', !show);
			});
			return;
		}

		// Two-phase: fade out non-matching, then hide; show new matches.
		const toShow = [];
		const toHide = [];
		items.forEach((item) => {
			const show = matches(item, filter);
			if (show) {
				toShow.push(item);
			} else if (!item.classList.contains('is-hidden')) {
				toHide.push(item);
			}
		});

		// Trigger fade-out for items being hidden.
		toHide.forEach((item) => item.classList.add('is-fading'));

		window.setTimeout(() => {
			toHide.forEach((item) => {
				item.classList.add('is-hidden');
				item.classList.remove('is-fading');
			});
			// Reveal newly matching items with a fade-in.
			toShow.forEach((item) => {
				if (item.classList.contains('is-hidden')) {
					item.classList.add('is-fading');
					item.classList.remove('is-hidden');
					// Force reflow so the transition runs.
					// eslint-disable-next-line no-unused-expressions
					item.offsetWidth;
					item.classList.remove('is-fading');
				}
			});
		}, duration);
	};

	bar.addEventListener('click', (e) => {
		const btn = e.target.closest('.bb-cf-btn');
		if (!btn || !bar.contains(btn)) return;
		e.preventDefault();
		const filter = btn.getAttribute('data-bb-cf-filter') || '*';
		const normalized = filter === '*' ? 'all' : filter;
		applyFilter(normalized, true);
	});

	// Honor the server-set initial filter without animation (no flash).
	const defaultFilter = (wrapper.getAttribute('data-bb-cf-default') || 'all').toLowerCase();
	applyFilter(defaultFilter, false);
};

const initAll = () => {
	const wrappers = document.querySelectorAll('.bb-cf-wrapper[data-bb-cf-init="0"]');
	wrappers.forEach(initFilter);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
