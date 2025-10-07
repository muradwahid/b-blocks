import FeatureImage from '../Single/FeatureImage';
import TitleMeta from '../Single/TitleMeta';
import Excerpt from '../Single/Excerpt';
import ReadMore from '../Single/ReadMore';
import { classNames } from '../../../utils/functions';
import { prefix } from '../../../utils/data';

const SideImage = ({ post, attributes, postClass }) => {
	const { thumbnail } = post;
	const { subLayout, isFImg } = attributes;

	const isLeftImg = 'left-image' === subLayout;
	const isRightImg = 'right-image' === subLayout;
	const className = classNames(postClass, `${prefix}SLSideImage`, {
		'grid': isFImg && thumbnail.url,
		'leftImage': isLeftImg,
		'rightImage': isRightImg
	});

	return <article className={className}>
		{isLeftImg && <FeatureImage post={post} attributes={attributes} />}

		<div className={`${prefix}ElTexts`}>
			<TitleMeta post={post} attributes={attributes} />

			<Excerpt post={post} attributes={attributes} />
			<ReadMore post={post} attributes={attributes} />
		</div>

		{isRightImg && <FeatureImage post={post} attributes={attributes} />}
	</article>;
};
export default SideImage;