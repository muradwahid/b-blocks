import { createRoot } from 'react-dom/client';

import './style.scss';
import style from './Components/Common/Style';
import AddToCart from './Components/Frontend/AddToCart';

const SELECTOR = '.wp-block-b-blocks-woo-add-to-cart[data-attributes]';

const mount = ( cartEl ) => {
	let attributes;
	try {
		attributes = JSON.parse( cartEl?.dataset?.attributes );
	} catch ( error ) {
		return;
	}

	// Taken first, so a block is never mounted twice.
	cartEl.removeAttribute( 'data-attributes' );

	createRoot( cartEl ).render( <>
		<style dangerouslySetInnerHTML={ { __html: style( attributes, cartEl.id ) } } />

		<AddToCart attributes={ attributes } id={ cartEl.id } />
	</> );
};

/** Mounts every block in `root` not mounted yet. */
const init = ( root = document ) => root.querySelectorAll( SELECTOR ).forEach( mount );

const start = () => {
	init();

	new window.MutationObserver( ( records ) => records.forEach( ( { addedNodes } ) => addedNodes.forEach( ( node ) => {
		if ( 1 !== node.nodeType ) return;
		if ( node.matches( SELECTOR ) ) mount( node );
		else if ( node.querySelector( SELECTOR ) ) init( node );
	} ) ) ).observe( document.body, { childList: true, subtree: true } );
};

// For themes and plugins that insert blocks their own way.
window.bBlocksWooAddToCart = { init };

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', start );
} else {
	start();
}