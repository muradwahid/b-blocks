import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import HeroSection from './Components/Frontend/HeroSection';

document.addEventListener('DOMContentLoaded', () => {
	const heroEls = document.querySelectorAll('.wp-block-b-blocks-hero-section');

	heroEls.forEach((heroEl) => {
		const attributes = JSON.parse(heroEl.dataset.attributes);

		createRoot(heroEl).render(<>
			<Style attributes={attributes} id={heroEl.id} />

			<HeroSection attributes={attributes} id={heroEl.id} />
		</>);

		heroEl?.removeAttribute('data-attributes');
	});
});
