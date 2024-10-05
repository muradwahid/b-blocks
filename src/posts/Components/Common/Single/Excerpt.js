import { prefix } from '../../../utils/data';
import { truncate, strLength } from '../../../utils/functions';

const Excerpt = ({ post, attributes }) => {
	const { excerpt, content } = post;
	const { isExcerpt, isExcerptFromContent, isEllipsisOnExcerpt, excerptLength } = attributes;

	const finalExcerpt = (!isExcerptFromContent && excerpt) ? excerpt : content;
	const ellipsis = (isEllipsisOnExcerpt && (strLength(finalExcerpt) > excerptLength)) ? '...' : '';
	const excerptContent = -1 === excerptLength ? finalExcerpt : `${truncate(finalExcerpt, excerptLength)}${ellipsis}`;

	return (isExcerpt && finalExcerpt) ? <div className={`${prefix}ElExcerpt`} dangerouslySetInnerHTML={{ __html: excerptContent }} /> : null;
};
export default Excerpt;