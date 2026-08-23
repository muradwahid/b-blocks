import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import FileDownloadCard from './Components/Frontend/FileDownloadCard';

document.addEventListener('DOMContentLoaded', () => {
	const cardEls = document.querySelectorAll('.wp-block-b-blocks-file-download-card');

	cardEls.forEach((cardEl) => {
		if (!cardEl.dataset.attributes) return;

		const attributes = JSON.parse(cardEl.dataset.attributes);

		createRoot(cardEl).render(<>
			<Style attributes={attributes} id={cardEl.id} />

			<FileDownloadCard attributes={attributes} />
		</>);

		cardEl?.removeAttribute('data-attributes');
	});
});
