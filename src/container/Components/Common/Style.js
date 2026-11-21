import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';

import { prefix } from '../../utils/data';
import { shapeCSS } from '../../utils/functions';

const Style = ({ attributes, id, isBackend = false, device = 'desktop' }) => {
	const { wrapper, content, shape, advanced, itemsLayout } = attributes;
	const { minHeight } = wrapper;
	const { isFullWidth, width, height, verticalAlign, horizontalAlign } = content;

	// Items Layout, for the device being previewed — tablet and mobile keep what the larger screen has when empty
	// (the same rules as render.php). The editor wraps the inner blocks in two more elements than the page does.
	const devices = ['desktop', 'tablet', 'mobile'];
	const item = key => devices.slice(0, devices.indexOf(device) + 1).reduce((val, d) => itemsLayout?.[d]?.[key] || val, '');
	const [direction, justify, align, wrap, columnGap, rowGap] = ['direction', 'justify', 'align', 'wrap', 'columnGap', 'rowGap'].map(item);
	const isRow = 'row' === direction || 'row-reverse' === direction;
	const layoutSl = `#${id} > div > .${prefix} > .${prefix}Content > .block-editor-inner-blocks > .block-editor-block-list__layout`;
	const itemsSl = `:root .wp-block-b-blocks-container .${prefix}Content .block-editor-inner-blocks .block-editor-block-list__layout:where(${layoutSl}) > *`;
	const itemsCSS = !(direction || justify || align || wrap || columnGap || rowGap) ? '' : `
		${layoutSl}{
			display: flex;
			flex-direction: ${direction || 'column'};
			${justify ? `justify-content: ${justify};` : ''}
			${align ? `align-items: ${align};` : ''}
			${wrap ? `flex-wrap: ${wrap};` : ''}
			${columnGap ? `column-gap: ${columnGap};` : ''}
			${rowGap ? `row-gap: ${rowGap};` : ''}
		}
		${itemsSl}{
			${isRow ? 'width: auto;' : ''}
			${isRow || (align && 'stretch' !== align) ? 'margin-left: 0 !important; margin-right: 0 !important;' : ''}
			${isRow || rowGap ? 'margin-block-start: 0;' : ''}
		}
	`;

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
			width: ${(isFullWidth || !width.desktop || 0 === parseInt(width.desktop)) ? '100%' : width.desktop};
			flex-grow: ${height};
		}
		/* An empty width is 100%, as on the page (Utils::valForZero in render.php). */
		${tabBreakpoint}{
			${contentSl}{
				width: ${(isFullWidth || !width.tablet || 0 === parseInt(width.tablet)) ? '100%' : width.tablet};
			}
		}
		${mobileBreakpoint}{
			${contentSl}{
				width: ${(isFullWidth || !width.mobile || 0 === parseInt(width.mobile)) ? '100%' : width.mobile};
			}
		}
		${itemsCSS}
		${shapeCSS(shape, id)}
		${generateCSS(id, advanced, isBackend,false)}
	`.replace(/\s+/g, ' ')
	}} />
}
export default Style;