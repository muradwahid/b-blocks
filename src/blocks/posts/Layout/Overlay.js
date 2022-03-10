// Components
import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

// Functions
import func from '../../../Const/functions';
const { mediaUrl } = func;

const Overlay = ({ post, attributes }) => {
	const { id, featured_media } = post;
	const { layout, subLayout } = attributes;

	return <article className={`bBlocksPost bBlocksPost-${id} bBlocksPostOverlay ${'overlay-content-hover' === subLayout && mediaUrl(featured_media) ? 'bBlocksPostOverlayHover' : ''} ${'overlay-box' === subLayout ? 'bBlocksPostOverlayBox' : ''} ${'slider' === layout ? 'swiper-slide' : ''}`}>
		<div className='bBlocksPostText'>
			<PostTitle atts={attributes} post={post} />

			<PostMeta atts={attributes} post={post} />

			{'overlay-box' !== subLayout && <>
				<PostExcerpt atts={attributes} post={post} />
				<PostReadMore atts={attributes} post={post} />
			</>}
		</div>
	</article>;
};
export default Overlay;