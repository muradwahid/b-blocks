
const Price = ( { product } ) => product.priceHtml
	? <div className='b-blocks-woo-product-grid-price' dangerouslySetInnerHTML={ { __html: product.priceHtml } } />
	: null;

export default Price;
