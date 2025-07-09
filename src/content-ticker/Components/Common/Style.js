import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS";
import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
import { getBorderRadiusCSS } from "../../utils/functions";

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
          ${isValidCSS('height', isExist(arrows.size[device]) ? arrows.size[device] + "px" : "")}
        ${isValidCSS('width', isExist(arrows.size[device]) ? arrows.size[device] + "px" : "")}
        ${isValidCSS('font-size', isExist(arrows.size[device]) ? arrows.size[device] + "px" : "")}
        ${isValidCSS('padding', getBoxCSS(arrows.padding[device]))}
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
  return (
    <style>{`
      ${generateCSS(id, advanced)}
      ${getTypoCSS(badgeSl, badge.typography)?.googleFontLink}
      ${getTypoCSS(`${content} a.cttk-ticker-link`, style.typography)?.googleFontLink}
      ${getTypoCSS(badgeSl, badge.typography)?.styles}
      ${badgeSl}{
        ${isValidCSS('width', badge.width.desktop)}
        ${isValidCSS('height', badge.height.desktop)}
        ${isValidCSS('color', badge.color.text)}
        ${isValidCSS('padding', badge.padding.desktop)}
        ${isValidCSS('margin', badge.margin.desktop)}
        ${getBorderBoxCSS(badge.border)}
        ${getBorderRadiusCSS(badge.bRadius.desktop)}
        ${getBackgroundCSS(badge.color.bg)}
      }
      ${content}{
        ${isValidCSS('background-color', style.bg)}
        ${isValidCSS('padding', getBoxCSS(style.padding.desktop))}
        ${getBorderRadiusCSS(style.bRadius)}
        width:calc(100% - ${badge.width.desktop});
      }
      ${content} a.cttk-ticker-link{
        ${isValidCSS('color', style.color.normal)}
        transition:all 0.2s ease-in-out;
      }
      ${content} a.cttk-ticker-link:hover{
        ${isValidCSS('color', style.color.hover)}
      }
      ${nextBtn}{
        ${btnNormal("desktop")}
        right:${arrows.alignLeft.desktop}px;
      }
      ${nextBtn}:hover{
        ${btnHover}
      }
      ${prevBtn}{
        ${btnNormal("desktop")}
        right:${arrows.alignRight.desktop}px;
      }
      ${prevBtn}:hover{
        ${btnHover}
      }

      ${getTypoCSS(`${content} .cttk-ticker-link`, style.typography)?.styles}

      @media only screen and (min-width:641px) and (max-width: 1024px){
        ${badgeSl}{
          ${isValidCSS('width', badge.width.tablet)}
          ${isValidCSS('height', badge.height.tablet)}
          ${isValidCSS('padding', getBoxCSS(badge.padding.tablet))}
          ${isValidCSS('margin', getBoxCSS(badge.margin.tablet))}
          ${getBorderRadiusCSS(badge.bRadius.tablet)}
        }
        ${content}{
          ${isValidCSS('padding', getBoxCSS(style.padding.tablet))}
          width:calc(100% - ${badge.width.tablet});
        }
        ${nextBtn}{
          ${btnNormal("tablet")}
          right:${arrows.alignLeft.tablet}px;
        }
        ${prevBtn}{
          ${btnNormal("tablet")}
          right:${arrows.alignRight.tablet}px;
        }
      }

      @media only screen and (max-width: 640px){
        ${badgeSl}{
          ${isValidCSS('width', badge.width.mobile)}
          ${isValidCSS('height', badge.height.mobile)}
          ${isValidCSS('padding', getBoxCSS(badge.padding.mobile))}
          ${isValidCSS('margin', getBoxCSS(badge.margin.mobile))}
          ${getBorderRadiusCSS(badge.bRadius.mobile)}
        }
        ${content}{
          ${isValidCSS('padding', getBoxCSS(style.padding.mobile))}
          width:calc(100% - ${badge.width.mobile});
        }
        ${nextBtn}{
          ${btnNormal("mobile")}
          right:${arrows.alignLeft.mobile}px;
        }
        ${prevBtn}{
          ${btnNormal("mobile")}
          right:${arrows.alignRight.mobile}px;
        }
      }
    `}</style>
  );
};
export default Style;
