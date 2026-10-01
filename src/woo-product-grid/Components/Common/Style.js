import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';

import { wrapperClass } from '../../utils/data';
import { at, perDevice } from '../../utils/functions';

const FLEX = { left: 'flex-start', center: 'center', right: 'flex-end' };

const STAR_EMPTY = '#d1d5db';

const obj = ( value ) => ( value && 'object' === typeof value && ! Array.isArray( value ) ? value : {} );
const arr = ( value ) => ( Array.isArray( value ) ? value : [] );

const safeCSS = ( css ) => {
	let out = String( css ).replace( /</g, '' );

	for ( let pass = 0; pass < 3; pass++ ) {
		const next = out.replace( /[^{}]*\{\s*\}/g, '' );
		if ( next === out ) break;
		out = next;
	}

	return out;
};

const Style = ( { attributes, id, advancedCSS = '' } ) => {
	const source = obj( attributes );

	const layout = obj( source.layout );
	const card = obj( source.card );
	const media = obj( source.media );
	const title = obj( source.title );
	const price = obj( source.price );
	const rating = obj( source.rating );
	const category = obj( source.category );
	const sold = obj( source.sold );
	const cart = obj( source.cart );
	const viewButton = obj( source.viewButton );
	const badge = obj( source.badge );
	const filter = obj( source.filter );
	const pager = obj( source.pager );

	const columnGap = perDevice( layout, 'columnGap' );
	const rowGap = perDevice( layout, 'rowGap' );
	const columns = perDevice( layout, 'columns' );
	const contentAlign = perDevice( layout, 'contentAlign' );
	const progress = obj( sold.progress );
	const cardNormal = obj( card.normal );
	const cardHover = obj( card.hover );
	const cardNormalPadding = perDevice( cardNormal, 'padding' );
	const cardNormalRadius = perDevice( cardNormal, 'radius' );
	const cardHoverPadding = perDevice( cardHover, 'padding' );
	const cardHoverRadius = perDevice( cardHover, 'radius' );
	const cardBodyMargin = perDevice( card, 'bodyMargin' );
	const mediaRadius = perDevice( media, 'radius' );
	const mediaMargin = perDevice( media, 'margin' );
	const badgeRadius = perDevice( badge, 'radius' );
	const badgePadding = perDevice( badge, 'padding' );
	const progressRadius = perDevice( progress, 'radius' );

	const el = ( part ) => `#${ id } .${ wrapperClass }${ part ? `-${ part }` : '' }`;

	const gridSl = el( 'grid' );
	const cardSl = el( 'card' );
	const bodySl = el( 'card-body' );

	const cardHoverSl = `${ cardSl }:hover, ${ cardSl }:focus-within`;
	const bodyClass = `.${ wrapperClass }-card-body`;
	const bodyHoverSl = `${ cardSl }:hover ${ bodyClass }, ${ cardSl }:focus-within ${ bodyClass }`;
	const mediaSl = el( 'media' );
	const titleSl = el( 'title' );
	const priceSl = el( 'price' );
	const starSl = el( 'star' );
	const categorySl = el( 'category' );
	const soldSl = el( 'sold-text' );
	const progressSl = el( 'progress' );
	const atcSl = el( 'atc-btn' );
	const filterSl = el( 'filter-btn' );
	const pagerBtnSl = `${ el( 'load-more' ) }, ${ el( 'page-btn' ) }`;
	const viewSl = `${ el( 'view-btn' ) }, #${ id } .${ wrapperClass } .added_to_cart`;
	const cartIconSl = `${ atcSl } .${ wrapperClass }-icon`;
	const viewIconSl = `${ el( 'view-btn' ) } .${ wrapperClass }-icon`;
	const ratingMetaSl = `${ el( 'rating-count' ) }, ${ el( 'rating-value' ) }`;

	const alignCSS = ( value ) => ( FLEX[ value ]
		? `${ isValidCSS( 'align-items', FLEX[ value ] ) } ${ isValidCSS( 'text-align', value ) }`
		: '' );

	const starEmpty = rating.emptyColor || STAR_EMPTY;

	const badgeOffset = perDevice( badge, 'offset' );
	const badgeOffsetCSS = ( breakpoint ) => {
		const value = badgeOffset[ breakpoint ];

		return `${ isValidCSS( 'top', value ) } ${
			'top' === badge.align ? '' : isValidCSS( 'left' === badge.align ? 'left' : 'right', value )
		}`;
	};

	const starSize = Number.isFinite( rating.size ) ? `${ rating.size }px` : '';
	const barHeight = Number.isFinite( progress.height ) ? `${ progress.height }px` : '';

	const focusColor = pager.normal?.bg?.color || '#146EF5';

	const paddingCSS = ( box ) => isValidCSS( 'padding', getBoxCSS( box ) );
	const marginCSS = ( box ) => isValidCSS( 'margin', getBoxCSS( box ) );

	const transitionCSS = ( selector, seconds ) => (
		Number.isFinite( seconds ) && seconds > 0
			? `@media (prefers-reduced-motion: no-preference){ ${ selector }{ transition: all ${ seconds }s ease; } }`
			: ''
	);
	const radiusCSS = ( box ) => isValidCSS( 'border-radius', getBoxCSS( box ) );

	const sideSet = ( side ) => !! ( obj( side ).width || obj( side ).color );
	const borderCSS = ( value ) => {
		const b = obj( value );
		const set = sideSet( b ) || [ 'top', 'right', 'bottom', 'left' ].some( ( s ) => sideSet( b[ s ] ) );

		return set ? getBorderBoxCSS( b ) : '';
	};

	const isList = 'list' === layout.type;
	const columnsCSS = ( count, fallback ) => ( isList ? '' :
		isValidCSS( 'grid-template-columns', `repeat(${ count ?? fallback }, minmax(0, 1fr))` ) );

	const bodyMarginCSS = ( box, breakpoint ) => marginCSS( isList && 'mobile' !== breakpoint && box && 'object' === typeof box
		? Object.fromEntries( Object.entries( box ).map( ( [ side, value ] ) => [
			side,
			[ 'top', 'bottom' ].includes( side ) && /^\s*-/.test( String( value ?? '' ) ) ? '0px' : value
		] ) )
		: box );

	const variants = ( selector, suffixes ) => selector.split( ', ' )
		.flatMap( ( s ) => suffixes.map( ( suffix ) => `${ s }${ suffix }` ) ).join( ', ' );

	const rule = ( selector, body ) => ( body.trim() ? `${ selector }{ ${ body } }` : '' );
	const atMedia = ( query, body ) => ( body.trim() ? `${ query }{ ${ body } }` : '' );

	const stateBox = ( state, breakpoint ) => `
		${ paddingCSS( at( state, breakpoint, 'padding' ) ) }
		${ marginCSS( at( state, breakpoint, 'margin' ) ) }
		${ radiusCSS( at( state, breakpoint, 'radius' ) ) }
	`;

	const stateButton = ( selector, group ) => {
		const hasActive = !! group.active;

		const states = [
			[ obj( group.normal ), selector ],
			[ obj( group.hover ), variants( selector, hasActive ? [ ':hover', ':focus-visible' ] : [ ':hover', ':focus-visible', '.is-active' ] ) ],
			...( hasActive ? [ [ obj( group.active ), variants( selector, [ '.is-active' ] ) ] ] : [] ),
		];

		const breakpoint = ( name ) => states
			.map( ( [ state, target ] ) => rule( target, stateBox( state, name ) ) ).join( '\n' );

		return `
			${ states.map( ( [ state, target ] ) => rule( target, `
				${ isValidCSS( 'color', state.color ) }
				${ getBackgroundCSS( state.bg ) }
				${ borderCSS( state.border ) }
				${ stateBox( state, 'desktop' ) }
			` ) ).join( '\n' ) }
			${ getTypoCSS( selector, group.typo )?.styles }
			${ transitionCSS( selector, group.transition ) }
			${ atMedia( tabBreakpoint, breakpoint( 'tablet' ) ) }
			${ atMedia( mobileBreakpoint, breakpoint( 'mobile' ) ) }
		`;
	};

	return <style dangerouslySetInnerHTML={ { __html: safeCSS( `
		${ getTypoCSS( '', title.typo )?.googleFontLink }
		${ getTypoCSS( '', price.typo )?.googleFontLink }
		${ getTypoCSS( '', category.typo )?.googleFontLink }
		${ getTypoCSS( '', sold.typo )?.googleFontLink }
		${ getTypoCSS( '', cart.typo )?.googleFontLink }
		${ getTypoCSS( '', viewButton.typo )?.googleFontLink }
		${ getTypoCSS( '', filter.typo )?.googleFontLink }
		${ getTypoCSS( '', pager.typo )?.googleFontLink }
		${ getTypoCSS( '', badge.typo )?.googleFontLink }

		${ gridSl }{
			${ columnsCSS( columns.desktop, 4 ) }
			${ isValidCSS( 'column-gap', columnGap.desktop ) }
			${ isValidCSS( 'row-gap', rowGap.desktop ) }
		}
		${ tabBreakpoint }{
			${ gridSl }{ ${ columnsCSS( columns.tablet, 2 ) } ${ isValidCSS( 'column-gap', columnGap.tablet ) } ${ isValidCSS( 'row-gap', rowGap.tablet ) } }
		}
		${ mobileBreakpoint }{
			${ gridSl }{ ${ columnsCSS( columns.mobile, 1 ) } ${ isValidCSS( 'column-gap', columnGap.mobile ) } ${ isValidCSS( 'row-gap', rowGap.mobile ) } }
		}

		${ rule( cardSl, `
			${ getBackgroundCSS( cardNormal.bg ) }
			${ borderCSS( cardNormal.border ) }
			${ radiusCSS( cardNormalRadius.desktop ) }
			${ isValidCSS( 'box-shadow', getMultiShadowCSS( arr( cardNormal.shadow ) ) || 'none' ) }
		` ) }
		${ transitionCSS( cardSl, card.transition ) }
		${ rule( cardHoverSl, `
			${ getBackgroundCSS( cardHover.bg ) }
			${ borderCSS( cardHover.border ) }
			${ radiusCSS( cardHoverRadius.desktop ) }
			${ isValidCSS( 'box-shadow', getMultiShadowCSS( arr( cardHover.shadow ) ) ) }
		` ) }
		${ rule( bodySl, `${ getBackgroundCSS( card.bodyBg ) } ${ paddingCSS( cardNormalPadding.desktop ) } ${ bodyMarginCSS( cardBodyMargin.desktop, 'desktop' ) } ${ alignCSS( contentAlign.desktop ) }` ) }
		${ rule( bodyHoverSl, paddingCSS( cardHoverPadding.desktop ) ) }
		${ atMedia( tabBreakpoint, `
			${ rule( cardSl, radiusCSS( cardNormalRadius.tablet ) ) }
			${ rule( cardHoverSl, radiusCSS( cardHoverRadius.tablet ) ) }
			${ rule( bodySl, `${ paddingCSS( cardNormalPadding.tablet ) } ${ bodyMarginCSS( cardBodyMargin.tablet, 'tablet' ) } ${ alignCSS( contentAlign.tablet ) }` ) }
			${ rule( bodyHoverSl, paddingCSS( cardHoverPadding.tablet ) ) }
		` ) }
		${ atMedia( mobileBreakpoint, `
			${ rule( cardSl, radiusCSS( cardNormalRadius.mobile ) ) }
			${ rule( cardHoverSl, radiusCSS( cardHoverRadius.mobile ) ) }
			${ rule( bodySl, `${ paddingCSS( cardNormalPadding.mobile ) } ${ bodyMarginCSS( cardBodyMargin.mobile, 'mobile' ) } ${ alignCSS( contentAlign.mobile ) }` ) }
			${ rule( bodyHoverSl, paddingCSS( cardHoverPadding.mobile ) ) }
		` ) }

		${ mediaSl }{
			${ getBackgroundCSS( media.bg ) }
			${ radiusCSS( mediaRadius.desktop ) }
			${ marginCSS( mediaMargin.desktop ) }
		}
		${ el( 'image-link' ) }{ ${ isValidCSS( 'aspect-ratio', media.ratio ) } }
		${ el( 'image' ) }{ ${ isValidCSS( 'object-fit', media.fit ) } }
		${ mediaSl } .${ wrapperClass }-actions:not(.${ wrapperClass }-actions--split){ ${ getBackgroundCSS( media.overlay ) } }
		${ rule( el( 'card-footer' ), isValidCSS( 'border-top-color', card.divider ) ) }

		${ el( 'sale-badge' ) }{
			${ isValidCSS( 'color', badge.color ) }
			${ getBackgroundCSS( badge.bg ) }
			${ radiusCSS( badgeRadius.desktop ) }
			${ paddingCSS( badgePadding.desktop ) }
			${ badgeOffsetCSS( 'desktop' ) }
		}
		${ getTypoCSS( el( 'sale-badge' ), badge.typo )?.styles }

		${ atMedia( tabBreakpoint, `
			${ rule( mediaSl, `${ radiusCSS( mediaRadius.tablet ) } ${ marginCSS( mediaMargin.tablet ) }` ) }
			${ rule( el( 'sale-badge' ), `${ radiusCSS( badgeRadius.tablet ) } ${ paddingCSS( badgePadding.tablet ) } ${ badgeOffsetCSS( 'tablet' ) }` ) }
			${ rule( progressSl, radiusCSS( progressRadius.tablet ) ) }
		` ) }
		${ atMedia( mobileBreakpoint, `
			${ rule( mediaSl, `${ radiusCSS( mediaRadius.mobile ) } ${ marginCSS( mediaMargin.mobile ) }` ) }
			${ rule( el( 'sale-badge' ), `${ radiusCSS( badgeRadius.mobile ) } ${ paddingCSS( badgePadding.mobile ) } ${ badgeOffsetCSS( 'mobile' ) }` ) }
			${ rule( progressSl, radiusCSS( progressRadius.mobile ) ) }
		` ) }

		${ rule( cartIconSl, `${ isValidCSS( 'color', cart.iconColor ) } ${ isValidCSS( 'font-size', at( cart, 'desktop', 'iconSize' ) ) }` ) }
		${ rule( viewIconSl, `${ isValidCSS( 'color', viewButton.iconColor ) } ${ isValidCSS( 'font-size', at( viewButton, 'desktop', 'iconSize' ) ) }` ) }
		${ atMedia( tabBreakpoint, `
			${ rule( cartIconSl, isValidCSS( 'font-size', at( cart, 'tablet', 'iconSize' ) ) ) }
			${ rule( viewIconSl, isValidCSS( 'font-size', at( viewButton, 'tablet', 'iconSize' ) ) ) }
		` ) }
		${ atMedia( mobileBreakpoint, `
			${ rule( cartIconSl, isValidCSS( 'font-size', at( cart, 'mobile', 'iconSize' ) ) ) }
			${ rule( viewIconSl, isValidCSS( 'font-size', at( viewButton, 'mobile', 'iconSize' ) ) ) }
		` ) }

		${ stateButton( atcSl, cart ) }
		${ stateButton( viewSl, viewButton ) }
		${ stateButton( filterSl, filter ) }
		${ stateButton( pagerBtnSl, pager ) }

		${ el( 'pager-wrap' ) }{ ${ isValidCSS( 'justify-content', FLEX[ pager.align ] || 'center' ) } }
		${ el( 'filter' ) }{ ${ isValidCSS( 'justify-content', FLEX[ filter.align ] || 'flex-start' ) } }

		${ titleSl }{ ${ isValidCSS( 'color', title.normal?.color ) } }
		${ transitionCSS( `${ titleSl }, ${ el( 'title-link' ) }`, title.transition ) }
		${ el( 'title-link' ) }:hover, ${ el( 'title-link' ) }:focus-visible{ ${ isValidCSS( 'color', title.hover?.color ) } }

		${ priceSl }{ ${ isValidCSS( 'color', price.color ) } }
		${ priceSl } ins{ ${ isValidCSS( 'color', price.color ) } }
		${ priceSl } del{ ${ isValidCSS( 'color', price.regularColor ) } }

		${ starSl }{ ${ isValidCSS( 'font-size', starSize ) } ${ isValidCSS( 'color', starEmpty ) } }
		${ starSl }.is-full{ ${ isValidCSS( 'color', rating.color ) } }
		${ starSl }.is-half{
			${ isValidCSS( 'background', `linear-gradient(90deg, ${ rating.color || starEmpty } 50%, ${ starEmpty } 50%)` ) }
			${ isValidCSS( '-webkit-background-clip', 'text' ) }
			${ isValidCSS( 'background-clip', 'text' ) }
		}

		${ ratingMetaSl }{ ${ isValidCSS( 'font-size', starSize ) } ${ isValidCSS( 'color', rating.countColor ) } }

		${ categorySl }{ ${ isValidCSS( 'color', category.normal?.color ) } }
		${ transitionCSS( `${ categorySl }, ${ categorySl } a`, category.transition ) }
		${ categorySl } a:hover, ${ categorySl } a:focus-visible{ ${ isValidCSS( 'color', category.hover?.color ) } }

		${ soldSl }{ ${ isValidCSS( 'color', sold.color ) } ${ getBackgroundCSS( sold.bg ) } }

		${ progressSl }{
			${ isValidCSS( 'height', barHeight ) }
			${ isValidCSS( 'background', progress.trackColor ) }
			${ radiusCSS( progressRadius.desktop ) }
		}
		${ el( 'progress-fill' ) }{ ${ isValidCSS( 'background', progress.fillColor ) } }

		${ el( 'btn' ) }:focus-visible,
		${ filterSl }:focus-visible,
		${ el( 'load-more' ) }:focus-visible,
		${ el( 'page-btn' ) }:focus-visible,
		${ el( 'title-link' ) }:focus-visible{
			${ isValidCSS( 'outline', `2px solid ${ focusColor }` ) }
			${ isValidCSS( 'outline-offset', '2px' ) }
		}

		${ getTypoCSS( titleSl, title.typo )?.styles }
		${ getTypoCSS( priceSl, price.typo )?.styles }
		${ getTypoCSS( categorySl, category.typo )?.styles }
		${ getTypoCSS( soldSl, sold.typo )?.styles }

		${ advancedCSS }
	` ) } } />;
};

export default Style;