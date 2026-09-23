import { prefix } from './data';
import { buildIndex, findSection } from './sections';

const reducedMotion = (win) => win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const easeInOut = (t) => 0.5 > t ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default class OnePageNav {
	constructor(nav, { updateHash = true, manageFocus = true, preview = false } = {}) {
		this.nav = nav;
		this.doc = nav.ownerDocument;
		this.win = this.doc.defaultView || window;
		this.updateHash = updateHash;
		this.manageFocus = manageFocus;
		this.preview = preview;
		this.items = Array.from(nav.querySelectorAll(`.${prefix}-item`));
		this.bubble = nav.querySelector(`.${prefix}-bubble`);
		this.offset = parseInt(nav.dataset.offset, 10) || 0;
		this.speed = parseInt(nav.dataset.speed, 10) || 0;
		this.smooth = '1' === nav.dataset.smooth;
		this.spy = '1' === nav.dataset.spy;
		this.hideMissing = '1' === nav.dataset.hideMissing;
		this.scroller = null;
		this.active = -1;
		this.raf = 0;
		this.scrollRaf = 0;
		this.resizeRaf = 0;
		this.listeners = [];
		this.targets = new Map();
		this.headings = new Map();

		this.sync();
		this.bindClicks();
		this.observe();
		this.watchDOM();
		this.onScroll();
	}

	findScroller() {
		const start = this.items.map((item) => this.target(item)).find(Boolean) || this.nav;

		let el = start?.parentElement;
		let scroller = null;

		while (el && el !== this.doc.body && el !== this.doc.documentElement) {
			const style = this.win.getComputedStyle(el);

			// The outermost one, not the nearest: an editor wraps block content in
			// several layers and any of them may carry its own overflow, but only
			// the outside one moves what the reader sees.
			if (/(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) scroller = el;

			el = el.parentElement;
		}

		return scroller;
	}

	view() {
		const el = this.scroller;

		if (!el) return { top: this.win.scrollY, height: this.win.innerHeight, edge: 0, extent: Math.max(this.doc.documentElement?.scrollHeight || 0, this.doc.body?.scrollHeight || 0) };

		return { top: el.scrollTop, height: el.clientHeight, edge: el.getBoundingClientRect().top, extent: el.scrollHeight };
	}

	topOf(section) {
		return section.getBoundingClientRect().top - this.view().edge;
	}

	scrollToY(y) {
		if (this.scroller) {
			this.scroller.scrollTop = y;

			return;
		}

		this.win.scrollTo(this.win.scrollX, y);
	}

	currentOffset() {
		const width = this.win.innerWidth || 0;
		const at = (key) => {
			const value = parseFloat(this.nav.dataset[key]);

			return isNaN(value) ? null : value;
		};

		const mobile = 640 >= width ? at('offsetMobile') : null;
		const tablet = 1024 >= width ? at('offsetTablet') : null;

		return mobile ?? tablet ?? this.offset;
	}

	target(item) {
		if (this.targets.has(item)) return this.targets.get(item);

		const section = findSection(this.doc, item.dataset.target, this.headings);

		this.targets.set(item, section);

		return section;
	}

	sync() {
		this.targets = new Map();
		this.headings = buildIndex(this.doc);
		this.scroller = this.findScroller();

		const missing = this.items.filter((item) => !this.target(item));
		const allMissing = missing.length === this.items.length;

		const hiding = this.hideMissing && !allMissing;

		this.items.forEach((item) => {
			const hide = hiding && missing.includes(item);

			item.hidden = hide;

			const link = item.querySelector(`.${prefix}-link`);

			if (link) link.tabIndex = hide ? -1 : 0;
		});

		if (allMissing && missing.length && !this.warned) {
			this.warned = true;
		}
	}

	bindClicks() {
		this.items.forEach((item, index) => {
			const link = item.querySelector(`.${prefix}-link`);

			if (!link) return;

			const onClick = (event) => {
				if (!this.boxOf(item)) return;

				event.preventDefault();
				this.scrollTo(this.target(item), index);
			};

			link.addEventListener('click', onClick);
			this.listeners.push(() => link.removeEventListener('click', onClick));
		});
	}

	scrollTo(section, index) {
		const offset = this.currentOffset();
		const to = Math.max(0, this.view().top + this.topOf(section) - offset);
		const focus = () => {
			if (!this.manageFocus) return;
			const had = section.hasAttribute('tabindex');
			const outline = section.style.outline;

			if (!had) {
				section.setAttribute('tabindex', '-1');
				section.style.outline = 'none';
			}

			section.focus({ preventScroll: true });

			if (!had) section.addEventListener('blur', () => {
				section.removeAttribute('tabindex');
				section.style.outline = outline;
			}, { once: true });
		};

		this.setActive(index);

		if (this.updateHash && section.id && this.win.history?.replaceState) this.win.history.replaceState(null, '', `#${section.id}`);

		if (!this.smooth || reducedMotion(this.win) || !this.speed) {
			this.scrollToY(to);
			focus();

			return;
		}

		this.win.cancelAnimationFrame(this.raf);

		const from = this.view().top;
		const start = this.win.performance.now();

		const step = (now) => {
			const progress = Math.min(1, (now - start) / this.speed);

			this.scrollToY(from + (to - from) * easeInOut(progress));

			if (1 > progress) {
				this.raf = this.win.requestAnimationFrame(step);
			} else {
				focus();
			}
		};

		this.raf = this.win.requestAnimationFrame(step);
	}

	setActive(index) {
		if (index === this.active) return;

		this.active = index;

		this.paint();

		this.items.forEach((item, i) => {
			const link = item.querySelector(`.${prefix}-link`);

			item.classList.toggle('is-active', i === index);

			if (link) {
				if (i === index) {
					link.setAttribute('aria-current', 'true');
				} else {
					link.removeAttribute('aria-current');
				}
			}
		});

		this.moveBubble();
	}

	moveBubble() {
		if (!this.bubble) return;

		const item = this.items[this.active];

		if (!item || item.hidden) {
			this.bubble.style.opacity = '0';

			return;
		}

		this.bubble.style.opacity = '0.2';

		const list = this.nav.querySelector(`.${prefix}-list`);
		const across = list && 'row' === this.win.getComputedStyle(list).flexDirection;

		this.bubble.style.transform = across
			? `translateX(${item.offsetLeft + item.offsetWidth / 2}px)`
			: `translateY(${item.offsetTop + item.offsetHeight / 2}px)`;
	}

	rootMargin() {
		const offset = this.currentOffset();

		return `-${offset}px 0px -${Math.max(0, this.view().height - offset - 1)}px 0px`;
	}

	boxOf(item) {
		if (item.hidden) return null;

		const section = this.target(item);

		if (!section || !section.getClientRects().length) return null;

		return { top: this.topOf(section) };
	}

	currentIndex() {
		const line = this.currentOffset();

		let current = -1;
		let crossed = -Infinity;

		this.items.forEach((item, index) => {
			const box = this.boxOf(item);

			if (box && box.top <= line && box.top > crossed) {
				crossed = box.top;
				current = index;
			}
		});

		if (-1 === current) {
			const halfway = this.view().height / 2;

			this.items.some((item, index) => {
				const box = this.boxOf(item);

				if (!box || box.top >= halfway) return false;

				current = index;

				return true;
			});

			return -1 === current ? this.firstIndex() : current;
		}

		if (!this.atEnd()) return current;

		let last = current;

		this.items.forEach((item, index) => {
			if (index <= current) return;

			const box = this.boxOf(item);

			if (box && box.top < this.view().height) last = index;
		});

		return last;
	}

	firstIndex() {
		if (!this.preview) return -1;

		const index = this.items.findIndex((item) => !item.hidden);

		return 0 > index ? -1 : index;
	}

	atEnd() {
		const { top, height, extent } = this.view();

		return extent > height + 1 && top + height >= extent - 2;
	}

	observe() {
		if (!this.spy || !this.win.IntersectionObserver) return;

		this.margin = this.rootMargin();

		this.observer = new this.win.IntersectionObserver(() => this.setActive(this.currentIndex()),
			{ root: this.scroller, rootMargin: this.margin, threshold: 0 });

		this.items.forEach((item) => {
			const section = this.target(item);

			if (section) this.observer.observe(section);
		});
	}

	paint() {
		const offset = this.currentOffset();

		this.items.forEach((item, index) => {
			const passed = -1 !== this.active && index < this.active;

			item.classList.toggle('is-passed', passed);

			const ring = item.querySelector(`.${prefix}-ring-bar`);

			if (!ring) return;

			if (index !== this.active) {
				ring.style.strokeDashoffset = passed ? '0' : '100';
				ring.style.opacity = passed ? '1' : '0';

				return;
			}

			const section = this.target(item);

			if (!section) return;
			const into = offset - this.topOf(section);
			const progress = Math.min(1, Math.max(0, into / (section.offsetHeight || 1)));

			ring.style.strokeDashoffset = String(100 - progress * 100);
			ring.style.opacity = 0 < progress ? '1' : '0';
		});
	}

	onScroll() {
		const update = () => {
			this.scrollRaf = 0;

			if (this.spy) this.setActive(this.currentIndex());

			this.paint();
		};

		const onScroll = () => {
			if (!this.scrollRaf) this.scrollRaf = this.win.requestAnimationFrame(update);
		};

		const onResize = () => {
			if (!this.resizeRaf) this.resizeRaf = this.win.requestAnimationFrame(() => {
				this.resizeRaf = 0;

				this.relayout();
			});
		};

		const scrolls = this.scroller || this.win;

		scrolls.addEventListener('scroll', onScroll, { passive: true });
		this.win.addEventListener('resize', onResize, { passive: true });
		this.listeners.push(() => {
			scrolls.removeEventListener('scroll', onScroll);
			this.win.removeEventListener('resize', onResize);
		});

		update();
	}

	relayout() {
		if (this.observer && this.margin !== this.rootMargin()) {
			this.observer.disconnect();
			this.observe();
		}

		this.moveBubble();
		this.paint();
	}

	watchDOM() {
		if (!this.win.MutationObserver) return;

		let pending = 0;

		this.mutation = new this.win.MutationObserver(() => {
			this.win.cancelAnimationFrame(pending);
			pending = this.win.requestAnimationFrame(() => {
				this.sync();
				this.observer?.disconnect();
				this.observe();
				this.moveBubble();
			});
		});

		this.mutation.observe(this.doc.body, { childList: true, subtree: true, characterData: true });
	}

	destroy() {
		this.win.cancelAnimationFrame(this.raf);
		this.win.cancelAnimationFrame(this.scrollRaf);
		this.win.cancelAnimationFrame(this.resizeRaf);
		this.observer?.disconnect();
		this.mutation?.disconnect();
		this.listeners.forEach((off) => off());
		this.listeners = [];
	}
}
