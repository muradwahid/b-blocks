import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ProductCarousel from './Components/Frontend/ProductCarousel';

const init = () => {
	const carouselEls = document.querySelectorAll( '.wp-block-b-blocks-woo-product-carousel[data-attributes]' );

	carouselEls.forEach( ( carouselEl ) => {
		let attributes;
		try {
			attributes = JSON.parse( carouselEl.dataset.attributes );
		} catch {
			return;
		}

		createRoot( carouselEl ).render( <>
			<Style attributes={ attributes } id={ carouselEl.id } />

			<ProductCarousel attributes={ attributes } products={ attributes.products || [] } labels={ attributes.labels || {} } />
		</> );

		carouselEl?.removeAttribute( 'data-attributes' );
	} );
};

'loading' === document.readyState ? document.addEventListener( 'DOMContentLoaded', init ) : init();