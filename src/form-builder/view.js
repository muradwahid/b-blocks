import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import Frontend from './Components/Frontend/Frontend';

document.addEventListener('DOMContentLoaded', () => {

	document.querySelectorAll('.wp-block-b-blocks-form-builder').forEach(bFormEl => {
		let attributes = {};
		try {
			const raw = bFormEl.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('B Form: Invalid attributes JSON', e);
		}

		const templateEl = bFormEl.querySelector('template#bFormPhpGetContent');
		if (!templateEl) return;

		bFormEl.innerHTML = '';
		createRoot(bFormEl).render(
			<>
				<Style attributes={attributes} id={bFormEl.id} />
				<Frontend attributes={attributes} templateContent={templateEl.content} />
			</>
		);

		bFormEl.removeAttribute('data-attributes');
		bFormEl.removeAttribute('data-content');
	});
});