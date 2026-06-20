/**
 * FAQ Block — frontend behavior.
 *
 * - Each question is a real <button> with aria-expanded toggled on click.
 * - aria-controls on the button points to the answer panel id.
 * - When `data-allow-multiple` is "0" (the default), opening one item
 *   closes the other open items in the same block.
 * - The initial open state is rendered server-side via the .is-open class
 *   so progressive enhancement works without JS.
 * - prefers-reduced-motion: the CSS max-height transition is suppressed
 *   in style.scss; here we still toggle the .is-open class instantly.
 * - No globals are leaked; every listener is scoped to its own wrapper.
 */
import './style.scss';

const setItemOpen = (item, open) => {
	if (!item) return;
	const button = item.querySelector('.bb-faq-question');
	const panel = item.querySelector('.bb-faq-answer');
	if (open) {
		item.classList.add('is-open');
	} else {
		item.classList.remove('is-open');
	}
	if (button) {
		button.setAttribute('aria-expanded', open ? 'true' : 'false');
	}
	if (panel) {
		panel.setAttribute('aria-hidden', open ? 'false' : 'true');
	}
};

const initBlock = (wrapper) => {
	if (!wrapper || wrapper.dataset.bbFaqInit === '1') return;
	wrapper.dataset.bbFaqInit = '1';

	const allowMultiple = wrapper.getAttribute('data-allow-multiple') === '1';

	const items = Array.from(wrapper.querySelectorAll('.bb-faq-item'));
	if (items.length === 0) return;

	items.forEach((item) => {
		const button = item.querySelector('.bb-faq-question');
		if (!button) return;

		button.addEventListener('click', (event) => {
			event.preventDefault();
			const isOpen = item.classList.contains('is-open');

			if (!allowMultiple) {
				items.forEach((other) => {
					if (other !== item) {
						setItemOpen(other, false);
					}
				});
			}

			setItemOpen(item, !isOpen);
		});
	});
};

const initAll = () => {
	const wrappers = document.querySelectorAll('.wp-block-b-blocks-faq-block');
	wrappers.forEach((wrapper) => initBlock(wrapper));
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
