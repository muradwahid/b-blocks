import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../Components/utils/getCSS';
import { colPrefix } from '../../../row/utils/data';

const Style = ({ attributes, id }) => {
	const { width, overflow, background, padding, border, shadow } = attributes;

	const mainSl = `#${id}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			width: ${width.mobile}%;
		}
		@media (min-width: 576px) {
			${mainSl}{
				width: ${width.tablet}%;
			}
		}

		@media (min-width: 768px) {
			${mainSl}{
				width: ${width.desktop}%;
			}
		}

		#${id} .${colPrefix}{
			overflow: ${overflow};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;