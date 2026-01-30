import style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const toggleContentEls = document.querySelectorAll('.wp-block-b-blocks-toggle-content');

	toggleContentEls.forEach((toggleContentEl) => {
		let attributes = {};
		try {
			attributes = JSON.parse(toggleContentEl.dataset.attributes || '{}');
		} catch (e) {
			attributes = {};
		}
		const styleEl = document.createElement('style');
		styleEl.innerHTML = style(attributes, toggleContentEl.id);
		toggleContentEl.prepend(styleEl);

		toggleContentEl.removeAttribute('data-attributes');

		const wrapper = toggleContentEl.querySelector('.b-blocks-toggle-content__wrapper');
		if (!wrapper) return;

		const switchEl = toggleContentEl.querySelector('[data-toggle-switch]');
		const leftLabel = toggleContentEl.querySelector('[data-toggle-target="a"]');
		const rightLabel = toggleContentEl.querySelector('[data-toggle-target="b"]');

		let isA = wrapper.classList.contains('is-a');
		if (!wrapper.classList.contains('is-a') && !wrapper.classList.contains('is-b')) {
			wrapper.classList.add('is-a');
			isA = true;	
		}

		const applyState = (nextIsA) => {
			isA = !!nextIsA;

			wrapper.classList.toggle('is-a', isA);
			wrapper.classList.toggle('is-b', !isA);

			if (switchEl) switchEl.classList.toggle('is-b', !isA);

			if (leftLabel) leftLabel.classList.toggle('is-active', !isA);
			if (rightLabel) rightLabel.classList.toggle('is-active', !isA);
		};

		const toggle = () => applyState(!isA);

		if (switchEl) {
			switchEl.addEventListener('click', (e) => {
				e.preventDefault();
				toggle();
			});
			switchEl.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggle();
				}
			});
		}

		if (leftLabel) {
			leftLabel.addEventListener('click', (e) => {
				e.preventDefault();
				applyState(true);
			});
			leftLabel.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					applyState(true);
				}
			});
		}

		if (rightLabel) {
			rightLabel.addEventListener('click', (e) => {
				e.preventDefault();
				applyState(false);
			});
			rightLabel.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					applyState(false);
				}
			});
		}

		applyState(isA);
	});
});
