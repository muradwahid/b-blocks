import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { sanitizeHTML } from '../../../bpl-tools/utils/common';

import './style.scss';
import usePremium from '../hooks/usePremium';
import Button from './Components/Common/Button';
import Style from './Components/Common/Style';
import Popup from './Components/Frontend/Popup';

document.addEventListener('DOMContentLoaded', () => {
	const buttonEls = document.querySelectorAll('.wp-block-b-blocks-button');
	buttonEls.forEach(buttonEl => {
		const nonce = JSON.parse(buttonEl.dataset.nonce);
		const attributes = JSON.parse(buttonEl.dataset.attributes);
		const info = JSON.parse(buttonEl.dataset.info);

		const { popup = {} } = attributes;
		const { content = '' } = popup;

		createRoot(buttonEl).render(<>
			<Style attributes={attributes} id={buttonEl.id} />

			<RenderButton {...{ nonce, attributes, info, popupContent: <div className='content' dangerouslySetInnerHTML={{ __html: content }} /> }} />
		</>);

		buttonEl?.removeAttribute('data-attributes');
		buttonEl?.removeAttribute('data-nonce');
		buttonEl?.removeAttribute('data-info');
	});
});

const RenderButton = ({ nonce, attributes, info, popupContent }) => {
	const { text, actionType, security = 'none', target, url, securityRole } = attributes;
	const buttonEl = useRef(null);
	const [securityPass, setSecurityPass] = useState(false);
	const [securityPop, setSecurityPop] = useState(false);

	const { isPremium } = usePremium(nonce);

	useEffect(() => {
		window['AOS']?.init();
	}, []);

	return <>
		<Button attributes={attributes} security={security} securityPass={securityPass} setSecurityPass={setSecurityPass} securityPop={securityPop} isPremium={isPremium} Popup={securityPass ? Popup : null} popupContent={popupContent} ref={buttonEl} onClick={val => {
			if ('none' === security) {
				if (actionType === 'popup') {
					setSecurityPass(true);
				} else {
					window.open(url, target);
					setSecurityPass(false);
				}
			} else {
				if (security == 'login') {
					if (info.userRoles[0] === securityRole || securityRole === 'default') {
						setSecurityPass(true);
					} else {
						setSecurityPop(val);
					}
				} else if (security == 'password') {
					setSecurityPop(val)
				} else if (security == 'email') {
					setSecurityPop(val)
				}
			}
		}} >
			{text && <span className='btnText' dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />}
		</Button>

		{securityPop && <SecurityPopup attributes={attributes} info={info} setSecurityPop={setSecurityPop} setSecurityPass={setSecurityPass} />}
	</>
}

const SecurityPopup = ({ attributes, info, setSecurityPass, setSecurityPop }) => {
	const { actionType, security = 'none', target, url, securityRole, securityPassword } = attributes;
	const [passErrorMsg, setPassErrorMsg] = useState('Enter Password for Show Content');
	const [errorCheck, setErrorCheck] = useState(true);
	const [storePass, setStorePass] = useState('');
	const [storeEmail, setStoreEmail] = useState('');

	const onPasswordSubmit = () => {
		if (storePass == securityPassword) {
			if (actionType === 'popup') {
				setSecurityPass(true);
			} else {
				window.open(url, target);
				setSecurityPass(false)
			}
			setPassErrorMsg('Correct Password');
			setErrorCheck(true)
		} else {
			setSecurityPass(false)
			setPassErrorMsg('Incorrect Password');
			setErrorCheck(false)
		}
	}

	const emailSubmit = () => {
		jQuery('#submitButton').prop('disabled', true);
		setErrorCheck(true);
		jQuery.ajax({
			type: 'POST',
			// eslint-disable-next-line no-undef
			url: RestScriptVars.endpoint,
			data: {
				action: 'email_submit_from_user',
				email: storeEmail,
				postId: info.currentPostId

			},
			success(response) {
				if (response.data.status == true) {
					if (actionType === 'popup') {
						setSecurityPass(true);
					} else {
						window.open(url, target);
						setSecurityPass(false)
					}
					setSecurityPop(false)
					jQuery('#submitButton').prop('disabled', false);
				} else {
					setErrorCheck(false)
				}

			},
			// eslint-disable-next-line no-unused-vars
			error(xhr, status, error) {
				setErrorCheck(false)
				jQuery('#submitButton').prop('disabled', false);
			}
		});
	}

	return <>
		<div className='securityPopup'>
			{security == 'password' && <h2 className='popup_h2'>
				{errorCheck ? passErrorMsg : <span>Incorrect Password</span>}
			</h2>}
			{security == 'login' && <h2 className='popup_h2'>
				You have to login as <span>{securityRole}</span>
			</h2>}
			{security == 'email' && <h2 className='popup_h2'>
				{errorCheck ? 'Enter Your Email here' : <span>We got an error try with a new email</span>}
			</h2>}

			{security == 'password' && <>
				<div className='form-control'>
					<label htmlFor='passwordLabel'>Enter Password</label>
					<input value={storePass} onChange={c => { setStorePass(c.target.value) }} type='password' name='password' id='passwordLabel' />
				</div>
				<button type='button' onClick={onPasswordSubmit} className='button_ok password_button' >OK</button>
			</>
			}
			{security == 'email' && <>
				<div className='form-control'>
					<label htmlFor='emailLabel'>Enter Email</label>
					<input value={storeEmail} onChange={c => { setStoreEmail(c.target.value) }} type='email' name='email' id='emailLabel' />
				</div>
				<button type='button' onClick={emailSubmit} id='submitButton' className='button_ok password_button' >Submit</button>
			</>
			}

			{security == 'login' && <a href={info.loginURL} target='_blank' className='button_login' rel='noreferrer' >Login</a>}

			<button type='button' onClick={() => setSecurityPop(false)} className='close-overlay'>
				<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 384 512' fill='currentColor'>
					<path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z' />
				</svg>
			</button>
		</div>
	</>
}