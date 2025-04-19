import style from './Components/Common/style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const navigationEls = document.querySelectorAll('.wp-block-b-blocks-navigation');
	navigationEls.forEach((navigationEl) => {
		const attributes = JSON.parse(navigationEl.dataset.attributes);

		const styleEl = document.createElement('style');
		styleEl.innerHTML = style(attributes, navigationEl.id);
		navigationEl.prepend(styleEl);

		navigationEl?.removeAttribute('data-attributes');
	});
});
