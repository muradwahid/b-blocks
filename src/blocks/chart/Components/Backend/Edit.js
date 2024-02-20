import { useEffect } from 'react';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import RenderChart from '../Common/RenderChart';

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