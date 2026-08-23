/**
 * Event Card — schema.org Event JSON-LD (frontend).
 *
 * Emitted by view.js so the page stays eligible for Google rich results. `<`
 * is escaped so user content containing "</script>" can't break out.
 */

import { buildEventSchema } from '../../utils/functions';

const EventSchema = ({ attributes }) => {
	const schema = buildEventSchema(attributes);
	if (!schema) return null;

	const json = JSON.stringify(schema).replace(/</g, '\\u003c');

	return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: json }} />;
};
export default EventSchema;
