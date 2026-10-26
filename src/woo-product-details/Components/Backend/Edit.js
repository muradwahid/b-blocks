import { __, sprintf } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Details from '../Frontend/Details';
import { BOX, TABS } from '../../utils/functions';
import { productPanels, samplePanels } from '../../utils/data';
import { useProduct } from '../../utils/product';

const Edit = ( props ) => {
	const { attributes, clientId, context = {}, postType, postId, isPreview } = props;
	const { options = {} } = attributes;
	const uid = `block-${ clientId }`;

	const wooActive = 'undefined' !== typeof window.wcSettings || 'undefined' !== typeof window.wc;

	const contextId = 'product' === context.postType ? parseInt( context.postId, 10 ) || 0 : 0;
	const productId = wooActive ? contextId || ( 'product' === postType ? parseInt( postId, 10 ) || 0 : 0 ) : 0;
	const hasContext = !! productId || ( 'wp_template' === postType && /single-product/.test( String( postId ) ) );

	const { real, failed, loading } = useProduct( productId );
	const panels = useMemo( () => ( real ? productPanels( real ) : samplePanels() ), [ real ] );

	const enabled = TABS.filter( ( tab ) => false !== options[ tab.option ] );
	const shown = enabled.filter( ( tab ) => ! panels.hidden[ tab.key ] );
	const autoHidden = enabled.filter( ( tab ) => panels.hidden[ tab.key ] );

	const previewAttributes = {
		...attributes,
		product: {
			tabs: shown.map( ( { key } ) => ( {
				key,
				title: panels.titles[ key ],
				tabId: `${ uid }-tab-title-${ key }`,
				panelId: `${ uid }-tab-${ key }`,
				html: panels.html[ key ]
			} ) )
		},
		i18n: { tablist: __( 'Product details', 'b-blocks' ) }
	};

	const blockProps = useBlockProps();
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;

	return <>
		<Settings { ...props } isPremium={ isPremium } />

		<div { ...blockProps }>
			{ !isPreview && !wooActive && <p className={ `${ BOX }-notice` }>
				{ __( 'WooCommerce is not active. This block shows nothing until it is.', 'b-blocks' ) }
			</p> }

			{ !isPreview && wooActive && !hasContext && <p className={ `${ BOX }-notice` }>
				{ __( 'No product here: on this page the block shows nothing. Use it in the Single Product template or in a product loop; this is sample content.', 'b-blocks' ) }
			</p> }

			{ !isPreview && failed && <p className={ `${ BOX }-notice` }>
				{ __( 'This product could not be loaded here (it may be unpublished): this is sample content.', 'b-blocks' ) }
			</p> }

			{ !isPreview && !enabled.length && <p className={ `${ BOX }-notice` }>
				{ __( 'Enable at least one tab: with all of them off, the block shows nothing on the page.', 'b-blocks' ) }
			</p> }

			{ !isPreview && !!autoHidden.length && <p className={ `${ BOX }-notice` }>
				{ sprintf(
					/* translators: %s: Tab names, comma-separated. */
					__( 'This product has nothing for: %s. WooCommerce leaves those tabs out, so the block does too.', 'b-blocks' ),
					autoHidden.map( ( { key } ) => panels.titles[ key ] ).join( ', ' )
				) }
			</p> }

			<div>
				<Style attributes={ attributes } id={ uid } isBackend={ true } />

				{ loading ? <Spinner /> : <Details attributes={ previewAttributes } isBackend={ true } /> }
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