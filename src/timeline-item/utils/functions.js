/**
 * The item's class list is shared with the server renderer: an explicit side
 * or arrow alignment outranks what the parent Timeline applies in style.scss.
 * Mirrored in render.php.
 */
export { getTimelineItemClasses } from '../../timeline/utils/functions';

import metadata from '../block.json';
import { mergeDefaults } from '../../timeline/utils/functions';

const itemDefaults = Object.fromEntries(
	Object.entries( metadata.attributes ).map( ( [ key, schema ] ) => [ key, schema.default ] )
);

/**
 * Fill gaps in a partially-saved `item` object from the schema defaults, so a
 * block saved before a key existed cannot throw when it is read. See the note
 * on mergeDefaults in the parent's utils/functions.js.
 */
export const withItemDefaults = ( attributes = {} ) => mergeDefaults( itemDefaults, attributes );
