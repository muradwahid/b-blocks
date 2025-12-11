import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
const Style = ({ attributes, id}) => {
	const { advanced } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: ` 
			${generateCSS(id, advanced)}
		`}} />;
}
export default Style;