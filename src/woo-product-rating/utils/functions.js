export const BOX = 'b-blocks-woo-product-rating';

// Allowed values, as in WooProductRating.php
export const STARS_TYPES = [ 'style-1', 'style-2', 'style-3', 'style-4', 'style-5' ];

export const DISPLAYS = [ 'inline', 'block', 'block-reverse', 'inline-reverse' ];

export const ALIGNMENTS = [ 'left', 'center', 'right' ];

// How much of each of the five stars is filled (0-100). Each star clips its own fill,
// so 4.3 fills 30% of the fifth star's width whatever the gap between stars.
export const starFills = ( rating ) => [ 0, 1, 2, 3, 4 ].map( ( i ) => Math.round( Math.min( 1, Math.max( 0, ( Number( rating ) || 0 ) - i ) ) * 10000 ) / 100 );
