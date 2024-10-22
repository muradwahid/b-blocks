import { getBackgroundCSS, getIconCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { features = [], columnGap, rowGap, textAlign, padding, iconMargin, titleTypo, titleMargin, sepMargin, descTypo } = attributes;

	const mainSl = `#${id}`;
	const featureBoxesSl = `${mainSl} .${prefix}`;
	const gFeatureSl = `${featureBoxesSl} .feature`;

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
			const featureSl = `${mainSl} #feature-${index}`;

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