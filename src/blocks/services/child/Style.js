import servicePattern from '../img/service-pattern.png';

const Style = ({ attributes, clientId }) => {
	const { background, hoverBG, icon, iconWidth, iconBorder, titleColor, descColor, linkIconColor, linkBGColor, linkBGHovColor } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocksService-${clientId} .bBlocksService{
			${background?.styles || `background-color: #0000;`}
		}
		#bBlocksService-${clientId} .bBlocksService .bgLayer{
			${hoverBG?.styles || `background-image: url(${servicePattern}); background-position: bottom left; background-size: auto; background-repeat: no-repeat; background-color: #0000;`}
		}

		#bBlocksService-${clientId} .bBlocksService .title{
			color: ${titleColor};
		}
		#bBlocksService-${clientId} .bBlocksService .icon{
			${iconBorder?.styles || ''}
		}
		#bBlocksService-${clientId} .bBlocksService .icon i{
			${icon?.styles || 'font-size: 70px;'}
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