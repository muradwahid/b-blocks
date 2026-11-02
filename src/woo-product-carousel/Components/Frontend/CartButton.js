import { BOX } from '../../utils/data';
import { cartIcon } from '../../utils/icons';

// WooCommerce's add-to-cart script picks these classes and data up; without them it's a plain link.
const CartButton = ( { product, labels, className, texts = {} } ) => {
	// The author's text for this kind of product (Cart Button panel), else WooCommerce's own.
	const cartText = texts[ product.cartKind ] || product.cartText;
	if ( ! cartText ) return null;

	return <a
		className={ `${ className } ${ BOX }-cart-button${ product.cartAjax ? ` ${ product.cartClass || '' } add_to_cart_button ajax_add_to_cart` : '' }` }
		href={ product.cartUrl || product.link }
		rel='nofollow'
		aria-label={ labels.buttonAria.replace( '%1$s', () => cartText ).replace( '%2$s', () => product.title ) }
		data-product_id={ product.cartAjax ? product.id : undefined }
		data-product_sku={ product.cartAjax ? ( product.sku || '' ) : undefined }
		data-quantity={ product.cartAjax ? 1 : undefined }
	>{ cartIcon }<span className={ `${ BOX }-button-label` }>{ cartText }</span></a>;
};

export default CartButton;