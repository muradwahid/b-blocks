import { useRunJs } from '../hooks/useRunJs';

const HTMLBlock = ({ attributes }) => {
	const { htmlCode } = attributes;
	useRunJs(htmlCode,10)
	return <div dangerouslySetInnerHTML={{ __html: htmlCode }}>
	</div>;
}
export default HTMLBlock;