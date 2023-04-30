import { render } from 'react-dom';

import './style.scss';
import Style from './Style';
import AnimatedText from './AnimatedText';

// Animated Text
document.addEventListener('DOMContentLoaded', () => {
	const allAnimatedText = document.querySelectorAll('.wp-block-b-blocks-animated-text');
	allAnimatedText.forEach(animatedText => {
		const attributes = JSON.parse(animatedText.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<AnimatedText attributes={attributes} clientId={attributes.cId} />
		</>, animatedText);

		animatedText?.removeAttribute('data-attributes');
	});
});