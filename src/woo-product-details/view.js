import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Details from './Components/Frontend/Details';

const init = () => {
	const detailsEls = document.querySelectorAll( '.wp-block-b-blocks-woo-product-details[data-attributes]' );

	detailsEls.forEach( ( detailsEl ) => {

		let attributes;
		try {
			attributes = JSON.parse( detailsEl.dataset.attributes );
		} catch {
			return;
		}

		createRoot( detailsEl ).render( <>
			<Style attributes={ attributes } id={ detailsEl.id } />

			<Details attributes={ attributes } />
		</> );

		detailsEl?.removeAttribute( 'data-attributes' );
	} );
};

'loading' === document.readyState ? document.addEventListener( 'DOMContentLoaded', init ) : init();