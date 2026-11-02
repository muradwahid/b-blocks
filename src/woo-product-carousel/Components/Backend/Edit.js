import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { useWPOptionQuery } from '../../../../../bpl-tools/hooks';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import ProductCarousel from '../Frontend/ProductCarousel';
import useCarouselProducts from '../../hooks/useCarouselProducts';
import { BOX } from '../../utils/data';

const Notice = ( { children, role } ) => <p className={ `${ BOX }-notice` } role={ role }>{ children }</p>;

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId, device = 'desktop', currentProductId = 0 } = props;

	const { query, layout = {} } = attributes;

	const id = `block-${ clientId }`;
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	const { data: bBlocksUtils } = useWPOptionQuery( 'bBlocksUtils' );

	const { products, labels, hasWoo, hasBrands, installUrl, isReady, isLoading, hasError } = useCarouselProducts( {
		nonce: bBlocksUtils?.nonce,
		query,
		imageSize: layout?.imageSize,
		currentProductId
	} );

	const updateObj = updateAttributes( attributes, setAttributes );

	const blockProps = useBlockProps( { id } );

	const wooMessage = __( 'WooCommerce is not installed/activated on your site. Please install and activate <a>WooCommerce</a> first.', 'b-blocks' );

	return <>
		<Settings { ...props } attributes={ attributes } updateObj={ updateObj } device={ device } isPremium={ isPremium } hasBrands={ hasBrands } />

		<div { ...blockProps }>
			{ ! isReady && ! hasError && <Notice><Spinner />{ __( 'Loading products…', 'b-blocks' ) }</Notice> }

			{ hasError && <Notice role='alert'>
				{ __( 'Products could not be loaded. Check that you are still signed in, then reload the editor.', 'b-blocks' ) }
			</Notice> }

			{ isReady && ! hasWoo && <Notice>
				{ createInterpolateElement( wooMessage, {
					a: installUrl ? <a href={ installUrl } target='_blank' rel='noreferrer noopener' /> : <strong />
				} ) }
			</Notice> }

			{ isReady && hasWoo && ! products.length && ! isLoading && <Notice>
				{ __( 'No products match these settings, so the carousel shows nothing on the page. Change the Product Query to show some.', 'b-blocks' ) }
			</Notice> }

			{ isReady && hasWoo && 0 < products.length && <>
				<Style attributes={ attributes } id={ id } isBackend={ true } />

				{ /* Dimmed while new products load, and when they couldn't: what shows is out of date. */ }
				<div className={ isLoading || hasError ? 'is-loading' : undefined }>
					<ProductCarousel attributes={ attributes } products={ products } labels={ labels } isBackend={ true } device={ device } />
				</div>
			</> }
		</div>
	</>;
};

export default compose(
	withSelect( ( select ) => {
		const editor = select( 'core/editor' );

		return {
			device: editor?.getDeviceType?.()?.toLowerCase() || 'desktop',
			currentProductId: 'product' === editor?.getCurrentPostType?.() ? editor.getCurrentPostId() : 0
		};
	} )
)( Edit );