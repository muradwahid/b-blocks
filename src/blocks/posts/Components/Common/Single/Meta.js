import PostMetaAuthor from './MetaAuthor';
import PostMetaDate from './MetaDate';
import PostMetaCategory from './MetaCategory';
import MetaTaxonomies from './MetaTaxonomies';
import PostMetaReadTime from './MetaReadTime';
import PostMetaComment from './MetaComment';

const Meta = ({ post, attributes }) => {
	const { isMeta } = attributes;

	return isMeta && <div className='bBlocksMeta'>
		<PostMetaAuthor post={post} attributes={attributes} />
		<PostMetaDate post={post} attributes={attributes} />
		<PostMetaCategory post={post} attributes={attributes} />
		<MetaTaxonomies post={post} attributes={attributes} />
		<PostMetaReadTime post={post} attributes={attributes} />
		<PostMetaComment post={post} attributes={attributes} />
	</div>;
};
export default Meta;