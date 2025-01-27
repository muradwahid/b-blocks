import { getShadowCSS } from "../../../../../bpl-tools/utils/getCSS";
import { prefix } from '../../utils/data';

const Style = ({ attributes, id, extraCSS = '' }) => {
	const { wrapper, icon } = attributes;
	const { size, color, shadow } = icon;
	const { width, height } = wrapper;

	const mainSl = `#${id} .${prefix}`;
	const svgSl = `${mainSl} svg`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${extraCSS}

			${mainSl}{
				width: ${!width || 0 === parseInt(width) ? 'auto' : width};
				height: ${!height || 0 === parseInt(height) ? 'auto' : height};
			}
			${svgSl}{
				fill: ${color};
				height: ${size};
				width: ${size};
				filter: drop-shadow(${getShadowCSS(shadow, 'text')});
			}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;