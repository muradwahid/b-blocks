import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import TDViewer from '../Common/TDViewer';
import { toggleAttr } from '../../utils/functions';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { sourceType, model, modelLink, isTouchMove, isZoom, loadingType } = attributes;

	useEffect(() => tabController(), [isSelected]);

	const tdViewerRef = useRef(null);

	useEffect(() => {
		tdViewerRef.current.innerHTML = '';

		const reInitModel = document.createElement('model-viewer');
		toggleAttr(reInitModel, true, 'src', 'upload' === sourceType ? model?.url : modelLink);
		toggleAttr(reInitModel, true, 'alt', 'upload' === sourceType ? model?.title : '');
		toggleAttr(reInitModel, isTouchMove, 'camera-controls', '');
		toggleAttr(reInitModel, !isZoom, 'disable-zoom', '');
		toggleAttr(reInitModel, true, 'loading', loadingType);
		toggleAttr(reInitModel, true, 'auto-rotate', '');

		tdViewerRef.current.appendChild(reInitModel);
	}, [sourceType, model, modelLink, isTouchMove, isZoom, loadingType]);

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			{'upload' === sourceType && !model.url ? <p className='noModel'>{__('Please, upload Model or enter Model Link first!', '3d-viewer-block')}</p> : ''}

			<TDViewer attributes={attributes} ref={tdViewerRef} />
		</div >
	</>;
};
export default Edit;