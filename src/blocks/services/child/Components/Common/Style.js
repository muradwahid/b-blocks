import { getBackgroundCSS, getBorderCSS, getIconCSS } from '../../../../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { background, hoverBG, icon, iconWidth, iconBorder, titleColor, descColor, linkIconColor, linkBGColor, linkBGHovColor } = attributes;

	const mainSl = `#bBlocksService-${clientId}`;
	const serviceSl = `${mainSl} .bBlocksService`;
	const iconSl = `${serviceSl} .icon`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${serviceSl}{
			${getBackgroundCSS(background)}
		}
		${serviceSl} .bgLayer{
			${getBackgroundCSS(hoverBG)}
		}

		${serviceSl} .title{
			color: ${titleColor};
		}
		${iconSl}{
			${getBorderCSS(iconBorder)}
		}
		${iconSl} i{
			${getIconCSS(icon)}
		}
		${iconSl} img{
			width: ${iconWidth};
		}
		${serviceSl} .description{
			color: ${descColor};
		}
		${serviceSl} .link a{
			background-color: ${linkBGColor};
		}
		${mainSl}:hover .ssbService .link a{
			background-color: ${linkBGHovColor};
		}
		${serviceSl} .link a svg{
			fill: ${linkIconColor};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;