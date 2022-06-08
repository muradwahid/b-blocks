import { useEffect } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocksRow-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksRow'>
				<InnerBlocks allowedBlocks={['b-blocks/column']} template={[['b-blocks/column'], ['b-blocks/column'], ['b-blocks/column']]} />
			</div>
		</div>
	</>;
};
export default Edit;