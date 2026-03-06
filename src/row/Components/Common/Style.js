import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

export const style = (attributes, id, isBackend = false ) => {
	const { layout = {}, columns, columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow, advanced } = attributes;
	const rowSl = isBackend ? `#${id} > div > div` : `#${id} > div`;

	const blockListLayout = `${rowSl} >.block-editor-inner-blocks >.block-editor-block-list__layout`;

	const selector = isBackend ? blockListLayout : rowSl;

	const flexWrap = (device) => {
		const def = ['column-reverse','column'];
		const isDirection = def.includes(layout?.[device]?.direction);
		const wrap = layout?.[device]?.wrap;
		return isDirection ? isValidCSS('flex-wrap', 'nowrap') : `${isValidCSS('flex-wrap', wrap)} ${isValidCSS('align-content', layout?.[device]?.wrap !== 'nowrap' || layout?.[device]?.wrap !== '' ? layout?.[device]?.alignContent : '')}`;
	};

	const flexStyles = (device) => `
		${isValidCSS('justify-content', layout?.[device]?.justify)}
		${isValidCSS('align-items', layout?.[device]?.alignItems)}
		${isValidCSS('flex-direction', layout?.[device]?.direction)}
		${flexWrap(device)}
	`;



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
			${layout.type === 'flex' ? flexStyles('desktop') : ''}
		}
		${tabBreakpoint}{
			${selector}{
				${isValidCSS('gap', layout?.tablet?.columnGap)}
				${layout.type === 'flex' ? flexStyles('tablet') : ''}
			}
		}

		${mobileBreakpoint}{
			${selector}{
				${isValidCSS('gap', layout?.mobile?.columnGap)}
				${layout.type === 'flex' ? flexStyles('mobile') : ''}
			}
		}

		${columns > 0 ? generateCSS(id, advanced, isBackend) : ""}
	`.replace(/\s+/g, ' ')
}