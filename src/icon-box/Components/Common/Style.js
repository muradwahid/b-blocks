import { getBackgroundCSS, getBorderCSS, getShadowCSS, getBoxCSS } from "../../../../../Components/utils/getCSS";

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { alignment, wrapper, icon } = attributes;

	const mainSl = `#${id}`;
	const iconBoxSl = `${mainSl} .${prefix}`;
	const svgSl = `${iconBoxSl} svg`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${iconBoxSl}{
			width: ${wrapper.width};
			height: ${wrapper.height};
			${getBackgroundCSS(wrapper.background)}
			${getBorderCSS({ ...wrapper.border, radius: wrapper.borderRadius })}
			padding: ${getBoxCSS(wrapper.padding)};
			box-shadow: ${getShadowCSS(wrapper.shadow)};
			margin: ${getBoxCSS(wrapper.margin)};
		}
		${svgSl}{
			fill:${icon.color};
			height:${icon.size};
			width:${icon.size};
			box-shadow: ${getShadowCSS(icon.shadow)};
		}
	`}} />;
}
export default Style;