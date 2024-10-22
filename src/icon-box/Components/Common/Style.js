import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { getShadowCSS } from "../../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id }) => {
	const { wrapper, icon, advanced } = attributes;
	const { size, color, shadow } = icon;
	const { width, height } = wrapper;

	const mainSl = `#${id}`;
	const svgSl = `${mainSl} svg`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${generateCSS(id, advanced, true)}

		${mainSl}{
			width: ${!width || 0 === parseInt(width) ? 'auto' : width};
			height: ${!height || 0 === parseInt(height) ? 'auto' : height};
		}
		${svgSl}{
			fill: ${color};
			height: ${size};
			width: ${size};
			filter: drop-shadow(${getShadowCSS(shadow)});
		}
	`}} />;
}
export default Style;