import { BOX, DISPLAYS, STARS_TYPES, starFills } from '../../utils/functions';
import { starIcons } from '../../utils/icons';

// The editor's link doesn't navigate.
const stay = ( event ) => event.preventDefault();

const Rating = ( { attributes, isBackend = false } ) => {
	const { layout = {}, product } = attributes;
	if ( ! product ) return null;

	const { rating = 0, hasRating, label, count, emptyText } = product;
	const type = STARS_TYPES.includes( layout.starsType ) ? layout.starsType : 'style-1';
	const display = DISPLAYS.includes( layout.display ) ? layout.display : 'inline';
	const icons = starIcons[ type ];
	const [ from, to ] = icons.span || [ 0, 100 ];
	// The empty text says it already: the empty stars stay silent rather than announce it twice.
	const silent = ! hasRating && !! emptyText && ! count;

	// DOM order stays stars, then count (what screen readers follow); Display Type only reorders them visually.
	return <div className={ `${ BOX } ${ BOX }--${ display }` }>
		<div className={ `${ BOX }-stars ${ BOX }-stars--${ type }` } role={ silent ? undefined : 'img' } aria-label={ silent ? undefined : label } aria-hidden={ silent || undefined }>
			{ starFills( hasRating ? rating : 0 ).map( ( fill, index ) => <span key={ index } className={ `${ BOX }-star` }>
				{ icons.base }
				{ 0 < fill && <span className={ `${ BOX }-star-fill` } style={ { '--b-blocks-rating-fill': `${ 100 <= fill ? 100 : from + ( fill * ( to - from ) / 100 ) }%` } }>{ icons.fill }</span> }
			</span> ) }
		</div>

		{ count && <a className={ `${ BOX }-count woocommerce-review-link` } href={ count.link } rel='nofollow' onClick={ isBackend ? stay : undefined }>{ count.text }</a> }

		{ ! count && emptyText && <span className={ `${ BOX }-count ${ BOX }-count--empty` }>{ emptyText }</span> }
	</div>;
};

export default Rating;
