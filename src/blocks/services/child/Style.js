import { getBackgroundCSS, getBorderCSS, getIconCSS } from '../../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { background, hoverBG, icon, iconWidth, iconBorder, titleColor, descColor, linkIconColor, linkBGColor, linkBGHovColor } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocksService-${clientId} .bBlocksService{
			${getBackgroundCSS(background)}
		}
		#bBlocksService-${clientId} .bBlocksService .bgLayer{
			${getBackgroundCSS(hoverBG)}
		}

		#bBlocksService-${clientId} .bBlocksService .title{
			color: ${titleColor};
		}
		#bBlocksService-${clientId} .bBlocksService .icon{
			${getBorderCSS(iconBorder)}
		}
		#bBlocksService-${clientId} .bBlocksService .icon i{
			${getIconCSS(icon)}
		}
		#bBlocksService-${clientId} .bBlocksService .icon img{
			width: ${iconWidth};
		}
		#bBlocksService-${clientId} .bBlocksService .description{
			color: ${descColor};
		}
		#bBlocksService-${clientId} .bBlocksService .link a{
			background-color: ${linkBGColor};
		}
		#bBlocksService-${clientId}:hover .bBlocksService .link a{
			background-color: ${linkBGHovColor};
		}
		#bBlocksService-${clientId} .bBlocksService .link a svg{
			fill: ${linkIconColor};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;