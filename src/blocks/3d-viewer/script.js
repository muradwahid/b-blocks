import { render, useEffect, useRef } from '@wordpress/element';

import './style.scss';
import Style from './Style';
import TDViewer from './TDViewer';
import { toggleAttr } from './utils/functions';

// 3D Viewer
document.addEventListener('DOMContentLoaded', () => {
	const allTDViewer = document.querySelectorAll('.wp-block-b-blocks-td-viewer');
	allTDViewer.forEach(tDViewer => {
		const attributes = JSON.parse(tDViewer.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<RenderTDViewer attributes={attributes} />
		</>, tDViewer);

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