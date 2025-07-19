import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../bpl-tools/utils/getCSS';
import { colPrefix } from '../../../row/utils/data';

const Style = ({ attributes, id, columns, columnGap }) => {
	const { width, overflow, background, padding, border, shadow } = attributes;

	const mainSl = `#${id}`;	

	return <style dangerouslySetInnerHTML={{
		__html: `
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