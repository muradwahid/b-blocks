import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { at, atSimple, P } from '../../utils/data';

const marginForAlign = (align) => {
	if ('left' === align) return '0 auto 0 0';
	if ('right' === align) return '0 0 0 auto';
	return '0 auto';
};

/**
 * Every attribute-derived rule for the block, scoped to the block id, shared
 * by the editor (`block-${clientId}`) and the frontend (the wrapper's id).
 * style.scss only carries structural CSS that never varies per instance.
 */
const Style = ({ attributes, id, isBackend = false }) => {
	const { map = {}, marker = {}, infoWindow = {}, clustering = {}, categories = [], filterBar = {}, caption = {}, advanced } = attributes;

	const mainSl = `#${id}`;
	const figureSl = `${mainSl} .${P}-figure`;
	const wrapperSl = `${mainSl} .${P}-wrapper`;
	const canvasSl = `${mainSl} .${P}-canvas`;
	const iframeSl = `${mainSl} .${P}-iframe`;
	const captionSl = `${mainSl} .${P}-caption`;
	const pinSl = `${mainSl} .${P}-pin`;
	const clusterSl = `${mainSl} .${P}-cluster`;
	const chipSl = `${mainSl} .${P}-filter-chip`;
	const barSl = `${mainSl} .${P}-filter-bar`;
	const infoSl = `${mainSl} .gm-style-iw-c`;
	const infoBodySl = `${mainSl} .gm-style-iw-d`;
	// Max Width + alignment constrain the whole block, placeholder included.
	const boxSl = `${figureSl}, ${mainSl} .${P}-placeholder`;

	const box = (prop, obj, device) => isValidCSS(prop, getBoxCSS(obj?.[device]));

	// Each category tints its own chip: a dot when idle, the full background
	// when active. Ids are generated as `cat-N`, but they are stripped of
	// anything that could break out of the attribute selector regardless.
	const categoryCSS = (categories || [])
		.filter((category) => category?.id && category?.color)
		.map((category) => {
			const id = String(category.id).replace(/["'\\\]]/g, '');

			return `
				${chipSl}[data-category="${id}"] .${P}-filter-dot{ background: ${category.color}; }
				${chipSl}[data-category="${id}"].active{ background: ${category.color}; }
			`;
		})
		.join('');

	// Per-device: alignment, Max Width, corner radius, and either the fluid
	// aspect-ratio or a fixed height. `at()` reads both the current grouped
	// shape and the flat v2 shape, so shipped content keeps its sizing.
	const responsive = (device) => `
		${mainSl}{ ${isValidCSS('text-align', at(map, device, 'align'))} }

		${boxSl}{
			margin: ${marginForAlign(at(map, device, 'align'))};
			${isValidCSS('max-width', at(map, device, 'maxWidth'))}
		}

		${wrapperSl}{
			${box('border-radius', map.borderRadius, device)}
			${map.useAspectRatio
			? isValidCSS('aspect-ratio', atSimple(map.aspectRatio, device) || '16/9')
			: isValidCSS('height', at(map, device, 'height'))}
		}

		${pinSl}{
			${isValidCSS('width', marker?.[device]?.size)}
			${isValidCSS('height', marker?.[device]?.size)}
		}

		${infoSl}{
			${isValidCSS('max-width', infoWindow?.[device]?.maxWidth)}
			${isValidCSS('border-radius', getBoxCSS(infoWindow?.[device]?.radius))}
		}

		${infoBodySl}{ ${isValidCSS('padding', getBoxCSS(infoWindow?.[device]?.padding))} }

		${barSl}{ ${isValidCSS('gap', filterBar?.[device]?.gap)} }

		${chipSl}{
			${isValidCSS('padding', getBoxCSS(filterBar?.[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(filterBar?.[device]?.radius))}
		}
	`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', caption.typo).googleFontLink}
			${getTypoCSS('', filterBar.typo).googleFontLink}
			${getTypoCSS('', infoWindow.typo).googleFontLink}

			${mainSl}{ display: block; }

			${boxSl}{ width: 100%; }

			${wrapperSl}{
				position: relative;
				width: 100%;
				overflow: hidden;
				${isValidCSS('box-shadow', getMultiShadowCSS(map.shadow || []))}
				${map.useAspectRatio ? 'height: auto;' : ''}
			}

			${canvasSl}, ${iframeSl}{
				width: 100%;
				height: 100%;
				border: 0;
				display: block;
				${map.useAspectRatio ? 'position: absolute; inset: 0;' : ''}
			}

			${clusterSl}{
				${clustering.background
			? getBackgroundCSS(clustering.background)
			// Content saved before the bubble took a full Background object.
			: isValidCSS('background', clustering.color)}
				${isValidCSS('color', clustering.textColor)}
				${isValidCSS('width', clustering.size)}
				${isValidCSS('height', clustering.size)}
			}

			${barSl}{ ${isValidCSS('justify-content', 'right' === filterBar.align ? 'flex-end' : 'center' === filterBar.align ? 'center' : 'flex-start')} }

			${chipSl}{
				${isValidCSS('color', filterBar.color)}
				${isValidCSS('background', filterBar.bgColor)}
			}
			${getTypoCSS(chipSl, filterBar.typo).styles}

			${chipSl}.active{
				${isValidCSS('background', filterBar.activeColor)}
				${isValidCSS('color', filterBar.activeTextColor)}
			}

			/* After the generic .active rule so a category colour wins. */
			${categoryCSS}

			${infoSl}{
				${isValidCSS('background', infoWindow.bgColor)}
				${getBorderCSS(infoWindow.border)}
				${isValidCSS('box-shadow', getMultiShadowCSS(infoWindow.shadow || []))}
			}

			/* The tail is a separate rotated box; without this a recoloured
			   info window keeps a white arrow. Both class names are emitted —
			   Google renamed it from -t to -tc. */
			${mainSl} .gm-style-iw-t::after,
			${mainSl} .gm-style-iw-tc::after{
				${isValidCSS('background', infoWindow.bgColor)}
			}

			${infoBodySl}, ${mainSl} .${P}-info{
				${isValidCSS('color', infoWindow.textColor)}
			}
			${getTypoCSS(`${mainSl} .${P}-info`, infoWindow.typo).styles}

			${captionSl}{
				${isValidCSS('text-align', caption.align)}
				${isValidCSS('color', caption.color)}
			}
			${getTypoCSS(captionSl, caption.typo).styles}

			${responsive('desktop')}
			${tabBreakpoint}{ ${responsive('tablet')} }
			${mobileBreakpoint}{ ${responsive('mobile')} }

			${generateCSS(id, advanced, isBackend, false)}
			`
		}}
	/>;
};
export default Style;
