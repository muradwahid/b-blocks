import TitleMeta from '../Single/TitleMeta';
import Excerpt from '../Single/Excerpt';
import ReadMore from '../Single/ReadMore';
import { classNames } from '../../../utils/functions';
import { prefix } from '../../../utils/data';

const Overlay = ({ post, attributes, postClass }) => {
	const { title, thumbnail: { url: thumbUrl } } = post;
	const { subLayout } = attributes;

	const className = classNames(postClass, `${prefix}SLOverlay`, {
		[`${prefix}SLOverlayHover`]: 'overlay-content-hover' === subLayout && thumbUrl,
		[`${prefix}SLOverlayBox`]: 'overlay-box' === subLayout || 'overlay-content-box' === subLayout,
		[`${prefix}SLOverlayHalfContent`]: 'overlay-half-content' === subLayout
	});

	return <article className={className}>
		{thumbUrl && <img src={thumbUrl} alt={title} />}

		<div className={`${prefix}ElTexts`}>
			<TitleMeta post={post} attributes={attributes} />

			{'overlay-box' !== subLayout && 'overlay-half-content' !== subLayout && <>
				<Excerpt post={post} attributes={attributes} />
				<ReadMore post={post} attributes={attributes} />
			</>}
		</div>
	</article>;
};

export default Overlay;