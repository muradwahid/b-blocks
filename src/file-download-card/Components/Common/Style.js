import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	const { icon = {}, title = {}, description = {}, meta = {}, button = {}, advanced } = attributes;

	const iconSize = parseInt(icon.size, 10) || 48;

	const mainSl = `#${id} .b-blocks-file-download-card`;
	const badgeSl = `${mainSl} .b-blocks-file-download-card-badge`;
	const titleSl = `${mainSl} .b-blocks-file-download-card-title`;
	const descSl = `${mainSl} .b-blocks-file-download-card-desc`;
	const metaSl = `${mainSl} .b-blocks-file-download-card-meta`;
	const btnSl = `${mainSl} .b-blocks-file-download-card-btn`;

	const box = (prop, obj, d) => isValidCSS(prop, getBoxCSS(obj?.[d]));

	// Responsive box values (badge, title, button padding/margin/radius).
	const boxCSS = (d) => `
		${badgeSl}{ ${box('padding', icon.padding, d)} ${box('margin', icon.margin, d)} ${box('border-radius', icon.radius, d)} }
		${titleSl}{ ${box('padding', title.padding, d)} ${box('margin', title.margin, d)} ${box('border-radius', title.borderRadius, d)} }
		${descSl}{ ${box('padding', description.padding, d)} ${box('margin', description.margin, d)} ${box('border-radius', description.borderRadius, d)} }
		${metaSl}{ ${box('padding', meta.padding, d)} ${box('margin', meta.margin, d)} ${box('border-radius', meta.borderRadius, d)} }
		${btnSl}{ ${box('padding', button.normal?.padding, d)} ${box('margin', button.normal?.margin, d)} ${box('border-radius', button.normal?.radius, d)} }
		${btnSl}:hover, ${btnSl}:focus-visible{ ${box('padding', button.hover?.padding, d)} ${box('margin', button.hover?.margin, d)} ${box('border-radius', button.hover?.radius, d)} }
	`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', title.typo).googleFontLink}
			${getTypoCSS('', description.typo).googleFontLink}
			${getTypoCSS('', meta.typo).googleFontLink}
			${getTypoCSS('', button.typo).googleFontLink}
			${badgeSl}{
				width:${iconSize}px;
				height:${iconSize}px;
				font-size:${Math.round(iconSize * 0.28)}px;
				${getBackgroundCSS(icon.bg)}
				${isValidCSS('color', icon.color)}
				${getBorderCSS(icon.border)}
			}
			${titleSl}{
				${isValidCSS('color', title.color)}
				${getBackgroundCSS(title.bg)}
				${getBorderCSS(title.border)}
			}
			${getTypoCSS(titleSl, title.typo).styles}
			${descSl}{
				${isValidCSS('color', description.color)}
				${getBackgroundCSS(description.bg)}
				${getBorderCSS(description.border)}
			}
			${getTypoCSS(descSl, description.typo).styles}
			${metaSl}{
				${isValidCSS('color', meta.color)}
				${getBackgroundCSS(meta.bg)}
				${getBorderCSS(meta.border)}
			}
			${getTypoCSS(metaSl, meta.typo).styles}
			${btnSl}{
				${getBackgroundCSS(button.normal?.bg)}
				${isValidCSS('color', button.normal?.color)}
				${getBorderCSS(button.normal?.border)}
				transition:all ${button.transition ?? 0.2}s ease;
			}
			${getTypoCSS(btnSl, button.typo).styles}
			${btnSl}:hover, ${btnSl}:focus-visible{
				${getBackgroundCSS(button.hover?.bg)}
				${isValidCSS('color', button.hover?.color)}
				${getBorderCSS(button.hover?.border)}
			}
			${boxCSS('desktop')}
			${tabBreakpoint}{ ${boxCSS('tablet')} }
			${mobileBreakpoint}{ ${boxCSS('mobile')} }
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
