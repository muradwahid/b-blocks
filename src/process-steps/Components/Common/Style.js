import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { parsePx, resolveCols, resolveLength, safeConnectorStyle } from '../../utils/options';

const Style = ({ attributes, id, isBackend = false }) => {
	const { layout = {}, connector = {}, badge = {}, content = {}, card = {}, advanced = {} } = attributes;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bBlocksProcessSteps`;
	const listSl = `${blockSl} .bBlocksProcessStepsList`;
	const hzListSl = `${blockSl}.bBlocksProcessStepsLayoutHorizontal .bBlocksProcessStepsList`;
	const itemSl = `${listSl} .bBlocksProcessStepsItem`;
	const badgeSl = `${itemSl} .bBlocksProcessStepsBadge`;
	const titleSl = `${itemSl} .bBlocksProcessStepsTitle`;
	const descSl = `${blockSl} .bBlocksProcessStepsDescription`;
	const vtConnSl = `${blockSl}.bBlocksProcessStepsLayoutVertical.has-connector .bBlocksProcessStepsItem:not(:last-child)::before`;
	const hzConnSl = `${blockSl}.bBlocksProcessStepsLayoutHorizontal.has-connector .bBlocksProcessStepsItem:not(:first-child)::before`;

	const badgeSize = resolveLength(badge.size, '56px');
	const badgeIconSize = `${parsePx(badgeSize, 56) * 0.42}px`;

	const connColor = connector.color || '#CBD5E1';
	const connWidth = resolveLength(connector.width, '2px');
	const connStyle = safeConnectorStyle(connector.style);
	const showConnector = !!connector.show;

	// The connector is positioned inside each card, whose padding offsets the
	// badge from the card edge — so the line must be shifted by that padding to
	// line up with the badge center. Fall back to 0 (not 16px) so this matches
	// what getBoxCSS actually renders when a side is cleared.
	const padTop = resolveLength(card?.padding?.top, '0px');
	const padLeft = resolveLength(card?.padding?.left, '0px');

	const { gap = {}, columnCount = {} } = layout;
	const gapDesktop = resolveLength(gap?.desktop, '32px');
	const gapTablet = resolveLength(gap?.tablet, gapDesktop);
	const gapMobile = resolveLength(gap?.mobile, gapTablet);
	const cols = {
		desktop: resolveCols(columnCount?.desktop, 3),
		tablet: resolveCols(columnCount?.tablet, 2),
		mobile: resolveCols(columnCount?.mobile, 1)
	};


	const vtConnCSS = (g) => `${vtConnSl}{
		content: '';
		position: absolute;
		top: calc(${padTop} + ${badgeSize} + 8px);
		left: calc(${padLeft} + ${badgeSize} / 2);
		width: 0;
		height: calc(100% + ${g} - ${badgeSize} - 8px);
		border-left: ${connWidth} ${connStyle} ${connColor};
		transform: translateX(calc(${connWidth} / -2));
		pointer-events: none;
		z-index: 0;
	}`;
	const hzConnCSS = (g) => `${hzConnSl}{
		content: '';
		position: absolute;
		top: calc(${padTop} + (${badgeSize} / 2));
		right: calc(100% - ${g} / 2 - 1px);
		width: ${g};
		height: 0;
		border-top: ${connWidth} ${connStyle} ${connColor};
		pointer-events: none;
		z-index: 0;
	}`;


	return <style
		dangerouslySetInnerHTML={{
			__html: `

			${getTypoCSS('', badge.typo).googleFontLink}
			${getTypoCSS(badgeSl, badge.typo).styles}

			${getTypoCSS('', content.typo).googleFontLink}
			${getTypoCSS(titleSl, content.typo).styles}

			${getTypoCSS('', content.descTypo).googleFontLink}
			${getTypoCSS(descSl, content.descTypo).styles}

			${listSl}{
				gap: ${gapDesktop};
			}
			${hzListSl}{
				grid-template-columns: repeat(${cols.desktop}, minmax(0, 1fr));
			}
			${itemSl}{
				${isValidCSS('padding', getBoxCSS(card.padding))}
				${getBackgroundCSS(card.bg)}
				${isValidCSS('border-radius', getBoxCSS(card?.borderRadius))}
				${getBorderBoxCSS(card.border)}
				${isValidCSS('box-shadow', getMultiShadowCSS(card?.shadow))}
			}
			${badgeSl}{
				width: ${badgeSize};
				height: ${badgeSize};
				${getBackgroundCSS(badge.bg)}
				${isValidCSS('color', badge.color)}
				${isValidCSS('border-radius', getBoxCSS(badge?.borderRadius))}
				${getBorderBoxCSS(badge.border)}
				${isValidCSS('box-shadow', getMultiShadowCSS(badge?.shadow))}
			}
			${badgeSl} .bBlocksProcessStepsIcon>svg{
				width: ${badgeIconSize};
				height: ${badgeIconSize};
				fill: ${badge.color};
			}
			${titleSl}{
				${isValidCSS('color', content.titleColor)}
			}
			${descSl}{
				${isValidCSS('color', content.descColor)}
			}
			${showConnector ? vtConnCSS(gapDesktop) : ''}
			${showConnector ? hzConnCSS(gapDesktop) : ''}

			${tabBreakpoint}{
				${listSl}{
					gap: ${gapTablet};
				}
				${hzListSl}{
					grid-template-columns: repeat(${cols.tablet}, minmax(0, 1fr));
				}
				${showConnector ? vtConnCSS(gapTablet) : ''}
				${showConnector ? hzConnCSS(gapTablet) : ''}
			}

			${mobileBreakpoint}{
				${listSl}{
					gap: ${gapMobile};
				}
				${hzListSl}{
					grid-template-columns: repeat(${cols.mobile}, minmax(0, 1fr));
				}
				${showConnector ? vtConnCSS(gapMobile) : ''}
				${showConnector ? `${hzConnSl}{ display: none; }` : ''}
			}

			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};

export default Style;
