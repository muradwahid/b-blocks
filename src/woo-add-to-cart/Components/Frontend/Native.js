import { useEffect, useRef, useState } from 'react';

import { BOX, boxClasses, btnState, cleanSvg } from '../../utils/functions';
import { REVERT_MS, announceAdded, onPageRestore, postAddToCart } from '../../utils/cart';
import ViewCart from '../Common/ViewCart';

const Native = ( { attributes, type, id = '' } ) => {
	const { product = {}, content = {}, options = {}, cart = {}, i18n = {} } = attributes;
	const ref = useRef( null );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( '' );
	const [ hasAdded, setHasAdded ] = useState( false );
	const announceTimer = useRef( null );

	const announce = ( note ) => {
		setMessage( '' );
		clearTimeout( announceTimer.current );
		announceTimer.current = setTimeout( () => setMessage( note ), 60 );
	};
	useEffect( () => () => clearTimeout( announceTimer.current ), [] );

	useEffect( () => {
		const root = ref.current;
		if ( ! root ) return;

		if ( id ) {
			root.querySelectorAll( '[id]' ).forEach( ( el ) => {
				const own = `${ id }-${ el.id }`;
				root.querySelectorAll( 'label[for]' ).forEach( ( label ) => {
					if ( label.htmlFor === el.id ) label.htmlFor = own;
				} );
				el.id = own;
			} );
		}

		root.querySelectorAll( 'script' ).forEach( ( old ) => {
			const script = document.createElement( 'script' );
			[ ...old.attributes ].forEach( ( { name, value } ) => script.setAttribute( name, value ) );
			script.text = old.text;
			old.replaceWith( script );
		} );
	}, [] );

	useEffect( () => {
		const $ = window.jQuery;
		if ( ! ref.current || ! $?.fn?.wc_variation_form || 'undefined' === typeof window.wc_add_to_cart_variation_params ) return;

		const forms = $( ref.current ).find( '.variations_form' );
		if ( ! forms.length ) return;

		const isStarted = ( form ) => !! $._data?.( form, 'events' )?.check_variations;

		$( () => forms.each( function () {
			if ( ! isStarted( this ) ) $( this ).wc_variation_form();
		} ) );
	}, [] );

	useEffect( () => {
		const button = ref.current?.querySelector( '.single_add_to_cart_button' );
		const { svg: raw, position } = attributes.button?.icon || {};
		const svg = cleanSvg( raw );
		if ( ! button || ! svg || button.querySelector( `.${ BOX }-btn-icon` ) ) return;

		const label = document.createElement( 'span' );
		label.className = `${ BOX }-btn-label`;
		label.textContent = button.textContent.trim();

		const icon = document.createElement( 'span' );
		icon.className = `${ BOX }-btn-icon`;
		icon.setAttribute( 'aria-hidden', 'true' );
		icon.innerHTML = svg;

		button.textContent = '';
		if ( 'after' === position ) button.append( label, icon );
		else button.append( icon, label );
	}, [] );

	useEffect( () => {
		const form = ref.current?.querySelector( 'form.variations_form, form.grouped_form' );
		if ( ! form || ! [ 'variable', 'grouped' ].includes( product.type ) || form.querySelector( 'input[type=file]' ) ) return undefined;
		if ( ! cart.ajaxUrl || ! cart.nonce || ! product.id ) return undefined;

		const button = form.querySelector( '.single_add_to_cart_button' );
		const labelEl = button?.querySelector( `.${ BOX }-btn-label` ) || button;
		const label = labelEl ? labelEl.textContent : '';
		let timer = null;
		let busy = false;

		const LOADING = [ btnState( 'loading' ), 'loading' ];
		const DONE = [ btnState( 'added' ), btnState( 'error' ) ];

		const settle = ( state, note ) => {
			if ( button ) {
				button.classList.remove( ...LOADING );
				button.classList.add( btnState( state ) );
				if ( 'added' === state && content.addedText ) labelEl.textContent = content.addedText;
			}
			setError( 'error' === state ? note : '' );
			announce( note );
			clearTimeout( timer );
			timer = setTimeout( () => {
				if ( ! button ) return;
				button.classList.remove( ...DONE );
				labelEl.textContent = label;
			}, REVERT_MS );
		};

		const onSubmit = ( event ) => {
			event.preventDefault();
			if ( busy ) return;
			busy = true;
			clearTimeout( timer );
			setError( '' );
			if ( button ) {
				button.classList.remove( ...DONE );
				labelEl.textContent = label;
				button.classList.add( ...LOADING );
			}

			const fields = [ ...new FormData( form ).entries() ]
				.filter( ( [ name ] ) => ! [ 'add-to-cart', 'product_id', 'action', 'nonce' ].includes( name ) )
				.map( ( [ name, value ] ) => [ name, String( value ) ] );

			postAddToCart( cart, [ [ 'product_id', String( product.id ) ], ...fields ] )
				.then( ( json ) => {
					if ( ! json?.success || ! json?.data?.added ) {
						settle( 'error', json?.data?.message || i18n.failed );
						return;
					}

					const target = json.data.cartUrl || cart.cartUrl;
					if ( options.redirectToCart && target ) {
						button?.classList.remove( ...LOADING );
						window.location.assign( target );
						return;
					}
					const added = ( i18n.addedToCart || '%s' ).replace( /%(?:1\$)?s/, json.data.productName || product.name || '' );

					settle( 'added', json.data.message ? `${ added } ${ json.data.message }` : added );
					if ( json.data.message ) setError( json.data.message );
					setHasAdded( true );
					announceAdded( json.data );
				} )
				.catch( () => settle( 'error', i18n.failed ) )
				.finally( () => {
					busy = false;
				} );
		};

		const stopRestore = onPageRestore( () => {
			busy = false;
			button?.classList.remove( ...LOADING );
		} );

		form.addEventListener( 'submit', onSubmit );
		return () => {
			form.removeEventListener( 'submit', onSubmit );
			clearTimeout( timer );
			stopRestore();
		};
	}, [] );

	const html = { __html: 'string' === typeof product.html ? product.html : '' };

	return <div className={ boxClasses( attributes, type, attributes.plan ) }>
		{ 'unavailable' === type
			? <div ref={ ref } className={ `${ BOX }-inner` } dangerouslySetInnerHTML={ html } />
			: <div ref={ ref } className={ `${ BOX }-native` } dangerouslySetInnerHTML={ html } /> }

		{ options.viewCart && hasAdded && <ViewCart attributes={ attributes } /> }
		{ error && <p className={ `${ BOX }-message` } aria-hidden='true'>{ error }</p> }

		<span className={ `${ BOX }-status screen-reader-text` } aria-live='polite' aria-atomic='true'>{ message }</span>
	</div>;
};

export default Native;
