import { useEffect } from 'react';
const $ = jQuery;

import { tabController } from '../../../../Components/utils/functions';

import Settings from './Settings';
import Style from './Style';
import { textillateConfig } from './utils/config';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	useEffect(() => {
		$(`#bBlocksAnimatedText-${clientId} .content`).textillate(textillateConfig(attributes));
	}, [loop, animateIn, inEffect, inSequence, outEffect, outSequence, content]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksAnimatedText-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksAnimatedText'>
				<p className='content'>{content}</p>
			</div>
		</div>
	</>;
};
export default Edit;