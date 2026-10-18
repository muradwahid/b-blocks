import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Autoplay, EffectCards, EffectCreative, EffectCube, EffectFade, EffectFlip, Mousewheel, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';

import Lightbox from './Lightbox';
import { BOX, EFFECTS, POSITIONS, viewLabel } from '../../utils/functions';
import { ArrowIcon, ExpandIcon } from '../../utils/icons';

const Gallery = ( { attributes, images = [], i18n = {}, productId = 0, variable = false, onSale = false, discount = 0, isBackend = false } ) => {
	const { layout = {}, options = {}, image = {}, thumbLayout = {}, badge = {}, lightbox = {} } = attributes;
	const position = POSITIONS.includes( layout.position ) ? layout.position : 'bottom';
	const isVertical = 'left' === position || 'right' === position;
	const adaptive = !! image.adaptiveHeight;
	const isGrid = 'grid' === thumbLayout.view;
	const showArrows = ! options.hideArrows && ! isGrid;
	const centered = !! thumbLayout.centered && ! isGrid;
	const mousewheel = !! thumbLayout.mousewheel && ! isGrid;
	const onHover = 'hover' === thumbLayout.changeOn;
	const effect = EFFECTS.includes( options.effect ) ? options.effect : 'slide';
	const speed = Number.isFinite( options.speed ) ? Math.min( 3000, Math.max( 0, options.speed ) ) : 350;
	const pagination = [ 'dots', 'fraction' ].includes( options.pagination ) ? options.pagination : '';

	const canLightbox = !! options.lightbox && ! isBackend;

	const autoplay = !! options.autoplay && ! isBackend;
	const autoplayDelay = Number.isFinite( options.autoplayDelay ) ? Math.min( 20000, Math.max( 1000, options.autoplayDelay ) ) : 4000;
	const autoplayPause = false !== options.autoplayPause;

	const [ active, setActive ] = useState( 0 );
	const [ variation, setVariation ] = useState( null );
	const [ zooming, setZooming ] = useState( false );
	const [ rtl, setRtl ] = useState( false );
	const [ finePointer, setFinePointer ] = useState( false );
	const [ viewing, setViewing ] = useState( null );

	const [ near, setNear ] = useState( () => new Set( [ 0, 1 ] ) );
	const rootEl = useRef( null );

	const mainEl = useRef( null );
	const thumbsEl = useRef( null );
	const prevEl = useRef( null );
	const nextEl = useRef( null );
	const mainPrev = useRef( null );
	const mainNext = useRef( null );
	const main = useRef( null );
	const thumbs = useRef( null );
	const thumbButtons = useRef( [] );
	const zoomImg = useRef( null );
	const zoomAt = useRef( '50% 50%' );

	const zoomWidth = useRef( 0 );
	const zoomScale = Number.isFinite( options.zoomScale ) ? Math.min( 5, Math.max( 1.1, options.zoomScale ) ) : 2;

	// A variation's own image stands in for the first one, as in WooCommerce's gallery.
	const list = variation && images.length ? [ variation, ...images.slice( 1 ) ] : images;
	const hasThumbs = list.length > 1;

	// Zoom: on the page, for a mouse (hover and a fine pointer).
	const canZoom = ! isBackend && false !== options.zoom && finePointer;

	const go = ( index ) => {
		if ( main.current && ! main.current.destroyed ) main.current.slideTo( index );
		else setActive( index );
	};

	const chosen = useRef( false );
	const choose = ( index ) => {
		chosen.current = true;
		main.current?.autoplay?.stop();
		go( index );
	};

	const heldByFocus = useRef( false );
	const holdAutoplay = () => {
		if ( ! main.current?.autoplay?.running ) return;
		heldByFocus.current = true;
		main.current.autoplay.stop();
	};
	const releaseAutoplay = ( event ) => {
		if ( event.currentTarget.contains( event.relatedTarget ) || ! heldByFocus.current ) return;
		heldByFocus.current = false;
		if ( ! chosen.current ) main.current?.autoplay?.start();
	};

	useLayoutEffect( () => {
		const win = rootEl.current?.ownerDocument?.defaultView;
		if ( ! win ) return;
		setRtl( 'rtl' === win.getComputedStyle( rootEl.current ).direction );
		setFinePointer( !! win.matchMedia?.( '(hover: hover) and (pointer: fine)' ).matches );
	}, [] );

	useLayoutEffect( () => {
		const win = mainEl.current?.ownerDocument?.defaultView;
		if ( ! win ) return undefined;

		const reduced = !! win.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

		const effects = {
			fade: { modules: [ EffectFade ], effect: 'fade', fadeEffect: { crossFade: true } },
			flip: { modules: [ EffectFlip ], effect: 'flip', flipEffect: { slideShadows: false } },
			cube: { modules: [ EffectCube ], effect: 'cube', cubeEffect: { shadow: false, slideShadows: false } },
			cards: { modules: [ EffectCards ], effect: 'cards', cardsEffect: { slideShadows: false } },
			// The image shrinks away, the next grows in.
			zoom: { modules: [ EffectCreative ], effect: 'creative', creativeEffect: { prev: { scale: 0.6, opacity: 0 }, next: { scale: 1.4, opacity: 0 } } },
			// The next image slides over the current one, which drifts back a little.
			parallax: { modules: [ EffectCreative ], effect: 'creative', creativeEffect: { prev: { translate: [ rtl ? '20%' : '-20%', 0, -1 ] }, next: { translate: [ rtl ? '-100%' : '100%', 0, 0 ] } } }
		};

		const { modules = [], ...look } = effects[ effect ] || {};
		main.current = new Swiper( mainEl.current, {
			...look,
			modules: autoplay && ! reduced ? [ ...modules, Autoplay ] : modules,
			autoplay: autoplay && ! reduced ? { delay: autoplayDelay, pauseOnMouseEnter: autoplayPause, disableOnInteraction: true } : false,
			speed: reduced ? 0 : speed,
			resizeObserver: false,
			autoHeight: adaptive,
			simulateTouch: false,
			allowTouchMove: ! isBackend,
			initialSlide: Math.min( active, list.length - 1 ),
			on: { slideChange: ( swiper ) => setActive( swiper.activeIndex ) }
		} );

		setActive( main.current.activeIndex );

		if ( hasThumbs && ! isGrid && thumbsEl.current ) {
			thumbs.current = new Swiper( thumbsEl.current, {
				modules: [ Navigation, Mousewheel ],
				direction: isVertical ? 'vertical' : 'horizontal',
				slidesPerView: 'auto',
				centeredSlides: centered,
				centeredSlidesBounds: centered,
				mousewheel: mousewheel ? { releaseOnEdges: true } : false,
				speed: reduced ? 0 : 300,
				resizeObserver: false,
				watchOverflow: true,
				watchSlidesProgress: true,
				simulateTouch: ! isBackend,
				allowTouchMove: ! isBackend,
				navigation: showArrows && prevEl.current && nextEl.current ? {
					prevEl: prevEl.current,
					nextEl: nextEl.current,
					disabledClass: `${ BOX }-arrow--disabled`,
					lockClass: `${ BOX }-arrow--locked`
				} : false
			} );
		}

		const resize = win.ResizeObserver ? new win.ResizeObserver( () => {
			main.current?.update();
			thumbs.current?.update();
		} ) : null;
		resize?.observe( rootEl.current );

		return () => {
			resize?.disconnect();
			thumbs.current?.destroy( true, true );
			main.current?.destroy( true, true );
			thumbs.current = null;
			main.current = null;
		};
	}, [ position, adaptive, showArrows, isGrid, centered, mousewheel, effect, rtl, speed, autoplay, autoplayDelay, autoplayPause, list.length, isBackend ] );

	const sizes = JSON.stringify( [ thumbLayout, layout ] );
	useEffect( () => {
		main.current?.update();
		thumbs.current?.update();
	}, [ sizes ] );

	useEffect( () => {
		const wanted = [ active - 1, active, active + 1 ].filter( ( i ) => i >= 0 && ! near.has( i ) );
		if ( wanted.length ) setNear( new Set( [ ...near, ...wanted ] ) );
	}, [ active ] );

	useEffect( () => {
		const swiper = thumbs.current;
		const slide = swiper?.slides?.[ active ];
		if ( slide && ( centered || ! slide.classList.contains( 'swiper-slide-fully-visible' ) ) ) swiper.slideTo( active );
	}, [ active, centered ] );

	useEffect( () => {
		const doc = rootEl.current?.ownerDocument;
		const win = doc?.defaultView;
		if ( isBackend || ! variable || ! productId || ! doc?.body || ! win?.MutationObserver ) return undefined;

		let shown = '';
		let alive = true;
		// WooCommerce's own pick on load (a default variation) is not the shopper's: autoplay goes on.
		let picked = false;
		const pick = ( event ) => {
			if ( event.isTrusted ) picked = true;
		};
		const select = ( index ) => ( picked ? choose( index ) : go( index ) );
		const watched = new Map();
		const fetched = new Map();
		const parsed = new WeakMap();

		const chosen = ( form ) => {
			const id = parseInt( form.querySelector( 'input[name="variation_id"]' )?.value, 10 ) || 0;
			if ( ! id ) return Promise.resolve( null );

			const raw = form.getAttribute( 'data-product_variations' ) || 'false';
			if ( parsed.get( form )?.raw !== raw ) {
				let list = false;
				try {
					list = JSON.parse( raw );
				} catch ( error ) {
					list = false;
				}
				parsed.set( form, { raw, list } );
			}
			const variations = parsed.get( form ).list;
			if ( Array.isArray( variations ) ) return Promise.resolve( variations.find( ( v ) => v.variation_id === id ) || null );

			const fields = [ ...form.querySelectorAll( '[name^="attribute_"]' ) ].map( ( field ) => [ field.name, field.value ] );
			const key = JSON.stringify( fields );
			if ( ! fetched.has( key ) ) {
				const url = String( win.wc_add_to_cart_variation_params?.wc_ajax_url || '/?wc-ajax=%%endpoint%%' ).replace( '%%endpoint%%', 'get_variation' );
				fetched.set( key, win.fetch( url, {
					method: 'POST',
					credentials: 'same-origin',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
					body: new win.URLSearchParams( [ [ 'product_id', String( productId ) ], ...fields ] ).toString()
				} ).then( ( res ) => res.json() ).catch( () => null ) );
			}
			return fetched.get( key ).then( ( found ) => ( found && found.variation_id === id ? found : null ) );
		};

		const show = ( found ) => {
			if ( ! alive ) return;
			const img = found?.image;
			const key = img?.src ? `${ found.variation_id }:${ img.src }` : '';
			if ( key === shown ) return;
			shown = key;

			if ( ! img?.src ) {
				setVariation( null );
				select( 0 );
				return;
			}

			const index = images.findIndex( ( item ) => item.id && item.id === found.image_id );
			if ( -1 !== index ) {
				setVariation( null );
				select( index );
				return;
			}

			setVariation( {
				id: found.image_id || 0,
				alt: img.alt || images[ 0 ]?.alt || '',
				main: { src: img.src, srcset: img.srcset || '', sizes: img.sizes || '', width: img.src_w, height: img.src_h },
				thumb: { src: img.gallery_thumbnail_src || img.thumb_src || img.src },
				full: { src: img.full_src || img.src },
				caption: img.caption || ''
			} );
			select( 0 );
		};

		const pending = new Set();
		const read = ( form ) => {
			if ( pending.has( form ) ) return;
			pending.add( form );
			win.requestAnimationFrame( () => {
				pending.delete( form );
				chosen( form ).then( show );
			} );
		};

		const follow = ( form ) => {
			if ( watched.has( form ) || parseInt( form.getAttribute( 'data-product_id' ), 10 ) !== productId ) return;
			const observer = new win.MutationObserver( () => read( form ) );
			observer.observe( form, { childList: true, subtree: true, attributes: true, attributeFilter: [ 'style', 'class' ] } );
			form.addEventListener( 'change', pick );
			form.addEventListener( 'click', pick );
			watched.set( form, () => {
				observer.disconnect();
				form.removeEventListener( 'change', pick );
				form.removeEventListener( 'click', pick );
			} );
			read( form );
		};

		const findForms = ( root ) => {
			if ( root.matches?.( 'form.variations_form' ) ) follow( root );
			root.querySelectorAll?.( 'form.variations_form' ).forEach( follow );
		};

		findForms( doc );

		const arrivals = new win.MutationObserver( ( records ) => {
			let removed = false;
			records.forEach( ( { addedNodes, removedNodes } ) => {
				removed = removed || 0 < removedNodes.length;
				addedNodes.forEach( ( node ) => 1 === node.nodeType && findForms( node ) );
			} );
			if ( removed ) {
				watched.forEach( ( stop, form ) => {
					if ( form.isConnected ) return;
					stop();
					watched.delete( form );
				} );
			}
		} );
		arrivals.observe( doc.body, { childList: true, subtree: true } );

		return () => {
			alive = false;
			arrivals.disconnect();
			watched.forEach( ( stop ) => stop() );
		};
	}, [ productId, variable, images, isBackend ] );

	const onThumbKey = ( event, index ) => {
		const grid = isGrid && event.currentTarget.closest( `.${ BOX }-thumbs-grid` );

		const row = grid ? grid.ownerDocument.defaultView.getComputedStyle( grid ).gridTemplateColumns.split( ' ' ).length : 1;
		const across = { [ rtl ? 'ArrowLeft' : 'ArrowRight' ]: index + 1, [ rtl ? 'ArrowRight' : 'ArrowLeft' ]: index - 1 };
		const down = { ArrowDown: index + row, ArrowUp: index - row };
		const keys = isGrid ? { ...across, ...down } : ( isVertical ? down : across );
		const to = { ...keys, Home: 0, End: list.length - 1 }[ event.key ];
		if ( undefined === to || to < 0 || to >= list.length ) return;

		event.preventDefault();
		thumbs.current?.slideTo( to );
		thumbButtons.current[ to ]?.focus();
	};

	const onZoom = ( event ) => {

		if ( event.target.closest?.( `button, .${ BOX }-badge, .${ BOX }-fraction` ) ) {
			if ( zooming ) setZooming( false );
			return;
		}
		const box = event.currentTarget.getBoundingClientRect();
		zoomWidth.current = Math.ceil( box.width * zoomScale );
		const x = Math.min( 100, Math.max( 0, ( ( event.clientX - box.left ) / box.width ) * 100 ) );
		const y = Math.min( 100, Math.max( 0, ( ( event.clientY - box.top ) / box.height ) * 100 ) );
		zoomAt.current = `${ x }% ${ y }%`;
		if ( zoomImg.current ) zoomImg.current.style.transformOrigin = zoomAt.current;
		else if ( ! zooming ) setZooming( true );
	};

	const current = list[ active ] || list[ 0 ];

	const thumb = ( item, i ) => <button
		type='button'
		ref={ ( el ) => ( thumbButtons.current[ i ] = el ) }
		className={ [ `${ BOX }-thumb`, active === i && 'is-active' ].filter( Boolean ).join( ' ' ) }
		aria-label={ viewLabel( i18n.view, i + 1, list.length ) }
		aria-current={ active === i ? 'true' : undefined }
		onClick={ () => choose( i ) }
		onMouseEnter={ onHover ? () => choose( i ) : undefined }
		onKeyDown={ ( e ) => onThumbKey( e, i ) }
	>
		<img src={ item.thumb?.src } srcSet={ item.thumb?.srcset || undefined } sizes={ item.thumb?.sizes || undefined } alt='' loading='lazy' decoding='async' />
	</button>;

	const badgeText = String( badge.text || '' ).replace( /<[^>]*>/g, '' ).trim();
	const saleText = ( badgeText.includes( '{discount}' ) && ! ( discount > 0 ) ) || ! badgeText ? i18n.sale : badgeText.replace( /\{discount\}/g, discount );

	const view = ( index ) => {
		chosen.current = true;
		main.current?.autoplay?.stop();
		setViewing( index );
	};

	return <div
		className={ BOX }
		ref={ rootEl }
		role='group'
		aria-label={ i18n.gallery }
		onFocus={ autoplay ? holdAutoplay : undefined }
		onBlur={ autoplay ? releaseAutoplay : undefined }
	>
		<div
			className={ `${ BOX }-main` }
			onMouseMove={ canZoom ? onZoom : undefined }
			onMouseLeave={ canZoom ? () => setZooming( false ) : undefined }

			onClick={ canLightbox ? ( event ) => ! event.target.closest( 'button' ) && view( active ) : undefined }
		>
			<div className={ `swiper ${ BOX }-main-swiper` } ref={ mainEl }>
				<div className='swiper-wrapper'>
					{ list.map( ( item, i ) => <div key={ i } className={ `swiper-slide ${ BOX }-main-slide` }>
						<img
							className={ `${ BOX }-main-img` }
							src={ near.has( i ) ? item.main?.src : undefined }
							srcSet={ near.has( i ) ? item.main?.srcset || undefined : undefined }
							sizes={ item.main?.sizes || undefined }
							width={ item.main?.width || undefined }
							height={ item.main?.height || undefined }
							alt={ near.has( i ) ? item.alt || '' : '' }
							loading={ 0 === i ? 'eager' : 'lazy' }
							decoding='async'
							onLoad={ () => adaptive && main.current?.updateAutoHeight?.( 0 ) }
						/>
					</div> ) }
				</div>
			</div>

			{ canZoom && zooming && current?.full?.src && <div className={ `${ BOX }-zoom` } aria-hidden='true'>
				<img ref={ zoomImg } src={ current.full.src } srcSet={ current.main?.srcset || undefined } sizes={ current.main?.srcset ? `${ zoomWidth.current }px` : undefined } alt='' style={ { transformOrigin: zoomAt.current } } />
			</div> }

			{ options.saleBadge && onSale && <span className={ `${ BOX }-badge ${ BOX }-badge--${ 'top-right' === badge.position ? 'top-right' : 'top-left' }` }>{ saleText }</span> }

			{ options.lightbox && <button type='button' className={ `${ BOX }-expand` } aria-label={ i18n.open } aria-haspopup='dialog' onClick={ () => canLightbox && view( active ) }><ExpandIcon /></button> }

			{ options.mainArrows && hasThumbs && <>
				<button type='button' ref={ mainPrev } className={ `${ BOX }-main-arrow ${ BOX }-main-arrow--prev` } aria-label={ i18n.prevImage } disabled={ 0 === active } onClick={ () => {
					choose( active - 1 );
					if ( 1 === active ) mainNext.current?.focus();
				} }><ArrowIcon to={ rtl ? 'right' : 'left' } /></button>
				<button type='button' ref={ mainNext } className={ `${ BOX }-main-arrow ${ BOX }-main-arrow--next` } aria-label={ i18n.nextImage } disabled={ list.length - 1 === active } onClick={ () => {
					choose( active + 1 );
					if ( list.length - 2 === active ) mainPrev.current?.focus();
				} }><ArrowIcon to={ rtl ? 'left' : 'right' } /></button>
			</> }

			{ 'dots' === pagination && hasThumbs && <div className={ `${ BOX }-dots` }>
				{ list.map( ( item, i ) => <button
					type='button'
					key={ i }
					className={ [ `${ BOX }-dot`, active === i && 'is-active' ].filter( Boolean ).join( ' ' ) }
					aria-label={ viewLabel( i18n.view, i + 1, list.length ) }
					aria-current={ active === i ? 'true' : undefined }
					onClick={ () => choose( i ) }
				/> ) }
			</div> }

			{ 'fraction' === pagination && hasThumbs && <div className={ `${ BOX }-fraction` } aria-live='polite' aria-atomic='true'>{ active + 1 } / { list.length }</div> }
		</div>

		{ null !== viewing && canLightbox && <Lightbox
			images={ list }
			index={ viewing }
			onIndex={ ( i ) => {
				setViewing( i );
				choose( i );
			} }
			onClose={ () => setViewing( null ) }
			i18n={ i18n }
			rtl={ rtl }
			doc={ rootEl.current.ownerDocument }
			colors={ lightbox }
			captions={ !! options.lightboxCaptions }
		/> }

		{ hasThumbs && <div className={ `${ BOX }-thumbs` }>
			{ showArrows && <button type='button' ref={ prevEl } className={ `${ BOX }-arrow ${ BOX }-arrow--prev` } aria-label={ i18n.previous }><ArrowIcon to={ isVertical ? 'up' : ( rtl ? 'right' : 'left' ) } /></button> }

			{ isGrid ? <div className={ `${ BOX }-thumbs-grid` }>
				{ list.map( ( item, i ) => <div key={ i } className={ `${ BOX }-thumb-slide` }>{ thumb( item, i ) }</div> ) }
			</div> : <div className={ `swiper ${ BOX }-thumbs-swiper` } ref={ thumbsEl }>
				<div className='swiper-wrapper'>
					{ list.map( ( item, i ) => <div key={ i } className={ `swiper-slide ${ BOX }-thumb-slide` }>{ thumb( item, i ) }</div> ) }
				</div>
			</div> }

			{ showArrows && <button type='button' ref={ nextEl } className={ `${ BOX }-arrow ${ BOX }-arrow--next` } aria-label={ i18n.next }><ArrowIcon to={ isVertical ? 'down' : ( rtl ? 'left' : 'right' ) } /></button> }
		</div> }
	</div>;
};

export default Gallery;