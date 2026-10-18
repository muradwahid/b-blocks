import { MAX_QUANTITY } from '../../utils/functions';
import Native from './Native';
import Simple from './Simple';

const toInt = ( value, fallback ) => {
	const n = parseInt( value, 10 );
	return Number.isNaN( n ) ? fallback : n;
};

const AddToCart = ( { attributes, id } ) => {
	const { content = {}, options = {}, product = {}, i18n = {} } = attributes;
	if ( ! product.id ) return null;

	const isSimple = 'simple' === product.type;
	const canAjax = isSimple && product.purchasable && product.inStock;

	const min = Math.max( 1, toInt( product.min, 1 ) );
	const max = Math.max( min, toInt( product.max, MAX_QUANTITY ) );
	const step = Math.max( 1, toInt( product.step, 1 ) );
	const startsEmpty = 0 === toInt( options.quantity, 1 );
	const quantity = startsEmpty ? 0 : Math.min( max, Math.max( min, toInt( options.quantity, min ) ) );

	const ownText = 'string' === typeof content.buttonText ? content.buttonText.trim() : '';
	const addedText = 'string' === typeof content.addedText ? content.addedText.trim() : '';

	const showQuantity = canAjax
		? !! options.showQuantity && ! product.soldIndividually
		: !! options.showQuantity;

	const view = {
		...attributes,
		content: {
			...content,
			buttonText: ( ! product.ownLabel && ownText ) || product.label || i18n.addToCart,
			addedText: addedText || i18n.added
		},
		options: { ...options, showQuantity, quantity }
	};

	if ( canAjax ) return <Simple attributes={ view } id={ id } limits={ { min, max, step, allowZero: startsEmpty } } />;

	return <Native attributes={ view } type={ isSimple ? 'unavailable' : product.type } id={ id } />;
};

export default AddToCart;
