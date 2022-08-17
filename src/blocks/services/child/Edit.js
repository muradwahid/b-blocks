import { useEffect } from '@wordpress/element';

import Settings from './Settings';
import servicePattern from '../img/service-pattern.png';
import Style from './Style';
import Service from './Service';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { hoverBG } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => {
		'' === hoverBG.image.url && setAttributes({ hoverBG: { ...hoverBG, image: { url: servicePattern } } });
	}, [hoverBG]);

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksService-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<Service attributes={attributes} isBackend={true} custom={{ setAttributes }} />
		</div>
	</>;
};
export default Edit;