import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { alignment, styles } = attributes;
	const { normal, hover, desktop, tablet, mobile, typo } = styles;

	const mainSl = `#${id}.wp-block-b-blocks-whatsapp-chat`;
	const btnWrapper = `${mainSl} .bBlocks-whatsapp-block-wrapper`;
	const waBtn = `${mainSl} .bBlocks-whatsapp-block-btn`;
	const waBtnPulse = `${waBtn}.bBlocks-whatsapp-block-btn--pulse`;
	const waBtnText = `${waBtn} .bBlocks-whatsapp-block-btn__text`;
	const waBtnIcon = `${waBtn} .bBlocks-whatsapp-block-btn__icon`;
	const waBtnStatus = `${waBtn} .bBlocks-whatsapp-block-btn__status-dot`;


	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', typo).googleFontLink}
		${getTypoCSS(waBtnText, typo).styles}

		${btnWrapper}{
			${isValidCSS('align-items', alignment)}
		}

		${waBtnPulse} {
			animation: bBlocks-whatsapp-block-pulse 2s infinite;
		}

		@keyframes bBlocks-whatsapp-block-pulse {
			0% {
				box-shadow: 0 0 0 0 ${styles.pulseColor};
			}

			70% {
				box-shadow: 0 0 0 12px rgba(37, 211, 102, 0);
			}

			100% {
				box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
			}
		}

		${waBtn}{
			${isValidCSS('margin',getBoxCSS(desktop.margin))}
			${isValidCSS('padding',getBoxCSS(desktop.padding))}
			${getBackgroundCSS(normal.bg)}
			${isValidCSS('color', normal.color)}
			${getBorderBoxCSS(normal.border)}
			${isValidCSS('border-radius', getBoxCSS(normal.radius))}
			${getShadowCSS(normal.shadow)}
			transition: all ${hover.transition}s ease-in-out;
		}
		${waBtn}:hover{
			${getBackgroundCSS(hover.bg)}
			${getBorderBoxCSS(hover.border)}
			${isValidCSS('color', hover.color)}
			${isValidCSS('border-radius', getBoxCSS(hover.radius))}
			${getShadowCSS(hover.shadow)}
		}

		${waBtnText}{
			${isValidCSS('color', normal.color)}
		}

		${waBtn}:hover .bBlocks-whatsapp-block-btn__text{
			${isValidCSS('color', hover.color)}
		}

		${waBtnIcon}>svg{
			${isValidCSS('width', styles.icon.size)}
			${isValidCSS('fill', styles.icon.normal.color)}
		}

		${waBtn}:hover .bBlocks-whatsapp-block-btn__icon>svg{
			${isValidCSS('fill', styles.icon.hover.color)}
		}
		
		${waBtnStatus}{
			${getBackgroundCSS(styles.status.color)}
			${isValidCSS('width',styles.status.size)}
			${isValidCSS('height', styles.status.size)}
			${isValidCSS('left', styles.status.position.x)}
			${isValidCSS('top', styles.status.position.y)}
		}
		
		${tabBreakpoint}{
			${waBtn}{
				${isValidCSS('margin', getBoxCSS(tablet.margin))}
				${isValidCSS('padding', getBoxCSS(tablet.padding))}
			}
		}
		${mobileBreakpoint}{
			${waBtn}{
				${isValidCSS('margin', getBoxCSS(mobile.margin))}
				${isValidCSS('padding', getBoxCSS(mobile.padding))}
			}
		}
		
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;