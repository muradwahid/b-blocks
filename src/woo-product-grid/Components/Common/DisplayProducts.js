import Card from './Single/Card';
import { asText } from '../../utils/functions';

const DisplayProducts = ( { products = [], attributes, isLoading, isBackend, labels = {} } ) => {
	const { noProductsMessage } = attributes.query || {};

	return <>
		<div
			className={ `b-blocks-woo-product-grid-grid${ isLoading ? ' is-loading' : '' }` }
			role='list'
			aria-label={ labels.products }
			aria-busy={ isLoading }
		>
			{ products.map( ( product, index ) => (
				<Card key={ product.id } { ...{ product, attributes, isBackend, index } } />
			) ) }
		</div>

		{ ! products.length && ! isLoading && <p className='b-blocks-woo-product-grid-empty'>{ asText( noProductsMessage ) }</p> }
	</>;
};

export default DisplayProducts;
