import { createRoot } from 'react-dom/client';

import './style.scss';
// The View modal shows documents with the Document Embed viewer.
import '../document-embed/style.scss';
import Style from './Components/Common/Style';
import DocumentLibrary from './Components/Frontend/DocumentLibrary';

// Mounts every library on the page. Run at once when the script arrives late ("delay JavaScript" optimisers
// load it after the page has loaded, when DOMContentLoaded has already fired).
const mount = () => {
	const libraryEls = document.querySelectorAll('.wp-block-b-blocks-document-library');

	// Each library on the page keeps its list state in the address under its own key: dl1-…, dl2-…
	libraryEls.forEach((libraryEl, index) => {
		if (!libraryEl.dataset.attributes) return;

		const attributes = JSON.parse(libraryEl.dataset.attributes);

		createRoot(libraryEl).render(<>
			<Style attributes={attributes} id={libraryEl.id} />

			<DocumentLibrary attributes={attributes} assetsUrl={attributes.assetsUrl} urlKey={`dl${index + 1}`} />
		</>);

		libraryEl?.removeAttribute('data-attributes');
	});
};

'loading' === document.readyState ? document.addEventListener('DOMContentLoaded', mount) : mount();
