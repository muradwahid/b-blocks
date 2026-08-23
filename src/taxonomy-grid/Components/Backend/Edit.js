import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled, Spinner } from '@wordpress/components';
import ServerSideRender from '../../../utils/ServerSideRender';

import Settings from './Settings';

const Edit = (props) => {
	const { attributes } = props;

	const blockProps = useBlockProps({ className: 'wp-block-b-blocks-taxonomy-grid' });

	return <>
		<Settings {...props} />

		<div {...blockProps}>
			<Disabled>
				<ServerSideRender
					block='b-blocks/taxonomy-grid'
					attributes={attributes}
					EmptyResponsePlaceholder={() => (
						<p className='bb-tg-ssr-empty'>
							{__('No taxonomy terms found for the current settings.', 'b-blocks')}
						</p>
					)}
					LoadingResponsePlaceholder={() => (
						<p className='bb-tg-ssr-loading'>
							<Spinner />
							{__('Loading taxonomy grid…', 'b-blocks')}
						</p>
					)}
				/>
			</Disabled>
		</div>
	</>;
};

export default Edit;
