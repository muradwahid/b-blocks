import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Price from './Components/Frontend/Price';

document.addEventListener( 'DOMContentLoaded', () => {
	const priceEls = document.querySelectorAll( '.wp-block-b-blocks-woo-product-price[data-attributes]' );

	priceEls.forEach( ( priceEl ) => {
		const attributes = JSON.parse( priceEl.dataset.attributes );

		createRoot( priceEl ).render( <>
			<Style attributes={ attributes } id={ priceEl.id } />

			<Price attributes={ attributes } />
		</> );

		priceEl?.removeAttribute( 'data-attributes' );
	} );
} );