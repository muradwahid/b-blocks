import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from 'react';

import { tabController } from '../../../../Components/utils/functions';

import Settings from './Settings';
import Style from './Style';
import TDViewer from './TDViewer';
import { toggleAttr } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { sourceType, model, modelLink, isTouchMove, isZoom, loadingType } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const bBlocks3DViewer = useRef(null);

	useEffect(() => {
		bBlocks3DViewer.current.innerHTML = '';

		const reInitModel = document.createElement('model-viewer');
		toggleAttr(reInitModel, true, 'src', 'upload' === sourceType ? model?.url : modelLink);
		toggleAttr(reInitModel, true, 'alt', 'upload' === sourceType ? model?.title : '');
		toggleAttr(reInitModel, isTouchMove, 'camera-controls', '');
		toggleAttr(reInitModel, !isZoom, 'disable-zoom', '');
		toggleAttr(reInitModel, true, 'loading', loadingType);
		toggleAttr(reInitModel, true, 'auto-rotate', '');

		bBlocks3DViewer.current.appendChild(reInitModel);
	}, [sourceType, model, modelLink, isTouchMove, isZoom, loadingType]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocks3DViewer-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			{'upload' === sourceType && !model.url ? <p className='noModel'>{__('Please, upload Model or enter Model Link first!', '3d-viewer-block')}</p> : ''}

			<TDViewer attributes={attributes} ref={bBlocks3DViewer} />
		</div >
	</>;
};
export default Edit;