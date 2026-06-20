/**
 * Newsletter Optin Block — frontend entry point.
 *
 * Progressively enhances the server-rendered <form>:
 *   1. Intercepts submit, validates the email client-side as a first pass.
 *   2. POSTs name/email + nonce to admin-ajax.php (action: bb_newsletter_optin).
 *   3. On success: hides the form and shows an aria-live success message,
 *      then moves focus to it so keyboard / screen-reader users are informed.
 *   4. On error: shows an assertive error message and returns focus to the
 *      email field. The form stays visible.
 *
 * Per-instance scoping with a `data-bb-no-init` guard prevents double-binding
 * if this file is included more than once on a page (e.g. block previews).
 */

import { __ } from '@wordpress/i18n';

import './style.scss';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());

const setStatus = (statusEl, message, type) => {
	if (!statusEl) {
		return;
	}
	statusEl.textContent = message;
	statusEl.classList.remove('is-success', 'is-error');
	statusEl.classList.add(type === 'success' ? 'is-success' : 'is-error');
	statusEl.setAttribute('role', type === 'success' ? 'status' : 'alert');
	statusEl.setAttribute('aria-live', type === 'success' ? 'polite' : 'assertive');
	statusEl.hidden = false;
};

const initBlock = (root) => {
	if (!root || root.getAttribute('data-bb-no-init') !== '1') {
		return;
	}
	root.setAttribute('data-bb-no-init', '0');

	const form = root.querySelector('.bb-no-form');
	const statusEl = root.querySelector('.bb-no-status');
	const emailInput = root.querySelector('.bb-no-input--email');
	const nameInput = root.querySelector('.bb-no-input--name');
	const button = root.querySelector('.bb-no-button');

	if (!form || !emailInput) {
		return;
	}

	const ajaxUrl = root.getAttribute('data-bb-no-ajax') || '';
	const nonce = root.getAttribute('data-bb-no-nonce') || '';
	// post_id is used server-side to resolve the recipient from saved block
	// attributes — the client never sends the recipient address directly.
	const postId = root.getAttribute('data-bb-no-post-id') || '0';
	const successText = root.getAttribute('data-bb-no-success') || '';

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const email = (emailInput.value || '').trim();
		const name = nameInput ? (nameInput.value || '').trim() : '';

		if (!isValidEmail(email)) {
			setStatus(statusEl, __('Please enter a valid email address.', 'b-blocks'), 'error');
			emailInput.focus();
			return;
		}

		if (!ajaxUrl) {
			setStatus(statusEl, __('Something went wrong. Please try again later.', 'b-blocks'), 'error');
			emailInput.focus();
			return;
		}

		if (button) {
			button.setAttribute('aria-disabled', 'true');
			button.disabled = true;
		}

		const body = new URLSearchParams();
		body.append('action', 'bb_newsletter_optin');
		body.append('_wpnonce', nonce);
		body.append('bb_no_email', email);
		body.append('bb_no_name', name);
		body.append('post_id', postId);

		window.fetch(ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res && res.success) {
					const successMessage =
						successText ||
						(res.data && res.data.message) ||
						__('Thank you for subscribing!', 'b-blocks');
					root.classList.add('is-submitted');
					setStatus(statusEl, successMessage, 'success');
					if (statusEl) {
						statusEl.focus();
					}
				} else {
					const errorMessage =
						(res && res.data && res.data.message) ||
						__('Subscription failed. Please try again.', 'b-blocks');
					setStatus(statusEl, errorMessage, 'error');
					if (button) {
						button.removeAttribute('aria-disabled');
						button.disabled = false;
					}
					emailInput.focus();
				}
			})
			.catch(() => {
				setStatus(statusEl, __('Network error. Please try again.', 'b-blocks'), 'error');
				if (button) {
					button.removeAttribute('aria-disabled');
					button.disabled = false;
				}
				emailInput.focus();
			});
	});
};

const initAll = () => {
	document.querySelectorAll('.wp-block-b-blocks-newsletter-optin').forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
