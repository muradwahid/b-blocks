import FeatureImage from '../Single/FeatureImage';
import TitleMeta from '../Single/TitleMeta';
import Excerpt from '../Single/Excerpt';
import ReadMore from '../Single/ReadMore';
import { classNames } from '../../../utils/functions';
import { prefix } from '../../../utils/data';

const Default = ({ post, attributes, postClass }) => {
	const { subLayout } = attributes;

	const className = classNames(postClass, `${prefix}SLDefault`);

	return <article className={className}>
		<FeatureImage post={post} attributes={attributes} />

		<div className={`${prefix}ElTexts`}>
			<TitleMeta post={post} attributes={attributes} />

			{'title-meta' !== subLayout && <>
				<Excerpt post={post} attributes={attributes} />
				<ReadMore post={post} attributes={attributes} />
			</>}
		</div>
	</article>;
};
export default Default;