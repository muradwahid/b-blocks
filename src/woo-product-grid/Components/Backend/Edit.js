import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes } = props;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-product-grid' } );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-product-grid'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-wpg-ssr-empty'>
							{ __( 'No products found for the current settings.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wpg-ssr-loading'>
							<Spinner />
							{ __( 'Loading product grid…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
