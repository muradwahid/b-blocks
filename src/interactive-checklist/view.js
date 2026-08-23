import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Checklist from './Components/Frontend/Checklist';

document.addEventListener( 'DOMContentLoaded', () => {
	const els = document.querySelectorAll( '.wp-block-b-blocks-interactive-checklist' );

	els.forEach( ( el ) => {
		const attributes = JSON.parse( el.dataset.attributes );

		createRoot( el ).render( <>
			<Style attributes={ attributes } id={ el.id } />

			<Checklist attributes={ attributes } id={ el.id } />
		</> );

		el?.removeAttribute( 'data-attributes' );
	} );
} );
