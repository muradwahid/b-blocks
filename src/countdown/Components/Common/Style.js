import { getBackgroundCSS, getBorderCSS, getColorsCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { boxPosition, prefixSuffixDirection = 'row', prefixText = '', suffixButtonText = '', addCSS = '', width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isDaysSingleStyle = false, daysBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, daysDigitColor = '#fff', daysLabelColor = '#fff', isHoursSingleStyle = false, hoursBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, hoursDigitColor = '#fff', hoursLabelColor = '#fff', isMinutesSingleStyle = false, minutesBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, minutesDigitColor = '#fff', minutesLabelColor = '#fff', isSecondsSingleStyle = false, secondsBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, secondsDigitColor = '#fff', secondsLabelColor = '#fff', sepType, sepSize, sepColor, prefixTextTypo = { fontSize: { desktop: 15 } }, prefixTextColor = '#222', suffixButtonTypo = { fontSize: { desktop: 16 } }, suffixButtonColors = { color: '#fff', bg: '#222' }, suffixButtonPadding = { vertical: '14px', horizontal: '28px' }, dismissColor = '#333' } = attributes;

	const mainSl = `#${id}`;
	const itemsSl = `${mainSl} .countdownItems`;
	const itemSl = `${itemsSl} .countdownItem`;
	const timeSl = `${mainSl} .${prefix}`;

	const singleStyle = (condition, className, bg, digit, label) => condition ? `${itemsSl} .${className}{
		${getBackgroundCSS(bg)}
	}
	${itemsSl} .${className} .digit{
		color: ${digit};
	}
	${itemsSl} .${className} .label{
		color: ${label};
	}`: '';

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', digitTypo)?.googleFontLink}
		${getTypoCSS('', labelTypo)?.googleFontLink}
		${getTypoCSS('', prefixTextTypo)?.googleFontLink}
		${getTypoCSS('', suffixButtonTypo)?.googleFontLink}
		${getTypoCSS(`${itemSl} .digit`, digitTypo)?.styles}
		${getTypoCSS(`${itemSl} .label`, labelTypo)?.styles}
		${getTypoCSS(`${timeSl} .prefixText`, prefixTextTypo)?.styles}
		${getTypoCSS(`${timeSl} .suffixButton`, suffixButtonTypo)?.styles}

		${mainSl}{
			align-items: ${alignment};
			justify-content: ${alignment};
		}
		${timeSl}{
			flex-direction: ${prefixSuffixDirection};
			justify-content: ${prefixText || suffixButtonText ? 'space-between' : 'center'};
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			box-shadow: ${getShadowCSS(shadow)};
		}
		${itemsSl}{
			justify-content: ${boxPosition};
			gap: ${boxSpace};
			margin: ${prefixText || suffixButtonText ? ('column' === prefixSuffixDirection ? '20px 0' : '0 20px') : '0'}
		}
		${itemSl}{
			${getBackgroundCSS(boxBG)}
			width: ${boxWidth};
			height: ${boxHeight};
			${getBorderCSS(boxBorder)}
			box-shadow: ${getShadowCSS(boxShadow)};
		}
		${itemSl} .digit{
			color: ${digitColor};
		}
		${itemSl} .label{
			color: ${labelColor};
		}
		${singleStyle(isDaysSingleStyle, 'countdownDays', daysBG, daysDigitColor, daysLabelColor)}
		${singleStyle(isHoursSingleStyle, 'countdownHours', hoursBG, hoursDigitColor, hoursLabelColor)}
		${singleStyle(isMinutesSingleStyle, 'countdownMinutes', minutesBG, minutesDigitColor, minutesLabelColor)}
		${singleStyle(isSecondsSingleStyle, 'countdownSeconds', secondsBG, secondsDigitColor, secondsLabelColor)}

		${itemsSl} .separator::before{
			content: '${sepType}';
			font-size: ${sepSize}px;
			color: ${sepColor};
		}
		${timeSl} .prefixText{
			color: ${prefixTextColor};
		}
		${timeSl} .suffixButton{
			${getColorsCSS(suffixButtonColors)}
			padding: ${getSpaceCSS(suffixButtonPadding)};
		}
		${timeSl} .countdownClose{
			fill: ${dismissColor};
		}
		${addCSS}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;