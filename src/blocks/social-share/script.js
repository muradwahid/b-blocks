import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';

// Social Share
document.addEventListener('DOMContentLoaded', () => {
	const allSocialShare = document.querySelectorAll('.wp-block-b-blocks-social-share');
	allSocialShare.forEach(socialShare => {
		const attributes = JSON.parse(socialShare.dataset.attributes);

		const socialShareStyle = document.querySelector(`#${socialShare.id} .socialShareStyle`);

		createRoot(socialShareStyle).render(<Style attributes={attributes} clientId={attributes.cId} />);

		socialShare?.removeAttribute('data-attributes');
	});
});