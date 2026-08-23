import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const valignMap = { top: 'flex-start', middle: 'center', bottom: 'flex-end' };
const alignItemsMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

// Responsive resolver: string passthrough, else device with desktop→tablet→mobile inheritance.
const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

// btnGap value may be a legacy number (px) or a unit string (e.g. "2rem").
const gapCSS = (v) => (v == null || v === '') ? '' : (typeof v === 'number' ? `${v}px` : v);

const Style = ({ attributes, id, isBackend = false }) => {
	const { layout = {}, eyebrow = {}, heading = {}, subHeading = {}, button = {}, advanced } = attributes;

	const { minHeight = '60vh', verticalAlign = {}, contentAlign = {}, btnGap = {} } = layout;

	const mainSl = `#${id} .b-blocks-hero-section`;
	const containerSl = `${mainSl} .b-blocks-hero-section-container`;
	const eyebrowSl = `${mainSl} .b-blocks-hero-section-eyebrow`;
	const headingSl = `${mainSl} .b-blocks-hero-section-heading`;
	const subHeadingSl = `${mainSl} .b-blocks-hero-section-subheading`;
	const actionsSl = `${mainSl} .b-blocks-hero-section-actions`;
	const primarySl = `${mainSl} .b-blocks-hero-section-cta--primary`;

	const box = (prop, obj, d) => isValidCSS(prop, getBoxCSS(obj?.[d]));

	// Responsive alignment + button gap.
	const alignCSS = (d) => {
		const va = at(verticalAlign, d) || 'middle';
		const ca = at(contentAlign, d) || 'center';
		const gap = gapCSS(at(btnGap, d));
		return `
			${mainSl}{ align-items:${valignMap[va] || 'center'}; }
			${containerSl}{ ${isValidCSS('text-align', ca)} align-items:${alignItemsMap[ca] || 'center'}; }
			${subHeadingSl}{ ${ca === 'center' ? 'margin-left:auto;margin-right:auto;' : 'margin-left:0;margin-right:0;'} }
			${actionsSl}{ ${isValidCSS('gap', gap)} justify-content:${justifyMap[ca] || 'center'}; }
		`;
	};

	// Responsive box values (eyebrow / heading / sub-heading + button padding/radius).
	const boxCSS = (d) => `
		${eyebrowSl}{ ${box('padding', eyebrow.padding, d)} ${box('margin', eyebrow.margin, d)} ${box('border-radius', eyebrow.borderRadius, d)} }
		${headingSl}{ ${box('padding', heading.padding, d)} ${box('margin', heading.margin, d)} ${box('border-radius', heading.borderRadius, d)} }
		${subHeadingSl}{ ${box('padding', subHeading.padding, d)} ${box('margin', subHeading.margin, d)} ${box('border-radius', subHeading.borderRadius, d)} }
		${primarySl}{ ${box('padding', button.padding, d)} ${box('margin', button.margin, d)} ${box('border-radius', button.radius, d)} }
	`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', eyebrow.typo).googleFontLink}
			${getTypoCSS('', heading.typo).googleFontLink}
			${getTypoCSS('', subHeading.typo).googleFontLink}
			${getTypoCSS('', button.typo).googleFontLink}
			${mainSl}{
				${minHeight === 'auto' ? 'min-height:auto;' : `min-height:${minHeight};`}
			}
			${eyebrowSl}{
				${isValidCSS('color', eyebrow.color)}
				${getBackgroundCSS(eyebrow.bg)}
				${getBorderCSS(eyebrow.border)}
			}
			${getTypoCSS(eyebrowSl, eyebrow.typo).styles}
			${headingSl}{
				${isValidCSS('color', heading.color)}
				${getBackgroundCSS(heading.bg)}
				${getBorderCSS(heading.border)}
			}
			${getTypoCSS(headingSl, heading.typo).styles}
			${subHeadingSl}{
				${isValidCSS('color', subHeading.color)}
				${getBackgroundCSS(subHeading.bg)}
				${getBorderCSS(subHeading.border)}
			}
			${getTypoCSS(subHeadingSl, subHeading.typo).styles}
			${primarySl}{
				${getBackgroundCSS(button.normal?.bg)}
				${isValidCSS('color', button.normal?.color)}
				${getBorderCSS(button.normal?.border)}
				transition:all ${button.transition ?? 0.2}s ease;
			}
			${getTypoCSS(primarySl, button.typo).styles}
			${primarySl}:hover, ${primarySl}:focus-visible{
				${getBackgroundCSS(button.hover?.bg)}
				${isValidCSS('color', button.hover?.color)}
				${getBorderCSS(button.hover?.border)}
			}
			${alignCSS('desktop')}
			${boxCSS('desktop')}
			${tabBreakpoint}{ ${alignCSS('tablet')} ${boxCSS('tablet')} }
			${mobileBreakpoint}{ ${alignCSS('mobile')} ${boxCSS('mobile')} }
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
