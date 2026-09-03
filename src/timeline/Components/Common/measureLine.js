/**
 * The timeline line is drawn by the stylesheet, but two things about it can
 * only be known from the rendered page: where the first and last markers
 * actually are, and — in a horizontal timeline — which row they ended up in.
 * Both depend on the entries' heights and on where Arrow Alignment has put
 * each marker, so they are measured here and handed to the stylesheet.
 */

const round3 = ( n ) => Math.round( n * 1000 ) / 1000;

/**
 * Measure a timeline's markers and publish the results.
 *
 * @param {HTMLElement} items     The `.b-blocks-timeline-items` container.
 * @param {Object}      options   `extent`.
 */
export const measureLine = ( items, options = {} ) => {
	if ( ! items ) {
		return;
	}

	// Read the axis off the rendered container rather than an attribute. The
	// direction is per breakpoint now, so the only thing that knows which way
	// this timeline is actually running at this width is the layout itself.
	const styles = getComputedStyle( items );
	const vertical = 'grid' === styles.display
		? ! styles.gridAutoFlow.includes( 'column' )
		: 'row' !== styles.flexDirection;

	const box = items.getBoundingClientRect();
	const length = vertical ? box.height : box.width;

	if ( ! length ) {
		return;
	}

	const markerEls = Array.from( items.querySelectorAll( ':scope > * > .b-blocks-timeline-marker' ) );

	// Marker centres, measured along the run relative to the container.
	const markers = markerEls
		.map( ( marker ) => {
			const rect = marker.getBoundingClientRect();
			return vertical
				? ( rect.top - box.top ) + ( rect.height / 2 )
				: ( rect.left - box.left ) + ( rect.width / 2 );
		} )
		.sort( ( a, b ) => a - b );

	// Where the markers sit across the run. A horizontal timeline shares its
	// three rows across every entry, so the marker row is only centred when
	// the cards above and below happen to be the same height — the line has to
	// follow the markers rather than assume the container's midpoint.
	if ( markerEls.length ) {
		const first = markerEls[ 0 ].getBoundingClientRect();
		const cross = vertical
			? ( first.left - box.left ) + ( first.width / 2 )
			: ( first.top - box.top ) + ( first.height / 2 );

		items.style.setProperty( '--bb-tl-line-cross', `${ round3( cross ) }px` );
	}

	// "Between markers" means exactly that: from the first marker's centre to
	// the last one's — a fixed inset was only ever right when every row
	// happened to be one marker tall.
	const spanMarkers = 'full' !== options.extent && markers.length > 0;
	const from = spanMarkers ? markers[ 0 ] : 0;
	const to = spanMarkers ? markers[ markers.length - 1 ] : length;

	items.style.setProperty( '--bb-tl-line-start', `${ round3( from ) }px` );
	items.style.setProperty( '--bb-tl-line-end', `${ round3( length - to ) }px` );
};

/**
 * Measure now, and keep the measurements in step with the content.
 *
 * @param {HTMLElement} items   The `.b-blocks-timeline-items` container.
 * @param {Object}      options `extent`.
 * @return {Function} Cleanup.
 */
export const attachLine = ( items, options = {} ) => {
	if ( ! items ) {
		return () => {};
	}

	let frame = null;
	const remeasure = () => {
		if ( null !== frame ) {
			return;
		}
		frame = requestAnimationFrame( () => {
			frame = null;
			measureLine( items, options );
		} );
	};

	remeasure();

	// Entries change height as their inner blocks are edited or images load,
	// which moves every marker below them.
	const observer = 'undefined' !== typeof ResizeObserver ? new ResizeObserver( remeasure ) : null;

	if ( observer ) {
		observer.observe( items );
		items.querySelectorAll( ':scope > *' ).forEach( ( item ) => observer.observe( item ) );
	} else {
		window.addEventListener( 'resize', remeasure );
	}

	return () => {
		if ( null !== frame ) {
			cancelAnimationFrame( frame );
		}
		if ( observer ) {
			observer.disconnect();
		} else {
			window.removeEventListener( 'resize', remeasure );
		}
	};
};
