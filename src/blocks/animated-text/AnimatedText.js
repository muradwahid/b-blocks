import { useEffect } from 'react';
import { textillateConfig } from './utils/config';
const $ = jQuery;

const AnimatedText = ({ attributes, clientId }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content } = attributes;

	useEffect(() => {
		$(`#bBlocksAnimatedText-${clientId} .content`).textillate(textillateConfig(attributes));
	}, [loop, animateIn, inEffect, inSequence, outEffect, outSequence]);

	return <div className='bBlocksAnimatedText'>
		<p className='content'>{content}</p>
	</div>
}
export default AnimatedText