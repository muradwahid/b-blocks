const HTMLBlock = ({ attributes }) => {
	const { htmlCode } = attributes;

	return <div dangerouslySetInnerHTML={{ __html: htmlCode }}></div>;
}
export default HTMLBlock;