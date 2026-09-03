import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) }
];

export { itemSideOptions, timelineBlockName, timelineItemBlockName } from '../../timeline/utils/options';

// An empty value means "follow the parent Timeline". Start and end read as
// top/bottom in a vertical timeline and left/right in a horizontal one, so
// Entry.js labels them from the parent's direction.
export const itemArrowAlignValues = [ '', 'start', 'center', 'end' ];
