import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

const Overlay = ({ post, attributes }) => {
	const { id, thumbnail } = post;
	const { layout, subLayout } = attributes;

	return <article className={`bBlocksPost bBlocksPost-${id} bBlocksPostOverlay ${'overlay-content-hover' === subLayout && thumbnail ? 'bBlocksPostOverlayHover' : ''} ${'overlay-box' === subLayout ? 'bBlocksPostOverlayBox' : ''} ${'slider' === layout ? 'swiper-slide' : ''}`}>
		<div className='bBlocksPostText'>
			<PostTitle post={post} attributes={attributes} />

			<PostMeta post={post} attributes={attributes} />

			{'overlay-box' !== subLayout && <>
				<PostExcerpt post={post} attributes={attributes} />
				<PostReadMore post={post} attributes={attributes} />
			</>}
		</div>
	</article>;
};
export default Overlay;