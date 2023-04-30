import { useState, useEffect } from 'react';

import Settings from './Settings';
import Style from './Style';
import FlipBoxes from './FlipBoxes';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksFlipBoxes-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<FlipBoxes attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
		</div>
	</>
};
export default Edit;