import { createRoot } from 'react-dom/client';
import FrontEnd from './FrontEnd';
import './style.scss';

document.addEventListener( 'DOMContentLoaded', function () {
	const timelines = document.querySelectorAll( '.wp-block-b-blocks-timeline' );

	timelines.forEach( ( timeline ) => {
		const raw = timeline.dataset.attributes;
		if ( ! raw ) {
			return;
		}

		let attributes;
		try {
			attributes = JSON.parse( raw );
		} catch ( e ) {
			return;
		}

		createRoot( timeline ).render( <FrontEnd attributes={ attributes } /> );

		timeline.removeAttribute( 'data-attributes' );
	} );
} );
