import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Blockquote from './Components/Frontend/Blockquote';

document.addEventListener( 'DOMContentLoaded', () => {
	const blockquoteEls = document.querySelectorAll( '.wp-block-b-blocks-blockquote' );

	blockquoteEls.forEach( ( blockquoteEl ) => {
		const attributes = JSON.parse( blockquoteEl.dataset.attributes );

		createRoot( blockquoteEl ).render( <>
			<Style attributes={ attributes } id={ blockquoteEl.id } />

			<Blockquote attributes={ attributes } />
		</> );

		blockquoteEl?.removeAttribute( 'data-attributes' );
	} );
} );
