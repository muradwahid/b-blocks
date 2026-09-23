import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { bubbleIconPlacement, hasBorder, hasPanel, hasRing, hidesIcon, itemState, numberState, paintsLink, placementOf, resolveDevice, showsIcon, showsNumber, showsPadding, toBackground, usesTooltip } from '../../utils/options';

const scale = (value, factor) => (value ? `calc(${value} * ${factor})` : '');

const Style = ({ attributes, id, isBackend = false }) => {
	const { advanced = {}, layout = {}, marker = {}, item = {}, media = {}, label = {}, line = {}, bubble = {}, number = {}, animation = {} } = attributes;

	const preset = layout.preset || 'glassBullseye';

	const mainSl = `#${id}`;
	const navSl = `${mainSl} .${prefix}`;
	const listSl = `${navSl} .${prefix}-list`;
	const linkSl = `${navSl} .${prefix}-link`;
	const activeLinkSl = `${navSl} .is-active .${prefix}-link`;
	const markerSl = `${navSl} .${prefix}-marker`;
	const activeMarkerSl = `${navSl} .is-active .${prefix}-marker`;
	const hoverMarkerSl = `${linkSl}:hover .${prefix}-marker`;
	const labelSl = `${navSl} .${prefix}-label`;
	const tooltipSl = `${navSl} .${prefix}-tooltip`;
	const numberSl = `${navSl} .${prefix}-number`;
	const iconSl = `${navSl} .${prefix}-icon`;
	const rail = hidesIcon(preset) && media.showIcon ? '::before' : '';
	const drawnSl = `${iconSl}.is-icon, ${iconSl}.is-svg`;
	const imageSl = `${iconSl}.is-image`;
	const bubbleSl = `${navSl} .${prefix}-bubble`;
	const ringSl = `${navSl} .${prefix}-ring circle`;
	const ringTrackSl = `${navSl} .${prefix}-ring-track`;

	const rule = (selector, body) => body.replace(/\s+/g, ' ').trim() ? `${selector}{ ${body} }` : '';

	const onLink = paintsLink(preset);
	const boxSl = onLink ? linkSl : markerSl;
	const hoverBoxSl = onLink ? `${linkSl}:hover` : hoverMarkerSl;

	const activeBoxSl = onLink ? activeLinkSl : `${activeMarkerSl}${'magneticBubble' === preset ? '::before' : ''}`;
	const groups = { item, line, layout };

	const state = {
		normal: itemState(groups, 'normal'),
		hover: itemState(groups, 'hover'),
		active: itemState(groups, 'active')
	};

	const drawn = (value) => !!(value?.width || value?.top || value?.right || value?.bottom || value?.left);

	const borderCSS = (value) => (hasBorder(preset) && drawn(value) ? getBorderBoxCSS(value) : '');

	const tooltipBorderCSS = (value) => (usesTooltip(preset) && drawn(value) ? getBorderBoxCSS(value) : '');

	const shadowCSS = (list) => (Array.isArray(list) && list.length ? list.map((shadow) => getShadowCSS(shadow)).join(', ') : '');

	const solid = (value) => value?.color || ('string' === typeof value ? value : '');

	const background = (value) => getBackgroundCSS(toBackground(value)).trim();

	const colorCSS = {
		glassBullseye: `
			${rule(`${navSl} .${prefix}-ring-bar`, isValidCSS('stroke', line.progressColor))}
			${rule(`${navSl} .is-passed .${prefix}-link`, isValidCSS('color', state.active.color))}
		`,

		magneticBubble: `
			${rule(`${listSl}::before`, isValidCSS('background', line.color))}
			${rule(markerSl, isValidCSS('border-color', line.color))}
			${rule(activeMarkerSl, 'background: none; border-color: transparent;')}
			${rule(bubbleSl, isValidCSS('background', solid(state.active.background)))}
		`,

		numberedSteps: `
			${rule(`${listSl}::before`, isValidCSS('background', line.color))}
			${rule(markerSl, isValidCSS('border-color', line.color))}
			${rule(hoverMarkerSl, isValidCSS('border-color', state.hover.color))}
			${rule(activeMarkerSl, isValidCSS('border-color', solid(state.active.background)))}
		`,
		expandablePills: '',

		stackedCards: `
			${rule(linkSl, isValidCSS('border-color', line.color))}
			${rule(activeLinkSl, isValidCSS('border-color', solid(state.active.background)))}
		`,
		sideRail: `
			${rule(`${listSl}::before`, isValidCSS('background', line.color))}
		`
	};

	const tick = onLink ? '' : rail;

	const itemCSS = `
		${rule(linkSl, isValidCSS('color', state.normal.color))}
		${rule(`${boxSl}${tick}`, background(state.normal.background))}
		${rule(markerSl, isValidCSS('color', state.normal.markerColor))}

		${rule(`${linkSl}:hover`, isValidCSS('color', state.hover.color))}
		${rule(`${hoverBoxSl}${tick}`, background(state.hover.background))}
		${rule(hoverMarkerSl, isValidCSS('color', state.hover.markerColor))}

		${rule(activeLinkSl, isValidCSS('color', state.active.color))}
		${rule(`${activeBoxSl}${tick}`, background(state.active.background))}
		${rule(activeMarkerSl, isValidCSS('color', state.active.markerColor))}
		${rule(`${navSl} .is-active .${prefix}-number, ${navSl} .is-active .${prefix}-icon`, isValidCSS('color', state.active.markerColor))}

		${hasRing(preset) ? `
			${rule(ringTrackSl, isValidCSS('stroke', item?.normal?.ringColor))}
			${rule(`${linkSl}:hover .${prefix}-ring-track`, isValidCSS('stroke', item?.hover?.ringColor))}
			${rule(`${navSl} .is-active .${prefix}-ring-track`, isValidCSS('stroke', item?.active?.ringColor))}
		` : ''}

		${rule(`${boxSl}${tick}`, isValidCSS('box-shadow', shadowCSS(item?.normal?.shadow)))}
		${rule(`${hoverBoxSl}${tick}`, isValidCSS('box-shadow', shadowCSS(item?.hover?.shadow)))}
		${rule(`${activeBoxSl}${tick}`, isValidCSS('box-shadow', shadowCSS(item?.active?.shadow)))}
	`;

	const numberCSS = () => `
		${rule(numberSl, isValidCSS('color', numberState(number, 'normal')))}
		${rule(`${linkSl}:hover .${prefix}-number`, isValidCSS('color', numberState(number, 'hover')))}
		${rule(`${navSl} .is-active .${prefix}-number`, isValidCSS('color', numberState(number, 'active')))}
	`;

	const pulseColor = solid(state.active.background) || state.active.color;

	const pulseCSS = {
		pulseRing: rule(`${activeMarkerSl}::after`, isValidCSS('border-color', pulseColor)),
		radar: rule(`${activeMarkerSl}::after`, isValidCSS('background', pulseColor)),
		breathingGlow: rule(`${activeMarkerSl}::after`, isValidCSS('color', pulseColor)),
		heartbeat: ''
	};

	const placeCSS = (device) => {
		const gutter = 'mobile' === device ? '12px' : '24px';
		const across = resolveDevice(layout, device, 'offsetX', '') || gutter;
		const down = resolveDevice(layout, device, 'offsetY', '') || gutter;
		const position = placementOf(layout, device, 'position', 'right');
		const align = placementOf(layout, device, 'verticalAlign', 'center');

		const horizontal = 'left' === position
			? `left: ${across}; right: auto;`
			: `right: ${across}; left: auto;`;

		const vertical = 'top' === align ? `top: ${down}; bottom: auto; transform: none;`
			: 'bottom' === align ? `bottom: ${down}; top: auto; transform: none;`
				: 'top: 50%; bottom: auto; transform: translateY(-50%);';

		const tooltip = 'left' === position
			? 'left: calc(100% + 12px); right: auto;'
			: 'right: calc(100% + 12px); left: auto;';

		return `
			${rule(mainSl, `${horizontal} ${vertical}`)}
			${rule(tooltipSl, tooltip)}
		`;
	};

	const sizeCSS = (device) => {
		const size = marker?.[device]?.size;
		const thickness = line?.[device]?.thickness;
		const spacing = item?.[device]?.spacing;
		// The track runs down the middle of the markers, so it follows however
		// wide they actually are: the width the Item panel gives them, or the
		// size the Marker panel does, or the one style.scss draws.
		const across = item?.[device]?.width || size;

		const bubbleCSS = () => {
			const own = bubble?.[device] || {};

			if ('desktop' !== device && !own.iconPosition && !own.x && !own.y) return '';

			const placement = bubbleIconPlacement(attributes, device);
			const x = resolveDevice(bubble, device, 'x', '0px');
			const y = resolveDevice(bubble, device, 'y', '0px');
			const along = 'left' === placement ? `calc(${x} * -1)` : x;
			const nudge = 'center' === placement
				? 'transform: none;'
				: `transform: translate(${along}, ${y});`;

			return `
				${rule(`${navSl} .${prefix}-icon`, nudge)}
				${rule(`${navSl} .is-active .${prefix}-icon`, isValidCSS('color', 'center' === placement ? state.active.markerColor : state.active.color))}
			`;
		};

		const perPreset = {
			glassBullseye: `
				${rule(markerSl, `
					${isValidCSS('width', size)}
					${isValidCSS('height', size)}
				`)}
			`,
			magneticBubble: `
				${rule(`${listSl}::before`, `
					${isValidCSS('left', scale(across, 0.5))}
					${isValidCSS('width', thickness)}
				`)}
				${rule(markerSl, `
					${isValidCSS('width', size)}
					${isValidCSS('height', size)}
					${isValidCSS('border-width', thickness)}
				`)}
				${rule(`${activeMarkerSl}::before`, isValidCSS('inset', scale(size, -0.285)))}
				${rule(bubbleSl, `
					${isValidCSS('left', scale(across, 0.5))}
					${isValidCSS('width', scale(size, 2))}
					${isValidCSS('height', scale(size, 2))}
					${size ? `margin: ${scale(size, -1)} 0 0 ${scale(size, -1)};` : ''}
				`)}
				${bubbleCSS()}
			`,

			numberedSteps: `
				${rule(`${listSl}::before`, `
					${isValidCSS('left', scale(across, 0.5))}
					${isValidCSS('width', thickness)}
				`)}
				${rule(markerSl, `
					${isValidCSS('width', size)}
					${isValidCSS('border-width', thickness)}
				`)}
			`,
			expandablePills: rule(markerSl, `
				${isValidCSS('width', size)}
				${isValidCSS('height', size)}
			`),
			stackedCards: `
				${rule(markerSl, `
					${isValidCSS('width', size)}
					${isValidCSS('height', size)}
				`)}
				${rule(linkSl, isValidCSS('border-width', thickness))}
			`,

			sideRail: `
				${rule(`${listSl}::before`, isValidCSS('width', thickness))}
				${rule(`${markerSl}${rail}`, `
					${isValidCSS('width', size)}
					${isValidCSS('height', thickness)}
				`)}
				${rule(`${hoverMarkerSl}${rail}`, isValidCSS('width', scale(size, 1.25)))}
				${rule(`${activeMarkerSl}${rail}`, isValidCSS('width', scale(size, 1.5)))}
			`
		};

		return `
			${rule(listSl, isValidCSS('gap', spacing))}
			${rule(linkSl, usesTooltip(preset) ? '' : isValidCSS('gap', label?.[device]?.gap))}
			${rule(tooltipSl, usesTooltip(preset) ? isValidCSS('border-radius', getBoxCSS(label?.[device]?.radius)) : '')}
			${rule(labelSl, isValidCSS('padding', getBoxCSS(label?.[device]?.padding)))}
			${perPreset[preset] || ''}
		`;
	};

	const mediaCSS = `
		${rule(drawnSl, isValidCSS('color', media.color))}
		${rule(`${drawnSl} svg, ${drawnSl} svg path`, isValidCSS('fill', media.color))}
		${rule(`${linkSl}:hover .${prefix}-icon.is-icon, ${linkSl}:hover .${prefix}-icon.is-svg`, isValidCSS('color', media.hoverColor))}
		${rule(`${linkSl}:hover .${prefix}-icon.is-icon svg path, ${linkSl}:hover .${prefix}-icon.is-svg svg path`, isValidCSS('fill', media.hoverColor))}
		${rule(`${navSl} .is-active .${prefix}-icon.is-icon, ${navSl} .is-active .${prefix}-icon.is-svg`, isValidCSS('color', media.activeColor))}
		${rule(`${navSl} .is-active .${prefix}-icon.is-icon svg path, ${navSl} .is-active .${prefix}-icon.is-svg svg path`, isValidCSS('fill', media.activeColor))}
	`;

	const fitCSS = (fit) => {
		if ('contain' === fit) return 'width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain;';

		return fit ? `width: 100%; height: 100%; ${isValidCSS('object-fit', fit)}` : '';
	};

	const itemBoxCSS = (device) => {
		const own = item?.[device] || {};
		const width = own.width;

		return `
			${rule(boxSl, `
				${showsPadding(preset) ? isValidCSS('padding', getBoxCSS(own.padding)) : ''}
				${isValidCSS('border-radius', getBoxCSS(own.radius))}
				${isValidCSS('width', width)}
				${isValidCSS('min-width', width)}
				${isValidCSS('height', own.height)}
			`)}
			${hasRing(preset) ? rule(ringSl, isValidCSS('stroke-width', own.ringSize)) : ''}
		`;
	};

	const mediaSizeCSS = (device) => {
		const size = media?.[device]?.size;
		const width = media?.[device]?.width;
		const height = media?.[device]?.height;
		const radius = getBoxCSS(media?.[device]?.radius);
		const fit = media?.[device]?.objectFit || ('desktop' === device ? media.objectFit : '');

		return `
			${rule(drawnSl, `
				${isValidCSS('width', size)}
				${isValidCSS('height', size)}
			`)}
			${rule(imageSl, `
				${isValidCSS('width', width)}
				${isValidCSS('height', height)}
				${isValidCSS('border-radius', radius)}
			`)}
			${rule(`${imageSl} img`, fitCSS(fit))}
		`;
	};

	const pulses = animation.pulse && hasPanel(preset, 'animation');

	const pulseSpeed = pulses ? rule(`${activeMarkerSl}::after`, isValidCSS('animation-duration', animation.speed)) : '';

	const css = `
		${getTypoCSS('', label.typo)?.googleFontLink}
		${getTypoCSS('', number.typo)?.googleFontLink}
		${getTypoCSS(labelSl, label.typo)?.styles}
		${getTypoCSS(numberSl, number.typo)?.styles}

		${rule(tooltipSl, `
			${background(label.tooltipBackground)}
			${isValidCSS('color', label.tooltipText)}
			${tooltipBorderCSS(label.border)}
		`)}
		${colorCSS[preset] || ''}
		${itemCSS}
		${showsNumber(attributes) ? numberCSS() : ''}
		${showsIcon(attributes) ? mediaCSS : ''}
		${pulses ? (pulseCSS[animation.style] ?? pulseCSS.pulseRing) : ''}
		${pulseSpeed}

		${placeCSS('desktop')}
		${sizeCSS('desktop')}
		${itemBoxCSS('desktop')}
		${showsIcon(attributes) ? mediaSizeCSS('desktop') : ''}

		${tabBreakpoint}{
			${placeCSS('tablet')}
			${sizeCSS('tablet')}
			${itemBoxCSS('tablet')}
				${showsIcon(attributes) ? mediaSizeCSS('tablet') : ''}
		}

		${mobileBreakpoint}{
			${placeCSS('mobile')}
			${sizeCSS('mobile')}
			${itemBoxCSS('mobile')}
				${showsIcon(attributes) ? mediaSizeCSS('mobile') : ''}
		}

		${rule(boxSl, borderCSS(state.normal.border))}
		${rule(hoverBoxSl, borderCSS(state.hover.border))}
		${rule(activeBoxSl, borderCSS(state.active.border))}

		${generateCSS(id, advanced, isBackend, false)}

		`;

	const tidy = (sheet) => sheet.replace(/[^{}]+\{\s*\}/g, '').replace(/[^{}]+\{\s*\}/g, '');

	return <style dangerouslySetInnerHTML={{ __html: tidy(css) }} />;
};

export default Style;