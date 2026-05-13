import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const style = (attributes, id) => {

	const { tabs, styles } = attributes;
	const { tabContainer, tabs: tabStyle, tabTitle, tabSubTitle, icon, content } = styles;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-advanced-tabs-main-wrapper`;
	const tabsWrapperSl = `${blockSl} .b-blocks-advanced-tabs-wrapper`;
	const buttonListsSl = `${tabsWrapperSl} .b-blocks-advanced-tabs-button-lists`;
	const buttonSl = `${buttonListsSl} .b-blocks-advanced-tabs-button`;
	const activeButtonSl = `${buttonSl}.b-blocks-advanced-tabs-button-active`;
	const normalButtonSl = `${buttonSl}.b-blocks-advanced-tabs-button-normal`;
	const titleContainerSl = `${buttonSl} .b-blocks-advanced-tabs-button-title-container`;

	const titleSl = `${titleContainerSl} .b-blocks-advanced-tabs-button-title`;
	const activeTitleSl = `${activeButtonSl} .b-blocks-advanced-tabs-button-title`;

	const subTitleSl = `${titleContainerSl} .b-blocks-advanced-tabs-button-subTitle`;
	const activeSubTitleSl = `${activeButtonSl} .b-blocks-advanced-tabs-button-subTitle`;

	const iconSl = `${buttonSl} .b-blocks-advanced-tabs-button-icon`;

	const contentSl = `${blockSl} .b-blocks-advanced-tabs-contents`;

	const row = (device='desktop') => tabs?.[device].direction === 'row-reverse' || tabs?.[device].direction === 'row';
	const column = (device = 'desktop') => tabs?.[device].direction === 'column' || tabs?.[device].direction === 'column-reverse';

	const buttonStyles = (active = 'normal', hover = 'normal', device = 'desktop') => `
					${isValidCSS('margin', getBoxCSS(tabStyle[active][hover][device].margin))}
					${isValidCSS('padding', getBoxCSS(tabStyle[active][hover][device].padding))}
					${isValidCSS('border-radius', getBoxCSS(tabStyle[active][hover][device].radius))}
					${device === 'desktop' ? getBackgroundCSS(tabStyle[active][hover].bg) : ''}
					${device === 'desktop' ? getBorderBoxCSS(tabStyle[active][hover].border) : ''}
				`

	const iconStyles = (active = 'normal', hover = 'normal', device = 'desktop') => `
				${isValidCSS('margin', getBoxCSS(icon[active][hover][device].margin))}
				${isValidCSS('padding', getBoxCSS(icon[active][hover][device].padding))}
				${isValidCSS('border-radius', getBoxCSS(icon[active][hover][device].radius))}
				${device === 'desktop' ? getBackgroundCSS(icon[active][hover].bg) : ''}
				${device === 'desktop' ? getBorderBoxCSS(icon[active][hover].border) : ''}
	`;

	const layoutVal = ['row', 'row-reverse'];
	const columnVal = ['column', 'column-reverse'];

	return `

			${getTypoCSS('', tabTitle.typography).googleFontLink}
			${getTypoCSS('', tabSubTitle.typography).googleFontLink}

			${getTypoCSS(titleSl, tabTitle.typography).styles}
			${getTypoCSS(subTitleSl, tabSubTitle.typography).styles}

			${tabsWrapperSl}{
				${isValidCSS('flex-direction', tabs.desktop.direction)}
			}

			${buttonListsSl}{
				${isValidCSS('justify-content', column('desktop') ? tabs.desktop.columnJustify : tabs.desktop.rowJustify)}
				${isValidCSS('flex-direction', row('desktop') ? 'column' : '')}
				${isValidCSS('gap', tabStyle.desktop.gap)}
				${isValidCSS('padding', getBoxCSS(tabContainer.desktop.padding))}
				${isValidCSS('margin', getBoxCSS(tabContainer.desktop.margin))}
				${isValidCSS('border-radius', getBoxCSS(tabContainer.desktop.radius))}
				${getBorderBoxCSS(tabContainer.border)}
				${getBackgroundCSS(tabContainer.bg)}
				${layoutVal.includes(tabs?.desktop?.direction) ? isValidCSS('width', tabStyle.desktop.width) : ''}
				${columnVal.includes(tabs.desktop.direction) ? isValidCSS('flex-wrap', tabs.desktop.wrap) : ''}
			}

			${buttonSl}{
				${isValidCSS('width', column('desktop') && tabs.desktop.columnJustify === 'stretch' ? '100%' : '')}
				${isValidCSS('height', row('desktop') && tabs.desktop.rowJustify === 'stretch' ? '100%' : '')}
				${isValidCSS('justify-content', tabs.desktop.contentAlign)}
				${isValidCSS('flex-direction', icon.desktop.position)}
				${buttonStyles('normal', 'normal')}
				transition:all ${tabStyle.normal.hover.transition}s ease-in-out; 
			}

			${normalButtonSl}:hover{
				${buttonStyles('normal', 'hover')}
			}
			
			${activeButtonSl}{
				${buttonStyles('active', 'normal')}
			}
			${activeButtonSl}:hover{
				${buttonStyles('active', 'hover')}
			}

			${titleContainerSl}{
				${isValidCSS('text-align', tabs.desktop.contentAlign)}
			}

			${buttonSl}:hover .b-blocks-advanced-tabs-button-title{
				${isValidCSS('color', tabTitle.normal.hover.color, true)}
			}

			${activeButtonSl}:hover .b-blocks-advanced-tabs-button-title{
				${isValidCSS('color', tabTitle.active.hover.color, true)}
			}

			${titleSl}{
				${isValidCSS('color', tabTitle.normal.normal.color)}
				transition:all ${tabStyle.normal.hover.transition}s ease-in-out; 
			}

			${activeTitleSl}{
				${isValidCSS('color', tabTitle.active.normal.color)}
			}

			${subTitleSl}{
			  ${isValidCSS('color', tabSubTitle.normal.normal.color)}
				transition:all ${tabStyle.normal.hover.transition}s ease-in-out;
				${tabs.isShowActiveSubTitle ? isValidCSS('display', 'none') : ''}
			}

			${buttonSl}:hover .b-blocks-advanced-tabs-button-subTitle{
				${isValidCSS('color', tabSubTitle.normal.hover.color)}
			}

			${activeSubTitleSl}{
				${isValidCSS('color', tabSubTitle.active.normal.color)}
				${tabs.isShowActiveSubTitle ? isValidCSS('display', 'block') : ''}
			}

			${activeButtonSl}:hover .b-blocks-advanced-tabs-button-subTitle{
				${isValidCSS('color', isExist(tabSubTitle.active.hover.color) ? tabSubTitle.active.hover.color : tabSubTitle.normal.hover.color)}
			}

			${iconSl}{
				${iconStyles('normal', 'normal')}
				transition:all ${tabStyle.normal.hover.transition}s ease-in-out;
			}

			${buttonSl}:hover .b-blocks-advanced-tabs-button-icon{
				${iconStyles('normal', 'hover')}
			}

			${iconSl}>svg{
				${isValidCSS('height', icon.desktop.size)}
				${isValidCSS('width', icon.desktop.size)}
				${isValidCSS('fill', icon.normal.normal.color)}
				${isValidCSS('color', icon.normal.normal.color)}
				transition:all ${tabStyle.normal.hover.transition}s ease-in-out;
			}

			${buttonSl}:hover .b-blocks-advanced-tabs-button-icon>svg{
				${isValidCSS('fill', icon.normal.hover.color)}
				${isValidCSS('color', icon.normal.hover.color)}
			}

			${activeButtonSl} .b-blocks-advanced-tabs-button-icon{
				${iconStyles('active', 'normal')}
			}

			${activeButtonSl} .b-blocks-advanced-tabs-button-icon>svg{
				${isValidCSS('fill', icon.active.normal.color)}
				${isValidCSS('color', icon.active.normal.color)}
			}

			${activeButtonSl}:hover .b-blocks-advanced-tabs-button-icon{
					${iconStyles('active', 'hover')}
			}

			${activeButtonSl}:hover .b-blocks-advanced-tabs-button-icon>svg{
				${isValidCSS('fill', isExist(icon.active.hover.color) ? icon.active.hover.color : icon.normal.hover.color)}
				${isValidCSS('color', isExist(icon.active.hover.color) ? icon.active.hover.color : icon.normal.hover.color)}
			}

			${contentSl}{
				${layoutVal.includes(tabs?.desktop?.direction) && isValidCSS('max-width', content.desktop.width)}
			}

			${tabBreakpoint}{
				${tabsWrapperSl}{
					${isValidCSS('flex-direction', tabs?.tablet?.direction)}
				}
					${buttonListsSl}{
					${isValidCSS('justify-content', column('tablet') ? tabs?.tablet?.columnJustify : tabs?.tablet?.rowJustify)}
					${isValidCSS('flex-direction', row('tablet') ? 'column' : '')}
					${isValidCSS('gap', tabStyle?.tablet?.gap)}
					${isValidCSS('padding', getBoxCSS(tabContainer?.tablet?.padding))}
					${isValidCSS('margin', getBoxCSS(tabContainer?.tablet?.margin))}
					${isValidCSS('border-radius', getBoxCSS(tabContainer?.tablet?.radius))}
					${layoutVal.includes(tabs?.tablet?.direction) ? isValidCSS('width', tabStyle?.tablet?.width) : ''}
					${columnVal.includes(tabs?.tablet?.direction) ? isValidCSS('flex-wrap', tabs?.tablet?.wrap) : ''}
				}

				${buttonSl}{
					${isValidCSS('width', column('tablet') && tabs?.tablet.columnJustify === 'stretch' ? '100%' : '')}
					${isValidCSS('height', row('tablet') && tabs?.tablet.rowJustify === 'stretch' ? '100%' : '')}
					${isValidCSS('justify-content', tabs?.tablet.contentAlign)}
					${isValidCSS('flex-direction', icon?.tablet.position)}
					${buttonStyles('normal', 'normal','tablet')}
				}
				${normalButtonSl}:hover{
					${buttonStyles('normal', 'hover','tablet')}
				}
				
				${activeButtonSl}{
					${buttonStyles('active', 'normal', 'tablet')}
				}
				${activeButtonSl}:hover{
					${buttonStyles('active', 'hover', 'tablet')}
				}

				${titleContainerSl}{
					${isValidCSS('text-align', tabs?.tablet.contentAlign)}
				}

				${buttonSl}:hover .b-blocks-advanced-tabs-button-icon{
					${iconStyles('normal', 'hover','tablet')}
				}

				${iconSl}>svg{
					${isValidCSS('height', icon?.tablet.size)}
					${isValidCSS('width', icon?.tablet.size)}
				}

				${activeButtonSl} .b-blocks-advanced-tabs-button-icon{
					${iconStyles('active', 'normal','tablet')}
				}

				${activeButtonSl}:hover .b-blocks-advanced-tabs-button-icon{
						${iconStyles('active', 'hover','tablet')}
				}

				${contentSl}{
					${layoutVal.includes(tabs?.tablet?.direction) && isValidCSS('max-width', content?.tablet.width)}
				}
			}

			${mobileBreakpoint}{
				${tabsWrapperSl}{
					${isValidCSS('flex-direction', tabs?.tablet?.direction)}
				}
					${buttonListsSl}{
					${isValidCSS('justify-content', column('tablet') ? tabs?.tablet?.columnJustify : tabs?.tablet?.rowJustify)}
					${isValidCSS('flex-direction', row('tablet') ? 'column' : '')}
					${isValidCSS('gap', tabStyle?.tablet?.gap)}
					${isValidCSS('padding', getBoxCSS(tabContainer?.tablet?.padding))}
					${isValidCSS('margin', getBoxCSS(tabContainer?.tablet?.margin))}
					${isValidCSS('border-radius', getBoxCSS(tabContainer?.tablet?.radius))}
					${layoutVal.includes(tabs?.tablet?.direction) ? isValidCSS('width', tabStyle?.tablet?.width) : ''}
					${columnVal.includes(tabs?.tablet?.direction) ? isValidCSS('flex-wrap', tabs?.tablet?.wrap) : ''}
				}

				${buttonSl}{
					${isValidCSS('width', column('tablet') && tabs?.tablet.columnJustify === 'stretch' ? '100%' : '')}
					${isValidCSS('height', row('tablet') && tabs?.tablet.rowJustify === 'stretch' ? '100%' : '')}
					${isValidCSS('justify-content', tabs?.tablet.contentAlign)}
					${isValidCSS('flex-direction', icon?.tablet.position)}
					${buttonStyles('normal', 'normal', 'tablet')}
				}
				${normalButtonSl}:hover{
					${buttonStyles('normal', 'hover', 'tablet')}
				}
				
				${activeButtonSl}{
					${buttonStyles('active', 'normal', 'tablet')}
				}
				${activeButtonSl}:hover{
					${buttonStyles('active', 'hover', 'tablet')}
				}

				${titleContainerSl}{
					${isValidCSS('text-align', tabs?.tablet.contentAlign)}
				}

				${buttonSl}:hover .b-blocks-advanced-tabs-button-icon{
					${iconStyles('normal', 'hover', 'tablet')}
				}

				${iconSl}>svg{
					${isValidCSS('height', icon?.tablet.size)}
					${isValidCSS('width', icon?.tablet.size)}
				}

				${activeButtonSl} .b-blocks-advanced-tabs-button-icon{
					${iconStyles('active', 'normal', 'tablet')}
				}

				${activeButtonSl}:hover .b-blocks-advanced-tabs-button-icon{
						${iconStyles('active', 'hover', 'tablet')}
				}

				${contentSl}{
					${layoutVal.includes(tabs?.tablet?.direction) && isValidCSS('max-width', content?.tablet.width)}
				}
			}

	`;
}
export default style;