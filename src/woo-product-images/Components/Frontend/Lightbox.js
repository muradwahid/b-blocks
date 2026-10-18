import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { BOX } from '../../utils/functions';
import { ArrowIcon, CloseIcon } from '../../utils/icons';

const Lightbox = ( { images, index, onIndex, onClose, i18n = {}, rtl = false, doc, colors = {}, captions = false } ) => {
	const dialog = useRef( null );
	const closeBtn = useRef( null );
	const swipeFrom = useRef( null );
	const pointers = useRef( new Set() );
	const swiped = useRef( false );
	const [ open, setOpen ] = useState( false );
	const [ closing, setClosing ] = useState( false );
	const reduced = !! doc.defaultView.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;
	const close = () => {
		if ( closing ) return;
		if ( reduced ) {
			onClose();
			return;
		}
		setClosing( true );
		setOpen( false );
	};
	useEffect( () => {
		const frame = doc.defaultView.requestAnimationFrame( () => setOpen( true ) );
		return () => doc.defaultView.cancelAnimationFrame( frame );
	}, [ doc ] );
	useEffect( () => {
		if ( ! closing ) return undefined;

		const timer = doc.defaultView.setTimeout( onClose, 260 );
		return () => doc.defaultView.clearTimeout( timer );
	}, [ closing ] );

	const total = images.length;
	const item = images[ index ] || images[ 0 ];
	const go = ( to ) => to >= 0 && to < total && onIndex( to );

	useEffect( () => {
		const before = doc.activeElement;
		const root = doc.documentElement;
		const { overflow, scrollbarGutter } = root.style;
		const hasBar = doc.defaultView.innerWidth > root.clientWidth;
		root.style.overflow = 'hidden';
		if ( hasBar ) root.style.scrollbarGutter = 'stable';
		closeBtn.current?.focus();

		return () => {
			root.style.overflow = overflow;
			root.style.scrollbarGutter = scrollbarGutter;
			before?.focus?.();
		};
	}, [ doc ] );

	useEffect( () => {

		if ( dialog.current?.contains( doc.activeElement ) && ! doc.activeElement.disabled ) return;
		const other = dialog.current?.querySelector( `.${ BOX }-lightbox-arrow:not([disabled])` );
		( other || closeBtn.current )?.focus();
	}, [ index, doc ] );

	const onKeyDown = ( event ) => {
		const next = rtl ? 'ArrowLeft' : 'ArrowRight';
		const prev = rtl ? 'ArrowRight' : 'ArrowLeft';

		if ( closing ) return;
		if ( 'Escape' === event.key ) {
			event.preventDefault();
			close();
		} else if ( next === event.key ) {
			event.preventDefault();
			go( index + 1 );
		} else if ( prev === event.key ) {
			event.preventDefault();
			go( index - 1 );
		} else if ( 'Tab' === event.key ) {
			const buttons = [ ...dialog.current.querySelectorAll( 'button:not([disabled])' ) ];
			const at = buttons.indexOf( doc.activeElement );
			const to = event.shiftKey ? ( at <= 0 ? buttons.length - 1 : at - 1 ) : ( at + 1 ) % buttons.length;
			event.preventDefault();
			buttons[ to ]?.focus();
		}
	};

	const keys = useRef( onKeyDown );
	keys.current = onKeyDown;
	useEffect( () => {
		const listen = ( event ) => keys.current( event );
		doc.addEventListener( 'keydown', listen );
		return () => doc.removeEventListener( 'keydown', listen );
	}, [ doc ] );

	const onPointerUp = ( event ) => {
		pointers.current.delete( event.pointerId );
		if ( null === swipeFrom.current ) return;
		const moved = event.clientX - swipeFrom.current;
		swipeFrom.current = null;
		if ( Math.abs( moved ) < 50 ) return;
		swiped.current = true;
		go( ( moved < 0 ) !== rtl ? index + 1 : index - 1 );
	};

	return createPortal( <div
		ref={ dialog }
		className={ [ `${ BOX }-lightbox`, open && 'is-open' ].filter( Boolean ).join( ' ' ) }
		role='dialog'
		aria-modal='true'
		tabIndex={ -1 }
		aria-label={ i18n.lightbox }
		style={ { background: colors.overlay || undefined, color: colors.color || undefined } }
		onClick={ ( event ) => {
			if ( swiped.current ) swiped.current = false;
			else if ( event.target === event.currentTarget ) close();
		} }
		onPointerDown={ ( event ) => {
			pointers.current.add( event.pointerId );
			swipeFrom.current = 1 === pointers.current.size ? event.clientX : null;
			swiped.current = false;
		} }
		onPointerUp={ onPointerUp }
		onPointerCancel={ ( event ) => {
			pointers.current.delete( event.pointerId );
			swipeFrom.current = null;
		} }
	>

		<img key={ index } className={ `${ BOX }-lightbox-img` } src={ item?.full?.src || item?.main?.src } srcSet={ item?.main?.srcset || undefined } sizes={ item?.main?.srcset ? '(max-width: 640px) 100vw, calc(100vw - 140px)' : undefined } alt={ item?.alt || '' } draggable='false' />

		{ captions && item?.caption && <p key={ `caption-${ index }` } className={ `${ BOX }-lightbox-caption` }>{ item.caption }</p> }

		<button type='button' ref={ closeBtn } className={ `${ BOX }-lightbox-close` } aria-label={ i18n.close } onClick={ close }><CloseIcon /></button>

		{ 1 < total && <>
			<button type='button' className={ `${ BOX }-lightbox-arrow ${ BOX }-lightbox-arrow--prev` } aria-label={ i18n.prevImage } disabled={ 0 === index } onClick={ () => go( index - 1 ) }><ArrowIcon to={ rtl ? 'right' : 'left' } /></button>
			<button type='button' className={ `${ BOX }-lightbox-arrow ${ BOX }-lightbox-arrow--next` } aria-label={ i18n.nextImage } disabled={ total - 1 === index } onClick={ () => go( index + 1 ) }><ArrowIcon to={ rtl ? 'left' : 'right' } /></button>
			<div className={ `${ BOX }-lightbox-count` } aria-live='polite'>{ index + 1 } / { total }</div>
		</> }
	</div>, doc.body );
};

export default Lightbox;