import { createRoot } from 'react-dom/client';

import './style.scss';
import style from './Components/Common/Style';
import Gallery from './Components/Frontend/Gallery';

const SELECTOR = '.wp-block-b-blocks-woo-product-images[data-attributes]';

const roots = new Map();

const mount = ( el ) => {
	let attributes;
	try {
		attributes = JSON.parse( el.dataset.attributes );
	} catch ( error ) {
		return;
	}

	el.removeAttribute( 'data-attributes' );

	const { product = {}, i18n = {} } = attributes;

	const root = createRoot( el );
	roots.set( el, root );
	root.render( <>
		<style dangerouslySetInnerHTML={ { __html: style( attributes, el.id ) } } />

		<Gallery attributes={ attributes } images={ product.images || [] } i18n={ i18n } productId={ product.id } variable={ !! product.variable } onSale={ !! product.onSale } discount={ product.discount || 0 } />
	</> );
};

const init = ( root = document ) => root.querySelectorAll( SELECTOR ).forEach( mount );

const start = () => {
	init();

	new window.MutationObserver( ( records ) => {
		let removed = false;
		records.forEach( ( { addedNodes, removedNodes } ) => {
			removed = removed || 0 < removedNodes.length;
			addedNodes.forEach( ( node ) => {
				if ( 1 !== node.nodeType ) return;
				if ( node.matches( SELECTOR ) ) mount( node );
				else if ( node.querySelector( SELECTOR ) ) init( node );
			} );
		} );
		if ( removed && roots.size ) {
			roots.forEach( ( root, el ) => {
				if ( el.isConnected ) return;
				root.unmount();
				roots.delete( el );
			} );
		}
	} ).observe( document.body, { childList: true, subtree: true } );
};

window.bBlocksWooProductImages = { init };

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', start );
} else {
	start();
}