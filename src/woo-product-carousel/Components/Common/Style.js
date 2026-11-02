import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';

import { BOX, CENTERED_PRESETS, CONTENT_SPACE_PRESETS, DOT_PRESETS, FEATURED_PRESETS, HOVER_PRESETS, slidesFallback } from '../../utils/data';

const FLEX = { left: 'flex-start', center: 'center', right: 'flex-end' };
const FITS = [ 'cover', 'contain', 'fill', 'scale-down', 'none' ];

const safeCSS = ( css ) => {
	let out = String( css ).replace( /</g, '' );

	for ( let pass = 0; pass < 3; pass++ ) {
		const next = out.replace( /[^{}]*\{\s*\}/g, '' );
		if ( next === out ) break;
		out = next;
	}

	return out.replace( /\s+/g, ' ' ).trim();
};

const rule = ( selector, body ) => ( body.trim() ? `${ selector }{ ${ body } }` : '' );
const atMedia = ( query, body ) => ( body.trim() ? `${ query }{ ${ body } }` : '' );

const Style = ( { attributes, id, isBackend = false } ) => {
	const {
		card: cardStyle = {}, content = {}, category = {}, image = {}, title = {}, price = {}, rating = {}, button = {}, viewButton = {},
		badge = {}, arrow = {}, dot = {}, options = {}, heading = {}, featured = {}, pause = {}, preset, advanced
	} = attributes;

	const el = ( part ) => `#${ id } .${ BOX }${ part ? `-${ part }` : '' }`;
	const root = el();
	const card = el( 'card' );
	const hover = ( part ) => `${ card }:hover ${ part ? `.${ BOX }-${ part }` : '' }, ${ card }:focus-within ${ part ? `.${ BOX }-${ part }` : '' }`;

	const fit = FITS.includes( image.fit ) ? image.fit : 'cover';
	const dotPreset = DOT_PRESETS.includes( options.dotPreset ) ? options.dotPreset : 'style-1';
	const centered = CENTERED_PRESETS.includes( preset );
	const featuredPreset = FEATURED_PRESETS.includes( preset );

	const dotCSS = ( size ) => {
		if ( ! size ) return '';

		const dotSl = el( 'dot' );
		switch ( dotPreset ) {
			case 'style-2':
				return `${ dotSl }{ width: ${ size }; height: ${ size }; border-radius: ${ size }; } ${ el( 'dot--active' ) }{ width: calc(${ size } * 2.5); }`;
			case 'style-3':
				return `${ dotSl }{ width: calc(${ size } * 2); height: max(3px, calc(${ size } / 4)); }`;
			default:
				return `${ dotSl }{ width: ${ size }; height: ${ size }; }`;
		}
	};

	const alignCSS = ( value ) => ( FLEX[ value ] ? isValidCSS( 'text-align', { left: 'start', center: 'center', right: 'end' }[ value ] ) : '' );

	const deviceCSS = ( device ) => {
		const align = content[ device ]?.align;
		const imageHeight = image.autoHeight ? '' : image[ device ]?.height;

		const larger = ( group, prop ) => group[ device ]?.[ prop ] || ( 'mobile' === device ? group.tablet?.[ prop ] : '' ) || group.desktop?.[ prop ];

		const insidePosition = 'desktop' !== device && larger( arrow, 'position' );
		const position = featuredPreset && 'desktop' !== device ? '' : ( insidePosition ? `max(8px, ${ insidePosition })` : arrow[ device ]?.position );

		const slides = Math.min( 6, Math.max( 1, parseInt( options[ device ]?.slides, 10 ) || slidesFallback[ device ] ) );
		const gap = larger( content, 'gap' ) || '0px';

		return [

			centered
				? `${ rule( `${ root } .swiper-slide`, isValidCSS( 'width', larger( image, 'width' ) ) ) } ${ rule( `${ root } .swiper:not(.swiper-initialized) .swiper-slide`, `margin-inline-end: ${ gap };` ) }`
				: rule( `${ root } .swiper:not(.swiper-initialized) .swiper-slide`, `
					width: calc((100% - ${ slides - 1 } * ${ gap }) / ${ slides });
					margin-inline-end: ${ gap };
				` ),
			featuredPreset ? '' : rule( el( 'arrow' ), `${ isValidCSS( 'width', arrow[ device ]?.bgSize ) } ${ isValidCSS( 'height', arrow[ device ]?.bgSize ) }` ),
			rule( `${ el( 'arrow' ) } svg`, `${ isValidCSS( 'width', arrow[ device ]?.size ) } ${ isValidCSS( 'height', arrow[ device ]?.size ) }` ),
			rule( el( 'arrow--prev' ), isValidCSS( 'inset-inline-start', position ) ),
			rule( el( 'arrow--next' ), isValidCSS( 'inset-inline-end', position ) ),
			rule( el( 'dots' ), isValidCSS( 'gap', dot[ device ]?.gap ) ),

			rule( el( 'controls' ), isValidCSS( 'margin-top', featuredPreset ? `calc(${ larger( dot, 'space' ) || '20px' } - ${ larger( featured, 'gap' ) || '30px' })` : dot[ device ]?.space ) ),
			dotCSS( dot[ device ]?.size ),
			rule( el( 'star' ), `${ isValidCSS( 'width', rating[ device ]?.size ) } ${ isValidCSS( 'height', rating[ device ]?.size ) }` ),

			rule( card, `${ isValidCSS( 'padding', getBoxCSS( cardStyle[ device ]?.padding ) ) } ${ isValidCSS( 'margin', getBoxCSS( cardStyle[ device ]?.margin ) ) } ${ 'desktop' === device ? ( [ cardStyle.normal?.border, cardStyle.normal?.border?.top, cardStyle.normal?.border?.right, cardStyle.normal?.border?.bottom, cardStyle.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( cardStyle.normal?.border ) : '' ) : '' } ${ isValidCSS( 'border-radius', getBoxCSS( cardStyle.normal?.[ device ]?.radius ) ) } ${ 'desktop' === device ? isValidCSS( 'box-shadow', cardStyle.normal?.shadow?.length ? getMultiShadowCSS( cardStyle.normal?.shadow ) : '' ) : '' }` ),
			rule( hover(), `${ 'desktop' === device ? ( [ cardStyle.hover?.border, cardStyle.hover?.border?.top, cardStyle.hover?.border?.right, cardStyle.hover?.border?.bottom, cardStyle.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( cardStyle.hover?.border ) : '' ) : '' } ${ isValidCSS( 'border-radius', getBoxCSS( cardStyle.hover?.[ device ]?.radius ) ) } ${ 'desktop' === device ? isValidCSS( 'box-shadow', cardStyle.hover?.shadow?.length ? getMultiShadowCSS( cardStyle.hover?.shadow ) : '' ) : '' }` ),
			rule( el( 'content' ), `${ isValidCSS( 'padding', getBoxCSS( content[ device ]?.padding ) ) } ${ alignCSS( align ) }` ),
			CONTENT_SPACE_PRESETS.includes( preset ) ? rule( el( 'content' ), isValidCSS( 'margin-top', content[ device ]?.space ) ) : '',
			rule( `${ el( 'rating' ) }, ${ el( 'footer' ) }`, isValidCSS( 'justify-content', FLEX[ align ] ) ),
			rule( el( 'category' ), isValidCSS( 'padding', getBoxCSS( category[ device ]?.padding ) ) ),

			rule( el( 'media' ), `${ isValidCSS( 'padding', getBoxCSS( image[ device ]?.padding ) ) } ${ isValidCSS( 'min-height', imageHeight ) }` ),

			rule( el( 'image' ), centered ? '' : isValidCSS( 'width', image[ device ]?.width ) ),
			rule( el( 'title' ), isValidCSS( 'margin', getBoxCSS( title[ device ]?.margin ) ) ),
			rule( el( 'price' ), isValidCSS( 'margin', getBoxCSS( price[ device ]?.margin ) ) ),
			rule( el( 'rating' ), isValidCSS( 'margin', getBoxCSS( rating[ device ]?.margin ) ) ),

			rule( `${ el( 'button' ) }.${ BOX }-cart-button`, `${ isValidCSS( 'padding', getBoxCSS( button[ device ]?.padding ) ) } ${ isValidCSS( 'margin', getBoxCSS( button[ device ]?.margin ) ) }` ),
			rule( `${ el( 'button' ) }.${ BOX }-cart-button .${ BOX }-icon`, `${ isValidCSS( 'width', button[ device ]?.iconSize ) } ${ isValidCSS( 'height', button[ device ]?.iconSize ) }` ),
			rule( `${ el( 'button' ) }.${ BOX }-view-button`, `${ isValidCSS( 'padding', getBoxCSS( viewButton[ device ]?.padding ) ) } ${ isValidCSS( 'margin', getBoxCSS( viewButton[ device ]?.margin ) ) }` ),
			rule( `${ el( 'button' ) }.${ BOX }-view-button .${ BOX }-icon`, `${ isValidCSS( 'width', viewButton[ device ]?.iconSize ) } ${ isValidCSS( 'height', viewButton[ device ]?.iconSize ) }` ),
			rule( el( 'badge' ), isValidCSS( 'border-radius', getBoxCSS( badge[ device ]?.radius ) ) ),

			featuredPreset ? rule( root, `${ isValidCSS( '--b-blocks-wpc-featured-width', featured[ device ]?.width ) } ${ isValidCSS( 'gap', featured[ device ]?.gap ) }` ) : '',
			rule( el( 'featured-card' ), `${ isValidCSS( 'height', featured[ device ]?.height ) } ${ isValidCSS( 'border-radius', getBoxCSS( featured[ device ]?.radius ) ) }` ),
			rule( el( 'featured-content' ), isValidCSS( 'padding', getBoxCSS( featured[ device ]?.padding ) ) ),
			rule( el( 'featured-button' ), `${ isValidCSS( 'padding', getBoxCSS( featured.button?.normal?.[ device ]?.padding ) ) } ${ isValidCSS( 'border-radius', getBoxCSS( featured.button?.normal?.[ device ]?.radius ) ) }` ),
			rule( `${ el( 'featured-button' ) }:hover, ${ el( 'featured-button' ) }:focus-visible`, `${ isValidCSS( 'padding', getBoxCSS( featured.button?.hover?.[ device ]?.padding ) ) } ${ isValidCSS( 'border-radius', getBoxCSS( featured.button?.hover?.[ device ]?.radius ) ) }` )
		].join( '\n' );
	};

	const sideScale = parseFloat( options.sideScale );
	const sideCSS = centered ? rule( `${ root } .swiper-slide:not(.swiper-slide-active) .${ BOX }-media`, `
		${ isValidCSS( 'transform', Number.isFinite( sideScale ) ? `scale(${ sideScale / 100 })` : '' ) }
		${ isValidCSS( 'filter', options.sideBlur ? `blur(${ options.sideBlur })` : '' ) }
	` ) : '';

	const fonts = [ ...new Set( [ category.typo, title.typo, price.typo, button.typo, viewButton.typo, badge.typo, heading.typo, featured.titleTypo, featured.priceTypo, featured.buttonTypo ].map( ( typo ) => getTypoCSS( '', typo )?.googleFontLink ) ) ].join( '\n' );

	return <style dangerouslySetInnerHTML={ { __html: safeCSS( `
		${ fonts }

		${ el( 'arrow' ) }{ ${ isValidCSS( 'color', arrow.normal?.color?.icon ) } ${ featuredPreset ? '' : getBackgroundCSS( arrow.normal?.color?.bg, true, true, false ) } }
		${ rule( `${ el( 'arrow' ) }:hover, ${ el( 'arrow' ) }:focus-visible`, `${ isValidCSS( 'color', arrow.hover?.color?.icon ) } ${ featuredPreset ? '' : getBackgroundCSS( arrow.hover?.color?.bg, true, true, false ) }` ) }
		${ rule( `${ el( 'arrow' ) }:focus-visible`, isValidCSS( 'outline-color', ! featuredPreset && 'solid' === arrow.hover?.color?.bg?.type ? arrow.hover.color.bg.color : '' ) ) }

		${ el( 'dot' ) }{ ${ isValidCSS( 'background', dot.normal?.color?.bg ) } }
		${ rule( el( 'dot--active' ), isValidCSS( 'background', dot.active?.color?.bg ) ) }
		${ rule( `${ el( 'dot' ) }:focus-visible`, isValidCSS( 'outline-color', dot.active?.color?.bg ) ) }

		${ rule( el( 'star-fill' ), isValidCSS( 'color', rating.iconColor ) ) }

		${ rule( `${ el( 'media' ) }::after`, getBackgroundCSS( image.hover?.color?.overlay, true, true, false ) ) }

		${ rule( card, getBackgroundCSS( cardStyle.normal?.color?.bg ) || '' ) }

		${ el( 'content' ) }{ ${ getBackgroundCSS( content.normal?.color?.bg, true, true, false ) } ${ ( [ content.normal?.border, content.normal?.border?.top, content.normal?.border?.right, content.normal?.border?.bottom, content.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( content.normal?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( content.normal?.radius ) ) } ${ isValidCSS( 'box-shadow', content.normal?.shadow?.length ? getMultiShadowCSS( content.normal?.shadow ) : '' ) } }
		${ rule( hover( 'content' ), `${ ( [ content.hover?.border, content.hover?.border?.top, content.hover?.border?.right, content.hover?.border?.bottom, content.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( content.hover?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( content.hover?.radius ) ) } ${ isValidCSS( 'box-shadow', content.hover?.shadow?.length ? getMultiShadowCSS( content.hover?.shadow ) : '' ) }` ) }

		${ el( 'media' ) }{ ${ getBackgroundCSS( image.normal?.color?.bg, true, true, false ) } ${ ( [ image.normal?.border, image.normal?.border?.top, image.normal?.border?.right, image.normal?.border?.bottom, image.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( image.normal?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( image.normal?.radius ) ) } ${ isValidCSS( 'box-shadow', image.normal?.shadow?.length ? getMultiShadowCSS( image.normal?.shadow ) : '' ) } }
		${ rule( hover( 'media' ), `${ ( [ image.hover?.border, image.hover?.border?.top, image.hover?.border?.right, image.hover?.border?.bottom, image.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( image.hover?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( image.hover?.radius ) ) } ${ isValidCSS( 'box-shadow', image.hover?.shadow?.length ? getMultiShadowCSS( image.hover?.shadow ) : '' ) }` ) }
		${ el( 'image' ) }{ ${ isValidCSS( 'object-fit', fit ) } }

		${ el( 'category' ) }, ${ el( 'category' ) } a{ ${ isValidCSS( 'color', category.normal?.color?.text ) } }
		${ rule( `${ el( 'category' ) } a:hover, ${ el( 'category' ) } a:focus-visible`, isValidCSS( 'color', category.hover?.color?.text ) ) }
		${ getTypoCSS( el( 'category' ), category.typo )?.styles }

		${ el( 'title' ) }, ${ el( 'title-link' ) }{ ${ isValidCSS( 'color', title.normal?.color?.text ) } }
		${ rule( `${ el( 'title-link' ) }:hover, ${ el( 'title-link' ) }:focus-visible`, isValidCSS( 'color', title.hover?.color?.text ) ) }
		${ getTypoCSS( el( 'title' ), title.typo )?.styles }

		${ el( 'price' ) }, ${ el( 'price' ) } del{ ${ isValidCSS( 'color', price.textColor ) } }
		${ rule( `${ el( 'price' ) } ins`, isValidCSS( 'color', price.saleColor ) ) }
		${ getTypoCSS( el( 'price' ), price.typo )?.styles }

		${ el( 'button' ) }.${ BOX }-cart-button{
			${ isValidCSS( 'color', button.normal?.color?.text ) }
			${ getBackgroundCSS( button.normal?.color?.bg, true, true, false ) }
			${ ( [ button.normal?.border, button.normal?.border?.top, button.normal?.border?.right, button.normal?.border?.bottom, button.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( button.normal?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( button.normal?.radius ) ) } ${ isValidCSS( 'box-shadow', button.normal?.shadow?.length ? getMultiShadowCSS( button.normal?.shadow ) : '' ) }
		}
		${ rule( `${ el( 'button' ) }.${ BOX }-cart-button:hover, ${ el( 'button' ) }.${ BOX }-cart-button:focus-visible`, `
			${ isValidCSS( 'color', button.hover?.color?.text ) }
			${ getBackgroundCSS( button.hover?.color?.bg, true, true, false ) }
			${ ( [ button.hover?.border, button.hover?.border?.top, button.hover?.border?.right, button.hover?.border?.bottom, button.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( button.hover?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( button.hover?.radius ) ) } ${ isValidCSS( 'box-shadow', button.hover?.shadow?.length ? getMultiShadowCSS( button.hover?.shadow ) : '' ) }
		` ) }
		${ getTypoCSS( `${ el( 'button' ) }.${ BOX }-cart-button`, button.typo )?.styles }

		${ el( 'button' ) }.${ BOX }-view-button{
			${ isValidCSS( 'color', viewButton.normal?.color?.text ) }
			${ getBackgroundCSS( viewButton.normal?.color?.bg, true, true, false ) }
			${ ( [ viewButton.normal?.border, viewButton.normal?.border?.top, viewButton.normal?.border?.right, viewButton.normal?.border?.bottom, viewButton.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( viewButton.normal?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( viewButton.normal?.radius ) ) } ${ isValidCSS( 'box-shadow', viewButton.normal?.shadow?.length ? getMultiShadowCSS( viewButton.normal?.shadow ) : '' ) }
		}
		${ rule( `${ el( 'button' ) }.${ BOX }-view-button:hover, ${ el( 'button' ) }.${ BOX }-view-button:focus-visible`, `
			${ isValidCSS( 'color', viewButton.hover?.color?.text ) }
			${ getBackgroundCSS( viewButton.hover?.color?.bg, true, true, false ) }
			${ ( [ viewButton.hover?.border, viewButton.hover?.border?.top, viewButton.hover?.border?.right, viewButton.hover?.border?.bottom, viewButton.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( viewButton.hover?.border ) : '' ) } ${ isValidCSS( 'border-radius', getBoxCSS( viewButton.hover?.radius ) ) } ${ isValidCSS( 'box-shadow', viewButton.hover?.shadow?.length ? getMultiShadowCSS( viewButton.hover?.shadow ) : '' ) }
		` ) }
		${ getTypoCSS( `${ el( 'button' ) }.${ BOX }-view-button`, viewButton.typo )?.styles }

		${ el( 'badge' ) }{
			${ isValidCSS( 'color', badge.textColor ) }
			${ getBackgroundCSS( badge.bgColor, true, true, false ) }
			${ ( [ badge.border, badge.border?.top, badge.border?.right, badge.border?.bottom, badge.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( badge.border ) : '' ) }
		}
		${ getTypoCSS( el( 'badge' ), badge.typo )?.styles }

		${ rule( el( 'heading' ), isValidCSS( 'color', heading.textColor ) ) }
		${ getTypoCSS( el( 'heading' ), heading.typo )?.styles }

		${ rule( `${ el( 'featured-image-link' ) }::before`, getBackgroundCSS( featured.overlay, true, true, false ) ) }
		${ rule( `${ el( 'featured-category' ) }, ${ el( 'featured-category' ) } a, ${ el( 'featured-title' ) }, ${ el( 'featured-title' ) } a, ${ el( 'featured-price' ) }, ${ el( 'featured-price' ) } del, ${ el( 'featured-price' ) } ins`, isValidCSS( 'color', featured.textColor ) ) }
		${ getTypoCSS( el( 'featured-title' ), featured.titleTypo )?.styles }
		${ getTypoCSS( el( 'featured-price' ), featured.priceTypo )?.styles }
		${ getTypoCSS( el( 'featured-button' ), featured.buttonTypo )?.styles }
		${ rule( el( 'featured-button' ), `${ isValidCSS( 'color', featured.button?.normal?.color?.text ) } ${ getBackgroundCSS( featured.button?.normal?.color?.bg, true, true, false ) } ${ [ featured.button?.normal?.border, featured.button?.normal?.border?.top, featured.button?.normal?.border?.right, featured.button?.normal?.border?.bottom, featured.button?.normal?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( featured.button?.normal?.border ) : '' }` ) }
		${ rule( `${ el( 'featured-button' ) }:hover, ${ el( 'featured-button' ) }:focus-visible`, `${ isValidCSS( 'color', featured.button?.hover?.color?.text ) } ${ getBackgroundCSS( featured.button?.hover?.color?.bg, true, true, false ) } ${ [ featured.button?.hover?.border, featured.button?.hover?.border?.top, featured.button?.hover?.border?.right, featured.button?.hover?.border?.bottom, featured.button?.hover?.border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( featured.button?.hover?.border ) : '' } ${ featured.button?.hover?.color?.text || featured.button?.hover?.color?.bg?.color || featured.button?.hover?.color?.bg?.gradient ? 'opacity: 1;' : '' }` ) }
		${ sideCSS }

		${ HOVER_PRESETS.includes( preset ) ? rule( `${ el( 'button' ) } + .${ BOX }-button`, isValidCSS( 'border-inline-start-color', button.dividerColor ) ) : '' }

		${ rule( el( 'pause' ), `${ isValidCSS( 'color', pause.normal?.color?.icon ) } ${ isValidCSS( 'background', pause.normal?.color?.bg ) } ${ isValidCSS( 'border-color', pause.normal?.color?.border ) }` ) }
		${ rule( `${ el( 'pause' ) }:hover, ${ el( 'pause' ) }:focus-visible`, `${ isValidCSS( 'color', pause.hover?.color?.icon ) } ${ isValidCSS( 'background', pause.hover?.color?.bg ) } ${ isValidCSS( 'border-color', pause.hover?.color?.border ) }` ) }

		${ deviceCSS( 'desktop' ) }
		${ atMedia( tabBreakpoint, deviceCSS( 'tablet' ) ) }
		${ atMedia( mobileBreakpoint, deviceCSS( 'mobile' ) ) }

		${ generateCSS( id, advanced, isBackend ) }
	` ) } } />;
};

export default Style;