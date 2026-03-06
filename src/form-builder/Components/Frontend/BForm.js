import React, { useEffect, useRef, useState } from 'react';
import { useWPAjax } from "../../../../../bpl-tools/hooks";
import { useErrorMessages } from '../hooks/useErrorMessages';
import { LoadingIcon } from '../../utils/icons';

const BForm = ({ children, attributes, isFrontend = false }) => {
	const { form, button, termsConditions, message, formId, postId, formOptions, styles } = attributes;
	const { navigation } = button;
	const isShowSuccessMsg = !isFrontend && message.isShowDemoSuccess;
	const isShowErrorMsg = !isFrontend && message.isShowDemoError;

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const nonce = window.bBlocksCursorDataConfig?.nonce
	const { data, saveData: submit, error, isLoading, isError } = useWPAjax('b_form_submit', { _nonce: nonce }, false);

	const formRef = useRef('');
	useErrorMessages(error, isError, formRef, form.formType);

	useEffect(() => {
		if (error && error?.message?.includes('Something went wrong')) {
			setShowErrorMessage(true);
		}
		if (data) {
			setShowSuccessMessage(true);
			formRef.current.reset();
			if (formOptions.isRedirect) {
				if (formOptions.redirectUrl && !formOptions.redirectPrevious) {
					setTimeout(() => {
						window.location.href = formOptions.redirectUrl;
					}, 500);
				} else if (formOptions.redirectPrevious) {
					setTimeout(() => {
						window.history.back();
					}, 1000);
				}else{
					window.location.href = '/';
				}
			}

		}
	}, [error, isLoading, data])

	const handleSubmit = (e) => {
		e.preventDefault();
		const formEl = e.target;
		let errors = [];
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);
		const fields = Object.keys(data);
		const getErrorEl = (name) => {
			const el = formEl.querySelector(`.b-blocks-input-field-validation-${name}`);
			if (!el) return;
			const isValid = JSON.parse(el.dataset.iserror);
			if (isValid) {
				el.classList.add('b-blocks-input-field-error-container');
				return name;
			} else {
				if (error) {
					return;
				}
				el.classList.remove('b-blocks-input-field-error-container');
			}
		}

		fields.forEach(field => {
			const formError = getErrorEl(field);
			formError && errors.push(formError);
		});

		if (errors.length > 0) {
			setShowErrorMessage(true);
			return;
		}

		submit({ ...data, type: form.formType, current_post_id: postId, formId });
	}


	return <div className="b-blocks-b-form-wrapper">
		<form onSubmit={handleSubmit} className="b-blocks-b-form-container" ref={formRef}>
			{children}
			{(termsConditions.show && form.formType === 'register') && (
				<div className="b-blocks-b-form-termsConditionWrapper">
					<label className="b-blocks-b-form-checkbox-container">
						<input type="checkbox" required />
						<span className="b-blocks-b-form-checkmark"></span>
					</label>
					{/* <input type="checkbox" name="checkbox" required /> */}
					<label className="b-blocks-b-blocks-termsConditionWrapper-first">{termsConditions.label.first}</label>
					<a className="b-blocks-b-blocks-termsConditionWrapper-link" href={termsConditions.url}>{termsConditions.label.second}</a>
				</div>
			)}
			<div className="b-blocks-form-button-wrapper">
				<button className='b-blocks-form-submitBtn' type="submit">{button.button.text} {(isLoading && isFrontend) && <LoadingIcon className='b-form-button-loading-spinner' />} {(!isFrontend && styles.buttonStyle.spinner.isDemo) && <LoadingIcon className='b-form-button-loading-spinner' />} </button>
				{(navigation.isNavigation && (navigation.first.text || navigation.second.text)) && <div className="b-blocks-form-button-navigation-wrapper"><p className="b-blocks-form-button-navigation-text">{navigation.first.text}</p> <a className="b-blocks-form-button-navigation-link" href={navigation.second.url}>{navigation.second.text}</a> </div>}
			</div>
		</form>

		{(showSuccessMessage && message.success.successFulRegistration) && <div className="b-blocks-b-form-success-message">
			<span>{message.success.successFulRegistration}</span>
		</div>}
		{isShowSuccessMsg && <div className="b-blocks-b-form-success-message">
			<span>{message.success.successFulRegistration}</span>
		</div>}

		{(showErrorMessage && message.error.default) && <div className="b-blocks-b-form-error-message">
			<span>{message.error.default}</span>
		</div>}
		{isShowErrorMsg && <div className="b-blocks-b-form-error-message">
			<span>{message.error.default}</span>
		</div>}
	</div>
}
export default BForm;