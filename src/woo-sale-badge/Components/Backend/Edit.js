import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const { alignment } = attributes;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-sale-badge' } );

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'left' } ) }
			/>
		</BlockControls>

		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-sale-badge'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-wsb-ssr-empty'>
							{ __( 'Please select a product.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wsb-ssr-loading'>
							<Spinner />
							{ __( 'Loading sale badge…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
