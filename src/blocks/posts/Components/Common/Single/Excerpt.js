import { truncate, strLength } from '../../../utils/functions';

const Excerpt = ({ post, attributes }) => {
	const { excerpt, content } = post;
	const { isExcerpt, isExcerptFromContent, isEllipsisOnExcerpt, excerptLength } = attributes;

	const finalExcerpt = (!isExcerptFromContent && excerpt) ? excerpt : content;
	const ellipsis = (isEllipsisOnExcerpt && (strLength(finalExcerpt) > excerptLength)) ? '...' : '';

	return (isExcerpt && finalExcerpt) ? <div className='bBlocksExcerpt bBlocksInnerContent' dangerouslySetInnerHTML={{ __html: `${truncate(finalExcerpt, excerptLength)}${ellipsis}` }} /> : null;
};
export default Excerpt;