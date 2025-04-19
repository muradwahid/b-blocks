import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBoxCSS, getTypoCSS } from "../../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id }) => {
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

	return (
		<style>
			{`
			${generateCSS(id, advanced)}
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
					width:${separator[side].width};
					height:${separator[side].height};
					background:${separator[side].color};
					border-radius: ${getBoxCSS(separator[side].bRadius)};
	}`
					)
					.join("")}

			${separatorIcon} svg{
				height:${separator.iconSize}px;
				width:${separator.iconSize}px;
				color: ${separator.iconColor};
			}
			${separatorIcon} svg path{
				fill: ${separator.iconColor};
			}
			${iconSl}>svg{
				height:${icon.size}px;
				width:${icon.size}px;
				color:${icon.color};
			}
			${iconSl}>svg path{
				fill:${icon.color};
			}
			${subContentSl}{
				color:${subHeading.color} !important;
				display:grid;
				${justifyItems("desktop")};
			}
			${getTypoCSS(
						".dch-dual-color-container>.dch-dual-color-subcontent",
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
			@media only screen and (min-width:641px) and (max-width: 1024px) {
				${blockSl}{
					${justifyItems("tablet")};
				}
				${subContentSl}{
					${justifyItems("tablet")};
				}
			}
			
			@media only screen and (max-width: 640px) {
				${blockSl}{
					${justifyItems("mobile")};
				}
				${subContentSl}{
					${justifyItems("mobile")};
				}
			}
	`}
		</style>
	);
}
export default Style;