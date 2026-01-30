import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";

const style = ( attributes, id ) => {
	const { styles } = attributes;
	const { toggle, header, label } = styles;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-toggle-content__wrapper`;
	const headSl = `${blockSl} .b-blocks-toggle-content__head`;
	const switcherWrapperSl = `${headSl} .b-blocks-toggle-content-switch__wrapper`;
	const switchSl = `${switcherWrapperSl} .b-blocks-toggle-content__switch`;
	const activeSwitchSl = `${mainSl} .is-b .b-blocks-toggle-content__switch`;
	const inActiveSwitchSl = `${mainSl} .is-a .b-blocks-toggle-content__switch`;
	const switchBallSl = `${switchSl} .b-blocks-toggle-content__knob`;
	const activeSwitchBallSl = `${mainSl} .is-b .b-blocks-toggle-content__knob`;
	const inActiveSwitchBallSl = `${mainSl} .is-a .b-blocks-toggle-content__knob`;

	const labelSl = `${switcherWrapperSl} .b-blocks-toggle-content__label`;


	return `
		${getTypoCSS('', label.typo).googleFontLink}
		${getTypoCSS(labelSl, label.typo).styles}

		${headSl}{
			${isValidCSS('justify-content', toggle?.desktop?.align)}
			${isValidCSS('margin-bottom', header?.desktop?.headingGap)}
			${isValidCSS('padding', getBoxCSS(header?.desktop?.padding))}
			${getBackgroundCSS(header.normal.bg)}
			${getBorderBoxCSS(header.normal.border)}
			${isValidCSS('border-radius', getBoxCSS(header.normal.desktop.radius))}
		}

		${headSl}:hover{
			${getBackgroundCSS(header.hover.bg)}
			${getBorderBoxCSS(header.hover.border)}
			${isValidCSS('border-radius', getBoxCSS(header.hover.desktop.radius))}
		}

		${switcherWrapperSl}{
			${isValidCSS('flex-direction', toggle?.direction)}
			${isValidCSS('gap', label?.desktop?.gap)}
		}

		${switchSl}{
			${isValidCSS('width', toggle.width)}
			${isValidCSS('height', toggle.height)}
		}

		${activeSwitchSl}{
			${getBackgroundCSS(toggle.active.bg)}
		}

		${inActiveSwitchSl}{
			${getBackgroundCSS(toggle.inactive.bg)}
		}

		${switchBallSl}{
			${isValidCSS('width', toggle.height ? `calc(${toggle.height} - 6px)` : '')}
			${isValidCSS('height', toggle.height ? `calc(${toggle.height} - 6px)` : '')}
			
		}
		${activeSwitchBallSl}{
			${isValidCSS('transform', toggle.width ? `translateX(calc(${toggle.width ? toggle.width:'60px'} - ${toggle.height?toggle.height:'30px'}))` : '')}
			${getBackgroundCSS(toggle.active.color)}
		}
		${inActiveSwitchBallSl}{
			${getBackgroundCSS(toggle.inactive.color)}
		}

		${labelSl}.b-blocks-toggle-content__label--left {
			${isValidCSS('color', label.inactive.first.color)}
		}

		${labelSl}.b-blocks-toggle-content__label--right{
			${isValidCSS('color', label.inactive.second.color)}
		}
		${labelSl}.b-blocks-toggle-content__label--left.is-active {
			${isValidCSS('color', label.active.first.color)}
		}

		${labelSl}.b-blocks-toggle-content__label--right.is-active{
			${isValidCSS('color', label.active.second.color)}
		}

		${tabBreakpoint}{
			${headSl}{
				${isValidCSS('justify-content', toggle?.tablet?.align)}
				${isValidCSS('margin-bottom', header?.tablet?.headingGap)}
				${isValidCSS('padding', getBoxCSS(header?.tablet?.padding))}
				${isValidCSS('border-radius', getBoxCSS(header.normal.tablet.radius))}
			}

			${headSl}:hover{
				${isValidCSS('border-radius', getBoxCSS(header.hover.tablet.radius))}
			}

			${switcherWrapperSl}{
				${isValidCSS('gap', label?.tablet?.gap)}
			}
		}
		${mobileBreakpoint}{
			${headSl}{
				${isValidCSS('justify-content', toggle?.mobile?.align)}
				${isValidCSS('margin-bottom', header?.mobile?.headingGap)}
				${isValidCSS('padding', getBoxCSS(header?.mobile?.padding))}
				${isValidCSS('border-radius', getBoxCSS(header.normal.mobile.radius))}
			}

			${headSl}:hover{
				${isValidCSS('border-radius', getBoxCSS(header.hover.mobile.radius))}
			}

			${switcherWrapperSl}{
				${isValidCSS('gap', label?.mobile?.gap)}
			}
		}

	`
}
export default style;