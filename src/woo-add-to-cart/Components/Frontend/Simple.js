import { useEffect, useRef, useState } from 'react';

import { BOX, boxClasses, btnState, prefix } from '../../utils/functions';
import { REVERT_MS, announceAdded, onPageRestore, postAddToCart } from '../../utils/cart';
import ButtonContent from '../Common/ButtonContent';
import ViewCart from '../Common/ViewCart';

const Simple = ( { attributes, id, limits } ) => {
	const { content = {}, options = {}, product = {}, cart = {}, i18n = {} } = attributes;
	const { min, max, step, allowZero = false } = limits;

	const floor = allowZero ? 0 : min;
	const top = min + ( Math.floor( ( max - min ) / step ) * step );
	const clamp = ( value ) => {
		const n = parseInt( value, 10 );
		if ( Number.isNaN( n ) ) return floor;
		if ( allowZero && n <= 0 ) return 0;
		const onStep = min + ( Math.round( ( Math.max( min, n ) - min ) / step ) * step );
		return Math.min( top, onStep );
	};

	const [ qty, setQty ] = useState( String( options.quantity ) );
	const [ state, setState ] = useState( '' ); // '' | 'loading' | 'added' | 'error'
	const [ hasAdded, setHasAdded ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( '' );
	const timer = useRef( null );
	const announceTimer = useRef( null );
	const inputRef = useRef( null );

	useEffect( () => () => {
		clearTimeout( timer.current );
		clearTimeout( announceTimer.current );
	}, [] );

	useEffect( () => onPageRestore( () => setState( '' ) ), [] );

	const announce = ( note ) => {
		setMessage( '' );
		clearTimeout( announceTimer.current );
		announceTimer.current = setTimeout( () => setMessage( note ), 60 );
	};

	const configured = !! ( cart.ajaxUrl && cart.nonce && product.id );

	const isInput = 'input' === options.quantityStyle;
	const qtyId = `${ id || prefix }-qty`;
	const fail = i18n.failed;

	const settle = ( next, note ) => {
		setState( next );
		setError( 'error' === next ? note : '' );
		announce( note );
		clearTimeout( timer.current );
		timer.current = setTimeout( () => setState( '' ), REVERT_MS );
	};

	const add = () => {
		if ( 'loading' === state || ! configured ) return;
		clearTimeout( timer.current );
		setError( '' );

		const quantity = options.showQuantity ? clamp( qty ) : min;
		setQty( String( quantity ) );

		if ( quantity < 1 ) {
			settle( 'error', i18n.chooseQuantity );
			inputRef.current?.focus();
			return;
		}

		setState( 'loading' );

		postAddToCart( cart, [ [ 'product_id', String( product.id ) ], [ 'quantity', String( quantity ) ] ] )
			.then( ( json ) => {
				if ( ! json?.success || ! json?.data?.added ) {
					settle( 'error', json?.data?.message || fail );
					return;
				}

				const target = json.data.cartUrl || cart.cartUrl;
				if ( options.redirectToCart && target ) {
					setState( '' );
					window.location.assign( target );
					return;
				}

				const added = ( i18n.addedToCart || '%s' ).replace( /%(?:1\$)?s/, json.data.productName || product.name || '' );

				settle( 'added', json.data.message ? `${ added } ${ json.data.message }` : added );
				if ( json.data.message ) setError( json.data.message );
				setHasAdded( true );
				announceAdded( json.data );
			} )
			.catch( () => settle( 'error', fail ) );
	};

	const stepBy = ( direction ) => {
		const n = parseInt( qty, 10 );
		const current = Number.isNaN( n ) ? floor : n;
		let next = current + ( direction * step );
		if ( allowZero && direction > 0 && current < min ) next = min;
		if ( allowZero && direction < 0 && next < min ) next = 0;
		setError( '' );
		setQty( String( clamp( next ) ) );
	};

	return <div className={ boxClasses( attributes, 'simple', attributes.plan ) }>
		<div className={ `${ BOX }-inner` }>
			{ options.showQuantity && <div className={ `${ BOX }-qty ${ BOX }-qty--${ isInput ? 'input' : 'stepper' }` }>
				<label className='screen-reader-text' htmlFor={ qtyId }>{ i18n.quantity }</label>
				{ ! isInput && <button type='button' className={ `${ BOX }-qty-btn ${ BOX }-qty-minus` } aria-label={ i18n.decrease } onClick={ () => stepBy( -1 ) }>&minus;</button> }
				<input
					type='number'
					className={ `${ BOX }-qty-input` }
					id={ qtyId }
					ref={ inputRef }
					value={ qty }
					min={ floor }
					max={ max }
					step={ step }
					inputMode='numeric'
					onChange={ ( e ) => {
						setError( '' );
						setQty( e.target.value );
					} }
					onBlur={ () => setQty( String( clamp( qty ) ) ) }

					onKeyDown={ ( e ) => {
						if ( 'Enter' === e.key ) {
							e.preventDefault();
							add();
						}
					} }
				/>
				{ ! isInput && <button type='button' className={ `${ BOX }-qty-btn ${ BOX }-qty-plus` } aria-label={ i18n.increase } onClick={ () => stepBy( 1 ) }>&#43;</button> }
			</div> }

			<button
				type='button'
				className={ [ `${ BOX }-btn`, state && btnState( state ) ].filter( Boolean ).join( ' ' ) }
				aria-busy={ 'loading' === state }
				disabled={ ! configured }
				onClick={ add }
			>
				<ButtonContent icon={ attributes.button?.icon }>
					<span className={ `${ BOX }-btn-label` }>{ 'added' === state ? content.addedText : content.buttonText }</span>
				</ButtonContent>

				{ product.name && <span className='screen-reader-text'>{ `, ${ product.name }` }</span> }
			</button>

			{ options.viewCart && hasAdded && <ViewCart attributes={ attributes } /> }
		</div>

		{ error && <p className={ `${ BOX }-message` } aria-hidden='true'>{ error }</p> }

		<span className={ `${ BOX }-status screen-reader-text` } aria-live='polite' aria-atomic='true'>{ message }</span>
	</div>;
};

export default Simple;
