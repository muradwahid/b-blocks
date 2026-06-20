/**
 * Post Carousel — frontend behavior.
 *
 * The block is server-rendered; this script instantiates Swiper.js from the
 * config baked into each `.bb-pc-wrapper[data-bb-pc-config]` and adds the ARIA
 * enhancements that Swiper does not provide out of the box. No `innerHTML`
 * writes happen here — all post markup is server-rendered. A `data-bb-pc-init`
 * guard prevents double-binding when a pattern embeds the block more than once.
 */
import Swiper from 'swiper';
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './style.scss';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	} catch ( e ) {
		return false;
	}
};

const initCarousel = ( wrapper ) => {
	if ( wrapper.dataset.bbPcInit === '1' ) return;

	let config = {};
	try {
		config = JSON.parse( wrapper.dataset.bbPcConfig || '{}' );
	} catch ( e ) {
		return;
	}

	const swiperEl = wrapper.querySelector( '.swiper' );
	if ( ! swiperEl ) return;

	const slides = swiperEl.querySelectorAll( '.swiper-slide' );
	if ( ! slides.length ) return;

	wrapper.dataset.bbPcInit = '1';

	const reduceMotion = prefersReducedMotion();

	const nextBtn = wrapper.querySelector( '.bb-pc-arrow-next' );
	const prevBtn = wrapper.querySelector( '.bb-pc-arrow-prev' );
	const paginationEl = wrapper.querySelector( '.bb-pc-pagination' );
	const liveRegion = wrapper.querySelector( '.bb-pc-live' );

	const spv = config.slidesPerView || {};
	const desktop = Math.max( 1, parseInt( spv.desktop, 10 ) || 3 );
	const tablet = Math.max( 1, parseInt( spv.tablet, 10 ) || 2 );
	const mobile = Math.max( 1, parseInt( spv.mobile, 10 ) || 1 );
	const space = Math.max( 0, parseInt( config.spaceBetween, 10 ) || 0 );

	// Do not loop when there are not enough slides to fill the largest viewport.
	const canLoop = !! config.loop && slides.length > desktop;

	const autoplayEnabled = !! config.autoplay && ! reduceMotion;

	const swiper = new Swiper( swiperEl, {
		modules: [ A11y, Autoplay, Keyboard, Navigation, Pagination ],

		slidesPerView: mobile,
		spaceBetween: space,
		loop: canLoop,
		speed: reduceMotion ? 0 : Math.max( 0, parseInt( config.speed, 10 ) || 500 ),
		watchSlidesProgress: true,

		keyboard: { enabled: true, onlyInViewport: true },

		a11y: { enabled: true },

		autoplay: autoplayEnabled ? {
			delay: Math.max( 500, parseInt( config.autoplayDelay, 10 ) || 3000 ),
			disableOnInteraction: false,
			pauseOnMouseEnter: !! config.autoplayPauseOnHover
		} : false,

		breakpoints: {
			768: {
				slidesPerView: Math.min( tablet, slides.length ),
				spaceBetween: space
			},
			1024: {
				slidesPerView: Math.min( desktop, slides.length ),
				spaceBetween: space
			}
		},

		navigation: ( config.arrows && nextBtn && prevBtn ) ? {
			nextEl: nextBtn,
			prevEl: prevBtn
		} : false,

		pagination: ( config.dots && paginationEl ) ? {
			el: paginationEl,
			clickable: true,
			renderBullet: ( i, className ) =>
				`<button type="button" class="${ className }" aria-label="${ slideAriaLabel( i + 1, slides.length ) }"></button>`
		} : false
	} );

	function slideAriaLabel( current, total ) {
		// Mirrors the i18n string used server-side; kept inline to avoid a runtime dependency.
		return `Slide ${ current } of ${ total }`;
	}

	// Keep focusable elements inside off-screen slides out of the tab order.
	const syncTabbing = () => {
		swiper.slides.forEach( ( slide ) => {
			const isVisible = slide.classList.contains( 'swiper-slide-visible' );
			slide.querySelectorAll( 'a, button' ).forEach( ( el ) => {
				if ( el.classList.contains( 'bb-pc-image-link' ) ) return;
				el.tabIndex = isVisible ? 0 : -1;
			} );
		} );
	};

	// Mark the active pagination bullet for assistive tech.
	const syncDots = () => {
		if ( ! paginationEl ) return;
		paginationEl.querySelectorAll( '.swiper-pagination-bullet' ).forEach( ( bullet ) => {
			if ( bullet.classList.contains( 'swiper-pagination-bullet-active' ) ) {
				bullet.setAttribute( 'aria-current', 'true' );
			} else {
				bullet.removeAttribute( 'aria-current' );
			}
		} );
	};

	let liveTimer = null;
	const announce = () => {
		if ( ! liveRegion ) return;
		if ( liveTimer ) clearTimeout( liveTimer );
		liveTimer = setTimeout( () => {
			const current = ( swiper.realIndex || 0 ) + 1;
			liveRegion.textContent = slideAriaLabel( current, slides.length );
		}, 400 );
	};

	swiper.on( 'slideChange', () => {
		syncTabbing();
		syncDots();
		announce();
	} );
	swiper.on( 'breakpoint', syncTabbing );

	syncTabbing();
	syncDots();

	requestAnimationFrame( () => swiper.update() );
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-pc-wrapper[data-bb-pc-config]' ).forEach( initCarousel );
} );
