import { createRoot } from 'react-dom/client';

import Style from './Components/Common/Style';

/**
 * A Timeline Item's card holds InnerBlocks, so the markup is rendered by PHP
 * and must not be replaced on the client. Only the entry's own <style> is
 * mounted, into the empty host render.php leaves for it.
 *
 * The item's styles ship with the parent Timeline's stylesheet — an entry is
 * never rendered outside a Timeline, so there is nothing to load separately.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const items = document.querySelectorAll( '.wp-block-b-blocks-timeline-item[data-attributes]' );

	items.forEach( ( item ) => {
		let attributes = {};

		try {
			const raw = item.dataset.attributes;
			if ( raw && 'undefined' !== raw && '' !== raw ) {
				attributes = JSON.parse( raw );
			}
		} catch ( e ) {
			// eslint-disable-next-line no-console
			console.warn( 'Timeline Item: Invalid attributes JSON', e );
			return;
		}

		// `:scope >` so an entry nested inside this one's inner blocks does
		// not steal this style host.
		const styleHost = item.querySelector( ':scope > .b-blocks-timeline-item-style' );
		if ( ! styleHost ) {
			return;
		}

		createRoot( styleHost ).render( <Style attributes={ attributes } id={ item.id } /> );

		item.removeAttribute( 'data-attributes' );
	} );
} );
