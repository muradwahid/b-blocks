import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import { fullscreenIcon, zoomInIcon, zoomOutIcon, cameraIcon, downloadIcon } from '../../utils/icons';

// Everything shown on top of the model. Rendered inside <model-viewer> (as children on the frontend, through a portal in the editor).
const Overlay = ({ attributes, viewer }) => {
	const { sourceType, model, modelLink, isZoom, isProgressBar = true, isLoadingPercent = false, animationName = '', isAnimationSelector = false, variantName = '', isVariantSelector = false, isFullscreen = false, isZoomBtns = false, isScreenshotBtn = false, isDownloadBtn = false } = attributes;

	// Only http(s) links, so a saved javascript: URL can never run from the download button.
	const src = sanitizeURL('upload' === sourceType ? model?.url : modelLink, ['http:', 'https:']);

	const [progress, setProgress] = useState(0);
	const [animations, setAnimations] = useState([]);
	const [variants, setVariants] = useState([]);
	const [animation, setAnimation] = useState(animationName);
	const [variant, setVariant] = useState(variantName);

	useEffect(() => setAnimation(animationName), [animationName]);
	useEffect(() => setVariant(variantName), [variantName]);

	useEffect(() => {
		if (!viewer) return;

		const onProgress = e => setProgress(e.detail.totalProgress);
		const onLoad = () => {
			setAnimations(viewer.availableAnimations || []);
			setVariants(viewer.availableVariants || []);
		};

		viewer.addEventListener('progress', onProgress);
		viewer.addEventListener('load', onLoad);

		return () => {
			viewer.removeEventListener('progress', onProgress);
			viewer.removeEventListener('load', onLoad);
		};
	}, [viewer]);

	// The bundled model-viewer (1.x) has no zoom(), so move the camera closer or farther along its current orbit.
	const onZoom = scale => {
		const { theta, phi, radius } = viewer.getCameraOrbit();
		viewer.cameraOrbit = `${theta}rad ${phi}rad ${radius * scale}m`;
	};

	const onFullscreen = () => {
		viewer.ownerDocument.fullscreenElement ? viewer.ownerDocument.exitFullscreen() : viewer.requestFullscreen?.().catch(() => { });
	};

	const onScreenshot = () => {
		const link = document.createElement('a');
		link.href = viewer.toDataURL('image/png');
		link.download = `${model?.title || 'model'}.png`;
		link.click();
	};

	return <>
		{!isProgressBar && <div slot='progress-bar'></div>}

		{isLoadingPercent && 0 < progress && 1 > progress && <span className='bBlocks3DViewerPercent'>{Math.round(progress * 100)}%</span>}

		{((isAnimationSelector && 1 < animations.length) || (isVariantSelector && 0 < variants.length)) && <div className='bBlocks3DViewerSelectors'>
			{isAnimationSelector && 1 < animations.length && <select aria-label={__('Animation', 'b-blocks')} value={animation || animations[0]} onChange={e => {
				setAnimation(e.target.value);
				viewer.animationName = e.target.value;
				viewer.play();
			}}>
				{animations.map(name => <option key={name} value={name}>{name}</option>)}
			</select>}

			{isVariantSelector && 0 < variants.length && <select aria-label={__('Variant', 'b-blocks')} value={variant} onChange={e => {
				setVariant(e.target.value);
				viewer.variantName = e.target.value || null;
			}}>
				<option value=''>{__('Default', 'b-blocks')}</option>
				{variants.map(name => <option key={name} value={name}>{name}</option>)}
			</select>}
		</div>}

		{(isFullscreen || (isZoom && isZoomBtns) || isScreenshotBtn || (isDownloadBtn && src)) && <div className='bBlocks3DViewerBtns'>
			{isFullscreen && <button type='button' className='bBlocks3DViewerBtn' title={__('Fullscreen', 'b-blocks')} aria-label={__('Fullscreen', 'b-blocks')} onClick={onFullscreen}>{fullscreenIcon}</button>}

			{isZoom && isZoomBtns && <>
				<button type='button' className='bBlocks3DViewerBtn' title={__('Zoom in', 'b-blocks')} aria-label={__('Zoom in', 'b-blocks')} onClick={() => onZoom(0.8)}>{zoomInIcon}</button>
				<button type='button' className='bBlocks3DViewerBtn' title={__('Zoom out', 'b-blocks')} aria-label={__('Zoom out', 'b-blocks')} onClick={() => onZoom(1.25)}>{zoomOutIcon}</button>
			</>}

			{isScreenshotBtn && <button type='button' className='bBlocks3DViewerBtn' title={__('Save screenshot', 'b-blocks')} aria-label={__('Save screenshot', 'b-blocks')} onClick={onScreenshot}>{cameraIcon}</button>}

			{isDownloadBtn && src && <a className='bBlocks3DViewerBtn' href={src} download title={__('Download 3D model', 'b-blocks')} aria-label={__('Download 3D model', 'b-blocks')}>{downloadIcon}</a>}
		</div>}
	</>;
}
export default Overlay;