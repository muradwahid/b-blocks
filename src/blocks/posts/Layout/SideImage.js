import FeatureImage from '../Single/FeatureImage';
import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

const SideImage = ({ post, attributes }) => {
	const { id } = post;
	const { layout, subLayout } = attributes;

	return <article className={`bBlocksPost bBlocksPost-${id} bBlocksPostSideImage ${'left-image' === subLayout ? 'leftImage' : 'right-image' === subLayout ? 'rightImage' : ''} ${'slider' === layout ? 'swiper-slide' : ''}`}>
		{'left-image' === subLayout && <FeatureImage post={post} attributes={attributes} />}

		<div className='bBlocksPostText'>
			<PostTitle post={post} attributes={attributes} />

			<PostMeta post={post} attributes={attributes} />

			<PostExcerpt post={post} attributes={attributes} />
			<PostReadMore post={post} attributes={attributes} />
		</div>

		{'right-image' === subLayout && <FeatureImage post={post} attributes={attributes} />}
	</article>;
};
export default SideImage;