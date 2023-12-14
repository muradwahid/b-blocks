import TitleMeta from '../Single/TitleMeta';
import Excerpt from '../Single/Excerpt';
import ReadMore from '../Single/ReadMore';
import { classNames } from '../../../utils/functions';

const Overlay = ({ post, attributes, postClass }) => {
	const { title, thumbnail: { url: thumbUrl } } = post;
	const { subLayout } = attributes;

	const className = classNames(postClass, 'bBlocksOverlay', {
		'bBlocksOverlayHover': 'overlay-content-hover' === subLayout && thumbUrl,
		'bBlocksOverlayBox': 'overlay-box' === subLayout || 'overlay-content-box' === subLayout,
		'bBlocksOverlayHalfContent': 'overlay-half-content' === subLayout
	});

	return <article className={className}>
		{thumbUrl && <img src={thumbUrl} alt={title} />}

		<div className='bBlocksText'>
			<TitleMeta post={post} attributes={attributes} />

			{'overlay-box' !== subLayout && 'overlay-half-content' !== subLayout && <>
				<Excerpt post={post} attributes={attributes} />
				<ReadMore post={post} attributes={attributes} />
			</>}
		</div>
	</article>;
};

export default Overlay;