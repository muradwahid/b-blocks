import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { createInterpolateElement, useMemo } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';

import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { useWPOptionQuery } from '../../../../../bpl-tools/hooks';

import metadata from '../../block.json';
import { conform } from '../../utils/functions';
import Settings from './Settings/Settings';
import ProductGrid from '../Common/ProductGrid';
import useProductGridState from '../../hooks/useProductGridState';

const WooNotice = ( { installUrl } ) => {
	const message = __(
		'WooCommerce is not installed/activated on your site. Please install and activate <a>WooCommerce</a> first.',
		'b-blocks'
	);
	return <p className='b-blocks-woo-product-grid-notice'>
		{ createInterpolateElement( message, {
			a: installUrl
				? <a href={ installUrl } target='_blank' rel='noreferrer noopener' />
				: <strong />
		} ) }
	</p>;
};

const SHAPE = Object.fromEntries( Object.entries( metadata.attributes ).map( ( [ key, { default: value } ] ) => [ key, value ] ) );

const Edit = ( props ) => {
	const { attributes: saved, setAttributes, clientId, device = 'desktop', currentProductId = 0 } = props;

	const attributes = useMemo( () => conform( saved, SHAPE ), [ saved ] );

	const id = `block-${ clientId }`;
	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;

	const { data: bBlocksUtils } = useWPOptionQuery( 'bBlocksUtils' );
	const nonce = bBlocksUtils?.nonce;

	const updateObj = updateAttributes( attributes, setAttributes );

	const queryAttrs = { ...attributes, query: { ...attributes.query, currentProductId } };

	const { hasWoo, installUrl, isReady, ...grid } = useProductGridState( {
		ajaxUrl: window.ajaxurl,
		nonce,
		attributes: queryAttrs
	} );

	const advancedCSS = useMemo(
		() => generateCSS( id, attributes.advanced, true ),
		[ id, JSON.stringify( attributes.advanced ) ]
	);

	const blockProps = useBlockProps( { id } );

	return <>
		<Settings { ...props } attributes={ attributes } updateObj={ updateObj } device={ device } isPremium={ isPremium } />

		<div { ...blockProps }>
			{ ! isReady && ! grid.hasError && <p className='b-blocks-woo-product-grid-loading'>
				<Spinner />{ __( 'Loading product grid…', 'b-blocks' ) }
			</p> }

			{ ! isReady && grid.hasError && <p className='b-blocks-woo-product-grid-error' role='alert'>
				{ __( 'Products could not be loaded. Check that you are still signed in, then reload the editor.', 'b-blocks' ) }
			</p> }

			{ isReady && ! hasWoo && <WooNotice installUrl={ installUrl } /> }

			{ isReady && hasWoo && <ProductGrid
				isBackend
				attributes={ attributes }
				id={ id }
				advancedCSS={ advancedCSS }
				{ ...grid }
			/> }
		</div>
	</>;
};

export default compose(
	withSelect( ( select ) => {
		const editor = select( 'core/editor' );

		return {
			device: editor?.getDeviceType()?.toLowerCase() || 'desktop',
			currentProductId: 'product' === editor?.getCurrentPostType() ? editor.getCurrentPostId() : 0
		};
	} )
)( Edit );