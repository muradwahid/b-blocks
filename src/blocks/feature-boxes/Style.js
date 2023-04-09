import { getBackgroundCSS, getIconCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { features = [], columnGap, rowGap, textAlign, padding, iconMargin, titleTypo, titleMargin, sepMargin, descTypo } = attributes;

	const mainSl = `#bBlocksFeatureBoxes-${clientId}`;
	const featureBoxesSl = `${mainSl} .bBlocksFeatureBoxes`;
	const gFeatureSl = `${featureBoxesSl} .bBlocksFeature`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', descTypo)?.googleFontLink}
		${getTypoCSS(`${gFeatureSl} .featureTitle`, titleTypo)?.styles}
		${getTypoCSS(`${gFeatureSl} .featureDescription`, descTypo)?.styles}

		${featureBoxesSl}{
			grid-gap: ${rowGap} ${columnGap};
		}
		${gFeatureSl}{
			text-align: ${textAlign};
			padding: ${getSpaceCSS(padding)};
		}
		${gFeatureSl} .featureIcon{
			margin: ${getSpaceCSS(iconMargin)};
		}
		${gFeatureSl} .featureTitle{
			margin: ${getSpaceCSS(titleMargin)};
		}
		${gFeatureSl} .featureSeparator{
			margin: ${getSpaceCSS(sepMargin)};
		}

		${features.map((item, index) => {
			const { background, icon, iconWidth, titleColor, separator, descColor } = item;
			const featureSl = `${mainSl} #bBlocksFeature-${index}`;

			return `
				${featureSl}{
					${getBackgroundCSS(background)}
				}
				${featureSl} .featureIcon i{
					${getIconCSS(icon)}
				}
				${featureSl} .featureIcon img{
					width: ${iconWidth};
				}
				${featureSl} .featureTitle{
					color: ${titleColor};
				}
				${featureSl} .featureSeparator{
					${getSeparatorCSS(separator)}
				}
				${featureSl} .featureDescription{
					color: ${descColor};
				}
			`;
		}).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;