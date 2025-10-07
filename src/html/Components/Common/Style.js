import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS";
const Style = ({ attributes, id, isBackend = false }) => {
	const { advanced } = attributes;
	// const mainSl = `#${id}`;

	return <style dangerouslySetInnerHTML={{
	__html: `
		${generateCSS(id, advanced, isBackend)}
	` }} />
}
export default Style;