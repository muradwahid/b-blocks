import { forwardRef, useState } from 'react';

import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import { prefix } from '../../utils/data';
import Overlay from './Overlay';

const TDViewer = ({ attributes }, ref) => {
	const { sourceType, model, modelLink, isTouchMove, isZoom, loadingType, poster = '', reveal = '', isAutoRotate = true, rotationSpeed = '', autoRotateDelay = '', cameraOrbit = '', fieldOfView = '', interactionPrompt = '', autoplay = false, animationName = '', variantName = '', environmentImage = '', environmentImageUrl = '', skyboxImage = '', exposure = '', shadowIntensity = '', shadowSoftness = '', isAR = false, arMode = '', arPlacement = '', iosSrc = '' } = attributes;

	const touchProps = isTouchMove ? { 'camera-controls': '' } : {};
	const zoomProps = isZoom ? {} : { 'disable-zoom': '' };

	const [viewer, setViewer] = useState(null);

	// An empty AR mode means WebXR first, the order used before this option existed.
	const arFirst = arMode || 'webxr';

	return <div className={prefix} ref={ref}>
		<model-viewer
			ref={setViewer}
			src={'upload' === sourceType ? model?.url : modelLink}
			alt={'upload' === sourceType ? model?.title : ''}
			loading={loadingType}
			{...(isAutoRotate ? { 'auto-rotate': '' } : {})}
			{...touchProps}
			{...zoomProps}
			poster={poster || undefined}
			reveal={(poster && reveal) || undefined}
			rotation-per-second={'' !== rotationSpeed ? `${rotationSpeed}deg` : undefined}
			auto-rotate-delay={autoRotateDelay || undefined}
			camera-orbit={cameraOrbit || undefined}
			field-of-view={'' !== fieldOfView ? `${fieldOfView}deg` : undefined}
			interaction-prompt={interactionPrompt || undefined}
			{...(autoplay ? { autoplay: '' } : {})}
			animation-name={animationName || undefined}
			variant-name={variantName || undefined}
			environment-image={('custom' === environmentImage ? environmentImageUrl : environmentImage) || undefined}
			skybox-image={skyboxImage || undefined}
			exposure={'' !== exposure ? exposure : undefined}
			shadow-intensity={'' !== shadowIntensity ? shadowIntensity : undefined}
			shadow-softness={'' !== shadowSoftness ? shadowSoftness : undefined}
			{...(isAR ? { ar: '', 'ar-modes': [arFirst, ...['webxr', 'scene-viewer', 'quick-look'].filter(mode => mode !== arFirst)].join(' '), 'ar-placement': arPlacement || undefined, 'ios-src': sanitizeURL(iosSrc, ['http:', 'https:']) || undefined } : {})}
		>
			<Overlay attributes={attributes} viewer={viewer} />
		</model-viewer>
	</div>
}
export default forwardRef(TDViewer);
