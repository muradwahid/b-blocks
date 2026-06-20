/**
 * Woo Product Carousel — frontend behavior (dependency-free carousel engine).
 *
 * The block is server-rendered. This script hydrates a per-instance slider
 * (translateX paging, arrows, dots, touch swipe, autoplay with
 * pause-on-hover/focus/out-of-viewport) plus AJAX add-to-cart for simple
 * products. No external library; no innerHTML writes for product markup — only
 * style, classList, aria-* mutations, and textContent updates. Honors
 * prefers-reduced-motion. A `data-bb-wpc-init` guard prevents double binding.
 */
import { __, sprintf } from '@wordpress/i18n';
import './style.scss';

const reducedMotionMQ = window.matchMedia( '(prefers-reduced-motion: reduce)' );

const slidesPerViewForViewport = ( config ) => {
	const spv = config.slidesPerView || {};
	const width = window.innerWidth;
	if ( width >= 1024 ) {
		return Math.max( 1, parseInt( spv.desktop, 10 ) || 1 );
	}
	if ( width >= 768 ) {
		return Math.max( 1, parseInt( spv.tablet, 10 ) || 1 );
	}
	return Math.max( 1, parseInt( spv.mobile, 10 ) || 1 );
};

const slideAriaLabel = ( current, total ) =>
	sprintf(
		/* translators: 1: current slide number, 2: total slides. */
		__( '%1$d of %2$d', 'b-blocks' ),
		current,
		total
	);

/* ----------------------------------------------------------------------
 * AJAX add-to-cart for simple products.
 * ------------------------------------------------------------------- */
const initAddToCart = ( root ) => {
	const ajaxUrl = root.dataset.bbWpcAjax || '';
	const nonce = root.dataset.bbWpcNonce || '';
	if ( ! ajaxUrl || ! nonce ) {
		return;
	}

	const status = root.querySelector( '.bb-wpc-status' );
	const buttons = Array.from( root.querySelectorAll( '.bb-wpc-atc-btn[data-product-id]' ) );

	const announce = ( message ) => {
		if ( status ) {
			status.textContent = message;
		}
	};

	buttons.forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			if ( btn.classList.contains( 'is-loading' ) || btn.classList.contains( 'is-added' ) ) {
				return;
			}

			const productId = parseInt( btn.dataset.productId, 10 ) || 0;
			if ( ! productId ) {
				return;
			}

			btn.classList.add( 'is-loading' );
			btn.setAttribute( 'aria-busy', 'true' );

			const body = new URLSearchParams();
			body.append( 'action', 'bb_wpc_add_to_cart' );
			body.append( 'nonce', nonce );
			body.append( 'product_id', String( productId ) );

			fetch( ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString(),
			} )
				.then( ( res ) => res.json() )
				.then( ( json ) => {
					if ( json && json.success && json.data && json.data.added ) {
						btn.classList.add( 'is-added' );
						announce(
							sprintf(
								/* translators: %s: product name. */
								__( '%s added to cart.', 'b-blocks' ),
								json.data.productName || ''
							)
						);

						document.body.dispatchEvent( new CustomEvent( 'wc_fragment_refresh' ) );

						setTimeout( () => {
							btn.classList.remove( 'is-added' );
						}, 1500 );
					} else {
						const message = ( json && json.data && json.data.message )
							? json.data.message
							: __( 'Could not add the product to the cart.', 'b-blocks' );
						announce( message );
					}
				} )
				.catch( () => announce( __( 'Could not add the product to the cart.', 'b-blocks' ) ) )
				.finally( () => {
					btn.classList.remove( 'is-loading' );
					btn.setAttribute( 'aria-busy', 'false' );
				} );
		} );
	} );
};

/* ----------------------------------------------------------------------
 * Carousel engine.
 * ------------------------------------------------------------------- */
