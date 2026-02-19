import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
const Style = ({ attributes, id }) => {

	const { styles } = attributes;
	const { crumbs, separator, prefix } = styles;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bBlocks-breadCrumb-wrapper`;
	const itemsSl = `${blockSl} .bBlocks-breadCrumb-items`;
	const itemSl = `${itemsSl} .bBlocks-breadCrumb-item`;
	const activeItemSl = `${itemsSl} .bBlocks-breadCrumb-item-active`;
	const separatorSl = `${itemsSl} .bBlocks-breadCrumb-item-separator`;
	const separatorIconSl = `${separatorSl}.bBlocks-breadCrumb-item-separator-library`;
	const prefixSl = `${itemsSl} .bBlocks-breadCrumbItem-prefix`;

	const getItemCSS = (type = '') => `
		${isValidCSS('padding', getBoxCSS(crumbs[type].desktop.padding))}
		${isValidCSS('color', crumbs[type].color)}
		${getBackgroundCSS(crumbs[type].bg)}
		${getBorderBoxCSS(crumbs[type].border)}
		${isValidCSS('border-radius', getBoxCSS(crumbs[type].desktop.radius))}
		${isValidCSS('box-shadow', getMultiShadowCSS(crumbs[type].shadow))}
	`;


	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', crumbs.typo).googleFontLink}
		${getTypoCSS('', separator.text.typo).googleFontLink}
		${getTypoCSS('', prefix.text.typo).googleFontLink}

		${getTypoCSS(itemSl, crumbs.typo).styles}
		${getTypoCSS(separatorSl, separator.text.typo).styles}
		${getTypoCSS(`${prefixSl}.bBlocks-breadCrumbItem-prefixText`, prefix.text.typo).styles}

		${itemsSl}{
			${isValidCSS('justify-content', crumbs.desktop.align)}
			${isValidCSS('gap', crumbs.desktop.gap)}
		}

		${itemSl}{
			${getItemCSS('normal')}
			${isValidCSS('transition', isExist(crumbs.hover.transition) ? 'all ' + crumbs.hover.transition+'s ease-in-out' : '')}
		}

		${itemSl}:hover{
			${getItemCSS('hover')}
		}

		${activeItemSl}{
			${getItemCSS('active')}
		}

		${separatorSl}{
			${isValidCSS('color', separator.color)}
			${isValidCSS('fill', separator.color)}
		}

		${separatorIconSl}>svg{
			${isValidCSS('fill', separator.color)}
			${isValidCSS('height', separator.library.desktop.size)}
			${isValidCSS('width', separator.library.desktop.size)}
		}

		${prefixSl}{
			${isValidCSS('color', prefix.color)}
			${isValidCSS('padding', getBoxCSS(prefix.desktop.padding))}
			${getBackgroundCSS(prefix.bg)}
			${getBorderBoxCSS(prefix.border)}
			${isValidCSS('border-radius', getBoxCSS(prefix.desktop.radius))}
			${isValidCSS('box-shadow', getMultiShadowCSS(prefix.shadow))}
		}

		${prefixSl}.bBlocks-breadCrumbItem-prefixIcon>svg{
			${isValidCSS('fill', prefix.color)}
			${isValidCSS('height', prefix.library.desktop.size)}
			${isValidCSS('width', prefix.library.desktop.size)}
		}
		${prefixSl}.bBlocks-breadCrumbItem-prefixImage>img{
			${isValidCSS('height', prefix.image.height)}
			${isValidCSS('width', prefix.image.width)}
		}

		${tabBreakpoint}{

			${itemSl}{
				${isValidCSS('padding', getBoxCSS(crumbs.normal.tablet.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.normal.tablet.radius))}
			}

			${itemSl}:hover{
				${isValidCSS('padding', getBoxCSS(crumbs.hover.tablet.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.hover.tablet.radius))}
			}

			${activeItemSl}{
				${isValidCSS('padding', getBoxCSS(crumbs.active.tablet.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.active.tablet.radius))}
			}
			
			${separatorIconSl}>svg{
				${isValidCSS('height', separator.library.tablet.size)}
				${isValidCSS('width', separator.library.tablet.size)}
			}

			${prefixSl}{
				${isValidCSS('padding', getBoxCSS(prefix.tablet.padding))}
				${isValidCSS('border-radius', getBoxCSS(prefix.tablet.radius))}
			}

			${prefixSl}.bBlocks-breadCrumbItem-prefixIcon>svg{
				${isValidCSS('height', prefix.library.tablet.size)}
				${isValidCSS('width', prefix.library.tablet.size)}
			}

		}

		${mobileBreakpoint}{
			${itemSl}{
				${isValidCSS('padding', getBoxCSS(crumbs.normal.mobile.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.normal.mobile.radius))}
			}

			${itemSl}:hover{
				${isValidCSS('padding', getBoxCSS(crumbs.hover.mobile.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.hover.mobile.radius))}
			}

			${activeItemSl}{
				${isValidCSS('padding', getBoxCSS(crumbs.active.mobile.padding))}
				${isValidCSS('border-radius', getBoxCSS(crumbs.active.mobile.radius))}
			}
			
			${separatorIconSl}>svg{
				${isValidCSS('height', separator.library.mobile.size)}
				${isValidCSS('width', separator.library.mobile.size)}
			}

			${prefixSl}{
				${isValidCSS('padding', getBoxCSS(prefix.mobile.padding))}
				${isValidCSS('border-radius', getBoxCSS(prefix.mobile.radius))}
			}

			${prefixSl}.bBlocks-breadCrumbItem-prefixIcon>svg{
				${isValidCSS('height', prefix.library.mobile.size)}
				${isValidCSS('width', prefix.library.mobile.size)}
			}
		}

		
	`}} />;
}
export default Style;
