import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Divider from './Components/Frontend/Divider';

document.addEventListener( 'DOMContentLoaded', () => {
	const dividerEls = document.querySelectorAll( '.wp-block-b-blocks-divider' );

	dividerEls.forEach( ( dividerEl ) => {
		const attributes = JSON.parse( dividerEl.dataset.attributes );

		createRoot( dividerEl ).render( <>
			<Style attributes={ attributes } id={ dividerEl.id } />

			<Divider attributes={ attributes } />
		</> );

		dividerEl?.removeAttribute( 'data-attributes' );
	} );
} );
