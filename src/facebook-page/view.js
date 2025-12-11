import { createRoot } from 'react-dom/client';
import Facebook from "./Components/Common/Facebook";
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const facebookPages = document.querySelectorAll('.wp-block-b-blocks-facebook-page');
	facebookPages.forEach(facebookPage => {
		const attributes = JSON.parse(facebookPage.dataset.attributes);
		const facebookKey = facebookPage.dataset.facebookkey;
		if (!facebookKey) return;
		createRoot(facebookPage).render(<>
			<Style attributes={attributes} id={facebookPage.id} />
			<Facebook attributes={attributes} facebookKey={facebookKey} />
		</>);

		facebookPage?.removeAttribute('data-attributes');
		facebookPage?.removeAttribute('data-facebookkey');
	});
});