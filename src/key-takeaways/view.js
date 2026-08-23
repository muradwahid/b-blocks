import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import KeyTakeaways from './Components/Frontend/KeyTakeaways';

document.addEventListener( 'DOMContentLoaded', () => {
	const els = document.querySelectorAll( '.wp-block-b-blocks-key-takeaways' );

	els.forEach( ( el ) => {
		const attributes = JSON.parse( el.dataset.attributes );

		createRoot( el ).render( <>
			<Style attributes={ attributes } id={ el.id } />

			<KeyTakeaways attributes={ attributes } />
		</> );

		el?.removeAttribute( 'data-attributes' );
	} );
} );
