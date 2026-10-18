import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import Settings from './Settings/Settings';
import Preview from '../Common/Preview';
import style from '../Common/Style';

const TYPES = [ 'simple', 'grouped', 'external', 'variable' ];

// One Store API request per product per editor session: the blocks in a
// product loop re-mount each time another item is clicked.
const products = new Map();
const loadProduct = ( id ) => {
	if ( ! products.has( id ) ) {
		products.set( id, apiFetch( { path: `/wc/store/v1/products/${ id }` } ).catch( ( error ) => {
			products.delete( id );
			throw error;
		} ) );
	}
	return products.get( id );
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId, context = {} } = props;
	const { product = {} } = attributes;
	const productId = parseInt( product.id, 10 ) || 0;
	const contextId = 'product' === context.postType ? parseInt( context.postId, 10 ) || 0 : 0;
	const previewId = productId || contextId;

	const uid = `block-${ clientId }`;

	const { device, postType, postId, isPreview } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		return {
			device: editor?.getDeviceType?.()?.toLowerCase() || 'desktop',
			postType: editor?.getCurrentPostType?.(),
			postId: editor?.getCurrentPostId?.(),
			isPreview: !! select( 'core/block-editor' ).getSettings()?.isPreviewMode
		};
	}, [] );

	const [ picked, setPicked ] = useState( null );
	const [ override, setOverride ] = useState( null );
	useEffect( () => {
		setOverride( null );
		setPicked( null );
		if ( ! previewId ) return undefined;

		let cancelled = false;
		loadProduct( previewId )
			.then( async ( data ) => {
				const realType = TYPES.includes( data?.type ) ? data.type : 'simple';
				const ids = 'grouped' === realType && Array.isArray( data.grouped_products ) ? data.grouped_products : [];

				const children = ids.length
					? await apiFetch( { path: addQueryArgs( '/wc/store/v1/products', { include: ids.join( ',' ), per_page: 100 } ) } )
						.then( ( items ) => ids.map( ( id ) => ( items || [] ).find( ( item ) => item.id === id ) ).filter( Boolean ) )
						.catch( () => [] )
					: [];

				const ownText = 'external' === realType
					? await apiFetch( { path: `/wc/v3/products/${ previewId }?_fields=button_text` } ).then( ( r ) => r?.button_text || '' ).catch( () => '' )
					: '';

				if ( ! cancelled ) setPicked( { type: realType, data, children, ownText, problem: data?.is_password_protected ? 'password' : '' } );
			} )
			.catch( async () => {
				const post = await apiFetch( { path: `/wp/v2/product/${ previewId }?context=edit&_fields=id,status` } ).catch( () => null );
				if ( ! cancelled ) setPicked( { type: 'simple', data: null, children: [], ownText: '', problem: post?.id ? 'unpublished' : 'missing', status: post?.status || '' } );
			} );

		return () => {
			cancelled = true;
		};
	}, [ previewId ] );

	const type = previewId
		? ( override || picked?.type || 'simple' )
		: ( TYPES.includes( product.previewType ) ? product.previewType : 'simple' );

	const real = previewId && picked?.data && picked.type === type ? picked : null;

	const choosePreview = ( val ) => {
		setAttributes( { product: { ...product, previewType: val } } );
		if ( previewId ) setOverride( val );
	};

	const wooActive = 'undefined' !== typeof window.wcSettings || 'undefined' !== typeof window.wc;

	const hasContext = !! productId
		|| 'product' === context.postType
		|| 'product' === postType
		|| ( 'wp_template' === postType && /single-product/.test( String( postId ) ) );

	const css = useMemo( () => style( attributes, uid, true ), [ attributes, uid ] );

	const blockProps = useBlockProps();
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	return <>
		<Settings { ...props } isPremium={ isPremium } device={ device } previewType={ type } onPreviewType={ choosePreview } isPicked={ !! previewId } />

		<div { ...blockProps }>
			{ ! isPreview && ! wooActive && <p className='b-blocks-woo-add-to-cart-notice'>
				{ __( 'WooCommerce is not active. This block shows nothing until it is.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && !! productId && picked?.problem && <p className='b-blocks-woo-add-to-cart-notice'>
				{ {
					missing: __( 'The chosen product no longer exists, so visitors see nothing here. Pick another product.', 'b-blocks' ),
					/* translators: %s: the product's status, e.g. draft. */
					unpublished: sprintf( __( 'The chosen product is not published (%s), so visitors see nothing here until it is.', 'b-blocks' ), picked.status ),
					password: __( 'The chosen product is password-protected, so visitors see nothing here.', 'b-blocks' )
				}[ picked.problem ] }
			</p> }

			{ ! isPreview && wooActive && ! hasContext && <p className='b-blocks-woo-add-to-cart-notice'>
				{ __( 'No product here: on this page the block shows nothing. Pick a product in the block settings, or use the block in the Single Product template.', 'b-blocks' ) }
			</p> }

			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div>
				<Preview attributes={ attributes } type={ type } uid={ uid } real={ real } />
			</div>
		</div>
	</>;
};

export default Edit;