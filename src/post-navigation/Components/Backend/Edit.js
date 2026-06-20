import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = ( props ) => {
	const { attributes } = props;

	const blockProps = useBlockProps( { className: 'wp-block-b-blocks-post-navigation' } );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block='b-blocks/post-navigation'
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className='bb-pn-ssr-empty'>
							{ __( 'Post Navigation renders on single-post views with an adjacent post. Preview a post to see it.', 'b-blocks' ) }
						</p>
					) }
					LoadingResponsePlaceholder={ () => (
						<p className='bb-pn-ssr-loading'>
							<Spinner />
							{ __( 'Loading post navigation…', 'b-blocks' ) }
						</p>
					) }
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
