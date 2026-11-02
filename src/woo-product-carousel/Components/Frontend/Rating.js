import { BOX } from '../../utils/data';
import { STAR_SPAN, starIcon } from '../../utils/icons';

const [ FROM, TO ] = STAR_SPAN;

// Products nobody has rated show no rating row at all.
const Rating = ( { product } ) => {
	const { rating = 0, ratingCount = 0, ratingLabel } = product;
	if ( ! ( 0 < ratingCount ) ) return null;

	return <div className={ `${ BOX }-rating` } role='img' aria-label={ ratingLabel }>
		{ [ 0, 1, 2, 3, 4 ].map( ( index ) => {
			// How much of this star is filled (0-100): 4.3 fills 30% of the fifth.
			const fill = Math.min( 1, Math.max( 0, rating - index ) ) * 100;

			return <span key={ index } className={ `${ BOX }-star` }>
				{ starIcon }
				{ 0 < fill && <span className={ `${ BOX }-star-fill` } style={ { clipPath: `inset(0 ${ 100 <= fill ? 0 : 100 - ( FROM + ( fill * ( TO - FROM ) / 100 ) ) }% 0 0)` } }>{ starIcon }</span> }
			</span>;
		} ) }
	</div>;
};

export default Rating;