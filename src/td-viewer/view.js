import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import TDViewer from './Components/Common/TDViewer';
import { toggleAttr } from './utils/functions';

document.addEventListener('DOMContentLoaded', () => {
	const allTDViewer = document.querySelectorAll('.wp-block-b-blocks-td-viewer');
	allTDViewer.forEach(tDViewer => {
		const attributes = JSON.parse(tDViewer.dataset.attributes);

		createRoot(tDViewer).render(<>
			<Style attributes={attributes} id={tDViewer.id} />

			<RenderTDViewer attributes={attributes} />
		</>);

		tDViewer?.removeAttribute('data-attributes');
	});
});

const RenderTDViewer = ({ attributes }) => {
	const { isTouchMove, isZoom } = attributes;

	const tdViewerRef = useRef(null);

	useEffect(() => {
		const model = document.querySelector(`.${tdViewerRef.current.classList[0]} .bBlocksModel`);
		toggleAttr(model, isTouchMove, 'camera-controls', '');
		toggleAttr(model, !isZoom, 'disable-zoom', '');
	}, [tdViewerRef.current]);

	return <TDViewer attributes={attributes} ref={tdViewerRef} />
}