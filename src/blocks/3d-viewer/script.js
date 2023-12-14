import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import TDViewer from './TDViewer';
import { toggleAttr } from './utils/functions';

document.addEventListener('DOMContentLoaded', () => {
	const allTDViewer = document.querySelectorAll('.wp-block-b-blocks-td-viewer');
	allTDViewer.forEach(tDViewer => {
		const attributes = JSON.parse(tDViewer.dataset.attributes);

		createRoot(tDViewer).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<RenderTDViewer attributes={attributes} />
		</>);

		tDViewer?.removeAttribute('data-attributes');
	});
});

const RenderTDViewer = ({ attributes }) => {
	const { isTouchMove, isZoom } = attributes;

	const bBlocks3DViewer = useRef(null);

	useEffect(() => {
		const model = document.querySelector(`.${bBlocks3DViewer.current.classList[0]} .bBlocksModel`);
		toggleAttr(model, isTouchMove, 'camera-controls', '');
		toggleAttr(model, !isZoom, 'disable-zoom', '');
	}, [bBlocks3DViewer.current]);

	return <TDViewer attributes={attributes} ref={bBlocks3DViewer} />
}