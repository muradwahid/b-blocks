import { sanitizeHTML } from '../../../../../../bpl-tools/utils/common';

import { prefix } from '../../../utils/data';

const ReadMore = ({ post, attributes }) => {
	const { link } = post;
	const { isReadMore, readMorePosition = 'auto', readMoreLabel, isLinkNewTab } = attributes;

	return isReadMore ? <div className={`${prefix}ElReadMore ${readMorePosition}`}>
		<a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer' dangerouslySetInnerHTML={{ __html: sanitizeHTML(readMoreLabel) }} aria-label={readMoreLabel} />
	</div> : null;
};
export default ReadMore;