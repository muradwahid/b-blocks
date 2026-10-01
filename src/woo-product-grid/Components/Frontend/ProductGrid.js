import ProductGrid from '../Common/ProductGrid';
import useProductGridState from '../../hooks/useProductGridState';

const Frontend = ( { firstData = {}, ajaxUrl, nonce, attributes, id } ) => {
	const state = useProductGridState( { ajaxUrl, nonce, attributes, seed: firstData } );

	return <ProductGrid attributes={ attributes } id={ id } { ...state } />;
};

export default Frontend;
