import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getMultiShadowCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
const Style = ({ attributes, id }) => {

	const { styles } = attributes;
	const { container, title, path } = styles;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-text-path-container`;
	const svgSl = `${blockSl} .b-blocks-text-path-svg`;
	const titleSl = `${svgSl} .b-blocks-text-path-title`;

	const getTitleStyles = (type = 'normal') => {

		const titleStyles = title[type];
		const getStrokeStyle = titleStyles?.textStroke.isStroke ? `${isValidCSS('stroke-width', titleStyles.textStroke.size ? titleStyles.textStroke.size + 'px' : '')}
			${isValidCSS('stroke', titleStyles.textStroke.color)}` : '';
		return `
			${isValidCSS('color', titleStyles.color)}
			${isValidCSS('fill', titleStyles.color)}
			${isValidCSS('text-shadow', getMultiShadowCSS(titleStyles.textShadow, 'text'))}
			${getStrokeStyle}
		`
	}

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', title.typo).googleFontLink}

		${getTypoCSS(titleSl, title.typo).styles}

		${blockSl}{
			${isValidCSS('justify-content', container.desktop.alignment)}
		}

		${svgSl}{
			${isValidCSS('rotate', path.rotate ? path.rotate + 'deg' : '')}
			${isValidCSS('width', path.size)}
			${isValidCSS('width', path.size)}
		}

		${titleSl}{
			${getTitleStyles('normal')}		
			transition: all ${title.transition}s ease-in-out;
		}

		${titleSl}:hover{
			${getTitleStyles('hover')}		
		}
		
		${tabBreakpoint}{
				${blockSl}{
			${isValidCSS('justify-content', container.tablet.alignment)}
			}
		}
		${mobileBreakpoint}{
				${blockSl}{
			${isValidCSS('justify-content', container.mobile.alignment)}
			}
		}
		
	`}} />;
}
export default Style;