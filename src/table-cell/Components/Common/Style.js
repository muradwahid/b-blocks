import { getBackgroundCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
const Style = ({ attributes, id }) => {
	const { styles } = attributes;
	const mainSl = `#${id}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl} {
			${isValidCSS('display', 'table-cell')}
			${isValidCSS('text-align', styles.alignment.desktop)}
			${getBackgroundCSS(styles.normal.bg)}
			transition: background ${styles.hover.transition}s ease-in-out;
		}
		${mainSl}:hover {
			${getBackgroundCSS(styles.hover.bg)}
		}
	`}} />;
}
export default Style;