import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const { alignment } = attributes;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-woo-mini-cart' } );

	return <>
		<BlockControls>
			<AlignmentControl
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'left' } ) }
			/>
		</BlockControls>

		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/woo-mini-cart'
					attributes={ attributes }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-wmc-ssr-loading'>
							<Spinner />
							{ __( 'Loading mini cart…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
