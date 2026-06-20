import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const { contentAlign } = attributes;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-product-carousel' } );

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={ contentAlign }
				onChange={ ( val ) => setAttributes( { contentAlign: 'center' === val ? 'center' : 'left' } ) }
				alignmentControls={ [
					{ icon: 'editor-alignleft', title: __( 'Align left', 'b-blocks' ), align: 'left' },
					{ icon: 'editor-aligncenter', title: __( 'Align center', 'b-blocks' ), align: 'center' }
				] }
			/>
		</BlockControls>

		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-product-carousel'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-wpc-ssr-empty'>
							{ __( 'No products found for the current settings.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wpc-ssr-loading'>
							<Spinner />
							{ __( 'Loading product carousel…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
