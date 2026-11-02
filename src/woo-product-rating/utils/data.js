import { __, _x, sprintf } from '@wordpress/i18n';

// Outside a product: a fractional rating and a plural count, so both show in the preview.
export const SAMPLE = { rating: 4.5, reviewCount: 3 };

export const defaultTexts = () => ( {
	singular: __( 'Customer Rating', 'b-blocks' ),
	plural: __( 'Customer Ratings', 'b-blocks' ),
	before: _x( '(', 'before the review count', 'b-blocks' ),
	after: _x( ')', 'after the review count', 'b-blocks' ),
	emptyText: __( 'No Customer Ratings', 'b-blocks' )
} );

// The texts as set: the translated default until edited; '' stays empty.
export const textsOf = ( options = {} ) => {
	const defaults = defaultTexts();

	return Object.fromEntries( Object.keys( defaults ).map( ( key ) => [ key, String( options[ key ] ?? defaults[ key ] ) ] ) );
};

// As on the page: tags dropped (wp_strip_all_tags()), numbers in the site's format (number_format_i18n()).
const plain = ( text ) => text.replace( /<(script|style)[^>]*?>[\s\S]*?<\/\1>/gi, '' ).replace( /<[^>]*>/g, '' );

const formatNumber = ( value, decimals = 0 ) => {
	const format = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
	try {
		return Number( value ).toLocaleString( document.documentElement.lang || undefined, format );
	} catch {
		return Number( value ).toLocaleString( undefined, format );
	}
};

// The review link's text, as WooProductRating::linkText() builds it on the page.
export const linkText = ( count, options = {} ) => {
	const number = formatNumber( count );
	const texts = textsOf( options );
	const caption = plain( 1 === count ? texts.singular : texts.plural ).trim();

	return `${ plain( texts.before ) }${ number }${ caption ? ` ${ caption }` : '' }${ plain( texts.after ) }`;
};

/**
 * What Rating.js renders, in the shape WooProductRating::product() sends to view.js.
 *
 * @param {{ rating: number, reviewCount: number }} data    Rating and review count.
 * @param {Object}                                  options The `options` attribute.
 */
export const productView = ( { rating = 0, reviewCount = 0 }, options = {} ) => {
	const hasRating = rating > 0;
	const showCount = false !== options.showCount;

	return {
		rating: hasRating ? rating : 0,
		hasRating,
		/* translators: %s: average rating, e.g. 4.30. */
		label: hasRating ? sprintf( __( 'Rated %s out of 5', 'b-blocks' ), formatNumber( rating, 2 ) ) : __( 'No customer ratings', 'b-blocks' ),
		count: hasRating && showCount ? { text: linkText( reviewCount, options ), link: '#reviews' } : null,
		emptyText: ! hasRating && showCount ? plain( textsOf( options ).emptyText ).trim() : ''
	};
};