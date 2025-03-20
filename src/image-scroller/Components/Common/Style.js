import { generateCSS } from "../../../../../bpl-tools/Advanced/generateCSS";
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
const Style = ({ attributes, id, isBackend = false }) => {
	const { image, options, advanced } = attributes;
	const { easing, duration } = options;
	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-image-scroller-wrapper`
	const imageSl = `${blockSl} .b-blocks-image-scroller`

	return <style dangerouslySetInnerHTML={{
		__html: `

		${blockSl}{
			${isValidCSS("height", image.height.desktop)}
		}
		${imageSl}{
			transition: transform ${duration}ms ${easing};
		}
		${tabBreakpoint}{
			${isValidCSS("height", image.height.tablet)
			}
		${mobileBreakpoint}{
			${isValidCSS("height", image.height.mobile)
			}
		${generateCSS(id, advanced, isBackend)}
		`
	}} />;
}
export default Style;