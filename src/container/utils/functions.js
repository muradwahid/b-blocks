import { mobileBreakpoint, tabBreakpoint } from '../../../../bpl-tools/utils/data';

export const shapeCSS = (shape, id) => {
	const { top, bottom } = shape || {};
	const { color: tColor, isFlip: tIsFlip, isFront: tIsFront, width: tWidth, height: tHeight } = top || {};
	const { isUpload: bIsUpload, color: bColor, isFlip: bIsFlip, isFront: bIsFront, width: bWidth, height: bHeight } = bottom || {};

	const tShapedSl = `#${id} .topShaped`;
	const bShapedSl = `#${id} .bottomShaped`;

	return `
		${tShapedSl}{
			${tHeight?.desktop ? `height: ${tHeight?.desktop};` : ''}
			color: ${tColor};
			${tIsFront ? `z-index: 4;` : ''}
		}

		${tShapedSl} svg{
			${tWidth?.desktop ? `width: ${tWidth?.desktop};` : ''}
			${tHeight?.desktop ? `height: ${tHeight?.desktop};` : ''}
			fill: ${tColor};
			${tIsFlip ? `transform: translateX(0%) rotateY(180deg);` : ''}
		}

		${tShapedSl} svg *{
			fill: ${tColor};
		}

		${bShapedSl}{
			${bHeight?.desktop ? `height: ${bHeight?.desktop};` : ''}
			color: ${bColor};
			${bIsFront ? `z-index: 4;` : ''}
		}
		${bShapedSl} svg{
			${bWidth?.desktop ? `width: ${bWidth?.desktop};` : ''}
			${bHeight?.desktop ? `height: ${bHeight?.desktop};` : ''}
			fill: ${bColor};
			${bIsFlip ? `transform: translateX(0%) rotateX(180deg);` : `transform: rotate(180deg);`}
			${bIsUpload ? `transform: none;` : ''}
		}
		${bShapedSl} svg *{
			color: ${bColor};
			fill: ${bColor};
		}
		
		${tabBreakpoint}{
			${tShapedSl} svg{
				${tWidth?.tablet ? `width: ${tWidth?.tablet}` : ''}
				${tHeight?.tablet ? `height: ${tHeight?.tablet}` : ''}
			}
			${bShapedSl} svg{
				${bWidth?.tablet ? `width: ${bWidth?.tablet}` : ''}
				${bHeight?.tablet ? `height: ${bHeight?.tablet}` : ''}
			}
		}

		${mobileBreakpoint}{
			${tShapedSl} svg{
				${tWidth?.mobile ? `width: ${tWidth?.mobile}` : ''}
				${tHeight?.mobile ? `height: ${tHeight?.mobile}` : ''}
			}
			${bShapedSl} svg{
				${bWidth?.mobile ? `width: ${bWidth?.mobile}` : ''}
				${bHeight?.mobile ? `height: ${bHeight?.mobile}` : ''}
			}
		}
	`.replace(/\s+/g, ' ');
}