import { getBackgroundCSS } from '../../../../../Components/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { background, width, height, alignment } = attributes;

	const mainSl = `#${id}`;
	const chartSl = `${mainSl} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${chartSl}{
			height: ${height};
		}
		${chartSl},
		${mainSl} .downloadArea{
			width: ${width};
		}
		${chartSl} canvas{
			${getBackgroundCSS(background)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;