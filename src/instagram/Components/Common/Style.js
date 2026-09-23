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

const cssSafe = (value) => {
	if ('string' !== typeof value) return value;

	const stripped = value.replace(/\/\*|\*\//g, '').replace(/[{};<>\\]/g, '').replace(/[\r\n\t]+/g, ' ');
	const odd = (mark) => (stripped.split(mark).length - 1) % 2;

	return odd('"') || odd("'") ? stripped.replace(/["']/g, '') : stripped;
};

/** Every rule is scoped to the wrapper id, so instances never leak into each other. */
const Style = ({ attributes, id, isBackend = false }) => {
	// Advanced stays as authored: its Custom CSS field is meant to carry braces.
	const { advanced = {} } = attributes;
	const { grid = {}, item = {}, caption = {}, profile = {}, followBtn = {}, loadMoreBtn = {}, lightbox = {} } = attributes;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .${prefix}`;
	const headSl = `${blockSl} .${prefix}-header`;
	const gridSl = `${blockSl} .${prefix}-grid`;
	const itemSl = `${blockSl} .${prefix}-item`;
	const figureSl = `${blockSl} .${prefix}-figure`;
	const overlaySl = `${blockSl} .${prefix}-overlay`;
	const typeSl = `${blockSl} .${prefix}-type`;
	const capSl = `${blockSl} .${prefix}-caption`;
	const photoSl = `${blockSl} .${prefix}-photo`;
	const userSl = `${blockSl} .${prefix}-username`;
	const nameSl = `${blockSl} .${prefix}-name, ${blockSl} .${prefix}-bio`;
	const followSl = `${blockSl} .${prefix}-follow`;
	const moreSl = `${blockSl} .${prefix}-load-more`;
	// The lightbox is portaled to the body, so it is matched by the block id it
	// carries rather than by being inside the wrapper.
	const lightSl = `.${prefix}-lightbox[data-bb-id="${cssSafe(id)}"]`;

	// Untouched attributes resolve to '', so a rule with no body is not written.
	const rule = (selector, ...declarations) => {
		const body = declarations.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

		return body ? `${selector}{ ${body} }` : '';
	};

	const borderCSS = (value) => Object.keys(value || {}).length ? getBorderBoxCSS(value) : '';

	const resolveBox = (obj, device) => {
		if (!obj) return null;
		if (obj.desktop || obj.tablet || obj.mobile) {
			return obj[device] || null;
		}
		if ('desktop' === device && (obj.top !== undefined || obj.right !== undefined)) {
			return obj;
		}
		return null;
	};

	const buttonDeviceCSS = (selector, config = {}, device) => {
		const normalPad = resolveBox(config.normal?.padding, device) || ('desktop' === device ? resolveBox(config.padding, device) : null);
		const normalRad = resolveBox(config.normal?.radius, device) || ('desktop' === device ? resolveBox(config.radius, device) : null);
		const hoverPad = resolveBox(config.hover?.padding, device);
		const hoverRad = resolveBox(config.hover?.radius, device);

		return `
			${rule(selector,
			isValidCSS('padding', getBoxCSS(normalPad)),
			isValidCSS('border-radius', getBoxCSS(normalRad))
		)}
			${rule(`${selector}:hover, ${selector}:focus-visible`,
			isValidCSS('padding', getBoxCSS(hoverPad)),
			isValidCSS('border-radius', getBoxCSS(hoverRad))
		)}
		`;
	};

	// Both buttons share a shape, so they share the rule builder too.
	const buttonCSS = (selector, config = {}) => `
		${rule(selector,
		isValidCSS('color', config.normal?.color),
		getBackgroundCSS(config.normal?.background),
		borderCSS(config.normal?.border),
		isValidCSS('box-shadow', getMultiShadowCSS(Array.isArray(config.normal?.shadow) ? config.normal.shadow : (config.shadow || [])))
	)}
		${rule(`${selector}:hover, ${selector}:focus-visible`,
		isValidCSS('color', config.hover?.color),
		getBackgroundCSS(config.hover?.background),
		borderCSS(config.hover?.border),
		isValidCSS('box-shadow', getMultiShadowCSS(Array.isArray(config.hover?.shadow) ? config.hover.shadow : []))
	)}
		${buttonDeviceCSS(selector, config, 'desktop')}
	`;

	// Columns and gaps are the one place a narrower breakpoint must always state
	// its own value: an empty column count would otherwise inherit the desktop
	// grid rather than fall back to the block's own default.
		const gridCSS = (device) => rule(gridSl,
			isValidCSS('grid-template-columns', `repeat(${parseInt(resolveDevice(grid, device, 'columns', 4), 10) || 1}, minmax(0, 1fr))`),
			isValidCSS('column-gap', withUnit(resolveDevice(grid, device, 'columnGap', '15px'), '15px')),
			isValidCSS('row-gap', withUnit(resolveDevice(grid, device, 'rowGap', '15px'), '15px'))
		);

		const itemCSS = (device) => `
			${rule(itemSl,
			isValidCSS('border-radius', getBoxCSS(item?.[device]?.radius))
		)}

		${rule(figureSl,
		isValidCSS('aspect-ratio', resolveDevice(grid, device, 'ratio', '1/1'))
		)}

		${rule(typeSl,
		isValidCSS('font-size', withUnit(resolveDevice(item, device, 'iconSize', 'desktop' === device ? (item.iconSize || '22px') : ''), ''))
		)}`;

		const profileCSS = (device) => `
			${rule(headSl,
			isValidCSS('gap', withUnit(resolveDevice(profile, device, 'gap', 'desktop' === device ? (profile.gap || '12px') : ''), ''))
		)}

		${rule(`${photoSl}, ${photoSl} img`,
			isValidCSS('width', withUnit(resolveDevice(profile, device, 'photoSize', 'desktop' === device ? (profile.photoSize || '55px') : ''), '')),
			isValidCSS('height', withUnit(resolveDevice(profile, device, 'photoSize', 'desktop' === device ? (profile.photoSize || '55px') : ''), ''))
		)}`;

		const captionCSS = (device) => rule(capSl,
			isValidCSS('padding', getBoxCSS(resolveBox(caption.padding, device)))
		);

	const css = useMemo(() => `
		${getTypoCSS('', caption.typo)?.googleFontLink}
		${getTypoCSS('', profile.usernameTypo)?.googleFontLink}
		${getTypoCSS('', profile.metaTypo)?.googleFontLink}
		${getTypoCSS('', followBtn.typo)?.googleFontLink}
		${getTypoCSS('', loadMoreBtn.typo)?.googleFontLink}
		${getTypoCSS(capSl, caption.typo)?.styles}
		${getTypoCSS(userSl, profile.usernameTypo)?.styles}
		${getTypoCSS(nameSl, profile.metaTypo)?.styles}
		${getTypoCSS(followSl, followBtn.typo)?.styles}
		${getTypoCSS(moreSl, loadMoreBtn.typo)?.styles}

		${rule(itemSl,
		borderCSS(item.border),
		isValidCSS('box-shadow', getMultiShadowCSS(Array.isArray(item.shadow) ? item.shadow : item.shadow?.normal))
	)}
		${item.shadow?.hover ? rule(`${itemSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(item.shadow.hover))) : ''}

		${rule(overlaySl, isValidCSS('background', item.overlayColor))}
		${rule(typeSl,
		isValidCSS('color', item.iconColor)
	)}

		${rule(capSl,
		isValidCSS('color', caption.color),
		isValidCSS('text-align', caption.align),
		isValidCSS('padding', getBoxCSS(resolveBox(caption.padding, 'desktop'))),
		getBackgroundCSS(caption.background)
	)}
		${rule(`${capSl} a`, isValidCSS('color', caption.linkColor))}

		${rule(userSl, isValidCSS('color', profile.usernameColor))}
		${rule(`${blockSl} .${prefix}-name`, isValidCSS('color', profile.nameColor))}
		${rule(`${blockSl} .${prefix}-bio`, isValidCSS('color', profile.bioColor))}

		${buttonCSS(followSl, followBtn)}
		${buttonCSS(moreSl, loadMoreBtn)}

		${rule(lightSl, isValidCSS('background', lightbox.backdrop))}
		${rule(`${lightSl} .${prefix}-close`,
			isValidCSS('color', lightbox.closeColor),
			isValidCSS('background', lightbox.closeBg)
		)}
		${rule(`${lightSl} .${prefix}-close svg`,
			isValidCSS('fill', lightbox.closeColor)
		)}
		${rule(`${lightSl} .${prefix}-close:hover`,
			isValidCSS('color', lightbox.closeHoverColor),
			isValidCSS('background', lightbox.closeHoverBg)
		)}
		${rule(`${lightSl} .${prefix}-close:hover svg`,
			isValidCSS('fill', lightbox.closeHoverColor)
		)}
		${rule(`${lightSl} .${prefix}-nav`,
			isValidCSS('color', lightbox.navColor),
			isValidCSS('background', lightbox.navBg)
		)}
		${rule(`${lightSl} .${prefix}-nav svg`,
			isValidCSS('fill', lightbox.navColor)
		)}
		${rule(`${lightSl} .${prefix}-nav:hover`,
			isValidCSS('color', lightbox.navHoverColor),
			isValidCSS('background', lightbox.navHoverBg)
		)}
		${rule(`${lightSl} .${prefix}-nav:hover svg`,
			isValidCSS('fill', lightbox.navHoverColor)
		)}

		${gridCSS('desktop')}
		${itemCSS('desktop')}
		${profileCSS('desktop')}

		${tabBreakpoint}{
			${gridCSS('tablet')}
			${itemCSS('tablet')}
			${profileCSS('tablet')}
			${captionCSS('tablet')}
			${buttonDeviceCSS(followSl, followBtn, 'tablet')}
			${buttonDeviceCSS(moreSl, loadMoreBtn, 'tablet')}
		}

		${mobileBreakpoint}{
			${gridCSS('mobile')}
			${itemCSS('mobile')}
			${profileCSS('mobile')}
			${captionCSS('mobile')}
			${buttonDeviceCSS(followSl, followBtn, 'mobile')}
			${buttonDeviceCSS(moreSl, loadMoreBtn, 'mobile')}
		}

		${generateCSS(id, advanced, isBackend, false)}
		`, [attributes, id, isBackend]);

	return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export default Style;