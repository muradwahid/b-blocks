import { createRoot } from 'react-dom/client';

import RegisterForm from './Components/Common/RegisterForm/RegisterForm';
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const registerFormEls = document.querySelectorAll('.wp-block-b-blocks-register-form');
	registerFormEls.forEach(registerFormEl => {
		const attributes = JSON.parse(registerFormEl.dataset.attributes);
		const nonce = registerFormEl.dataset.nonce;
		createRoot(registerFormEl).render(
			<>
				<Style attributes={attributes} id={registerFormEl.id} />
				<div className="wp-block-b-blocks-register-form-wrapper">
					<RegisterForm {...{ attributes, nonce }} isLoaderShow={false} />
				</div>
			</>
		);

		registerFormEl?.removeAttribute('data-attributes');
	});
});