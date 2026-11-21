import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import AdvancedSearch from './Components/Frontend/AdvancedSearch';

// Mounts every Advanced Search on the page (each with its own state). Run at once when the script arrives late
// ("delay JavaScript" optimisers load it after DOMContentLoaded has fired).
const mount = () => {
	document.querySelectorAll( '.wp-block-b-blocks-advanced-search' ).forEach( ( searchEl ) => {
		if ( ! searchEl.dataset.attributes ) {
			return;
		}
		const attributes = JSON.parse( searchEl.dataset.attributes );

		createRoot( searchEl ).render( <>
			<Style attributes={ attributes } id={ searchEl.id } />

			<AdvancedSearch attributes={ attributes } context={ attributes.context } labels={ attributes.context?.labels } />
		</> );

		searchEl.removeAttribute( 'data-attributes' );
	} );
};

'loading' === document.readyState ? document.addEventListener( 'DOMContentLoaded', mount ) : mount();