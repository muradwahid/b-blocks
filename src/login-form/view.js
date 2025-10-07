import { createRoot } from 'react-dom/client';

import Form from './Components/Common/Form/Form';
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const loginFormEls = document.querySelectorAll(".wp-block-b-blocks-login-form");
	loginFormEls.forEach(loginFormEl => {
		const attributes = JSON.parse(loginFormEl.dataset.attributes);
		const { isLoggedIn, logoutUrl } = JSON.parse(loginFormEl.dataset.logged);
		const nonce = loginFormEl.dataset.nonce;
		createRoot(loginFormEl).render(!isLoggedIn ? <>
			<Style attributes={attributes} id={loginFormEl.id} />
			<Form attributes={attributes} nonce={nonce} />
		</> : <div><h3>You are already loggedin. <a className="bBlocksLogoutBtn" href={logoutUrl}>Logout</a></h3></div>);

		loginFormEl?.removeAttribute('data-attributes');
		loginFormEl?.removeAttribute('data-logged');
	});
});