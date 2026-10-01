import { createRoot } from 'react-dom/client';

import './style.scss';
import ProductGrid from './Components/Frontend/ProductGrid';

const parse = (value, fallback) => {
	try {
		return JSON.parse(value);
	} catch (error) {
		return fallback;
	}
};

const mount = () => {
	document.querySelectorAll('.wp-block-b-blocks-woo-product-grid').forEach((el) => {
		const attributes = parse(el.dataset.attributes, null);
		if (!attributes) return;

		const nonce = parse(el?.dataset?.nonce, '');

		const ajaxUrl = el.dataset.ajaxUrl || '';

		const firstData = parse(el.dataset.firstProducts, {});

		createRoot(el).render(
			<ProductGrid firstData={firstData} ajaxUrl={ajaxUrl} nonce={nonce} attributes={attributes} id={el.id} />
		);

		el.removeAttribute('data-attributes');
		el.removeAttribute('data-nonce');
		el.removeAttribute('data-ajax-url');
		el.removeAttribute('data-first-products');
	});
};

if ('loading' === document.readyState) {
	document.addEventListener('DOMContentLoaded', mount);
} else {
	mount();
}