import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId, isBackend = false }) => {
	const { columnGap, rowGap, background, textAlign, itemHeight, itemPadding, itemBorder, itemShadow, iconPadding, iconMargin, titleTypo, titleMargin, descTypo } = attributes;

	const servicesSl = `#bBlocksServices-${clientId} .bBlocksServices`;
	const serviceSl = `${servicesSl} .bBlocksService`;

	const gapStyle = isBackend ? `${servicesSl} .block-editor-inner-blocks .block-editor-block-list__layout{
		grid-gap: ${rowGap} ${columnGap};
	}` : `${servicesSl}{
		grid-gap: ${rowGap} ${columnGap};
	}`

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS(`${serviceSl} .title`, titleTypo)}
		${getTypoCSS(`${serviceSl} .description`, descTypo)}

		${servicesSl}{
			${getBackgroundCSS(background)}
		}
		${gapStyle}

		${serviceSl}{
			text-align: ${textAlign};
			min-height: ${itemHeight};
			padding: ${getSpaceCSS(itemPadding)};
			${getBorderCSS(itemBorder)}
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