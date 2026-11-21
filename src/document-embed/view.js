import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import DocumentEmbed from './Components/Frontend/DocumentEmbed';

const mount = () => {
	const embedEls = document.querySelectorAll('.wp-block-b-blocks-document-embed');

	embedEls.forEach((embedEl) => {
		if (!embedEl.dataset.attributes) return;

		const attributes = JSON.parse(embedEl.dataset.attributes);

		createRoot(embedEl).render(<>
			<Style attributes={attributes} id={embedEl.id} />

			<DocumentEmbed attributes={attributes} assetsUrl={window.bBlocksDocumentEmbed?.assetsUrl || ''} />
		</>);

		embedEl?.removeAttribute('data-attributes');
	});
};

'loading' === document.readyState ? document.addEventListener('DOMContentLoaded', mount) : mount();