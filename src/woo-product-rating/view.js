import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Rating from './Components/Frontend/Rating';

const init = () => {
	const ratingEls = document.querySelectorAll( '.wp-block-b-blocks-woo-product-rating[data-attributes]' );

	ratingEls.forEach( ( ratingEl ) => {
		let attributes;
		try {
			attributes = JSON.parse( ratingEl.dataset.attributes );
		} catch {
			return;
		}

		createRoot( ratingEl ).render( <>
			<Style attributes={ attributes } id={ ratingEl.id } />

			<Rating attributes={ attributes } />
		</> );

		ratingEl?.removeAttribute( 'data-attributes' );
	} );
};

'loading' === document.readyState ? document.addEventListener( 'DOMContentLoaded', init ) : init();
