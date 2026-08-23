import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import AudioPlayer from './Components/Frontend/AudioPlayer';

const initAudioPlayers = () => {
	const els = document.querySelectorAll('.wp-block-b-blocks-audio-player');

	els.forEach((el) => {
		if (!el.dataset.attributes) return;

		const attributes = JSON.parse(el.dataset.attributes);

		createRoot(el).render(<>
			<Style attributes={attributes} id={el.id} />

			<AudioPlayer attributes={attributes} />
		</>);

		el?.removeAttribute('data-attributes');
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAudioPlayers);
} else {
	initAudioPlayers();
}