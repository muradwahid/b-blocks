/**
 * Feature Tabs — frontend view script.
 *
 * Dependency-free. Handles:
 *  - Desktop tab switching with ARIA tab semantics + roving tabindex keyboard nav.
 *  - Cross-fade image panels (CSS transition; forced to 0 under reduced motion).
 *  - Mobile single-open accordion below the configured breakpoint.
 *
 * Also imports style.scss so the build emits view.css (referenced from
 * block.json as the front-end stylesheet).
 */
import './style.scss';

const reducedMotion =
	window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initBlock = (root) => {
	if (root.dataset.bbFtInit === '1') {
		return;
	}
	root.dataset.bbFtInit = '1';

	let config = { activeTab: 0, transitionDuration: 300, mobileBreakpoint: 640 };
	try {
		const raw = root.getAttribute('data-bb-ft-config');
		if (raw) {
			config = { ...config, ...JSON.parse(raw) };
		}
	} catch (e) {
		// Keep defaults on malformed config.
	}

	if (reducedMotion) {
		config.transitionDuration = 0;
	}

	const tablist = root.querySelector('.bb-ft-tablist');
	if (!tablist) {
		return;
	}

	const tabs = Array.prototype.slice.call(root.querySelectorAll('.bb-ft-tab'));
	const panels = Array.prototype.slice.call(root.querySelectorAll('.bb-ft-stage .bb-ft-panel'));
	const accPanels = Array.prototype.slice.call(root.querySelectorAll('.bb-ft-acc-panel'));

	if (!tabs.length) {
		return;
	}

	// Pre-compute IDs for aria-controls switching between desktop tabpanel and
	// mobile accordion panel as the breakpoint is crossed.
	const desktopPanelIds = panels.map((p) => p.id || null);
	const accPanelIds = accPanels.map((p) => p.id || null);

	const isMobile = () => window.innerWidth <= config.mobileBreakpoint;

	// Update aria-controls to point at the appropriate panel for the current layout.
	const syncAriaControls = (mobile) => {
		tabs.forEach((tab, i) => {
			const id = mobile ? (accPanelIds[i] || null) : (desktopPanelIds[i] || null);
			if (id) {
				tab.setAttribute('aria-controls', id);
			}
		});
	};

	const activate = (index, { focus = false } = {}) => {
		const clamped = Math.max(0, Math.min(index, tabs.length - 1));

		tabs.forEach((tab, i) => {
			const on = i === clamped;
			tab.classList.toggle('is-active', on);
			tab.setAttribute('aria-selected', on ? 'true' : 'false');
			tab.setAttribute('aria-expanded', on ? 'true' : 'false');
			tab.setAttribute('tabindex', on ? '0' : '-1');
			if (on && focus) {
				tab.focus();
			}
		});

		panels.forEach((panel, i) => {
			const on = i === clamped;
			panel.classList.toggle('is-active', on);
			panel.setAttribute('aria-hidden', on ? 'false' : 'true');
			if (on) {
				panel.removeAttribute('hidden');
			} else {
				panel.setAttribute('hidden', '');
			}
		});

		root.dataset.bbFtActive = String(clamped);
	};

	const toggleAccordion = (index) => {
		const isOpen = accPanels[index] && accPanels[index].classList.contains('is-open');

		accPanels.forEach((panel, i) => {
			const open = i === index && !isOpen;
			panel.classList.toggle('is-open', open);
		});

		tabs.forEach((tab, i) => {
			const open = i === index && !isOpen;
			tab.classList.toggle('is-active', open);
			tab.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			if (isMobile()) {
				toggleAccordion(index);
			} else {
				activate(index);
			}
		});

		tab.addEventListener('keydown', (event) => {
			if (isMobile()) {
				return;
			}
			let next = null;
			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowRight':
					next = (index + 1) % tabs.length;
					break;
				case 'ArrowUp':
				case 'ArrowLeft':
					next = (index - 1 + tabs.length) % tabs.length;
					break;
				case 'Home':
					next = 0;
					break;
				case 'End':
					next = tabs.length - 1;
					break;
				default:
					return;
			}
			event.preventDefault();
			activate(next, { focus: true });
		});
	});

	// Reset state on breakpoint crossing so desktop tabs and the accordion
	// never end up in conflicting states.
	let wasMobile = isMobile();
	const syncMode = () => {
		const nowMobile = isMobile();
		if (nowMobile === wasMobile) {
			return;
		}
		wasMobile = nowMobile;

		const active = parseInt(root.dataset.bbFtActive || String(config.activeTab), 10) || 0;

		syncAriaControls(nowMobile);
		if (nowMobile) {
			accPanels.forEach((panel, i) => panel.classList.toggle('is-open', i === active));
			tabs.forEach((tab, i) => {
				tab.classList.toggle('is-active', i === active);
				tab.setAttribute('aria-expanded', i === active ? 'true' : 'false');
			});
		} else {
			activate(active);
		}
	};

	if (typeof ResizeObserver !== 'undefined') {
		const ro = new ResizeObserver(syncMode);
		ro.observe(document.documentElement);
	} else {
		window.addEventListener('resize', syncMode);
	}

	// Initial state — no flash, no animation on load.
	// Set aria-controls to match the layout at page load before any resize.
	syncAriaControls(isMobile());
	activate(config.activeTab);
	if (isMobile()) {
		accPanels.forEach((panel, i) =>
			panel.classList.toggle('is-open', i === config.activeTab)
		);
	}
};

const init = () => {
	document.querySelectorAll('.bb-ft[data-bb-ft-config]').forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
