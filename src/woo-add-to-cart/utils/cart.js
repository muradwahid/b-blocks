export const REVERT_MS = 2500;

const post = ( url, fields ) => fetch( url, {
	method: 'POST',
	credentials: 'same-origin',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	body: new URLSearchParams( fields ).toString()
} );

export const postAddToCart = async ( cart, fields ) => {
	const send = () => post( cart.ajaxUrl, [ [ 'action', 'bBlocksWooAddToCart' ], [ 'nonce', cart.nonce ], ...fields ] );

	let res = await send();

	if ( 403 === res.status ) {
		const fresh = await post( cart.ajaxUrl, [ [ 'action', 'bBlocksWooAddToCartNonce' ] ] ).then( ( r ) => r.json() ).catch( () => null );
		if ( fresh?.success && fresh.data?.nonce ) {
			cart.nonce = fresh.data.nonce;
			res = await send();
		}
	}

	return res.json();
};

export const announceAdded = ( data = {} ) => {
	const $ = window.jQuery;
	if ( $ && data.fragments && data.cartHash ) {
		$( document.body ).trigger( 'added_to_cart', [ data.fragments, data.cartHash ] );
		return;
	}

	document.body.dispatchEvent( new CustomEvent( 'wc_fragment_refresh' ) );
	document.body.dispatchEvent( new CustomEvent( 'wc-blocks_added_to_cart', { bubbles: true, cancelable: true } ) );
};


export const onPageRestore = ( reset ) => {
	const handler = ( event ) => event.persisted && reset();
	window.addEventListener( 'pageshow', handler );
	return () => window.removeEventListener( 'pageshow', handler );
};
