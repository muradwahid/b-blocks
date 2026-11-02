import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

import Card from './Card';
import FeaturedCard from './FeaturedCard';
import { BOX, CENTERED_PRESETS, DESKTOP_MIN, DOT_PRESETS, FEATURED_PRESETS, TABLET_MIN, fallbackLabels, slidesFallback, titleTags } from '../../utils/data';
import { nextIcon, pauseIcon, playIcon, prevIcon } from '../../utils/icons';

// Swiper's A11y module takes {{index}} / {{slidesLength}} placeholders.
const swiperMessage = (template) => String(template || '')
	.replace('%1$d', '{{index}}').replace('%2$d', '{{slidesLength}}').replace('%d', '{{index}}');

// Bullets are an HTML string (Swiper's renderBullet), so the translated label is escaped.
const escapeAttr = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The editor's links don't navigate.
const stay = (event) => {
	if (event.target.closest?.('a')) event.preventDefault();
};

// Moves `to` so it shows `from`'s product plus `offset`. In a loop a one-product gap goes by
// slideNext / slidePrev, so wrapping from the last product to the first doesn't run back past them all.
const follow = (from, to, offset, count) => {
	if (!from || !to || from.destroyed || to.destroyed) return;

	if (!to.params.loop) {
		const want = Math.min(Math.max(from.activeIndex + offset, 0), count - 1);
		if (to.activeIndex !== want) to.slideTo(want);
		// The small cards stay a product ahead: swiped back onto the large card's product, they go on one.
		if (0 > from.activeIndex + offset && 1 < count) from.slideTo(1);
		return;
	}

	const want = (from.realIndex + offset + count) % count;
	const ahead = (want - to.realIndex + count) % count;

	if (0 === ahead) return;
	if (1 === ahead) to.slideNext();
	else if (count - 1 === ahead) to.slidePrev();
	else to.slideToLoop(want);
};

/**
 * One Swiper instance for one set of settings (two for featured presets). ProductCarousel keys it on
 * everything Swiper reads, so a change in the editor unmounts it (destroying the instances) and mounts
 * fresh ones.
 */
