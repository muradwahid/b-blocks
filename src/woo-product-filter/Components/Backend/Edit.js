import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes } = props;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-product-filter' } );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-product-filter'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-wpf-ssr-empty'>
							{ __( 'No filter sections are enabled.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wpf-ssr-loading'>
							<Spinner />
							{ __( 'Loading product filter…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
