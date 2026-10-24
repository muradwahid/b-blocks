import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Price from '../Frontend/Price';
import { samplePriceHtml, savingsOf } from '../../utils/data';
import { useProduct } from '../../utils/product';
import metadata from '../../block.json';

const Edit = ( props ) => {
	const { attributes, clientId, context = {}, postType, postId, isPreview } = props;
	const { prefix = {}, suffix = {}, savings = {} } = attributes;
	const uid = `block-${ clientId }`;

	const contextId = 'product' === context.postType ? parseInt( context.postId, 10 ) || 0 : 0;
	const productId = contextId || ( 'product' === postType ? parseInt( postId, 10 ) || 0 : 0 );

	const { real, failed, loading } = useProduct( productId );

	const sample = useMemo( () => samplePriceHtml( 80, 50 ), [] );
	const priceHtml = real ? real.priceHtml : ( loading ? '' : sample );
	const onSale = real ? real.onSale : true;
	const saved = useMemo( () => ( real ? real.savings : savingsOf() ), [ real ] );

	const wooActive = 'undefined' !== typeof window.wcSettings || 'undefined' !== typeof window.wc;
	const hasContext = !! productId || ( 'wp_template' === postType && /single-product/.test( String( postId ) ) );

	const texts = {
		prefix: prefix.text ?? __( 'Limited Time Offer', 'b-blocks' ),
		suffix: suffix.text ?? __( 'Sales Ongoing', 'b-blocks' ),
		savings: savings.text ?? __( 'Save {percent}', 'b-blocks' )
	};

	const previewAttributes = {
		...attributes,
		prefix: { ...prefix, text: texts.prefix, icon: prefix.icon ?? metadata.attributes.prefix.default.icon },
		suffix: { ...suffix, text: texts.suffix, icon: suffix.icon ?? metadata.attributes.suffix.default.icon },
		savings: { ...savings, text: texts.savings },
		product: { priceHtml, onSale, savings: saved }
	};

	const blockProps = useBlockProps();
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	return <>
		<Settings { ...props } isPremium={ isPremium } texts={ texts } />

		<div { ...blockProps }>
			{ ! isPreview && ! wooActive && <p className='b-blocks-woo-product-price-notice'>
				{ __( 'WooCommerce is not active. This block shows nothing until it is.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && wooActive && ! hasContext && <p className='b-blocks-woo-product-price-notice'>
				{ __( 'No product here: on this page the block shows nothing. Use it in the Single Product template or in a product loop; this is a sample price.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && failed && <p className='b-blocks-woo-product-price-notice'>
				{ __( 'This product’s price could not be loaded here: this is a sample price.', 'b-blocks' ) }
			</p> }

			{ ! isPreview && real && ! real.priceHtml && <p className='b-blocks-woo-product-price-notice'>
				{ __( 'This product has no price: on the page the block shows nothing.', 'b-blocks' ) }
			</p> }

			<div>
				<Style attributes={ attributes } id={ uid } isBackend={ true } />

				<Price attributes={ previewAttributes } />
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