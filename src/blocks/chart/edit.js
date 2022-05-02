import { useEffect } from '@wordpress/element';

import Settings from './Settings';
import Style from './Style';
import RenderChart from './RenderChart';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksChart-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<RenderChart attributes={attributes} clientId={clientId} isBackend={true} />
		</div>
	</>;
};
export default Edit;