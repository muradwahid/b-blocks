import { getColorsCSS, getBorderCSS, getIconCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { width, btnAlign, btnTypo, btnPadding, btnOneBorder, btnOneColors, btnOneHovColors, btnTwoBorder, btnTwoColors, btnTwoHovColors, sepType, sepTextTypo, sepTextColor, sepIcon, sepBGColor } = attributes;

	const btnGroupSl = `#bBlocksButtonGroup-${clientId} .bBlocksButtonGroup`;
	const btnSeparatorSl = `${btnGroupSl} .btnSeparator`;

	const sepTextFontSize = sepTextTypo?.fontSize?.desktop || sepTextTypo?.fontSize;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', btnTypo)?.googleFontLink}
		${getTypoCSS('', sepTextTypo)?.googleFontLink}
		${getTypoCSS(`${btnGroupSl} .bBlocksBtn a`, btnTypo)?.styles}
		${getTypoCSS(`${btnSeparatorSl} span`, sepTextTypo)?.styles}

		#bBlocksButtonGroup-${clientId}{
			text-align: ${btnAlign};
		}
	   ${btnGroupSl}{
			width: ${'0px' !== width && '0%' !== width && '0em' !== width ? width : 'auto'};
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