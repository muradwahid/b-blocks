import { useEffect } from 'react';
import { InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { layout, columns } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocksServices-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isBackend={true} />

			<div className={`bBlocksServices ${layout} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				<InnerBlocks allowedBlocks={['b-blocks/service']} template={[['b-blocks/service'], ['b-blocks/service'], ['b-blocks/service']]} />
			</div>
		</div>
	</>;
};
export default Edit;