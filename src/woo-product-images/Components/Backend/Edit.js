import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

import Settings from './Settings/Settings';
import Gallery from '../Frontend/Gallery';
import style from '../Common/Style';
import { sampleImages } from '../../utils/data';

const products = new Map();
const loadProduct = ( id ) => {
	if ( ! products.has( id ) ) {
		products.set( id, apiFetch( { path: `/wc/store/v1/products/${ id }` } ).then( ( data ) => {

			const regular = Number( data?.prices?.regular_price ) || 0;
			const price = Number( data?.prices?.price ) || 0;

			return {
				images: ( data?.images || [] ).map( ( image ) => fromStore( image, data.name ) ),
				name: data?.name || '',
				onSale: !! data?.on_sale,
				discount: regular > price && regular > 0 ? Math.round( ( regular - price ) / regular * 100 ) : 0
			};
		} ).catch( ( error ) => {
			products.delete( id );
			throw error;
		} ) );
	}
	return products.get( id );
};

const fromStore = ( image, name ) => ( {
	id: image.id,
	alt: image.alt || name || '',
	main: { src: image.src, srcset: image.srcset, sizes: image.sizes },
	thumb: { src: image.thumbnail || image.src, srcset: image.thumbnail_srcset, sizes: image.thumbnail_sizes },
	full: { src: image.src }
} );

const Edit = ( props ) => {
	const { attributes, clientId, context = {}, postType, postId, isPreview } = props;
	const uid = `block-${ clientId }`;

	const contextId = 'product' === context.postType ? parseInt( context.postId, 10 ) || 0 : 0;
	const productId = contextId || ( 'product' === postType ? parseInt( postId, 10 ) || 0 : 0 );

	const [ real, setReal ] = useState( null );
	useEffect( () => {
		setReal( null );
		if ( ! productId ) return undefined;

		let cancelled = false;
		loadProduct( productId )
			.then( ( data ) => {
				const placeholder = window.wcSettings?.placeholderImgSrc;
				const images = data.images.length || ! placeholder ? data.images : [ fromStore( { id: 0, src: placeholder }, data.name ) ];
				if ( ! cancelled ) setReal( images.length ? { images, onSale: data.onSale, discount: data.discount } : null );
			} )
			.catch( () => ! cancelled && setReal( null ) );

		return () => {
			cancelled = true;
		};
	}, [ productId ] );

	const images = useMemo( () => real?.images || sampleImages(), [ real ] );
	const onSale = real ? real.onSale : true;
	const discount = real ? real.discount : 25;

	const wooActive = 'undefined' !== typeof window.wcSettings || 'undefined' !== typeof window.wc;
	const hasContext = !! productId || ( 'wp_template' === postType && /single-product/.test( String( postId ) ) );

	const css = useMemo( () => style(  attributes , uid, true ), [ attributes, uid ] );

	const i18n = {
		gallery: __( 'Product images', 'b-blocks' ),
		view: __( 'View image %1$s of %2$s', 'b-blocks' ),
		previous: __( 'Previous images', 'b-blocks' ),
		next: __( 'Next images', 'b-blocks' ),
		prevImage: __( 'Previous image', 'b-blocks' ),
		nextImage: __( 'Next image', 'b-blocks' ),
		open: __( 'View full size', 'b-blocks' ),
		lightbox: __( 'Product image viewer', 'b-blocks' ),
		close: __( 'Close', 'b-blocks' ),
		sale: __( 'Sale!', 'b-blocks' )
	};

	const blockProps = useBlockProps();
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	return <>
		<Settings { ...props } isPremium={ isPremium } />

		<div { ...blockProps }>
			{ ! isPreview && ! wooActive && <p className='b-blocks-woo-product-images-notice'>
				{ __( 'WooCommerce is not active. This block shows nothing until it is.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && wooActive && ! hasContext && <p className='b-blocks-woo-product-images-notice'>
				{ __( 'No product here: on this page the block shows nothing. Use it in the Single Product template or in a product loop; these are sample images.', 'b-blocks' ) }
			</p> }

			<style dangerouslySetInnerHTML={ { __html: css } } />
			<div>
				<Gallery attributes={ attributes } images={ images } i18n={ i18n } onSale={ onSale } discount={ discount } isBackend={ true } />
			</div>
		</div>
	</>;
};

export default compose(
	withSelect( ( select ) => {
		const editor = select( 'core/editor' );

		return {
			device: editor?.getDeviceType?.()?.toLowerCase() || 'desktop',
			postType: editor?.getCurrentPostType?.(),
			postId: editor?.getCurrentPostId?.(),
			isPreview: !! select( 'core/block-editor' ).getSettings()?.isPreviewMode
		};
	} )
)( Edit );