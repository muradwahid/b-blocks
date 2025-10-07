import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { getBorderRadiusCSS } from '../../utils/functions';

const Style = ({ attributes, id }) => {
	const { badge, style, arrows, advanced } = attributes;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .cttk-ticker-wrapper`;
	const wrapper = `${blockSl} .cttk-ticker-swiper-wrapper`;
	const badgeSl = `${wrapper} .cttk-ticker-badge`;
	const content = `${wrapper} .cttk-ticker-content-wrapper`;
	const nextBtn = `${wrapper} #cttk-nextBtn`;
	const prevBtn = `${wrapper} #cttk-prevBtn`;
	const btnNormal = (device) => `
		${isValidCSS('height', isExist(arrows[device].size) ? arrows[device].size + 'px' : '')}
		${isValidCSS('width', isExist(arrows[device].size) ? arrows[device].size + 'px' : '')}
		${isValidCSS('font-size', isExist(arrows[device].size) ? arrows[device].size + 'px' : '')}
		${isValidCSS('padding', getBoxCSS(arrows[device].padding))}
		${isValidCSS('color', arrows.normal.color)}
		${isValidCSS('fill', arrows.normal.color)}
		${isValidCSS('background', arrows.normal.bg)}
		${getBorderBoxCSS(arrows.normal.border)}
		${getBorderRadiusCSS(arrows.normal.borderRadius)}
`
	const btnHover = `
		${isValidCSS('color', arrows.hover.color)}
		${isValidCSS('fill', arrows.hover.color)}
		${isValidCSS('background', arrows.hover.bg)}
		${getBorderBoxCSS(arrows.hover.border)}
		${getBorderRadiusCSS(arrows.hover.borderRadius)}
`
	return <style>{`
		${generateCSS(id, advanced)}
		${getTypoCSS(badgeSl, badge.typography)?.googleFontLink}
		${getTypoCSS(`${content} a.cttk-ticker-link`, style.typography)?.googleFontLink}
		${getTypoCSS(badgeSl, badge.typography)?.styles}
		${badgeSl}{
			${isValidCSS('width', badge.desktop.width)}
			${isValidCSS('height', badge.desktop.height)}
			${isValidCSS('color', badge.color.text)}
			${isValidCSS('padding', getBoxCSS(badge.desktop.padding))}
			${isValidCSS('margin', getBoxCSS(badge.desktop.margin))}
			${getBorderBoxCSS(badge.border)}
			${isValidCSS('border-radius', getBoxCSS(badge.desktop.bRadius))}
			${getBackgroundCSS(badge.color.bg)}
		}
		${content}{
			${isValidCSS('background-color', style.bg)}
			${isValidCSS('padding', getBoxCSS(style.padding.desktop))}
			${getBorderRadiusCSS(style.bRadius)}
			width:calc(100% - ${isExist(badge.desktop.width) ? badge.desktop.width : '0px'});
		}
		${content} a.cttk-ticker-link{
			${isValidCSS('color', style.color.normal)}
			transition:all 0.2s ease-in-out;
		}
		${content} a.cttk-ticker-link:hover{
			${isValidCSS('color', style.color.hover)}
		}
		${nextBtn}{
			${btnNormal('desktop')}
			right:${arrows.desktop.alignLeft}px;
		}
		${nextBtn}:hover{
			${btnHover}
		}
		${prevBtn}{
			${btnNormal('desktop')}
			right:${arrows.desktop.alignRight}px;
		}
		${prevBtn}:hover{
			${btnHover}
		}

		${getTypoCSS(`${content} .cttk-ticker-link`, style.typography)?.styles}

		@media only screen and (min-width:641px) and (max-width: 1024px){
			${badgeSl}{
				${isValidCSS('width', badge.tablet.width)}
				${isValidCSS('height', badge.tablet.height)}
				${isValidCSS('padding', getBoxCSS(badge.tablet.padding))}
				${isValidCSS('margin', getBoxCSS(badge.tablet.margin))}
				${getBorderRadiusCSS(badge.tablet.bRadius)}
			}
			${content}{
				${isValidCSS('padding', getBoxCSS(style.padding.tablet))}
				width:calc(100% - ${isExist(badge.tablet.width) ? badge.tablet.width : '0px'});
			}
			${nextBtn}{
				${btnNormal('tablet')}
				right:${arrows.tablet.alignLeft}px;
			}
			${prevBtn}{
				${btnNormal('tablet')}
				right:${arrows.tablet.alignRight}px;
			}
		}

		@media only screen and (max-width: 640px){
			${badgeSl}{
				${isValidCSS('width', badge.mobile.width)}
				${isValidCSS('height', badge.mobile.height)}
				${isValidCSS('padding', getBoxCSS(badge.mobile.padding))}
				${isValidCSS('margin', getBoxCSS(badge.mobile.margin))}
				${getBorderRadiusCSS(badge.mobile.bRadius)}
			}
			${content}{
				${isValidCSS('padding', getBoxCSS(style.padding.mobile))}
				width:calc(100% - ${isExist(badge.mobile.width) ? badge.mobile.width : '0px'});
			}
			${nextBtn}{
			${btnNormal('mobile')}
				right:${arrows.mobile.alignLeft}px;
			}
			${prevBtn}{
			${btnNormal('mobile')}
				right:${arrows.mobile.alignRight}px;
			}
		}
	`}</style>
};
export default Style;
