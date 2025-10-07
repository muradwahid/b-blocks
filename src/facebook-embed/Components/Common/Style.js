import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS"

const Style = ({ attributes, id }) => {
	const { advanced} = attributes;

	// const mainSl = `#${id}`;
	// const blockSl = `${mainSl} .bBlocksBlockName`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${generateCSS(id,advanced)}
	`}} />;
}
export default Style;