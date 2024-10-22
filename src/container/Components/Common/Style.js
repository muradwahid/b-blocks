

import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';

import { prefix } from '../../utils/data';
import { shapeCSS } from '../../utils/functions';

const Style = ({ attributes, id }) => {
	const { wrapper, content, shape, advanced } = attributes;
	const { minHeight } = wrapper;
	const { isFullWidth, width, verticalAlign, horizontalAlign } = content;

	const mainSl = `#${id}`;
	const contentSl = `${mainSl} .${prefix}Content`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${generateCSS(id, advanced, true)}

		${mainSl}{
			min-height: ${0 === parseInt(minHeight) ? 'auto' : minHeight};
			align-items: ${horizontalAlign};
			justify-content: ${verticalAlign};
		}

		${contentSl}{
			width: ${(isFullWidth || 0 === parseInt(width.desktop)) ? '100%' : width.desktop};
		}
		${tabBreakpoint}{
			${contentSl}{
				width: ${(isFullWidth || 0 === parseInt(width.tablet)) ? '100%' : width.tablet};
			}
		}
		${mobileBreakpoint}{
			${contentSl}{
				width: ${(isFullWidth || 0 === parseInt(width.mobile)) ? '100%' : width.mobile};
			}
		}
		${shapeCSS(shape, id)}
	`.replace(/\s+/g, ' ')
	}} />
}
export default Style;