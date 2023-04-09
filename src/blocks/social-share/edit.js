import { useState, useEffect } from 'react';

import { tabController } from '../../../../Components/Helper/functions';

import Settings from './Settings';
import Style from './Style';
import SocialShare from './SocialShare';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const [activeIndex, setActiveIndex] = useState(0);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksSocialShare-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<SocialShare attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
		</div>
	</>;
};
export default Edit;