import FeatureImage from '../Single/FeatureImage';
import TitleMeta from '../Single/TitleMeta';
import Excerpt from '../Single/Excerpt';
import ReadMore from '../Single/ReadMore';
import { classNames } from '../../../utils/functions';

const Default = ({ post, attributes, postClass }) => {
	const { subLayout } = attributes;

	const className = classNames(postClass, 'bBlocksDefault');

	return <article className={className}>
		<FeatureImage post={post} attributes={attributes} />

		<div className='bBlocksText'>
			<TitleMeta post={post} attributes={attributes} />

			{'title-meta' !== subLayout && <>
				<Excerpt post={post} attributes={attributes} />
				<ReadMore post={post} attributes={attributes} />
			</>}
		</div>
	</article>;
};
export default Default;