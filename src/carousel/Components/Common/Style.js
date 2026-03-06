import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

const Style = ({ attributes, id, isBackend=false }) => {
	const { styles, advanced } = attributes;
	const { container, navigation, pagination } = styles;

	const mainSl = `#${id}`;
	const advancedStyleSl = `${id} .bBlock-carousel-main-wrapper`;
	const blockSl = `${mainSl} .bBlocks-carousel-wrapper`;
	const swiperSl = `${blockSl} .swiper`
	const swiperWrapperSl = `${swiperSl} .swiper-wrapper`;

	const prevNavigationSl = `${blockSl} .swiper-button-prev`;
	const nextNavigationSl = `${blockSl} .swiper-button-next`;

	const paginationSl = `${blockSl} .swiper-pagination`;
	const normalPaginationSl = `${paginationSl} .swiper-pagination-bullet`;
	const activePaginationSl = `${paginationSl} .swiper-pagination-bullet-active`;
	// navigationStye[device].arrow.positionX.prev

	const navigationStyle =(type='normal')=> `
		${getBackgroundCSS(navigation[type].bg)}
		${getBorderBoxCSS(navigation[type].border)}
		${type === 'normal' ? isValidCSS('transition', isExist(navigation.hover.transition) ? `all ${navigation.hover.transition}s ease-in-out`:''):''}
	`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${swiperSl}{
				${isValidCSS('height', container.desktop.height)}
				${isValidCSS('width', container.desktop.width)}
			}
			${swiperWrapperSl}{
				${isValidCSS('align-items', container.desktop.alignItems)}
			}
			${prevNavigationSl}{
			${isValidCSS('height', 'unset', true)}
				${isValidCSS('left', navigation.desktop.arrow.positionX.prev)}
				${isValidCSS('top', navigation.desktop.arrow.positionY.prev)}
				${isValidCSS('padding', getBoxCSS(navigation.desktop.padding))}
				${isValidCSS('color', navigation.normal.color)}
				${isValidCSS('border-radius', getBoxCSS(navigation.normal.desktop.radius))}
				${navigationStyle('normal')}
			}
			${nextNavigationSl}{
			${isValidCSS('height', 'unset', true)}
				${isValidCSS('right', navigation.desktop.arrow.positionX.next)}
				${isValidCSS('top', navigation.desktop.arrow.positionY.next)}
				${isValidCSS('padding', getBoxCSS(navigation.desktop.padding))}
				${isValidCSS('color', navigation.normal.color)}
				${isValidCSS('border-radius', getBoxCSS(navigation.normal.desktop.radius))}
				${navigationStyle('normal')}
			}
			${prevNavigationSl}:hover{
				${isValidCSS('color', navigation.hover.color)}
				${isValidCSS('border-radius', getBoxCSS(navigation.hover.desktop.radius))}
				${navigationStyle('hover')}
			}
			${nextNavigationSl}:hover{
				${isValidCSS('color', navigation.hover.color)}
				${isValidCSS('border-radius', getBoxCSS(navigation.hover.desktop.radius))}
				${navigationStyle('hover')}
			}
			${prevNavigationSl}:hover>svg{
				${isValidCSS('color', navigation.hover.color)}
				${isValidCSS('fill', navigation.hover.color)}
			}
			${nextNavigationSl}:hover>svg{
				${isValidCSS('color', navigation.hover.color)}
				${isValidCSS('fill', navigation.hover.color)}
			}
			${prevNavigationSl}>svg{
				${isValidCSS('height', navigation.desktop.arrow.size)}
				${isValidCSS('width', navigation.desktop.arrow.size)}
				${isValidCSS('color', navigation.normal.color)}
				${isValidCSS('fill', navigation.normal.color)}
				${isValidCSS('transition', isExist(navigation.hover.transition) ? `all ${navigation.hover.transition}s ease-in-out` : '')}
			}

			${nextNavigationSl}>svg{
				${isValidCSS('height', navigation.desktop.arrow.size)}
				${isValidCSS('width', navigation.desktop.arrow.size)}
				${isValidCSS('color', navigation.normal.color)}
				${isValidCSS('fill', navigation.normal.color)}
				${isValidCSS('transition', isExist(navigation.hover.transition) ? `all ${navigation.hover.transition}s ease-in-out` : '')}
			}
			${paginationSl}{
				${isValidCSS('bottom', pagination.desktop.positionY)}
				${isValidCSS('left', pagination.desktop.positionX)}
			}
			
			${normalPaginationSl}{
				${isValidCSS('background-color', pagination.normal.color)}
				${isValidCSS('width', pagination.normal.width)}
				${isValidCSS('height', pagination.normal.height)}
				${getBorderBoxCSS(pagination.normal.border)}
				${isValidCSS('border-radius', getBoxCSS(pagination.normal.radius))}
				${isValidCSS('transition', isExist(pagination.active.transition) ? `all ${pagination.active.transition}s ease-in-out` : '')}
			}
			${activePaginationSl}{
				${isValidCSS('background-color', pagination.active.color)}
				${isValidCSS('width', pagination.active.width)}
				${isValidCSS('height', pagination.active.height)}
				${getBorderBoxCSS(pagination.active.border)}
				${isValidCSS('border-radius', getBoxCSS(pagination.active.radius))}
			}

			${generateCSS(isBackend?advancedStyleSl:id,advanced,isBackend,false)}

	`}} />;
}
export default Style;