const initCarousel = ( root ) => {
	if ( root.dataset.bbWpcInit === '1' ) {
		return;
	}
	root.dataset.bbWpcInit = '1';

	initAddToCart( root );

	let config = {};
	try {
		config = JSON.parse( root.dataset.bbWpcConfig || '{}' );
	} catch ( e ) {
		config = {};
	}

	const track = root.querySelector( '.bb-wpc-track' );
	const slides = Array.from( root.querySelectorAll( '.bb-wpc-slide' ) );
	const prevBtn = root.querySelector( '.bb-wpc-prev' );
	const nextBtn = root.querySelector( '.bb-wpc-next' );
	const dotsContainer = root.querySelector( '.bb-wpc-dots' );
	const liveRegion = root.querySelector( '.bb-wpc-live' );

	if ( ! track || slides.length === 0 ) {
		return;
	}

	const total = slides.length;
	const loop = config.loop !== false;
	let reducedMotion = reducedMotionMQ.matches;
	let currentIndex = 0;
	let autoplayTimer = null;
	let isPaused = false;
	let inView = true;

	const maxIndex = () => {
		const perView = slidesPerViewForViewport( config );
		return Math.max( 0, total - perView );
	};

	const clamp = ( i ) => Math.max( 0, Math.min( maxIndex(), i ) );

	const applyTransition = () => {
		track.style.transition = reducedMotion
			? 'none'
			: `transform ${ Math.max( 0, parseInt( config.transitionSpeed, 10 ) || 500 ) }ms ease`;
	};

	// ---- Dots ----
	const dots = [];
	if ( config.dots && dotsContainer ) {
		const buildDots = () => {
			dotsContainer.textContent = '';
			dots.length = 0;
			const pages = maxIndex() + 1;
			for ( let i = 0; i < pages; i++ ) {
				const dot = document.createElement( 'button' );
				dot.type = 'button';
				dot.className = 'bb-wpc-dot';
				dot.setAttribute( 'role', 'tab' );
				dot.setAttribute( 'aria-label', slideAriaLabel( i + 1, pages ) );
				dot.addEventListener( 'click', () => goTo( i, true ) );
				dotsContainer.appendChild( dot );
				dots.push( dot );
			}
		};
		buildDots();

		dotsContainer.addEventListener( 'keydown', ( e ) => {
			if ( e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' ) {
				return;
			}
			e.preventDefault();
			const dir = e.key === 'ArrowRight' ? 1 : -1;
			const limit = maxIndex();
			let target = currentIndex + dir;
			if ( target < 0 ) {
				target = loop ? limit : 0;
			} else if ( target > limit ) {
				target = loop ? 0 : limit;
			}
			goTo( target, true );
			if ( dots[ target ] ) {
				dots[ target ].focus();
			}
		} );

		root._bbWpcRebuildDots = buildDots;
	}

	const updateA11y = () => {
		const perView = slidesPerViewForViewport( config );
		slides.forEach( ( slide, i ) => {
			const visible = i >= currentIndex && i < currentIndex + perView;
			if ( visible ) {
				slide.removeAttribute( 'aria-hidden' );
			} else {
				slide.setAttribute( 'aria-hidden', 'true' );
			}
			slide.querySelectorAll( 'a, button' ).forEach( ( el ) => {
				if ( el.classList.contains( 'bb-wpc-image-link' ) ) {
					return;
				}
				if ( visible ) {
					el.removeAttribute( 'tabindex' );
				} else {
					el.setAttribute( 'tabindex', '-1' );
				}
			} );
		} );

		dots.forEach( ( dot, i ) => {
			const active = i === currentIndex;
			dot.classList.toggle( 'is-active', active );
			dot.setAttribute( 'aria-selected', active ? 'true' : 'false' );
		} );

		if ( ! loop ) {
			const atStart = currentIndex <= 0;
			const atEnd = currentIndex >= maxIndex();
			if ( prevBtn ) {
				prevBtn.setAttribute( 'aria-disabled', atStart ? 'true' : 'false' );
				prevBtn.classList.toggle( 'is-disabled', atStart );
			}
			if ( nextBtn ) {
				nextBtn.setAttribute( 'aria-disabled', atEnd ? 'true' : 'false' );
				nextBtn.classList.toggle( 'is-disabled', atEnd );
			}
		}
	};

	let liveTimer = null;
	const announceSlide = () => {
		if ( ! liveRegion ) {
			return;
		}
		if ( liveTimer ) {
			clearTimeout( liveTimer );
		}
		liveTimer = setTimeout( () => {
			liveRegion.textContent = slideAriaLabel( currentIndex + 1, maxIndex() + 1 );
		}, 400 );
	};

	const render = () => {
		const first = slides[ 0 ];
		const slideWidth = first.getBoundingClientRect().width;
		const styles = window.getComputedStyle( track );
		const gap = parseFloat( styles.columnGap || styles.gap || '0' ) || 0;
		const offset = currentIndex * ( slideWidth + gap );
		track.style.transform = `translateX(-${ offset }px)`;
		updateA11y();
	};

	const goTo = ( index, fromUser = false ) => {
		if ( loop ) {
			const limit = maxIndex();
			if ( index < 0 ) {
				index = limit;
			} else if ( index > limit ) {
				index = 0;
			}
		} else {
			index = clamp( index );
		}
		currentIndex = index;
		render();
		announceSlide();
		if ( fromUser ) {
			restartAutoplay();
		}
	};

	const next = ( fromUser = false ) => goTo( currentIndex + 1, fromUser );
	const prev = ( fromUser = false ) => goTo( currentIndex - 1, fromUser );

	// ---- Autoplay ----
	const canAutoplay = () => !! config.autoplay && ! reducedMotion && total > 1;

	const startAutoplay = () => {
		if ( ! canAutoplay() || isPaused || ! inView || autoplayTimer ) {
			return;
		}
		const delay = Math.max( 1000, parseInt( config.autoplayDelay, 10 ) || 3000 );
		autoplayTimer = window.setInterval( () => next( false ), delay );
	};

	const stopAutoplay = () => {
		if ( autoplayTimer ) {
			window.clearInterval( autoplayTimer );
			autoplayTimer = null;
		}
	};

	const restartAutoplay = () => {
		stopAutoplay();
		startAutoplay();
	};

	// ---- Arrows ----
	if ( prevBtn ) {
		prevBtn.addEventListener( 'click', () => prev( true ) );
	}
	if ( nextBtn ) {
		nextBtn.addEventListener( 'click', () => next( true ) );
	}

	// ---- Pause on hover / focus ----
	if ( config.pauseOnHover !== false ) {
		root.addEventListener( 'mouseenter', () => {
			isPaused = true;
			stopAutoplay();
		} );
		root.addEventListener( 'mouseleave', () => {
			isPaused = false;
			startAutoplay();
		} );
	}
	root.addEventListener( 'focusin', () => {
		isPaused = true;
		stopAutoplay();
	} );
	root.addEventListener( 'focusout', ( e ) => {
		if ( ! root.contains( e.relatedTarget ) ) {
			isPaused = false;
			startAutoplay();
		}
	} );

	// ---- Touch swipe ----
	let startX = 0;
	let swiping = false;
	track.addEventListener(
		'touchstart',
		( e ) => {
			startX = e.touches[ 0 ].clientX;
			swiping = true;
		},
		{ passive: true }
	);
	track.addEventListener(
		'touchend',
		( e ) => {
			if ( ! swiping ) {
				return;
			}
			swiping = false;
			const delta = e.changedTouches[ 0 ].clientX - startX;
			if ( Math.abs( delta ) > 50 ) {
				if ( delta < 0 ) {
					next( true );
				} else {
					prev( true );
				}
			}
		},
		{ passive: true }
	);

	// ---- Resize ----
	let resizeRaf = null;
	window.addEventListener( 'resize', () => {
		if ( resizeRaf ) {
			window.cancelAnimationFrame( resizeRaf );
		}
		resizeRaf = window.requestAnimationFrame( () => {
			if ( root._bbWpcRebuildDots ) {
				root._bbWpcRebuildDots();
			}
			currentIndex = clamp( currentIndex );
			render();
		} );
	} );

	// ---- Reduced-motion live changes ----
	const onReducedMotionChange = ( e ) => {
		reducedMotion = e.matches;
		applyTransition();
		if ( reducedMotion ) {
			stopAutoplay();
		} else {
			startAutoplay();
		}
	};
	if ( typeof reducedMotionMQ.addEventListener === 'function' ) {
		reducedMotionMQ.addEventListener( 'change', onReducedMotionChange );
	} else if ( typeof reducedMotionMQ.addListener === 'function' ) {
		reducedMotionMQ.addListener( onReducedMotionChange );
	}

	// ---- Pause when scrolled out of view ----
	if ( 'IntersectionObserver' in window ) {
		const io = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					inView = entry.isIntersecting;
					if ( inView ) {
						startAutoplay();
					} else {
						stopAutoplay();
					}
				} );
			},
			{ threshold: 0.2 }
		);
		io.observe( root );
	}

	// ---- Boot ----
	applyTransition();
	render();
	startAutoplay();
};

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.bb-wpc[data-bb-wpc-config]' ).forEach( initCarousel );
} );
