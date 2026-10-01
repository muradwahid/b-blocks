const Category = ( { product } ) => product.categoriesHtml
	? <div className='b-blocks-woo-product-grid-category' dangerouslySetInnerHTML={ { __html: product.categoriesHtml } } />
	: null;

export default Category;
