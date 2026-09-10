import { useMemo } from 'react';

import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { ENTRANCE_KEYFRAMES, RING_DEFAULTS, easingCSS, getActiveAnimation, getSegmentWedges, maxSegmentSize, resolveDevice, segmentRadius, toMs, transitionCSS, wedgeClipPath, withUnit } from '../../utils/options';

/**
 * A value goes into the sheet as written, so a stray brace in a saved attribute
 * would close its rule and let whatever follows style the whole page. Semicolons,
 * comment markers and newlines end a declaration the same way.
 */
const cssSafe = (value) => {
	if ('string' !== typeof value) return value;

	const stripped = value.replace(/\/\*|\*\//g, '').replace(/[{};<>\\]/g, '').replace(/[\r\n\t]+/g, ' ');
	const odd = (mark) => (stripped.split(mark).length - 1) % 2;

	// An unclosed quote swallows everything after it, so drop them together.
	return odd('"') || odd("'") ? stripped.replace(/["']/g, '') : stripped;
};

const deepSafe = (value) => {
	if (Array.isArray(value)) return value.map(deepSafe);

	if (value && 'object' === typeof value) return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepSafe(val)]));

	return cssSafe(value);
};

/** Every rule is scoped to the wrapper id, so instances never leak into each other. */
const Style = ({ attributes, id, isBackend = false }) => {
	// Advanced is the one group left as authored: its Custom CSS field is meant
	// to carry braces of its own.
	const { advanced = {} } = attributes;
	const safe = useMemo(() => deepSafe({ ...attributes, advanced: undefined }), [attributes]);

	const { general = {}, wheel = {}, animation = {}, icon = {}, segment = {}, outerDisc = {}, innerDisc = {}, content = {} } = safe;
	const items = Array.isArray(safe?.items) ? safe.items : [];

	const { normal: segmentNormal = {}, hover: segmentHover = {}, active: segmentActive = {} } = segment;
	const { title = {}, text = {}, divider = {}, image = {} } = content;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .${prefix}`;
	const circleSl = `${blockSl} .b-blocks-infographic-circle`;
	const segmentSl = `${circleSl} .b-blocks-infographic-segment`;
	const centerSl = `${circleSl} .b-blocks-infographic-center-disc`;
	const titleSl = `${centerSl} .b-blocks-infographic-center-title`;
	const textSl = `${centerSl} .b-blocks-infographic-center-text`;
	const dividerSl = `${centerSl} .b-blocks-infographic-center-divider`;
	const labelSl = `${segmentSl} .b-blocks-infographic-segment-label`;
	const innerSl = `${segmentSl} .b-blocks-infographic-segment-inner`;
	const iconSl = `${segmentSl} .b-blocks-infographic-segment-icon`;
	const imageSl = `${centerSl} .b-blocks-infographic-center-image img`;
	// The two modes differ only in geometry, so the rest shares one selector.
	const dotSl = `${blockSl}:not(.b-blocks-infographic-has-segments) .b-blocks-infographic-circle .b-blocks-infographic-segment`;
	const wedgeSl = `${blockSl}.b-blocks-infographic-has-segments .b-blocks-infographic-circle .b-blocks-infographic-segment`;

	// A saved object replaces the block.json default outright rather than merging,
	// so an older disc arrives without newer keys. Falling back to 0 would erase
	// the border, hence the declared defaults.
	// Emitted as authored, so em and rem survive rather than being read as px.
	const borderWidth = (disc, fallback) => withUnit(disc.borderWidth ?? fallback);

	const innerWidth = borderWidth(innerDisc, RING_DEFAULTS.innerWidth);
	// The outer border is the ring the segments ride, so it also feeds the radius.
	const outerWidth = borderWidth(outerDisc, RING_DEFAULTS.outerWidth);

	// getBorderBoxCSS returns `0px solid #000000` for an empty object, which would
	// override the theme. Nothing set, nothing emitted.
	const borderCSS = (value) => Object.keys(value || {}).length ? getBorderBoxCSS(value) : '';

	// Untouched attributes resolve to '', so a rule with no body is not written.
	const rule = (selector, ...declarations) => {
		const body = declarations.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

		return body ? `${selector}{ ${body} }` : '';
	};

	const innerColor = innerDisc.borderColor || RING_DEFAULTS.innerColor;
	const outerColor = outerDisc.borderColor || RING_DEFAULTS.outerColor;

	// Every diameter is set directly per breakpoint, so resizing one moves
	// nothing else.
	const metrics = (device) => {
		const circle = parseFloat(resolveDevice(outerDisc, device, 'size', 560)) || 560;
		const iconSize = withUnit(resolveDevice(icon, device, 'size', '20px'), '20px');
		// The inner ring is the disc's border, so one value sizes both.
		const discSize = parseFloat(resolveDevice(innerDisc, device, 'size', 276)) || 276;
		// The gap is the disc's padding. Padding grows a content-box outward, so
		// it carries the border — the ring — out with it, and the ring diameter
		// is the padding box rather than the declared size.
		const outerGap = parseFloat(outerDisc?.[device]?.ringGap) || 0;
		// The gap is padding on a content-box, so the border — the ring the
		// segments ride — is carried this far out from the declared size.
		const ringOuter = circle + 2 * outerGap;

		const segmentSize = Math.min(parseFloat(resolveDevice(segment, device, 'size', 118)) || 118, maxSegmentSize(circle));

		return {
			circle,
			outerGap,
			segmentSize,
			iconSize,
			// Segments ride the ring's stroke centre line at any width or gap —
			// the gap moves the ring and they follow. Wheel > Radius Offset
			// deliberately sits them off it. calc, so the border and the offset
			// both keep whatever unit they carry.
			radius: `calc(${segmentRadius(ringOuter, outerWidth)} + ${withUnit(wheel.radiusOffset, '0px')})`,
			disc: discSize
		};
	};

	// The static sheet is mirrored for RTL — left: 50% becomes right: 50% — but
	// this sheet is built at runtime and never is, so its translate(-50%) would
	// pull a right-anchored segment the wrong way, by its own width. Pinning the
	// anchor keeps the ring geometric and identical in both directions; Wheel >
	// Direction is the control for reversing it on purpose.
	const anchor = 'left: 50%; right: auto;';

	const geometryCSS = (device) => {
		const { circle, outerGap, segmentSize, iconSize, radius, disc } = metrics(device);
		// Fix B: a breakpoint only restates the alignment when it actually
		// differs from the one it inherits, so a media query never re-asserts a
		// value a theme might want to override.
		const parent = { tablet: 'desktop', mobile: 'tablet' }[device];
		const align = resolveDevice(general, device, 'alignment', 'center');

		return `${rule(blockSl, !parent || align !== resolveDevice(general, parent, 'alignment', 'center') ? `text-align: ${align};` : '')}
		${rule(circleSl,
			`width: ${circle}px;`,
			`height: ${circle}px;`,
			// Stated at every breakpoint, not only where there is a gap. A gap of
			// zero that emits nothing lets a wider breakpoint's padding stand,
			// while the radius is recomputed without it — and the segments then
			// sit inside the ring by exactly the leaked gap.
			`padding: ${outerGap ? withUnit(outerDisc[device].ringGap, '0px') : '0px'};`,
			`background-clip: ${outerGap ? 'content-box' : 'border-box'};`
		)}
		${rule(segmentSl, isValidCSS('padding', getBoxCSS(segment?.[device]?.padding)))}
		${wheel.enableSegmentsType ? `${wedgeSl}{
			width: ${circle}px;
			height: ${circle}px;
			${anchor}
			transform: translate(-50%, -50%);
			--bbInfographicContentRadius: ${(disc / 2 + circle / 2) / 2}px;
		}` : `${dotSl}{
			width: ${segmentSize}px;
			height: ${segmentSize}px;
			${anchor}
			--bbInfographicRadius: ${radius};
			transform: translate(-50%, -50%) rotate(var(--bbInfographicAngle, 0deg)) translateY(calc(var(--bbInfographicRadius, 0px) * -1)) rotate(var(--bbInfographicCounter, 0deg));
		}`}
		${segmentSl} .b-blocks-infographic-segment-icon>svg,
		${segmentSl} .b-blocks-infographic-segment-icon>img{
			width: ${iconSize};
			height: ${iconSize};
		}
		${rule(iconSl,
			isValidCSS('padding', getBoxCSS(icon?.[device]?.padding)),
			isValidCSS('border-radius', getBoxCSS(icon?.[device]?.radius))
		)}
		${rule(imageSl,
			isValidCSS('border-radius', getBoxCSS(image?.[device]?.radius)),
			isValidCSS('width', withUnit(image?.[device]?.width, '')),
			isValidCSS('height', withUnit(image?.[device]?.height, ''))
		)}
		${rule(centerSl,
			`width: ${disc}px;`,
			`height: ${disc}px;`,
			isValidCSS('padding', getBoxCSS(innerDisc?.[device]?.padding))
		)}`;
	};

	// Normal, then active, then hover. Those tie on specificity, so order decides
	// and an already-active segment still answers the pointer.
	const segmentStateCSS = (sl, state) => {
		const background = getBackgroundCSS(state?.background);
		const border = borderCSS(state?.border);
		const shadow = isValidCSS('box-shadow', getMultiShadowCSS(state?.shadow));
		const color = state?.color;

		return [
			rule(sl, background, isValidCSS('color', color), border, shadow),
			color ? `${sl} .b-blocks-infographic-segment-icon>svg{ ${isValidCSS('fill', color)} }` : ''
		].filter(Boolean).join('\n');
	};

	// After the global rules, so a per-item colour wins the tie.
	const itemStateCSS = (sl, state) => {
		const { label, icon: iconColor } = state?.color || {};
		const background = getBackgroundCSS(state?.background);
		const border = borderCSS(state?.border);

		return [
			background || border ? `${sl}{ ${background} ${border} }` : '',
			label ? `${sl} .b-blocks-infographic-segment-label{ color: ${label}; }` : '',
			iconColor ? `${sl} .b-blocks-infographic-segment-icon{ color: ${iconColor}; } ${sl} .b-blocks-infographic-segment-icon>svg{ fill: ${iconColor}; }` : ''
		].filter(Boolean).join('\n');
	};

	// The disc renders whichever item is showing, so its colours key off the
	// index stamped on it rather than the segment's selector.
	const itemCenterCSS = (sl, state) => {
		const { title: titleColor, divider: dividerColor, desc: descColor } = state?.color || {};

		return [
			rule(`${sl} .b-blocks-infographic-center-title`, isValidCSS('color', titleColor)),
			rule(`${sl} .b-blocks-infographic-center-divider`, isValidCSS('border-top-color', dividerColor)),
			rule(`${sl} .b-blocks-infographic-center-text`, isValidCSS('color', descColor))
		].filter(Boolean).join('\n');
	};

	const itemStylesCSS = () => items.map((item, index) => {
		const { normal, hover, active } = item?.styles || {};
		const sl = `${segmentSl}[data-index='${index}']`;
		// Hover and press land on the disc, which only ever holds the active item.
		const discSl = `${centerSl}[data-item-index='${index}']`;

		return [
			itemStateCSS(sl, normal),
			itemStateCSS(`${sl}.active`, active),
			itemStateCSS(`${sl}:hover`, hover),
			itemStateCSS(`${sl}:focus-visible`, hover),
			itemCenterCSS(discSl, normal),
			itemCenterCSS(`${discSl}:hover`, hover),
			// Pressing implies hovering and both tie, so active goes last.
			itemCenterCSS(`${discSl}:active`, active)
		].filter(Boolean).join('\n');
	}).filter(Boolean).join('\n');

	// Percentages, so one clip-path per wedge holds at every breakpoint. Skipped
	// outside segments mode, where the selector cannot match.
	const wedgeClipCSS = () => wheel.enableSegmentsType
		? getSegmentWedges(items, wheel).map((wedge) => `${wedgeSl}[data-index='${wedge.index}']{ clip-path: ${wedgeClipPath(wedge)}; }`).join('\n')
		: '';

	// Every knob lands here as a custom property, so the keyframes stay static.
	const animationVars = () => {
		const type = getActiveAnimation(animation, wheel);

		return [
			`--bbInfographicSpeed: ${toMs(animation.speed)}ms;`,
			`--bbInfographicEasing: ${easingCSS(animation.easing)};`,
			isValidCSS('--bbInfographicContentSpeed', withUnit(animation.contentSpeed, '')),
			// Rotation layers behind the entrance, so it needs that keyframe by name.
			animation.rotate ? `--bbInfographicEntranceName: ${ENTRANCE_KEYFRAMES[type] || 'none'};` : '',
			animation.rotate ? `--bbInfographicRotateSpeed: ${withUnit(animation.rotateSpeed, '')};` : ''
		];
	};

	// The sheet derives from these three alone, so it is not rebuilt on every
	// keystroke.
	const css = useMemo(() => `
		${getTypoCSS('', title.typo)?.googleFontLink}
		${getTypoCSS('', text.typo)?.googleFontLink}
		${getTypoCSS('', segment.labelTypo)?.googleFontLink}
		${getTypoCSS(titleSl, title.typo)?.styles}
		${getTypoCSS(textSl, text.typo)?.styles}
		${getTypoCSS(labelSl, segment.labelTypo)?.styles}

		${rule(blockSl, ...animationVars())}
		${rule(segmentSl,
		transitionCSS(segment.transition, ['background', 'color', 'border-color', 'box-shadow']),
		isValidCSS('border-radius', getBoxCSS(segment.radius))
	)}
		${segmentStateCSS(segmentSl, segmentNormal)}
		${segmentStateCSS(`${segmentSl}.active`, segmentActive)}
		${segmentStateCSS(`${segmentSl}:hover`, segmentHover)}
		${segmentStateCSS(`${segmentSl}:focus-visible`, segmentHover)}
		${itemStylesCSS()}
		${rule(centerSl,
		transitionCSS(innerDisc.transition, ['background', 'box-shadow']),
		getBackgroundCSS(innerDisc.background),
		`border: ${innerWidth} ${innerDisc.borderStyle || 'solid'} ${innerColor};`,
		isValidCSS('box-shadow', getMultiShadowCSS(innerDisc.shadow?.normal))
	)}
		${rule(`${centerSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(innerDisc.shadow?.hover)))}
		${rule(`${centerSl} .b-blocks-infographic-center-content`,
		isValidCSS('width', withUnit(innerDisc.contentWidth, '')),
		isValidCSS('gap', withUnit(innerDisc.contentGap, '')),
		isValidCSS('text-align', innerDisc.contentAlign),
		isValidCSS('align-items', 'left' === innerDisc.contentAlign ? 'flex-start' : 'right' === innerDisc.contentAlign ? 'flex-end' : 'center')
	)}
		${rule(circleSl,
		transitionCSS(outerDisc.transition, ['background', 'border-color', 'box-shadow']),
		getBackgroundCSS(outerDisc.background),
		`border: ${outerWidth} ${outerDisc.borderStyle || 'solid'} ${outerColor};`,
		isValidCSS('box-shadow', getMultiShadowCSS(outerDisc.shadow?.normal))
	)}
		${rule(`${circleSl}:hover`, isValidCSS('box-shadow', getMultiShadowCSS(outerDisc.shadow?.hover)))}
		${rule(titleSl, isValidCSS('color', title.color))}
		${rule(textSl, isValidCSS('color', text.color))}
		${rule(dividerSl,
		`width: ${withUnit(divider.width)};`,
		'height: 0;',
		'background: none;',
		`border-top: ${withUnit(divider.height)} ${divider.style || 'solid'} ${divider.color || 'currentColor'};`
	)}
		${rule(innerSl,
		isValidCSS('gap', withUnit(segment.spacing, '')),
		isValidCSS('margin', getBoxCSS(segment.margin))
	)}
		${rule(blockSl, isValidCSS('--bbInfographicIconPlate', icon.plateColor))}
		${rule(iconSl,
		transitionCSS(icon.transition, ['background', 'color', 'border-color']),
		isValidCSS('color', icon.color),
		getBackgroundCSS(icon.background),
		borderCSS(icon.border?.normal)
	)}
		${rule(`${segmentSl}:hover .b-blocks-infographic-segment-icon`, borderCSS(icon.border?.hover))}
		${rule(`${iconSl}>svg`, isValidCSS('fill', icon.color))}
		${rule(imageSl, isValidCSS('object-fit', image.fit))}

		${wedgeClipCSS()}

		${geometryCSS('desktop')}

		${tabBreakpoint}{
			${geometryCSS('tablet')}
		}

		${mobileBreakpoint}{
			${geometryCSS('mobile')}
		}

		${generateCSS(id, advanced, isBackend, false)}
		`, [attributes, id, isBackend]);

	return <style dangerouslySetInnerHTML={{ __html: css }} />;
};
export default Style;
