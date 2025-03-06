import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS";
import { isExist } from '../../../../../bpl-tools/utils/functions';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS, } from "../../../../../bpl-tools/utils/getCSS";

const style = (attributes, id, isBackend = false) => {
	const { styles, dropdownStyles, caret, hamburger, advanced } = attributes;
	const { padding, margin, typo, colors } = styles;
	const { container, menuItems } = dropdownStyles;
	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bBlocksNavigation`;

	const navWrapper = `${blockSl} .wp-block-navigation`;
	const navItemsContainer = ` ${navWrapper} .wp-block-navigation__container`;
	const navItem = `${navItemsContainer} .wp-block-navigation-item`;
	const subMenuContainer = `${navItem} .wp-block-navigation__submenu-container`;
	const subMenuItem = `${subMenuContainer} .wp-block-navigation-item`;
	const subMenuIcon = `${navItem} .wp-block-navigation__submenu-icon`;
	const hamburgerIconSl = `${navWrapper} .wp-block-navigation__responsive-container-open`;
	const hamburgerMenuContainer = `${navWrapper} .is-menu-open`;
	const hMenuItemsContainer = `${hamburgerMenuContainer} .wp-block-navigation__container`;
	const hMenuItemSl = `${hMenuItemsContainer} .wp-block-navigation-item .wp-block-navigation-item__content`;
	const hCloseBtnSl = `${hamburgerMenuContainer} .components-button.wp-block-navigation__responsive-container-close`;
	const activeMenu = `${navItem}.current-menu-item`;
	const dropDownActiveMenu = `${subMenuItem} a[aria-current="page"]`;
	return `
		${generateCSS(id, advanced, isBackend)}
		${getTypoCSS("", typo)?.googleFontLink}
		${getTypoCSS("", menuItems.typo)?.googleFontLink}
		${getTypoCSS("", hamburger.items.typo)?.googleFontLink}

		${getTypoCSS(navItem, typo)?.styles}
		${navItem}{
			padding:${getBoxCSS(padding?.desktop)};
			margin:${getBoxCSS(margin?.desktop)};
			color:${colors.normal.normal};
			transition:all 0.3s ease-in-out;
		}
		${navItem}:hover{
			color:${colors.normal.hover};
		}
		${subMenuContainer}{
			${isValidCSS('min-width', isExist(container.width.desktop) ? `${container.width.desktop}px !important` : "")}
			${getBackgroundCSS(container.background)}
			padding:${getBoxCSS(container.padding.desktop)};
			${getBorderBoxCSS(container.border)}
			border-radius:${getBoxCSS(container.borderRadius)};
			box-shadow:${getMultiShadowCSS(container.shadow)};
		}
		${getTypoCSS(subMenuItem, menuItems.typo).styles}
		${subMenuItem}{
			${isValidCSS('padding', getBoxCSS(menuItems.padding.desktop))}
			${isValidCSS('color', menuItems.colors.normal.normal)}
			transition:all ${menuItems.colors.transition || 0.3}s;
		}
		${subMenuItem}:hover{
			${isValidCSS('color', menuItems.colors.normal.hover)}
		}
		${subMenuIcon}{
			${isValidCSS('width', isExist(caret.size.desktop) ? caret.size.desktop + 'px' : '')}
			${isValidCSS('height', isExist(caret.size.desktop) ? caret.size.desktop + 'px' : '')}
			${isValidCSS('color', caret.color.normal)}
			transition:all ${menuItems.colors.transition || 0.3}s ease-in-out;
		}
		${navItem}:hover .wp-block-navigation__submenu-icon{
			color:${caret.color.hover} !important;
		}
		${activeMenu}{
			${isValidCSS('color', colors.active.normal)}
			transition:all 0.2s ease-in-out;
		}
		${activeMenu}:hover{
			${isValidCSS('color', colors.active.hover)}
		}
		${dropDownActiveMenu}{
			${isValidCSS('color', menuItems.colors.active.normal)}
			transition:all ${menuItems.colors.transition || 0.2}s ease-in-out;
		}
		${dropDownActiveMenu}:hover{
			${isValidCSS('color', menuItems.colors.active.hover)}
		}
		${hamburgerIconSl} svg{
			height:${hamburger.button.size.desktop}px;
			width:${hamburger.button.size.desktop}px;
			fill:${hamburger.button.color};
		}
		${hamburgerIconSl}{
			${isValidCSS('padding', getBoxCSS(hamburger.button.padding.desktop))}
		}
		${hamburgerMenuContainer}{
			${isValidCSS('padding', getBoxCSS(hamburger.container.padding.desktop))}
			${getBackgroundCSS(hamburger.container.background)}
		}

		${getTypoCSS(hMenuItemSl, hamburger.items.typo).styles}
		${hMenuItemSl}{
			${isValidCSS('background', hamburger.items.colors.normal.bg)}
			${isValidCSS('color', hamburger.items.colors.normal.text)}
			${isValidCSS('padding', getBoxCSS(hamburger.items.padding.desktop))}
			${getBorderBoxCSS(hamburger.items.border)}
			${isValidCSS('border-radius', getBoxCSS(hamburger.items.borderRadius))}
			transition:all 0.3s ease-in-out;
		}
		${hMenuItemSl}:hover{
			background:${hamburger.items.colors.hover.bg} !important;
			color:${hamburger.items.colors.hover.text} !important;
		}
		${hCloseBtnSl}{
			color:${hamburger.closeButton?.color};
			${hamburger.closeButton.alignment === "right" ? "right:0;" : hamburger.closeButton.alignment === "left" ? "left:0px;" : "left:50%;"}
		}
		@media only screen and (min-width:641px) and (max-width: 1024px){
			${navItem}{
				${isValidCSS('padding', getBoxCSS(padding?.tablet))}
				${isValidCSS('margin', getBoxCSS(margin?.tablet))}
			}
			${subMenuContainer}{
				min-width:${container.width.tablet}px !important;
				${isValidCSS('padding', getBoxCSS(container.padding.tablet))}
			}
			${subMenuItem}{
				${isValidCSS('padding', getBoxCSS(menuItems.padding.tablet))}
			}
			${subMenuIcon}{
				Width:${caret.size.tablet}px;
				height:${caret.size.tablet}px;
			}
			${hamburgerIconSl} svg{
				height:${hamburger.button.size.tablet}px;
				width:${hamburger.button.size.tablet}px;
			}
			${hamburgerIconSl}{
				${isValidCSS('padding', getBoxCSS(hamburger.button.padding.tablet))}
			}
			${hamburgerMenuContainer}{
				${isValidCSS('padding', getBoxCSS(hamburger.container.padding.tablet))}
			}
			${hMenuItemSl}{
				${isValidCSS('padding', getBoxCSS(hamburger.items.padding.tablet))}
			}
		}
		@media only screen and (max-width: 640px){
			${navItem}{
				${isValidCSS('padding', getBoxCSS(padding?.mobile))}
				${isValidCSS('margin', getBoxCSS(margin?.mobile))}
			}
			${subMenuContainer}{
				min-width:${container.width.mobile}px !important;
				${isValidCSS('padding', getBoxCSS(container.padding.mobile))}
			}
			${subMenuItem}{
				${isValidCSS('padding', getBoxCSS(menuItems.padding.mobile))}
			}
			${subMenuIcon}{
				Width:${caret.size.mobile}px;
				height:${caret.size.mobile}px;
			}
			${hamburgerIconSl} svg{
				height:${hamburger.button.size.mobile}px;
				width:${hamburger.button.size.mobile}px;
			}
			${hamburgerIconSl}{
				${isValidCSS('padding', getBoxCSS(hamburger.button.padding.mobile))}
			}
			${hamburgerMenuContainer}{
				${isValidCSS('padding', getBoxCSS(hamburger.container.padding.mobile))}
			}
			${hMenuItemSl}{
				${isValidCSS('padding', getBoxCSS(hamburger.items.padding.mobile))}
			}
		}
	`;
};
export default style;


