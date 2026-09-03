import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Timeline from './Components/Frontend/Timeline';

document.addEventListener( 'DOMContentLoaded', () => {
	const timelines = document.querySelectorAll( '.wp-block-b-blocks-timeline[data-attributes]' );

	timelines.forEach( ( timeline ) => {
		let attributes = {};

		try {
			const raw = timeline.dataset.attributes;
			if ( raw && 'undefined' !== raw && '' !== raw ) {
				attributes = JSON.parse( raw );
			}
		} catch ( e ) {
			// eslint-disable-next-line no-console
			console.warn( 'Timeline: Invalid attributes JSON', e );
			return;
		}

		// Captured before React mounts: rendering empties the wrapper, but the
		// detached holder keeps its children so Timeline can adopt them.
		const templateContent = timeline.querySelector( '.b-blocks-timeline-innerBlocks-contents > .b-blocks-timeline-items' );

		if ( ! templateContent ) {
			return;
		}

		createRoot( timeline ).render( <>
			<Style attributes={ attributes } id={ timeline.id } />

			<Timeline attributes={ attributes } templateContent={ templateContent } />
		</> );

		timeline?.removeAttribute( 'data-attributes' );
	} );
} );
