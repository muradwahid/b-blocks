import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBoxCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id, isBackend = false }) => {
	const { heading, alignment, icon, subHeading, separator, advanced } = attributes;
	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .dch-dual-color-container`;
	const titleSl = `${blockSl} .dch-dual-color-title`;
	const subContentSl = `${blockSl} .dch-dual-color-subcontent`;
	const sepWrapSl = `${mainSl} .dch-separator-wrapper`;
	const separatorIcon = `${sepWrapSl} .dch-separator-icon`;
	const iconSl = `${blockSl} .dch-dual-color-icon-svg`

	const justifyItems = (device) =>
		`justify-items: ${alignment[device] === "left"
			? "start"
			: alignment[device] === "right"
				? "end"
				: "center"
		}`;

	return <style>
		{`
			${getTypoCSS("", heading.typography)?.googleFontLink}
			${getTypoCSS("", subHeading.typography)?.googleFontLink}
			${blockSl}{
				${justifyItems("desktop")};
			}
			${getTypoCSS(titleSl, heading.typography).styles}

			${sepWrapSl}{
				gap: ${separator.distance};
				justify-content:${separator.alignment === "left"
				? "flex-start"
				: separator.alignment === "center"
					? "center"
					: "flex-end"
			};
				margin: ${getBoxCSS(separator.margin)};
	}

            ${["left", "right"]
                        .map(
                            (side) => `${mainSl} .separator-${side}{
                            ${isValidCSS('width', separator[side].width)}
                            ${isValidCSS('height', separator[side].height)}
                            ${isValidCSS('background', separator[side].color)}
                            ${isValidCSS('border-radius', separator[side].bRadius)}
            }`
            ).join("")}

			${titleSl}{
				${isValidCSS('width', heading?.align ? '100%' : '')}
				${isValidCSS('text-align', heading?.align)}
			}

			${separatorIcon}> svg{
                ${isValidCSS('height', isExist(separator.iconSize) ? separator.iconSize + 'px' : '')}
                ${isValidCSS('width', isExist(separator.iconSize) ? separator.iconSize + 'px' : '')}
                ${isValidCSS('color', separator.iconColor)}
                ${isValidCSS('fill', separator.iconColor)}
			}
			${separatorIcon}> img{
                ${isValidCSS('height', isExist(separator.iconSize) ? separator.iconSize + 'px' : '')}
                ${isValidCSS('width', isExist(separator.iconSize) ? separator.iconSize + 'px' : '')}
			}
			${separatorIcon} svg path{
                ${isValidCSS('color', separator.iconColor)}
			}
			${iconSl}>svg{
                ${isValidCSS('height', isExist(icon.size) ? icon.size + 'px' : '')}
                ${isValidCSS('width', isExist(icon.size) ? icon.size + 'px' : '')}
                ${isValidCSS('color', icon.color)}
                ${isValidCSS('fill', icon.color)}
			}

			${iconSl}>img{
                ${isValidCSS('height', isExist(icon.size) ? icon.size + 'px' : '')}
                ${isValidCSS('width', isExist(icon.size) ? icon.size + 'px' : '')}
                ${isValidCSS('color', icon.color)}
			}

			${iconSl}>svg path{
                ${isValidCSS('color', icon.color)}
			}
			${subContentSl}{
                ${isValidCSS('color', isExist(subHeading.color) ?`${subHeading.color} !important` : '')}
				display:grid;
				${justifyItems("desktop")};
			}
			${getTypoCSS(
				`${subContentSl}>*`,
					subHeading.typography
				).styles
			}

			${["first", "last"]
				.map(
					(part) => `${titleSl} .heading-${part}{
						${heading[part].color
							? `color:${heading[part].colorType === "solid" && heading[part].color
							};`
							: `background:${heading[part].gradient};`
						}
						background:${heading[part].colorType === "gradient" && heading[part].gradient};
			${heading[part].colorType === "gradient" ||
							heading[part].color.length === 0
							? `
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent; 
					`
							: ""
						}
			}`
				)
				.join("")}
			${tabBreakpoint} {
				${blockSl}{
					${justifyItems("tablet")};
				}
				${subContentSl}{
					${justifyItems("tablet")};
				}
			}
			
			${mobileBreakpoint} {
				${blockSl}{
					${justifyItems("mobile")};
				}
				${subContentSl}{
					${justifyItems("mobile")};
				}
			}
			${generateCSS(id, advanced, isBackend)}
	`}
	</style>
}
export default Style;