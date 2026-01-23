import { generateCSS } from "../../../../../bpl-tools/Advanced/generateCSS";

import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";


const Style = ({ attributes, id }) => {

	const { scroll, styles, advanced } = attributes;
	const { icon, text, progress } = styles;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-scroll-to-top-wrapper`;
	const iconSl = `${blockSl} .b-blocks-scroll-to-top-icon`;
	const textSl = `${blockSl} .b-blocks-scroll-to-top-text`;

	const containerCss = {
		icon: `
			${getBackgroundCSS(icon.bg)}
		`,
		text: `
				${getBackgroundCSS(text.normal.bg)}
				${isValidCSS('box-shadow', getMultiShadowCSS(text.normal.shadow))}
				${isValidCSS('padding', getBoxCSS(text.normal.padding))}
				${getBorderBoxCSS(text.normal.border)}
				${isValidCSS('border-radius', getBoxCSS(text.normal.radius))}
		`,
		progress: ` 
			${isValidCSS('width', progress.size)}
			${isValidCSS('height', progress.size)}
		`
	}

	const position = (device) => scroll.position ? `
			position:fixed;
			${isValidCSS(scroll.position, scroll[device].position?.[scroll.position])}
			${isValidCSS('bottom', scroll[device].position.bottom)}
	`: ''

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', text.typography).googleFontLink}
		${getTypoCSS(textSl, text.typography).styles}

			${mainSl}{
				${isValidCSS('justify-content', scroll.desktop.align)}
				${position('desktop')}
			}

			${blockSl}{
				${containerCss[scroll.scrollType]}
			}

			${blockSl}:hover .b-blocks-scroll-to-top-icon>svg{
				${isValidCSS('rotate', icon.hover.rotate >= 0 ? icon.hover.rotate + 'deg' : '')}
			}

			${textSl}{
				${isValidCSS('color', text.normal.color)}
			}
			
			${iconSl}>svg{
				${isValidCSS('width', icon.size)}
				${isValidCSS('height', icon.size)}
				${isValidCSS('fill', icon.color)}
				${isValidCSS('transition', icon.hover.transition ? `all ${icon.hover.transition}s ease-in-out` : '')}
				${isValidCSS('rotate', icon.normal.rotate >= 0 ? icon.normal.rotate + 'deg' : '')}
			}

			${generateCSS(id, advanced, true, false)}
	`}} />;
}
export default Style;