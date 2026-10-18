import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { BOX, EASINGS, FITS, POSITIONS, RATIOS, SOLID_EFFECTS } from '../../utils/functions';

const style = ( attributes, id, isBackend = false ) => {
	const { layout, options, thumbLayout, sticky, image, thumbs, activeThumbs, nav, mainNav, pagination, badge, advanced } = attributes;

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .${ BOX }`;
	const imageBoxSl = `${ blockSl } .${ BOX }-main`;
	const swiperSl = `${ blockSl } .${ BOX }-main-swiper`;
	const slideSl = `${ blockSl } .${ BOX }-main-slide`;
	const imgSl = `${ blockSl } .${ BOX }-main-img`;
	const zoomImgSl = `${ blockSl } .${ BOX }-zoom img`;
	const thumbsSl = `${ blockSl } .${ BOX }-thumbs`;
	const thumbsSwiperSl = `${ blockSl } .${ BOX }-thumbs-swiper`;
	const thumbsGridSl = `${ blockSl } .${ BOX }-thumbs-grid`;
	const thumbSlideSl = `${ blockSl } .${ BOX }-thumb-slide`;
	const thumbSl = `${ blockSl } .${ BOX }-thumb`;

	const thumbHoverSl = `${ thumbSl }:not(.is-active):hover, ${ thumbSl }:not(.is-active):focus-visible`;
	const activeSl = `${ thumbSl }.is-active`;
	const activeHoverSl = `${ activeSl }:hover, ${ activeSl }:focus-visible`;
	const arrowSl = `${ blockSl } .${ BOX }-arrow`;
	const prevSl = `${ arrowSl }--prev`;
	const nextSl = `${ arrowSl }--next`;
	const mainArrowSl = `${ blockSl } .${ BOX }-main-arrow`;
	const dotSl = `${ blockSl } .${ BOX }-dot`;
	const fractionSl = `${ blockSl } .${ BOX }-fraction`;
	const badgeSl = `${ blockSl } .${ BOX }-badge`;

	const position = POSITIONS.includes( layout?.position ) ? layout.position : 'bottom';
	const isVertical = 'left' === position || 'right' === position;
	const isFirst = 'left' === position || 'top' === position;

	const fit = FITS.includes( image?.fit ) ? image.fit : '';
	const justify = { left: 'flex-start', center: 'center', right: 'flex-end' }[ image?.alignment ] || '';


	const navBg = 'gradient' === nav?.bg?.type ? '' : nav?.bg?.color || 'rgba(255, 255, 255, 0.85)';
	const navHoverBg = 'gradient' === nav?.hoverBg?.type ? '' : nav?.hoverBg?.color || '';

	const isGrid = 'grid' === thumbLayout?.view;
	const isCentered = ! isGrid && !! thumbLayout?.centered;
	const ratio = ( RATIOS.includes( thumbLayout?.ratio ) ? thumbLayout.ratio : '1/1' ).replace( '/', ' / ' );
	const opacity = 'number' === typeof thumbs?.opacity ? thumbs.opacity : '';
	const hideOn = Array.isArray( thumbLayout?.hideOn ) ? thumbLayout.hideOn : [];
	const duration = Number.isFinite( thumbs?.transition?.duration ) ? Math.min( 2000, Math.max( 0, thumbs.transition.duration ) ) : 200;
	const easing = EASINGS.includes( thumbs?.transition?.easing ) ? thumbs.transition.easing : 'ease';
	const zoomScale = Number.isFinite( options?.zoomScale ) ? Math.min( 5, Math.max( 1.1, options.zoomScale ) ) : 2;

	const zoomOn = false !== options?.zoom;
	const thumbArrowsOn = ! options?.hideArrows && ! isGrid;
	const mainArrowsOn = !! options?.mainArrows;
	const dotsOn = 'dots' === options?.pagination;
	const fractionOn = 'fraction' === options?.pagination;
	const badgeOn = !! options?.saleBadge;

	const stickyOn = ! isBackend && !! sticky?.enabled;
	const stickyOff = Array.isArray( sticky?.offOn ) ? sticky.offOn : [];

	const larger = { desktop: [ 'desktop' ], tablet: [ 'tablet', 'desktop' ], mobile: [ 'mobile', 'tablet', 'desktop' ] };
	const thumbValue = ( device, get, fallback ) => larger[ device ].map( get ).find( Boolean ) || fallback;


	const thumbStyles = ( device ) => {
		const size = thumbValue( device, ( d ) => thumbLayout?.[ d ]?.size, '90px' );
		const gap = thumbValue( device, ( d ) => layout?.[ d ]?.thumbGap, '10px' );
		const columns = thumbValue( device, ( d ) => parseInt( thumbLayout?.[ d ]?.columns, 10 ), isGrid ? 4 : 0 );

		const share = `calc((100% - ${ isCentered ? columns : columns - 1 } * ${ gap }) / ${ columns })`;
		const spacing = isCentered
			? `${ thumbSlideSl }{ ${ isVertical ? 'margin-block' : 'margin-inline' }: calc(${ gap } / 2); }`
			: `${ thumbSlideSl }:not(:last-child){ ${ isVertical ? 'margin-bottom' : 'margin-inline-end' }: ${ gap }; }`;

		if ( isGrid ) return `
			${ isVertical ? `${ thumbsSl }{ flex: 0 0 calc(${ columns } * ${ size } + ${ columns - 1 } * ${ gap }); width: calc(${ columns } * ${ size } + ${ columns - 1 } * ${ gap }); }` : '' }
			${ thumbsGridSl }{
				grid-template-columns: repeat(${ columns }, minmax(0, 1fr));
				gap: ${ gap };
			}
		`;

		return isVertical ? `
			${ thumbsSl }{ flex: 0 0 ${ size }; width: ${ size }; }
			${ thumbSlideSl }{
				height: ${ columns ? share : 'auto' };
				aspect-ratio: ${ columns ? 'auto' : ratio };
			}
			${ spacing }
		` : `
			${ thumbSlideSl }{
				width: ${ columns ? share : 'auto' };
				height: ${ columns ? 'auto' : size };
			}
			${ spacing }
		`;
	};

	const SIDES = [ 'top', 'right', 'bottom', 'left' ];
	const borderParts = ( border ) => Object.fromEntries( Object.entries( border || {} ).filter( ( [ , value ] ) => undefined !== value && '' !== value ) );
	const borderSides = ( border ) => Object.fromEntries( SIDES.map( ( side ) => [ side, borderParts( SIDES.some( ( s ) => border?.[ s ] ) ? border[ side ] : border ) ] ) );
	const hasBorder = ( border ) => Object.values( borderSides( border ) ).some( isExist );
	const mergeBorder = ( base, border ) => {
		const sides = borderSides( border );
		return Object.fromEntries( SIDES.map( ( side ) => [ side, { ...base[ side ], ...sides[ side ] } ] ) );
	};
	const imageBorder = mergeBorder( borderSides( {} ), image?.normal?.border );
	const imageHoverBorder = mergeBorder( imageBorder, image?.hover?.border );
	const thumbBorder = mergeBorder( borderSides( { width: '2px', style: 'solid', color: 'transparent' } ), thumbs?.normal?.border );
	const thumbHoverBorder = mergeBorder( thumbBorder, thumbs?.hover?.border );
	const activeBorder = mergeBorder( thumbBorder, activeThumbs?.normal?.border );
	const activeHoverBorder = mergeBorder( activeBorder, activeThumbs?.hover?.border );

	const stateStyles = ( state, device, border ) => `
		${ 'desktop' === device ? getBackgroundCSS( state?.bg ) || '' : '' }
		${ 'desktop' === device && hasBorder( state?.border ) ? getBorderBoxCSS( border ) : '' }
		${ isValidCSS( 'border-radius', getBoxCSS( state?.radius?.[ device ] ) ) }
		${ isValidCSS( 'padding', getBoxCSS( state?.padding?.[ device ] ) ) }
		${ 'desktop' === device ? isValidCSS( 'box-shadow', getMultiShadowCSS( state?.shadow ) ) : '' }
	`;


	const deviceStyles = ( device ) => `
		${ blockSl }{
			${ isValidCSS( 'gap', layout?.[ device ]?.columnGap ) }
		}
		${ imageBoxSl }{
			${ image?.adaptiveHeight ? '' : isValidCSS( 'height', image?.[ device ]?.height ) }
			${ isValidCSS( 'margin', getBoxCSS( image?.[ device ]?.margin ) ) }
			${ stateStyles( image?.normal, device, imageBorder ) }
		}
		${ imageBoxSl }:hover{
			${ stateStyles( image?.hover, device, imageHoverBorder ) }
		}
		${ imgSl }{
			${ isValidCSS( 'width', image?.[ device ]?.width ) }
		}
		${ thumbSl }{
			${ stateStyles( thumbs?.normal, device, thumbBorder ) }
		}
		${ thumbHoverSl }{
			${ stateStyles( thumbs?.hover, device, thumbHoverBorder ) }
		}
		${ activeSl }{
			${ stateStyles( activeThumbs?.normal, device, activeBorder ) }
		}
		${ activeHoverSl }{
			${ stateStyles( activeThumbs?.hover, device, activeHoverBorder ) }
		}
		${ thumbArrowsOn ? `
			${ arrowSl } svg{
				${ isValidCSS( 'width', nav?.[ device ]?.iconSize ) }
				${ isValidCSS( 'height', nav?.[ device ]?.iconSize ) }
			}
		` : '' }
		${ mainArrowsOn ? `
			${ mainArrowSl }{
				${ isValidCSS( 'width', mainNav?.[ device ]?.size ) }
				${ isValidCSS( 'height', mainNav?.[ device ]?.size ) }
				${ isValidCSS( 'border-radius', getBoxCSS( mainNav?.[ device ]?.radius ) ) }
			}
			${ mainArrowSl } svg{
				${ isValidCSS( 'width', mainNav?.[ device ]?.iconSize ) }
				${ isValidCSS( 'height', mainNav?.[ device ]?.iconSize ) }
			}
		` : '' }
		${ dotsOn ? `
			${ dotSl }{
				${ isValidCSS( 'width', pagination?.[ device ]?.size ) }
				${ isValidCSS( 'height', pagination?.[ device ]?.size ) }
			}
		` : '' }
		${ badgeOn ? `
			${ badgeSl }{
				${ isValidCSS( 'padding', getBoxCSS( badge?.[ device ]?.padding ) ) }
				${ isValidCSS( 'border-radius', getBoxCSS( badge?.[ device ]?.radius ) ) }
			}
		` : '' }
		${ hideOn.length ? `${ thumbsSl }{ display: ${ hideOn.includes( device ) ? 'none' : 'block' }; }` : '' }
		${ stickyOn ? `${ mainSl }{ ${ stickyOff.includes( device ) ? 'position: static;' : `position: sticky; ${ isValidCSS( 'top', sticky?.[ device ]?.top ) }` } }` : '' }
	`;

	const badgeTypo = badgeOn ? getTypoCSS( badgeSl, badge?.typo ) : {};

	const blockCSS = `
		${ badgeTypo.googleFontLink || '' }
		${ blockSl }{
			flex-direction: ${ isVertical ? 'row' : 'column' };
		}
		${ thumbsSl }{
			order: ${ isFirst ? '-1' : '0' };
			${ isVertical ? '' : 'flex: 0 0 auto; width: 100%;' }
			${ isGrid ? 'align-self: flex-start;' : '' }
		}
		${ isGrid ? `
			${ thumbsGridSl }{ display: grid; }
			${ thumbSlideSl }{ width: auto; height: auto; min-height: 0; aspect-ratio: ${ ratio }; }
		` : `
			${ thumbsSwiperSl }{
				${ isVertical ? 'position: absolute; inset: 0;' : '' }
				overflow: ${ isVertical ? 'visible clip' : 'clip visible' };
			}
			${ thumbSlideSl }{
				${ isVertical ? 'width: 100%;' : `aspect-ratio: ${ ratio };` }
				min-height: 0;
			}
		` }
		${ 200 !== duration || 'ease' !== easing ? `${ thumbSl }{ transition-duration: ${ duration }ms; transition-timing-function: ${ easing }; }` : '' }
		${ 'contain' === thumbLayout?.fit ? `${ thumbSl } img{ object-fit: contain; }` : '' }
		${ '' !== opacity ? `
			${ thumbSl }{ opacity: ${ opacity }; }
			${ thumbSl }:hover, ${ thumbSl }:focus-visible, ${ activeSl }{ opacity: 1; }
		` : '' }

		${ image?.adaptiveHeight ? `
			${ imageBoxSl }, ${ slideSl }, ${ imgSl }{ height: auto; }
			${ swiperSl } .swiper-wrapper{ transition-property: transform, height; }
		` : '' }
		${ imgSl }, ${ zoomImgSl }{
			${ isValidCSS( 'object-fit', fit ) }
		}
		${ slideSl }{
			${ isValidCSS( 'justify-content', justify ) }
			${ SOLID_EFFECTS.includes( options?.effect ) ? getBackgroundCSS( image?.normal?.bg ) || 'background: #f6f7f7;' : '' }
		}
		${ SOLID_EFFECTS.includes( options?.effect ) && getBackgroundCSS( image?.hover?.bg ) ? `
			${ imageBoxSl }:hover .${ BOX }-main-slide{ ${ getBackgroundCSS( image.hover.bg ) } }
		` : '' }
		${ ! isBackend && zoomOn ? `
			@media (hover: hover) and (pointer: fine){
				${ imageBoxSl }{ cursor: zoom-in; }
			}
		` : '' }
		${ ! isBackend && options?.lightbox && ! zoomOn ? `${ imageBoxSl }{ cursor: pointer; }` : '' }
		${ zoomOn && 2 !== zoomScale ? `${ zoomImgSl }{ transform: scale(${ zoomScale }); }` : '' }

		${ mainArrowsOn ? `
			${ mainArrowSl }{
				${ isValidCSS( 'color', mainNav?.color ) }
				${ getBackgroundCSS( mainNav?.bg, true, true, false ) || '' }
			}
			${ mainArrowSl }:hover, ${ mainArrowSl }:focus-visible{
				${ isValidCSS( 'color', mainNav?.hoverColor ) }
				${ getBackgroundCSS( mainNav?.hoverBg, true, true, false ) || '' }
			}
		` : '' }

		${ dotsOn ? `
			${ dotSl }{
				${ isValidCSS( 'background', pagination?.color ) }
			}
			${ dotSl }.is-active, ${ dotSl }:hover{
				${ isValidCSS( 'background', pagination?.activeColor ) }
			}
		` : '' }
		${ fractionOn ? `
			${ fractionSl }{
				${ isValidCSS( 'color', pagination?.textColor ) }
				${ isValidCSS( 'background', pagination?.textBg ) }
			}
		` : '' }

		${ badgeOn ? `
			${ badgeSl }{
				${ isValidCSS( 'color', badge?.color ) }
				${ getBackgroundCSS( badge?.bg, true, true, false ) || '' }
				${ isExist( badge?.border ) ? getBorderBoxCSS( badge.border ) : '' }
			}
			${ badgeTypo.styles }
			${ options?.lightbox ? `${ badgeSl }--top-right{ inset-inline-end: 60px; }` : '' }
		` : '' }

		${ thumbArrowsOn ? `
		${ arrowSl }{
			${ isVertical ? 'left: 0; right: 0; height: 36px;' : 'top: 0; bottom: 0; width: 36px;' }
			${ isValidCSS( 'color', nav?.color ) }
		}
		${ arrowSl }:hover, ${ arrowSl }:focus-visible{
			${ isValidCSS( 'color', nav?.hoverColor ) }
		}

		${ isVertical ? `
			${ prevSl }{
				top: 0;
				${ navBg ? `background: linear-gradient(to bottom, ${ navBg } 45%, transparent);` : '' }
			}
			${ nextSl }{
				bottom: 0;
				${ navBg ? `background: linear-gradient(to top, ${ navBg } 45%, transparent);` : '' }
			}
			${ navHoverBg ? `
				${ prevSl }:hover, ${ prevSl }:focus-visible{
					background: linear-gradient(to bottom, ${ navHoverBg } 45%, transparent);
				}
				${ nextSl }:hover, ${ nextSl }:focus-visible{
					background: linear-gradient(to top, ${ navHoverBg } 45%, transparent);
				}
			` : '' }
		` : `
			${ prevSl }{
				inset-inline-start: 0;
				${ navBg ? `background: linear-gradient(to right, ${ navBg } 45%, transparent);` : '' }
			}
			${ nextSl }{
				inset-inline-end: 0;
				${ navBg ? `background: linear-gradient(to left, ${ navBg } 45%, transparent);` : '' }
			}
			${ navBg ? `
				[dir="rtl"] ${ prevSl }{
					background: linear-gradient(to left, ${ navBg } 45%, transparent);
				}
				[dir="rtl"] ${ nextSl }{
					background: linear-gradient(to right, ${ navBg } 45%, transparent);
				}
			` : '' }
			${ navHoverBg ? `
				${ prevSl }:hover, ${ prevSl }:focus-visible{
					background: linear-gradient(to right, ${ navHoverBg } 45%, transparent);
				}
				${ nextSl }:hover, ${ nextSl }:focus-visible{
					background: linear-gradient(to left, ${ navHoverBg } 45%, transparent);
				}
				[dir="rtl"] ${ prevSl }:hover, [dir="rtl"] ${ prevSl }:focus-visible{
					background: linear-gradient(to left, ${ navHoverBg } 45%, transparent);
				}
				[dir="rtl"] ${ nextSl }:hover, [dir="rtl"] ${ nextSl }:focus-visible{
					background: linear-gradient(to right, ${ navHoverBg } 45%, transparent);
				}
			` : '' }
		` }
		${ 'gradient' === nav?.bg?.type ? `
			${ arrowSl }{ ${ getBackgroundCSS( nav.bg, false, true, false ) } }
		` : '' }
		${ 'gradient' === nav?.hoverBg?.type ? `
			${ arrowSl }:hover, ${ arrowSl }:focus-visible, [dir="rtl"] ${ arrowSl }:hover, [dir="rtl"] ${ arrowSl }:focus-visible{
				${ getBackgroundCSS( nav.hoverBg, false, true, false ) }
			}
		` : '' }
		` : '' }

		${ deviceStyles( 'desktop' ) }
		${ thumbStyles( 'desktop' ) }
		${ tabBreakpoint }{
			${ deviceStyles( 'tablet' ) }
			${ thumbStyles( 'tablet' ) }
		}
		${ mobileBreakpoint }{
			${ deviceStyles( 'mobile' ) }
			${ thumbStyles( 'mobile' ) }
		}
	`.replace( /\s+/g, ' ' ).replace( /[^{};]+\{\s*\}/g, '' ).replace( /[^{};]+\{\s*\}/g, '' );

	return `${ blockCSS } ${ generateCSS( id, advanced, isBackend ) }`;
};

export default style;