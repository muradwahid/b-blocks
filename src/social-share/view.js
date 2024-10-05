import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const socialShareEls = document.querySelectorAll('.wp-block-b-blocks-social-share');
	socialShareEls.forEach(socialShareEl => {
		const attributes = JSON.parse(socialShareEl.dataset.attributes);

		const styleEl = document.querySelector(`#${socialShareEl.id} .${prefix}Style`);

		createRoot(styleEl).render(<Style attributes={attributes} id={socialShareEl.id} />);

		socialShareEl?.removeAttribute('data-attributes');
	});
});