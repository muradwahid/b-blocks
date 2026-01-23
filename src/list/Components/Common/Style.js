import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id }) => {
	const { layout, styles } = attributes;
	const { lists, divider, marker } = styles;
	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bBlocksListMainWrapper`;
	const listWrapperSl = `${blockSl} .bBlocksListContainer`;
	const listSl = `${listWrapperSl} .bBlocksListItem`;
	const listTextSl = `${listSl} .bBlocksListItemText`;
	const listDividerSl = `${listWrapperSl} .bBlocksListItemDivider`;
	const iconSl = `${listSl} .bBlocksListMarkerIcon`;
	const emojiSl = `${listSl} .bBlocksListMarkerEmoji`;
	const markerSl = `${listSl} .bBlocksListMarker`;

	const flexDirection = (device) => {
		if(layout[device].type === 'vertical'){
			return 'flex-direction:column;';
		}
		if(layout[device].type === 'horizontal'){
			return 'flex-direction:row;';
		}
		return '';
	}

	const layoutAlign = (device) => {
		const verticalAlign = layout[device].type === 'vertical' ? isValidCSS('align-items', layout[device].verticalAlign) : '';
		const horizontalAlign = layout[device].type === 'horizontal' ? isValidCSS('justify-content',layout[device].horizontalAlign) : '';
		return verticalAlign + horizontalAlign;
	}
	
	const dividerCSS = (device) => { 
		const horizontal = layout[device].type === 'horizontal' ? `${isValidCSS('border-right-style', divider.style)}
			${isValidCSS('border-right-width', divider.weight)}
			${isValidCSS('border-right-color', divider.color)}` : ''
		const vertical = layout[device].type === 'vertical' ? `${isValidCSS('border-bottom-style', divider.style)}
			${isValidCSS('border-bottom-width', divider.weight)}
			${isValidCSS('border-bottom-color', divider.color)} 
			${isValidCSS('width', divider.width)}` : ''
		return horizontal + vertical;
	};

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('',lists.typography).googleFontLink}
		${getTypoCSS(listTextSl,lists.typography).styles}

		${listWrapperSl}{
			${flexDirection('desktop')}
			${layoutAlign('desktop')}
			${isValidCSS('gap', lists.desktop.gap.horizontal)}
		}
		${listSl}{
			${isValidCSS('gap', marker.gap)}
		}
		${listTextSl}{
			${isValidCSS('color', lists.color)}
		}
		${listDividerSl}{
			${dividerCSS('desktop')}
		}
		
		${iconSl}{
			${getBackgroundCSS(marker.bg)}
			${isValidCSS('padding', getBoxCSS(marker.desktop.padding))}
			${isValidCSS('border-radius', getBoxCSS(marker.desktop.radius))}
			${getBorderBoxCSS(marker.border)}
		}

		${iconSl}>svg{
			${isValidCSS('fill', marker.color)}
			${isValidCSS('width', marker.iconSize)}
			${isValidCSS('height', marker.iconSize)}
		}

		${emojiSl}{
			${isValidCSS('font-size', marker.iconSize)}
		}

		${markerSl}{
			${isValidCSS('background', marker.color)}
			${isValidCSS('height', marker.size)}
			${isValidCSS('width', marker.size)}
		}

		${tabBreakpoint}{
			${listWrapperSl}{
				${flexDirection('tablet')}
				${layoutAlign('tablet')}
				${isValidCSS('gap', lists.tablet.gap.horizontal)}
			}

			${listDividerSl}{
				${dividerCSS('tablet')}
			}
			${iconSl}{
				${isValidCSS('padding', getBoxCSS(marker.tablet.padding))}
				${isValidCSS('border-radius', getBoxCSS(marker.tablet.radius))}
			}

		}

		${mobileBreakpoint}{
			${listWrapperSl}{
				${flexDirection('mobile')}
				${layoutAlign('mobile')}
				${isValidCSS('gap', lists.mobile.gap.horizontal)}
			}

			${listDividerSl}{
				${dividerCSS('mobile')}
			}
			${iconSl}{
				${isValidCSS('padding', getBoxCSS(marker.mobile.padding))}
				${isValidCSS('border-radius', getBoxCSS(marker.mobile.radius))}
			}

		}

	`}} />;
}
export default Style;