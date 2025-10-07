import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix, childPrefix } from '../../utils/data';

const Style = ({ attributes, id, isBackend = false }) => {
	const { columnGap, rowGap, background, textAlign, itemHeight, itemPadding, itemBorder, itemShadow, iconPadding, iconMargin, titleTypo, titleMargin, descTypo } = attributes;

	const servicesSl = `#${id} .${prefix}`;
	const serviceSl = `${servicesSl} .${childPrefix}`;

	const gapStyle = isBackend ? `${servicesSl} .block-editor-inner-blocks .block-editor-block-list__layout{
		grid-gap: ${rowGap} ${columnGap};
	}` : `${servicesSl}{
		grid-gap: ${rowGap} ${columnGap};
	}`

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', descTypo)?.googleFontLink}
		${getTypoCSS(`${serviceSl} .title`, titleTypo)?.styles}
		${getTypoCSS(`${serviceSl} .description`, descTypo)?.styles}

		${servicesSl}{
			${getBackgroundCSS(background)}
		}
		${gapStyle}

		${serviceSl}{
			text-align: ${textAlign};
			min-height: ${itemHeight};
			padding: ${getSpaceCSS(itemPadding)};
			${getBorderCSS(itemBorder) || 'border-radius: 15px;'}
			box-shadow: ${getShadowCSS(itemShadow)};
		}
		${serviceSl} .bgLayer{
			border-radius: ${itemBorder?.radius || '15px'}
		}
		${serviceSl} .icon{
			padding: ${getSpaceCSS(iconPadding)};
			margin: ${getSpaceCSS(iconMargin)};
		}
		${serviceSl} .title{
			margin: ${getSpaceCSS(titleMargin)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;