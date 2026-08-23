import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import StatCards from './Components/Frontend/StatCards';

document.addEventListener( 'DOMContentLoaded', () => {
	const els = document.querySelectorAll( '.wp-block-b-blocks-stat-cards' );

	els.forEach( ( el ) => {
		const attributes = JSON.parse( el.dataset.attributes );

		createRoot( el ).render( <>
			<Style attributes={ attributes } id={ el.id } />

			<StatCards attributes={ attributes } />
		</> );

		el?.removeAttribute( 'data-attributes' );
	} );
} );
