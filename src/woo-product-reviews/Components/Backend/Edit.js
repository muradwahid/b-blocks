import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes } = props;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-product-reviews' } );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-product-reviews'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-wpr-ssr-empty'>
							{ __( 'Please select a product.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wpr-ssr-loading'>
							<Spinner />
							{ __( 'Loading product reviews…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
