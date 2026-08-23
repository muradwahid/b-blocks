/**
 * Event Card — per-instance style.
 *
 * Emits dynamic real CSS scoped to the block wrapper id (no CSS variables).
 * Card spacing / border / radius / shadow come from the Advanced tab
 * (generateCSS); style.scss holds the structural rules and static defaults.
 */

import { getBackgroundCSS, getBorderBoxCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';

const getDeviceBoxVal = (boxObj, dev) => {
	if (!boxObj) return '';
	if (typeof boxObj === 'object' && boxObj[dev]) {
		return getBoxCSS(boxObj[dev]);
	}
	if (dev === 'desktop' && typeof boxObj === 'object' && ('top' in boxObj || 'right' in boxObj || 'bottom' in boxObj || 'left' in boxObj)) {
		return getBoxCSS(boxObj);
	}
	return '';
};

const getDeviceBorderVal = (borderObj, dev) => {
	if (!borderObj) return '';
	if (typeof borderObj === 'object' && borderObj[dev]) {
		return getBorderCSS(borderObj[dev]);
	}
	if (dev === 'desktop') {
		return getBorderCSS(borderObj);
	}
	return '';
};

const Style = ({ attributes, id, isBackend = false }) => {
	const { card = {}, badge = {}, cta = {}, title = {}, meta = {}, description = {}, location = {}, organizer = {}, status: statusStyle = {}, image = {}, advanced = {} } = attributes;
	const { bg: cardBg, maxWidth } = card;
	const { color: locationColor, iconColor: locationIconColor, typo: locationTypo = {} } = location;
	const { color: organizerColor, iconColor: organizerIconColor, typo: organizerTypo = {} } = organizer;

	const ctaNormalColor = cta.color || cta.text;
	const ctaHoverColor = cta.hoverColor || cta.hoverText || ctaNormalColor;
	const ctaBgCSS = typeof cta.bg === 'object' ? getBackgroundCSS(cta.bg) : isValidCSS('background-color', cta.bg || '#146EF5');
	const ctaHoverBgCSS = typeof cta.hoverBg === 'object' ? getBackgroundCSS(cta.hoverBg) : isValidCSS('background-color', cta.hoverBg || '#0040E3');
	const ctaBorderCSS = getBorderBoxCSS(cta.border) || (cta.border ? getDeviceBorderVal(cta.border, 'desktop') : (cta.borderRadius ? `border-radius: ${parseInt(cta.borderRadius, 10) || 0}px;` : ''));
	const ctaPaddingCSS = isValidCSS('padding', getDeviceBoxVal(cta.padding, 'desktop'));
	const ctaMarginCSS = isValidCSS('margin', getDeviceBoxVal(cta.margin, 'desktop'));
	const ctaRadiusCSS = isValidCSS('border-radius', getDeviceBoxVal(cta.bRadius, 'desktop'));

	const mw = maxWidth === '0px' ? '100%' : (maxWidth || '640px');

	const rootSl = `#${id} .b-blocks-event-card`;
	const innerSl = `#${id} .b-blocks-event-card-inner`;
	const badgeSl = `#${id} .b-blocks-event-card-badge`;
	const titleSl = `#${id} .b-blocks-event-card-title`;
	const metaSl = `#${id} .b-blocks-event-card-meta`;
	const descSl = `#${id} .b-blocks-event-card-description`;
	const statusSl = `#${id} .b-blocks-event-card-status`;
	const coverImgSl = `#${id} .b-blocks-event-card-cover img`;
	const locationSl = `#${id} .b-blocks-event-card-meta-location`;
	const organizerSl = `#${id} .b-blocks-event-card-meta-organizer`;
	const btnSl = `#${id} .b-blocks-event-card-btn`;

	// Per-element CSS: color, background, border, radius, padding, margin + typography.
	const elementCSS = (sl, obj = {}) => `
		${sl}{
			${isValidCSS('color', obj.color)}
			${getBackgroundCSS(obj.bg)}
			${getBorderBoxCSS(obj.border) || getDeviceBorderVal(obj.border, 'desktop')}
			${isValidCSS('border-radius', getDeviceBoxVal(obj.bRadius, 'desktop'))}
			${isValidCSS('padding', getDeviceBoxVal(obj.padding, 'desktop'))}
			${isValidCSS('margin', getDeviceBoxVal(obj.margin, 'desktop'))}
		}
		${getTypoCSS(sl, obj.typo || {}).styles}
	`;

	const elementBoxCSS = (sl, obj = {}, dev = 'desktop') => {
		const pad = getDeviceBoxVal(obj.padding, dev);
		const mar = getDeviceBoxVal(obj.margin, dev);
		const rad = getDeviceBoxVal(obj.bRadius, dev);
		const bor = getDeviceBorderVal(obj.border, dev);
		if (!pad && !mar && !rad && !bor) return '';
		return `
			${sl}{
				${isValidCSS('padding', pad)}
				${isValidCSS('margin', mar)}
				${isValidCSS('border-radius', rad)}
				${bor}
			}
		`;
	};

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', badge.typo).googleFontLink}
			${getTypoCSS('', title.typo).googleFontLink}
			${getTypoCSS('', meta.typo).googleFontLink}
			${getTypoCSS('', description.typo).googleFontLink}
			${getTypoCSS('', statusStyle.typo).googleFontLink}
			${getTypoCSS('', cta.typo).googleFontLink}
			${rootSl}{ max-width: ${mw}; }
			${innerSl}{ ${isValidCSS('background-color', cardBg)} }
			${elementCSS(badgeSl, badge)}
			${btnSl}{
				${isValidCSS('color', ctaNormalColor)}
				${ctaBgCSS}
				${ctaBorderCSS}
				${ctaRadiusCSS}
				${ctaPaddingCSS}
				${ctaMarginCSS}
				transition: all ${cta.transition ?? 0.3}s ease-in-out;
				${!cta.typo?.fontSize && cta.fontSize ? isValidCSS('font-size', cta.fontSize) : ''}
			}
			${getTypoCSS(btnSl, cta.typo || {}).styles}
			${btnSl}:hover, ${btnSl}:focus{
				${ctaHoverBgCSS}
				${isValidCSS('color', ctaHoverColor)}
			}
			${elementCSS(titleSl, title)}
			${elementCSS(metaSl, meta)}
			${elementCSS(descSl, description)}
			${elementCSS(statusSl, statusStyle)}
			${elementCSS(coverImgSl, image)}
			${getTypoCSS('', locationTypo).googleFontLink}
			${getTypoCSS(locationSl, locationTypo).styles}
			${locationSl}{ ${isValidCSS('color', locationColor)} }
			${locationSl} .b-blocks-event-card-meta-icon{ ${isValidCSS('color', locationIconColor)} }
			${getTypoCSS('', organizerTypo).googleFontLink}
			${getTypoCSS(organizerSl, organizerTypo).styles}
			${organizerSl}{ ${isValidCSS('color', organizerColor)} }
			${organizerSl} .b-blocks-event-card-meta-icon{ ${isValidCSS('color', organizerIconColor)} }
			${tabBreakpoint}{
				${elementBoxCSS(badgeSl, badge, 'tablet')}
				${elementBoxCSS(titleSl, title, 'tablet')}
				${elementBoxCSS(metaSl, meta, 'tablet')}
				${elementBoxCSS(descSl, description, 'tablet')}
				${elementBoxCSS(statusSl, statusStyle, 'tablet')}
				${elementBoxCSS(coverImgSl, image, 'tablet')}
				${elementBoxCSS(btnSl, cta, 'tablet')}
			}
			${mobileBreakpoint}{
				${elementBoxCSS(badgeSl, badge, 'mobile')}
				${elementBoxCSS(titleSl, title, 'mobile')}
				${elementBoxCSS(metaSl, meta, 'mobile')}
				${elementBoxCSS(descSl, description, 'mobile')}
				${elementBoxCSS(statusSl, statusStyle, 'mobile')}
				${elementBoxCSS(coverImgSl, image, 'mobile')}
				${elementBoxCSS(btnSl, cta, 'mobile')}
			}
			${generateCSS(id, advanced, isBackend)}
			`.replace(/\s+/g, ' ').trim(),
		}}
	/>;
};
export default Style;
