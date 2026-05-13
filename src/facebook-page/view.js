import { createRoot } from 'react-dom/client';
import Facebook from "./Components/Common/Facebook";
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	// view.js এর শুরুতে বা DOMContentLoaded এর ভেতরে
	// view.js এর শুরুতে
	if (!document.getElementById('facebook-jssdk')) {
		const js = document.createElement('script');
		js.id = 'facebook-jssdk';
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		document.body.appendChild(js);
	}

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