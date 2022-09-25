import FeatureImage from '../Single/FeatureImage';
import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

const Default = ({ post, attributes }) => {
	const { id } = post;
	const { layout, subLayout } = attributes;

	return <article className={`bBlocksPost bBlocksPost-${id} bBlocksPostDefault ${'slider' === layout ? 'swiper-slide' : ''}`}>
		<FeatureImage atts={attributes} post={post} />

		<div className='bBlocksPostText'>
			<PostTitle atts={attributes} post={post} />

			<PostMeta atts={attributes} post={post} />

			{'title-meta' !== subLayout && <>
				<PostExcerpt atts={attributes} post={post} />
				<PostReadMore atts={attributes} post={post} />
			</>}
		</div>
	</article>;
};
export default Default;