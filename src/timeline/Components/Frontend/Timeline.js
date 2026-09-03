import { useEffect, useLayoutEffect, useRef } from 'react';

import { getTimelineClasses, withTimelineDefaults } from '../../utils/functions';
import { attachLine } from '../Common/measureLine';
import { trackProgress } from '../Common/progress';

/**
 * Renders the timeline shell and moves the PHP-rendered entries into it.
 *
 * The entries are InnerBlocks, so they cannot be re-created here — they are
 * adopted once, the way the Data Table and Carousel blocks adopt theirs. The
 * reference is captured in view.js before React mounts: React empties the
 * wrapper on its first render, but a detached node keeps its children, so they
 * survive to be moved into place.
 *
 * @param {Object}      props
 * @param {Object}      props.attributes      Block attributes.
 * @param {HTMLElement} props.templateContent The server-rendered entries.
 */
const Timeline = ( { attributes, templateContent } ) => {
	const itemsRef = useRef( null );
	const resolved = withTimelineDefaults( attributes );
	const { layout, connector } = resolved;

	// render.php writes the wrapper bare, so its structural classes are applied
	// here — the same helper the editor uses, which keeps one source of truth
	// instead of a copy in PHP that has to be kept in step.
	//
	// A layout effect so they land before the first paint. Only this block's
	// own classes are replaced; WordPress adds its own to the same element.
	useLayoutEffect( () => {
		const wrapper = itemsRef.current?.closest( '.wp-block-b-blocks-timeline' );

		if ( ! wrapper ) {
			return;
		}

		const theirs = Array.from( wrapper.classList ).filter( ( name ) => ! name.startsWith( 'b-blocks-timeline' ) );

		wrapper.className = [ ...theirs, getTimelineClasses( resolved ) ].join( ' ' );
	} );
	const { progress } = connector.line;

	useEffect( () => {
		const items = itemsRef.current;

		if ( ! items || ! templateContent ) {
			return undefined;
		}

		// Move once — a second pass would find the holder already empty.
		if ( '1' !== templateContent.dataset.moved ) {
			items.append( ...Array.from( templateContent.children ) );
			templateContent.dataset.moved = '1';
		}

		return attachLine( items, {
			extent: connector.line.extent
		} );
	}, [ templateContent, layout, connector ] );

	useEffect( () => {
		if ( ! progress || ! itemsRef.current ) {
			return undefined;
		}

		return trackProgress( itemsRef.current );
	}, [ progress ] );

	return <div className='b-blocks-timeline-items' ref={ itemsRef } />;
};

/**
 * The progress line style needs the one piece of runtime behaviour in the
 * block: a fill that follows the reader down the timeline. The fraction is
 * written to `--bb-tl-line-progress` and the stylesheet reveals the fill from
 * it, so nothing is laid out or measured from JavaScript.
 *
 * Reads are batched into a rAF callback and the listener is passive, so
 * scrolling stays off the main thread's critical path, and a timeline is only
 * measured while it is on screen.
 *
 * @param {HTMLElement} items The entries container.
 * @return {Function} Cleanup.
 */

export default Timeline;
