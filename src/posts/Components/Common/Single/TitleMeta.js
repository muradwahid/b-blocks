import Meta from './Meta';
import Title from './Title';

const TitleMeta = ({ post, attributes }) => {
	const { elementsSort = ['title', 'meta'] } = attributes;

	return elementsSort.map((el, index) => 'title' === el ? <Title key={index} post={post} attributes={attributes} /> : <Meta key={index} post={post} attributes={attributes} />)
}
export default TitleMeta;