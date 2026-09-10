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

const deepSafe = (value) => {
	if (Array.isArray(value)) return value.map(deepSafe);

	if (value && 'object' === typeof value) return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepSafe(val)]));

	return cssSafe(value);
};

/** Every rule is scoped to the wrapper id, so instances never leak into each other. */
const Style = ({ attributes, id, isBackend = false }) => {
	// Advanced stays as authored: its Custom CSS field is meant to carry braces.
	const { advanced = {} } = attributes;
	const { grid = {}, box = {}, item = {}, caption = {}, profile = {}, followBtn = {}, loadMoreBtn = {}, lightbox = {} } = deepSafe(attributes);

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

	// Both buttons share a shape, so they share the rule builder too.
	const buttonCSS = (selector, config = {}) => `
		${rule(selector,
		isValidCSS('color', config.normal?.color),
		getBackgroundCSS(config.normal?.background),
		borderCSS(config.normal?.border),
		isValidCSS('padding', getBoxCSS(config.padding)),
		isValidCSS('border-radius', getBoxCSS(config.radius))
	)}
		${rule(`${selector}:hover, ${selector}:focus-visible`,
		isValidCSS('color', config.hover?.color),
		getBackgroundCSS(config.hover?.background),
		borderCSS(config.hover?.border)
	)}`;

	// Columns and gaps are the one place a narrower breakpoint must always state
	// its own value: an empty column count would otherwise inherit the desktop
	// grid rather than fall back to the block's own default.
	const gridCSS = (device) => rule(gridSl,
		isValidCSS('grid-template-columns', `repeat(${parseInt(resolveDevice(grid, device, 'columns', 4), 10) || 1}, minmax(0, 1fr))`),
		isValidCSS('column-gap', withUnit(resolveDevice(grid, device, 'columnGap', '15px'), '15px')),
		isValidCSS('row-gap', withUnit(resolveDevice(grid, device, 'rowGap', '15px'), '15px'))
	);

	const boxCSS = (device) => `
		${rule(blockSl,
		isValidCSS('padding', getBoxCSS(box?.[device]?.padding)),
		isValidCSS('border-radius', getBoxCSS(box?.[device]?.radius))
	)}
		${rule(figureSl,
		isValidCSS('border-radius', getBoxCSS(item?.[device]?.radius)),
		isValidCSS('aspect-ratio', resolveDevice(grid, device, 'ratio', '1/1'))
	)}`;

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

		${rule(blockSl,
		getBackgroundCSS(box.background),
		borderCSS(box.border),
		isValidCSS('box-shadow', getMultiShadowCSS(box.shadow?.normal))
	)}
		${rule(`${blockSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(box.shadow?.hover)))}

		${rule(itemSl,
		borderCSS(item.border),
		isValidCSS('box-shadow', getMultiShadowCSS(item.shadow?.normal))
	)}
		${rule(`${itemSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(item.shadow?.hover)))}

		${rule(overlaySl, isValidCSS('background', item.overlayColor))}
		${rule(typeSl,
		isValidCSS('color', item.iconColor),
		isValidCSS('font-size', withUnit(item.iconSize, ''))
	)}

		${rule(capSl,
		isValidCSS('color', caption.color),
		isValidCSS('text-align', caption.align),
		isValidCSS('padding', getBoxCSS(caption.padding)),
		getBackgroundCSS(caption.background)
	)}
		${rule(`${capSl} a`, isValidCSS('color', caption.linkColor))}

		${rule(headSl, isValidCSS('gap', withUnit(profile.gap, '')))}
		${rule(`${photoSl}, ${photoSl} img`,
		isValidCSS('width', withUnit(profile.photoSize, '')),
		isValidCSS('height', withUnit(profile.photoSize, ''))
	)}
		${rule(userSl, isValidCSS('color', profile.usernameColor))}
		${rule(`${blockSl} .${prefix}-name`, isValidCSS('color', profile.nameColor))}
		${rule(`${blockSl} .${prefix}-bio`, isValidCSS('color', profile.bioColor))}

		${buttonCSS(followSl, followBtn)}
		${buttonCSS(moreSl, loadMoreBtn)}

		${rule(lightSl, isValidCSS('background', lightbox.backdrop))}

		${gridCSS('desktop')}
		${boxCSS('desktop')}

		${tabBreakpoint}{
			${gridCSS('tablet')}
			${boxCSS('tablet')}
		}

		${mobileBreakpoint}{
			${gridCSS('mobile')}
			${boxCSS('mobile')}
		}

		${generateCSS(id, advanced, isBackend, false)}
		`, [attributes, id, isBackend]);

	return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export default Style;
