export const prefix = 'bBlocksWooProductGrid';

export const wrapperClass = 'b-blocks-woo-product-grid';

export const queryAction = 'bb_wpg_query';
export const cartAction = 'bb_wpg_add_to_cart';
export const searchAction = 'bb_wpg_search';

export const contentElements = {
	price: 'Price',
	rating: 'Rating',
	title: 'Title',
	category: 'Category',
	soldCount: 'Sold Count'
};

export const defaultContentOrder = [ 'price', 'rating', 'title', 'category', 'soldCount' ];

const pick = ( group, keys ) => Object.fromEntries(
	keys.filter( ( key ) => group && key in group ).map( ( key ) => [ key, group[ key ] ] )
);


export const queryAttributes = ( attributes = {} ) => ( {
	query: attributes.query || {},

	cart: pick( attributes.cart, [ 'useCustomText', 'simple', 'variable', 'grouped', 'external', 'default' ] ),
	sold: pick( attributes.sold, [ 'prefix', 'suffix', 'withoutStock' ] ),
	filter: pick( attributes.filter, [ 'enable', 'taxonomy' ] ),
	viewButton: pick( attributes.viewButton, [ 'text' ] ),
	layout: { imageSize: attributes.layout?.imageSize }
} );

export const titleTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];