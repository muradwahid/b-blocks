import { cartIcon, externalIcon } from '../../../utils/icons';
import { asText } from '../../../utils/functions';

const Actions = ( { product, attributes, isBackend = false, only = '' } ) => {
	const { cart: cartOn, viewButton: viewOn } = attributes.elements || {};
	const showAddToCart = cartOn && 'view' !== only;
	const showViewButton = viewOn && 'cart' !== only;
	const { text: viewButtonText } = attributes.viewButton || {};

	if ( ! showAddToCart && ! showViewButton ) return null;

	const { id, link, cartText, cartAjax, cartUrl, cartClass, sku, cartAria, viewAria } = product;

	const wooClasses = ( ! isBackend && cartAjax )
		? ` button ${ cartClass || '' } add_to_cart_button ajax_add_to_cart`
		: '';

	const { actionAlign = 'center', actionFull, actionIconOnly, actionOrder, actionPosition } = attributes.layout || {};
	const isSplit = 'split' === actionPosition;
	const cartGroup = attributes.cart || {};
	const viewGroup = attributes.viewButton || {};

	const iconFor = ( group, fallback ) => {
		if ( false === group.showIcon && ! actionIconOnly ) return null;

		return group.icon
			? <span className='b-blocks-woo-product-grid-icon' aria-hidden='true' dangerouslySetInnerHTML={ { __html: group.icon } } />
			: fallback;
	};

	const sideClass = ( group ) => ( 'right' === group.iconPosition ? ' is-icon-right' : '' );

	const classes = [
		'b-blocks-woo-product-grid-actions',
		isSplit ? 'b-blocks-woo-product-grid-actions--split' : `b-blocks-woo-product-grid-actions--${ actionAlign }`,
		actionFull && ! isSplit ? 'is-full' : '',
		actionIconOnly ? 'is-icon-only' : ''
	].filter( Boolean ).join( ' ' );

	const cart = showAddToCart && <a
		key='cart'
		className={ `b-blocks-woo-product-grid-btn b-blocks-woo-product-grid-atc-btn${ sideClass( cartGroup ) }${ wooClasses }` }
		href={ cartUrl || link }
		rel='nofollow'
		aria-label={ cartAria }
		data-product_id={ cartAjax ? id : undefined }
		data-product_sku={ cartAjax ? ( sku || '' ) : undefined }
		data-quantity={ cartAjax ? 1 : undefined }
		onClick={ isBackend ? ( event ) => event.preventDefault() : undefined }
	>
		{ iconFor( cartGroup, cartIcon ) }
		<span className='b-blocks-woo-product-grid-btn-label'>{ cartText }</span>
	</a>;

	const view = showViewButton && <a
		key='view'
		className={ `b-blocks-woo-product-grid-btn b-blocks-woo-product-grid-view-btn${ sideClass( viewGroup ) }` }
		href={ link }
		aria-label={ viewAria }
		onClick={ isBackend ? ( event ) => event.preventDefault() : undefined }
	>
		{ iconFor( viewGroup, externalIcon ) }
		<span className='b-blocks-woo-product-grid-btn-label'>{ asText( viewButtonText ) }</span>
	</a>;

	return <div className={ classes }>
		{ 'view' === actionOrder ? [ view, cart ] : [ cart, view ] }
	</div>;
};

export default Actions;
