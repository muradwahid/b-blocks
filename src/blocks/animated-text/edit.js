import { useEffect } from '@wordpress/element';

import Settings from './Settings';
import Style from './Style';
import AnimatedText from './AnimatedText';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksAnimatedText-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<AnimatedText attributes={attributes} clientId={clientId} />
		</div>
	</>;
};
export default Edit;