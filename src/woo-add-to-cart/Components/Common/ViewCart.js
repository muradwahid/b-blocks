import { BOX } from '../../utils/functions';

const ViewCart = ( { attributes, fallback = '' } ) => {
	const text = attributes.content?.viewCartText?.trim() || attributes.i18n?.viewCart || fallback;
	const href = attributes.cart?.cartUrl;

	return href
		? <a className={ `${ BOX }-view-cart` } href={ href }>{ text }</a>
		: <a className={ `${ BOX }-view-cart` } href='#preview' onClick={ ( e ) => e.preventDefault() }>{ text }</a>;
};

export default ViewCart;
