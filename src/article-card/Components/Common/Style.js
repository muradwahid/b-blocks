import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';

import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';

import { getBackgroundCSS, getBorderCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

const alignSelfMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

const filterCSS = (f) => {
	if (!f) return '';
	const parts = [];
	if (f.blur) parts.push(`blur(${f.blur}px)`);
	if (f.brightness != null && f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
	if (f.contrast != null && f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
	if (f.saturate != null && f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
	if (f.grayscale) parts.push(`grayscale(${f.grayscale}%)`);
	return parts.length ? `filter:${parts.join(' ')};` : '';
};

const Style = ({ attributes, id, isBackend = false }) => {
	const { advanced, layout = {}, image = {}, badge = {}, meta = {}, colors = {}, card = {}, cta = {}, typography = {}, heading: headingBox = {}, excerpt: excerptBox = {} } = attributes;

	const { type: layoutType = {}, alignment } = layout;
	const normAlign = typeof alignment === 'string' ? { desktop: alignment, tablet: '', mobile: '' } : (alignment || {});
	const { position: imagePosition = {}, objectFit = {}, objectPosition = {}, filter: imageFilter = {}, splitRatio = {}, splitLeft = {}, splitRight = {} } = image;
	const { align: badgeAlign, bg: badgeBg, color: badgeColor, padding: badgePadding = {}, margin: badgeMargin = {}, border: badgeBorder = {}, borderRadius: badgeRadius = {} } = badge;
	const { heading: headingColor, text: textColor, meta: metaColor } = colors;
	const { background = {}, padding = {}, border = {}, borderRadius = {}, shadow } = card;
	const {
		normal: ctaNormal = {},
		hover: ctaHover = {},
		padding: ctaPadding = {},
		margin: ctaMargin = {},
		borderRadius: ctaRadius = {},
		transition: ctaTransition = 0.2,
	} = cta;
	const { heading: headingTypo = {}, excerpt: excerptTypo = {}, cta: ctaTypo = {}, badge: badgeTypo = {}, meta: metaTypo = {} } = typography;

	const mainSl = `#${id} .b-blocks-article-card`;
	const cardSl = `${mainSl} .b-blocks-article-card-card`;
	const mediaSl = `${mainSl} .b-blocks-article-card-media`;
	const imgSl = `${mainSl} .b-blocks-article-card-img`;
	const phSl = `${mainSl} .b-blocks-article-card-media-placeholder`;
	const bodySl = `${mainSl} .b-blocks-article-card-body`;
	const badgeSl = `${mainSl} .b-blocks-article-card-badge`;
	const headingSl = `${mainSl} .b-blocks-article-card-heading`;
	const excerptSl = `${mainSl} .b-blocks-article-card-excerpt`;
	const metaSl = `${mainSl} .b-blocks-article-card-meta`;
	const metaIconSl = `${mainSl} .b-blocks-article-card-meta-icon`;
	const ctaSl = `${mainSl} .b-blocks-article-card-cta`;
	const linkSl = `${mainSl} .b-blocks-article-card-link`;
	const ctaBtnSl = `#${id} .b-blocks-article-card--cta-button .b-blocks-article-card-cta`;
	const ctaLinkSl = `#${id} .b-blocks-article-card--cta-link .b-blocks-article-card-cta`;

	const box = (prop, obj, d) => isValidCSS(prop, getBoxCSS(obj?.[d]));

	const boxCSS = (d) => `
		${bodySl}{ ${box('padding', padding, d)} }
		${cardSl}{ ${box('border-radius', borderRadius, d)} }
		${badgeSl}{ ${box('padding', badgePadding, d)} ${box('margin', badgeMargin, d)} ${box('border-radius', badgeRadius, d)} }
		${headingSl}{ ${box('padding', headingBox.padding, d)} ${box('margin', headingBox.margin, d)} ${box('border-radius', headingBox.borderRadius, d)} }
		${excerptSl}{ ${box('padding', excerptBox.padding, d)} ${box('margin', excerptBox.margin, d)} ${box('border-radius', excerptBox.borderRadius, d)} }
		${metaSl}{ ${box('padding', meta.padding, d)} ${box('margin', meta.margin, d)} ${box('border-radius', meta.borderRadius, d)} }
		${ctaBtnSl}{ ${box('padding', ctaPadding, d)} ${box('margin', ctaMargin, d)} ${box('border-radius', ctaRadius, d)} }
	`;

	const imgCSS = (d) => {
		const fit = at(objectFit, d) || 'cover';
		const pos = at(objectPosition, d) || 'center';
		return `
			${imgSl}{ ${isValidCSS('object-fit', fit)} ${isValidCSS('object-position', pos)} ${filterCSS(imageFilter?.[d])} }
		`;
	};

	const layoutCSS = (d) => {
		const type = at(layoutType, d) || 'horizontal';
		const isH = type === 'horizontal';
		const pos = at(imagePosition, d) || (isH ? 'left' : 'top');
		const split = at(splitRatio, d);
		const pct = parseInt(split, 10) || 40;
		const imgBasis = split === 'custom' ? (at(splitLeft, d) || '40%') : `${pct}%`;
		const bodyBasis = split === 'custom' ? (at(splitRight, d) || '60%') : `${100 - pct}%`;
		const dir = isH ? (pos === 'right' ? 'row-reverse' : 'row') : (pos === 'bottom' ? 'column-reverse' : 'column');

		const align = at(normAlign, d) || 'left';
		let alignCSS = '';
		if (align === 'center') {
			alignCSS = `
				${mainSl}{ display: flex; justify-content: center; }
				${bodySl}{ align-items: center; text-align: center; }
				${ctaSl}{ align-self: center !important; }
			`;
		} else if (align === 'right') {
			alignCSS = `
				${mainSl}{ display: flex; justify-content: flex-end; }
				${bodySl}{ align-items: flex-end; text-align: right; }
				${ctaSl}{ align-self: flex-end !important; }
			`;
		} else {
			alignCSS = `
				${mainSl}{ display: block; }
				${bodySl}{ align-items: flex-start; text-align: left; }
				${ctaSl}{ align-self: flex-start; }
			`;
		}

		return `
			${cardSl}, ${linkSl}{ flex-direction:${dir}; }
			${isH ? `
				${mediaSl}{ flex:0 0 ${imgBasis}; max-width:${imgBasis}; width:${imgBasis}; align-self:stretch; position:relative; }
				${imgSl}{ width:100%; height:100%; aspect-ratio:auto; }
				${phSl}{ width:100%; height:100%; min-height:180px; }
				${bodySl}{ flex:1 1 ${bodyBasis}; max-width:${bodyBasis}; width:${bodyBasis}; justify-content:center; }
			` : `
				${mediaSl}{ flex:0 0 auto; width:100%; max-width:100%; align-self:auto; }
				${imgSl}{ width:100%; height:auto; }
				${phSl}{ width:100%; min-height:180px; }
				${bodySl}{ flex:1 1 auto; width:100%; max-width:100%; justify-content:normal; }
			`}
			${alignCSS}
		`;
	};

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', headingTypo).googleFontLink}
			${getTypoCSS('', excerptTypo).googleFontLink}
			${getTypoCSS('', ctaTypo).googleFontLink}
			${getTypoCSS('', badgeTypo).googleFontLink}
			${getTypoCSS('', metaTypo).googleFontLink}
			${cardSl}{
				${isValidCSS('box-shadow', getMultiShadowCSS(shadow))}
				${getBackgroundCSS(background)}
				${getBorderCSS(border)}
			}
			${badgeSl}{
				align-self:${alignSelfMap[badgeAlign] || 'flex-start'} !important;
				${getBackgroundCSS(badgeBg)}
				color:${badgeColor || '#ffffff'};
				${getBorderCSS(badgeBorder)}
			}
			${headingSl}{
				color:${headingColor || '#111827'};
				${getBackgroundCSS(headingBox.background)}
				${getBorderCSS(headingBox.border)}
			}
			${excerptSl}{
				color:${textColor || '#374151'};
				${getBackgroundCSS(excerptBox.background)}
				${getBorderCSS(excerptBox.border)}
			}
			${metaSl}{
				color:${meta.color || metaColor || '#6b7280'};
				${getBackgroundCSS(meta.bg)}
				${getBorderCSS(meta.border)}
			}
			${metaIconSl}{
				color:${meta.iconColor || meta.color || metaColor || '#6b7280'};
			}
			${metaIconSl} svg{
				fill: currentColor;
			}
			${getTypoCSS(headingSl, headingTypo).styles}
			${getTypoCSS(excerptSl, excerptTypo).styles}
			${getTypoCSS(ctaSl, ctaTypo).styles}
			${getTypoCSS(badgeSl, badgeTypo).styles}
			${getTypoCSS(metaSl, metaTypo).styles}
			${ctaBtnSl}{
				${getBorderCSS(ctaNormal.border)}
				${getBackgroundCSS(ctaNormal.bg)}
				${isValidCSS('box-shadow', getMultiShadowCSS(ctaNormal.shadow))}
				color:${ctaNormal.color || '#ffffff'};
				transition:all ${ctaTransition}s ease;
			}
			${ctaBtnSl}:hover, ${ctaBtnSl}:focus-visible{
				${getBackgroundCSS(ctaHover.bg)}
				${getBorderCSS(ctaHover.border)}
				${isValidCSS('box-shadow', getMultiShadowCSS(ctaHover.shadow))}
				color:${ctaHover.color || '#ffffff'};
			}
			${ctaLinkSl}{ color:${ctaNormal.bg?.color || '#2563eb'}; }
			${ctaSl}:focus-visible, ${linkSl}:focus-visible{
				outline:2px solid ${ctaNormal.bg?.color || '#2563eb'};
				outline-offset:2px;
			}
			${boxCSS('desktop')}
			${imgCSS('desktop')}
			${layoutCSS('desktop')}
			${tabBreakpoint}{
				${boxCSS('tablet')}
				${imgCSS('tablet')}
				${layoutCSS('tablet')}
			}
			${mobileBreakpoint}{
				${boxCSS('mobile')}
				${imgCSS('mobile')}
				${layoutCSS('mobile')}
			}
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
