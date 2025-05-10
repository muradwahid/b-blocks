import { createRoot } from 'react-dom/client';
import Style from './Components/Common/Style';
import './style.scss';
import Facebook from "./Components/Common/Facebook"

document.addEventListener('DOMContentLoaded', () => {
	const facebookPages = document.querySelectorAll('.wp-block-b-blocks-facebook-page');
	facebookPages.forEach(facebookPage => {
		const attributes = JSON.parse(facebookPage.dataset.attributes);
		createRoot(facebookPage).render(<>
			<Style attributes={attributes} id={facebookPage.id} />
			<Facebook attributes={attributes} />
		</>);

		facebookPage?.removeAttribute('data-attributes');
	});
});