import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Frontend from './Components/Frontend/Frontend';

document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.wp-block-b-blocks-floating-cta' );

	blocks.forEach( ( block ) => {
		// Guard against double-binding when a pattern repeats the block.
		if ( block.dataset.bbFcInit === '1' || ! block.dataset.attributes ) {
			return;
		}
		block.dataset.bbFcInit = '1';

		const attributes = JSON.parse( block.dataset.attributes );

		createRoot( block ).render(
			<>
				<Style attributes={ attributes } id={ block.id } />
				<Frontend attributes={ attributes } />
			</>
		);

		block.removeAttribute( 'data-attributes' );
	} );
} );
