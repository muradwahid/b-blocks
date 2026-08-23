import { getColorsCSS, getBorderCSS, getIconCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { width, btnAlign, btnTypo, btnPadding, btnOneBorder, btnOneColors, btnOneHovColors, btnTwoBorder, btnTwoColors, btnTwoHovColors, sepType, sepTextTypo, sepTextColor, sepIcon, sepBGColor, alignment = {}, layout = 'row', gap = {} } = attributes;

	const mainSl = `#${id}`;
	const btnGroupSl = `${mainSl} .${prefix}`;
	const btnSeparatorSl = `${btnGroupSl} .btnSeparator`;

	const sepTextFontSize = sepTextTypo?.fontSize?.desktop || sepTextTypo?.fontSize;

	const sepMargin = () => {
		const column = `margin-top: -${'text' === sepType ? (sepTextFontSize * 1.75) / 2 : (sepIcon?.fontSize * 1.65) / 2}px;
			margin-bottom: -${'text' === sepType ? (sepTextFontSize * 1.75) / 2 : (sepIcon?.fontSize * 1.65) / 2}px;`

		const row = `margin-left: -${'text' === sepType ? (sepTextFontSize * 1.75) / 2 : (sepIcon?.fontSize * 1.65) / 2}px;
			margin-right: -${'text' === sepType ? (sepTextFontSize * 1.75) / 2 : (sepIcon?.fontSize * 1.65) / 2}px;`

		return layout === 'row' ? row : column;

	}

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', btnTypo)?.googleFontLink}
		${getTypoCSS('', sepTextTypo)?.googleFontLink}
		${getTypoCSS(`${btnGroupSl} .bBlocksBtn a`, btnTypo)?.styles}
		${getTypoCSS(`${btnSeparatorSl} span`, sepTextTypo)?.styles}

		${mainSl}{
			text-align: ${btnAlign};
			${layout === 'column' ? isValidCSS('text-align', alignment.desktop.vertical) : ``}
		}
		${btnGroupSl}{
			width: ${'0px' !== width && '0%' !== width && '0em' !== width ? width : 'auto'};
			${isValidCSS('gap', gap?.desktop)}
		}
		${btnGroupSl}.layout-row{
			${isValidCSS('justify-content', alignment.desktop.horizontal)}
		}
		${btnGroupSl}.layout-column{
			${isValidCSS('justify-content', alignment.desktop.vertical)}
		}
		${btnGroupSl} .bBlocksBtn{
			min-width: ${'0px' !== width && '0%' !== width && '0em' !== width ? '50%' : 'auto'};
		}
		${btnGroupSl} .bBlocksBtn a{
			padding: ${getSpaceCSS(btnPadding)};
		}

		${btnGroupSl} .btnOne{
			${getBorderCSS(btnOneBorder) || 'border-radius: 50px;'}
			${getColorsCSS(btnOneColors)}
			border-radius: ${btnOneBorder?.radius || '50px'} 0 0 ${btnOneBorder?.radius || '50px'};
		}
		${btnGroupSl} .btnOne:hover{
			${getColorsCSS(btnOneHovColors)}
		}

		${btnGroupSl} .btnTwo{
			${getBorderCSS(btnTwoBorder) || 'border-radius: 50px;'}
			${getColorsCSS(btnTwoColors)}
			border-radius: 0 ${btnTwoBorder?.radius || '50px'} ${btnTwoBorder?.radius || '50px'} 0;
		}
		${btnGroupSl} .btnTwo:hover{
			${getColorsCSS(btnTwoHovColors)}
		}

		${btnSeparatorSl}{
			width: ${'text' === sepType ? `${sepTextFontSize * 1.75}px` : `${sepIcon?.fontSize * 1.65}px`};
			height: ${'text' === sepType ? `${sepTextFontSize * 1.75}px` : `${sepIcon?.fontSize * 1.65}px`};
			background-color: ${sepBGColor};
			${sepMargin()}
		}
		${btnSeparatorSl} span{
			color: ${sepTextColor};
		}
		${btnSeparatorSl} i{
			${getIconCSS(sepIcon)}
		}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;