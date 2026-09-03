import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';

import { prefix } from '../../utils/data';
import { shapeCSS } from '../../utils/functions';

const Style = ({ attributes, id, isBackend = false }) => {
	const { wrapper, content, shape, advanced } = attributes;
	const { minHeight } = wrapper;
	const { isFullWidth, width, height, verticalAlign, horizontalAlign } = content;

	const mainSl = `#${id} .${prefix}`;
	// const contentSl = isBackend ? `${mainSl} .${prefix}Content >.block-editor-inner-blocks >.block-editor-block-list__layout` : `${mainSl} .${prefix}Content`;
	const contentSl = `${mainSl} .${prefix}Content`;
	// const advSl = isBackend ? `${id}>div>.bBlocksContainer>.bBlocksContainerContent` : id;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#${id}{
			min-height: ${0 === parseInt(minHeight) ? 'auto' : minHeight};
		}
		${mainSl}{
			align-items: ${horizontalAlign};
			justify-content: ${verticalAlign};
		}

		${contentSl}{
			width: ${(isFullWidth || 0 === parseInt(width.desktop)) ? '100%' : width.desktop};
			flex-grow: ${height};
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
		${generateCSS(id, advanced, isBackend,false)}
	`.replace(/\s+/g, ' ')
	}} />
}
export default Style;