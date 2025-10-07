import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

export const style = (attributes, id, isBackend = false ) => {
	const { columns, columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow, advanced } = attributes;
	const rowSl = isBackend ? `#${id} > div > div` : `#${id} > div`;

	const blockListLayout = `${rowSl} >.block-editor-inner-blocks >.block-editor-block-list__layout`;

	const selector = isBackend ? blockListLayout : rowSl;

	return `
		${rowSl}{
			${isValidCSS('overflow', overflow)}
			${isValidCSS('padding', getSpaceCSS(padding))}
			${isValidCSS('box-shadow', getShadowCSS(shadow))}
			${getBackgroundCSS(background)}
			${getBorderCSS(border)}
		}
		${selector}{
			${isValidCSS('gap', columnGap)}
			${isValidCSS('min-height', height)}
			${isValidCSS('align-items', columnPositionY)}
			${isValidCSS('align-content', columnPositionX)}
		}
		${columns > 0 ? generateCSS(id, advanced, isBackend) : ""}
	`.replace(/\s+/g, ' ')
}