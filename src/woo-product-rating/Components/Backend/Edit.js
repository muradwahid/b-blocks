import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Rating from '../Frontend/Rating';
import { SAMPLE, productView } from '../../utils/data';
import { useRating } from '../../utils/product';

const Edit = ( props ) => {
	const { attributes, clientId, context = {}, postType, postId, isPreview } = props;
	const { options = {} } = attributes;
	const uid = `block-${ clientId }`;

	const contextId = 'product' === context.postType ? parseInt( context.postId, 10 ) || 0 : 0;
	const productId = contextId || ( 'product' === postType ? parseInt( postId, 10 ) || 0 : 0 );

	const { real, failed, loading } = useRating( productId );

	const wooActive = 'undefined' !== typeof window.wcSettings || 'undefined' !== typeof window.wc;
	const hasContext = !! productId || ( 'wp_template' === postType && /single-product/.test( String( postId ) ) );
	// Set by WooCommerce's review blocks; unknown (undefined) counts as on.
	const ratingsOff = false === window.wcSettings?.reviewRatingsEnabled;
	const noRatings = !! real && ! ( real.rating > 0 );

	// The product's own numbers; a sample outside a product (or until it loads).
	const data = real || ( loading ? { rating: 0, reviewCount: 0 } : SAMPLE );
	// A product without ratings previews the empty state even when Show Empty Rating is off (the notice says so).
	// While loading: empty stars without the text, so the block keeps its place and stays selectable.
	const previewAttributes = { ...attributes, product: productView( data, loading ? { ...options, showCount: false } : noRatings ? { ...options, showEmpty: true } : options ) };

	const blockProps = useBlockProps();
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	return <>
		<Settings { ...props } isPremium={ isPremium } />

		<div { ...blockProps }>
			{ ! isPreview && ! wooActive && <p className='b-blocks-woo-product-rating-notice'>
				{ __( 'WooCommerce is not active. This block shows nothing until it is.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && wooActive && ratingsOff && <p className='b-blocks-woo-product-rating-notice'>
				{ __( 'Star ratings are turned off in WooCommerce → Settings → Products: on the page the block shows nothing.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && wooActive && ! hasContext && <p className='b-blocks-woo-product-rating-notice'>
				{ __( 'No product here: on this page the block shows nothing. Use it in the Single Product template or in a product loop; this is a sample rating (4.5, 3 reviews).', 'b-blocks' ) }
			</p> }

			{ ! isPreview && failed && <p className='b-blocks-woo-product-rating-notice'>
				{ __( 'This product’s rating could not be loaded here: this is a sample rating.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && noRatings && ! options.showEmpty && <p className='b-blocks-woo-product-rating-notice'>
				{ __( 'This product has no ratings yet: on the page the block shows nothing unless Show Empty Rating is on. Previewing the empty state.', 'b-blocks' ) }
			</p> }

			<div>
				<Style attributes={ attributes } id={ uid } isBackend={ true } />

				<Rating attributes={ previewAttributes } isBackend={ true } />
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
