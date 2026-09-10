import { useMemo } from 'react';

import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { resolveDevice, withUnit } from '../../utils/options';

/**
 * A value goes into the sheet as written, so a stray brace in a saved attribute
 * would close its rule and let whatever follows style the whole page.
 */
// const cssSafe = (value) => {
// 	if ('string' !== typeof value) return value;

// 	const stripped = value.replace(/\/\*|\*\//g, '').replace(/[{};<>\\]/g, '').replace(/[\r\n\t]+/g, ' ');
// 	const odd = (mark) => (stripped.split(mark).length - 1) % 2;

// 	return odd('"') || odd("'") ? stripped.replace(/["']/g, '') : stripped;
// };

// const deepSafe = (value) => {
// 	if (Array.isArray(value)) return value.map(deepSafe);

// 	if (value && 'object' === typeof value) return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepSafe(val)]));

// 	return cssSafe(value);
// };

/** Every rule is scoped to the wrapper id, so instances never leak into each other. */
const Style = ({ attributes, id, isBackend = false }) => {
	// Advanced is the one group left as authored: its Custom CSS field is meant
	// to carry braces of its own. `code` never reaches the sheet at all.
	const { options = {}, box = {}, codeTypo = {}, headerStyle = {}, copyBtn = {}, buttonIcon = {}, lineNumber = {}, highlight = {}, caption = {}, advanced = {} } = attributes;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .${prefix}`;
	const headSl = `${blockSl} .${prefix}-header`;
	const nameSl = `${blockSl} .${prefix}-filename`;
	const copySl = `${blockSl} .${prefix}-copy`;
	const preSl = `${blockSl} .${prefix}-pre`;
	const codeSl = `${blockSl} .${prefix}-code`;
	const gutterSl = `${blockSl} .${prefix}-gutter`;
	const badgeSl = `${blockSl} .${prefix}-badge`;
	const markSl = `${blockSl} .${prefix}-marks span`;
	const capSl = `${blockSl} .${prefix}-caption`;
	const iconSl = `${blockSl} .${prefix}-btn-icon`;
	const toggleSl = `${blockSl} .${prefix}-toggle`;

	// Untouched attributes resolve to '', so a rule with no body is not written.
	const rule = (selector, ...declarations) => {
		const body = declarations.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

		return body ? `${selector}{ ${body} }` : '';
	};

	const borderCSS = (value) => Object.keys(value || {}).length ? getBorderBoxCSS(value) : '';

	// The glyph turns inside its own box, so its padding, background and border
	// stay square while it spins.
	const iconStateCSS = (selector, state) => rule(selector,
		isValidCSS('color', state?.color),
		getBackgroundCSS(state?.background),
		borderCSS(state?.border),
		isValidCSS('rotate', state?.rotate)
	);

	// Copied is emitted last so it wins over hover: the pointer is still on the
	// button in the moment right after a click.
	const copyStateCSS = (selector, state) => rule(selector,
		isValidCSS('color', state?.color),
		getBackgroundCSS(state?.background),
		borderCSS(state?.border)
	);

	const ALIGN = {
		left: 'margin-left: 0; margin-right: auto;',
		right: 'margin-left: auto; margin-right: 0;',
		center: 'margin-left: auto; margin-right: auto;'
	};

	// Every breakpoint states its own box, so a wider one never leaks into it.
	const boxCSS = (device) => `
		${rule(blockSl,
		ALIGN[resolveDevice(box, device, 'align', 'center')] || ALIGN.center,
		isValidCSS('width', withUnit(resolveDevice(box, device, 'width', '100%'), '100%')),
		isValidCSS('height', withUnit(resolveDevice(box, device, 'height'))),
		isValidCSS('padding', getBoxCSS(box?.[device]?.padding)),
		isValidCSS('border-radius', getBoxCSS(box?.[device]?.radius))
	)}
		${rule(iconSl,
		isValidCSS('padding', getBoxCSS(buttonIcon?.[device]?.padding)),
		isValidCSS('margin', getBoxCSS(buttonIcon?.[device]?.margin)),
		isValidCSS('border-radius', getBoxCSS(buttonIcon?.[device]?.radius))
	)}`;

	const css = useMemo(() => `
		${getTypoCSS('', codeTypo)?.googleFontLink}
		${getTypoCSS('', headerStyle.filenameTypo)?.googleFontLink}
		${getTypoCSS('', copyBtn.typo)?.googleFontLink}
		${getTypoCSS('', caption.typo)?.googleFontLink}
		${getTypoCSS(`${preSl}, ${codeSl}, ${gutterSl}`, codeTypo)?.styles}
		${getTypoCSS(nameSl, headerStyle.filenameTypo)?.styles}
		${getTypoCSS(copySl, copyBtn.typo)?.styles}
		${getTypoCSS(capSl, caption.typo)?.styles}

		${rule(blockSl,
		getBackgroundCSS(box.background),
		borderCSS(box.border),
		isValidCSS('box-shadow', getMultiShadowCSS(box.shadow?.normal))
	)}
		${rule(`${blockSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(box.shadow?.hover)))}

		${rule(preSl,
		// Zero means unlimited; anything else caps the visible run and scrolls.
		// The cap is a border-box height, so the pre's own vertical padding has to
		// be added or the last row is clipped.
		isValidCSS('max-height', 0 < (parseInt(options.maxLines, 10) || 0) ? `calc(${parseInt(options.maxLines, 10)} * var(--bbCodeLine, 1.6em) + 2 * var(--bbChPreY, 14px))` : '')
	)}
		${0 < (parseInt(options.maxLines, 10) || 0) ? rule(`${blockSl}.is-expanded .${prefix}-pre`, 'max-height: none;') : ''}
		${rule(codeSl, isValidCSS('tab-size', parseInt(options.tabSize, 10) || ''))}

		${rule(headSl, getBackgroundCSS(headerStyle.background))}
		${rule(nameSl, isValidCSS('color', headerStyle.filenameColor))}
		${rule(badgeSl,
		isValidCSS('color', headerStyle.badgeColor),
		getBackgroundCSS(headerStyle.badgeBackground)
	)}

		${rule(markSl, getBackgroundCSS(highlight.background))}
		${rule(`${markSl}::after`, isValidCSS('background', highlight.borderColor))}

		${rule(capSl,
		isValidCSS('color', caption.color),
		isValidCSS('text-align', caption.align)
	)}
		${rule(toggleSl, isValidCSS('color', copyBtn.normal?.color))}

		${rule(gutterSl,
		isValidCSS('color', lineNumber.color),
		getBackgroundCSS(lineNumber.background),
		isValidCSS('border-right-color', lineNumber.borderColor)
	)}

		${rule(copySl,
		isValidCSS('padding', getBoxCSS(copyBtn.padding)),
		isValidCSS('border-radius', getBoxCSS(copyBtn.radius))
	)}
		${copyStateCSS(copySl, copyBtn.normal)}
		${copyStateCSS(`${copySl}:hover`, copyBtn.hover)}
		${copyStateCSS(`${copySl}:focus-visible`, copyBtn.hover)}
		${copyStateCSS(`${copySl}.is-copied`, copyBtn.copied)}

		${rule(copySl, isValidCSS('gap', withUnit(buttonIcon.spacing, '')))}
		${iconStateCSS(iconSl, buttonIcon.normal)}
		${iconStateCSS(`${copySl}:hover .${prefix}-btn-icon`, buttonIcon.hover)}
		${rule(`${iconSl} svg, ${iconSl} img`,
		isValidCSS('width', withUnit(buttonIcon.size, '')),
		isValidCSS('height', withUnit(buttonIcon.size, ''))
	)}

		${boxCSS('desktop')}

		${tabBreakpoint}{
			${boxCSS('tablet')}
		}

		${mobileBreakpoint}{
			${boxCSS('mobile')}
		}

		${generateCSS(id, advanced, isBackend, false)}
		`, [attributes, id, isBackend]);

	return <style dangerouslySetInnerHTML={{ __html: css }} />;
};
export default Style;
