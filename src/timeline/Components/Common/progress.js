/**
 * Fills the timeline's line as the reader scrolls past it.
 *
 * Shared by the front end and the editor so the canvas previews the same
 * behaviour a visitor gets, rather than a fixed percentage that never moves.
 */
export const trackProgress = ( items ) => {
	// The editor renders the canvas in an iframe, so the window that scrolls
	// is the block's own — not the one this module was loaded into. Reading it
	// off the element is what lets the same tracker drive both.
	const view = items.ownerDocument?.defaultView || window;

	let frame = null;
	let visible = true;

	const update = () => {
		frame = null;

		const rect = items.getBoundingClientRect();
		const viewport = view.innerHeight || items.ownerDocument.documentElement.clientHeight;

		// Start filling once the top of the timeline reaches the middle of the
		// viewport, and finish when its bottom gets there.
		const travelled = ( viewport / 2 ) - rect.top;
		const total = rect.height || 1;
		const fraction = Math.min( Math.max( travelled / total, 0 ), 1 );

		items.style.setProperty( '--bb-tl-line-progress', fraction.toFixed( 4 ) );
	};

	const request = () => {
		if ( null === frame && visible ) {
			frame = requestAnimationFrame( update );
		}
	};

	const observer = 'undefined' !== typeof view.IntersectionObserver
		? new view.IntersectionObserver( ( entries ) => {
			visible = entries.some( ( entry ) => entry.isIntersecting );
			request();
		} )
		: null;

	if ( observer ) {
		observer.observe( items );
	}

	view.addEventListener( 'scroll', request, { passive: true } );
	view.addEventListener( 'resize', request, { passive: true } );
	update();

	return () => {
		if ( null !== frame ) {
			cancelAnimationFrame( frame );
		}
		if ( observer ) {
			observer.disconnect();
		}
		view.removeEventListener( 'scroll', request );
		view.removeEventListener( 'resize', request );
	};
};
