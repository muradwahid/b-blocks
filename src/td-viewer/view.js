import { useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import TDViewer from './Components/Common/TDViewer';

document.addEventListener('DOMContentLoaded', () => {
	const tdViewerEls = document.querySelectorAll('.wp-block-b-blocks-td-viewer');
	tdViewerEls.forEach(tDViewerEl => {
		const attributes = JSON.parse(tDViewerEl.dataset.attributes);

		createRoot(tDViewerEl).render(<>
			<Style attributes={attributes} id={tDViewerEl.id} />

			<RenderTDViewer attributes={attributes} />
		</>);

		tDViewerEl?.removeAttribute('data-attributes');
	});
});

const RenderTDViewer = ({ attributes }) => {
	const tdViewerRef = useRef(null);

	return <TDViewer attributes={attributes} ref={tdViewerRef} />
}