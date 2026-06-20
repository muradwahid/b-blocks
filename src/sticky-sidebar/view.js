/**
 * Sticky Sidebar — frontend view script.
 *
 * Jobs:
 *  1. Import style.scss so the build emits view.css (the front-end stylesheet
 *     referenced from block.json as `"style": "file:./view.css"`).
 *  2. When the sidebar column has an internal max-height scroll (the block's
 *     `data-bb-ss-maxheight` is greater than 0), make the sidebar keyboard
 *     scrollable (`tabindex="0"`) and give it an accessible name.
 *  3. Respect `prefers-reduced-motion: reduce`: force instant scroll behavior
 *     on scrollable elements inside the sticky sidebar so smooth-scrolling
 *     anchor lists do not cause jarring jumps. Listens for OS changes too.
 *
 * The sticky behavior itself is pure CSS; this script never moves focus.
 */
import { __ } from '@wordpress/i18n';

import './style.scss';

const SIDEBAR_SELECTOR = '.bb-ss-grid > *:nth-child(2)';

const applyMotionPreference = (reduce) => {
	document.querySelectorAll('.bb-ss').forEach((wrapper) => {
		const sidebar = wrapper.querySelector(SIDEBAR_SELECTOR);
		if (!sidebar) {
			return;
		}
		sidebar.style.scrollBehavior = reduce ? 'auto' : '';
		sidebar.querySelectorAll('*').forEach((el) => {
			if (el instanceof HTMLElement) {
				el.style.scrollBehavior = reduce ? 'auto' : '';
			}
		});
	});
};

const init = () => {
	document.querySelectorAll('.bb-ss[data-bb-ss-maxheight]').forEach((wrapper) => {
		const maxHeight = parseInt(wrapper.getAttribute('data-bb-ss-maxheight') || '0', 10);
		if (!maxHeight || maxHeight <= 0) {
			return;
		}
		const sidebar = wrapper.querySelector(SIDEBAR_SELECTOR);
		if (!sidebar) {
			return;
		}
		// Make the internally-scrolling sidebar reachable and scrollable by keyboard.
		if (!sidebar.hasAttribute('tabindex')) {
			sidebar.setAttribute('tabindex', '0');
		}
		if (!sidebar.hasAttribute('aria-label')) {
			sidebar.setAttribute('aria-label', __('Scrollable sidebar content', 'b-blocks'));
		}
	});

	if (window.matchMedia) {
		const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
		applyMotionPreference(mql.matches);
		const onChange = (event) => applyMotionPreference(event.matches);
		if (typeof mql.addEventListener === 'function') {
			mql.addEventListener('change', onChange);
		} else if (typeof mql.addListener === 'function') {
			mql.addListener(onChange);
		}
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