const Slider = ({ attributes, products, labels, isBackend, device }) => {
	const { options = {}, content = {}, preset } = attributes;
	const centered = CENTERED_PRESETS.includes(preset);
	// Featured presets: a second, one-card slider before this one shows a product large (FeaturedCard).
	// This one starts at the second product and the two stay one product apart, whichever moves.
	const featured = FEATURED_PRESETS.includes(preset);

	const featuredEl = useRef(null);
	const featuredSwiper = useRef(null);
	const swiperEl = useRef(null);
	const prevEl = useRef(null);
	const nextEl = useRef(null);
	const dotsEl = useRef(null);
	const swiper = useRef(null);
	const focused = useRef(false);
	const hovered = useRef(false);

	const showArrows = !!options.arrows;
	// Autoplay that really runs (not in the editor, not with reduced motion) gets a pause / play button (WCAG 2.2.2).
	const [hasAutoplay, setHasAutoplay] = useState(false);
	const [paused, setPaused] = useState(false);
	// Featured presets: the bullets would number the small cards, a product ahead of the large one.
	const showDots = !!options.dots && !featured;
	// Featured presets head the carousel; the arrows sit in that heading's row (style.scss).
	const heading = featured ? attributes.heading?.text : '';
	const HeadingTag = titleTags.includes(attributes.heading?.tag) ? attributes.heading.tag : 'h2';
	// Centred presets with Infinite: Swiper loops only with as many slides as fit plus half again, so with
	// fewer products the list is repeated (`rounds` times) until there are enough. Measured at mount.
	const [rounds, setRounds] = useState(1);
	const slides = Array.from({ length: rounds }, () => products).flat();

	useLayoutEffect(() => {
		const el = swiperEl.current;
		const win = el?.ownerDocument?.defaultView;
		if (!el || !win) return undefined;

		const reduced = !!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		// Never in the editor, so a slide doesn't move away while it is being styled.
		const autoplay = !isBackend && !!options.autoplay && !reduced;
		setHasAutoplay(autoplay);
		// Saved as the field holds them ('3000ms'); older blocks have plain numbers. An empty field falls back.
		const ms = (value, min, max, fallback) => {
			const num = parseInt(value, 10);
			return Number.isFinite(num) ? Math.min(max, Math.max(min, num)) : fallback;
		};
		const delay = ms(options.autoplaySpeed, 500, 20000, 3000);
		const speed = reduced ? 0 : ms(options.speed, 0, 5000, 500);

		// One device's slides per view, gap and loop. Loop only with more products than fit in view: Swiper can't
		// loop fewer. Centred presets take each slide's CSS width (Style.js), so the count follows the space.
		const view = (d) => {
			// An empty tablet / mobile gap takes the next larger device's, as the CSS cascade does. Swiper reads '30px' itself.
			const spaceBetween = content[d]?.gap || ('mobile' === d ? content.tablet?.gap : '') || content.desktop?.gap || 0;

			if (centered) {
				return { slidesPerView: 'auto', centeredSlides: true, spaceBetween, loop: !!options.infinite && 2 < products.length };
			}

			const slidesPerView = Math.min(6, Math.max(1, parseInt(options[d]?.slides, 10) || slidesFallback[d]));
			return { slidesPerView, centeredSlides: false, spaceBetween, loop: !!options.infinite && products.length > slidesPerView };
		};

		// The editor previews one device: Swiper's breakpoints would read the editor's window, not the preview's.
		// The page goes mobile first, as Swiper's breakpoints are min-widths.
		let layout = isBackend ? view(device) : { ...view('mobile'), breakpoints: { [TABLET_MIN]: view('tablet'), [DESKTOP_MIN]: view('desktop') } };

		// Centred: how many slides fit depends on the width, so loop is decided here, by Swiper's own rule
		// (as many slides as fit plus half again). Too few to loop: start in the middle, with products either side.
		if (centered) {
			const slide = el.querySelector('.swiper-slide');
			const pitch = (slide ? slide.getBoundingClientRect().width : 0) + (parseFloat(layout.spaceBetween) || 0);
			let fits = pitch > 0 ? Math.ceil(el.clientWidth / pitch) : 1;
			fits += 0 === fits % 2 ? 1 : 0;
			const needed = fits + Math.max(1, Math.ceil(fits / 2));
			const loop = !!options.infinite && 1 < products.length;
			// Too few slides to loop: render the list again, then this runs once more with enough.
			if (loop && slides.length < needed) {
				setRounds(Math.ceil(needed / products.length));
				return undefined;
			}
			const strip = (view) => ({ ...view, loop });

			layout = { ...strip(layout), breakpoints: layout.breakpoints && Object.fromEntries(Object.entries(layout.breakpoints).map(([min, view]) => [min, strip(view)])) };
			if (!loop) layout.initialSlide = Math.floor((products.length - 1) / 2);
		}

		// Featured: the small cards start a product ahead of the large one.
		if (featured) layout.initialSlide = Math.min(1, products.length - 1);

		const a11y = {
			prevSlideMessage: labels.prev,
			nextSlideMessage: labels.next,
			firstSlideMessage: labels.first,
			lastSlideMessage: labels.last,
			paginationBulletMessage: swiperMessage(labels.goTo),
			// Repeated products: the slides keep their own label (product 2 of 4), not Swiper's count of every copy.
			slideLabelMessage: 1 < rounds ? '' : swiperMessage(labels.slideOf),
			itemRoleDescriptionMessage: labels.roleSlide,
			slideRole: 'group'
		};

		// Hover pause is done by the sliders' wrappers (below), so it covers both sliders of a featured preset.
		const autoplayParams = autoplay ? { delay, disableOnInteraction: true } : false;
		const navigation = showArrows && prevEl.current && nextEl.current ? {
			prevEl: prevEl.current,
			nextEl: nextEl.current,
			disabledClass: `${BOX}-arrow--disabled`,
			lockClass: `${BOX}-arrow--lock`
		} : false;
		const on = {
			// Hover ends while a keyboard user is still inside (or the other way round): stay paused.
			autoplayResume: (instance) => (focused.current || hovered.current) && instance.autoplay.pause(),
			// Stopped by the button or, with disableOnInteraction, by using the arrows / a swipe.
			autoplayStop: () => setPaused(true),
			autoplayStart: () => setPaused(false)
		};

		// Featured presets: the large card's slider leads (arrows, autoplay), as it can reach every product;
		// the small cards, never more than their last view, follow it.
		swiper.current = new Swiper(el, {
			...layout,
			modules: [A11y, Navigation, Pagination, ...(autoplay && !featured ? [Autoplay] : [])],
			speed,
			autoplay: featured ? false : autoplayParams,
			watchOverflow: true,
			grabCursor: !isBackend,
			allowTouchMove: !isBackend,
			simulateTouch: !isBackend,
			// The editor's canvas is an iframe: its own ResizeObserver is set up below.
			resizeObserver: !isBackend,
			navigation: featured ? false : navigation,
			pagination: showDots && dotsEl.current ? {
				el: dotsEl.current,
				clickable: true,
				bulletClass: `${BOX}-dot`,
				bulletActiveClass: `${BOX}-dot--active`,
				lockClass: `${BOX}-dots--lock`,
				modifierClass: `${BOX}-dots--`,
				// Swiper's A11y module labels only the bullets it renders itself, so this one carries its own.
				renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="${escapeAttr(labels.goTo.replace('%d', index + 1))}"></button>`,
				// Repeated products: one dot per product, not per slide; a click goes to that product's first slide.
				...(1 < rounds ? {
					type: 'custom',
					renderCustom: (instance) => products.map((product, index) => `<button type="button" class="${BOX}-dot${index === instance.realIndex % products.length ? ` ${BOX}-dot--active` : ''}" aria-label="${escapeAttr(labels.goTo.replace('%d', index + 1))}"></button>`).join('')
				} : {})
			} : false,
			a11y,
			on: featured ? {} : on
		});

		// Featured: the large card's own slider, looping when the small cards do, with their gap per device.
		// The arrows, autoplay and a swipe on either slider move both.
		if (featured && featuredEl.current) {
			const count = products.length;

			featuredSwiper.current = new Swiper(featuredEl.current, {
				modules: [A11y, Navigation, ...(autoplay ? [Autoplay] : [])],
				slidesPerView: 1,
				spaceBetween: layout.spaceBetween,
				breakpoints: layout.breakpoints && {
					[TABLET_MIN]: { spaceBetween: layout.breakpoints[TABLET_MIN].spaceBetween },
					[DESKTOP_MIN]: { spaceBetween: layout.breakpoints[DESKTOP_MIN].spaceBetween }
				},
				loop: !!swiper.current.params.loop && 1 < count,
				autoplay: autoplayParams,
				navigation,
				on,
				speed,
				grabCursor: !isBackend,
				allowTouchMove: !isBackend,
				simulateTouch: !isBackend,
				resizeObserver: !isBackend,
				a11y
			});

			// realIndexChange, not slideChange: in a loop Swiper re-orders slides first and fires slideChange
			// with the old index, which would pull the other slider back. While one is moving the other,
			// the move it causes isn't echoed back.
			let syncing = false;
			const link = (from, to, offset) => from.on('realIndexChange', () => {
				if (syncing) return;
				syncing = true;
				follow(from, to, offset, count);
				syncing = false;
			});

			link(swiper.current, featuredSwiper.current, -1);
			link(featuredSwiper.current, swiper.current, 1);
		}

		let observer;
		if (isBackend && win.ResizeObserver) {
			observer = new win.ResizeObserver(() => [swiper.current, featuredSwiper.current].forEach((instance) => instance && !instance.destroyed && instance.update()));
			observer.observe(el);
		}

		return () => {
			observer?.disconnect();
			featuredSwiper.current?.destroy(true, true);
			featuredSwiper.current = null;
			swiper.current?.destroy(true, true);
			swiper.current = null;
		};
	}, [rounds]);

	// The slider that plays: the large card's in featured presets.
	const toggleAutoplay = () => {
		const autoplay = (featuredSwiper.current || swiper.current)?.autoplay;
		if (!autoplay) return;

		if (autoplay.running) autoplay.stop();
		else autoplay.start();
	};

	const onFocus = () => {
		focused.current = true;
		(featuredSwiper.current || swiper.current)?.autoplay?.pause();
	};
	const onBlur = (event) => {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		focused.current = false;
		if (!hovered.current) (featuredSwiper.current || swiper.current)?.autoplay?.resume();
	};

	// Pause on Hover, over either slider of a featured preset (Swiper's own option watches one).
	const onMouseEnter = () => {
		if (!options.pauseOnHover) return;
		hovered.current = true;
		(featuredSwiper.current || swiper.current)?.autoplay?.pause();
	};
	const onMouseLeave = () => {
		if (!hovered.current) return;
		hovered.current = false;
		if (!focused.current) (featuredSwiper.current || swiper.current)?.autoplay?.resume();
	};

	// The dots and the autoplay pause button, in one row under the slides.
	const controls = (showDots || hasAutoplay) && <div className={`${BOX}-controls`}>
		{showDots && <div className={`${BOX}-dots`} ref={dotsEl} />}

		{ /* Pause Button off: still there for keyboard users, shown when it has focus. */}
		{hasAutoplay && <button
			type='button'
			className={`${BOX}-pause${options.pauseButton ? '' : ` ${BOX}-pause--focus-only`}`}
			aria-label={paused ? labels.play : labels.pause}
			onClick={toggleAutoplay}
		>{paused ? playIcon : pauseIcon}</button>}
	</div>;

	// Everything that starts in view loads at once; the rest lazily.
	const eagerDevice = isBackend ? device : 'desktop';
	const eagerCount = parseInt(options[eagerDevice]?.slides, 10) || slidesFallback[eagerDevice];

	return <>
		{featured && <div className={`${BOX}-featured`} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<div className='swiper' ref={featuredEl}>
				<div className='swiper-wrapper'>
					{products.map((product, index) => <div key={product.id} className='swiper-slide' aria-label={labels.slideOf.replace('%1$d', index + 1).replace('%2$d', products.length)}>
						<FeaturedCard product={product} attributes={attributes} labels={labels} eager={0 === index} />
					</div>)}
				</div>
			</div>
		</div>}

		<div className={`${BOX}-slider`} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			{heading && <HeadingTag className={`${BOX}-heading`}>{heading}</HeadingTag>}

			<div className={`${BOX}-stage`}>
				{showArrows && <button type='button' ref={prevEl} className={`${BOX}-arrow ${BOX}-arrow--prev`} aria-label={labels.prev}>{prevIcon}</button>}

				<div className='swiper' ref={swiperEl}>
					<div className='swiper-wrapper'>
						{slides.map((product, index) => <div key={`${product.id}-${index}`} className='swiper-slide' aria-label={labels.slideOf.replace('%1$d', (index % products.length) + 1).replace('%2$d', products.length)}>
							<Card product={product} attributes={attributes} labels={labels} eager={index < eagerCount + (featured ? 1 : 0)} first={0 === index} />
						</div>)}
					</div>
				</div>

				{showArrows && <button type='button' ref={nextEl} className={`${BOX}-arrow ${BOX}-arrow--next`} aria-label={labels.next}>{nextIcon}</button>}
			</div>

			{!featured && controls}
		</div>

		{ /* Featured presets: a grid row of its own under the small cards, so it doesn't lift them above the large card. */}
		{featured && controls}
	</>;
};

const ProductCarousel = ({ attributes, products = [], labels: rawLabels, isBackend = false, device = 'desktop' }) => {
	const { options = {}, preset, content = {}, image = {}, badge = {} } = attributes;
	const labels = { ...fallbackLabels, ...rawLabels };


	// Centred presets decide loop from the slide's width at mount, and on the page that width follows the
	// breakpoint (Image Width per device): crossing one rebuilds the slider.
	const watchBreakpoint = !isBackend && CENTERED_PRESETS.includes(preset);
	const [breakpoint, setBreakpoint] = useState(() => (watchBreakpoint ? [TABLET_MIN, DESKTOP_MIN].map((min) => window.matchMedia(`(min-width: ${min}px)`).matches).join() : ''));
	useEffect(() => {
		if (!watchBreakpoint) return undefined;
		const queries = [TABLET_MIN, DESKTOP_MIN].map((min) => window.matchMedia(`(min-width: ${min}px)`));
		const update = () => setBreakpoint(queries.map((query) => query.matches).join());
		queries.forEach((query) => query.addEventListener('change', update));
		return () => queries.forEach((query) => query.removeEventListener('change', update));
	}, [watchBreakpoint]);
	const dotPreset = DOT_PRESETS.includes(options.dotPreset) ? options.dotPreset : 'style-1';

	const classes = [
		BOX,
		`${BOX}--${preset}`,
		`${BOX}--dots-${dotPreset}`,
		`${BOX}--badge-${'right' === badge.align ? 'right' : 'left'}`,
		options.equalHeight ? `${BOX}--equal-height` : '',
		image.autoHeight ? `${BOX}--auto-height` : ''
	].filter(Boolean).join(' ');

	// Everything Swiper itself reads; any change rebuilds the instance.
	const signature = JSON.stringify([
		products.map((product) => product.id),
		['arrows', 'dots', 'infinite', 'autoplay', 'pauseOnHover', 'autoplaySpeed', 'speed'].map((key) => options[key]),
		// Centred presets ignore Slides To Show (hidden there).
		CENTERED_PRESETS.includes(preset) ? '' : [options.desktop?.slides, options.tablet?.slides, options.mobile?.slides],
		[content.desktop?.gap, content.tablet?.gap, content.mobile?.gap],
		// Centred presets decide loop from the slide's width (Image Width) at mount.
		CENTERED_PRESETS.includes(preset) ? [image.desktop?.width, image.tablet?.width, image.mobile?.width] : '',
		preset,
		isBackend ? device : breakpoint
	]);

	return <div
		className={classes}
		role='region'
		aria-roledescription={labels.roleCarousel}
		aria-label={labels.carousel}
		onClickCapture={isBackend ? stay : undefined}
	>
		<Slider key={signature} attributes={attributes} products={products} labels={labels} isBackend={isBackend} device={device} />
	</div>;
};

export default ProductCarousel;
