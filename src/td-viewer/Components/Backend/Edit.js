import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../../../../bpl-tools/utils/functions';
import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Overlay from '../Common/Overlay';
import { toggleAttr } from '../../utils/functions';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { sourceType, model, modelLink, isTouchMove, isZoom, loadingType, isAutoRotate = true, autoplay = false, isAR = false, arMode = '', arPlacement = '', iosSrc = '', poster = '', reveal = '', rotationSpeed = '', autoRotateDelay = '', cameraOrbit = '', fieldOfView = '', interactionPrompt = '', animationName = '', variantName = '', environmentImage = '', environmentImageUrl = '', skyboxImage = '', exposure = '', shadowIntensity = '', shadowSoftness = '' } = attributes;

	useEffect(() => tabController(), [isSelected]);

	const tdViewerRef = useRef(null);
	const [viewer, setViewer] = useState(null);
	// The model these lists came from, so Settings never shows another model's lists (or none) while one is loading.
	const [modelInfo, setModelInfo] = useState({ animations: [], variants: [], src: '' });

	// Removing an attribute sets model-viewer's property to null, not back to its default, so a value becoming empty (or set again) re-creates the element.
	const emptyKey = [poster ? reveal : '', rotationSpeed, autoRotateDelay, fieldOfView, interactionPrompt, exposure, shadowIntensity, shadowSoftness].map(val => '' === val).join();

	// model-viewer is defined only in the parent window, not in the editor iframe, so it is created here with the parent document.
	useEffect(() => {
		tdViewerRef.current.innerHTML = '';

		const reInitModel = document.createElement('model-viewer');
		toggleAttr(reInitModel, true, 'src', 'upload' === sourceType ? model?.url : modelLink);
		toggleAttr(reInitModel, true, 'alt', 'upload' === sourceType ? model?.title : '');
		toggleAttr(reInitModel, isTouchMove, 'camera-controls', '');
		toggleAttr(reInitModel, !isZoom, 'disable-zoom', '');
		toggleAttr(reInitModel, true, 'loading', loadingType);
		toggleAttr(reInitModel, isAutoRotate, 'auto-rotate', '');
		toggleAttr(reInitModel, autoplay, 'autoplay', '');
		toggleAttr(reInitModel, isAR, 'ar', '');
		const arFirst = arMode || 'webxr';
		toggleAttr(reInitModel, isAR, 'ar-modes', [arFirst, ...['webxr', 'scene-viewer', 'quick-look'].filter(mode => mode !== arFirst)].join(' '));
		toggleAttr(reInitModel, isAR && arPlacement, 'ar-placement', arPlacement);
		const safeIosSrc = sanitizeURL(iosSrc, ['http:', 'https:']);
		toggleAttr(reInitModel, isAR && safeIosSrc, 'ios-src', safeIosSrc);

		tdViewerRef.current.appendChild(reInitModel);
		setViewer(reInitModel);
	}, [sourceType, model, modelLink, isTouchMove, isZoom, loadingType, isAutoRotate, autoplay, isAR, arMode, arPlacement, iosSrc, emptyKey]);

	// These change live on the same element, so dragging a slider does not reload the model.
	useEffect(() => {
		if (!viewer) return;

		const envImage = 'custom' === environmentImage ? environmentImageUrl : environmentImage;

		toggleAttr(viewer, poster, 'poster', poster);
		toggleAttr(viewer, poster && reveal, 'reveal', reveal);
		toggleAttr(viewer, '' !== rotationSpeed, 'rotation-per-second', `${rotationSpeed}deg`);
		toggleAttr(viewer, autoRotateDelay, 'auto-rotate-delay', autoRotateDelay);
		toggleAttr(viewer, cameraOrbit, 'camera-orbit', cameraOrbit);
		toggleAttr(viewer, '' !== fieldOfView, 'field-of-view', `${fieldOfView}deg`);
		toggleAttr(viewer, interactionPrompt, 'interaction-prompt', interactionPrompt);
		toggleAttr(viewer, animationName, 'animation-name', animationName);
		toggleAttr(viewer, variantName, 'variant-name', variantName);
		toggleAttr(viewer, envImage, 'environment-image', envImage);
		toggleAttr(viewer, skyboxImage, 'skybox-image', skyboxImage);
		toggleAttr(viewer, '' !== exposure, 'exposure', exposure);
		toggleAttr(viewer, '' !== shadowIntensity, 'shadow-intensity', shadowIntensity);
		toggleAttr(viewer, '' !== shadowSoftness, 'shadow-softness', shadowSoftness);
	}, [viewer, poster, reveal, rotationSpeed, autoRotateDelay, cameraOrbit, fieldOfView, interactionPrompt, animationName, variantName, environmentImage, environmentImageUrl, skyboxImage, exposure, shadowIntensity, shadowSoftness]);

	useEffect(() => {
		if (!viewer) return;

		const onLoad = () => setModelInfo({ animations: viewer.availableAnimations || [], variants: viewer.availableVariants || [], src: viewer.getAttribute('src') });
		viewer.addEventListener('load', onLoad);

		return () => viewer.removeEventListener('load', onLoad);
	}, [viewer]);

	// model-viewer listens for the end of a mouse drag (mouseup) on the parent window, but the release happens inside the editor iframe and never reaches it,
	// so the model kept turning with the mouse after the button was let go. Pass the release on to the parent window.
	useEffect(() => {
		const iframeDocument = viewer?.ownerDocument;
		if (!iframeDocument || iframeDocument === document) return;

		const onMouseUp = () => window.dispatchEvent(new MouseEvent('mouseup'));
		iframeDocument.addEventListener('mouseup', onMouseUp);

		return () => iframeDocument.removeEventListener('mouseup', onMouseUp);
	}, [viewer]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} modelInfo={{ ...modelInfo, loaded: modelInfo.src === ('upload' === sourceType ? model?.url : modelLink) }} tdViewerRef={tdViewerRef} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			{'upload' === sourceType && !model.url ? <p className='noModel'>{__('Please, upload Model or enter Model Link first!', 'b-blocks')}</p> : ''}

			{/* Only the wrapper: the effect above fills it, so a React-rendered <model-viewer> here would be thrown away. */}
			<div className={prefix} ref={tdViewerRef}></div>

			{viewer && createPortal(<Overlay attributes={attributes} viewer={viewer} />, viewer)}
		</div>
	</>;
};
export default Edit;