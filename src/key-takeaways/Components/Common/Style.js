import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const getDevVal = (attrObj, dev, prop) => {
	if (!attrObj) return undefined;
	if (attrObj[dev] && attrObj[dev][prop] !== undefined) return attrObj[dev][prop];
	if (prop === 'radius') {
		if (attrObj[dev] && attrObj[dev].borderRadius !== undefined) return attrObj[dev].borderRadius;
		if (attrObj.radius !== undefined) return attrObj.radius;
		if (attrObj.borderRadius !== undefined) return attrObj.borderRadius;
	}
	if (attrObj[prop] !== undefined) return attrObj[prop];
	return undefined;
};

const Style = ({ attributes, id, isBackend = false }) => {
	const { heading = {}, list = {}, icon = {}, item = {}, advanced } = attributes;

	const iconColor = icon.color || '#ffffff';
	const iconSize = icon.size || '18px';
	const itemSize = item.typography?.fontSize?.desktop || '16px';

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bBlocks-key-takeaways-wrapper`;
	const headingSl = `${blockSl} .bBlocks-key-takeaways-heading`;
	const listSl = `${blockSl} .bBlocks-key-takeaways-list`;
	const itemSl = `${blockSl} .bBlocks-key-takeaways-item`;
	const iconSl = `${blockSl} .bBlocks-key-takeaways-icon`;
	const numSl = `${blockSl} .bBlocks-key-takeaways-num`;
	const bulletSl = `${blockSl} .bBlocks-key-takeaways-bullet`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', heading.typography).googleFontLink}
			${getTypoCSS('', item.typography).googleFontLink}
			${getTypoCSS(headingSl, heading.typography).styles}
			${headingSl}{
				${isValidCSS('color', heading.color)}
				${getBackgroundCSS(heading.bg)}
				${isValidCSS('padding', getBoxCSS(getDevVal(heading, 'desktop', 'padding')))}
				${isValidCSS('margin', getBoxCSS(getDevVal(heading, 'desktop', 'margin')))}
				${getBorderBoxCSS(heading.border)}
				${isValidCSS('border-radius', getBoxCSS(getDevVal(heading, 'desktop', 'radius')))}
			}
			${listSl}{
				${isValidCSS('gap', typeof list.gap === 'number' ? `${list.gap}px` : (list.gap || '10px'))}
			}
			${getTypoCSS(itemSl, item.typography).styles}
			${itemSl}{
				${isValidCSS('color', item.color)}
				${getBackgroundCSS(item.bg)}
				${isValidCSS('padding', getBoxCSS(getDevVal(item, 'desktop', 'padding')))}
				${isValidCSS('margin', getBoxCSS(getDevVal(item, 'desktop', 'margin')))}
				${getBorderBoxCSS(item.border)}
				${isValidCSS('border-radius', getBoxCSS(getDevVal(item, 'desktop', 'radius')))}
			}
			${iconSl}{
				color: ${iconColor};
				font-size: ${iconSize};
				min-height: calc(${itemSize} * 1.5);
				${getBackgroundCSS(icon.bg)}
				${isValidCSS('padding', getBoxCSS(getDevVal(icon, 'desktop', 'padding')))}
				${isValidCSS('margin', getBoxCSS(getDevVal(icon, 'desktop', 'margin')))}
				${getBorderBoxCSS(icon.border)}
				${isValidCSS('border-radius', getBoxCSS(getDevVal(icon, 'desktop', 'radius')))}
			}
			${iconSl}>svg{
				${isValidCSS('height', icon.size)}
				${isValidCSS('width', icon.size)}
				${isValidCSS('fill',iconColor)}
			}
			${numSl}{
				width: calc(${iconSize} + 10px);
				height: calc(${iconSize} + 10px);
				color: ${iconColor};
				font-size: calc(${iconSize} * 0.8);
				${getBackgroundCSS(icon.bg)}
				${getBorderBoxCSS(icon.border)}
				${isValidCSS('border-radius', getBoxCSS(getDevVal(icon, 'desktop', 'radius')))}
			}
			${bulletSl}{
				width: calc(${iconSize} * 0.45);
				height: calc(${iconSize} * 0.45);
				${getBackgroundCSS(icon.bg)}
				${getBorderBoxCSS(icon.border)}
				${isValidCSS('border-radius', getBoxCSS(getDevVal(icon, 'desktop', 'radius')))}
			}
			${tabBreakpoint}{
				${headingSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(heading, 'tablet', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(heading, 'tablet', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(heading, 'tablet', 'radius')))}
				}
				${itemSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(item, 'tablet', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(item, 'tablet', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(item, 'tablet', 'radius')))}
				}
				${iconSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(icon, 'tablet', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(icon, 'tablet', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(icon, 'tablet', 'radius')))}
				}
			}
			${mobileBreakpoint}{
				${headingSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(heading, 'mobile', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(heading, 'mobile', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(heading, 'mobile', 'radius')))}
				}
				${itemSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(item, 'mobile', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(item, 'mobile', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(item, 'mobile', 'radius')))}
				}
				${iconSl}{
					${isValidCSS('padding', getBoxCSS(getDevVal(icon, 'mobile', 'padding')))}
					${isValidCSS('margin', getBoxCSS(getDevVal(icon, 'mobile', 'margin')))}
					${isValidCSS('border-radius', getBoxCSS(getDevVal(icon, 'mobile', 'radius')))}
				}
			}
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
