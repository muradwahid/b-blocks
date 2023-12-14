import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
const $ = jQuery;

import './style.scss';
import Style from './Style';
import { textillateConfig } from './utils/config';

document.addEventListener('DOMContentLoaded', () => {
	const allAnimatedText = document.querySelectorAll('.wp-block-b-blocks-animated-text');
	allAnimatedText.forEach(animatedText => {
		const attributes = JSON.parse(animatedText.dataset.attributes);
		const { cId } = attributes;

		createRoot(animatedText).render(<>
			<Style attributes={attributes} clientId={cId} />

			<AnimatedText attributes={attributes} clientId={cId} />
		</>);

		animatedText?.removeAttribute('data-attributes');
	});
});

const AnimatedText = ({ attributes, clientId }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content } = attributes;

	const contentSl = `#bBlocksAnimatedText-${clientId} .content`;

	useEffect(() => {
		const intersectionObserver = new IntersectionObserver((entries) => {
			if (entries[0].intersectionRatio <= 0) return;

			$(contentSl).textillate(textillateConfig(attributes));

			intersectionObserver.unobserve(entries[0].target); // Remove if use multiple
		});
		intersectionObserver.observe(document.querySelector(contentSl));
	}, [loop, animateIn, inEffect, inSequence, outEffect, outSequence]);

	return <div className='bBlocksAnimatedText'>
		<p className='content'>{content}</p>
	</div>
}