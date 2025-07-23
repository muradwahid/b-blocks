import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../bpl-tools/utils/getCSS';

export const style = (attributes, id, columns, columnGap, isBackend = false ) => {
	const { width, overflow, background, padding, border, shadow, advanced } = attributes;

	const mainSl = `#${id}`;
	
	const colSl = isBackend ? `${mainSl} > div > div:first-child` : `${mainSl} > div`; 

	return `
		${mainSl}{
			flex-basis: calc(${width.desktop}% - (${columnGap} * (${columns} - 1) / ${columns}));
		}

		${tabBreakpoint} {
			${mainSl}{
				flex-basis: calc(${width.tablet}% - (${columnGap} * (${columns} - 1) / ${columns}));
			}
		}

		${mobileBreakpoint} {
			${mainSl}{
				flex-basis: calc(${width.mobile}% - (${columnGap} * (${columns} - 1) / ${columns}));
			}
		}

		${colSl}{
			overflow: ${overflow};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow)};
		}
		${generateCSS(id, advanced, isBackend)}
		`.replace(/\s+/g, ' ')
}